const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
const header = document.querySelector('.site-header');
function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  navigation.classList.remove('is-open');
  header.classList.remove('menu-open');
  menuButton.innerHTML = 'Menu <span>+</span>';
}
menuButton.addEventListener('click', () => {
  const opening = menuButton.getAttribute('aria-expanded') !== 'true';
  if (!opening) return closeMenu();
  menuButton.setAttribute('aria-expanded', 'true');
  navigation.classList.add('is-open');
  header.classList.add('menu-open');
  menuButton.innerHTML = 'Close <span>−</span>';
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    closeMenu(); menuButton.focus();
  }
});
document.addEventListener('click', event => {
  if (!header.contains(event.target)) closeMenu();
});
window.matchMedia('(min-width: 701px)').addEventListener('change', closeMenu);
// Keep incoming links to sections of the previous site useful.
if (document.body.dataset.page === 'index') {
  const routes = {'#about':'about.html','#mir':'projects.html','#heybusking':'projects.html#heybusking','#film-scoring':'film-scoring.html','#contact':'about.html'};
  if (routes[location.hash]) location.replace(routes[location.hash]);
}
const clock = document.querySelector('[data-clock]');
function updateClock() {
  const now = new Date();
  clock.textContent = new Intl.DateTimeFormat('en-US',{timeZone:'America/New_York',hour:'2-digit',minute:'2-digit',hour12:false}).format(now);
  clock.dateTime = now.toISOString();
  document.querySelector('[data-year]').textContent = new Intl.DateTimeFormat('en-US',{timeZone:'America/New_York',year:'numeric'}).format(now);
}
updateClock(); setInterval(updateClock, 60000);
if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const reveals = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('is-visible'); reveals.unobserve(entry.target); }
  }), {threshold:.06});
  document.querySelectorAll('.reveal').forEach(element => {element.classList.add('is-observed'); reveals.observe(element);});
}
const hero = document.querySelector('.home-hero');
if (hero && matchMedia('(pointer:fine)').matches && !reducedMotion.matches) {
  let frame;
  hero.addEventListener('pointermove', event => {
    cancelAnimationFrame(frame);
    frame=requestAnimationFrame(()=>{
      hero.style.setProperty('--mx', `${(event.clientX / innerWidth - .5) * -16}px`);
      hero.style.setProperty('--my', `${(event.clientY / innerHeight - .5) * -12}px`);
    });
  });
}
// Load third-party players only when a visitor asks to watch.
document.querySelectorAll('.film-play').forEach(button => button.addEventListener('click', () => {
  const player=button.closest('.youtube-player');
  const iframe=document.createElement('iframe');
  iframe.src=`https://www.youtube-nocookie.com/embed/${encodeURIComponent(player.dataset.video)}?autoplay=1`;
  iframe.title=player.dataset.title;
  iframe.allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen';
  iframe.allowFullscreen=true;
  iframe.referrerPolicy='strict-origin-when-cross-origin';
  player.replaceChildren(iframe);
  iframe.focus();
}));
// Prevent orchestral tracks and the local film playing over one another.
document.querySelectorAll('audio,video').forEach(media => media.addEventListener('play', () => {
  document.querySelectorAll('audio,video').forEach(other=>{if(other!==media) other.pause();});
}));
// Fit each native card to the height reported by its own iframe.
const profileFrames = [...document.querySelectorAll('iframe.profile-card')];
if (profileFrames.length) {
  window.addEventListener('message', event => {
    const frame = profileFrames.find(candidate => candidate.contentWindow === event.source);
    if (!frame || event.origin !== new URL(frame.src).origin) return;
    let message = event.data;
    if (typeof message === 'string') {
      try { message = JSON.parse(message); } catch { return; }
    }
    if (!message || typeof message !== 'object') return;
    const height = message.type === 'MEASURE' ? message.details?.height : message.height;
    if (typeof height === 'number' && Number.isFinite(height) && height >= 180 && height <= 1400) {
      frame.style.height = (Math.ceil(height) + 2) + 'px';
    }
  });
}
