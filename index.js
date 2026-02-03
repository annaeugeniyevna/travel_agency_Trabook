// JS for burger menu

const burger = document.querySelector('.nav-burger__menu');
const menu = document.querySelector('.nav__wrap');

burger.addEventListener('click', () => {
    menu.classList.toggle('active');
});


// JS for search-dropdown

document.addEventListener('DOMContentLoaded', () => {
    const toggles = document.querySelectorAll('.search__title-wrap');

    toggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            const item = toggle.closest('.search__item');
            if (!item) return;

            const dropdown = item.querySelector('.search__dropdown-text');
            const arrow = item.querySelector('.hero__search-arrow');
            if (!dropdown) return;

            dropdown.classList.toggle('active');
            if (arrow) arrow.classList.toggle('rotate');
        });
    });
});

// Sliders (Deals, Vacation, etc.)

const sliders = document.querySelectorAll('.card__slider');

sliders.forEach(sliderEl => {
  const parent = sliderEl.closest('section') || document;
  const localDots = parent.querySelectorAll('.card__dots .dot');
  const firstCard = sliderEl.querySelector('.card');
  const localCardWidth = firstCard ? firstCard.offsetWidth + 16 : 0;

  if (!localDots.length || !localCardWidth) return;

  sliderEl.addEventListener('scroll', () => {
    const index = Math.round(sliderEl.scrollLeft / localCardWidth);

    localDots.forEach(dot => dot.classList.remove('active'));
    if (localDots[index]) localDots[index].classList.add('active');
  });
}); 


// Slider-arrow for deals section

document.querySelectorAll('.slider-section').forEach(section => {
  const slider = section.querySelector('.card__slider');
  const cards = section.querySelectorAll('.card');
  const btnNext = section.querySelector('.slider-arrow--next');
  const btnPrev = section.querySelector('.slider-arrow--prev');

  if (!slider || !cards.length || !btnNext || !btnPrev) return;

  let currentIndex = 0;

  const gap = parseInt(getComputedStyle(slider).gap) || 0;
  const cardWidth = cards[0].offsetWidth + gap;
  const maxScroll = slider.scrollWidth - slider.offsetWidth;

  function updateSlider() {
    const scrollPosition = currentIndex * cardWidth;

    slider.scrollTo({
      left: Math.min(scrollPosition, maxScroll),
      behavior: 'smooth'
    });

    btnPrev.disabled = scrollPosition <= 0;
    btnNext.disabled = scrollPosition >= maxScroll;
  }

  btnNext.addEventListener('click', () => {
    if (currentIndex < cards.length - 1) {
      currentIndex++;
      updateSlider();
    }
  });

  btnPrev.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateSlider();
    }
  });

  updateSlider();
});




// Testimonials slider (mobile touch only)

const stack = document.querySelector('.testimonials__stack');
const cards = document.querySelectorAll('.testimonial__card');

let currentIndex = 0;
let startX = 0;
let startY = 0;
let endX = 0;
let isTouching = false;
let lastX = 0;

function updateCards() {
  cards.forEach((card, index) => {
    card.classList.remove('active', 'second');

    if (index === currentIndex) {
      card.classList.add('active');
    } else if (index === (currentIndex + 1) % cards.length) {
      card.classList.add('second');
    }
  });
}
updateCards();

// Testimonials slider for desctop version

const testimonialSection = document.querySelector('.testimonials');

if (testimonialSection) {
  const cards = testimonialSection.querySelectorAll('.testimonial__card');
  const btnNext = testimonialSection.querySelector('.slider-arrow--next');
  const btnPrev = testimonialSection.querySelector('.slider-arrow--prev');

  let currentIndex = 0;

  function updateTestimonials() {
    cards.forEach((card, index) => {
      card.classList.toggle('active', index === currentIndex);
    });

    btnPrev.disabled = currentIndex === 0;
    btnNext.disabled = currentIndex === cards.length - 1;
  }

  btnNext?.addEventListener('click', () => {
    if (currentIndex < cards.length - 1) {
      currentIndex++;
      updateTestimonials();
    }
  });

  btnPrev?.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateTestimonials();
    }
  });

  updateTestimonials();
}

// Attach only touch listeners for mobile swipe
if (stack && cards.length) {
  stack.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    isTouching = true;
    lastX = startX;
  }, {passive: true});

  stack.addEventListener('touchmove', (e) => {
    if (!isTouching) return;
    const clientX = e.touches[0].clientX;
    const clientY = e.touches[0].clientY;
    const deltaX = clientX - startX;
    const deltaY = clientY - startY;
    lastX = clientX;

    // If horizontal swipe is dominant, prevent native vertical scroll
    if (Math.abs(deltaX) > Math.abs(deltaY) && e.cancelable) {
      e.preventDefault();
    }
  }, {passive: false});

  stack.addEventListener('touchend', (e) => {
    if (!isTouching) return;
    const touch = e.changedTouches && e.changedTouches[0];
    endX = touch ? touch.clientX : lastX;
    isTouching = false;
    handleSwipe();
  });
}

function handleSwipe() {
  const swipeDistance = endX - startX;
  const threshold = 50;
  if (Math.abs(swipeDistance) < threshold) return;

  if (swipeDistance < 0) {
    currentIndex = Math.min(cards.length - 1, currentIndex + 1);
  } else {
    currentIndex = Math.max(0, currentIndex - 1);
  }

  updateCards();
}