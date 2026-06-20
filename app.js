// ============================================
// THE DISPLAY CASE — app logic
// Renders figure cards, handles 3D tilt tracking,
// flip-to-reveal, and scroll-triggered entrances.
// ============================================

(function () {
  const gallery = document.getElementById("gallery");
  const countEl = document.getElementById("figureCount");
  if (countEl) countEl.textContent = FIGURES.length;

  function hexToRgba(hex, alpha) {
    const h = hex.replace("#", "");
    const r = parseInt(h.substring(0, 2), 16);
    const g = parseInt(h.substring(2, 4), 16);
    const b = parseInt(h.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  function buildCard(fig, index) {
    const card = document.createElement("article");
    card.className = "fig-card";
    if (fig.special === "gear5") card.classList.add("fx-gear5");
    if (fig.special === "genjutsu") card.classList.add("fx-genjutsu");
    card.style.setProperty("--enter-delay", `${(index % 6) * 0.08}s`);
    card.style.setProperty("--accent", fig.accent);
    card.style.setProperty("--accent-glow", hexToRgba(fig.accent, 0.35));
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-pressed", "false");
    card.setAttribute("aria-label", `${fig.name} figure card. Press to flip.`);

    let specialMarkup = "";
    if (fig.special === "gear5") {
      specialMarkup = `
        <div class="gear5-clouds"></div>
        <div class="gear5-bolt"></div>
        <div class="gear5-label">GEAR 5 — AWAKENED</div>
      `;
    } else if (fig.special === "genjutsu") {
      specialMarkup = `
        <div class="genjutsu-ripple"><span></span><span></span><span></span></div>
        <div class="genjutsu-crows"><span>🐦‍⬛</span><span>🐦‍⬛</span><span>🐦‍⬛</span></div>
        <div class="genjutsu-label">TSUKUYOMI — CAST</div>
      `;
    }

    card.innerHTML = `
      <div class="tilt-layer">
        <div class="card-face card-front">
          <div class="card-shine"></div>
          <span class="card-tag">${fig.series}</span>
          <span class="card-flip-hint" aria-hidden="true">⟳</span>
          <div class="card-img-wrap">
            <img src="${fig.image}" alt="${fig.name} anime figure" loading="lazy">
          </div>
          <div class="card-info">
            <p class="card-series">${fig.tag}</p>
            <h3 class="card-name">${fig.name}</h3>
          </div>
        </div>
        <div class="card-face card-back">
          <div class="card-back-inner">
            <div class="back-stage">
              <img src="${fig.image}" alt="" loading="lazy">
              ${specialMarkup}
            </div>
            <h4 class="back-name">${fig.name}</h4>
            <p class="back-blurb">${fig.blurb}</p>
          </div>
        </div>
      </div>
    `;

    // --- flip interaction ---
    function toggleFlip(e) {
      if (e) e.stopPropagation();
      const flipped = card.classList.toggle("is-flipped");
      card.setAttribute("aria-pressed", String(flipped));
    }
    card.addEventListener("click", toggleFlip);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleFlip(e);
      }
    });

    // --- 3D tilt tracking (mouse) ---
    const tiltLayer = card.querySelector(".tilt-layer");
    const maxTilt = 12;

    function handlePointerMove(e) {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const rotateY = (x - 0.5) * maxTilt * 2;
      const rotateX = (0.5 - y) * maxTilt * 2;
      tiltLayer.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }

    function resetTilt() {
      tiltLayer.style.transform = "rotateX(0deg) rotateY(0deg)";
    }

    card.addEventListener("mousemove", handlePointerMove);
    card.addEventListener("mouseleave", resetTilt);

    return card;
  }

  FIGURES.forEach((fig, i) => {
    gallery.appendChild(buildCard(fig, i));
  });

  // --- scroll-triggered entrance ---
  const cards = document.querySelectorAll(".fig-card");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );
  cards.forEach((c) => observer.observe(c));
})();
