(() => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!isOpen));
      nav.classList.toggle('open', !isOpen);
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        toggle.setAttribute('aria-expanded', 'false');
        nav.classList.remove('open');
      });
    });
  }

  const form = document.querySelector('#request-form');
  const description = document.querySelector('#problem_description');
  const phone = document.querySelector('#phone');

  if (phone) {
    const validatePhone = () => {
      const value = phone.value.trim();
      const digitCount = value.replace(/\D/g, '').length;
      const allowedFormat = /^\+?[0-9\s().-]+$/.test(value);
      let message = '';

      if (value && !allowedFormat) {
        message = 'Используй только цифры, +, пробелы, скобки, точку и дефис.';
      } else if (value && (digitCount < 7 || digitCount > 15)) {
        message = 'В номере должно быть от 7 до 15 цифр.';
      }

      phone.setCustomValidity(message);
      return message === '';
    };

    // Не даём вводить буквы и посторонние символы, в том числе при вставке.
    phone.addEventListener('input', () => {
      let filtered = phone.value.replace(/[^\d+()\s.-]/g, '');
      if (filtered.startsWith('+')) {
        filtered = '+' + filtered.slice(1).replace(/\+/g, '');
      } else {
        filtered = filtered.replace(/\+/g, '');
      }
      if (phone.value !== filtered) {
        const cursor = phone.selectionStart;
        phone.value = filtered;
        if (cursor !== null) {
          const position = Math.min(cursor, filtered.length);
          phone.setSelectionRange(position, position);
        }
      }
      validatePhone();
    });

    phone.addEventListener('blur', validatePhone);

    if (form) {
      form.addEventListener('submit', (event) => {
        if (!validatePhone()) {
          event.preventDefault();
          phone.reportValidity();
        }
      });
    }
  }

  if (form && description) {
    form.addEventListener('submit', (event) => {
      if (description.value.trim().length < 5) {
        event.preventDefault();
        description.setCustomValidity('Опиши проблему минимум пятью символами.');
        description.reportValidity();
      } else {
        description.setCustomValidity('');
      }
    });
    description.addEventListener('input', () => description.setCustomValidity(''));
  }
})();
