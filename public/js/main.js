/**
 * MEENAKSHI TECHNOLOGIES - MAIN CLIENT SCRIPT
 * Version: 2026.1.0
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initDropdownNav();
  initFaqAccordion();
  initProductFilter();
  initBiometricWizard();
  initLeadForm();
  initQuoteModal();
  initComparisonTool();
  initAccessControlSimulator();
  initClientSlider();
  initVideoFilter();
  initAnalyticsTracking();
  initServiceWorkerAndPWA();
  initCacheManager();
  initNetworkStatus();
});

/* Mobile Menu Toggle */
function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-menu-btn');
  const navMenu = document.querySelector('.nav-menu');

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const isExpanded = navMenu.classList.contains('active');
      toggleBtn.setAttribute('aria-expanded', isExpanded);
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !toggleBtn.contains(e.target) && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        toggleBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }
}

/* FAQ Accordion */
function initFaqAccordion() {
  const faqCards = document.querySelectorAll('.faq-card');

  faqCards.forEach(card => {
    const btn = card.querySelector('.faq-question-btn');
    if (btn) {
      btn.addEventListener('click', () => {
        const isOpen = card.classList.contains('open');
        // Close others
        faqCards.forEach(c => c.classList.remove('open'));
        if (!isOpen) {
          card.classList.add('open');
        }
      });
    }
  });
}

/* Product Catalog Multi-Facet Filter (Brand + 10 Categories) & Real-Time Search */
function initProductFilter() {
  const brandBtns = document.querySelectorAll('.brand-filter-btn');
  const catBtns = document.querySelectorAll('.category-filter-btn');
  const legacyFilterBtns = document.querySelectorAll('.filter-btn:not(.brand-filter-btn):not(.category-filter-btn)');
  const productCards = document.querySelectorAll('.product-card');
  const searchInput = document.getElementById('productSearchInput');
  const searchCount = document.getElementById('productSearchCount');
  const emptyState = document.getElementById('productEmptyState');
  const resetBtn = document.getElementById('resetProductFiltersBtn');

  let activeBrand = 'all';
  let activeCategory = 'all';
  let searchQuery = '';

  function applyFilters() {
    let visibleCount = 0;
    productCards.forEach(card => {
      const cardCat = (card.getAttribute('data-category') || '').toLowerCase();
      const cardBrand = (card.getAttribute('data-brand') || '').toLowerCase();
      const cardModel = (card.getAttribute('data-model') || '').toLowerCase();
      const cardText = (card.textContent || '').toLowerCase();

      // Brand match
      const matchesBrand = (activeBrand === 'all' || cardBrand.includes(activeBrand.toLowerCase()));

      // Category match
      const matchesCat = (activeCategory === 'all' || cardCat.includes(activeCategory.toLowerCase()));

      // Search match
      const matchesSearch = (!searchQuery || 
        cardText.includes(searchQuery) || 
        cardModel.includes(searchQuery) || 
        cardBrand.includes(searchQuery) || 
        cardCat.includes(searchQuery)
      );

      if (matchesBrand && matchesCat && matchesSearch) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (searchCount) {
      if (visibleCount === productCards.length && !searchQuery && activeBrand === 'all' && activeCategory === 'all') {
        searchCount.textContent = `Showing all ${productCards.length} verified hardware models in stock`;
      } else {
        searchCount.textContent = `Showing ${visibleCount} of ${productCards.length} verified models matching criteria`;
      }
    }

    if (emptyState) {
      emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  }

  // Brand Buttons
  if (brandBtns.length > 0) {
    brandBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        brandBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeBrand = btn.getAttribute('data-brand') || 'all';
        applyFilters();
      });
    });
  }

  // Category Buttons
  if (catBtns.length > 0) {
    catBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        catBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeCategory = btn.getAttribute('data-category') || 'all';
        applyFilters();
      });
    });
  }

  // Legacy filter buttons fallback
  if (legacyFilterBtns.length > 0) {
    legacyFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        legacyFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeCategory = btn.getAttribute('data-category') || 'all';
        applyFilters();
      });
    });
  }

  // Search input
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      applyFilters();
    });
  }

  // Reset Button
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      activeBrand = 'all';
      activeCategory = 'all';
      searchQuery = '';
      if (searchInput) searchInput.value = '';
      brandBtns.forEach((b, i) => i === 0 ? b.classList.add('active') : b.classList.remove('active'));
      catBtns.forEach((b, i) => i === 0 ? b.classList.add('active') : b.classList.remove('active'));
      applyFilters();
    });
  }
}

