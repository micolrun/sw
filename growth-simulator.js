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
  const mechanisms = {
    suckling: { title:'포유자돈 · 로타바이러스성 장염', intro:'로타바이러스 감염이 설사를 일으키는 한 가지 과정을 살펴봅니다.', steps:[['🦠','발생 요인','로타바이러스가 입을 통해 감염'],['🧫','장 점막 손상','소장 융모의 흡수 세포가 손상'],['💧','흡수 저하','영양분과 물의 흡수가 줄어듦'],['🐷','나타나는 변화','묽은 설사와 탈수 위험']], source:'https://www.merckvetmanual.com/digestive-system/enteric-viral-diseases-in-pigs/rotaviral-enteritis-in-pigs' },
    nursery: { title:'이유자돈 · 장독소성 대장균 설사', intro:'장독소를 만드는 일부 대장균이 설사를 일으키는 과정을 살펴봅니다.', steps:[['🦠','발생 요인','장독소성 대장균(ETEC)이 소장에 정착'],['🧫','독소 작용','균의 독소가 장 점막에 작용'],['💧','장 안으로 분비','물과 전해질이 장 안으로 분비'],['🐷','나타나는 변화','물 설사와 빠른 탈수 위험']], source:'https://www.merckvetmanual.com/digestive-system/enteric-bacterial-diseases-in-pigs/enteric-colibacillosis-in-pigs' },
    growing: { title:'육성돈 · 호흡기 질병 복합체', intro:'병원체와 사육환경이 함께 관여할 수 있는 호흡기 문제의 개념도입니다.', steps:[['🦠','발생 요인','바이러스·세균과 환경 요인이 관여'],['🫁','호흡기 반응','기도와 폐에 염증이 생길 수 있음'],['〰️','기능 변화','호흡이 불편해지고 기침이 나타날 수 있음'],['🐷','관찰 포인트','기침·호흡과 성장 변화를 기록']], source:'https://www.merckvetmanual.com/respiratory-system/respiratory-diseases-of-pigs/overview-of-respiratory-diseases-of-pigs' },
    finishing: { title:'비육돈 · 발굽 손상과 파행', intro:'발굽 손상이 절뚝거림으로 이어질 수 있는 한 가지 경로입니다.', steps:[['▦','발생 요인','거칠거나 젖은 바닥 등으로 발굽 손상'],['🦶','조직 손상','발굽이나 발 주변에 상처·균열 발생'],['⚡','통증과 염증','손상 부위가 아프고 염증이 생길 수 있음'],['🐷','나타나는 변화','다리에 체중을 덜 싣고 절뚝거림']], source:'https://www.merckvetmanual.com/musculoskeletal-system/lameness-in-pigs/lameness-in-growing-finishing-pigs' }
  };
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
    const imageStage = day <= 21 ? 'suckling' : day <= 60 ? 'nursery' : day <= 120 ? 'growing' : 'finishing';
    if (pig.dataset.stage !== imageStage) { pig.src = `assets/pig-${imageStage}-v2.png`; pig.dataset.stage = imageStage; }
    const mechanism = mechanisms[imageStage];
    document.querySelector('#mechanism-title').textContent = mechanism.title;
    document.querySelector('#mechanism-intro').textContent = mechanism.intro;
    document.querySelector('#mechanism-source').href = mechanism.source;
    const flow = document.querySelector('#mechanism-flow');
    flow.replaceChildren(...mechanism.steps.map(([icon,label,text]) => {
      const item=document.createElement('li');
      const symbol=document.createElement('span'); symbol.className='mechanism-icon'; symbol.setAttribute('aria-hidden','true'); symbol.textContent=icon;
      const heading=document.createElement('strong'); heading.textContent=label;
      const description=document.createElement('span'); description.textContent=text;
      item.append(symbol,heading,description); return item;
    }));
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

(() => {
  const picker = document.querySelector('#growth-picker');
  if (!picker) return;
  const care = document.querySelector('#growth-care');
  const points = [
    ['포유자돈 · 출생부터 이유까지', '출생부터 젖을 떼는 생후 약 21–28일까지입니다. 초유를 먹었는지 확인하고, 포유 중에는 젖 먹는 모습과 보온 상태를 살펴보세요.'],
    ['이유자돈 · 이유부터 약 60일령까지', '생후 약 21–28일에 젖을 뗀 뒤 물과 사료에 적응하는 시기입니다. 급수기가 잘 작동하는지, 자돈이 물과 사료를 먹는지 확인하고 배변과 활력 변화도 살펴보세요.'],
    ['육성돈 · 약 60–120일', '체중과 사료 섭취를 기록하고, 돈방의 환기와 돼지 높이에서 느껴지는 바람을 확인하세요.'],
    ['비육돈 · 약 120–180일', '출하 기준에 맞는 체중인지 확인하고, 걷는 상태와 약품 휴약기간을 점검하세요.']
  ];
  const render = () => {
    const index = Number(picker.value);
    const [stage, advice] = points[index];
    picker.parentElement.style.setProperty('--growth-position', String(index / 3 * 100) + '%');
    picker.setAttribute('aria-valuetext', stage);
    const heading = document.createElement('strong');
    heading.textContent = stage;
    care.replaceChildren(heading, advice);
  };
  picker.addEventListener('input', render);
  render();
})();

(() => {
  const buttons = [...document.querySelectorAll('.sow-cycle button')];
  const care = document.querySelector('#sow-cycle-care');
  if (!care || !buttons.length) return;

  const points = [
    ['분만', '모돈이 자돈을 낳는 시기입니다. 분만 시작 시각과 태어난 자돈 수를 기록하고, 자돈의 보온과 초유 섭취를 확인하세요.'],
    ['포유 · 약 3~4주', '모돈이 자돈에게 젖을 먹이는 기간입니다. 모돈의 물과 사료 섭취, 체형과 유방 상태를 살피고 자돈이 젖을 잘 먹고 자라는지 확인하세요.'],
    ['이유 · 젖을 떼는 날', '자돈을 모돈과 분리합니다. 이유 날짜, 자돈 수와 모돈의 체형 상태를 기록하고, 모돈의 식욕과 유방 상태를 관찰하세요.'],
    ['발정 · 이유 후 약 4~6일', '이유 후 다시 발정이 오는 시기입니다. 모돈이 등을 눌렀을 때 가만히 서는 반응 등 발정 징후와 처음 확인한 시각을 기록하세요.'],
    ['종부 · 발정 확인 후', '발정이 확인된 모돈에 교배 또는 인공수정을 실시하는 단계입니다. 모돈 번호와 종부 시각, 웅돈 또는 정액 정보를 기록하세요.'],
    ['임신 · 종부 후 평균 114일', '종부 후 임신 여부와 재발정을 확인하고, 임신 중에는 체형과 사료 섭취를 살피세요. 분만 예정일에 맞춰 분만사를 준비합니다.'],
    ['다음 분만 · 새 주기의 시작', '분만 예정일을 확인하고 깨끗한 분만 공간과 자돈 보온 구역을 준비하세요. 자돈이 태어나면 분만 기록을 남기고 다시 포유 단계로 들어갑니다.']
  ];

  buttons.forEach((button, index) => button.addEventListener('click', () => {
    const [stage, advice] = points[index];
    buttons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    const heading = document.createElement('strong');
    heading.textContent = stage;
    care.replaceChildren(heading, advice);
  }));
})();
