/* ==========================================================================
   DENTISTA CLINIC - Interactive Application Logic (app.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initServiceFilters();
  initBeforeAfterSlider();
  initGallerySlider();
  initReviewsSlider();
  initFaqAccordion();
  initDateDefaults();
});

/* --------------------------------------------------------------------------
   1. Navigation & Header Scrolling State
   -------------------------------------------------------------------------- */
function initNavigation() {
  const headerNav = document.getElementById('header-nav');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Sticky header class on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      headerNav.classList.add('scrolled');
    } else {
      headerNav.classList.remove('scrolled');
    }
    highlightNavOnScroll();
  });

  // Mobile menu toggle
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const icon = mobileToggle.querySelector('i');
      if (navMenu.classList.contains('active')) {
        icon.className = 'fa-solid fa-xmark';
      } else {
        icon.className = 'fa-solid fa-bars';
      }
    });

    // Close mobile menu when clicking link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const icon = mobileToggle.querySelector('i');
        if (icon) icon.className = 'fa-solid fa-bars';
      });
    });
  }
}

function highlightNavOnScroll() {
  const sections = document.querySelectorAll('section[id]');
  const scrollY = window.pageYOffset;

  sections.forEach(section => {
    const sectionHeight = section.offsetHeight;
    const sectionTop = section.offsetTop - 120;
    const sectionId = section.getAttribute('id');
    const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

    if (navLink) {
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLink.classList.add('active');
      } else {
        navLink.classList.remove('active');
      }
    }
  });
}

/* --------------------------------------------------------------------------
   2. Service / Treatment Filter Tabs
   -------------------------------------------------------------------------- */
function initServiceFilters() {
  // Global filter function attached to window for inline onclick accessibility
  window.filterServices = function(category) {
    const tabBtns = document.querySelectorAll('.filter-tabs .tab-btn');
    const cards = document.querySelectorAll('#services-grid .service-card');

    tabBtns.forEach(btn => {
      if (btn.getAttribute('onclick').includes(category)) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    cards.forEach(card => {
      const cardCat = card.getAttribute('data-category');
      if (category === 'all' || cardCat === category) {
        card.style.display = 'flex';
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, 50);
      } else {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
          card.style.display = 'none';
        }, 300);
      }
    });
  };
}

/* --------------------------------------------------------------------------
   3. Interactive Before & After Drag Slider
   -------------------------------------------------------------------------- */
function initBeforeAfterSlider() {
  const rangeInput = document.getElementById('range-slider');
  const afterImgBox = document.getElementById('comparison-after');
  const sliderHandle = document.getElementById('slider-handle');

  if (rangeInput && afterImgBox && sliderHandle) {
    rangeInput.addEventListener('input', (e) => {
      const val = e.target.value;
      afterImgBox.style.width = `${val}%`;
      sliderHandle.style.left = `${val}%`;
    });
  }

  // Interactive Case Switcher
  window.switchCase = function(caseType) {
    const beforeImg = document.getElementById('comparison-before-img');
    const afterImg = document.getElementById('comparison-after-img');
    const buttons = document.querySelectorAll('.case-btn');

    buttons.forEach(btn => btn.classList.remove('active'));

    if (caseType === 'veneers') {
      const btn = document.getElementById('case-veneers-btn');
      if (btn) btn.classList.add('active');
      if (beforeImg) beforeImg.src = './after_veneers.png';
      if (afterImg) afterImg.src = './before_veneers.png';
    } else if (caseType === 'whitening') {
      const btn = document.getElementById('case-whitening-btn');
      if (btn) btn.classList.add('active');
      if (beforeImg) beforeImg.src = 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1200&q=90';
      if (afterImg) afterImg.src = 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&w=1200&q=90';
    } else if (caseType === 'crowns') {
      const btn = document.getElementById('case-crowns-btn');
      if (btn) btn.classList.add('active');
      if (beforeImg) beforeImg.src = 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=1200&q=90';
      if (afterImg) afterImg.src = 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=90';
    }
  };
}

/* --------------------------------------------------------------------------
   4. Gallery Carousel Slider (3 Cards per slide on Desktop)
   -------------------------------------------------------------------------- */
