const lesson = document.querySelector('#lesson');
const chapterNav = document.querySelector('#chapter-nav');
const progress = document.querySelector('#course-progress');
const glossaryList = document.querySelector('#glossary-list');
const glossarySearch = document.querySelector('#glossary-search');
const storageKey = 'sw-course-completed';
const routeLabels = ['사람', '차량', '돼지', '분뇨'];

function readProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    return new Set(Array.isArray(saved) ? saved.filter(index =>
      Number.isInteger(index) && index >= 0 && index < chapters.length
    ) : []);
  } catch {
    return new Set();
  }
}

const completed = readProgress();

function renderNavigation(activeIndex) {
  progress.textContent = `학습 완료 ${completed.size} / ${chapters.length}장`;
  chapterNav.innerHTML = chapters.map(({ title }, index) =>
    `<a href="#chapter-${index + 1}" ${index === activeIndex ? 'aria-current="page"' : ''}>
      <span>${String(index + 1).padStart(2, '0')}</span><strong>${title}</strong>
      ${completed.has(index) ? '<span aria-label="학습 완료">✓</span>' : ''}
    </a>`
  ).join('');
}

function renderTable([head, ...rows]) {
  return `<div class="course-table" role="region" aria-label="학습 표" tabindex="0"><table>
    <thead><tr>${head.map(cell => `<th scope="col">${cell}</th>`).join('')}</tr></thead>
    <tbody>${rows.map(([first, ...cells]) => `<tr><th scope="row">${first}</th>${cells.map(cell =>
      `<td>${cell}</td>`).join('')}</tr>`).join('')}</tbody>
  </table></div>`;
}

function renderFlow([name, nodes]) {
  return `<figure class="course-figure" data-course-motion><figcaption>${name}</figcaption><ol class="course-flow">${nodes.split('|')
    .map((node, step) => `<li style="--step:${step}">${node}</li>`).join('')}</ol></figure>`;
}

function renderMap([name, rooms, routes]) {
  const center = index => [68 + index % 5 * 134, 43 + Math.floor(index / 5) * 77];
  const shapes = rooms.map((room, index) => {
    const [x, y] = center(index);
    return `<rect x="${x - 60}" y="${y - 22}" width="120" height="44" rx="8" />
      <text x="${x}" y="${y}" dominant-baseline="central">${room}</text>`;
  }).join('');
  const lines = routes.map((route, index) => {
    const points = route.map(room => center(room).join(',')).join(' ');
    return `<polyline class="course-route route-${index}" points="${points}" />`;
  }).join('');
  return `<figure class="course-figure"><figcaption>${name}</figcaption>
    <div class="map-scroll" tabindex="0" role="region" aria-label="${name} 배치도">
      <svg class="course-map" viewBox="0 0 672 242" role="img" aria-label="${name} 개념 배치도"><g>${lines}</g>${shapes}</svg>
    </div>
    <ul class="map-key">${routes.map((route, index) => `<li class="route-${index}"><strong>${routeLabels[index]}</strong>
      ${route.map(room => rooms[room]).join(' → ')}</li>`).join('')}</ul></figure>`;
}

function renderChart([name, unit, values]) {
  const axisMax = Math.ceil(Math.max(...values.map(([, value]) => value)));
  return `<figure class="course-figure" data-course-motion><figcaption>${name}</figcaption>
    <p>${unit} · 0–${axisMax}</p><ul class="course-chart">${values.map(([label, value]) =>
      `<li><span>${label}</span><span class="bar-track"><i style="width:${value / axisMax * 100}%"></i></span>
      <strong>${value.toFixed(1)}</strong></li>`).join('')}</ul></figure>`;
}

