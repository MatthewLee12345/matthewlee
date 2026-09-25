"use strict";
const toggle = document.querySelector(".menu-toggle");
const nav = document.querySelector("#site-nav");
function closeMenu(returnFocus = false) {
  nav.classList.remove("is-open");
  toggle.setAttribute("aria-expanded", "false");
  if (returnFocus) toggle.focus();
}
toggle.addEventListener("click", () => {
  const open = toggle.getAttribute("aria-expanded") !== "true";
  toggle.setAttribute("aria-expanded", String(open));
  nav.classList.toggle("is-open", open);
});
nav.addEventListener("click", (event) => {
  if (event.target.closest("a")) closeMenu();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true")
    closeMenu(true);
});
document.addEventListener("click", (event) => {
  if (!event.target.closest(".site-header")) closeMenu();
});
window
  .matchMedia("(min-width: 641px)")
  .addEventListener("change", () => closeMenu());
// Keep the listening room to one composition at a time.
const players = [...document.querySelectorAll("audio")];
players.forEach((player) =>
  player.addEventListener("play", () => {
    players.forEach((other) => {
      if (other !== player) other.pause();
    });
  }),
);
// Preserve existing bookmarks after moving the music collection to its own page.
if (
  !location.pathname.endsWith("music.html") &&
  location.hash === "#film-scoring"
) {
  location.replace("music.html#film-scoring");
} else if (location.hash === "#mir") {
  location.replace("#research");
} else if (location.hash === "#heybusking") {
  location.replace("music.html");
}