/* Interactive Biometric System Selector / Wizard */
function initBiometricWizard() {
  const wizard = document.getElementById('selector-wizard');
  if (!wizard) return;

  const optButtons = wizard.querySelectorAll('.wizard-opt-btn');
  const selectionPill = document.getElementById('wizardSelectionPill');
  const imgEl = document.getElementById('wizardResultImg');
  const brandEl = document.getElementById('wizardResultBrand');
  const categoryEl = document.getElementById('wizardResultCategory');
  const titleEl = document.getElementById('wizardResultTitle');
  const descEl = document.getElementById('wizardResultDesc');
  const specsEl = document.getElementById('wizardResultSpecs');
  const waBtnEl = document.getElementById('wizardResultWaBtn');
  const modalBtnEl = document.getElementById('wizardResultModalBtn');
  const linkBtnEl = document.getElementById('wizardResultLinkBtn');
  const resultBox = document.getElementById('wizardResult');

  const state = {
    industry: 'Office',
    size: 'small',
    goal: 'attendance'
  };

  const labels = {
    industry: 'Corporate Office',
    size: '1–25 Staff',
    goal: 'Attendance Only'
  };

  const recommendations = {
    calc: function(ind, size, goal) {
      // 1. Pharma or Touchless Face
      if (goal === 'face' || ind === 'Pharma') {
        return {
          title: 'Biomax SpeedFace 5 AI Face Recognition Terminal',
          brand: 'Biomax AI Face',
          category: 'Visible-Light Face Recognition',
          image: '/images/products/biomax-speedface-5.png',
          slug: 'biomax-speedface-5-ai-face-recognition-terminal',
          desc: 'High-speed 0.2-second facial recognition with dual WDR anti-spoofing cameras, mask detection, and 50,000 face capacity. Zero physical contact required.',
          specs: ['⚡ 0.2s Verification', '👤 50,000 Face Capacity', '🛡️ Anti-Spoofing AI', '🌐 Cloud & LAN Push'],
          model: 'Biomax SpeedFace 5'
        };
      }

      // 2. Access Control with Door Lock
      if (goal === 'access') {
        if (size === 'industrial' || size === 'large') {
          return {
            title: 'eSSL Multi-Door Access Controller (C3-400)',
            brand: 'eSSL Professional',
            category: 'Centralized Door Access Control',
            image: '/images/products/essl-inbio-460.png',
            slug: 'essl-multi-door-access-controller-c3-400',
            desc: 'Enterprise multi-door networked controller supporting 4 doors, 30,000 card holders, anti-passback security, and fire alarm interlocking.',
            specs: ['🚪 4-Door Network Controller', '👥 30,000 Card Capacity', '🔥 Fire Alarm Integration', '⚡ Fail-Safe Relays'],
            model: 'eSSL Multi-Door Access Controller'
          };
        }
        return {
          title: 'eSSL K90 Pro Biometric Terminal + 600 lbs EM Lock Kit',
          brand: 'eSSL Access Security',
          category: 'Biometric Door Locking Solution',
          image: '/images/products/electromagnetic-door-lock-600lbs.png',
          slug: 'electromagnetic-door-lock-600lbs',
          desc: 'Complete single-door access control package combining fingerprint terminal, 600 lbs heavy-duty magnetic lock, exit switch, and battery backup.',
          specs: ['🧲 600 lbs (280 kg) Force', '⚡ Fail-Safe Operation', '🔘 Push-to-Exit Switch', '🔋 Power Supply & Battery'],
          model: 'eSSL K90 Pro + EM Lock Kit'
        };
      }

      // 3. Factory or Industrial / 500+ Staff
      if (ind === 'Factory' || size === 'industrial') {
        return {
          title: 'Biomax Bio-5000 Industrial Biometric Machine',
          brand: 'Biomax Industrial',
          category: 'High-Capacity Industrial Biometric',
          image: '/images/products/biomax-bio-5000.png',
          slug: 'biomax-bio-5000-industrial-fingerprint-system',
          desc: 'Engineered specifically for factories and manufacturing plants with 5,000 fingerprint capacity, scratch-resistant optical sensor for rough hands, and dual LAN/WiFi.',
          specs: ['👥 5,000 Fingerprints', '📝 150,000 Transaction Logs', '🏭 Rough-Hand Detection', '🔊 Voice & Siren Relay'],
          model: 'Biomax Bio-5000'
        };
      }

      // 4. Gym / Fitness Center
      if (ind === 'Gym') {
        return {
          title: 'eSSL SilkBio-100TC Multi-Biometric System',
          brand: 'eSSL Multi-Biometric',
          category: 'Face + SilkID Fingerprint Terminal',
          image: '/images/products/essl-silkbio-100tc.png',
          slug: 'essl-silkbio-100tc-face-fingerprint-attendance',
          desc: 'Dual face and SilkID fingerprint verification directly integrated with gym membership expiry access control to prevent unpaid entries.',
          specs: ['🏋️ Member Expiry Control', '👤 800 Faces + 1,500 SilkID', '🚪 Turnstile / EM Lock Relay', '📱 Real-time Cloud Alerts'],
          model: 'eSSL SilkBio 100TC'
        };
      }

      // 5. School / Educational
      if (ind === 'School') {
        return {
          title: 'eSSL SilkBio-100TC Multi-Biometric System',
          brand: 'eSSL Education Line',
          category: 'Student & Faculty Attendance',
          image: '/images/products/essl-silkbio-100tc.png',
          slug: 'essl-silkbio-100tc-face-fingerprint-attendance',
          desc: 'Rapid student clocking with contactless face recognition, RFID smart card tapping, and automated parent SMS notifications.',
          specs: ['🏫 SMS Parent Gateway', '⚡ 0.5s Fast Clock-in', '👥 Multi-Tier Verification', '📊 Automated Late Reports'],
          model: 'eSSL SilkBio 100TC'
        };
      }

      // 6. Enterprise / 100-500 Staff
      if (size === 'large') {
        return {
          title: 'eSSL uFace 202 Multi-Biometric Terminal',
          brand: 'eSSL Enterprise',
          category: 'High-Capacity Multi-Biometric',
          image: '/images/products/essl-uface-202.png',
          slug: 'essl-uface-202-multi-biometric-terminal',
          desc: 'High-capacity touch terminal with 1,200 face and 2,000 fingerprint storage, 4.3" color touchscreen, and multi-shift roster scheduling.',
          specs: ['📱 4.3" Touchscreen', '👥 1,200 Faces / 2,000 Finger', '🔄 Multi-Shift Rostering', '🔋 Internal Battery Backup'],
          model: 'eSSL uFace 202'
        };
      }

      // 7. Mid Size Office (25-100 Staff)
      if (size === 'medium') {
        return {
          title: 'eSSL SilkBio-100TC Multi-Biometric Terminal',
          brand: 'eSSL Genuine',
          category: 'Face + Fingerprint Terminal',
          image: '/images/products/essl-silkbio-100tc.png',
          slug: 'essl-silkbio-100tc-face-fingerprint-attendance',
          desc: 'Dual face and SilkID fingerprint recognition with push data technology, live finger detection, and seamless payroll software sync.',
          specs: ['👥 800 Faces + 1,500 Fingerprints', '⚡ SilkID Sensor for All Hands', '🌐 TCP/IP & Push Data', '💻 Free eTimeTrackLite'],
          model: 'eSSL SilkBio 100TC'
        };
      }

      // 8. Small Office (1-25 Staff Default)
      return {
        title: 'eSSL K90 Pro Biometric Attendance Machine',
        brand: 'eSSL Genuine',
        category: 'Fingerprint Biometric Attendance',
        image: '/images/products/essl-k90-pro.png',
        slug: 'essl-k90-pro-biometric-attendance',
        desc: 'India’s most dependable fingerprint attendance device for small offices with built-in battery backup, USB/TCP/IP communication, and free payroll software integration.',
        specs: ['⚡ < 1s Quick Verification', '👥 1,000 Fingerprints', '🔋 Built-in Battery Backup', '📊 Excel & HRMS Sync'],
        model: 'eSSL K90 Pro'
      };
    }
  };

  function updateWizardUI() {
    if (selectionPill) {
      selectionPill.textContent = `${labels.industry} • ${labels.size} • ${labels.goal}`;
    }

    const rec = recommendations.calc(state.industry, state.size, state.goal);

    if (resultBox) {
      resultBox.style.opacity = '0.5';
      resultBox.style.transform = 'translateY(2px)';
    }

    setTimeout(() => {
      if (titleEl) titleEl.textContent = rec.title;
      if (brandEl) brandEl.textContent = rec.brand;
      if (categoryEl) categoryEl.textContent = rec.category;
      if (descEl) descEl.textContent = rec.desc;
      if (imgEl) {
        imgEl.src = rec.image;
        imgEl.alt = rec.title;
      }
      if (specsEl && rec.specs) {
        specsEl.innerHTML = rec.specs.map(s => `<span class="wizard-spec-pill">${s}</span>`).join('');
      }
      if (modalBtnEl) {
        modalBtnEl.setAttribute('data-product-name', rec.model);
      }
      if (linkBtnEl) {
        linkBtnEl.href = `/products/${rec.slug}`;
      }
      if (waBtnEl) {
        const text = `Hello Meenakshi Technologies, I used your System Finder for ${labels.industry} (${labels.size}, requirement: ${labels.goal}). Please send quotation and availability for ${rec.model}.`;
        waBtnEl.href = `https://wa.me/916301593064?text=${encodeURIComponent(text)}`;
      }

      if (resultBox) {
        resultBox.style.opacity = '1';
        resultBox.style.transform = 'translateY(0)';
      }
    }, 120);
  }

  optButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.getAttribute('data-type');
      const val = btn.getAttribute('data-val');
      const label = btn.getAttribute('data-label') || val;

      btn.closest('.wizard-options').querySelectorAll('.wizard-opt-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      state[type] = val;
      labels[type] = label;

      updateWizardUI();
    });
  });
}

