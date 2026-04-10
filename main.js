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

  // 6. Number Counter Animation for Prova Social
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
});
