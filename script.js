(() => {
  const slides = Array.from(document.querySelectorAll('[data-slide]'));
  if (!slides.length) return;

  const navLinks = Array.from(document.querySelectorAll('.nav__link'));
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  const getIndexFromHash = () => {
    const hash = window.location.hash || '#slide-1';
    const idx = slides.findIndex(s => `#${s.id}` === hash);
    return idx >= 0 ? idx : 0;
  };

  const setActiveNav = (index) => {
    navLinks.forEach((a, i) => {
      a.classList.toggle('is-active', i === index);
      a.setAttribute('aria-current', i === index ? 'page' : 'false');
    });
  };

  const goTo = (index) => {
    const clamped = Math.max(0, Math.min(slides.length - 1, index));
    slides[clamped].scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.history.replaceState(null, '', `#${slides[clamped].id}`);
    setActiveNav(clamped);
  };

  const goPrev = () => goTo(getIndexFromHash() - 1);
  const goNext = () => goTo(getIndexFromHash() + 1);

  prevBtn?.addEventListener('click', goPrev);
  nextBtn?.addEventListener('click', goNext);

  window.addEventListener('hashchange', () => setActiveNav(getIndexFromHash()));

  const onKeyDown = (e) => {
    const target = e.target;
    const typing = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);
    if (typing) return;

    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goPrev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      goNext();
    } else if (e.key === 'Home') {
      e.preventDefault();
      goTo(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      goTo(slides.length - 1);
    }
  };

  document.addEventListener('keydown', onKeyDown);

  // Update active nav based on what is visible.
  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter(e => e.isIntersecting)
        .sort((a, b) => (b.intersectionRatio - a.intersectionRatio))[0];

      if (!visible) return;

      const id = visible.target.id;
      const idx = slides.findIndex(s => s.id === id);
      if (idx >= 0) {
        setActiveNav(idx);
        window.history.replaceState(null, '', `#${id}`);
      }
    },
    { threshold: [0.35, 0.55, 0.75] }
  );

  slides.forEach(s => observer.observe(s));

  // Initial state
  setActiveNav(getIndexFromHash());
})();
