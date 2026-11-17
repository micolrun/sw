(() => {
  const range = document.querySelector('#lab-day');
  if (!range) return;
  const output = document.querySelector('#lab-day-output');
  const pig = document.querySelector('#lab-pig');
  const stage = document.querySelector('#lab-stage');
  const title = document.querySelector('#lab-case-title');
  const detail = document.querySelector('#lab-case');
  const action = document.querySelector('#lab-action');
  const link = document.querySelector('#lab-link');
  const cases = [
    { end: 7, stage: '포유자돈', title: '젖을 먹는지 살펴보기', detail: '태어난 자돈이 모돈 곁에서 젖을 찾습니다. 한 마리가 뒤처지지는 않는지 확인해 보세요.', action: '초유 섭취와 보온 공간을 확인하고, 활력이 떨어지는 자돈은 담당 수의사와 상의합니다.', chapter: 2 },
    { end: 21, stage: '포유자돈', title: '설사와 보온 상태 관찰', detail: '가상 돈방에서 자돈 한 마리의 변이 묽고 활동이 줄었습니다. 설사는 여러 원인으로 나타날 수 있습니다.', action: '발생 시각과 두수, 젖 먹는 모습과 보온 상태를 기록하고 수의사에게 알립니다.', chapter: 7 },
    { end: 42, stage: '이유자돈', title: '이유 후 물과 사료 적응', detail: '젖을 뗀 자돈이 새 돈방으로 이동했습니다. 일부 자돈이 급수기를 찾지 못하고 있습니다.', action: '급수기 작동과 실제 음수·사료 섭취를 확인하고, 설사나 활력 변화를 기록합니다.', chapter: 2 },
    { end: 60, stage: '이유자돈', title: '돈방의 호흡과 환경', detail: '이유자돈 몇 마리가 기침을 합니다. 기침만으로 특정 질병을 판단할 수는 없습니다.', action: '기침하는 두수와 시간, 온도·환기 상태를 기록해 수의사와 상의합니다.', chapter: 7 },
    { end: 120, stage: '육성돈', title: '성장과 사료 섭취 살피기', detail: '육성돈의 몸집 차이가 커지고 사료 소비가 평소보다 줄었습니다.', action: '급이기와 급수기, 사육 밀도와 환기를 확인하고 체중과 섭취 변화를 기록합니다.', chapter: 5 },
    { end: 180, stage: '비육돈', title: '건강하게 출하 준비하기', detail: '출하를 앞둔 비육돈 가운데 다리를 저는 개체가 관찰됐습니다.', action: '파행 개체의 상태를 확인해 수의사와 상의하고, 출하 전 체중과 약품 휴약기간을 확인합니다.', chapter: 9 }
  ];
  function render() {
    const day = Number(range.value);
    const item = cases.find(entry => day <= entry.end);
    output.value = `${day}일령`;
    output.textContent = `${day}일령`;
    stage.textContent = `${day}일령 · ${item.stage}`;
    title.textContent = item.title; detail.textContent = item.detail; action.textContent = item.action;
    link.href = `course.html#chapter-${item.chapter}`;
    pig.style.setProperty('--pig-size', String(.48 + .52 * Math.sqrt((day - 1) / 179)));
  }
  // One simulated day passes every two calendar days in Korea; the cycle restarts after 180 days.
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
  const elapsed = Math.floor((Date.parse(`${today}T00:00:00Z`) - Date.UTC(2026, 10, 17)) / 86400000);
  if (Number.isFinite(elapsed)) range.value = 1 + ((Math.floor(elapsed / 2) % 180) + 180) % 180;
  range.addEventListener('input', render);
  document.querySelectorAll('[data-lab-step]').forEach(button => button.addEventListener('click', () => {
    range.value = Math.max(1, Math.min(180, Number(range.value) + Number(button.dataset.labStep)));
    render();
  }));
  render();
})();
