(() => {
  const requested = new URLSearchParams(location.search).get('topic');
  const topic = Object.hasOwn(articleCollections, requested) ? requested : 'field';
  const {title, code, scope, note, entries} = articleCollections[topic];
  const source = 'https://www.pignpork.com/news/';
  const articleRows = entries.trim().split('\n').map(line => line.split('|'));
  document.title = title + ' | 대한동물약품 양돈컨설팅';
  document.querySelector('#reading-title').textContent = title;
  const illustrated = articleRows.some(row => row[4]);
  const photoCredit = illustrated ? ' 사진은 주제별 AI 참고 이미지입니다.' : '';
  document.querySelector('#reading-scope').textContent =
    '피그앤포크 ' + scope + '을 기사별로 정리했습니다.' + photoCredit;
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

  const cards = articleRows.map(([id, field, heading, summary, photo, caption]) => {
    const card = template.content.firstElementChild.cloneNode(true);
    card.querySelector('.reading-category').textContent = field;
    card.querySelector('h2').textContent = heading;
    card.querySelector('p').textContent = summary;
    const link = card.querySelector('a');
    link.href = source + 'articleView.html?idxno=' + id;
    link.setAttribute('aria-label', heading + ' 원문 (새 탭)');
    if (photo && caption) {
      const figure = card.querySelector('.reading-figure');
      figure.querySelector('img').src = 'assets/article-photos/' + photo + '.webp';
      figure.querySelector('figcaption').textContent = caption;
      figure.hidden = false;
    }
    return {card, field, text: [field, heading, summary, caption].join(' ').toLocaleLowerCase('ko')};
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
