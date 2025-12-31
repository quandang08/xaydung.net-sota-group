const backTop = document.getElementById("backTop");

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
