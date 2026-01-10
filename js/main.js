/**
 * @module Core_Initialization
 * @description Điểm khởi chạy hệ thống (Entry Point).
 * Quản lý vòng đời ứng dụng, nạp linh kiện (Components) và kích hoạt các thư viện bổ trợ.
 */

const { gsap, ScrollTrigger, Swiper, AOS, lucide, Lenis } = window;
let lenis;

if (gsap && ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
}

document.addEventListener("DOMContentLoaded", async () => {
  await Promise.all([
    injectComponent("header-placeholder", "src/partials/header.html"),
    injectComponent("footer-placeholder", "src/partials/footer.html"),
  ]);

  initUI();
  initLibraries();

  window.addEventListener("load", () => {
    if (window.ScrollTrigger) {
      ScrollTrigger.refresh();
    }
  });
});

async function injectComponent(id, filePath) {
  const el = document.getElementById(id);
  if (!el) return;
  try {
    const res = await fetch(filePath);
    if (!res.ok) throw new Error("Không tìm thấy tệp linh kiện: " + filePath);
    el.innerHTML = await res.text();

    if (lucide) lucide.createIcons();
  } catch (e) {
    console.error("Lỗi nạp linh kiện hệ thống:", filePath, e);
  }
}

/**
 * @group UI_INTERACTION
 * @description Quản lý các tương tác giao diện cơ bản và sự kiện người dùng.
 */
function initUI() {
  initMobileMenu();
  initLogoutDropdown();
  initBackToTop();
}

/**
 * @group LIBRARIES_ANIMATION
 * @description Khởi tạo thư viện bên thứ ba và hệ thống GSAP.
 */
function initLibraries() {
  initSmoothScroll();
  initScrollReveal();
  initTextTypewriter();
  initStickyNav();
  initHeroSwiper();
  initAchievementSwiper();
  initProcessStepsReveal();
  initBenefitSectionAnimations();
  initAdvantageSectionAnimations();
  initNewsSectionAnimations();
  // initSectionBackgroundAnimations();
  initButtonReveal();

  if (typeof AOS !== "undefined") {
    AOS.init({ duration: 800, once: false });
  }

  if (window.ScrollTrigger) ScrollTrigger.refresh();
}
/**
 * @function initScrollReveal
 * @description Khởi tạo hiệu ứng hiển thị (Reveal) cho các thành phần văn bản.
 * @group ANIMATION_ELEMENTS
 * * @example
 * - .reveal-title: Xuất hiện nhanh (0.7s), dứt khoát, dùng cho tiêu đề chính.
 * - .reveal-subtitle: Xuất hiện chậm (1.2s), mượt mà, dùng cho tiêu đề phụ.
 * * @requires gsap, ScrollTrigger
 */
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
          toggleActions: "restart none none none",
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

/**
 * @function initStickyNav
 * @description Kiểm soát trạng thái Sticky của thanh menu chính dựa trên vị trí cuộn trang.
 * @group LAYOUT_COMPONENTS
 * * @logic
 * - Khi cuộn qua Top-Header: Kích hoạt class 'sticky-active' và bù trừ Padding cho Body.
 * - Khi cuộn về đầu trang: Gỡ bỏ trạng thái Sticky và trả lại Padding mặc định.
 * * @requires ScrollTrigger
 */
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

/**
 * @function initHeroSwiper
 * @description Khởi tạo Slider biểu ngữ chính (Hero Section) và quản lý hiệu ứng nội dung.
 * @group LAYOUT_COMPONENTS
 * * @callback animateSlideContent - Hàm thực hiện animation cho Text và Button trong Slide.
 * @requires Swiper.js, gsap
 */
function initHeroSwiper() {
  const swiperEl = document.querySelector(".mySwiper");
  if (!swiperEl || typeof Swiper === "undefined") return;

  const swiper = new Swiper(".mySwiper", {
    loop: true,
    effect: "fade",
    fadeEffect: { crossFade: true },
    speed: 1200,
    parallax: true,
    autoplay: { delay: 6000, disableOnInteraction: false },
    pagination: { el: ".swiper-pagination", clickable: true },
    on: {
      init: animateSlideContent,
      slideChangeTransitionStart: animateSlideContent,
    },
  });
}

