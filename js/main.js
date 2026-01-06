const { gsap, ScrollTrigger, Swiper, AOS, lucide } = window;

if (gsap && ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
}

// PIPELINE
document.addEventListener("DOMContentLoaded", async () => {
  // Bước A: Nạp các linh kiện HTML đồng thời
  await Promise.all([
    injectComponent("header-placeholder", "src/partials/header.html"),
    injectComponent("footer-placeholder", "src/partials/footer.html"),
  ]);

  // Bước B: Khởi tạo các tính năng giao diện
  initUI();

  // Bước C: Khởi tạo các thư viện (Sticky Nav, Swiper, AOS)
  initLibraries();

  // Bước D: Đồng bộ lại tọa độ sau khi nạp xong
  if (ScrollTrigger) ScrollTrigger.refresh();
});

// --- NHÓM HÀM NẠP LINH KIỆN ---
async function injectComponent(id, filePath) {
  const el = document.getElementById(id);
  if (!el) return;
  try {
    const res = await fetch(filePath);
    if (!res.ok) throw new Error("404");
    el.innerHTML = await res.text();
    if (lucide) lucide.createIcons();
  } catch (e) {
    console.error("Lỗi nạp:", filePath);
  }
}

function initUI() {
  initMobileMenu();
  initLogoutDropdown();
  initBackToTop();
}

function initLibraries() {
  initStickyNav();
  initHeroSwiper();
  initAchievementSwiper();
  initBenefitSectionAnimations();
  initAdvantageSectionAnimations();
  initScrollReveal();
  initTextTypewriter();
  initButtonReveal();

  if (typeof AOS !== "undefined") {
    AOS.init({ duration: 800, once: false });
  }

  if (window.ScrollTrigger) ScrollTrigger.refresh();
}

function initScrollReveal() {
  // 1. Tiêu đề chính: Nhanh & Mạnh mẽ (.reveal-title)
  gsap.utils.toArray(".reveal-title").forEach((el) => {
    gsap.fromTo(
      el,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          toggleActions: "play reverse play reverse",
        },
      }
    );
  });

  // 2. Tiêu đề con: Chậm & Mượt mà (.reveal-subtitle)
  gsap.utils.toArray(".reveal-subtitle").forEach((el) => {
    gsap.fromTo(
      el,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.2,
        delay: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          toggleActions: "play reverse play reverse",
        },
      }
    );
  });
}

//  Logic Sticky Header
function initStickyNav() {
  const topHeader = document.getElementById("top-header");
  const mainNav = document.getElementById("main-nav");

  if (!topHeader || !mainNav) return;

  const topHeaderHeight = topHeader.offsetHeight;

  ScrollTrigger.create({
    start: `top+=${topHeaderHeight} top`,
    onEnter: () => {
      mainNav.classList.add("sticky-active");
      document.body.style.paddingTop = `${mainNav.offsetHeight}px`;
    },
    onLeaveBack: () => {
      mainNav.classList.remove("sticky-active");
      document.body.style.paddingTop = "0";
    },
  });
}

// Logic Swiper & GSAP Animation Slide
function initHeroSwiper() {
  const swiperEl = document.querySelector(".mySwiper");
  if (!swiperEl || typeof Swiper === "undefined") return;

  const swiper = new Swiper(".mySwiper", {
    loop: true,
    autoplay: { delay: 5000, disableOnInteraction: false },
    pagination: { el: ".swiper-pagination", clickable: true },
    on: {
      init: animateSlideContent,
      slideChangeTransitionStart: animateSlideContent,
    },
  });
}

function animateSlideContent() {
  const activeSlide = document.querySelector(".mySwiper .swiper-slide-active");
  if (!activeSlide || typeof gsap === "undefined") return;

  const title = activeSlide.querySelector(".slide-title");
  const desc = activeSlide.querySelector(".reveal-typewriter");
  const btn = activeSlide.querySelector(".reveal-btn");

  if (title) gsap.set(title, { y: 50, opacity: 0 });
  if (btn) gsap.set(btn, { scale: 0.8, opacity: 0, y: 20 });

  if (desc) {
    const rawText = desc.innerText;
    desc.innerHTML = rawText;

    const chars = splitTextAdvanced(desc);
    gsap.set(chars, { opacity: 0, y: 15 });

    gsap.to(chars, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      stagger: 0.015,
      ease: "power2.out",
      delay: 0.4,
    });
  }

  if (title) {
    gsap.to(title, {
      y: 0,
      opacity: 1,
      duration: 1,
      ease: "power4.out",
      delay: 0.2,
    });
  }
  if (btn) {
    gsap.to(btn, {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.8,
      ease: "back.out(1.7)",
      delay: 0.8,
    });
  }
}