/* Lead & Contact Form Submission (Validation + AJAX to /api/enquiry + WhatsApp Fallback) */
function initLeadForm() {
  const forms = document.querySelectorAll('.enquiry-form');

  forms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const statusBox = form.querySelector('.form-status-msg');
      const submitBtn = form.querySelector('button[type="submit"]');

      // Check anti-spam honeypot
      const honeypot = form.querySelector('input[name="website_source"]');
      if (honeypot && honeypot.value.trim() !== '') {
        console.warn('Spam submission suppressed.');
        return;
      }

      // Extract form values
      const formData = {
        fullName: form.querySelector('[name="fullName"]')?.value?.trim() || '',
        companyName: form.querySelector('[name="companyName"]')?.value?.trim() || '',
        email: form.querySelector('[name="email"]')?.value?.trim() || '',
        mobileNumber: form.querySelector('[name="mobileNumber"]')?.value?.trim() || '',
        location: form.querySelector('[name="location"]')?.value?.trim() || '',
        productOrService: form.querySelector('[name="productOrService"]')?.value?.trim() || '',
        employeeCount: form.querySelector('[name="employeeCount"]')?.value || '10-50 Employees',
        message: form.querySelector('[name="message"]')?.value?.trim() || ''
      };

      // Basic client-side validation
      if (!formData.fullName || !formData.mobileNumber) {
        showStatus(statusBox, 'Please provide your full name and valid mobile number.', 'error');
        return;
      }

      if (formData.email && !formData.email.includes('@')) {
        showStatus(statusBox, 'Please enter a valid email address.', 'error');
        return;
      }

      // UI state
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.dataset.origText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>Submitting Enquiry...</span>';
      }

      try {
        const response = await fetch('/api/enquiry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (response.ok && result.success) {
          form.reset();
          const whatsappUrl = `https://wa.me/916301593064?text=${encodeURIComponent(
            `Hello Meenakshi Technologies, my name is ${formData.fullName} (${formData.companyName || 'Business'}). I submitted an enquiry for ${formData.productOrService}. Phone: ${formData.mobileNumber}`
          )}`;

          showStatus(statusBox, `
            <strong>Enquiry Received Successfully!</strong><br>
            Reference ID: <strong>#${result.leadId}</strong>. Our team in Hyderabad will contact you promptly.<br>
            <a href="${whatsappUrl}" target="_blank" rel="noopener" class="btn btn-whatsapp btn-sm" style="margin-top: 10px; display: inline-flex;">
              <span>Accelerate on WhatsApp (+91 6301593064)</span>
            </a>
          `, 'success');
        } else {
          showStatus(statusBox, result.message || 'Failed to submit enquiry. Please call us directly at +91 6301593064.', 'error');
        }
      } catch (err) {
        console.error('Enquiry error:', err);
        showStatus(statusBox, 'Network error. Please WhatsApp us at +91 6301593064 for immediate assistance.', 'error');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = submitBtn.dataset.origText || 'Submit Enquiry';
        }
      }
    });
  });

  function showStatus(box, html, type) {
    if (!box) return;
    box.className = `form-status-msg ${type}`;
    box.innerHTML = html;
    box.style.display = 'block';
  }
}

