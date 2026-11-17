(() => {
  const params = new URLSearchParams(location.search);
  const requested = params.get('topic');
  const isRelated = requested === 'related';
  const topic = isRelated ? 'related' : Object.hasOwn(articleCollections, requested) ? requested : 'field';
  const {title, code, scope, note, entries} = isRelated
    ? {title: '주제별 관련기사'}
    : articleCollections[topic];
  const source = 'https://www.pignpork.com/news/';
  const catalog = relatedArticleCatalog;
  const relatedById = new Map(catalog.articles.map(article => [article.id, article]));
  const originalById = new Map(Object.entries(articleCollections).flatMap(([key, collection]) =>
    collection.entries.trim().split('\n').map(line => {
      const [id, , heading] = line.split('|');
      return [id, {id, title: heading, href: 'articles.html?topic=' + key + '#article-' + id}];
    })));
  const articleRows = isRelated
    ? catalog.articles.map(article => [
      article.id, catalog.categories[article.category], article.title,
      article.section + ' · ' + article.date.replaceAll('-', '.')
    ])
    : entries.trim().split('\n').map(line => line.split('|'));
  document.title = title + ' | 대한동물약품 양돈컨설팅';
  document.querySelector('#reading-title').textContent = title;
  document.querySelector('#reading-scope').textContent =
    isRelated
      ? '원문 ' + catalog.sourceCount + '편에서 연결된 관련기사 ' + catalog.linkCount +
        '개를 확인해, 중복을 합친 ' + articleRows.length + '편을 모았습니다. ' +
        catalog.checkedOn.replaceAll('-', '.') + ' 확인'
      : '피그앤포크 ' + scope + '을 정리했습니다. 사진과 도표는 원문에서 볼 수 있습니다.';
  if (note) {
    const readingNote = document.querySelector('#reading-note');
    readingNote.textContent = note;
    readingNote.hidden = false;
  }
  document.querySelector('#reading-guide').hidden = topic !== 'ped';
  document.querySelector('#reading-source').href = source + 'articleList.html?' +
    (isRelated ? '' : 'sc_sub_section_code=' + code + '&') + 'view_type=sm';
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
  if (isRelated) {
    const categoryMenu = document.querySelector('#related-categories');
    const selected = Object.hasOwn(catalog.categories, params.get('category')) ? params.get('category') : '';
    for (const [key, label] of [['', '전체'], ...Object.entries(catalog.categories)]) {
      const total = key ? catalog.articles.filter(article => article.category === key).length : articleRows.length;
      const link = document.createElement('a');
      link.href = '?topic=related' + (key ? '&category=' + key : '');
      link.textContent = label + ' ' + total;
      if (key === selected) link.setAttribute('aria-current', 'page');
      categoryMenu.append(link);
    }
    category.value = catalog.categories[selected] || '';
    category.closest('label').hidden = true;
    categoryMenu.hidden = false;
  }

  const cards = articleRows.map(([id, field, heading, summary]) => {
    const card = template.content.firstElementChild.cloneNode(true);
    card.id = 'article-' + id;
    const articleUrl = source + 'articleView.html?idxno=' + id;
    card.querySelector('.reading-category').textContent = field;
    card.querySelector('h2').textContent = heading;
    card.querySelector('.reading-card-summary p').textContent = summary;
    const link = card.querySelector('.reading-article-link');
    link.href = articleUrl;
    link.setAttribute('aria-label', heading + ' 원문 (새 탭)');

    const searchable = [field, heading, summary];
    if (!isRelated) {
      const [visual, caption, anchor, ...points] = articleGuides[id];
      const visualLink = card.querySelector('.reading-visual-link');
      const fragment = anchor ? '#:~:text=' + encodeURIComponent(anchor).replace(/-/g, '%2D') : '';
      visualLink.href = articleUrl + fragment;
      visualLink.textContent = '원문 ' + visual + ' 보기 ↗';
      visualLink.setAttribute('aria-label', heading + ' 원문 ' + visual + ' 보기 (새 탭)');
      card.querySelector('.reading-visual-caption').textContent = caption;
      card.querySelector('.reading-visual').hidden = false;

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
      outline.hidden = false;
      searchable.push(caption, ...points, ...pointSummaries);
    }

    const connections = isRelated
      ? relatedById.get(id).parents.map(parent => originalById.get(parent))
      : catalog.articles.filter(article => article.parents.includes(id)).map(article => ({
        title: article.title,
        href: 'articles.html?topic=related&category=' + article.category + '#article-' + article.id
      }));
    if (connections.length) {
      const details = card.querySelector('.reading-connections');
      details.querySelector('summary').textContent =
        (isRelated ? '연결된 기존 기사 ' : '원문 관련기사 ') + connections.length + '편';
      details.querySelector('ul').append(...connections.map(article => {
        const item = document.createElement('li');
        const link = document.createElement('a');
        link.href = article.href;
        link.textContent = article.title;
        item.append(link);
        return item;
      }));
      details.hidden = false;
      searchable.push(...connections.map(article => article.title));
    }
    return {card, field, text: searchable.join(' ').toLocaleLowerCase('ko')};
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
  document.getElementById(location.hash.slice(1))?.scrollIntoView({block: 'center'});
})();
