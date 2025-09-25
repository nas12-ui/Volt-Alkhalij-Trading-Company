
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

(function () {
  const carousel = document.getElementById('carousel');
  const track = document.getElementById('track');
  const prev = document.getElementById('prev');
  const next = document.getElementById('next');
  const dotsWrap = document.getElementById('dots');
  const thumbGrid = document.getElementById('thumbGrid'); 
  let items = track ? Array.from(track.children) : [];
  let index = 0;

  if (!carousel || !track || items.length === 0) {
   
    if (dotsWrap) dotsWrap.style.display = 'none';
    if (prev) prev.style.display = 'none';
    if (next) next.style.display = 'none';
    return;
  }

  function renderDots() {
    if (!dotsWrap) return;
    dotsWrap.innerHTML = '';
    for (let i = 0; i < items.length; i++) {
      const d = document.createElement('div');
      d.className = 'dot' + (i === index ? ' active' : '');
      d.dataset.i = i;
      d.addEventListener('click', (e) => {
        e.stopPropagation();
        goTo(i);
      });
      dotsWrap.appendChild(d);
    }
  }


  function getItemWidth() {
    const style = getComputedStyle(items[0]);
    const marginRight = parseFloat(style.marginRight) || 0;
    return items[0].getBoundingClientRect().width + marginRight;
  }

  
  function updateTrackPosition() {
    const itemW = getItemWidth();
    const containerW = carousel.clientWidth;
    const trackWidth = track.scrollWidth;
    
    const desired = index * itemW - (containerW - itemW) / 2;
   
    const maxTranslate = Math.max(0, trackWidth - containerW);
    const clamped = Math.min(Math.max(0, desired), maxTranslate);
    track.style.transform = `translateX(-${clamped}px)`;
  }

  function updateState() {

    const dots = dotsWrap ? Array.from(dotsWrap.children) : [];
    dots.forEach((d, i) => d.classList.toggle('active', i === index));

   
    const thumbs = thumbGrid ? Array.from(thumbGrid.querySelectorAll('.thumb')) : [];
    thumbs.forEach((t, i) => {
      t.classList.toggle('active', i === index);
    });

    if (prev) prev.disabled = index === 0;
    if (next) next.disabled = index === items.length - 1;

    updateTrackPosition();

   
    const captionEl = document.getElementById('caption');
    if (captionEl && items[index]) {
      const img = items[index].querySelector('img');
      captionEl.textContent = img ? img.alt : '';
    }
  }

  function goTo(i) {
    index = Math.max(0, Math.min(i, items.length - 1));
    updateState();
  }

  function prevSlide() { goTo(index - 1); }
  function nextSlide() { goTo((index + 1) % items.length); } 


  if (prev) prev.addEventListener('click', (e) => { e.stopPropagation(); prevSlide(); });
  if (next) next.addEventListener('click', (e) => { e.stopPropagation(); nextSlide(); });


  renderDots();
  updateState();
  
  window.addEventListener('resize', () => { setTimeout(updateState, 50); });

 
  carousel.addEventListener('click', (e) => {

    if (e.target.closest('.btn-left') || e.target.closest('.btn-right') ||
        e.target.closest('.thumb') || e.target.closest('.dot')) return;

    nextSlide();
  });


  if (thumbGrid) {
    const thumbEls = Array.from(thumbGrid.querySelectorAll('.thumb'));
    thumbEls.forEach((thumb, i) => {
     
      thumb.style.cursor = 'pointer';
      thumb.addEventListener('click', (ev) => {
        ev.stopPropagation();
        goTo(i);
      });
    });
  }

 
  items.forEach(item => {
    item.addEventListener('dblclick', (e) => {
      const img = item.querySelector && item.querySelector('img');
      if (!img) return;
      const src = img.getAttribute('src');
      if (!src) return;
      const lb = document.getElementById('lightbox');
      const lbImg = document.getElementById('lbImg');
      if (lb && lbImg) {
        lbImg.src = src;
        lb.style.display = 'flex';
      }
    });
  });

})();

const lbClose = document.getElementById('lbClose');
if (lbClose) lbClose.addEventListener('click', () => {
  const lb = document.getElementById('lightbox');
  if (lb) lb.style.display = 'none';
});
const lightbox = document.getElementById('lightbox');
if (lightbox) lightbox.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.style.display = 'none'; });


const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const form = new FormData(this);
    const name = form.get('name') || '';
    const email = form.get('email') || '';
    const phone = form.get('phone') || '';
    const company = form.get('company') || '';
    const message = form.get('message') || '';

    const to = 'gulfvolttrading@gmail.com';
    const subject = encodeURIComponent('Website enquiry from ' + name);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nCompany: ${company}\n\nMessage:\n${message}`
    );
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
  });
}