/* Quick Quote Modal Triggers */
function initQuoteModal() {
  const quoteModal = document.getElementById('quickQuoteModal');
  const openButtons = document.querySelectorAll('.open-quote-modal-btn');
  const closeBtn = document.querySelector('.close-quote-modal-btn');

  if (quoteModal && openButtons.length > 0) {
    openButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const productName = btn.getAttribute('data-product-name') || 'Biometric Solutions';
        const prodInput = quoteModal.querySelector('input[name="productOrService"]');
        if (prodInput) {
          prodInput.value = productName;
        }
        quoteModal.classList.add('active');
      });
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        quoteModal.classList.remove('active');
      });
    }

    quoteModal.addEventListener('click', (e) => {
      if (e.target === quoteModal) {
        quoteModal.classList.remove('active');
      }
    });
  }
}

/* Interactive Comparison Tool */
function initComparisonTool() {
  const tabs = document.querySelectorAll('.comp-tab-btn');
  const viewPanes = document.querySelectorAll('.comp-view-pane');

  if (tabs.length > 0 && viewPanes.length > 0) {
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        viewPanes.forEach(p => p.classList.remove('active'));

        tab.classList.add('active');
        const targetId = tab.getAttribute('data-target');
        const targetPane = document.getElementById(targetId);
        if (targetPane) {
          targetPane.classList.add('active');
        }
      });
    });
  }
}

/* Google Analytics 4 & Conversion Event Readiness */
function initAnalyticsTracking() {
  // WhatsApp Clicks
  document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
    link.addEventListener('click', () => {
      if (typeof gtag === 'function') {
        gtag('event', 'whatsapp_click', {
          event_category: 'engagement',
          event_label: link.href
        });
      }
    });
  });

  // Phone Call Clicks
  document.querySelectorAll('a[href*="tel:"]').forEach(link => {
    link.addEventListener('click', () => {
      if (typeof gtag === 'function') {
        gtag('event', 'phone_call_click', {
          event_category: 'engagement',
          event_label: link.href
        });
      }
    });
  });
}



/* ==========================================================================
   DOOR ACCESS CONTROL ENGINEERING SIMULATOR
   Interactive Real-Time Physical Access Control & 3D Door Simulation
   ========================================================================== */
