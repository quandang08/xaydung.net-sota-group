const backTop = document.getElementById("backTop");

const btn = document.getElementById('logoutBtn');
const dropdown = document.getElementById('logoutDropdown');

btn.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.toggle('hidden');
});

// Click ra ngoài thì đóng menu
document.addEventListener('click', () => dropdown.classList.add('hidden'));
// Ẩn / hiện theo vị trí cuộn
window.addEventListener("scroll", () => {
  if (window.scrollY > 200) {
    backTop.classList.remove("opacity-0", "pointer-events-none");
  } else {
    backTop.classList.add("opacity-0", "pointer-events-none");
  }
});

// Click -> scroll mượt lên đầu trang
backTop.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

const logoutWrapper = document.getElementById("logoutWrapper");
const logoutDropdown = document.getElementById("logoutDropdown");

logoutWrapper.addEventListener("click", () => {
  logoutDropdown.classList.toggle("hidden");
});

document.addEventListener("click", (e) => {
  if (!logoutWrapper.contains(e.target)) {
    logoutDropdown.classList.add("hidden");
  }
});

// Xử lý đóng/mở menu mobile
document.addEventListener('DOMContentLoaded', () => {
    const openBtn = document.getElementById('open-mobile-menu');
    const closeBtn = document.getElementById('close-mobile-menu');
    const drawer = document.getElementById('mobile-drawer');
    const overlay = document.getElementById('mobile-overlay');

    function openMenu() {
        drawer.classList.remove('-translate-x-full');
        overlay.classList.remove('hidden');
    }

    function closeMenu() {
        drawer.classList.add('-translate-x-full');
        overlay.classList.add('hidden');
    }

    if(openBtn) openBtn.addEventListener('click', openMenu);
    if(closeBtn) closeBtn.addEventListener('click', closeMenu);
    if(overlay) overlay.addEventListener('click', closeMenu);
});