/**
 * @function animateSlideContent
 * @description Quản lý và thực thi các chuỗi hiệu ứng (Animation Sequence) cho nội dung bên trong Slide đang hiển thị.
 * @group ANIMATION_ELEMENTS
 * * @workflow
 * 1. Xác định Slide hiện hành (Active Slide) để cô lập phạm vi hiệu ứng.
 * 2. Khởi tạo trạng thái ẩn (gsap.set) cho Tiêu đề và Nút bấm để tránh hiện tượng nháy nội dung (FOUC).
 * 3. Thực thi thuật toán SplitText cho phần mô tả để chạy hiệu ứng gõ chữ.
 * 4. Kích hoạt Timeline theo thứ tự: Title (0.2s) -> Description (0.4s) -> Button (0.8s).
 * * @requires gsap, splitTextAdvanced
 */
function animateSlideContent() {
  const activeSlide = document.querySelector(".mySwiper .swiper-slide-active");
  if (!activeSlide || typeof gsap === "undefined") return;

  const title = activeSlide.querySelector(".slide-title");
  const desc = activeSlide.querySelector(".reveal-typewriter");
  const btn = activeSlide.querySelector(".reveal-btn");
  const bg = activeSlide.querySelector(".bg-cover");

  gsap.killTweensOf([title, desc, btn, bg]);

  if (title) gsap.set(title, { y: 30, opacity: 0 });
  if (btn) gsap.set(btn, { y: 20, opacity: 0, scale: 0.9 });
  if (bg) gsap.set(bg, { scale: 1.2 });

  if (desc) {
    const chars = splitTextAdvanced(desc);
    gsap.set(chars, { opacity: 0, y: 10 });
    gsap.to(chars, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.01,
      ease: "power2.out",
      delay: 0.6,
    });
  }

  if (title) {
    gsap.to(title, {
      y: 0,
      opacity: 1,
      duration: 1.2,
      ease: "expo.out",
      delay: 0.3,
    });
  }

  if (btn) {
    gsap.to(btn, {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 1,
      ease: "power3.out",
      delay: 0.9,
    });
  }

  if (bg) {
    gsap.to(bg, { scale: 1, duration: 6, ease: "linear" });
  }
}
/**
 * @function initBenefitSectionAnimations
 * @description Khởi tạo hiệu ứng hiển thị danh sách thẻ lợi ích (Benefit Cards).
 * @group SECTION_ANIMATIONS
 * @logic
 * - Sử dụng kỹ thuật Stagger để tạo hiệu ứng các thẻ hiện lên nối đuôi nhau.
 * - Vector di chuyển: 100px từ dưới lên trên (Y-axis).
 * @requires gsap, ScrollTrigger
 */
function initBenefitSectionAnimations() {
  const cards = document.querySelectorAll(".benefit-card");
  if (cards.length === 0) return;

  gsap.set(cards, {
    y: 60,
    opacity: 0,
    scale: 0.98,
  });

  ScrollTrigger.batch(cards, {
    onEnter: (elements) => {
      gsap.to(elements, {
        opacity: 1,
        y: 0,
        scale: 1,
        stagger: 0.2,
        duration: 1.2,
        ease: "expo.out",
        overwrite: true,
      });
    },
    onLeaveBack: (elements) => {
      gsap.to(elements, {
        opacity: 0,
        y: 60,
        scale: 0.98,
        duration: 0.8,
        ease: "power2.inOut",
        overwrite: true,
      });
    },
    start: "top 85%",
  });
}
/**
 * @function initAdvantageSectionAnimations
 * @description Quản lý hiệu ứng hội tụ của khối nội dung ưu thế và thành phần Video.
 * @group SECTION_ANIMATIONS
 * @logic
 * - .advantage-card: Trượt từ trái qua (x: -80) với hiệu ứng nối đuôi nhanh.
 * - .advantage-video: Trượt từ phải qua (x: 80) tạo sự cân bằng thị giác.
 * @requires gsap, ScrollTrigger
 */
