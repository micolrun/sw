(() => {
  const requested = new URLSearchParams(location.search).get('topic');
  const topic = Object.hasOwn(articleCollections, requested) ? requested : 'field';
  const {title, code, scope, entries} = articleCollections[topic];
  const source = 'https://www.pignpork.com/news/';
  const articleRows = entries.trim().split('\n').map(line => line.split('|'));
  const artByCategory = {
    '생산비·수익': 'feed', '생산성': 'production', '출하·등급': 'shipping', '기록·계획': 'records'
  };

  document.title = title + ' | 대한동물약품 양돈컨설팅';
  document.querySelector('#reading-title').textContent = title;
  const scopeText = '피그앤포크 ' + scope + '을 기사별로 정리했습니다.';
  document.querySelector('#reading-scope').textContent = topic === 'business'
    ? scopeText + ' 가격과 생산성 자료는 각 기사에 나온 조사 시점을 기준으로 읽어 주세요.'
    : scopeText;
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
    card.querySelector('.reading-category').textContent = field;
    card.querySelector('h2').textContent = heading;
    card.querySelector('p').textContent = summary;
    const link = card.querySelector('a');
    link.href = source + 'articleView.html?idxno=' + id;
    link.setAttribute('aria-label', heading + ' 원문 (새 탭)');
    if (topic === 'business') {
      const art = card.querySelector('.reading-art');
      art.classList.add('reading-art-' + artByCategory[field]);
      art.hidden = false;
    }
    return {card, field, text: [field, heading, summary].join(' ').toLocaleLowerCase('ko')};
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
