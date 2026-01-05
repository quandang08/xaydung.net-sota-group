document.addEventListener("DOMContentLoaded", async () => {
  await injectComponent("header-placeholder", "src/partials/header.html");
  await injectComponent("footer-placeholder", "src/partials/footer.html");

  // KHỞI TẠO MENU MOBILE
  initMobileMenu();

  // DOM Elements
  const elements = {
    backTop: document.getElementById("backTop"),
    logoutWrapper:
      document.getElementById("logoutWrapper") ||
      document.getElementById("logoutBtn"),
    logoutDropdown: document.getElementById("logoutDropdown"),
    mobile: {
      open: document.getElementById("open-mobile-menu"),
      close: document.getElementById("close-mobile-menu"),
      drawer: document.getElementById("mobile-drawer"),
      overlay: document.getElementById("mobile-overlay"),
    },
  };

  // XỬ LÝ LOGOUT DROPDOWN
  if (elements.logoutWrapper && elements.logoutDropdown) {
    elements.logoutWrapper.addEventListener("click", (e) => {
      e.stopPropagation();
      elements.logoutDropdown.classList.toggle("hidden");
    });

    document.addEventListener("click", (e) => {
      if (!elements.logoutWrapper.contains(e.target)) {
        elements.logoutDropdown.classList.add("hidden");
      }
    });
  }

  // XỬ LÝ BACK TO TOP & SCROLL
  if (elements.backTop) {
    window.addEventListener("scroll", () => {
      const isScrolled = window.scrollY > 200;
      elements.backTop.classList.toggle("opacity-0", !isScrolled);
      elements.backTop.classList.toggle("pointer-events-none", !isScrolled);
    });

    elements.backTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // XỬ LÝ MENU MOBILE
  const toggleMobileMenu = (isOpen) => {
    if (elements.mobile.drawer && elements.mobile.overlay) {
      elements.mobile.drawer.classList.toggle("-translate-x-full", !isOpen);
      elements.mobile.overlay.classList.toggle("hidden", !isOpen);
    }
  };

  if (elements.mobile.open)
    elements.mobile.open.addEventListener("click", () =>
      toggleMobileMenu(true)
    );
  if (elements.mobile.close)
    elements.mobile.close.addEventListener("click", () =>
      toggleMobileMenu(false)
    );
  if (elements.mobile.overlay)
    elements.mobile.overlay.addEventListener("click", () =>
      toggleMobileMenu(false)
    );

  if (typeof AOS !== "undefined") AOS.init({ duration: 800, once: true });
  if (typeof lucide !== "undefined") lucide.createIcons();
});

async function injectComponent(placeholderId, filePath) {
  const el = document.getElementById(placeholderId);
  if (!el) return;

  const res = await fetch(filePath);
  const html = await res.text();
  el.innerHTML = html;

  if (window.lucide) window.lucide.createIcons();
}

function initMobileMenu() {
  const btnOpen = document.getElementById("open-mobile-menu");
  const btnClose = document.getElementById("close-mobile-menu");
  const drawer = document.getElementById("mobile-drawer");
  const overlay = document.getElementById("mobile-overlay");

  const toggle = (open) => {
    drawer?.classList.toggle("-translate-x-full", !open);
    overlay?.classList.toggle("hidden", !open);
  };

  btnOpen?.addEventListener("click", () => toggle(true));
  btnClose?.addEventListener("click", () => toggle(false));
  overlay?.addEventListener("click", () => toggle(false));
}
