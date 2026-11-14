(() => {
 'use strict';
 const filters = document.querySelector('#catalog-filters');
 const cards = [...document.querySelectorAll('.catalog-card')];
 const count = document.querySelector('#catalog-result-count');
 if (!filters || !cards.length || !count) return;
 const buttons = [...filters.querySelectorAll('[data-filter]')];
 buttons.forEach(button => button.addEventListener('click', () => {
  const category = button.dataset.filter;
  buttons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  let visible = 0;
  cards.forEach(card => {
   card.hidden = category !== 'all' && card.dataset.category !== category;
   if (!card.hidden) visible += 1;
  });
  count.textContent = category === 'all' ? `Всего направлений: ${visible}` : `По выбранной теме: ${visible}`;
 }));
 filters.hidden = false;
})();
