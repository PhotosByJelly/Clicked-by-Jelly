// ============================================================
//  BEHIND THE LENS — script.js
//  Uses the FLIP technique for GPU-accelerated animation:
//
//  F = First   — measure where the thumbnail is
//  L = Last    — place the morph at its final full size
//  I = Invert  — use transform to make it LOOK like the thumbnail
//  P = Play    — remove the transform so it animates to full size
//
//  Why this works: the morph is always full-sized underneath.
//  The GPU just scales/moves it like a flat image.
//  No width/height changes = no layout reflow = buttery smooth.
// ============================================================

const gallery = document.getElementById("gallery");
const overlay = document.getElementById("overlay");

function isMobile() {
  return window.innerWidth <= 700;
}

document.querySelectorAll(".photo-card").forEach(card => {
  card.addEventListener("click", () => {

    // ---- F: FIRST — where is the thumbnail right now? ----
    const thumb = card.querySelector("img");
    const thumbRect = thumb.getBoundingClientRect();

    // ---- Dim the gallery ----
    gallery.classList.add("dimmed");

    // ---- Build the morph at its FINAL size and position ----
    const morph = document.createElement("div");
    morph.className = "morph";
    morph.style.setProperty("--g1", card.dataset.g1);
    morph.style.setProperty("--g2", card.dataset.g2);

    const ml = isMobile() ? "3vw"  : "6vw";
    const mt = isMobile() ? "5vh"  : "10vh";
    const mw = isMobile() ? "94vw" : "88vw";
    const mh = isMobile() ? "90vh" : "80vh";

    morph.style.left   = ml;
    morph.style.top    = mt;
    morph.style.width  = mw;
    morph.style.height = mh;

    // No transition yet — need to measure it first
    morph.style.transition = "none";

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

    // ---- L: LAST — measure where the morph landed at full size ----
    const morphRect = morph.getBoundingClientRect();

    // ---- I: INVERT — transform so it looks like the thumbnail ----
    const scaleX = thumbRect.width  / morphRect.width;
    const scaleY = thumbRect.height / morphRect.height;

    const thumbCX = thumbRect.left + thumbRect.width  / 2;
    const thumbCY = thumbRect.top  + thumbRect.height / 2;
    const morphCX = morphRect.left + morphRect.width  / 2;
    const morphCY = morphRect.top  + morphRect.height / 2;

    const dx = thumbCX - morphCX;
    const dy = thumbCY - morphCY;

    morph.style.transform       = `translate(${dx}px, ${dy}px) scale(${scaleX}, ${scaleY})`;
    morph.style.transformOrigin = "center center";
    morph.style.borderRadius    = "22px";

    // ---- P: PLAY — next frame, animate to full size ----
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        morph.style.transition   = "transform .9s cubic-bezier(.22,1,.36,1), border-radius .9s cubic-bezier(.22,1,.36,1)";
        morph.style.transform    = "translate(0, 0) scale(1)";
        morph.style.borderRadius = "28px";
      });
    });

    // ---- CLOSE ----
    function closemorph() {
      morph.style.transition   = "transform .7s cubic-bezier(.22,1,.36,1), border-radius .6s cubic-bezier(.22,1,.36,1)";
      morph.style.transform    = `translate(${dx}px, ${dy}px) scale(${scaleX}, ${scaleY})`;
      morph.style.borderRadius = "22px";

      morph.addEventListener("transitionend", () => {
        morph.remove();
        overlay.classList.remove("active");
        gallery.classList.remove("dimmed");
      }, { once: true });
    }

    morph.querySelector(".close").addEventListener("click", closemorph);

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closemorph();
    }, { once: true });

  });
});
    
