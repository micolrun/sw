const articles = [
  { category: 'disease', label: '질병 관리', type: 'HEALTH', title: '호흡기 증상 관찰과 초기 대응', summary: '기침·호흡 이상이 보일 때 돈군별로 확인하고 기록할 항목', stage: '전 단계', points: ['증상이 처음 확인된 돈방과 시각을 기록합니다.', '기침, 호흡 곤란, 식욕 변화와 폐사 여부를 돈군별로 확인합니다.', '이동과 접촉 범위를 관리하고 담당 수의사에게 관찰 내용을 전달합니다.'] },
  { category: 'disease', label: '질병 관리', type: 'HEALTH', title: '설사 발생 시 현장 점검', summary: '발생 돈군과 환경·급이 변화를 함께 살펴보는 점검 순서', stage: '포유·이유자돈', points: ['발생 일령, 돈방, 개체 수와 탈수 징후를 기록합니다.', '급이·급수·온도 변화 및 최근 이동 이력을 확인합니다.', '원인 감별과 검사 필요성은 담당 수의사와 상의합니다.'] },
  { category: 'disease', label: '질병 관리', type: 'BIOSECURITY', title: '농장 차단방역 기본 동선', summary: '사람·차량·물품의 출입과 오염 구역을 구분하는 운영 항목', stage: '농장 전체', points: ['출입 목적과 방문 이력을 기록합니다.', '구역별 전용 장화·작업복과 세척·소독 절차를 점검합니다.', '의심 상황에서는 농장 방역 담당자와 수의사의 지시에 따라 이동을 관리합니다.'] },
  { category: 'management', label: '사양 관리', type: 'FEEDING', title: '이유 전후 급이·급수 점검', summary: '전환기 섭취량과 급수 접근성을 확인하는 일상 체크 항목', stage: '이유자돈', points: ['사료 교체 일정과 실제 섭취 변화를 기록합니다.', '급수기 작동, 높이, 접근성과 물 공급 상태를 확인합니다.', '섭취 저하가 이어지면 환경과 건강 상태를 함께 점검합니다.'] },
  { category: 'management', label: '사양 관리', type: 'ENVIRONMENT', title: '돈사 환경 일일 점검', summary: '온·습도, 환기, 바닥 상태를 기록할 때 놓치기 쉬운 부분', stage: '전 단계', points: ['돈 높이에서 체감되는 온도와 공기 흐름을 확인합니다.', '습기, 결로, 분진, 냄새와 바닥 상태를 함께 기록합니다.', '설정값과 실제 돈군 행동의 차이를 비교합니다.'] },
  { category: 'management', label: '사양 관리', type: 'PERFORMANCE', title: '생산 성적 기록의 기본', summary: '돈군별 폐사율, 증체, 사료 사용량을 같은 기준으로 비교하기', stage: '육성·비육돈', points: ['기간과 대상 돈군을 먼저 고정합니다.', '입식·이동·폐사·출하 기록의 누락을 확인합니다.', '수치 변화는 사료·환경·질병 기록과 함께 해석합니다.'] },
  { category: 'news', label: '업계 소식', type: 'UPDATE', title: '정책·방역 공지 확인', summary: '농림축산식품부와 국가가축방역통합시스템 공식 공지 바로가기', stage: '공식 채널', points: ['농림축산식품부의 정책·보도자료를 확인합니다.', '국가가축방역통합시스템에서 발생정보를 확인합니다.', '게시일과 적용 지역을 확인한 후 농장 조치에 반영합니다.'] },
  { category: 'market', label: '시세·통계', type: 'DATA', title: '돼지 가격 확인 가이드', summary: '가격의 기준일·단위·품질 기준을 함께 읽는 방법', stage: '공식 채널', points: ['공식 가격 자료의 발표일과 수집 시각을 구분합니다.', '단위와 거래 단계가 같은 수치끼리 비교합니다.', '농장 의사결정에 사용할 때는 최신 원자료를 다시 확인합니다.'] }
];

const cardGrid = document.querySelector('#card-grid');
const search = document.querySelector('#search');
const count = document.querySelector('#result-count');
const empty = document.querySelector('#empty-state');
const dialog = document.querySelector('#detail-dialog');
const dialogContent = document.querySelector('#dialog-content');
let activeFilter = 'all';

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
}

function renderCards() {
  const term = search.value.trim().toLocaleLowerCase('ko');
  const visible = articles.map((article, index) => ({ ...article, index })).filter(article =>
    (activeFilter === 'all' || article.category === activeFilter) &&
    `${article.title} ${article.summary} ${article.label} ${article.stage}`.toLocaleLowerCase('ko').includes(term)
  );
  cardGrid.innerHTML = visible.map(article => `
    <article class="content-card">
      <div class="card-top"><span class="tag ${article.category}">${article.label}</span><span class="card-type">${article.type}</span></div>
      <h3>${escapeHtml(article.title)}</h3><p>${escapeHtml(article.summary)}</p>
      <div class="card-footer"><span>${escapeHtml(article.stage)} · 현장 점검</span><button type="button" data-article="${article.index}" aria-label="${escapeHtml(article.title)} 자세히 보기">자세히 보기 ↗</button></div>
    </article>`).join('');
  count.textContent = `자료 ${visible.length}건`;
  empty.hidden = visible.length > 0;
}

