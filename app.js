'use strict';
const config = window.EXPERTOZAVR_CONFIG || {};
const menuButton = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('#mobile-nav');
const dialog = document.querySelector('#service-dialog');
const dialogTitle = document.querySelector('#dialog-title');
const dialogDescription = document.querySelector('#dialog-description');
const dialogExtra = document.querySelector('#dialog-extra');
const dialogCta = document.querySelector('#dialog-cta');
const serviceSelect = document.querySelector('#service-select');
let dialogService = '';
const services = {
 damage: {title:'Экспертиза после ДТП', description:'Исследование повреждений автомобиля и определение стоимости восстановительного ремонта. Задача и состав исследования зависят от обстоятельств происшествия и имеющихся материалов.', points:['Характер и объём повреждений','Работы и материалы для восстановления','Расчёт стоимости ремонта']},
 accident: {title:'Обстоятельства ДТП', description:'Автотехническое исследование механизма дорожно-транспортного происшествия. Эксперт анализирует техническую сторону события по предоставленным материалам.', points:['Механизм и последовательность происшествия','Движение и взаимное расположение автомобилей','Техническая возможность предотвратить столкновение']},
 condition: {title:'Техническое состояние автомобиля', description:'Исследование автомобиля, его узлов и агрегатов для выявления неисправностей и возможных причин их возникновения.', points:['Характер обнаруженных дефектов','Возможные причины и механизм неисправности','Связь дефектов с эксплуатацией или ремонтом']},
 traces: {title:'Транспортно-трасологическая экспертиза', description:'Исследование следов и повреждений на транспортных средствах. Помогает сопоставить повреждения с описанным механизмом происшествия.', points:['Характер и расположение следов','Взаимодействие транспортных средств','Соответствие повреждений обстоятельствам события']},
 valuation: {title:'Независимая оценка автомобиля', description:'Определение стоимости автомобиля с учётом цели оценки, даты, комплектации и технического состояния. Исходные данные и объём работы согласуются до начала исследования.', points:['Анализ исходных данных об автомобиле','Учёт состояния и особенностей комплектации','Обоснование итоговой стоимости']},
 review: {title:'Рецензирование экспертного заключения', description:'Исследование уже подготовленного экспертного заключения: его исходных данных, применённых методов и связи выводов с результатами исследования.', points:['Полнота и достаточность исходных данных','Методы исследования и выполненные расчёты','Обоснованность и непротиворечивость выводов']}
};
function setMenu(open) {
 menuButton.setAttribute('aria-expanded', String(open));
 menuButton.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
 mobileNav.hidden = !open;
}
menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', event => { if (event.key === 'Escape') setMenu(false); });
window.matchMedia('(min-width: 721px)').addEventListener('change', event => { if (event.matches) setMenu(false); });
function openDialog(title, description, points, service) {
 dialogTitle.textContent = title;
 dialogDescription.textContent = description;
 dialogExtra.replaceChildren();
 if (points.length) {
  const list = document.createElement('ul');
  points.forEach(point => { const item = document.createElement('li'); item.textContent = point; list.append(item); });
  dialogExtra.append(list);
 }
 dialogService = service;
 dialogCta.hidden = !service;
 document.querySelector('#dialog-eyebrow').textContent = service ? 'НАПРАВЛЕНИЕ ЭКСПЕРТИЗЫ' : 'ИНФОРМАЦИЯ О ФОРМЕ';
 dialog.showModal();
 document.body.classList.add('modal-open');
}
document.querySelectorAll('[data-service]').forEach(button => button.addEventListener('click', () => {
 const service = services[button.dataset.service];
 openDialog(service.title, service.description, service.points, service.title);
}));
function closeDialog() { dialog.close(); }
dialog.querySelector('.modal-close').addEventListener('click', closeDialog);
dialog.addEventListener('close', () => document.body.classList.remove('modal-open'));
dialog.addEventListener('click', event => {
 if (event.target !== dialog) return;
 const rect = dialog.getBoundingClientRect();
 if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeDialog();
});
dialogCta.addEventListener('click', () => { if (dialogService) serviceSelect.value = dialogService; closeDialog(); });
function showPrivacy() {
 openDialog('Обработка данных', 'Сейчас это демонстрационная версия формы. Введённые имя, телефон и описание ситуации не отправляются и не сохраняются сайтом. Для проверки формы используйте вымышленные данные.', ['На сайте нет аналитических счётчиков и рекламных cookies.','Политика обработки персональных данных будет подготовлена перед запуском приёма заявок.'], '');
}
document.querySelector('#privacy-open').addEventListener('click', showPrivacy);
document.querySelector('#footer-privacy').addEventListener('click', showPrivacy);
const form = document.querySelector('#consultation-form');
const phone = form.elements.phone;
const phoneError = document.querySelector('#phone-error');
const result = document.querySelector('#form-result');
function validPhone() { const digits = phone.value.replace(/\D/g, ''); return digits.length >= 10 && digits.length <= 15 && /^[+\d\s()\-]+$/.test(phone.value); }
phone.addEventListener('input', () => { phoneError.hidden = true; phone.removeAttribute('aria-invalid'); result.hidden = true; });
form.addEventListener('input', () => { result.hidden = true; });
form.addEventListener('submit', event => {
 event.preventDefault();
 if (!validPhone()) { phoneError.hidden = false; phone.setAttribute('aria-invalid', 'true'); phone.focus(); return; }
 result.hidden = false;
 result.textContent = 'Форма заполнена корректно. Это предварительная версия сайта: заявка не отправлена. Отправку подключим после согласования контактных данных.';
});
document.querySelector('#year').textContent = new Date().getFullYear();
