'use strict';

/* ============ HEADER SCROLL ============ */
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

/* ============ BURGER MENU ============ */
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
burger?.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  burger.classList.toggle('active', open);
  burger.setAttribute('aria-expanded', String(open));
});
mobileMenu?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    burger.classList.remove('active');
    burger.setAttribute('aria-expanded', 'false');
  });
});

/* ============ FADE-UP ON SCROLL ============ */
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
document.querySelectorAll('.fade-up').forEach(el => io.observe(el));

/* ============ COUNTER ANIMATION ============ */
function animateCounter(el) {
  const target = Number(el.dataset.count) || 0;
  const suffix = el.dataset.suffix || '';
  const duration = 1500;
  const start = performance.now();
  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(target * eased) + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCounter(e.target);
      counterObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-num[data-count]').forEach(el => counterObserver.observe(el));

/* ============ FILTER PROJECTS ============ */
const filterButtons = [...document.querySelectorAll('.filter-btn')];
const projectCards = [...document.querySelectorAll('.case')];
filterButtons.forEach(button => button.addEventListener('click', () => {
  filterButtons.forEach(item => {
    const active = item === button;
    item.classList.toggle('is-active', active);
    item.setAttribute('aria-pressed', String(active));
  });
  const filter = button.dataset.filter;
  projectCards.forEach(card => {
    card.hidden = filter !== 'all' && card.dataset.category !== filter;
  });
}));

/* ============ CALCULATOR ============ */
const calc = (() => {
  const basePrices = { landing: 35000, corporate: 70000, shop: 120000, webapp: 220000 };
  const pageMultipliers = { small: 1, medium: 1.4, large: 1.9 };
  const designMultipliers = { template: 1, custom: 1.6, premium: 2.4 };
  const speedMultipliers = { normal: 1, fast: 1.25, urgent: 1.5 };
  const extras = { seo: 15000, analytics: 8000, copy: 12000, support: 20000 };
  const typeLabels = { landing: 'Лендинг', corporate: 'Корпоративный сайт', shop: 'Интернет-магазин', webapp: 'Веб-приложение' };
  const designLabels = { template: 'Шаблон', custom: 'Кастомный', premium: 'Премиум' };
  const speedLabels = { normal: 'Стандарт', fast: 'Ускоренно', urgent: 'Срочно' };
  const pageLabels = { small: 'до 5 экранов', medium: '6–15 экранов', large: '15+ экранов' };
  const extraLabels = { seo: 'SEO', analytics: 'Аналитика', copy: 'Копирайтинг', support: 'Поддержка 3 мес.' };

  const totalEl = document.getElementById('calcTotal');
  const subEl = document.getElementById('calcSub');
  const detailEl = document.getElementById('calcDetail');
  if (!totalEl) return { update: () => {} };

  function format(n) {
    return new Intl.NumberFormat('ru-RU').format(Math.round(n)) + ' ₽';
  }

  function update() {
    const form = document.querySelector('.calc-form');
    if (!form) return;
    const type = form.querySelector('input[name="type"]:checked')?.value || 'landing';
    const pages = form.querySelector('input[name="pages"]:checked')?.value || 'small';
    const design = form.querySelector('input[name="design"]:checked')?.value || 'template';
    const speed = form.querySelector('input[name="speed"]:checked')?.value || 'normal';
    const selectedExtras = [...form.querySelectorAll('input[name="extra"]:checked')].map(x => x.value);

    let total = basePrices[type];
    total *= pageMultipliers[pages];
    total *= designMultipliers[design];
    total *= speedMultipliers[speed];

    let extrasSum = 0;
    selectedExtras.forEach(k => { extrasSum += extras[k]; });
    total += extrasSum;

    totalEl.textContent = 'от ' + format(total);
    subEl.textContent = typeLabels[type] + ' · ' + designLabels[design] + ' · ' + speedLabels[speed];

    const rows = [];
    rows.push(`<div><span>${typeLabels[type]}</span><strong>${format(basePrices[type])}</strong></div>`);
    if (pages !== 'small') rows.push(`<div><span>Объём · ${pageLabels[pages]}</span><strong>×${pageMultipliers[pages]}</strong></div>`);
    if (design !== 'template') rows.push(`<div><span>Дизайн · ${designLabels[design]}</span><strong>×${designMultipliers[design]}</strong></div>`);
    if (speed !== 'normal') rows.push(`<div><span>Сроки · ${speedLabels[speed]}</span><strong>×${speedMultipliers[speed]}</strong></div>`);
    if (selectedExtras.length) {
      rows.push(`<div><span>Доп. услуги</span><strong>+${format(extrasSum)}</strong></div>`);
    }
    detailEl.innerHTML = rows.join('');
  }

  document.querySelectorAll('.calc-form input').forEach(input => {
    input.addEventListener('change', update);
  });

  return { update };
})();
calc.update();

/* ============ CONTACT FORM ============ */
const form = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const formNote = document.getElementById('formNote');

form?.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();
  if (!name || !email || !message) {
    formNote.textContent = 'Заполните все поля, пожалуйста.';
    formNote.style.color = '#ef4444';
    return;
  }
  submitBtn.disabled = true;
  submitBtn.textContent = 'Отправляем…';
  setTimeout(() => {
    submitBtn.textContent = '✓ Заявка отправлена';
    submitBtn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
    formNote.textContent = 'Спасибо! Это демо-форма — реальная отправка не подключена.';
    formNote.style.color = 'var(--muted)';
    form.reset();
    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Отправить заявку';
      submitBtn.style.background = '';
    }, 4000);
  }, 900);
});