function initAdvantageSectionAnimations() {
  const wrapper = document.querySelector(".advantage-wrapper");
  if (!wrapper) return;

  // Animation cho các thẻ Advantage
  gsap.from(".advantage-card", {
    x: -40,
    opacity: 0,
    duration: 1.2,
    stagger: 0.15,
    ease: "expo.out",
    scrollTrigger: {
      trigger: ".advantage-wrapper",
      start: "top 85%",

      toggleActions: "play none none reverse",
    },
  });

  // Animation cho Video Showcase
  gsap.from(".advantage-video", {
    x: 40,
    scale: 0.98,
    opacity: 0,
    duration: 1.5,
    ease: "expo.out",
    scrollTrigger: {
      trigger: ".advantage-video",
      start: "top 80%",
      toggleActions: "play none none reverse",
    },
  });
}

/**
 * @function initAchievementSwiper
 * @description Khởi tạo và cấu hình trình chiếu danh sách thành tựu doanh nghiệp.
 * @group LAYOUT_COMPONENTS
 * @feature
 * - Tự động thay đổi số lượng Slide hiển thị (1-2-3) dựa trên Breakpoints.
 * - Chế độ Loop và GrabCursor tăng cường trải nghiệm tương tác thực tế.
 * @requires Swiper.js
 */
function initAchievementSwiper() {
  const swiperEl = document.querySelector(".achievementSwiper");
  if (!swiperEl || typeof Swiper === "undefined") return;

  new Swiper(".achievementSwiper", {
    slidesPerView: 1,
    spaceBetween: 30,
    grabCursor: true,
    loop: true,
    speed: 1200,
    watchSlidesProgress: true,

    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },

    pagination: {
      el: ".swiper-pagination",
      clickable: true,
      renderBullet: function (index, className) {
        return `<span class="${className} !w-10 !h-[2px] !rounded-none !bg-white/10 !mx-1 transition-all duration-500"></span>`;
      },
    },

    breakpoints: {
      768: { slidesPerView: 2, spaceBetween: 40 },
      1024: { slidesPerView: 3, spaceBetween: 50 },
    },
  });
}

/**
 * @function initMobileMenu
 * @description Điều khiển trạng thái hiển thị của Menu điều hướng trên thiết bị di động.
 * @group UI_INTERACTION
 * @logic
 * - Sử dụng phương thức toggle để thêm/xóa class '-translate-x-full' của Tailwind CSS.
 * - Quản lý đồng thời trạng thái ẩn/hiện của lớp phủ (Overlay) để tối ưu trải nghiệm người dùng.
 */
function initMobileMenu() {
  const open = document.getElementById("open-mobile-menu");
  const close = document.getElementById("close-mobile-menu");
  const drawer = document.getElementById("mobile-drawer");
  const overlay = document.getElementById("mobile-overlay");
  const menuItems = document.querySelectorAll(".menu-item");

  if (!drawer || !overlay) return;

  gsap.set(menuItems, { x: -20, opacity: 0 });
  gsap.set(overlay, { opacity: 0, visibility: "hidden" });

  const toggle = (state) => {
    drawer.classList.toggle("-translate-x-full", !state);

    if (state) {
      gsap.to(overlay, {
        opacity: 1,
        visibility: "visible",
        duration: 0.4,
        ease: "power2.out",
      });

      gsap.to(menuItems, {
        x: 0,
        opacity: 1,
        stagger: 0.1,
        duration: 0.6,
        ease: "expo.out",
        delay: 0.3,
        overwrite: true,
      });

      if (lenis) lenis.stop();
    } else {
      gsap.to(overlay, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => gsap.set(overlay, { visibility: "hidden" }),
      });

      gsap.to(menuItems, {
        x: -20,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        overwrite: true,
      });

      if (lenis) lenis.start();
    }
  };

  open?.addEventListener("click", () => toggle(true));
  close?.addEventListener("click", () => toggle(false));
  overlay?.addEventListener("click", () => toggle(false));
}

/**
 * @function initLogoutDropdown
 * @description Quản lý tương tác hiển thị menu thả xuống (Dropdown) cho mục tài khoản/đăng xuất.
 * @group UI_INTERACTION
 * @feature
 * - Chống nổi bọt sự kiện (Propagation) để tránh xung đột với các vùng click khác.
 * - Cơ chế 'Click Outside': Tự động đóng menu khi người dùng click vào vùng trống bên ngoài.
 */
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

