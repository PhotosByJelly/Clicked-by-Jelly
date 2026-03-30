// ============================================================
//  BEHIND THE LENS — script.js
//  Handles the card click → morph expand animation
// ============================================================

const gallery = document.getElementById("gallery");
const overlay = document.getElementById("overlay");

// Are we on a small screen?
function isMobile() {
  return window.innerWidth <= 700;
}

document.querySelectorAll(".photo-card").forEach(card => {
  card.addEventListener("click", () => {

    // --- 1. Grab where the thumbnail image is on screen right now ---
    const img = card.querySelector("img");
    const r = img.getBoundingClientRect();

    // --- 2. Dim the gallery (lightweight opacity instead of heavy blur) ---
    gallery.classList.add("dimmed");

    // --- 3. Build the morph element ---
    const morph = document.createElement("div");
    morph.className = "morph";

    // Pass the gradient colours as CSS variables on the element itself
    // so the .info background can reference them
    morph.style.setProperty("--g1", card.dataset.g1);
    morph.style.setProperty("--g2", card.dataset.g2);

    // Start position = exactly where the thumbnail was (so it looks like it grows from there)
    morph.style.left   = r.left + "px";
    morph.style.top    = r.top  + "px";
    morph.style.width  = r.width  + "px";
    morph.style.height = r.height + "px";

    morph.innerHTML = `
      <span class="close" title="Close">×</span>
      <img src="${card.dataset.img}" alt="${card.dataset.title}">
      <div class="info">
        <h2>${card.dataset.title}</h2>
        <p class="mood">${card.dataset.mood}</p>
        <p class="meta">${card.dataset.meta}</p>
        <a class="download" href="${card.dataset.download}" target="_blank" rel="noopener">↓ Download</a>
      </div>
    `;

    overlay.appendChild(morph);
    overlay.classList.add("active");

    // --- 4. Animate to final position on next frame ---
    //    (requestAnimationFrame lets the browser paint the start position first,
    //     then the transition kicks in — that's what makes it feel smooth)
    requestAnimationFrame(() => {
      if (isMobile()) {
        // On mobile: nearly full screen, centred, taller to fit stacked layout
        morph.style.left   = "3vw";
        morph.style.top    = "5vh";
        morph.style.width  = "94vw";
        morph.style.height = "90vh";
      } else {
        // On desktop: wide panel with image + info side by side
        morph.style.left   = "6vw";
        morph.style.top    = "10vh";
        morph.style.width  = "88vw";
        morph.style.height = "80vh";
      }
    });

    // --- 5. Close button ---
    morph.querySelector(".close").addEventListener("click", closemorph);

    // --- 6. Also close if user taps the dimmed gallery behind ---
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closemorph();
    }, { once: true });

    function closemorph() {
      morph.remove();
      overlay.classList.remove("active");
      gallery.classList.remove("dimmed");
    }

  });
});
