(() => {
  const requested = new URLSearchParams(location.search).get('topic');
  const topic = Object.hasOwn(articleCollections, requested) ? requested : 'field';
  const {title, code, scope, note, entries} = articleCollections[topic];
  const source = 'https://www.pignpork.com/news/';
  const articleRows = entries.trim().split('\n').map(line => line.split('|'));
  document.title = title + ' | 대한동물약품 양돈컨설팅';
  document.querySelector('#reading-title').textContent = title;
  document.querySelector('#reading-scope').textContent =
    '피그앤포크 ' + scope + '을 정리했습니다. 사진과 도표는 원문에서 볼 수 있습니다.';
  if (note) {
    const readingNote = document.querySelector('#reading-note');
    readingNote.textContent = note;
    readingNote.hidden = false;
  }
  document.querySelector('#reading-guide').hidden = topic !== 'ped';
  document.querySelector('#reading-source').href = source + 'articleList.html?sc_sub_section_code=' + code + '&view_type=sm';
  document.querySelector('.reading-nav [data-topic="' + topic + '"]').setAttribute('aria-current', 'page');

  const search = document.querySelector('#reading-search');
  const category = document.querySelector('#reading-category');
  const count = document.querySelector('#reading-count');
  const empty = document.querySelector('#reading-empty');
  const grid = document.querySelector('#reading-grid');
  const template = document.querySelector('#reading-card');
  for (const name of new Set(articleRows.map(row => row[1]))) {
    category.add(new Option(name, name));
  }

  const cards = articleRows.map(([id, field, heading, summary]) => {
    const card = template.content.firstElementChild.cloneNode(true);
    const [visual, caption, anchor, ...points] = articleGuides[id];
    const articleUrl = source + 'articleView.html?idxno=' + id;
    card.querySelector('.reading-category').textContent = field;
    card.querySelector('h2').textContent = heading;
    card.querySelector('.reading-card-summary p').textContent = summary;
    const link = card.querySelector('.reading-article-link');
    link.href = articleUrl;
    link.setAttribute('aria-label', heading + ' 원문 (새 탭)');

    const visualLink = card.querySelector('.reading-visual-link');
    const fragment = anchor ? '#:~:text=' + encodeURIComponent(anchor).replace(/-/g, '%2D') : '';
    visualLink.href = articleUrl + fragment;
    visualLink.textContent = '원문 ' + visual + ' 보기 ↗';
    visualLink.setAttribute('aria-label', heading + ' 원문 ' + visual + ' 보기 (새 탭)');
    card.querySelector('.reading-visual-caption').textContent = caption;

    const outline = card.querySelector('.reading-outline');
    const pointSummaries = articlePointSummaries[id];
    outline.querySelector('summary').textContent = '핵심 항목 ' + points.length + '개';
    outline.querySelector('ul').append(...points.map((point, index) => {
      const item = document.createElement('li');
      const title = document.createElement('h3');
      title.textContent = point;
      const description = document.createElement('p');
      description.textContent = pointSummaries[index];
      item.append(title, description);
      return item;
    }));
    return {card, field, text: [field, heading, summary, caption, ...points, ...pointSummaries].join(' ').toLocaleLowerCase('ko')};
  });
  grid.append(...cards.map(({card}) => card));

  function filterCards() {
    const query = search.value.trim().toLocaleLowerCase('ko');
    let visible = 0;
    for (const {card, field, text} of cards) {
      card.hidden = (category.value !== '' && category.value !== field) || !text.includes(query);
      if (!card.hidden) visible++;
    }
    count.textContent = visible + '편 / 전체 ' + cards.length + '편';
    empty.hidden = visible > 0;
  }
  search.addEventListener('input', filterCards);
  category.addEventListener('change', filterCards);
  document.querySelector('.reading-filters').hidden = false;
  filterCards();
})();
