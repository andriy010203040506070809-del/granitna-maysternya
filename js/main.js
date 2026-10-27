document.addEventListener('DOMContentLoaded', () => {

  // --- HEADER SCROLL ---
  const header = document.getElementById('header');
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  // --- BURGER MENU ---
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');

  burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    nav.classList.toggle('open');
    document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
  });

  nav.querySelectorAll('.header__link').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('active');
      nav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // --- SCROLL PROGRESS ---
  const scrollProgress = document.getElementById('scrollProgress');
  window.addEventListener('scroll', () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    scrollProgress.style.width = (window.scrollY / h * 100) + '%';
  }, { passive: true });

  // --- BACK TO TOP ---
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 600);
  }, { passive: true });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // --- REVEAL ON SCROLL ---
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  reveals.forEach(el => revealObserver.observe(el));

  // --- COUNTER ANIMATION ---
  const counters = document.querySelectorAll('[data-count]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count);
      const duration = 2000;
      const start = performance.now();

      function tick(now) {
        const p = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * ease).toLocaleString('uk');
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => counterObserver.observe(el));

  // --- QUIZ MULTI-STEP ---
  const quizBox = document.getElementById('quizBox');
  if (quizBox) {
    const steps = quizBox.querySelectorAll('.quiz__step');
    const barFill = document.getElementById('quizBar');
    const currentLabel = document.getElementById('quizCurrent');
    const pctLabel = document.getElementById('quizPct');
    const totalSteps = steps.length;
    let currentStep = 1;
    const quizData = {};

    function showStep(n) {
      steps.forEach(s => s.classList.remove('active'));
      const step = quizBox.querySelector(`[data-step="${n}"]`);
      if (step) step.classList.add('active');
      currentLabel.textContent = n;
      const pct = Math.round(((n - 1) / totalSteps) * 100);
      pctLabel.textContent = pct + '%';
      barFill.style.width = pct + '%';
    }

    quizBox.querySelectorAll('.quiz__option').forEach(btn => {
      btn.addEventListener('click', () => {
        quizData['step' + currentStep] = btn.dataset.value;
        currentStep++;
        if (currentStep <= totalSteps) {
          showStep(currentStep);
        }
      });
    });

    const quizForm = document.getElementById('quizForm');
    if (quizForm) {
      quizForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const fd = new FormData(quizForm);
        quizData.name = fd.get('name');
        quizData.phone = fd.get('phone');

        barFill.style.width = '100%';
        pctLabel.textContent = '100%';

        const step4 = quizBox.querySelector('[data-step="4"]');
        step4.innerHTML = '<div style="text-align:center;padding:40px 0"><h3 style="font-family:var(--font-h);font-size:1.5rem;margin-bottom:12px;color:var(--gold)">Дякуємо!</h3><p style="color:var(--text-2)">Ми зателефонуємо вам найближчим часом для прорахунку.</p></div>';
      });
    }
  }

  // --- FAQ ACCORDION ---
  document.querySelectorAll('.faq__question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const isOpen = item.classList.contains('open');

      document.querySelectorAll('.faq__item.open').forEach(i => i.classList.remove('open'));

      if (!isOpen) item.classList.add('open');
    });
  });

  // --- CONTACT FORM ---
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(contactForm);
      const data = {
        name: fd.get('name'),
        phone: fd.get('phone'),
        message: fd.get('message')
      };

      const wrap = contactForm.closest('.contacts__form-wrap');
      wrap.innerHTML = '<div style="text-align:center;padding:60px 20px"><h3 style="font-family:var(--font-h);font-size:1.5rem;margin-bottom:12px;color:var(--gold)">Заявку отримано!</h3><p style="color:var(--text-2)">Дякуємо, ' + (data.name || '') + '. Ми зв\'яжемося з вами найближчим часом.</p></div>';
    });
  }

  // --- PHONE MASK ---
  document.querySelectorAll('input[type="tel"]').forEach(input => {
    input.addEventListener('input', () => {
      let v = input.value.replace(/\D/g, '');
      if (v.startsWith('380')) v = v;
      else if (v.startsWith('80')) v = '3' + v;
      else if (v.startsWith('0')) v = '38' + v;

      let formatted = '';
      if (v.length > 0) formatted += '+' + v.substring(0, 2);
      if (v.length > 2) formatted += ' ' + v.substring(2, 5);
      if (v.length > 5) formatted += ' ' + v.substring(5, 8);
      if (v.length > 8) formatted += ' ' + v.substring(8, 10);
      if (v.length > 10) formatted += ' ' + v.substring(10, 12);

      input.value = formatted;
    });
  });

});
