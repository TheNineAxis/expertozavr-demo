(() => {
 'use strict';
 // Conservative application limit: mail clients vary. The full body is never truncated.
 const MAX_MAILTO_LENGTH = 1800;
 const oneLine = value => String(value || '').replace(/[\r\n]+/g, ' ').trim();
 function create(input) {
  const recipient = oneLine(input.recipient);
  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(recipient)) throw new Error('Invalid recipient');
  const service = oneLine(input.service) || 'Нужна консультация';
  const subject = 'Обращение: ' + (service === 'Не знаю, нужна консультация' ? 'Консультация по экспертизе' : service);
  const message = String(input.message || '').replace(/\r\n?/g, '\n').trim() || 'Пожалуйста, свяжитесь со мной для уточнения задачи.';
  const body = [
   'Здравствуйте!', '',
   'Имя: ' + oneLine(input.name),
   'Телефон: ' + oneLine(input.phone),
   'Интересует: ' + service, '',
   'Ситуация:', message
  ].join('\n').replace(/\n/g, '\r\n');
  const subjectLink = 'mailto:' + recipient + '?subject=' + encodeURIComponent(subject);
  const fullLink = subjectLink + '&body=' + encodeURIComponent(body);
  const hasInlineBody = fullLink.length <= MAX_MAILTO_LENGTH;
  return { recipient, subject, body, href: hasInlineBody ? fullLink : subjectLink, hasInlineBody };
 }
 window.EXPERTOZAVR_MAIL = Object.freeze({ create });
})();
