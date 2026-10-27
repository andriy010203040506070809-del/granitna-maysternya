document.addEventListener('DOMContentLoaded', () => {

  const CLOUD_NAME = 'dv4xqeucm';
  const grid = document.getElementById('catalogGrid');
  const totalCount = document.getElementById('totalCount');
  const loadingEl = document.getElementById('catalogLoading');

  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lbImg');
  const lbCounter = document.getElementById('lbCounter');
  const lbClose = document.getElementById('lbClose');
  const lbPrev = document.getElementById('lbPrev');
  const lbNext = document.getElementById('lbNext');

  const items = typeof CATALOG_ITEMS !== 'undefined' ? CATALOG_ITEMS : [];
  let currentLb = 0;

  function cloudUrl(publicId, transforms) {
    return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transforms}/${publicId}.jpg`;
  }

  function thumbUrl(item) {
    return cloudUrl(item.id, 'f_auto,q_auto,w_500,c_limit');
  }

  function fullUrl(item) {
    return cloudUrl(item.id, 'f_auto,q_auto,w_1400');
  }

  // --- RENDER GRID ---
  totalCount.textContent = items.length;

  const BATCH = 24;
  let loaded = 0;

  function renderBatch() {
    const end = Math.min(loaded + BATCH, items.length);
    const frag = document.createDocumentFragment();

    for (let i = loaded; i < end; i++) {
      const item = items[i];
      const card = document.createElement('div');
      card.className = 'cat-card';
      card.dataset.index = i;

      const img = document.createElement('img');
      img.alt = item.title;
      img.loading = 'lazy';
      img.src = thumbUrl(item);
      img.onload = () => img.classList.add('loaded');

      const overlay = document.createElement('div');
      overlay.className = 'cat-card__overlay';
      overlay.innerHTML = `<span class="cat-card__num">${item.title}</span>`;

      card.appendChild(img);
      card.appendChild(overlay);
      frag.appendChild(card);

      card.addEventListener('click', () => openLightbox(i));
    }

    grid.appendChild(frag);
    loaded = end;

    if (loaded < items.length) {
      loadingEl.classList.add('active');
    } else {
      loadingEl.classList.remove('active');
    }
  }

  renderBatch();

  // --- INFINITE SCROLL ---
  const scrollObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && loaded < items.length) {
      renderBatch();
    }
  }, { rootMargin: '400px' });

  scrollObserver.observe(loadingEl);

  // --- LIGHTBOX ---
  function openLightbox(index) {
    currentLb = index;
    updateLightbox();
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  function updateLightbox() {
    const item = items[currentLb];
    lbImg.style.opacity = '0';
    lbImg.src = fullUrl(item);
    lbImg.alt = item.title;
    lbImg.onload = () => { lbImg.style.opacity = '1'; };
    lbCounter.textContent = `${currentLb + 1} / ${items.length}`;
  }

  function nextLb() {
    currentLb = (currentLb + 1) % items.length;
    updateLightbox();
  }

  function prevLb() {
    currentLb = (currentLb - 1 + items.length) % items.length;
    updateLightbox();
  }

  lbClose.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click', prevLb);
  lbNext.addEventListener('click', nextLb);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextLb();
    if (e.key === 'ArrowLeft') prevLb();
  });

  // touch swipe in lightbox
  let lbTouchStart = 0;
  lightbox.addEventListener('touchstart', (e) => {
    lbTouchStart = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener('touchend', (e) => {
    const diff = lbTouchStart - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextLb();
      else prevLb();
    }
  }, { passive: true });

  // --- SCROLL PROGRESS ---
  const scrollProgress = document.getElementById('scrollProgress');
  if (scrollProgress) {
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgress.style.width = (scrollTop / docHeight * 100) + '%';
    }, { passive: true });
  }

  // --- BACK TO TOP ---
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('visible', window.scrollY > 600);
    }, { passive: true });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- HEADER SCROLL ---
  const header = document.getElementById('header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
  }

  // --- BURGER MENU ---
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  if (burger && nav) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('active');
      nav.classList.toggle('open');
      document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
    });
  }
});
