// ============================================================
//  BEHIND THE LENS — script.js
// ============================================================

const gallery = document.getElementById("gallery");
const overlay = document.getElementById("overlay");

function isMobile() {
  return window.innerWidth <= 700;
}

document.querySelectorAll(".photo-card").forEach(card => {
  card.addEventListener("click", () => {

    // ---- F: FIRST — measure the thumbnail's position ----
    const thumb = card.querySelector("img");
    const thumbRect = thumb.getBoundingClientRect();

    gallery.classList.add("dimmed");

    // ---- Build morph at final size ----
    const morph = document.createElement("div");
    morph.className = "morph";
    morph.style.setProperty("--g1", card.dataset.g1);
    morph.style.setProperty("--g2", card.dataset.g2);

    // Final position values
    // Mobile: compact card, not full screen — centred with breathing room
    const ml = isMobile() ? "5vw"  : "6vw";
    const mt = isMobile() ? "12vh" : "10vh";
    const mw = isMobile() ? "90vw" : "88vw";
    const mh = isMobile() ? "76vh" : "80vh";

    morph.style.left       = ml;
    morph.style.top        = mt;
    morph.style.width      = mw;
    morph.style.height     = mh;
    morph.style.transition = "none";

    // img-wrap wraps the photo + the fade overlay
    // The fade div fades the bottom of the photo into the panel colour
    morph.innerHTML = `
      <span class="close" title="Close">×</span>
      <div class="img-wrap">
        <img src="${card.dataset.img}" alt="${card.dataset.title}">
        <div class="img-fade"></div>
      </div>
      <div class="info">
        <h2>${card.dataset.title}</h2>
        <p class="mood">${card.dataset.mood}</p>
        <p class="meta">${card.dataset.meta}</p>
        <a class="download" href="${card.dataset.download}" target="_blank" rel="noopener">↓ Download</a>
      </div>
    `;

    overlay.appendChild(morph);
    overlay.classList.add("active");

    // ---- L: LAST — measure morph at full size ----
    const morphRect = morph.getBoundingClientRect();

    // ---- I: INVERT — transform to look like the thumbnail ----
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

    // ---- P: PLAY — animate to full size ----
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        morph.style.transition   = "transform .9s cubic-bezier(.22,1,.36,1), border-radius .9s cubic-bezier(.22,1,.36,1)";
        morph.style.transform    = "translate(0, 0) scale(1)";
        morph.style.borderRadius = "28px";
      });
    });

    // ---- CLOSE — animate back to thumbnail ----
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
      