/* ============ TO TOP ============ */
const toTop = document.getElementById('toTop');
window.addEventListener('scroll', () => {
  toTop?.classList.toggle('visible', window.scrollY > 600);
}, { passive: true });
toTop?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ============ SMOOTH ANCHOR (fallback) ============ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (id === '#' || id.length < 2) return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ============================================================
   AI-КОНСУЛЬТАНТ
   ============================================================ */
const chatToggle = document.getElementById('chatToggle');
const chatPanel = document.getElementById('chatPanel');
const chatClose = document.getElementById('chatClose');
const chatLog = document.getElementById('chatLog');
const chatChips = document.getElementById('chatChips');
const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');
const heroChatBtn = document.getElementById('heroChatBtn');

const CHAT_SCENARIOS = [
  {
    keys: ['цена', 'стоимост', 'сколько', 'прайс', 'стоит', 'бюджет'],
    answer: 'Ориентировочно: лендинг — от 35 000 ₽, корпоративный сайт — от 70 000 ₽, интернет-магазин — от 120 000 ₽. Точная цена зависит от объёма, дизайна и сроков. Могу открыть калькулятор — покажет за 30 секунд.',
    chips: ['Открыть калькулятор', 'Какие сроки?', 'Что входит в работу?']
  },
  {
    keys: ['срок', 'быстр', 'долго', 'когда', 'время', 'недел', 'дней'],
    answer: 'Лендинг — 5–7 дней. Корпоративный сайт — 2–3 недели. Интернет-магазин — 3–6 недель. Срочные проекты беру с наценкой 25–50%. Хотите уточнить сроки под вашу задачу?',
    chips: ['Сколько стоит?', 'Обсудить проект']
  },
  {
    keys: ['услуг', 'делае', 'чем', 'може', 'помо', 'специализ'],
    answer: 'Делаю: лендинги, корпоративные сайты, интернет-магазины, брендинг, адаптивный дизайн, интеграции с 1С и CRM. Ещё — поддержку и развитие после запуска.',
    chips: ['Посмотреть услуги', 'Сколько стоит?']
  },
  {
    keys: ['входит', 'получ', 'отдае', 'исходник', 'файл', 'переда'],
    answer: 'Вы получаете: адаптивный сайт, исходники (HTML/CSS/JS), инструкцию по правкам, SEO-базу (мета-теги, sitemap.xml, robots.txt), рабочую форму заявки. Калькулятор, анимации, интеграции — в пакетах «Стандарт» и «Премиум».',
    chips: ['Тарифы', 'Обсудить проект']
  },
  {
    keys: ['поддержк', 'гарант', 'доработ', 'правк', 'баг', 'ошибк'],
    answer: 'После сдачи — 2 недели бесплатных правок (баги и мелкие доработки в рамках ТЗ). Дальше — поддержка по подписке или отдельные задачи. Гарантия на код — 12 месяцев.',
    chips: ['Сколько стоит?', 'Обсудить проект']
  },
  {
    keys: ['форм', 'заявк', 'связ', 'написа', 'контакт', 'телеграм', 'почт'],
    answer: 'Оставьте заявку через форму ниже или напишите в Telegram @nova_studio. Отвечу в течение 2 рабочих часов в будни.',
    chips: ['К форме', 'Сколько стоит?']
  },
  {
    keys: ['договор', 'оплат', 'предоплат', 'смет'],
    answer: 'Работаю по договору с фиксированной сметой и сроками. Предоплата 50%, остаток — после сдачи. Все правки в рамках согласованного ТЗ — без доплат.',
    chips: ['Сколько стоит?', 'Обсудить проект']
  },
  {
    keys: ['портфолио', 'работы', 'кейс', 'пример'],
    answer: 'В разделе «Работы» — четыре демонстрационных кейса: финтех-платформа, магазин растений, студия архитектуры, SaaS-дашборд. Все — концепты для портфолио, реальные проекты покажу в личном диалоге.',
    chips: ['Открыть работы', 'Сколько стоит?']
  },
  {
    keys: ['ты кто', 'кто ты', 'бот', 'нейросет', 'ии', 'chatgpt', 'gpt'],
    answer: 'Я — демо-AI-консультант этого сайта. Отвечаю по сценариям, без реального обращения к нейросети. В боевом проекте на это место ставится GPT-помощник с базой знаний о вашей компании.',
    chips: ['Сколько стоит?', 'Что входит в работу?']
  },
  {
    keys: ['привет', 'здравств', 'хай', 'добрый', 'hello'],
    answer: 'Привет! Чем могу помочь? Спросите про цены, сроки, услуги, гарантии — или откройте калькулятор, чтобы прикинуть бюджет.',
    chips: ['Сколько стоит?', 'Какие сроки?', 'Что входит?']
  },
  {
    keys: ['спасиб', 'благодар', 'спс'],
    answer: 'Рад помочь! Если появятся ещё вопросы — я здесь. Или оставьте заявку, вернусь с ответом.',
    chips: ['Обсудить проект', 'Калькулятор']
  }
];