function initAccessControlSimulator() {
  const container = document.getElementById('accessControlEngineering');
  if (!container) return;

  // DOM Elements - HUD
  const hudLockLed = document.getElementById('hudLockLed');
  const hudLockStateText = document.getElementById('hudLockStateText');
  const hudForce = document.getElementById('hudForce');
  const hudRelay = document.getElementById('hudRelay');
  const hudDoorSensor = document.getElementById('hudDoorSensor');
  const hudSafety = document.getElementById('hudSafety');

  // DOM Elements - Terminal
  const terminalUnit = document.getElementById('simTerminalUnit');
  const termStatusLed = document.getElementById('termStatusLed');
  const termLine1 = document.getElementById('termLine1');
  const termLine2 = document.getElementById('termLine2');
  const fingerSensor = document.getElementById('fingerSensor');
  const wirePulseOut = document.getElementById('wirePulseOut');

  // DOM Elements - Lock & 3D Door
  const emLockLed = document.getElementById('emLockLed');
  const magneticFlux = document.getElementById('magneticFlux');
  const fluxText = document.getElementById('fluxText');
  const doorLeaf = document.getElementById('doorLeaf');
  const reedSensorDot = document.getElementById('reedSensorDot');
  const doorSensorLabel = document.getElementById('doorSensorLabel');

  // DOM Elements - Inside Egress
  const simExitBtn = document.getElementById('simExitBtn');
  const exitBtnPush = document.getElementById('exitBtnPush');
  const simBreakGlass = document.getElementById('simBreakGlass');
  const wirePulseIn = document.getElementById('wirePulseIn');

  // DOM Elements - Controls & Logs
  const scenarioBtns = document.querySelectorAll('.sim-scenario-btn');
  const autoPlayBtn = document.getElementById('simAutoPlayBtn');
  const autoPlayText = document.getElementById('simAutoPlayText');
  const logsContainer = document.getElementById('simEventLogs');

  // Simulator State
  let isLocked = true;
  let isDoorOpen = false;
  let autoCycleActive = true;
  let autoCycleTimer = null;
  let scenarioTimers = [];
  let autoIndex = 0;
  const autoSequence = ['authorized', 'exit', 'authorized', 'denied'];

  function clearActiveTimers() {
    scenarioTimers.forEach(t => clearTimeout(t));
    scenarioTimers = [];
  }

  function getTimestamp() {
    const d = new Date();
    return d.toTimeString().split(' ')[0];
  }

  function addLog(message, type = 'normal') {
    if (!logsContainer) return;
    const entry = document.createElement('div');
    entry.className = `log-entry log-${type}`;
    entry.innerHTML = `<span class="log-time">[${getTimestamp()}]</span> <span>${message}</span>`;
    logsContainer.insertBefore(entry, logsContainer.firstChild);

    // Keep log clean (max 8 entries)
    while (logsContainer.children.length > 8) {
      logsContainer.removeChild(logsContainer.lastChild);
    }
  }

  // Set Lock State (Hardware Magnetics & HUD)
  function setLock(locked, options = {}) {
    isLocked = locked;

    if (locked) {
      if (hudLockLed) hudLockLed.className = 'hud-led led-red';
      if (hudLockStateText) hudLockStateText.textContent = '600 LBS LOCKED';
      if (hudForce) hudForce.textContent = '280 kg / 600 lbs';
      if (hudRelay) hudRelay.textContent = 'NC Energized (480mA)';
      if (emLockLed) emLockLed.className = 'em-lock-led';
      if (magneticFlux) magneticFlux.classList.remove('unlocked');
      if (fluxText) fluxText.textContent = '600 LBS (280 KG) MAGNETIC CLAMP ACTIVE';
    } else {
      if (hudLockLed) hudLockLed.className = 'hud-led led-green';
      if (hudLockStateText) hudLockStateText.textContent = options.emergency ? 'FAIL-SAFE 0 LBS (EMERGENCY)' : 'DISENGAGED 0 LBS';
      if (hudForce) hudForce.textContent = '0 kg / 0 lbs (Free Egress)';
      if (hudRelay) hudRelay.textContent = options.emergency ? 'CIRCUIT BROKEN (0mA)' : 'OPEN De-energized (0mA)';
      if (emLockLed) emLockLed.className = 'em-lock-led unlocked';
      if (magneticFlux) magneticFlux.classList.add('unlocked');
      if (fluxText) fluxText.textContent = options.emergency ? 'FAIL-SAFE EVACUATION PASSAGE' : 'MAGNETIC CIRCUIT OPEN - READY FOR OPENING';
    }
  }

  // Set 3D Door State
  function setDoor(open) {
    isDoorOpen = open;

    if (open) {
      if (doorLeaf) doorLeaf.classList.add('unlocked');
      if (reedSensorDot) reedSensorDot.className = 'reed-sensor sensor-open';
      if (doorSensorLabel) {
        doorSensorLabel.textContent = 'OPEN (EGRESS IN PROGRESS)';
        doorSensorLabel.style.color = '#38bdf8';
      }
      if (hudDoorSensor) hudDoorSensor.textContent = 'DOOR OPEN (REED TRIP)';
    } else {
      if (doorLeaf) doorLeaf.classList.remove('unlocked');
      if (reedSensorDot) reedSensorDot.className = 'reed-sensor';
      if (doorSensorLabel) {
        doorSensorLabel.textContent = 'CLOSED (SECURE)';
        doorSensorLabel.style.color = '#ffffff';
      }
      if (hudDoorSensor) hudDoorSensor.textContent = 'CONTACT CLOSED';
    }
  }

  // Execute Scenarios
  function runScenario(type) {
    clearActiveTimers();

    // Update scenario button styling
    scenarioBtns.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-scenario') === type);
    });

    if (type === 'authorized') {
      // 1. Scanning State
      terminalUnit.classList.remove('terminal-success', 'terminal-denied');
      termStatusLed.className = 'terminal-led-indicator';
      termLine1.textContent = 'SCANNING BIOMETRICS...';
      termLine2.textContent = 'Live Fingerprint & Face Mapping';
      addLog('👤 Trait Presented: Infrared face & SilkID sensor scanning...', 'normal');

      // 2. Verified
      scenarioTimers.push(setTimeout(() => {
        terminalUnit.classList.add('terminal-success');
        termStatusLed.className = 'terminal-led-indicator led-green';
        termLine1.textContent = '✓ ACCESS GRANTED: #1042';
        termLine2.textContent = 'Auth: Tingirikar Teja (Tech Lead)';
        addLog('✓ Biometric Verified: User #1042 (Confidence: 99.8%)', 'success');
        addLog('🔓 Controller Relay: De-energized • 600 lbs EM Lock Released', 'success');
        setLock(false);
      }, 800));

      // 3. Door Opens
      scenarioTimers.push(setTimeout(() => {
        setDoor(true);
        addLog('🚪 3D Door Swung Open: Safe corridor egress permitted (4s window)', 'exit');
      }, 1400));

      // 4. Door Returns via Closer
      scenarioTimers.push(setTimeout(() => {
        addLog('🔄 Hydraulic Closer: Door gently returning to frame...', 'normal');
        setDoor(false);
      }, 4800));

      // 5. Re-Lock
      scenarioTimers.push(setTimeout(() => {
        setLock(true);
        terminalUnit.classList.remove('terminal-success');
        termStatusLed.className = 'terminal-led-indicator';
        termLine1.textContent = 'STANDBY - PRESENT ID';
        termLine2.textContent = 'eTimeTrackLite Ready';
        addLog('🔒 Door Latched: 600 lbs (280 kg) Holding Force Re-engaged', 'normal');
      }, 5600));

    } else if (type === 'denied') {
      terminalUnit.classList.remove('terminal-success', 'terminal-denied');
      termStatusLed.className = 'terminal-led-indicator';
      termLine1.textContent = 'SCANNING BIOMETRICS...';
      termLine2.textContent = 'Comparing against user database';
      addLog('⚠️ Trait Presented: Unregistered fingerprint pattern...', 'normal');

      scenarioTimers.push(setTimeout(() => {
        terminalUnit.classList.add('terminal-denied');
        termStatusLed.className = 'terminal-led-indicator led-red';
        termLine1.textContent = '✗ ACCESS DENIED: UNKNOWN';
        termLine2.textContent = 'Record not found in system';
        addLog('✗ Access Denied: Biometric template mismatch!', 'denied');
        addLog('🛡️ High-Security Interlock: 600 lbs EM Lock maintains full force', 'denied');
      }, 800));

      scenarioTimers.push(setTimeout(() => {
        terminalUnit.classList.remove('terminal-denied');
        termStatusLed.className = 'terminal-led-indicator';
        termLine1.textContent = 'STANDBY - PRESENT ID';
        termLine2.textContent = 'eTimeTrackLite Ready';
      }, 3500));

    } else if (type === 'exit') {
      if (exitBtnPush) exitBtnPush.classList.add('pressed');
      addLog('🔘 Inside Zone: Stainless Steel Push-to-Exit switch activated', 'exit');

      scenarioTimers.push(setTimeout(() => {
        if (exitBtnPush) exitBtnPush.classList.remove('pressed');
        setLock(false);
        addLog('🔓 Egress Relay: 12V NC circuit released for 4-second exit window', 'exit');
        setDoor(true);
        addLog('🚪 Door Opened: Occupant moving outward from secure facility', 'exit');
      }, 400));

      scenarioTimers.push(setTimeout(() => {
        setDoor(false);
        addLog('🔄 Closer Retraction: Door returned to frame threshold', 'normal');
      }, 4400));

      scenarioTimers.push(setTimeout(() => {
        setLock(true);
        addLog('🔒 Egress Complete: 600 lbs holding clamp re-energized', 'normal');
      }, 5200));

    } else if (type === 'fire') {
      if (simBreakGlass) simBreakGlass.style.boxShadow = '0 0 25px #ef4444';
      if (hudSafety) {
        hudSafety.textContent = 'EMERGENCY CUTOFF ACTIVE';
        hudSafety.style.color = '#ef4444';
      }
      setLock(false, { emergency: true });
      setDoor(true);
      termLine1.textContent = 'EMERGENCY EVACUATION';
      termLine2.textContent = 'Life-Safety Fail-Safe Triggered';
      addLog('🚨 FIRE ALARM / EMERGENCY BREAK-GLASS ACTIVATED!', 'fire');
      addLog('⚠️ LIFE SAFETY OVERRIDE: 12V DC power cut, 100% fail-safe unlocked', 'fire');

      scenarioTimers.push(setTimeout(() => {
        if (simBreakGlass) simBreakGlass.style.boxShadow = '';
        if (hudSafety) {
          hudSafety.textContent = 'FAIL-SAFE PASSIVE';
          hudSafety.style.color = '#4ade80';
        }
        setDoor(false);
        setLock(true);
        termLine1.textContent = 'STANDBY - PRESENT ID';
        termLine2.textContent = 'eTimeTrackLite Ready';
        addLog('✅ Fire Loop Reset: Standard access control operations resumed', 'normal');
      }, 6500));
    }
  }

  // Interactive Click Listeners
  scenarioBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const scenario = btn.getAttribute('data-scenario');
      runScenario(scenario);
      // Pause auto-cycle briefly so visitor can inspect
      if (autoCycleTimer) clearInterval(autoCycleTimer);
      if (autoCycleActive) {
        autoCycleTimer = setInterval(cycleNext, 7500);
      }
    });
  });

  if (fingerSensor) {
    fingerSensor.addEventListener('click', () => {
      runScenario('authorized');
    });
  }

  if (exitBtnPush) {
    exitBtnPush.addEventListener('click', () => {
      runScenario('exit');
    });
  }

  if (simBreakGlass) {
    simBreakGlass.addEventListener('click', () => {
      runScenario('fire');
    });
  }

  // Auto-Cycle Loop
  function cycleNext() {
    if (!autoCycleActive) return;
    autoIndex = (autoIndex + 1) % autoSequence.length;
    runScenario(autoSequence[autoIndex]);
  }

  if (autoPlayBtn) {
    autoPlayBtn.addEventListener('click', () => {
      autoCycleActive = !autoCycleActive;
      autoPlayBtn.classList.toggle('active', autoCycleActive);
      if (autoPlayText) {
        autoPlayText.textContent = autoCycleActive ? 'Auto Simulation: Active' : 'Auto Simulation: Paused';
      }
      if (autoCycleActive) {
        cycleNext();
        autoCycleTimer = setInterval(cycleNext, 7500);
      } else {
        if (autoCycleTimer) clearInterval(autoCycleTimer);
      }
    });
  }

  // Initialize Default State & Logs
  setLock(true);
  setDoor(false);
  addLog('⚡ 12V 5A Heavy-Duty Power Supply: 480mA Normal • Battery Standby', 'normal');
  addLog('🧲 600 lbs Electromagnetic Lock: Magnetic circuit energized & armed', 'normal');
  addLog('📡 Biometric Terminal: Optical SilkID & dual IR camera ready', 'normal');

  // Start smooth auto-cycle
  autoCycleTimer = setInterval(cycleNext, 7500);
}