function setFilter(filter) {
  activeFilter = filter;
  document.querySelectorAll('.filter').forEach(button => {
    const selected = button.dataset.filter === filter;
    button.classList.toggle('active', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
  renderCards();
}

document.querySelectorAll('.filter').forEach(button => button.addEventListener('click', () => setFilter(button.dataset.filter)));
search.addEventListener('input', renderCards);
document.querySelectorAll('[data-jump-filter]').forEach(link => link.addEventListener('click', () => { search.value = ''; setFilter(link.dataset.jumpFilter); }));
cardGrid.addEventListener('click', event => {
  const button = event.target.closest('[data-article]');
  if (!button) return;
  const article = articles[Number(button.dataset.article)];
  dialogContent.innerHTML = `<span class="tag ${article.category}">${article.label}</span><h2 id="dialog-title">${escapeHtml(article.title)}</h2><p>${escapeHtml(article.summary)}</p><ul>${article.points.map(point => `<li>${escapeHtml(point)}</li>`).join('')}</ul><div class="dialog-note">이 자료는 현장 점검을 위한 개요입니다. 진단·치료 및 약품 사용은 담당 수의사와 상의하세요.</div><div class="dialog-status">콘텐츠 상태: 초안 · 전문가 검토 예정</div>`;
  dialog.showModal();
});
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });

const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('#mobile-menu');
menuToggle.addEventListener('click', () => {
  const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!expanded));
  menuToggle.setAttribute('aria-label', expanded ? '메뉴 열기' : '메뉴 닫기');
  mobileMenu.hidden = expanded;
});
mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  mobileMenu.hidden = true;
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', '메뉴 열기');
}));
renderCards();

const digestButtons = [...document.querySelectorAll('[data-digest-filter]')];
const digestCards = document.querySelectorAll('[data-digest-topic]');
digestButtons.forEach(button => button.addEventListener('click', () => {
  const topic = button.dataset.digestFilter;
  digestButtons.forEach(option => option.setAttribute('aria-pressed', String(option === button)));
  digestCards.forEach(card => { card.hidden = topic !== 'all' && card.dataset.digestTopic !== topic; });
}));

const featuredVideos = [
  ['j8ybtZXVZG8', '한돈협회 11월 월례브리핑'],
  ['kMTF36-vyKs', '이유 후 사고를 줄이기 위한 과학적 접근'],
  ['RQGofjBc90I', '청년 축산인이 만들어가는 스마트축산'],
  ['iEnN3kvYSSs', '후보돈 관리와 모돈 기록 관리'],
  ['BkuI13ehqqI', '축산농가에 AI가 들어오면 생기는 변화'],
  ['yXVJRm4laGY', '이유 후 육성률을 높이는 과제'],
  ['TWZFHu7cJ3A', '저탄소 농업 프로그램 모바일 이행증빙 가이드']
];
const videoDate = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Seoul' });
const videoTitle = document.querySelector('#daily-video-title');
const videoStage = document.querySelector('#daily-video');
const youtubeLink = document.querySelector('#daily-youtube-link');
let displayedVideoDate;

function featuredVideoForDate(now) {
  const date = videoDate.format(now);
  const days = Math.round((Date.parse(date) - Date.UTC(2026, 10, 17)) / 86400000);
  return featuredVideos[(days % featuredVideos.length + featuredVideos.length) % featuredVideos.length];
}

function renderDailyVideo() {
  const now = new Date();
  const date = videoDate.format(now);
  if (date === displayedVideoDate || videoStage.querySelector('iframe')) return;
  displayedVideoDate = date;
  const [id, title] = featuredVideoForDate(now);
  videoTitle.textContent = title;
  youtubeLink.href = `https://www.youtube.com/watch?v=${id}`;
  videoStage.innerHTML = `<button type="button" class="video-cover" aria-label="${escapeHtml(title)} 재생">
    <img src="https://i.ytimg.com/vi/${id}/hqdefault.jpg" alt="" width="480" height="360" loading="lazy">
    <span>▶ 영상 재생</span></button>`;
  videoStage.querySelector('button').addEventListener('click', () => {
    videoStage.innerHTML = `<iframe title="${escapeHtml(title)}" src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1"
      allow="autoplay; encrypted-media; picture-in-picture" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;
    videoStage.querySelector('iframe').focus();
  });
}

renderDailyVideo();
window.setInterval(renderDailyVideo, 60000);

const homeUpdates = [
  ['핵심 양돈 질병을 그림 용어로 보기', 'course.html?glossary=%EC%A7%88%EB%B3%91#glossary'],
  ['사료비·인건비를 바꿔 농장 원가 계산', 'course.html#chapter-12'],
  ['다봄 산지시세로 모돈 한 마리의 손익 계산', 'course.html#chapter-9'],
  ['피그앤포크 한돈뉴스 주요 기사 요약', '#news'],
  ['오늘의 한돈TV 영상 보기', '#daily-show']
];
const updatesBar = document.querySelector('.updates-bar');
const updateLink = document.querySelector('#update-link');
const updateToggle = document.querySelector('#update-toggle');
const updateNext = document.querySelector('#update-next');
let updateIndex = 0;
let updatesPaused = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function showNextUpdate() {
  updateIndex = (updateIndex + 1) % homeUpdates.length;
  const [label, href] = homeUpdates[updateIndex];
  updateLink.href = href;
  updateLink.innerHTML = `<span class="updates-slide">${label}</span><span aria-hidden="true"> →</span>`;
}

function showUpdateToggle() {
  updateToggle.textContent = updatesPaused ? '재생' : '멈춤';
  updateToggle.setAttribute('aria-label', updatesPaused ? '업데이트 자동 전환 시작' : '업데이트 자동 전환 멈춤');
}

updateToggle.addEventListener('click', () => {
  updatesPaused = !updatesPaused;
  showUpdateToggle();
});
updateNext.addEventListener('click', showNextUpdate);
showUpdateToggle();
window.setInterval(() => {
  if (!updatesPaused && !updatesBar.matches(':hover, :focus-within')) showNextUpdate();
}, 8000);
