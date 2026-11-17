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
  let lastDay = '';
  function update() {
    const p = Object.fromEntries(parts.formatToParts(new Date()).filter(x => x.type !== 'literal').map(x => [x.type,x.value]));
    const day = `${p.year}-${p.month}-${p.day}`;
    if (day === lastDay) return;
    lastDay = day;
    const serial = Math.floor(Date.UTC(+p.year, +p.month - 1, +p.day) / 86400000);
    const item = cases[((serial % cases.length) + cases.length) % cases.length];
    document.querySelector('#daily-pig-date').textContent = `${p.year}.${p.month}.${p.day}`;
    document.querySelector('#daily-pig-title').textContent = item.title;
    document.querySelector('#daily-pig-observation').textContent = item.observation;
    document.querySelector('#daily-pig-action').textContent = item.action;
    document.querySelector('#daily-pig-link').href = `course.html#chapter-${item.chapter}`;
    document.querySelector('.pig-stage').dataset.mood = item.mood;
    window.dispatchEvent(new CustomEvent('daily-pig-change', { detail: item }));
  }
  update();
  window.setInterval(update, 60000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) update(); });
})();
