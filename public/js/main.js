/**
 * MEENAKSHI TECHNOLOGIES - MAIN CLIENT SCRIPT
 * Version: 2026.1.0
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initFaqAccordion();
  initProductFilter();
  initBiometricWizard();
  initLeadForm();
  initQuoteModal();
  initComparisonTool();
  initAnalyticsTracking();
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

/* Product Catalog Category Filter & Real-Time Search */
function initProductFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');
  const searchInput = document.getElementById('productSearchInput');
  const searchCount = document.getElementById('productSearchCount');

  let activeCategory = 'all';
  let searchQuery = '';

  function applyFilters() {
    let visibleCount = 0;
    productCards.forEach(card => {
      const cardCat = (card.getAttribute('data-category') || '').toLowerCase();
      const cardBrand = (card.getAttribute('data-brand') || '').toLowerCase();
      const cardText = (card.textContent || '').toLowerCase();

      const matchesCat = (activeCategory === 'all' || cardCat.includes(activeCategory.toLowerCase()) || cardBrand.includes(activeCategory.toLowerCase()));
      const matchesSearch = (!searchQuery || cardText.includes(searchQuery));

      if (matchesCat && matchesSearch) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (searchCount) {
      if (visibleCount === productCards.length) {
        searchCount.textContent = `Showing all ${productCards.length} verified models in stock`;
      } else {
        searchCount.textContent = `Showing ${visibleCount} of ${productCards.length} models matching filter`;
      }
    }
  }

  if (filterBtns.length > 0 && productCards.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeCategory = btn.getAttribute('data-category');
        applyFilters();
      });
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      applyFilters();
    });
  }
}

/* Interactive Biometric System Selector / Wizard */
function initBiometricWizard() {
  const wizard = document.getElementById('selector-wizard');
  if (!wizard) return;

  const optButtons = wizard.querySelectorAll('.wizard-opt-btn');
  const titleEl = document.getElementById('wizardResultTitle');
  const descEl = document.getElementById('wizardResultDesc');
  const waBtnEl = document.getElementById('wizardResultWaBtn');

  const state = {
    industry: 'Office',
    size: 'small',
    goal: 'attendance'
  };

  const recommendations = {
    calc: function(ind, size, goal) {
      if (goal === 'face' || ind === 'Pharma') {
        return {
          title: 'Biomax SpeedFace 5 AI Face Recognition Terminal',
          desc: 'High-speed 0.2-second facial recognition with mask detection, anti-spoofing, and 50,000 face capacity. Zero physical contact required.',
          model: 'Biomax SpeedFace 5'
        };
      }
      if (goal === 'access') {
        if (size === 'industrial' || size === 'large') {
          return {
            title: 'eSSL Multi-Door Access Controller + 600 lbs EM Locks',
            desc: 'Centralized network access control for multi-door facilities with fire alarm integration and anti-passback security.',
            model: 'eSSL Multi-Door Access Controller'
          };
        }
        return {
          title: 'eSSL K30 Pro Biometric Terminal + 600 lbs Electromagnetic Lock',
          desc: 'Integrated fingerprint attendance and door lock release kit with exit button and battery backup.',
          model: 'eSSL K30 Pro with EM Lock Kit'
        };
      }
      if (ind === 'Factory' || size === 'industrial') {
        return {
          title: 'Biomax Bio-5000 Industrial Biometric Machine',
          desc: 'Rugged industrial terminal with 5,000 fingerprint capacity, fast verification for dusty or rough factory hands, and dual LAN/WiFi.',
          model: 'Biomax Bio-5000'
        };
      }
      if (ind === 'Gym') {
        return {
          title: 'eSSL SilkBio 100TC Multi-Biometric System',
          desc: 'SilkID optical fingerprint + face reader integrated with gym membership expiry access control.',
          model: 'eSSL SilkBio 100TC'
        };
      }
      if (size === 'medium' || size === 'large') {
        return {
          title: 'eSSL SilkBio 100TC Multi-Biometric Terminal',
          desc: 'Dual face and fingerprint recognition with push data technology and seamless payroll software sync.',
          model: 'eSSL SilkBio 100TC'
        };
      }
      return {
        title: 'eSSL K30 Pro Biometric Attendance Machine',
        desc: 'India’s most dependable fingerprint attendance device for small offices with battery backup and USB/TCP/IP export.',
        model: 'eSSL K30 Pro'
      };
    }
  };

  optButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.getAttribute('data-type');
      const val = btn.getAttribute('data-val');

      btn.closest('.wizard-options').querySelectorAll('.wizard-opt-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      state[type] = val;
      const rec = recommendations.calc(state.industry, state.size, state.goal);

      if (titleEl) titleEl.textContent = rec.title;
      if (descEl) descEl.textContent = rec.desc;
      if (waBtnEl) {
        const text = `Hello Meenakshi Technologies, I used your System Finder for ${state.industry} (${state.size} staff, requirement: ${state.goal}). Please send quotation for ${rec.model}.`;
        waBtnEl.href = `https://wa.me/916301593064?text=${encodeURIComponent(text)}`;
      }
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