function initGallerySlider() {
  const track = document.getElementById('gallery-track');
  const slides = document.querySelectorAll('.gallery-slide');
  const prevBtn = document.getElementById('gallery-prev');
  const nextBtn = document.getElementById('gallery-next');
  const dotsContainer = document.getElementById('gallery-dots');

  if (!track || slides.length === 0) return;

  let currentIndex = 0;
  let slidesPerView = getSlidesPerView();
  let totalSteps = Math.ceil(slides.length / slidesPerView);
  let autoSlideTimer = null;

  function getSlidesPerView() {
    if (window.innerWidth <= 600) return 1;
    if (window.innerWidth <= 992) return 2;
    return 3;
  }

  function createDots() {
    dotsContainer.innerHTML = '';
    totalSteps = Math.max(1, slides.length - slidesPerView + 1);
    for (let i = 0; i < totalSteps; i++) {
      const dot = document.createElement('div');
      dot.className = `dot ${i === currentIndex ? 'active' : ''}`;
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    }
  }

  function updateSliderPosition() {
    const slideWidthPercent = 100 / slidesPerView;
    const gapOffset = 24 * (currentIndex / slidesPerView);
    track.style.transform = `translateX(-${currentIndex * slideWidthPercent}%)`;

    // Update dots
    const dots = dotsContainer.querySelectorAll('.dot');
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentIndex);
    });
  }

  function goToSlide(index) {
    totalSteps = Math.max(1, slides.length - slidesPerView + 1);
    if (index < 0) {
      currentIndex = totalSteps - 1;
    } else if (index >= totalSteps) {
      currentIndex = 0;
    } else {
      currentIndex = index;
    }
    updateSliderPosition();
  }

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  function prevSlide() {
    goToSlide(currentIndex - 1);
  }

  if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetTimer(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetTimer(); });

  function startTimer() {
    autoSlideTimer = setInterval(nextSlide, 4000);
  }

  function resetTimer() {
    clearInterval(autoSlideTimer);
    startTimer();
  }

  // Hover pause
  track.addEventListener('mouseenter', () => clearInterval(autoSlideTimer));
  track.addEventListener('mouseleave', () => startTimer());

  window.addEventListener('resize', () => {
    slidesPerView = getSlidesPerView();
    createDots();
    goToSlide(0);
  });

  createDots();
  startTimer();
}

/* --------------------------------------------------------------------------
   5. Reviews Carousel Slider (3 Cards per slide on Desktop)
   -------------------------------------------------------------------------- */
function initReviewsSlider() {
  const track = document.getElementById('reviews-track');
  const slides = document.querySelectorAll('.review-slide');
  const prevBtn = document.getElementById('reviews-prev');
  const nextBtn = document.getElementById('reviews-next');
  const dotsContainer = document.getElementById('reviews-dots');

  if (!track || slides.length === 0) return;

  let currentIndex = 0;
  let slidesPerView = getSlidesPerView();
  let totalSteps = Math.max(1, slides.length - slidesPerView + 1);
  let autoSlideTimer = null;

  function getSlidesPerView() {
    if (window.innerWidth <= 600) return 1;
    if (window.innerWidth <= 992) return 2;
    return 3;
  }

  function createDots() {
    dotsContainer.innerHTML = '';
    totalSteps = Math.max(1, slides.length - slidesPerView + 1);
    for (let i = 0; i < totalSteps; i++) {
      const dot = document.createElement('div');
      dot.className = `dot ${i === currentIndex ? 'active' : ''}`;
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    }
  }

  function updateSliderPosition() {
    const slideWidthPercent = 100 / slidesPerView;
    track.style.transform = `translateX(-${currentIndex * slideWidthPercent}%)`;

    const dots = dotsContainer.querySelectorAll('.dot');
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentIndex);
    });
  }

  function goToSlide(index) {
    totalSteps = Math.max(1, slides.length - slidesPerView + 1);
    if (index < 0) {
      currentIndex = totalSteps - 1;
    } else if (index >= totalSteps) {
      currentIndex = 0;
    } else {
      currentIndex = index;
    }
    updateSliderPosition();
  }

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  function prevSlide() {
    goToSlide(currentIndex - 1);
  }

  if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetTimer(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetTimer(); });

  function startTimer() {
    autoSlideTimer = setInterval(nextSlide, 4500);
  }

  function resetTimer() {
    clearInterval(autoSlideTimer);
    startTimer();
  }

  track.addEventListener('mouseenter', () => clearInterval(autoSlideTimer));
  track.addEventListener('mouseleave', () => startTimer());

  window.addEventListener('resize', () => {
    slidesPerView = getSlidesPerView();
    createDots();
    goToSlide(0);
  });

  createDots();
  startTimer();
}

