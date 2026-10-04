/**
 * Ceriyya Salon & Beauty Klin - Interactive Scripts
 * Handles:
 * - Before & After Slider (Touch & Mouse)
 * - Service Category Filtering
 * - Booking Modal & Live Price Estimation
 * - WhatsApp Booking Message Generator
 * - FAQ Accordion
 * - Mobile Navigation Drawer
 * - Header Scroll Effect & Active Nav Spy
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. STICKY HEADER & SCROLL SPY
     ========================================================================== */
  const header = document.getElementById('header');
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    // Header shadow on scroll
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scroll spy
    let currentSection = '';
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  });

  /* ==========================================================================
     2. MOBILE DRAWER NAVIGATION
     ========================================================================== */
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerClose = document.getElementById('drawerClose');
  const backdropOverlay = document.getElementById('backdropOverlay');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  const btnMobileBooking = document.getElementById('btnMobileBooking');

  function openDrawer() {
    mobileDrawer.classList.add('open');
    backdropOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    mobileDrawer.classList.remove('open');
    backdropOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (mobileToggle) mobileToggle.addEventListener('click', openDrawer);
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  if (backdropOverlay) backdropOverlay.addEventListener('click', () => {
    closeDrawer();
    closeBookingModalFunc();
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  if (btnMobileBooking) {
    btnMobileBooking.addEventListener('click', () => {
      closeDrawer();
      openBookingModalFunc();
    });
  }

  /* ==========================================================================
     3. BEFORE & AFTER INTERACTIVE SLIDER
     ========================================================================== */
  const baContainer = document.getElementById('baSliderContainer');
  const baWrapper = document.getElementById('baBeforeWrapper');
  const baHandle = document.getElementById('baHandle');

  if (baContainer && baWrapper && baHandle) {
    let isSliding = false;

    const setSliderPosition = (xPos) => {
      const rect = baContainer.getBoundingClientRect();
      let offsetX = xPos - rect.left;

      // Bound limits (2% to 98%)
      if (offsetX < rect.width * 0.02) offsetX = rect.width * 0.02;
      if (offsetX > rect.width * 0.98) offsetX = rect.width * 0.98;

      const percentage = (offsetX / rect.width) * 100;
      baWrapper.style.width = `${percentage}%`;
      baHandle.style.left = `${percentage}%`;
    };

    const onPointerMove = (e) => {
      if (!isSliding) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      setSliderPosition(clientX);
    };

    const startSliding = (e) => {
      isSliding = true;
      baHandle.classList.add('active');
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      setSliderPosition(clientX);
    };

    const stopSliding = () => {
      if (isSliding) {
        isSliding = false;
        baHandle.classList.remove('active');
      }
    };

    // Mouse events
    baContainer.addEventListener('mousedown', startSliding);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', stopSliding);

    // Touch events for mobile phones
    baContainer.addEventListener('touchstart', startSliding, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', stopSliding);
  }

  /* ==========================================================================
     4. SERVICE CATEGORY FILTER TABS
     ========================================================================== */
  const tabBtns = document.querySelectorAll('.tab-btn');
  const serviceCards = document.querySelectorAll('.service-card');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const category = btn.getAttribute('data-category');

      serviceCards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
          card.classList.remove('hide');
        } else {
          card.classList.add('hide');
        }
      });
    });
  });

  /* ==========================================================================
     5. FAQ ACCORDION
     ========================================================================== */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close other accordion items
      faqItems.forEach(i => i.classList.remove('active'));

      // Toggle clicked item
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  /* ==========================================================================
     6. BOOKING MODAL, PRICE ESTIMATION & WHATSAPP SENDER
     ========================================================================== */
  const bookingModalOverlay = document.getElementById('bookingModalOverlay');
  const successModalOverlay = document.getElementById('successModalOverlay');
  const btnOpenBookingModal = document.getElementById('btnOpenBookingModal');
  const heroBookingBtn = document.getElementById('heroBookingBtn');
  const closeBookingModal = document.getElementById('closeBookingModal');
  const closeSuccessModal = document.getElementById('btnCloseSuccessModal');
  const bookingForm = document.getElementById('bookingForm');
  const checkboxes = document.querySelectorAll('input[name="services"]');
  const selectedCountEl = document.getElementById('selectedServicesCount');
  const totalPriceEl = document.getElementById('modalTotalPrice');
  const bookDateInput = document.getElementById('bookDate');
  const successSummaryBox = document.getElementById('successSummaryBox');
  const btnFinalWhatsApp = document.getElementById('btnFinalWhatsApp');

  // Set minimum date for booking to today
  if (bookDateInput) {
    const today = new Date().toISOString().split('T')[0];
    bookDateInput.setAttribute('min', today);
    bookDateInput.value = today;
  }

  function formatIDR(amount) {
    return 'Rp ' + amount.toLocaleString('id-ID');
  }

  function updatePriceEstimation() {
    let total = 0;
    let count = 0;

    checkboxes.forEach(cb => {
      if (cb.checked) {
        count++;
        total += parseInt(cb.getAttribute('data-price') || '0', 10);
      }
    });

    if (selectedCountEl) selectedCountEl.textContent = `${count} Layanan Dipilih`;
    if (totalPriceEl) totalPriceEl.textContent = formatIDR(total);
  }

  checkboxes.forEach(cb => {
    cb.addEventListener('change', updatePriceEstimation);
  });

  function openBookingModalFunc(preselectedServiceName = null) {
    if (preselectedServiceName) {
      // Find matching checkbox or check if it exists
      let matched = false;
      checkboxes.forEach(cb => {
        if (cb.value.toLowerCase().includes(preselectedServiceName.toLowerCase())) {
          cb.checked = true;
          matched = true;
        }
      });
      // If package selected that isn't single checkbox, make sure at least one or default is clear
      updatePriceEstimation();
    }
    bookingModalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeBookingModalFunc() {
    if (bookingModalOverlay) bookingModalOverlay.classList.remove('open');
    if (successModalOverlay) successModalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (btnOpenBookingModal) btnOpenBookingModal.addEventListener('click', () => openBookingModalFunc());
  if (heroBookingBtn) heroBookingBtn.addEventListener('click', () => openBookingModalFunc());
  if (closeBookingModal) closeBookingModal.addEventListener('click', closeBookingModalFunc);
  if (closeSuccessModal) closeSuccessModal.addEventListener('click', closeBookingModalFunc);

  // Close with Esc key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeBookingModalFunc();
  });

  // "Pilih Layanan" buttons on service cards
  const chooseServiceBtns = document.querySelectorAll('.btn-choose-service, .btn-quick-book');
  chooseServiceBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const sName = btn.getAttribute('data-name') || btn.getAttribute('data-service');
      // Reset all then check selected
      checkboxes.forEach(cb => cb.checked = false);
      openBookingModalFunc(sName);
    });
  });

  // "Pilih Paket" buttons on promo packages
  const choosePackageBtns = document.querySelectorAll('.btn-choose-package');
  choosePackageBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const pkgName = btn.getAttribute('data-name');
      const pkgPrice = parseInt(btn.getAttribute('data-price') || '0', 10);
      
      // Auto-check the first two relevant treatments or customize
      checkboxes.forEach(cb => cb.checked = false);
      if (pkgName.includes('Glow & Eye')) {
        checkboxes.forEach(cb => {
          if (cb.value.includes('Lash Lift') || cb.value.includes('Detox')) cb.checked = true;
        });
      } else if (pkgName.includes('Princess')) {
        checkboxes.forEach(cb => {
          if (cb.value.includes('Korean Glass Skin') || cb.value.includes('Royal Body Spa')) cb.checked = true;
        });
      } else {
        checkboxes.forEach(cb => {
          if (cb.value.includes('Russian') || cb.value.includes('Royal Body Spa')) cb.checked = true;
        });
      }
      updatePriceEstimation();
      openBookingModalFunc();
    });
  });

  // Handle Form Submission -> Build WhatsApp Message
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('bookName').value.trim();
      const phone = document.getElementById('bookPhone').value.trim();
      const date = document.getElementById('bookDate').value;
      const time = document.getElementById('bookTime').value;
      const notes = document.getElementById('bookNotes').value.trim();

      const selectedServices = [];
      let totalAmount = 0;

      checkboxes.forEach(cb => {
        if (cb.checked) {
          selectedServices.push(cb.value);
          totalAmount += parseInt(cb.getAttribute('data-price') || '0', 10);
        }
      });

      if (selectedServices.length === 0) {
        alert('Silakan pilih minimal satu treatment yang ingin Anda ambil.');
        return;
      }

      // Format Date in Indonesian (contoh: 15 Oktober 2026)
      const dateObj = new Date(date);
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      const formattedDate = isNaN(dateObj) ? date : dateObj.toLocaleDateString('id-ID', options);

      // Create WhatsApp message string
      const waNumber = '6281234567890'; // Admin WhatsApp Ceriyya Salon
      let waText = `*FORMULIR RESERVASI - CERIYYA SALON & BEAUTY KLIN*\n`;
      waText += `--------------------------------------\n`;
      waText += `*Nama Klien:* ${name}\n`;
      waText += `*No. WhatsApp:* ${phone}\n`;
      waText += `*Tanggal Kunjungan:* ${formattedDate}\n`;
      waText += `*Jam Reservasi:* ${time}\n`;
      waText += `--------------------------------------\n`;
      waText += `*Pilihan Treatment:*\n`;
      selectedServices.forEach((s, idx) => {
        waText += `${idx + 1}. ${s}\n`;
      });
      waText += `--------------------------------------\n`;
      waText += `*Estimasi Total:* ${formatIDR(totalAmount)}\n`;
      if (notes) {
        waText += `*Catatan Tambahan:* ${notes}\n`;
      }
      waText += `--------------------------------------\n`;
      waText += `Mohon konfirmasi ketersediaan slot terapis untuk jadwal di atas. Terima kasih! ✨🌸`;

      const encodedWA = `https://wa.me/${waNumber}?text=${encodeURIComponent(waText)}`;

      // Render summary in the success popup
      successSummaryBox.innerHTML = `
        <div class="summary-line"><span>Nama:</span> <strong>${name}</strong></div>
        <div class="summary-line"><span>Jadwal:</span> <strong>${formattedDate}, ${time}</strong></div>
        <div class="summary-line"><span>Treatment:</span> <strong>${selectedServices.length} Layanan</strong></div>
        <div class="summary-line"><span>Estimasi:</span> <strong style="color: #D47587">${formatIDR(totalAmount)}</strong></div>
      `;

      btnFinalWhatsApp.setAttribute('href', encodedWA);

      // Switch modals
      bookingModalOverlay.classList.remove('open');
      successModalOverlay.classList.add('open');

      // Also directly open WhatsApp in new tab for seamless user experience
      window.open(encodedWA, '_blank');
    });
  }

});