/**
 * @function initBackToTop
 * @description Kiểm soát hiển thị và chức năng của nút hỗ trợ cuộn nhanh lên đầu trang.
 * @group UI_INTERACTION
 * @logic
 * - Theo dõi sự kiện Scroll: Chỉ hiển thị nút khi người dùng cuộn quá ngưỡng 200px.
 * - Chế độ cuộn Smooth: Sử dụng Web API native để đảm bảo chuyển động cuộn mượt mà.
 */
function initBackToTop() {
  const btn = document.getElementById("backTop");
  if (!btn) return;

  window.addEventListener("scroll", () => {
    const show = window.scrollY > 200;
    btn.classList.toggle("opacity-0", !show);
    btn.classList.toggle("pointer-events-none", !show);
  });

  btn.addEventListener("click", () => {
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.5 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });
}

/**
 * @function splitTextAdvanced
 * @description Giải thuật tách văn bản cao cấp giúp bảo toàn cấu trúc từ khi thực hiện hiệu ứng chữ.
 * @group UTILS
 * @param {HTMLElement} element - Phần tử văn bản cần xử lý.
 * @returns {NodeList} Danh sách các thẻ <span> chứa từng ký tự (class .reveal-char).
 * @logic
 * - Bước 1: Tách văn bản thành mảng các từ (words) dựa trên khoảng trắng.
 * - Bước 2: Bọc từng từ trong thẻ <span> với thuộc tính 'whitespace-nowrap' để ngăn chặn lỗi ngắt dòng sai vị trí (word-break) trên Mobile.
 * - Bước 3: Tách từng ký tự trong từ để gán class hiệu ứng riêng biệt.
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

/**
 * @function initTextTypewriter
 * @description Khởi tạo hiệu ứng gõ chữ (Typewriter) cho các đoạn văn bản dài.
 * @group ANIMATION_ELEMENTS
 * @requires splitTextAdvanced
 * @logic
 * - Sử dụng kỹ thuật Stagger (0.02s) để tạo hiệu ứng gõ liên tục mượt mà.
 * - Kích hoạt dựa trên vị trí cuộn trang (Top 90%) để đảm bảo người dùng bắt đầu đọc từ đầu đoạn.
 */
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
 * @function initButtonReveal
 * @description Hiệu ứng hiển thị chuyên dụng cho các nút bấm (CTA), đảm bảo tính nhất quán với CSS Hover.
 * @group ANIMATION_ELEMENTS
 * @feature
 * - Kết hợp Scale và Translate để tạo cảm giác nút "nảy" lên từ nền trang.
 * - Cơ chế 'clearProps': Tự động dọn dẹp thuộc tính 'transform' sau khi hoàn tất hiệu ứng để trả lại quyền điều khiển cho CSS Hover/Active.
 * - 'overwrite: auto': Ngăn chặn xung đột nếu hiệu ứng bị kích hoạt nhiều lần liên tiếp.
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

/**
 * @function initSectionBackgroundAnimations
 * @description Quản lý hiệu ứng chuyển động đa tầng cho Section nền và các khối hình học (Blobs).
 * @group SECTION_ANIMATIONS
 * @logic
 * - Section Entry: Cả vùng chứa trượt từ dưới lên (y: 100) để tạo sự vững chãi.
 * - Blob Intro: Các hình tròn xuất hiện với hiệu ứng Elastic (nảy) tạo sự thân thiện.
 * - Morphing Loop:
 * + Center Blob: Phập phồng nhẹ theo tỷ lệ scale.
 * + Corner Blob: Thay đổi bán kính góc (borderRadius) để giả lập hiệu ứng Morphing chuyên nghiệp.
 * @requires gsap, ScrollTrigger
 */
function initSectionBackgroundAnimations() {
  const section = document.querySelector(".reveal-section");
  if (!section) return;

  const blobCorner = section.querySelector(".blob-corner");
  const blobCenter = section.querySelector(".blob-center");

  gsap.fromTo(
    section,
    { y: 100, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 1.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: section,
        start: "top 85%",
        toggleActions: "restart none none none",
      },
    }
  );

  // Hiệu ứng cho 2 hình tròn
  const blobsTl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top 70%",
    },
  });

  blobsTl.from([blobCorner, blobCenter], {
    scale: 0,
    opacity: 0,
    duration: 1.5,
    stagger: 0.3,
    ease: "elastic.out(1, 0.5)",
  });

  // Hiệu ứng Chuyển động liên tục (Morphing effect)
  gsap.to(blobCenter, {
    scale: 1.1,
    duration: 4,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  });

  gsap.to(blobCorner, {
    x: -20,
    y: -20,
    borderRadius: "40% 60% 70% 30% / 40% 50% 60% 50%",
    duration: 6,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  });
}

