
document.addEventListener('DOMContentLoaded', () => {
  const html = document.documentElement;
  const body = document.body;

  // ===== THEME TOGGLE - using update colors =====
  const themeToggle = document.getElementById("themeToggle");
  const saved = localStorage.getItem("learnhub-theme");
  if (saved) {
    html.setAttribute("data-theme", saved);
  } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    html.setAttribute("data-theme", "dark");
  } else {
    html.setAttribute("data-theme", "light");
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const current = html.getAttribute("data-theme");
      const next = current === "dark" ? "light" : "dark";
      html.setAttribute("data-theme", next);
      localStorage.setItem("learnhub-theme", next);
      themeToggle.style.transform = "rotate(180deg) scale(0.9)";
      setTimeout(() => (themeToggle.style.transform = ""), 300);
    });
  }

  // ===== HAMBURGER MENU - kept from original =====
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobileMenu");
  if (hamburger && mobileMenu) {
    hamburger.addEventListener("click", () =>
      mobileMenu.classList.toggle("open"),
    );
    mobileMenu
      .querySelectorAll("a")
      .forEach((a) =>
        a.addEventListener("click", () => mobileMenu.classList.remove("open")),
      );
  }

  // ===== FADE IN OBSERVER - original =====
  const faders = document.querySelectorAll(".fade-in");
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 },
  );
  faders.forEach((f) => io.observe(f));

  // ===== TYPING EFFECT - from update (multi-phrase) =====
  const typedEl = document.getElementById("typed");
  if (typedEl) {
    const phrases = [
      "With Direct Tutor Access",
      "Science Tutors",
      "Business Mentors",
      "Arts & Humanities",
      "Tech & Skills",
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
      const current = phrases[phraseIndex];
      if (isDeleting) {
        typedEl.textContent = current.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typedEl.textContent = current.substring(0, charIndex + 1);
        charIndex++;
      }

      let speed = isDeleting ? 500 : 40;

      if (!isDeleting && charIndex === current.length) {
        speed = 2000;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        speed = 300;
      }

      setTimeout(type, speed);
    }
    type();
  }

  // Fallback for old typing element
  const typingEl = document.getElementById("typing");
  if (typingEl && !typedEl) {
    const text = "Anywhere.";
    let i = 0;
    function typeOld() {
      if (i <= text.length) {
        typingEl.textContent = text.slice(0, i);
        i++;
        setTimeout(typeOld, 110);
      }
    }
    typeOld();
  }

  // ===== COURSE FILTERS - original =====
  const pills = document.querySelectorAll(".filter-pill");
  const cards = document.querySelectorAll(".tutor-card");
  pills.forEach((p) =>
    p.addEventListener("click", () => {
      pills.forEach((x) => x.classList.remove("active"));
      p.classList.add("active");
      const f = p.dataset.filter;
      cards.forEach((c) => {
        c.style.display =
          f === "all" || c.dataset.category === f ? "flex" : "none";
      });
    }),
  );

  // MODAL with unique video per tutor
  const modal = document.getElementById("previewModal");
  if (modal) {
    const modalTitle = document.getElementById("modalTitle");
    const modalVideo = document.getElementById("modalVideo");
    document.querySelectorAll(".btn-preview").forEach((btn) => {
      btn.addEventListener("click", () => {
        modalTitle.textContent = btn.dataset.title;
        if (modalVideo && btn.dataset.video) {
          modalVideo.querySelector("source").src = btn.dataset.video;
          modalVideo.load();
        }
        modal.classList.add("open");
      });
    });
    modal.querySelector(".modal-close").addEventListener("click", () => {
      modal.classList.remove("open");
      if (modalVideo) modalVideo.pause();
    });
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.remove("open");
        if (modalVideo) modalVideo.pause();
      }
    });
  }

  // ===== TESTIMONIALS - original =====
  const track = document.getElementById("testimonialTrack");
  const dotsContainer = document.getElementById("testimonialDots");
  if (track && dotsContainer) {
    const slides = track.children;
    let idx = 0;
    for (let j = 0; j < slides.length; j++) {
      const d = document.createElement("div");
      d.className = "dot" + (j === 0 ? " active" : "");
      d.addEventListener("click", () => go(j));
      dotsContainer.appendChild(d);
    }
    function go(n) {
      idx = n;
      track.style.transform = `translateX(-${idx * 100}%)`;
      [...dotsContainer.children].forEach((d, i) =>
        d.classList.toggle("active", i === idx),
      );
    }
    setInterval(() => go((idx + 1) % slides.length), 5200);
  }

  // ===== BILLING TOGGLE - original =====
  const billing = document.getElementById("billingToggle");
  const prices = document.querySelectorAll(".price[data-monthly]");
  if (billing) {
    billing.addEventListener("change", () => {
      const yearly = billing.checked;
      prices.forEach((p) => {
        p.textContent = "₦" + (yearly ? p.dataset.yearly : p.dataset.monthly);
      });
    });
  }

  // ===== FAQ ACCORDION - original =====
  document.querySelectorAll(".faq-q").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.parentElement;
      const open = item.classList.contains("open");
      document
        .querySelectorAll(".faq-item")
        .forEach((i) => i.classList.remove("open"));
      if (!open) item.classList.add("open");
    });
  });

  // ===== FADE IN ANIMATION =====
  const observerOptions = {
    root: null,
    threshold: 0.1, // Triggers when 10% of the card is visible
    rootMargin: "0px 0px -50px 0px", // Triggers slightly before entering viewport
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Adds a 75ms staggered delay based on the card's order
        setTimeout(() => {
          entry.target.classList.add("visible");
        }, index * 80);

        observer.unobserve(entry.target); // Keeps them visible after scroll
      }
    });
  }, observerOptions);

  // Attach observer to your course cards
  document
    .querySelectorAll(".fade-in")
    .forEach((card) => observer.observe(card));

  // ===== TOAST - original =====
  const toast = document.getElementById("toast");
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 3000);
  }
  document
    .querySelectorAll(".btn-reserve")
    .forEach((b) =>
      b.addEventListener("click", () =>
        showToast("Seat reserved! Check your email."),
      ),
    );
  const newsletterForm = document.getElementById("newsletterForm");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      showToast("Thanks for subscribing! 🎉");
      e.target.reset();
    });
  }

  // ===== BACK TO TOP - original =====
  const back = document.getElementById("backToTop");
  if (back) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 600) back.classList.add("visible");
      else back.classList.remove("visible");
    });
    back.addEventListener("click", () =>
      window.scrollTo({ top: 0, behavior: "smooth" }),
    );
  }
});
