// intro.js — page-load overlay sequence for TSHUKI COLLECTOR
(function () {
  const accentColors = {
    red: { color: '#E63946', glow: 'rgba(230,57,70,0.18)' },
    green: { color: '#06A77D', glow: 'rgba(6,167,125,0.16)' }
  };

  // Default is 'red'. To use green, set window.__TSHUKI_INTRO_COLOR = 'green' before loading this script.
  const preferred = (window.__TSHUKI_INTRO_COLOR || 'red');
  const accent = accentColors[preferred] || accentColors.red;

  document.documentElement.style.setProperty('--intro-accent', accent.color);
  document.documentElement.style.setProperty('--intro-accent-glow', accent.glow);

  const overlay = document.getElementById('intro-overlay');
  if (!overlay) return;

  overlay.classList.add('intro-animate');
  document.body.classList.add('intro-active');

  const hideDelay = 2200; // total visible time in ms
  setTimeout(() => {
    overlay.classList.add('hide');
    setTimeout(() => {
      document.body.classList.remove('intro-active');
      if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
    }, 650);
  }, hideDelay);

  function skip() {
    overlay.classList.add('hide');
    document.body.classList.remove('intro-active');
    if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
    window.removeEventListener('keydown', onKey);
    overlay.removeEventListener('click', skip);
  }
  function onKey(e) { if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') skip(); }
  overlay.addEventListener('click', skip);
  window.addEventListener('keydown', onKey);
})();
