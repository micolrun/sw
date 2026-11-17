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
  return `<figure class="course-figure"><figcaption>${name}</figcaption><ol class="course-flow">${nodes.split('|')
    .map(node => `<li>${node}</li>`).join('')}</ol></figure>`;
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
  return `<figure class="course-figure"><figcaption>${name}</figcaption>
    <p>${unit} · 0–${axisMax}</p><ul class="course-chart">${values.map(([label, value]) =>
      `<li><span>${label}</span><span class="bar-track"><i style="width:${value / axisMax * 100}%"></i></span>
      <strong>${value.toFixed(1)}</strong></li>`).join('')}</ul></figure>`;
}

function renderLesson(index) {
  const chapter = chapters[index];
  renderNavigation(index);
  lesson.innerHTML = `
    <header class="lesson-heading">
      <span class="course-label">${index + 1}장 / ${chapters.length}장</span>
      <h2>${chapter.title}</h2>
      <p>${chapter.why}</p>
    </header>
    <section class="lesson-block"><h3>개념과 실무</h3>
      ${chapter.learn.split('\n').map(line => {
        const [level, body] = line.split(' | ');
        return `<p><strong class="course-level">${level}</strong> ${body}</p>`;
      }).join('')}
      ${renderTable(chapter.tables)}
      ${chapter.detail ? `<p class="course-note">${chapter.detail}</p>` : ''}
    </section>
    <section class="lesson-block"><h3>그림으로 이해하기</h3>
      ${(chapter.flows || []).map(renderFlow).join('')}
      ${(chapter.maps || []).map(renderMap).join('')}
      ${chapter.chart ? renderChart(chapter.chart) : ''}
    </section>
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
