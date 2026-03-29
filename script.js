// =============================================
//  script.js — Behind the Lens by Jelly
// =============================================

const overlay       = document.getElementById("modalOverlay");
const modal         = document.getElementById("modal");
const modalImg      = document.getElementById("modalImg");
const modalImgBlur  = document.getElementById("modalImgBlur");
const modalTitle    = document.getElementById("modalTitle");
const modalMood     = document.getElementById("modalMood");
const modalMeta     = document.getElementById("modalMeta");
const modalDownload = document.getElementById("modalDownload");
const modalInfo     = document.getElementById("modalInfo");
const closeBtn      = document.getElementById("closeBtn");

// ── OPEN MODAL ──────────────────────────────
document.querySelectorAll(".photo-card").forEach(card => {
  card.addEventListener("click", () => {
    const { img, title, mood, meta, download, g1, g2 } = card.dataset;

    // Fill content
    modalImg.src           = img;
    modalImg.alt           = title;
    modalImgBlur.src       = img;   // same image for the blur layer
    modalTitle.textContent = title;
    modalMood.textContent  = mood;
    modalMeta.textContent  = meta;
    modalDownload.href     = download;

    // Gradient goes on the MODAL itself — covers everything behind the image
    // so the fade has something to blend into (no white showing through)
    const g1full = g1.replace(/[\d.]+\)$/, '1)');
    const g2full = g2.replace(/[\d.]+\)$/, '1)');
    modal.style.background = `linear-gradient(145deg, ${g1full}, ${g2full})`;

    // Show the modal
    overlay.classList.add("active");

    // Lock the page scroll while modal is open
    document.body.style.overflow = "hidden";
  });
});

// ── CLOSE MODAL ──────────────────────────────
function closeModal() {
  overlay.classList.remove("active");
  document.body.style.overflow = "";   // Restore scrolling

  // Clear the image src after the fade-out finishes
  // so there's no flash of old image on next open
  setTimeout(() => {
    modalImg.src = "";
    modalImgBlur.src = "";
  }, 320);
}

// Close button
closeBtn.addEventListener("click", closeModal);

// Click outside the modal card to close
overlay.addEventListener("click", (e) => {
  if (e.target === overlay) closeModal();
});

// Press Escape to close
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});
