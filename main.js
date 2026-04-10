import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
  // 1. Navbar Scroll Effect — stays transparent until logos section
  const navbar = document.getElementById('navbar');
  const logosSection = document.querySelector('.logos-section');

  window.addEventListener('scroll', () => {
    const threshold = logosSection ? logosSection.offsetTop - navbar.offsetHeight : 50;
    if (window.scrollY > threshold) {
      navbar.classList.remove('transparent');
      navbar.classList.add('solid');
    } else {
      navbar.classList.add('transparent');
      navbar.classList.remove('solid');
    }
  });

  // 2. Mobile Menu Toggle
  const mobileBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');

  if (mobileBtn && navLinks) {
    mobileBtn.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });

    // Close menu when clicking a link
    const links = navLinks.querySelectorAll('.nav-link, .btn');
    links.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
      });
    });
  }

  // 3. FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question');
    btn.addEventListener('click', () => {
      // Close others
      faqItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
        }
      });
      item.classList.toggle('active');
    });
  });

  // 4. Smooth Scroll for Anchor Links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const navHeight = navbar.offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // 5. GSAP Animations
  // Subtle fade up for text elements
  gsap.utils.toArray('.reveal-up').forEach(element => {
    gsap.fromTo(element,
      { y: 30, autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 85%',
        }
      }
    );
  });

  // Staggered card reveals in grids
  const grids = document.querySelectorAll('.grid, .bento-grid, .timeline, .stats-grid');
  grids.forEach(grid => {
    const cards = grid.querySelectorAll('.reveal-card, .timeline-step, .reveal-number, .testimonial-card');
    if (cards.length > 0) {
      // Setup initial state manually if needed, but gsap does it via fromTo
      gsap.fromTo(cards,
        { y: 30, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: grid,
            start: 'top 85%',
          }
        }
      );
    }
  });

  // Individual card reveals (like hero Image) that are not in a grid
  gsap.utils.toArray('.reveal-card').forEach(card => {
    if (!card.closest('.grid') && !card.closest('.bento-grid') && !card.closest('.timeline') && !card.closest('.stats-grid')) {
      gsap.fromTo(card,
        { y: 30, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
          }
        }
      );
    }
  });

  // 5.5 Features Accordion
  const featuresContainer = document.querySelector('.features-container');
  if (featuresContainer) {
    const cards = featuresContainer.querySelectorAll('.features-card');
    const illustrations = featuresContainer.querySelectorAll('.features-illus');
    let activeIndex = 0;

    // Animation reset registry — each illustration can register a reset callback
    const animationResets = {};

    window.featuresRegisterReset = function (index, resetFn) {
      animationResets[index] = resetFn;
    };

    function activateFeature(index) {
      if (index === activeIndex) return;
      activeIndex = index;

      cards.forEach((card, i) => {
        card.classList.toggle('features-card--active', i === index);
      });

      illustrations.forEach((illus, i) => {
        illus.classList.toggle('active', i === index);
      });

      // Reset animation for the newly active illustration
      if (animationResets[index]) {
        animationResets[index]();
      }
    }

    // Initialize: first card active
    illustrations.forEach((illus, i) => {
      illus.classList.toggle('active', i === 0);
    });

    // Click on accordion cards
    cards.forEach((card, i) => {
      card.addEventListener('click', () => activateFeature(i));
    });

    // Click on illustrations also activates (if user clicks a non-active illus area)
    illustrations.forEach((illus, i) => {
      illus.addEventListener('click', () => activateFeature(i));
    });
  }

  // 5.5.1 Typewriter Engine (Illustration 1)
  const typewriterTarget = document.getElementById('typewriter-target');
  if (typewriterTarget) {
    const typewriterText = [
      { text: 'A autuação apresenta ', highlight: false },
      { text: 'vício formal', highlight: true },
      { text: '. O equipamento não possui ', highlight: false },
      { text: 'aferição válida', highlight: true },
      { text: ' conforme Resolução 798/2020 do CONTRAN.', highlight: false },
    ];

    let twTimeout = null;

    function runTypewriter() {
      typewriterTarget.innerHTML = '';
      const cursor = document.createElement('span');
      cursor.className = 'illus-ai-cursor';

      let segments = [];
      typewriterText.forEach(seg => {
        for (let i = 0; i < seg.text.length; i++) {
          segments.push({ char: seg.text[i], highlight: seg.highlight });
        }
      });

      let idx = 0;
      typewriterTarget.appendChild(cursor);

      function typeNext() {
        if (idx >= segments.length) return;
        const { char, highlight } = segments[idx];
        const span = document.createElement('span');
        span.textContent = char;
        if (highlight) span.className = 'illus-ai-highlight';
        typewriterTarget.insertBefore(span, cursor);
        idx++;
        twTimeout = setTimeout(typeNext, 30);
      }

      typeNext();
    }

    // Register reset so accordion can restart it
    if (window.featuresRegisterReset) {
      window.featuresRegisterReset(0, () => {
        clearTimeout(twTimeout);
        runTypewriter();
      });
    }

    // Run on load (card 0 starts active)
    runTypewriter();
  }

  // 5.5.2 Pipeline Drag Reset (Illustration 2)
  const pipelineDragging = document.querySelector('.illus-pipe-dragging');
  if (pipelineDragging && window.featuresRegisterReset) {
    window.featuresRegisterReset(1, () => {
      pipelineDragging.style.animation = 'none';
      pipelineDragging.offsetHeight; // force reflow
      pipelineDragging.style.animation = '';
    });
  }

  // 5.5.3 Steps Animation Reset (Illustration 3)
  const stepsWrap = document.querySelector('.illus-steps-wrap');
  if (stepsWrap && window.featuresRegisterReset) {
    window.featuresRegisterReset(2, () => {
      const steps = stepsWrap.querySelectorAll('.illus-step');
      steps.forEach(step => {
        step.style.animation = 'none';
        step.offsetHeight;
        step.style.animation = '';
      });
    });
  }

  // 5.6 Contact Modal (expandable CTA with FLIP morph)
  const contactCta = document.getElementById('contact-cta');
  const contactModal = document.getElementById('contact-modal');
  const contactModalCard = contactModal?.querySelector('[data-modal-card]');
  const contactModalClose = contactModal?.querySelector('[data-modal-close]');
  const contactModalInner = contactModal?.querySelector('.contact-modal-inner');

  let lastFocusedEl = null;
  let pendingOnEnd = null;
  let pendingFallback = null;

  const clearPendingClose = () => {
    if (pendingOnEnd && contactModalCard) {
      contactModalCard.removeEventListener('transitionend', pendingOnEnd);
    }
    if (pendingFallback) {
      clearTimeout(pendingFallback);
    }
    pendingOnEnd = null;
    pendingFallback = null;
  };

  const openContactModal = () => {
    if (!contactCta || !contactModal || !contactModalCard) return;
    clearPendingClose();
    lastFocusedEl = document.activeElement;

    // First: capture CTA rect
    const ctaRect = contactCta.getBoundingClientRect();

    // Reveal modal (flips visibility and pointer-events via CSS)
    contactModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');

    // Last: measure card's natural full-viewport rect
    const cardRect = contactModalCard.getBoundingClientRect();

    // Invert: compute transform so card visually starts at CTA position
    const dx = ctaRect.left - cardRect.left;
    const dy = ctaRect.top - cardRect.top;
    const sx = ctaRect.width / cardRect.width;
    const sy = ctaRect.height / cardRect.height;

    // Apply inverse instantly
    contactModalCard.style.transition = 'none';
    contactModalCard.style.transform = `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`;
    contactModalCard.style.borderRadius = '9999px';

    // Force reflow so the browser registers the starting state
    void contactModalCard.offsetWidth;

    // Play: animate to identity
    contactModalCard.style.transition = 'transform 400ms cubic-bezier(0.32, 0.72, 0, 1), border-radius 400ms cubic-bezier(0.32, 0.72, 0, 1)';
    contactModalCard.style.transform = 'translate(0, 0) scale(1, 1)';
    contactModalCard.style.borderRadius = '24px';

    // Focus first input after morph settles
    setTimeout(() => {
      const firstInput = contactModal.querySelector('input, select, textarea, button:not([data-modal-close])');
      if (firstInput) firstInput.focus();
    }, 420);
  };

  const closeContactModal = () => {
    if (!contactCta || !contactModal || !contactModalCard) return;

    // Fade out inner content + close button quickly so the morph doesn't
    // show distortion from the non-uniform scale.
    if (contactModalInner) {
      contactModalInner.style.transition = 'opacity 150ms ease';
      contactModalInner.style.opacity = '0';
    }
    if (contactModalClose) {
      contactModalClose.style.transition = 'opacity 150ms ease';
      contactModalClose.style.opacity = '0';
    }

    // Recompute CTA rect (may have moved if user scrolled before modal opened)
    const ctaRect = contactCta.getBoundingClientRect();
    const cardRect = contactModalCard.getBoundingClientRect();

    const dx = ctaRect.left - cardRect.left;
    const dy = ctaRect.top - cardRect.top;
    const sx = ctaRect.width / cardRect.width;
    const sy = ctaRect.height / cardRect.height;

    contactModalCard.style.transition = 'transform 400ms cubic-bezier(0.32, 0.72, 0, 1), border-radius 400ms cubic-bezier(0.32, 0.72, 0, 1)';
    contactModalCard.style.transform = `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`;
    contactModalCard.style.borderRadius = '9999px';

    // Clear any previous pending close handler before attaching a new one
    clearPendingClose();

    const onEnd = (ev) => {
      // Only react to the card's own transform transition, not child bubbles
      if (ev && ev.target !== contactModalCard) return;
      if (ev && ev.propertyName && ev.propertyName !== 'transform') return;

      contactModalCard.removeEventListener('transitionend', onEnd);
      if (pendingFallback) {
        clearTimeout(pendingFallback);
      }
      pendingOnEnd = null;
      pendingFallback = null;

      contactModal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-open');
      // Disable transitions first so resetting transform/border-radius is instant
      // (prevents the card from animating back to full-viewport identity).
      contactModalCard.style.transition = 'none';
      contactModalCard.style.transform = 'none';
      contactModalCard.style.borderRadius = '';
      // Force reflow so the "none" transform is committed before we clear transition.
      void contactModalCard.offsetWidth;
      // Now restore the CSS-driven transition for future opens.
      contactModalCard.style.transition = '';
      contactModalCard.style.transform = '';
      // Reset inner/close-btn inline opacity overrides so the next open starts clean.
      if (contactModalInner) {
        contactModalInner.style.transition = '';
        contactModalInner.style.opacity = '';
      }
      if (contactModalClose) {
        contactModalClose.style.transition = '';
        contactModalClose.style.opacity = '';
      }
      if (lastFocusedEl && typeof lastFocusedEl.focus === 'function') {
        lastFocusedEl.focus();
      }
    };

    pendingOnEnd = onEnd;
    contactModalCard.addEventListener('transitionend', onEnd);
    // Fallback: force completion after 450ms in case transitionend never fires
    pendingFallback = setTimeout(() => onEnd(null), 450);
  };

  if (contactCta) {
    contactCta.addEventListener('click', openContactModal);
  }
  if (contactModalClose) {
    contactModalClose.addEventListener('click', closeContactModal);
  }

  // ESC to close
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape' && contactModal && contactModal.getAttribute('aria-hidden') === 'false') {
      closeContactModal();
    }
  });

  // 5.75 Masks for CNPJ and Telefone
  const cnpjInput = document.getElementById('cmf-cnpj');
  if (cnpjInput) {
    cnpjInput.addEventListener('input', (ev) => {
      let v = ev.target.value.replace(/\D/g, '').slice(0, 14);
      v = v.replace(/^(\d{2})(\d)/, '$1.$2');
      v = v.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
      v = v.replace(/\.(\d{3})(\d)/, '.$1/$2');
      v = v.replace(/(\d{4})(\d)/, '$1-$2');
      ev.target.value = v;
    });
  }

  const telefoneInput = document.getElementById('cmf-telefone');
  if (telefoneInput) {
    telefoneInput.addEventListener('input', (ev) => {
      let v = ev.target.value.replace(/\D/g, '').slice(0, 11);
      if (v.length <= 10) {
        v = v.replace(/^(\d{2})(\d)/, '($1) $2');
        v = v.replace(/(\d{4})(\d)/, '$1-$2');
      } else {
        v = v.replace(/^(\d{2})(\d)/, '($1) $2');
        v = v.replace(/(\d{5})(\d)/, '$1-$2');
      }
      ev.target.value = v;
    });
  }

  // 6. Contact Form → Webhook
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;

      // Collect form data
      const formData = new FormData(contactForm);
      const payload = {
        nome: formData.get('nome'),
        email: formData.get('email'),
        telefone: formData.get('telefone'),
        cnpj: formData.get('cnpj'),
        empresa: formData.get('empresa'),
        setor: formData.get('setor'),
        frota_tamanho: formData.get('frota_tamanho'),
        origem: window.location.href,
        data_envio: new Date().toISOString(),
      };

      // Loading state
      submitBtn.disabled = true;
      submitBtn.textContent = 'Enviando…';

      try {
        const response = await fetch('https://webhook.arvenoficial.com/webhook/foms-mz', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        // Success feedback
        submitBtn.textContent = '✓ Solicitação enviada!';
        submitBtn.style.backgroundColor = 'var(--success, #16a34a)';
        contactForm.reset();

        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
          submitBtn.style.backgroundColor = '';
        }, 5000);
      } catch (err) {
        console.error('Erro ao enviar formulário:', err);
        submitBtn.disabled = false;
        submitBtn.textContent = 'Erro — tente novamente';
        submitBtn.style.backgroundColor = 'var(--error, #dc2626)';

        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.style.backgroundColor = '';
        }, 4000);
      }
    });
  }

  // 7. Number Counter Animation for Prova Social
  const numbers = document.querySelectorAll('.reveal-number');
  numbers.forEach(number => {
    const target = parseInt(number.getAttribute('data-target'), 10);

    gsap.to(number, {
      innerText: target,
      duration: 2,
      snap: { innerText: 1 },
      ease: 'power2.out',
      scrollTrigger: {
        trigger: number,
        start: 'top 90%',
        once: true
      },
      onUpdate: function () {
        number.innerText = Math.round(this.targets()[0].innerText);
      }
    });
  });

  // 8. Modals Logic
  const termsLink = document.getElementById('terms-link');
  const privacyLink = document.getElementById('privacy-link');
  const termsModal = document.getElementById('terms-modal');
  const privacyModal = document.getElementById('privacy-modal');
  const termsClose = document.getElementById('terms-close');
  const privacyClose = document.getElementById('privacy-close');

  function openModal(modal, e) {
    if (e) e.preventDefault();
    if (modal) {
      modal.style.display = 'flex';
      // Slight delay to allow display:flex to apply before adding transition class
      setTimeout(() => {
        modal.classList.add('show');
      }, 10);
      // Disable background scrolling
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal(modal) {
    if (modal) {
      modal.classList.remove('show');
      // Wait for the transition to finish before hiding
      setTimeout(() => {
        modal.style.display = 'none';
      }, 300);
      // Enable background scrolling
      document.body.style.overflow = '';
    }
  }

  if (termsLink) termsLink.addEventListener('click', (e) => openModal(termsModal, e));
  if (privacyLink) privacyLink.addEventListener('click', (e) => openModal(privacyModal, e));

  if (termsClose) termsClose.addEventListener('click', () => closeModal(termsModal));
  if (privacyClose) privacyClose.addEventListener('click', () => closeModal(privacyModal));

  // Close modals when clicking outside the modal content
  window.addEventListener('click', (e) => {
    if (e.target === termsModal) closeModal(termsModal);
    if (e.target === privacyModal) closeModal(privacyModal);
  });
});