/**
 * @function initNewsSectionAnimations
 * @description Hiệu ứng hiển thị đối xứng cho cấu trúc Grid tin tức 2 cột.
 * @group SECTION_ANIMATIONS
 * @logic
 * - Left Column: Tin nổi bật trượt từ trái sang (x: -100) dứt khoát.
 * - Right Column: Danh sách tin phụ trượt từ phải sang (x: 100), áp dụng Stagger (0.2s) để hiển thị tuần tự.
 * @feature Tạo cảm giác "khép lại" (Closing effect) để thu hút thị giác vào giữa màn hình.
 */
function initNewsSectionAnimations() {
  gsap.fromTo(
    ".reveal-left",
    { x: -100, opacity: 0 },
    {
      x: 0,
      opacity: 1,
      duration: 1.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".reveal-left",
        start: "top 85%",
        toggleActions: "restart none none none",
      },
    }
  );
  const rightItems = gsap.utils.toArray(".reveal-right > div");
  gsap.fromTo(
    rightItems,
    { x: 100, opacity: 0 },
    {
      x: 0,
      opacity: 1,
      duration: 1,
      stagger: 0.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".reveal-right",
        start: "top 85%",
        toggleActions: "restart none none none",
      },
    }
  );
}

/**
 * @function initProcessStepsReveal
 * @description Khởi tạo hiệu ứng trình diễn các bước quy trình (Step-by-step) với nhịp điệu tăng dần.
 * @group ANIMATION_ELEMENTS
 * @logic
 * - Biến thiên Duration: Bước sau có thời gian hiện ra dài hơn bước trước, tạo cảm giác lắng đọng.
 * - Biến thiên Delay: Tạo hiệu ứng làn sóng nối đuôi (Staggered Wave).
 * - ToggleActions: Sử dụng 'reset' ở vị trí onLeaveBack để đảm bảo quy trình luôn bắt đầu lại từ đầu khi cuộn ngược.
 * @param {string} .process-step - Class định danh từng bước trong quy trình.
 */
function initProcessStepsReveal() {
  const steps = gsap.utils.toArray(".process-step");

  gsap.fromTo(
    steps,
    {
      opacity: 0,
      y: 50,
    },
    {
      opacity: 1,
      y: 0,
      // Thời gian chạy (duration) tăng dần: 0.5s, 0.6s, 0.7s...
      duration: (i) => 0.5 + i * 0.15,

      // Thời gian trễ (delay) tăng dần để tạo hiệu ứng nối đuôi
      delay: (i) => i * 0.2,

      ease: "power3.out",
      scrollTrigger: {
        trigger: ".process-section",
        start: "top 80%",
        toggleActions: "restart none none reset",
      },
    }
  );
}

/**
 * @function initSmoothScroll
 * @description Khởi tạo Lenis Smooth Scroll và đồng bộ hóa với GSAP ScrollTrigger.
 * @group LIBRARIES_ANIMATION
 */
function initSmoothScroll() {
  if (typeof Lenis === "undefined") return;

  // 1. Khởi tạo Lenis
  lenis = new Lenis({
    duration: 1.5,
    lerp: 0.1,
    smoothWheel: true,
    wheelMultiplier: 1,
  });

  // 2. Đồng bộ với ScrollTrigger
  // Mỗi khi Lenis cuộn, nó phải báo cho ScrollTrigger cập nhật vị trí
  lenis.on("scroll", ScrollTrigger.update);

  // 3. Sử dụng khung hình của GSAP để chạy vòng lặp Lenis (Tối ưu hiệu năng)
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  // 4. Tắt làm mịn lag của GSAP để không xung đột với Lenis
  gsap.ticker.lagSmoothing(0);
}

window.addEventListener("load", () => {
  ScrollTrigger.refresh();
});