const cardIcons = {
  pig: '<path d="M8 13 6 5l9 4a17 17 0 0 1 10 0l9-4-2 8a13 13 0 0 1 4 9c0 8-7 13-16 13S4 30 4 22a13 13 0 0 1 4-9Z"/><ellipse cx="20" cy="25" rx="8" ry="5"/><path d="M17 25h.1m5.9 0h.1M13 18h.1m13.9 0h.1"/>',
  calendar: '<rect x="6" y="9" width="28" height="26" rx="4"/><path d="M6 17h28M13 5v8m14-8v8m-14 13 5 4 9-9"/>',
  heart: '<path d="M20 34 7 21A8 8 0 0 1 20 12a8 8 0 0 1 13 9Z"/><path d="M12 22h5l3-5 3 5h5"/>',
  bottle: '<path d="M16 11V8l2-4h4l2 4v3m-9 5-3 5v11a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4V21l-3-5m-12-4h14v4H13zm5 12h4m-4 5h4"/>',
  feed: '<path d="M5 23h30l-6 11H11Zm5 0 5-8h10l5 8M20 15V6m0 5c4 0 6-2 7-5m-7 5c-4 0-6-2-7-5"/>',
  scale: '<rect x="5" y="8" width="30" height="26" rx="5"/><path d="M11 22a9 9 0 0 1 18 0Zm9 0 4-5"/>',
  truck: '<path d="M4 11h20v18H4zM24 17h7l5 6v6H24"/><circle cx="11" cy="30" r="4"/><circle cx="29" cy="30" r="4"/>',
  barn: '<path d="m4 17 16-9 16 9M7 16v18h26V16M15 34V22h10v12m-5-17h.1"/>',
  shield: '<path d="M20 5 34 11v8c0 8-5 12-14 16C11 31 6 27 6 19v-8Z"/><path d="m13 20 5 5 9-10"/>',
  water: '<path d="M20 5C15 13 9 19 9 25a11 11 0 0 0 22 0c0-6-6-12-11-20Z"/><path d="M14 25c0 3 2 5 5 6"/>'
};

const lifeCards = [
  ['후보돈', '첫 교배 준비', '체형과 다리 상태 확인', 'pig'],
  ['교배', '발정 확인 후', '교배 시각 기록', 'heart'],
  ['임신', '약 114일', '임신 확인·체형 관리', 'calendar'],
  ['분만', '태어날 때 1~2kg', '초유·보온 확인', 'pig'],
  ['포유', '약 3~4주', '젖 먹는지 확인', 'bottle'],
  ['이유', '생후 21~28일', '물과 사료 섭취 확인', 'feed'],
  ['육성', '약 20~60kg', '체중과 환기 확인', 'scale'],
  ['비육', '약 60~115kg', '사료 사용량 확인', 'feed'],
  ['출하', '약 110~115kg', '휴약기간과 체중 확인', 'truck']
];

const facilityCards = [
  ['관리동·방역실', '사람이 들어오는 곳', '샤워 후 작업복과 장화 교체', 'shield'],
  ['격리사', '새로 들어온 돼지', '기존 돼지와 떨어져 관찰', 'shield'],
  ['후보돈사·임신사', '번식 준비와 임신', '체형과 임신 상태 확인', 'calendar'],
  ['분만사', '출산과 젖 먹이기', '새끼가 따뜻한지 확인', 'bottle'],
  ['자돈사·육성사·비육사', '젖 뗀 뒤 출하까지', '사료·물·체중 확인', 'barn'],
  ['사료빈·출하대', '사료 반입과 돼지 인계', '외부 차량과 만나는 곳 확인', 'truck'],
  ['저장조·퇴비사', '분뇨 저장과 처리', '분뇨 작업 동선 분리', 'water']
];

function renderPictureCards(cards, theme) {
  return `<ol class="picture-grid ${theme}" data-course-motion>${cards.map(([title, metric, action, icon], step) =>
    `<li class="picture-card" style="--step:${step}">
      <svg viewBox="0 0 40 40" aria-hidden="true">${cardIcons[icon]}</svg>
      <h4>${title}</h4><strong>${metric}</strong><p>${action}</p>
    </li>`).join('')}</ol>`;
}

