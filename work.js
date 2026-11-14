(() => {
 'use strict';
 const checklist = document.querySelector('#preparation-checklist');
 const progress = document.querySelector('#preparation-progress');
 const count = document.querySelector('#preparation-count');
 const reset = document.querySelector('#preparation-reset');
 if (!checklist || !progress || !count || !reset) return;
 const items = [...checklist.querySelectorAll('input[type="checkbox"]')];
 function update() {
  const checked = items.filter(item => item.checked).length;
  count.textContent = `Отмечено: ${checked} из ${items.length}`;
  reset.disabled = checked === 0;
 }
 items.forEach(item => item.addEventListener('change', update));
 reset.addEventListener('click', () => {
  items.forEach(item => { item.checked = false; });
  update();
 });
 update();
 progress.hidden = false;
})();