function initBenefitSectionAnimations() {
  const cards = document.querySelectorAll(".benefit-card");
  if (cards.length === 0) return;

  gsap.fromTo(
    cards,
    { y: 100, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".benefit-section",
        start: "top 80%",
        toggleActions: "restart reverse restart reverse",
      },
    }
  );
}

function initAdvantageSectionAnimations() {
  gsap.fromTo(
    ".advantage-card",
    { x: -80, opacity: 0 },
    {
      x: 0,
      opacity: 1,
      duration: 0.6,
      stagger: 0.15,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".advantage-wrapper",
        start: "top 85%",
        toggleActions: "play reverse play reverse",
      },
    }
  );
  gsap.fromTo(
    ".advantage-video",
    { x: 80, opacity: 0 },
    {
      x: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".advantage-wrapper",
        start: "top 80%",
        toggleActions: "play reverse play reverse",
      },
    }
  );
}

function initAchievementSwiper() {
  const swiperEl = document.querySelector(".achievementSwiper");
  // Kiểm tra nếu phần tử tồn tại mới khởi tạo để tránh lỗi
  if (!swiperEl || typeof Swiper === "undefined") return;

  new Swiper(".achievementSwiper", {
    slidesPerView: 1,
    spaceBetween: 20,
    grabCursor: true,
    loop: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    breakpoints: {
      640: { slidesPerView: 2, spaceBetween: 24 },
      1024: { slidesPerView: 3, spaceBetween: 30 },
    },
  });
}

function initMobileMenu() {
  const open = document.getElementById("open-mobile-menu");
  const close = document.getElementById("close-mobile-menu");
  const drawer = document.getElementById("mobile-drawer");
  const overlay = document.getElementById("mobile-overlay");

  const toggle = (state) => {
    drawer?.classList.toggle("-translate-x-full", !state);
    overlay?.classList.toggle("hidden", !state);
  };

  open?.addEventListener("click", () => toggle(true));
  close?.addEventListener("click", () => toggle(false));
  overlay?.addEventListener("click", () => toggle(false));
}

function initLogoutDropdown() {
  const wrapper =
    document.getElementById("logoutWrapper") ||
    document.getElementById("logoutBtn");
  const dropdown = document.getElementById("logoutDropdown");
  if (!wrapper || !dropdown) return;

  wrapper.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdown.classList.toggle("hidden");
  });

  document.addEventListener("click", (e) => {
    if (!wrapper.contains(e.target)) dropdown.classList.add("hidden");
  });
}

function initBackToTop() {
  const btn = document.getElementById("backTop");
  if (!btn) return;

  window.addEventListener("scroll", () => {
    const show = window.scrollY > 200;
    btn.classList.toggle("opacity-0", !show);
    btn.classList.toggle("pointer-events-none", !show);
  });

  btn.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" })
  );
}

/**
 * Hàm tách văn bản cao cấp: Giữ nguyên cấu trúc từ để tránh vỡ dòng
 */
function splitTextAdvanced(element) {
  const text = element.innerText.trim();
  const words = text.split(/\s+/);

  element.innerHTML = words
    .map((word) => {
      const characters = word
        .split("")
        .map(
          (char) =>
            `<span class="reveal-char inline-block opacity-0 translate-y-4">${char}</span>`
        )
        .join("");

      return `<span class="inline-block whitespace-nowrap">${characters}</span>`;
    })
    .join(" ");

  return element.querySelectorAll(".reveal-char");
}

function initTextTypewriter() {
  gsap.utils.toArray(".reveal-typewriter").forEach((element) => {
    const chars = splitTextAdvanced(element);

    gsap.to(chars, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      stagger: 0.02,
      ease: "power2.out",
      scrollTrigger: {
        trigger: element,
        start: "top 90%",

        toggleActions: "restart none none none",
      },
    });
  });
}

/**
 * Hàm chuyên dụng cho Button: Nổi lên mượt mà, không giật
 */
function initButtonReveal() {
  gsap.utils.toArray(".reveal-btn").forEach((btn) => {
    gsap.fromTo(
      btn,
      {
        y: 20,
        opacity: 0,
        scale: 0.95,
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: "power3.out",
        overwrite: "auto",
        scrollTrigger: {
          trigger: btn,
          start: "top 95%",
          toggleActions: "restart none none none",
        },

        onComplete: () => gsap.set(btn, { clearProps: "transform" }),
      }
    );
  });
}

window.addEventListener("load", () => {
  ScrollTrigger.refresh();
});