/* --------------------------------------------------------------------------
   6. FAQ Accordion Toggle
   -------------------------------------------------------------------------- */
function initFaqAccordion() {
  window.toggleFaq = function(element) {
    const parent = element.parentElement;
    const isActive = parent.classList.contains('active');

    // Close all FAQs
    document.querySelectorAll('.faq-item').forEach(item => {
      item.classList.remove('active');
    });

    // Toggle clicked
    if (!isActive) {
      parent.classList.add('active');
    }
  };
}

/* --------------------------------------------------------------------------
   7. Form Defaults & Appointment Handling
   -------------------------------------------------------------------------- */
function initDateDefaults() {
  const today = new Date().toISOString().split('T')[0];
  const dateInput = document.getElementById('patient-date');
  const modalDateInput = document.getElementById('modal-patient-date');

  if (dateInput) {
    dateInput.min = today;
    dateInput.value = today;
  }
  if (modalDateInput) {
    modalDateInput.min = today;
    modalDateInput.value = today;
  }
}

// Booking Modal Triggers
window.openBookingModal = function(treatmentName = '') {
  const modal = document.getElementById('booking-modal');
  const title = document.getElementById('modal-treatment-title');
  if (treatmentName) {
    title.innerText = `Book ${treatmentName}`;
  } else {
    title.innerText = 'Book Dental Appointment';
  }
  if (modal) modal.classList.add('active');
};

window.closeBookingModal = function() {
  const modal = document.getElementById('booking-modal');
  if (modal) modal.classList.remove('active');
};

// Lightbox Triggers
window.openLightbox = function(imageSrc, captionText) {
  const modal = document.getElementById('lightbox-modal');
  const img = document.getElementById('lightbox-img');
  const caption = document.getElementById('lightbox-caption');

  if (modal && img) {
    img.src = imageSrc;
    if (caption) caption.innerText = captionText || '';
    modal.classList.add('active');
  }
};

window.closeLightbox = function() {
  const modal = document.getElementById('lightbox-modal');
  if (modal) modal.classList.remove('active');
};

// Form Submissions via WhatsApp
window.handleFormSubmit = function(e) {
  e.preventDefault();
  const name = document.getElementById('patient-name').value;
  const phone = document.getElementById('patient-phone').value;
  const treatment = document.getElementById('patient-treatment').value;
  const date = document.getElementById('patient-date').value;
  const time = document.getElementById('patient-time').value;
  const notes = document.getElementById('patient-notes').value;

  const msg = `*NEW DENTAL APPOINTMENT REQUEST*%0A` +
              `----------------------------------%0A` +
              `*Name:* ${encodeURIComponent(name)}%0A` +
              `*Phone:* ${phone}%0A` +
              `*Treatment:* ${encodeURIComponent(treatment)}%0A` +
              `*Preferred Date:* ${date}%0A` +
              `*Time Slot:* ${encodeURIComponent(time)}%0A` +
              `*Notes:* ${encodeURIComponent(notes || 'None')}%0A` +
              `----------------------------------%0A` +
              `Sent from Dentista Website`;

  window.open(`https://wa.me/919361776876?text=${msg}`, '_blank');
  alert('Thank you! Redirecting to WhatsApp to send your appointment details to Dr. D Deepa.');
};

window.handleModalFormSubmit = function(e) {
  e.preventDefault();
  const name = document.getElementById('modal-patient-name').value;
  const phone = document.getElementById('modal-patient-phone').value;
  const date = document.getElementById('modal-patient-date').value;
  const time = document.getElementById('modal-patient-time').value;

  const msg = `*QUICK DENTAL CONSULTATION BOOKING*%0A` +
              `----------------------------------%0A` +
              `*Name:* ${encodeURIComponent(name)}%0A` +
              `*Phone:* ${phone}%0A` +
              `*Date:* ${date}%0A` +
              `*Time Slot:* ${encodeURIComponent(time)}%0A` +
              `----------------------------------%0A` +
              `Sent from Dentista Website Modal`;

  closeBookingModal();
  window.open(`https://wa.me/919361776876?text=${msg}`, '_blank');
};
