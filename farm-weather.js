(() => {
  const reading = document.querySelector('#weather-reading');
  const time = document.querySelector('#weather-time');
  const world = document.querySelector('.lab-world');
  const hero = document.querySelector('.hero');
  const form = document.querySelector('#weather-form');
  const results = document.querySelector('#weather-results');
  const apply = document.querySelector('#weather-apply');
  if (!reading || !world || !form) return;
  let choices = [], selected = null, request = 0;
  const describe = code => {
    if (code === 0) return ['맑음','clear'];
    if ([1,2,3].includes(code)) return ['구름','cloudy'];
    if ([45,48].includes(code)) return ['안개','fog'];
    if ([71,73,75,77,85,86].includes(code)) return ['눈','snow'];
    if ([95,96,99].includes(code)) return ['뇌우','storm'];
    if ([51,53,55,56,57,61,63,65,66,67,80,81,82].includes(code)) return ['비','rain'];
    return ['날씨 정보','cloudy'];
  };
  async function showWeather(place) {
    const id = ++request;
    selected = place;
    reading.textContent = `${place.name} 날씨를 불러오는 중…`;
    world.dataset.weather = 'unknown'; hero.dataset.weather = 'unknown';
    try {
      const params = new URLSearchParams({latitude:String(place.latitude),longitude:String(place.longitude),current:'temperature_2m,relative_humidity_2m,weather_code',timezone:'Asia/Seoul',forecast_days:'1'});
      const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
      if (!response.ok) throw new Error('weather request failed');
      const data = await response.json();
      if (id !== request) return;
      const c = data.current;
      if (!c || !Number.isFinite(c.temperature_2m) || !Number.isFinite(c.relative_humidity_2m) || !Number.isFinite(c.weather_code)) throw new Error('weather data unavailable');
      const [label, condition] = describe(c.weather_code);
      reading.textContent = `${place.name} · ${label} · ${Math.round(c.temperature_2m)}℃ · 습도 ${Math.round(c.relative_humidity_2m)}%`;
      time.textContent = `${String(c.time || '').replace('T',' ')} 기준 · 외부 날씨입니다. 돈사 내부는 별도로 측정하세요.`;
      world.dataset.weather = condition; hero.dataset.weather = condition;
    } catch (_) {
      if (id !== request) return;
      reading.textContent = '날씨를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.';
      time.textContent = '돈사 내부 온도·습도는 별도로 측정하세요.';
    }
  }
  function useLocation() {
    if (!navigator.geolocation) { reading.textContent = '현재 위치를 사용할 수 없습니다. 지역을 검색해 주세요.'; return; }
    reading.textContent = '현재 위치를 확인하는 중…';
    navigator.geolocation.getCurrentPosition(position => showWeather({name:'현재 위치',latitude:position.coords.latitude,longitude:position.coords.longitude}), () => {
      reading.textContent = '위치 권한이 없거나 위치를 찾지 못했습니다. 지역을 검색해 주세요.';
    }, {timeout:10000, maximumAge:900000});
  }
  document.querySelector('#weather-gps').addEventListener('click', useLocation);
  form.addEventListener('submit', async event => {
    event.preventDefault();
    const name = document.querySelector('#weather-search').value.trim();
    if (name.length < 2) return;
    reading.textContent = '지역을 검색하는 중…'; results.hidden=true; apply.hidden=true;
    try {
      const params = new URLSearchParams({name,language:'ko',count:'10',format:'json',countryCode:'KR'});
      const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?${params}`);
      if (!response.ok) throw new Error('search failed');
      const data = await response.json(); choices = data.results || [];
      if (!choices.length) { reading.textContent = '지역을 찾지 못했습니다. 다른 이름으로 검색해 주세요.'; return; }
      results.replaceChildren(...choices.map((place, index) => { const option=document.createElement('option'); option.value=String(index); option.textContent=[place.name,place.admin1,place.admin2].filter(Boolean).join(' · '); return option; }));
      results.hidden=false; apply.hidden=false; reading.textContent='검색 결과에서 지역을 선택해 주세요.';
    } catch (_) { reading.textContent='지역 검색에 실패했습니다. 잠시 후 다시 시도해 주세요.'; }
  });
  apply.addEventListener('click', () => { const p=choices[Number(results.value)]; if(p) showWeather({name:[p.name,p.admin1].filter(Boolean).join(' · '),latitude:p.latitude,longitude:p.longitude}); });
  window.setInterval(() => { if(selected && !document.hidden) showWeather(selected); }, 1800000);
  useLocation();
})();