/* ==========================================================================
   LARGE ICONS CLIENT SLIDING SHOW CONTROLLER
   ========================================================================== */
function initClientSlider() {
  const track = document.getElementById('clientSliderTrack');
  const prevBtn = document.getElementById('clientPrevBtn');
  const nextBtn = document.getElementById('clientNextBtn');
  const pauseBtn = document.getElementById('clientPauseBtn');

  if (!track) return;

  let isPaused = false;
  let nudgeOffset = 0;
  const cardStep = 322; // 290px card width + 32px gap

  if (pauseBtn) {
    pauseBtn.addEventListener('click', () => {
      isPaused = !isPaused;
      track.classList.toggle('paused', isPaused);
      pauseBtn.textContent = isPaused ? '▶' : '❚❚';
      pauseBtn.title = isPaused ? 'Resume Sliding' : 'Pause Sliding';
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      track.classList.add('paused');
      if (pauseBtn) pauseBtn.textContent = '▶';
      isPaused = true;
      nudgeOffset = Math.min(nudgeOffset + cardStep, 0);
      track.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
      track.style.transform = `translateX(${nudgeOffset}px)`;
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      track.classList.add('paused');
      if (pauseBtn) pauseBtn.textContent = '▶';
      isPaused = true;
      nudgeOffset -= cardStep;
      track.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
      track.style.transform = `translateX(${nudgeOffset}px)`;
    });
  }
}