function renderVisualChapter(index, chapter) {
  const life = index === 1;
  return `<section class="lesson-block visual-lesson">
    <h3>${life ? '성장 단계 한눈에 보기' : '농장 구조 한눈에 보기'}</h3>
    ${life ? `<h4 class="picture-group-heading">모돈의 번식</h4>
      ${renderPictureCards(lifeCards.slice(0, 3), 'breeding-cards')}
      <h4 class="picture-group-heading">자돈의 성장과 출하</h4>
      ${renderPictureCards(lifeCards.slice(3), 'growth-cards')}
      <p class="picture-caption">분만 후 모돈은 포유·이유를 거쳐 다음 번식을 준비합니다. 일령과 체중은 교육용 대표값입니다.</p>` :
      `<figure class="farm-hero-map">
        <a href="farm-layout.png" target="_blank" rel="noopener noreferrer" aria-label="재래식 증축형 양돈장 배치도 원본을 새 탭에서 크게 보기">
          <img src="farm-layout.png" width="1536" height="1024" alt="항공사진형 양돈장 구조도. 아래쪽에 주출입구와 방역실, 중앙에 번식·분만 시설, 왼쪽에 자돈·육성·비육 시설, 오른쪽 위에 분뇨 처리시설이 배치되어 있습니다.">
        </a>
        <figcaption><div><strong>재래식·증축형 양돈장</strong><small>첨부 예시 · 모돈 3,000두 기준</small></div>
          <a class="course-button" href="farm-layout.png" target="_blank" rel="noopener noreferrer">그림 크게 보기 ↗</a>
        </figcaption>
      </figure>
      <ul class="reference-routes" aria-label="첨부 구조도 동선 범례">
        <li style="--route:#b53029">돼지</li><li style="--route:#1b5b9e">사람</li><li style="--route:#2b7135">사료</li>
        <li style="--route:#a84d08">분뇨</li><li style="--route:#222">출하 차량</li>
      </ul>
      <h4 class="picture-group-heading">시설별로 하는 일</h4>
      ${renderPictureCards(facilityCards, 'facility-cards')}`}
  </section>
  <details class="lesson-block course-details"><summary>${life ? '단계별 체중·일령·질병 자세히 보기' : '시설 역할표와 다른 농장 배치 보기'}</summary>
    ${renderLessonDetails(chapter)}
    ${life ? '' : `<p class="course-note">동시 사육 3,000두 배치도는 농장 전체 돼지를 셉니다. 위 항공사진형 예시의 3,000두는 어미돼지 수입니다.</p>
      ${chapter.maps.map(renderMap).join('')}`}
  </details>`;
}

function renderLessonDetails(chapter) {
  return `${chapter.learn.split('\n').map(line => {
    const [level, body] = line.split(' | ');
    return `<p><strong class="course-level">${level}</strong> ${body}</p>`;
  }).join('')}
  ${renderTable(chapter.tables)}
  ${chapter.detail ? `<p class="course-note">${chapter.detail}</p>` : ''}`;
}

function renderOverview(index, chapter) {
  return `<section class="lesson-block visual-lesson"><h3>핵심 내용 한눈에 보기</h3>
    ${renderPictureCards(visualOverviews[index], 'topic-cards')}
  </section>
  <section class="lesson-block visual-lesson"><h3>${chapter.chart ? '그래프로 이해하기' : '흐름을 그림으로 보기'}</h3>
    ${(chapter.flows || []).map(renderFlow).join('')}
    ${chapter.chart ? renderChart(chapter.chart) : ''}
  </section>
  <details class="lesson-block course-details"><summary>실무 설명과 상세 표 보기</summary>
    ${renderLessonDetails(chapter)}
  </details>`;
}

const sowInputs = [
  ['weaned', '복당 이유두수', '두', 10.25, 0, 30, 0.01],
  ['weaningAge', '이유일령', '일', 25, 1, 90, 1],
  ['survival', '이유 후 출하 비율', '%', 84.375, 0, 100, 0.001],
  ['price', '돼지 도체 경락가', '원/kg', 5574, 0, 50000, 1],
  ['weight', '평균 도체중', 'kg/두', 88, 1, 200, 0.1],
  ['cost', '출하 1두당 전체 사육비', '원/두', 412000, 0, 2000000, 1],
  ['otherDays', '임신·포유 외 기간', '일/복', 28, 0, 365, 1]
];

function sowProfit({ weaned, weaningAge, survival, price, weight, cost, otherDays }) {
  const litters = 365 / (114 + weaningAge + otherDays);
  const psy = litters * weaned;
  const msy = psy * survival / 100;
  const revenue = msy * weight * price;
  return { litters, psy, msy, revenue, cost: msy * cost, profit: revenue - msy * cost };
}

const sowNumber = new Intl.NumberFormat('ko-KR', { maximumFractionDigits: 2 });
const sowMoney = new Intl.NumberFormat('ko-KR', { maximumFractionDigits: 0 });

