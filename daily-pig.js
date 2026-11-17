(() => {
  const cases = [
    { mood:'bright', icon:'☀', tag:'활력 관찰', title:'건강 상태를 어떻게 살필까요?', observation:'가상 돼지가 일어나 움직이고 사료를 찾습니다. 평소 행동을 알아두면 변화를 더 빨리 발견할 수 있습니다.', action:'먹는 양과 움직임, 호흡, 분변을 매일 확인하고 평소와 다른 점을 기록합니다.', chapter:7 },
    { mood:'tired', icon:'💧', tag:'설사 관찰', title:'묽은 변이 보인다면?', observation:'가상 돼지의 변이 묽고 평소보다 활력이 떨어져 보입니다. 설사는 여러 원인으로 생길 수 있습니다.', action:'발생한 시각과 마릿수, 물을 마시는지와 돈방 환경을 확인해 기록하고 담당 수의사와 상의합니다.', chapter:7 },
    { mood:'cough', icon:'≈', tag:'호흡 관찰', title:'기침이 늘면 어떻게 할까요?', observation:'가상 돼지가 기침하는 모습입니다. 기침만으로 특정 질병이라고 판단할 수는 없습니다.', action:'기침하는 돼지의 수와 시작 시각, 환기와 온도 변화를 기록해 담당 수의사에게 전달합니다.', chapter:7 },
    { mood:'warm', icon:'☀', tag:'보온 관리', title:'자돈이 웅크리면 무엇을 볼까요?', observation:'가상 자돈들이 몸을 붙이고 웅크려 있습니다. 추위나 다른 불편이 있는지 살펴볼 상황입니다.', action:'자돈 높이의 온도와 찬바람, 보온 공간의 작동 상태를 확인하고 자돈의 행동을 함께 살핍니다.', chapter:4 },
    { mood:'water', icon:'💧', tag:'급수 관리', title:'물이 잘 나오는지 볼까요?', observation:'가상 돼지가 급수기 주변을 자주 찾아갑니다. 실제로 물을 마실 수 있는지 살펴보세요.', action:'급수기의 작동과 누수, 물 접근을 확인하고 음수량과 돼지의 상태 변화를 함께 기록합니다.', chapter:5 },
    { mood:'feed', icon:'🌾', tag:'급이 관리', title:'사료를 덜 먹으면 무엇을 볼까요?', observation:'가상 돼지가 평소보다 사료를 적게 먹습니다. 사료, 급수, 환경과 건강을 함께 확인해야 합니다.', action:'급이기와 급수기의 작동, 사료 상태, 돈방 온도와 돼지의 활력을 확인하고 변화를 기록합니다.', chapter:5 },
    { mood:'tired', icon:'✚', tag:'걸음 관찰', title:'절뚝거리면 어떻게 살필까요?', observation:'가상 돼지가 한쪽 다리를 조심스럽게 디디고 있습니다. 원인은 다리나 발굽, 바닥 상태 등 다양합니다.', action:'발생 시각과 개체, 발굽과 바닥 상태를 살피고 담당 수의사에게 관찰 내용을 전달합니다.', chapter:7 }
  ];
  const parts = new Intl.DateTimeFormat('en-US', { timeZone:'Asia/Seoul', year:'numeric', month:'2-digit', day:'2-digit' });
  const more = [
    ['warm','돈사 온도는 어디서 재나요?','벽의 온도계와 자돈이 누운 자리의 온도가 다릅니다.','돼지 높이와 실제로 머무는 자리에서 측정하고, 행동과 함께 기록합니다.',4],
    ['feed','사료를 바꿀 때 무엇을 기록할까요?','새 사료가 들어온 뒤 섭취량을 비교하려고 합니다.','변경 날짜와 돈군, 섭취량과 분변 변화를 기록합니다.',5],
    ['water','물 사용량이 늘면 무엇부터 볼까요?','급수 기록이 어제보다 크게 올랐습니다.','누수 여부와 실제 음수 행동을 확인하고 이전 기록과 비교합니다.',5],
    ['tired','활력이 떨어진 돼지는 어떻게 기록할까요?','한 마리가 평소보다 덜 움직입니다.','개체와 돈방, 처음 본 시간, 섭취·호흡의 변화를 기록해 수의사와 상의합니다.',7],
    ['bright','증상이 있는 돼지 수는 어떻게 셀까요?','옆 돈방에서도 비슷한 변화가 보입니다.','돈방별 전체 마릿수와 증상이 보인 마릿수를 따로 적습니다.',7],
    ['bright','차량과 작업자의 동선을 왜 나눌까요?','출하차와 작업자가 같은 길을 쓰고 있습니다.','농장 밖에서 들어오는 차량과 내부 작업 동선이 교차하는 곳을 찾아 방역 기준에 맞게 관리합니다.',8],
    ['bright','사료효율을 비교할 때 무엇을 맞출까요?','두 돈군의 사료 사용량을 비교합니다.','같은 기간의 사료 사용량과 체중 증가를 함께 비교하고 돈군 범위를 확인합니다.',9],
    ['bright','센서 경보가 울리면 무엇을 할까요?','온도 센서에서 경보가 왔습니다.','돈방의 실제 온도와 설비 상태를 확인하고 조치 내용을 기록합니다.',10],
    ['bright','시설 배치도에서 무엇을 표시할까요?','농장의 이동 경로를 처음 그립니다.','작업자와 돼지, 차량의 이동 경로와 인계 지점을 표시합니다.',3]
  ].map(([mood,title,observation,action,chapter]) => ({mood,title,observation,action,chapter}));
  const groups = [[cases[3],cases[4],cases[5],...more.slice(0,3)],
    [cases[0],cases[1],cases[2],cases[6],...more.slice(3,5)], more.slice(5)];
  let lastDay = '', questions = [], index = 0;
  const prev = document.querySelector('#pig-prev');
  const next = document.querySelector('#pig-next');
  const pig = document.querySelector('#pig-talk');
  function render() {
    const item = questions[index];
    document.querySelector('#pig-count').textContent = `${index + 1} / ${questions.length}`;
    prev.disabled = index === 0;
    next.disabled = index === questions.length - 1;
    document.querySelector('.dialog-answer').open = false;
    document.querySelector('#daily-pig-title').textContent = item.title;
    document.querySelector('#daily-pig-observation').textContent = item.observation;
    document.querySelector('#daily-pig-action').textContent = item.action;
    document.querySelector('#daily-pig-link').href = `course.html#chapter-${item.chapter}`;
    pig.dataset.mood = item.mood;
    window.dispatchEvent(new CustomEvent('daily-pig-change', { detail: item }));
  }
  function update() {
    const p = Object.fromEntries(parts.formatToParts(new Date()).map(({type,value}) => [type,value]));
    const day = `${p.year}-${p.month}-${p.day}`;
    if (day === lastDay) return;
    lastDay = day;
    const serial = Date.parse(day) / 86400000;
    questions = groups.flatMap((group, i) =>
      Array.from({length: i === 2 ? 1 : 2}, (_, offset) => group[((serial * 2 + Math.floor(serial / 3) + offset) % group.length + group.length) % group.length]));
    index = 0;
    document.querySelector('#daily-pig-date').textContent = day;
    render();
  }
  prev.onclick = () => { if (index > 0) { index--; render(); } };
  next.onclick = () => { if (index < questions.length - 1) { index++; render(); } };
  const name = document.querySelector('#pig-name');
  const display = document.querySelector('#pig-name-display');
  const status = document.querySelector('#pig-name-status');
  const storageKey = 'sw-pig-name';
  try { name.value = localStorage.getItem(storageKey) || ''; } catch {}
  display.textContent = name.value || '아기돼지';
  document.querySelector('#pig-name-form').addEventListener('submit', event => {
    event.preventDefault();
    name.value = name.value.trim();
    display.textContent = name.value || '아기돼지';
    try {
      localStorage.setItem(storageKey, name.value);
      status.textContent = name.value ? '이 브라우저에 저장했습니다.' : '기본 이름으로 돌아갔습니다.';
    } catch { status.textContent = '브라우저에 저장할 수 없습니다.'; }
  });

  const speech = document.querySelector('#pig-speech');
  const lines = [
    '{name} 등장! 꿀꿀 두 번이면 인사 끝!',
    '코가 왜 납작하냐고요? 바닥 수색에 딱 좋아요!',
    '오늘의 운동은 낮잠 자리까지 세 걸음!',
    '이 꼬리 보셨죠? 열심히 말아 올렸어요.',
    '사진 찍어요? 왼쪽 볼이 더 동그래요!',
    '제 발자국은 작지만 존재감은 큽니다. 꿀!',
    '방금 그건 배에서 난 소리예요. 제가 한 말은 아니에요.',
    '오늘의 패션은 앞발 두 짝, 뒷발 두 짝!',
    '눈 감고 열까지 세면 낮잠 시작! 하나… 쿨쿨.',
    '{name}의 개인기! 귀 한쪽만 쫑긋!',
    '제가 길을 잃으면 코부터 따라가 주세요.',
    '사료통 소리는 저 멀리서도 들려요. 이상하죠?',
    '친구랑 코를 맞댔어요. 우리끼리는 그게 하이파이브예요!',
    '시원한 자리 발견! 제 옆도 비워 뒀어요.',
    '진흙이 발에 묻었어요. 오늘은 무늬 양말이에요!',
    '발소리만 듣고도 간식 시간이 아닌 건 알겠어요. 아쉽네요!',
    '제 꼬리가 느낌표처럼 펴지면 진짜 깜짝 놀란 거예요!',
    '제일 멋진 표정 해 볼게요. 잠깐, 코부터 닦고요!',
    '{name}에게 한 표 주세요. 낮잠 경연 대회에 나갈 거예요!',
    '오늘 연습한 인사예요. 안녕히 가세요, 꿀꾸르륵!'
  ];
  let nextLine = 0;
  pig.addEventListener('click', () => {
    speech.textContent = lines[nextLine].replace('{name}', () => display.textContent);
    nextLine = (nextLine + 1) % lines.length;
  });

  update();
  window.setInterval(update, 60000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) update(); });
})();
