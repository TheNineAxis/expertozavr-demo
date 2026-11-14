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
 openDialog('Подготовка письма', 'Форма помогает составить письмо на ' + config.email + '. После подготовки вы сможете проверить текст и открыть письмо в своём почтовом приложении.', ['В письмо попадут имя, телефон, выбранное направление и описание ситуации.','Сайт не отправляет заявку автоматически: отправку нужно подтвердить в почтовом приложении.','Если почтовое приложение не настроено, выделите и скопируйте подготовленный текст, затем отправьте его через свою почту.'], '');
}
document.querySelector('#privacy-open').addEventListener('click', showPrivacy);
document.querySelector('#footer-privacy').addEventListener('click', showPrivacy);
const form = document.querySelector('#consultation-form');
const nameInput = form.elements.name;
const phone = form.elements.phone;
const phoneError = document.querySelector('#phone-error');
const result = document.querySelector('#form-result');
const submitButton = form.querySelector('[type="submit"]');
const mailReady = config.formMode === 'email-draft' && Boolean(config.email) && Boolean(window.EXPERTOZAVR_MAIL);
submitButton.disabled = !mailReady;
function validPhone() { const digits = phone.value.replace(/\D/g, ''); return digits.length >= 10 && digits.length <= 15 && /^[+\d\s()\-]+$/.test(phone.value); }
function clearDraft() { result.hidden = true; result.replaceChildren(); }
phone.addEventListener('input', () => { phoneError.hidden = true; phone.removeAttribute('aria-invalid'); });
nameInput.addEventListener('input', () => nameInput.setCustomValidity(''));
form.addEventListener('input', clearDraft);
form.addEventListener('change', clearDraft);
function showDraft(draft) {
 result.replaceChildren();
 const status = document.createElement('p');
 status.className = 'email-draft-status';
 status.setAttribute('role', 'status');
 status.textContent = 'Письмо подготовлено. Проверьте текст и отправьте его из своего почтового приложения.';
 const recipient = document.createElement('p');
 recipient.className = 'email-draft-recipient';
 recipient.textContent = 'Кому: ' + draft.recipient;
 const subject = document.createElement('p');
 subject.className = 'email-draft-subject';
 subject.textContent = 'Тема: ' + draft.subject;
 const previewLabel = document.createElement('label');
 previewLabel.className = 'email-draft-label';
 previewLabel.htmlFor = 'email-draft-preview';
 previewLabel.textContent = 'Текст письма';
 const preview = document.createElement('textarea');
 preview.id = 'email-draft-preview';
 preview.className = 'email-draft-preview';
 preview.readOnly = true;
 preview.rows = 8;
 preview.spellcheck = false;
 preview.value = draft.body;
 const actions = document.createElement('div');
 actions.className = 'email-draft-actions';
 const open = document.createElement('a');
 open.className = 'button email-draft-open';
 open.href = draft.href;
 open.textContent = draft.hasInlineBody ? 'Открыть письмо' : 'Открыть письмо без текста';
 const select = document.createElement('button');
 select.type = 'button';
 select.className = 'inline-button email-draft-select';
 select.textContent = 'Выделить текст';
 select.addEventListener('click', () => { preview.focus(); preview.select(); });
 actions.append(open, select);
 const help = document.createElement('p');
 help.className = 'email-draft-help';
 help.textContent = draft.hasInlineBody
  ? 'Письмо ещё не отправлено. Если почтовое приложение не настроено, скопируйте текст и отправьте его на указанный email через свою почту.'
  : 'Текст длинный. Скопируйте его из поля выше и вставьте в письмо после открытия почтового приложения. Весь текст сохранён в этом поле.';
 result.append(status, recipient, subject, previewLabel, preview, actions, help);
 result.hidden = false;
 result.focus({ preventScroll: true });
 result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
form.addEventListener('submit', event => {
 event.preventDefault();
 if (!mailReady) return;
 if (!nameInput.value.trim()) { nameInput.setCustomValidity('Укажите, как к вам обращаться.'); nameInput.reportValidity(); return; }
 if (!form.reportValidity()) return;
 if (!validPhone()) { phoneError.hidden = false; phone.setAttribute('aria-invalid', 'true'); phone.focus(); return; }
 try {
  const draft = window.EXPERTOZAVR_MAIL.create({ recipient: config.email, name: nameInput.value, phone: phone.value, service: serviceSelect.value, message: form.elements.message.value });
  showDraft(draft);
 } catch {
  result.replaceChildren();
  const error = document.createElement('p');
  error.setAttribute('role', 'status');
  error.textContent = 'Не удалось подготовить письмо. Позвоните или напишите в центр по контактам, указанным рядом.';
  result.append(error);
  result.hidden = false;
 }
});

document.querySelector('#year').textContent = new Date().getFullYear();