function renderSowCalculator() {
  return `<section class="lesson-block visual-lesson sow-calculator" aria-labelledby="sow-heading">
    <h3 id="sow-heading">어미돼지 1마리, 1년 손익</h3>
    <div class="sow-benchmark">
      <strong>2025년 국내 자료로 환산하면 약 153만원</strong>
      <p>모돈당 연간 출하 18.9두 × 비육돈 1두당 순수익 81,000원 = 1,530,900원. 서로 다른 두 조사 수치를 곱한 참고 추정치입니다.</p>
      <a href="https://www.koreapork.or.kr/board/notice_view?Ncode=pignews&amp;number=51517">한돈팜스 출하두수 ↗</a>
      <a href="https://mods.go.kr/board.es?act=view&amp;bid=227&amp;list_no=445127&amp;mid=a10301080600">국가데이터처 순수익·사육비 ↗</a>
    </div>
    <h4 class="picture-group-heading">우리 농장 조건으로 계산하기</h4>
    <p>시세 기본값은 2026년 11월 16일 다봄 돼지 경락가 <strong>5,574원/kg</strong>입니다. 전국 등외·제주 제외 기준이며, <a href="https://www.ekapepia.com/v3/web/main.do?userGroup=producer">다봄에서 최근 시세 확인 ↗</a> 후 단가 칸에 입력할 수 있습니다.</p>
    <form id="sow-form">
      <div class="sow-inputs">
        ${sowInputs.map(([name, label, unit, value, min, max, step]) => `<label>
          <span>${label}</span><span class="sow-input-line">
            <input name="${name}" type="number" inputmode="${step === 1 ? 'numeric' : 'decimal'}"
              value="${value}" min="${min}" max="${max}" step="${step}" required><small>${unit}</small>
          </span></label>`).join('')}
      </div>
      <p id="sow-error" role="status" hidden>빈칸을 채우고 입력 범위와 소수 자릿수를 확인해 주세요.</p>
      <div class="sow-results" aria-live="polite" aria-atomic="true">
        <div class="sow-total"><span>입력 조건 기준 · 연간 예상 손익</span><strong data-sow="profit">—</strong></div>
        <div><span>연 이유두수 · PSY</span><strong data-sow="psy">—</strong></div>
        <div><span>연 출하두수 · MSY</span><strong data-sow="msy">—</strong></div>
        <div><span>연 매출 추정</span><strong data-sow="revenue">—</strong></div>
        <div><span>연 사육비 추정</span><strong data-sow="cost">—</strong></div>
      </div>
      <button class="course-button" type="reset">기본값으로 돌아가기</button>
    </form>
    <details class="sow-method">
      <summary>계산식과 기본값의 뜻</summary>
      <ul>
        <li>연간 분만 횟수 = 365 ÷ (임신 114일 + 이유일령 + 임신·포유 외 일수). 현재 연 <strong id="sow-litters">—</strong>복.</li>
        <li>연 이유두수 = 연간 분만 횟수 × 복당 이유두수. 연 출하두수 = 연 이유두수 × 이유 후 출하 비율.</li>
        <li>연 손익 = 연 출하두수 × (평균 도체중 × 경락가 − 출하 1두당 전체 사육비).</li>
      </ul>
      <p>번식 기본값은 한돈팜스 PSY 22.4두·MSY 18.9두에 가깝게 맞춘 모델 가정입니다. 임신·포유 외 기간에는 이유 후 교배까지와 번식 지연에 해당하는 기간이 들어갑니다. 이유일령을 바꾸면 분만 횟수가 바뀝니다. 이유두수·출하 비율·사육비에도 변화가 있다면 해당 값을 따로 조정하세요.</p>
      <p>도체중 88kg은 교육용 가정입니다. 사육비 기본값은 2025년 조사 비육돈 1두당 412,000원입니다. 경락가로 구한 매출은 거래처 정산·수수료를 반영하기 전 추정치입니다. 출하를 기준으로 나눈 농장 전체 사육비를 입력하면 모돈 비용의 이중 계산을 피할 수 있습니다.</p>
    </details>
  </section>`;
}

function setupSowCalculator() {
  const form = document.querySelector('#sow-form');
  const error = document.querySelector('#sow-error');
  const outputs = form.querySelectorAll('[data-sow]');
  const litters = document.querySelector('#sow-litters');
  function update() {
    const valid = form.checkValidity();
    error.hidden = valid;
    const values = Object.fromEntries(sowInputs.map(([name]) => [name, form.elements[name].valueAsNumber]));
    const results = valid ? sowProfit(values) : {};
    for (const output of outputs) {
      const key = output.dataset.sow;
      const isCount = key === 'psy' || key === 'msy';
      output.textContent = valid ? (isCount ? sowNumber.format(results[key]) + '두' : sowMoney.format(results[key]) + '원') : '—';
    }
    litters.textContent = valid ? sowNumber.format(results.litters) : '—';
  }
  form.addEventListener('input', update);
  form.addEventListener('reset', () => queueMicrotask(update));
  form.addEventListener('submit', event => event.preventDefault());
  update();
}

const motionObserver = typeof IntersectionObserver === 'function' ? new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('course-motion-active');
    motionObserver.unobserve(entry.target);
  });
}, { threshold: 0.25 }) : null;

