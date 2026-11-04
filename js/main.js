/* =========================================================
   Империя Fohow — Сочи — общий скрипт
   ========================================================= */
(() => {
  'use strict';

  /* ---------- Мобильное меню ---------- */
  const burger = document.querySelector('.burger');
  const nav = document.getElementById('main-nav');

  if (burger && nav) {
    burger.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', String(open));
    });
  }

  /* ---------- Подменю: клик для тача/мобилки ---------- */
  document.querySelectorAll('.has-sub > button').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      if (window.matchMedia('(max-width: 1024px)').matches) {
        e.preventDefault();
        const li = btn.parentElement;
        const wasOpen = li.classList.contains('is-open');
        li.parentElement.querySelectorAll('.has-sub.is-open').forEach((el) => {
          el.classList.remove('is-open');
          el.querySelector('button')?.setAttribute('aria-expanded', 'false');
        });
        li.classList.toggle('is-open', !wasOpen);
        btn.setAttribute('aria-expanded', String(!wasOpen));
      }
    });
  });

  /* ---------- Раскрывающийся текст (для блога) ---------- */
  const introToggle = document.getElementById('intro-toggle');
  const introBody = document.getElementById('intro-body');
  if (introToggle && introBody) {
    introToggle.addEventListener('click', () => {
      const open = introBody.classList.toggle('is-open');
      introToggle.setAttribute('aria-expanded', String(open));
      introToggle.textContent = open ? 'Свернуть текст' : 'Развернуть текст';
    });
  }

  /* ---------- Модалка ---------- */
  const modal = document.getElementById('request-modal');
  const serviceSelect = document.getElementById('request-service');

  document.querySelectorAll('[data-modal-open]').forEach((el) => {
    el.addEventListener('click', () => {
      const service = el.getAttribute('data-service');
      if (serviceSelect && service) serviceSelect.value = service;
      if (modal && typeof modal.showModal === 'function') {
        modal.showModal();
      } else if (modal) {
        modal.setAttribute('open', '');
      }
      nav?.classList.remove('is-open');
      burger?.setAttribute('aria-expanded', 'false');
    });
  });

  document.querySelectorAll('[data-modal-close]').forEach((el) => {
    el.addEventListener('click', () => modal?.close());
  });
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) modal.close();
  });

  /* ---------- Отправка форм ---------- */
  async function sendForm(form, payload) {
    const endpoint = form.dataset.endpoint || '';
    if (!endpoint) {
      await new Promise((r) => setTimeout(r, 500));
      return { ok: true, demo: true };
    }
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: payload
    });
    return { ok: res.ok };
  }

  const requestForm = document.getElementById('request-form');
  requestForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const note = requestForm.querySelector('[data-form-note]');
    const btn = requestForm.querySelector('button[type="submit"]');
    if (!requestForm.reportValidity()) return;

    btn.disabled = true;
    note.textContent = 'Отправляем…';
    note.dataset.state = '';

    try {
      const fd = new FormData(requestForm);
      const { ok, demo } = await sendForm(requestForm, fd);
      if (ok) {
        note.textContent = demo
          ? 'Демо: форма отправлена (подключите endpoint).'
          : 'Заявка отправлена. Мы свяжемся с вами.';
        note.dataset.state = 'success';
        requestForm.reset();
      } else {
        throw new Error('bad');
      }
    } catch {
      note.textContent = 'Не удалось отправить. Попробуйте позже.';
      note.dataset.state = 'error';
    } finally {
      btn.disabled = false;
    }
  });

  const subscribeForm = document.getElementById('subscribe-form');
  subscribeForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const note = subscribeForm.querySelector('[data-form-note]');
    if (!subscribeForm.reportValidity()) return;
    note.textContent = 'Отправляем…';
    note.dataset.state = '';
    try {
      const { ok, demo } = await sendForm(subscribeForm, new FormData(subscribeForm));
      if (ok) {
        note.textContent = demo ? 'Демо: подписка оформлена.' : 'Спасибо за подписку!';
        note.dataset.state = 'success';
        subscribeForm.reset();
      } else throw new Error('bad');
    } catch {
      note.textContent = 'Ошибка отправки.';
      note.dataset.state = 'error';
    }
  });
})();