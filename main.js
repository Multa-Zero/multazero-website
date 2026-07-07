import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
  // 1. Navbar Scroll Effect — visível (transparente) desde o load;
  //    vira a versão sólida depois que o bottom do widget do hero passa
  const navbar = document.getElementById('navbar');
  const heroWidget = document.getElementById('sistemaTabs');

  function updateNavbar() {
    let threshold = 50;
    if (heroWidget) {
      const rect = heroWidget.getBoundingClientRect();
      // vira sólida quando o TOPO do widget (fundo claro) chega sob a navbar,
      // senão o texto branco transparente fica invisível sobre o branco
      threshold = rect.top + window.scrollY - navbar.offsetHeight;
    }
    if (window.scrollY >= threshold) {
      navbar.classList.remove('transparent');
      navbar.classList.add('solid');
    } else {
      navbar.classList.add('transparent');
      navbar.classList.remove('solid');
    }
  }
  window.addEventListener('scroll', updateNavbar, { passive: true });
  window.addEventListener('resize', updateNavbar, { passive: true });
  updateNavbar();

  // 1b. Nav CTA — appears after hero CTA scrolls out of view
  const navCta = document.getElementById('nav-cta');
  const heroCta = document.getElementById('hero-cta');

  if (navCta && heroCta) {
    const updateNavCta = () => {
      const heroCtaBottom = heroCta.getBoundingClientRect().bottom;
      if (heroCtaBottom < 0) {
        navCta.classList.add('visible');
      } else {
        navCta.classList.remove('visible');
      }
    };
    window.addEventListener('scroll', updateNavCta, { passive: true });
    updateNavCta();
  }

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

  // 7.5 Recurso com IA — "recurso sendo gerado" + anel de % (Dobra B)
  const recursoCard = document.querySelector('.recurso-card');
  if (recursoCard) {
    const lines = recursoCard.querySelectorAll('.recurso-card-lines span');
    const gaugeRing = recursoCard.querySelector('.recurso-gauge-ring');
    const gaugeNum = gaugeRing?.querySelector('span');
    const meta = recursoCard.querySelector('.recurso-card-meta');
    const targetPct = 87;

    // Estado inicial (antes de entrar na tela)
    gsap.set(lines, { scaleX: 0, transformOrigin: 'left center' });
    if (gaugeRing) gaugeRing.style.setProperty('--gauge-pct', 0);
    if (gaugeNum) gaugeNum.textContent = '0%';
    if (meta) meta.textContent = 'Analisando com IA…';

    const pct = { v: 0 };
    gsap.timeline({
      scrollTrigger: { trigger: recursoCard, start: 'top 78%', once: true }
    })
      .to(lines, { scaleX: 1, duration: 0.5, stagger: 0.18, ease: 'power2.out' })
      .add(() => { if (meta) meta.textContent = 'Gerado pela IA · 3 páginas'; })
      .to(pct, {
        v: targetPct,
        duration: 1.4,
        ease: 'power2.out',
        onUpdate() {
          if (gaugeRing) gaugeRing.style.setProperty('--gauge-pct', pct.v);
          if (gaugeNum) gaugeNum.textContent = Math.round(pct.v) + '%';
        }
      }, '-=0.1');
  }

  // 7.6 Widget de abas (dobra "O que é o multazero")
  const tabsWidget = document.getElementById('sistemaTabs');
  if (tabsWidget) {
    const tabs = Array.from(tabsWidget.querySelectorAll('.tabs-tab'));
    const panels = Array.from(tabsWidget.querySelectorAll('.tabs-panel'));
    const panelsWrap = tabsWidget.querySelector('[data-tabs-panels]');
    const indicator = tabsWidget.querySelector('[data-tabs-indicator]');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let active = 0;
    let autoTimer = null;
    let userTook = false;

    function computeHeight() {
      // Altura fixa = maior painel, pra não pular ao trocar de aba
      let max = 0;
      panels.forEach((p) => { if (p.scrollHeight > max) max = p.scrollHeight; });
      panelsWrap.style.height = max + 'px';
    }
    function moveIndicator() {
      const t = tabs[active];
      indicator.style.transform = 'translateX(' + t.offsetLeft + 'px)';
      indicator.style.width = t.offsetWidth + 'px';
    }
    function activate(i) {
      active = i;
      tabs.forEach((t, idx) => {
        const on = idx === i;
        t.classList.toggle('is-active', on);
        t.setAttribute('aria-selected', on ? 'true' : 'false');
      });
      panels.forEach((p, idx) => {
        const on = idx === i;
        p.classList.toggle('is-active', on);
        p.classList.remove('tw-run');
        if (on) { void p.offsetWidth; p.classList.add('tw-run'); }
      });
      moveIndicator();
      if (i === 0) runCondutor();
      else if (i === 2) boletoReset();
    }
    function stopAuto() { if (autoTimer) { clearInterval(autoTimer); autoTimer = null; } }
    function startAuto() {
      if (reduce || userTook || autoTimer) return;
      autoTimer = setInterval(() => activate((active + 1) % tabs.length), 5000);
    }

    tabs.forEach((t, i) => t.addEventListener('click', () => { userTook = true; stopAuto(); activate(i); }));

    // Mede posições/altura (funciona mesmo com reveal-up em opacity 0)
    requestAnimationFrame(() => {
      computeHeight();
      moveIndicator();
      panels[0].classList.add('tw-run');
    });
    window.addEventListener('resize', () => { computeHeight(); moveIndicator(); });
    if (document.fonts && document.fonts.ready) { document.fonts.ready.then(() => { computeHeight(); moveIndicator(); }); }

    // --- Interações dos painéis ---
    // PIX: copiar código
    const pixCopyBtn = tabsWidget.querySelector('[data-pix-copy]');
    const pixCode = tabsWidget.querySelector('.tw-pixq-code');
    if (pixCopyBtn) {
      pixCopyBtn.addEventListener('click', () => {
        userTook = true; stopAuto();
        const txt = pixCode ? pixCode.textContent.trim() : '';
        if (navigator.clipboard && txt) navigator.clipboard.writeText(txt).catch(() => {});
        pixCopyBtn.textContent = 'Copiado ✓';
        pixCopyBtn.classList.add('is-copied');
        clearTimeout(pixCopyBtn._t);
        pixCopyBtn._t = setTimeout(() => { pixCopyBtn.textContent = 'Copiar'; pixCopyBtn.classList.remove('is-copied'); }, 1800);
      });
    }

    // Boleto: emitir -> loader -> boleto emitido
    const boletoEmit = tabsWidget.querySelector('[data-boleto-emit]');
    const boletoActions = tabsWidget.querySelector('[data-boleto-actions]');
    const boletoLoader = tabsWidget.querySelector('[data-boleto-loader]');
    const boletoEmitted = tabsWidget.querySelector('[data-boleto-emitted]');
    let boletoTimers = [];
    function boletoReset() {
      boletoTimers.forEach(clearTimeout); boletoTimers = [];
      if (boletoActions) boletoActions.classList.add('is-on');
      if (boletoLoader) boletoLoader.classList.remove('is-on');
      if (boletoEmitted) boletoEmitted.classList.remove('is-on');
    }
    if (boletoEmit) {
      boletoEmit.addEventListener('click', () => {
        userTook = true; stopAuto();
        boletoTimers.forEach(clearTimeout); boletoTimers = [];
        boletoActions.classList.remove('is-on');
        boletoLoader.classList.add('is-on');
        boletoTimers.push(setTimeout(() => {
          boletoLoader.classList.remove('is-on');
          boletoEmitted.classList.add('is-on');
        }, 1300));
      });
    }

    // Condutor: digitação + autocomplete + seleção + resultado
    const condTyped = tabsWidget.querySelector('[data-cond-typed]');
    const condCaret = tabsWidget.querySelector('[data-cond-caret]');
    const condDrop = tabsWidget.querySelector('[data-cond-drop]');
    const condOpt = tabsWidget.querySelector('[data-cond-opt]');
    const condResult = tabsWidget.querySelector('[data-cond-result]');
    let condTimers = [];
    let condToken = 0;
    const CONDQ = 'José da Silva';
    function condReset() {
      condTimers.forEach(clearTimeout); condTimers = [];
      condToken++;
      if (condTyped) condTyped.textContent = '';
      if (condCaret) condCaret.style.display = '';
      if (condDrop) condDrop.classList.remove('is-on');
      if (condOpt) condOpt.classList.remove('is-hover');
      if (condResult) condResult.classList.remove('is-on');
    }
    function runCondutor() {
      if (!condTyped) return;
      condReset();
      if (reduce) {
        if (condCaret) condCaret.style.display = 'none';
        condTyped.textContent = CONDQ;
        if (condResult) condResult.classList.add('is-on');
        return;
      }
      const my = condToken;
      let i = 0;
      (function type() {
        if (my !== condToken) return;
        if (i <= CONDQ.length) {
          condTyped.textContent = CONDQ.slice(0, i);
          i++;
          condTimers.push(setTimeout(type, 85));
        } else {
          condTimers.push(setTimeout(() => {
            if (my !== condToken) return;
            condDrop.classList.add('is-on');
            condTimers.push(setTimeout(() => {
              if (my !== condToken) return;
              condOpt.classList.add('is-hover');
              condTimers.push(setTimeout(() => {
                if (my !== condToken) return;
                condDrop.classList.remove('is-on');
                if (condCaret) condCaret.style.display = 'none';
                condResult.classList.add('is-on');
              }, 650));
            }, 550));
          }, 350));
        }
      })();
    }

    boletoReset();

    // Auto-advance enquanto visível + dispara a animação do condutor
    const tabsIO = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { startAuto(); if (active === 0) runCondutor(); }
        else stopAuto();
      });
    }, { threshold: 0.35 });
    tabsIO.observe(tabsWidget);
  }

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

  // ==========================================================================
  // Bento — Plataforma
  // ==========================================================================

  // --- AI search bar: breathing glow ---
  const aiBorder = document.getElementById('aiBorder');
  const aiGlow = document.getElementById('aiGlow');
  if (aiBorder && aiGlow) {
    const FADE_IN_MS = 900, PEAK_MS = 2800, FADE_OUT_MS = 900, WAIT_MS = 3000;
    const breathe = () => {
      aiBorder.style.transition = `opacity ${FADE_IN_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`;
      aiGlow.style.transition   = `opacity ${FADE_IN_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`;
      aiBorder.style.opacity = '1';
      aiGlow.style.opacity   = '0.12';
      setTimeout(() => {
        aiBorder.style.transition = `opacity ${FADE_OUT_MS}ms cubic-bezier(0.64, 0, 0.78, 0)`;
        aiGlow.style.transition   = `opacity ${FADE_OUT_MS}ms cubic-bezier(0.64, 0, 0.78, 0)`;
        aiBorder.style.opacity = '0';
        aiGlow.style.opacity   = '0';
      }, FADE_IN_MS + PEAK_MS);
      setTimeout(breathe, FADE_IN_MS + PEAK_MS + FADE_OUT_MS + WAIT_MS);
    };
    setTimeout(breathe, 1500);
  }

  // --- AI search bar: typewriter placeholder ---
  const aiInput = document.getElementById('aiInput');
  if (aiInput) {
    const questions = [
      'Quantas multas estão pendentes esse mês?',
      'Qual o status do recurso da placa ABC-1D23?',
      'Multas com prazo vencendo essa semana',
      'Recursos deferidos nos últimos 30 dias',
      'Quantas indicações de condutor faltam?',
      'Multas por excesso de velocidade em SP',
    ];
    const TYPE_MS = 55, ERASE_MS = 25, HOLD_MS = 1800, BETWEEN_MS = 400;
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    let qIdx = 0;
    (async () => {
      await sleep(1200);
      aiInput.placeholder = '';
      while (true) {
        const text = questions[qIdx];
        for (let i = 0; i <= text.length; i++) {
          aiInput.placeholder = text.slice(0, i);
          await sleep(TYPE_MS);
        }
        await sleep(HOLD_MS);
        for (let i = text.length; i >= 0; i--) {
          aiInput.placeholder = text.slice(0, i);
          await sleep(ERASE_MS);
        }
        await sleep(BETWEEN_MS);
        qIdx = (qIdx + 1) % questions.length;
      }
    })();
  }

  // --- Alertas: animated list with FLIP slide-down ---
  const alertsList = document.getElementById('alertsList');
  if (alertsList) {
    const icons = {
      clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
      bell:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 7 3 9H3c0-2 3-2 3-9z"/><path d="M10 21a2 2 0 0 0 4 0"/></svg>',
      user:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>',
      check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
    };
    const alerts = [
      { color: 'red',   icon: 'clock', t1: 'Recurso ABC-1D23 vence HOJE',        t2: 'JARI · Defesa prévia',        chip: 'HOJE'   },
      { color: 'amber', icon: 'bell',  t1: 'Indicação de condutor — AF-48291',   t2: 'Prazo em 2 dias',             chip: '2 DIAS' },
      { color: 'blue',  icon: 'user',  t1: 'Análise condutor atualizada',        t2: 'José da Silva C. · Faixa A',  chip: 'NOVO'   },
      { color: 'green', icon: 'check', t1: 'Recurso deferido — DEF-92014',       t2: 'Economia de R$ 1.932,00',     chip: 'OK'     },
      { color: 'amber', icon: 'clock', t1: 'Defesa prévia AF-51887',             t2: 'Prazo em 5 dias',             chip: '5 DIAS' },
      { color: 'red',   icon: 'bell',  t1: 'Multa não identificada — placa XYZ', t2: 'Ação em 24h',                 chip: '24h'    },
    ];

    const MAX_VISIBLE = 6;
    const STEP_MS = 4200;
    const SLIDE_MS = 1100;
    const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';
    let i = 0;

    const makePill = (a) => {
      const el = document.createElement('div');
      el.className = `alert-pill alert-pill--${a.color}`;
      el.innerHTML = `
        <span class="alert-pill__icon">${icons[a.icon]}</span>
        <span class="alert-pill__txt">
          <span class="alert-pill__t1">${a.t1}</span>
          <span class="alert-pill__t2">${a.t2}</span>
        </span>
        <span class="alert-pill__chip">${a.chip}</span>
      `;
      return el;
    };

    const pushNext = () => {
      const a = alerts[i % alerts.length];
      const el = makePill(a);

      const existing = Array.from(alertsList.children);
      const oldRects = new Map();
      existing.forEach((c) => oldRects.set(c, c.getBoundingClientRect()));

      alertsList.insertBefore(el, alertsList.firstChild);

      existing.forEach((c) => {
        const oldRect = oldRects.get(c);
        const newRect = c.getBoundingClientRect();
        const dy = oldRect.top - newRect.top;
        if (dy === 0) return;
        c.animate(
          [
            { transform: `translateY(${dy}px)` },
            { transform: 'translateY(0)' },
          ],
          { duration: SLIDE_MS, easing: EASE, fill: 'both' }
        );
      });

      while (alertsList.children.length > MAX_VISIBLE) {
        alertsList.lastElementChild.remove();
      }
      i++;
    };

    pushNext();
    setTimeout(pushNext, 400);
    setTimeout(pushNext, 800);
    setInterval(pushNext, STEP_MS);
  }
});