/* ==========================================================================
   YOUTUBE INSTALLATION VIDEO FILTER CONTROLLER
   ========================================================================== */
function initVideoFilter() {
  const filterBtns = document.querySelectorAll('.video-filter-btn');
  const videoCards = document.querySelectorAll('.videos-grid .video-card');

  if (!filterBtns.length || !videoCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      videoCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter || (filter === 'Corporate & IT Parks' && category.includes('Corporate'))) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   ACCESSIBLE DROPDOWN NAVIGATION CONTROLLER
   ========================================================================== */
function initDropdownNav() {
  const dropdownToggles = document.querySelectorAll('.nav-dropdown .dropdown-toggle');
  
  dropdownToggles.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const parentDropdown = btn.closest('.nav-dropdown');
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';
      
      // Close other dropdowns
      document.querySelectorAll('.nav-dropdown').forEach(d => {
        if (d !== parentDropdown) {
          d.classList.remove('open');
          const t = d.querySelector('.dropdown-toggle');
          if (t) t.setAttribute('aria-expanded', 'false');
        }
      });
      
      parentDropdown.classList.toggle('open', !isExpanded);
      btn.setAttribute('aria-expanded', !isExpanded ? 'true' : 'false');
    });
  });

  // Close dropdowns when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-dropdown')) {
      document.querySelectorAll('.nav-dropdown').forEach(d => {
        d.classList.remove('open');
        const t = d.querySelector('.dropdown-toggle');
        if (t) t.setAttribute('aria-expanded', 'false');
      });
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.nav-dropdown').forEach(d => {
        d.classList.remove('open');
        const t = d.querySelector('.dropdown-toggle');
        if (t) t.setAttribute('aria-expanded', 'false');
      });
    }
  });
}

/* ==========================================================================
   PROGRESSIVE WEB APP (PWA) & SERVICE WORKER CONTROLLER
   ========================================================================== */
let deferredPwaPrompt = null;

