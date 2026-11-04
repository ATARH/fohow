(() => {
  'use strict';

  // Мобильное меню
  const burger = document.querySelector('.burger');
  const nav = document.getElementById('main-nav');

  if (burger && nav) {
    burger.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      burger.classList.toggle('is-active');
      burger.setAttribute('aria-expanded', String(isOpen));
    });
  }

  // Выпадающие списки в мобильном меню
  document.querySelectorAll('.has-sub > button').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      if (window.matchMedia('(max-width: 991px)').matches) {
        e.preventDefault();
        const li = btn.parentElement;
        const wasOpen = li.classList.contains('is-open');
        
        // Закрываем другие открытые меню
        document.querySelectorAll('.has-sub.is-open').forEach((el) => {
          el.classList.remove('is-open');
        });
        
        // Переключаем текущее
        li.classList.toggle('is-open', !wasOpen);
      }
    });
  });

  // Модальное окно
  const modal = document.getElementById('request-modal');
  const serviceSelect = document.getElementById('request-service');

  document.querySelectorAll('[data-modal-open]').forEach((el) => {
    el.addEventListener('click', () => {
      const service = el.getAttribute('data-service');
      if (serviceSelect && service) serviceSelect.value = service;
      if (modal) modal.showModal();
      
      // Закрываем мобильное меню при открытии модалки
      if (nav) nav.classList.remove('is-open');
      if (burger) {
        burger.classList.remove('is-active');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  });

  document.querySelectorAll('[data-modal-close]').forEach((el) => {
    el.addEventListener('click', () => modal?.close());
  });
  
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) modal.close();
  });

  // Обработка формы (демо)
  const requestForm = document.getElementById('request-form');
  requestForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const note = requestForm.querySelector('[data-form-note]');
    const btn = requestForm.querySelector('button[type="submit"]');
    
    if (!requestForm.reportValidity()) return;

    btn.disabled = true;
    btn.textContent = 'Отправляем...';
    
    // Имитация отправки
    setTimeout(() => {
      note.textContent = 'Заявка успешно отправлена!';
      note.style.color = 'green';
      requestForm.reset();
      btn.disabled = false;
      btn.textContent = 'Отправить';
      
      setTimeout(() => modal.close(), 2000);
    }, 1000);
  });
})();