function renderLesson(index) {
  const chapter = chapters[index];
  const visualChapter = index === 1 || index === 2;
  motionObserver?.disconnect();
  renderNavigation(index);
  lesson.innerHTML = `
    <header class="lesson-heading">
      <span class="course-label">${index + 1}장 / ${chapters.length}장</span>
      <h2>${chapter.title}</h2>
      <p>${chapter.why}</p>
    </header>
    ${index === 8 ? renderSowCalculator() : ''}
    ${visualChapter ? renderVisualChapter(index, chapter) : renderOverview(index, chapter)}
    <section class="lesson-block"><h3>국내 현장 사례</h3><p>${chapter.case}</p></section>
    <section class="lesson-block"><h3>현장 체크리스트</h3><ul class="course-checks">
      ${chapter.check.map(text => `<li><label><input type="checkbox"> ${text}</label></li>`).join('')}
    </ul></section>
    <section class="lesson-block lesson-summary"><h3>한 페이지 요약</h3><p>${chapter.recap}</p>
      <button type="button" class="course-button" id="print-summary">이 장 요약 인쇄</button>
    </section>
    <section class="lesson-block"><h3>이해도 퀴즈 5문항</h3>
      <ol class="course-quiz">${chapter.quiz.map(([question, answer]) =>
        `<li><details><summary>${question}</summary><p><strong>답</strong> ${answer}</p></details></li>`).join('')}</ol>
    </section>
    <details class="lesson-block course-details"><summary>강의용 슬라이드 구성</summary>
      <ol>${chapter.slides.split('|').map(text => `<li>${text}</li>`).join('')}</ol>
    </details>
    <details class="lesson-block course-details"><summary>참고자료</summary>
      <ul>${chapter.refs.map(ref => {
        const [name, url] = sources[ref];
        return `<li><a href="${url}" target="_blank" rel="noopener noreferrer">${name} ↗</a></li>`;
      }).join('')}</ul>
    </details>
    <nav class="lesson-actions" aria-label="장 이동">
      ${index > 0 ? `<a class="course-button" href="#chapter-${index}">← 이전 장</a>` : ''}
      <button type="button" class="course-button" id="finish-lesson" aria-pressed="${completed.has(index)}">${completed.has(index) ? '완료 표시 해제' : '학습 완료 표시'}</button>
      ${index < chapters.length - 1 ? `<a class="course-button next" href="#chapter-${index + 2}">다음 장 →</a>` : '<a class="course-button next" href="#glossary">용어사전 →</a>'}
    </nav>`;

  if (index === 8) setupSowCalculator();
  if (motionObserver && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    lesson.querySelectorAll('[data-course-motion]').forEach(figure => motionObserver.observe(figure));
  }
  document.querySelector('#finish-lesson').addEventListener('click', event => {
    if (completed.has(index)) completed.delete(index);
    else completed.add(index);
    try {
      localStorage.setItem(storageKey, JSON.stringify([...completed]));
    } catch {
      // Progress remains available while the page is open.
    }
    event.currentTarget.textContent = completed.has(index) ? '완료 표시 해제' : '학습 완료 표시';
    event.currentTarget.setAttribute('aria-pressed', String(completed.has(index)));
    renderNavigation(index);
  });
  document.querySelector('#print-summary').addEventListener('click', () => window.print());
}

function showCurrentChapter(scroll) {
  const match = /^#chapter-(\d+)$/.exec(location.hash);
  if (!match) {
    if (!lesson.hasChildNodes()) renderLesson(0);
    return;
  }
  const index = Number(match[1]) - 1;
  if (!chapters[index]) {
    if (!lesson.hasChildNodes()) renderLesson(0);
    return;
  }
  renderLesson(index);
  if (scroll) {
    lesson.focus({ preventScroll: true });
    lesson.scrollIntoView();
  }
}

function renderGlossary() {
  const query = glossarySearch.value.trim().toLowerCase();
  const matching = glossary.filter(entry => entry.join(' ').toLowerCase().includes(query));
  glossaryList.innerHTML = matching.map(([term, meaning]) =>
    `<div><dt>${term}</dt><dd>${meaning}</dd></div>`).join('');
  glossaryList.hidden = matching.length === 0;
  document.querySelector('#glossary-empty').hidden = matching.length > 0;
}

const glossaryEmpty = document.createElement('p');
glossaryEmpty.id = 'glossary-empty';
glossaryEmpty.textContent = '검색 결과가 없습니다.';
glossaryEmpty.setAttribute('role', 'status');
glossaryList.after(glossaryEmpty);
glossarySearch.addEventListener('input', renderGlossary);
window.addEventListener('hashchange', () => showCurrentChapter(true));
showCurrentChapter(Boolean(location.hash));
renderGlossary();