function initServiceWorkerAndPWA() {
  // 1. Service Worker Registration
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js', { scope: '/' })
        .then((reg) => {
          console.log('[PWA] Service Worker registered successfully. Scope:', reg.scope);
          
          reg.addEventListener('updatefound', () => {
            const installingWorker = reg.installing;
            if (installingWorker) {
              installingWorker.addEventListener('statechange', () => {
                if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  showToast('New version of Meenakshi Technologies is available. Tap Clear Cache to refresh.', 'info');
                }
              });
            }
          });
        })
        .catch((err) => {
          console.warn('[PWA] Service Worker registration failed:', err);
        });
    });
  }

  // 2. Custom Install Prompt handling
  const headerInstallBtn = document.getElementById('pwaInstallHeaderBtn');
  const footerInstallBtn = document.getElementById('pwaInstallFooterBtn');

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPwaPrompt = e;

    if (headerInstallBtn) headerInstallBtn.style.display = 'inline-flex';
    if (footerInstallBtn) footerInstallBtn.style.display = 'inline-flex';
  });

  function triggerPwaInstall() {
    if (!deferredPwaPrompt) return;
    deferredPwaPrompt.prompt();
    deferredPwaPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        showToast('Thank you! Meenakshi Technologies App is installing.', 'success');
      }
      deferredPwaPrompt = null;
      if (headerInstallBtn) headerInstallBtn.style.display = 'none';
      if (footerInstallBtn) footerInstallBtn.style.display = 'none';
    });
  }

  if (headerInstallBtn) headerInstallBtn.addEventListener('click', triggerPwaInstall);
  if (footerInstallBtn) footerInstallBtn.addEventListener('click', triggerPwaInstall);

  window.addEventListener('appinstalled', () => {
    showToast('Meenakshi Tech App installed on your device!', 'success');
    if (headerInstallBtn) headerInstallBtn.style.display = 'none';
    if (footerInstallBtn) footerInstallBtn.style.display = 'none';
    deferredPwaPrompt = null;
  });
}

/* ==========================================================================
   SMART CACHE MANAGEMENT & STORAGE ESTIMATE
   ========================================================================== */
async function updateCacheStorageEstimate() {
  const textEl = document.getElementById('cacheStorageText');
  if (!textEl) return;

  if ('storage' in navigator && 'estimate' in navigator.storage) {
    try {
      const { usage } = await navigator.storage.estimate();
      if (typeof usage === 'number') {
        const mbUsage = (usage / (1024 * 1024)).toFixed(1);
        textEl.textContent = `Cache: ~${mbUsage} MB stored`;
      } else {
        textEl.textContent = 'Cache: Active';
      }
    } catch (e) {
      textEl.textContent = 'Cache: Active';
    }
  } else {
    textEl.textContent = 'Cache: Active';
  }
}

function initCacheManager() {
  updateCacheStorageEstimate();

  const clearBtn = document.getElementById('clearCacheBtn');
  if (clearBtn) {
    clearBtn.addEventListener('click', async () => {
      clearBtn.disabled = true;
      clearBtn.innerHTML = `<span>Clearing...</span>`;

      try {
        if ('caches' in window) {
          const cacheKeys = await caches.keys();
          await Promise.all(cacheKeys.map(k => caches.delete(k)));
        }

        // Notify Service Worker
        if (navigator.serviceWorker && navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({ action: 'CLEAR_CACHE' });
        }

        showToast('Website cache cleared successfully. Refreshing latest content...', 'success');
        await updateCacheStorageEstimate();

        setTimeout(() => {
          window.location.reload(true);
        }, 1200);
      } catch (err) {
        showToast('Error clearing cache. Please try reloading the page.', 'error');
        clearBtn.disabled = false;
        clearBtn.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
          <span>Clear Website Cache</span>
        `;
      }
    });
  }
}

/* ==========================================================================
   NETWORK ONLINE / OFFLINE STATUS MONITOR
   ========================================================================== */
function initNetworkStatus() {
  const pill = document.getElementById('onlineStatusPill');

  function updateStatus(isOnline) {
    if (!pill) return;
    if (isOnline) {
      pill.className = 'status-pill status-online';
      pill.querySelector('.status-text').textContent = 'Online • Connected';
      showToast('Internet connection active.', 'success', 2500);
    } else {
      pill.className = 'status-pill status-offline';
      pill.querySelector('.status-text').textContent = 'Offline Mode Active';
      showToast('You are currently offline. Emergency helpline (+91 6301593064) & cached catalogue remain accessible.', 'warning', 6000);
    }
  }

  window.addEventListener('online', () => updateStatus(true));
  window.addEventListener('offline', () => updateStatus(false));

  if (!navigator.onLine && pill) {
    updateStatus(false);
  }
}

/* ==========================================================================
   TOAST NOTIFICATION HELPER
   ========================================================================== */
function showToast(message, type = 'info', duration = 4000) {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast-item toast-${type}`;
  
  let icon = 'ℹ️';
  if (type === 'success') icon = '✅';
  else if (type === 'warning') icon = '⚠️';
  else if (type === 'error') icon = '❌';

  toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <span class="toast-msg">${message}</span>
    <button class="toast-close-btn" aria-label="Close notification">&times;</button>
  `;

  const closeBtn = toast.querySelector('.toast-close-btn');
  closeBtn.addEventListener('click', () => {
    toast.classList.add('fade-out');
    setTimeout(() => toast.remove(), 300);
  });

  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add('visible');
  });

  setTimeout(() => {
    if (toast.parentElement) {
      toast.classList.add('fade-out');
      setTimeout(() => toast.remove(), 300);
    }
  }, duration);
}