const CHAT_NAV = {
  'открыть калькулятор': '#calculator',
  'калькулятор': '#calculator',
  'сколько стоит?': null,
  'какие сроки?': null,
  'что входит в работу?': null,
  'что входит?': null,
  'обсудить проект': '#contact',
  'к форме': '#contact',
  'посмотреть услуги': '#services',
  'открыть работы': '#portfolio',
  'работы': '#portfolio',
  'тарифы': '#tariffs'
};

let chatInitialized = false;

function chatMsg(text, who = 'bot') {
  const el = document.createElement('div');
  el.className = 'chat-msg ' + who;
  el.textContent = text;
  chatLog.appendChild(el);
  chatLog.scrollTop = chatLog.scrollHeight;
  return el;
}

function setChips(labels) {
  chatChips.replaceChildren();
  labels.forEach(label => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'chat-chip';
    btn.textContent = label;
    btn.addEventListener('click', () => {
      const nav = CHAT_NAV[label.toLowerCase()];
      if (nav) {
        chatPanel.classList.remove('open');
        chatToggle?.classList.remove('hidden');
        const target = document.querySelector(nav);
        if (target) {
          const top = target.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top, behavior: 'smooth' });
        }
        return;
      }
      chatInput.value = label;
      chatForm.requestSubmit();
    });
    chatChips.appendChild(btn);
  });
}

function findAnswer(text) {
  const q = text.toLowerCase().replace(/ё/g, 'е');
  for (const scenario of CHAT_SCENARIOS) {
    if (scenario.keys.some(k => q.includes(k))) return scenario;
  }
  return null;
}

function chatRespond(question) {
  chatMsg(question, 'user');
  chatInput.value = '';
  setChips([]);
  const typing = chatMsg('Печатает', 'bot typing');
  typing.textContent = '';
  const scenario = findAnswer(question);
  setTimeout(() => {
    typing.remove();
    if (scenario) {
      chatMsg(scenario.answer);
      setChips(scenario.chips || ['Сколько стоит?', 'Обсудить проект']);
    } else {
      chatMsg('Пока не уверен в ответе. Могу рассказать про цены, сроки, услуги, что входит в работу или гарантии. Или оставьте заявку — вернусь с ответом.');
      setChips(['Сколько стоит?', 'Какие сроки?', 'Что входит в работу?', 'Обсудить проект']);
    }
  }, 700 + Math.random() * 400);
}

function openChat() {
  chatPanel.classList.add('open');
  chatToggle?.classList.add('hidden');
  if (!chatInitialized) {
    chatInitialized = true;
    chatMsg('Привет! Я Nova AI — демо-консультант студии. Спрошу про цены, сроки, услуги, гарантии. Или нажмите на подсказку ниже.');
    setChips(['Сколько стоит?', 'Какие сроки?', 'Что входит в работу?', 'Обсудить проект']);
  }
  setTimeout(() => chatInput?.focus(), 200);
}

function closeChat() {
  chatPanel.classList.remove('open');
  chatToggle?.classList.remove('hidden');
}

chatToggle?.addEventListener('click', openChat);
chatClose?.addEventListener('click', closeChat);
heroChatBtn?.addEventListener('click', openChat);

chatForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const q = chatInput.value.trim();
  if (!q) return;
  chatRespond(q);
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && chatPanel?.classList.contains('open')) {
    closeChat();
  }
});