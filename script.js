/**
 * Thanush Kodi N — Portfolio
 * Main JavaScript file
 * Handles: Navigation, scroll reveal, active section tracking, mobile menu
 */

(function () {
  'use strict';

  /* =============================================================
     DOM REFERENCES
  ============================================================= */
  const navHeader    = document.getElementById('nav-header');
  const navToggle    = document.getElementById('nav-toggle');
  const mobileMenu   = document.getElementById('mobile-menu');
  const navLinks     = document.querySelectorAll('.nav-link[data-section]');
  const mobileLinks  = document.querySelectorAll('.mobile-nav-link[data-section]');
  const revealEls    = document.querySelectorAll('.reveal-up, .reveal-right');
  const sections     = document.querySelectorAll('section[id]');

  /* =============================================================
     MOBILE MENU TOGGLE
  ============================================================= */
  let menuOpen = false;

  function openMenu() {
    menuOpen = true;
    mobileMenu.classList.add('open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    navToggle.setAttribute('aria-expanded', 'true');
    // Animate hamburger lines → X
    const lines = navToggle.querySelectorAll('.hamburger-line');
    lines[0].style.transform = 'translateY(7px) rotate(45deg)';
    lines[1].style.opacity   = '0';
    lines[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  }

  function closeMenu() {
    menuOpen = false;
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    navToggle.setAttribute('aria-expanded', 'false');
    const lines = navToggle.querySelectorAll('.hamburger-line');
    lines[0].style.transform = '';
    lines[1].style.opacity   = '';
    lines[2].style.transform = '';
  }

  navToggle.addEventListener('click', () => {
    menuOpen ? closeMenu() : openMenu();
  });

  // Close mobile menu when a link is clicked
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (menuOpen && !navHeader.contains(e.target)) {
      closeMenu();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuOpen) closeMenu();
  });

  /* =============================================================
     NAV SCROLL SHADOW
  ============================================================= */
  function handleNavScroll() {
    if (window.scrollY > 8) {
      navHeader.classList.add('scrolled');
    } else {
      navHeader.classList.remove('scrolled');
    }
  }

  /* =============================================================
     ACTIVE SECTION TRACKING
  ============================================================= */
  function getActiveSection() {
    const scrollY  = window.scrollY;
    const offset   = 100; // px from top to consider section active
    let activeId   = 'home';

    sections.forEach(section => {
      const top = section.offsetTop - offset;
      if (scrollY >= top) {
        activeId = section.id;
      }
    });

    return activeId;
  }

  function updateActiveNav() {
    const activeId = getActiveSection();

    navLinks.forEach(link => {
      if (link.dataset.section === activeId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    mobileLinks.forEach(link => {
      if (link.dataset.section === activeId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  /* =============================================================
     SCROLL REVEAL (INTERSECTION OBSERVER)
  ============================================================= */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  revealEls.forEach(el => revealObserver.observe(el));

  /* =============================================================
     SMOOTH SCROLL FOR NAV LINKS
  ============================================================= */
  function smoothScrollTo(targetId) {
    const target = document.getElementById(targetId);
    if (!target) return;

    const navHeight = navHeader.getBoundingClientRect().height;
    const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight;

    window.scrollTo({
      top: targetTop,
      behavior: 'smooth',
    });
  }

  [...navLinks, ...mobileLinks].forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const sectionId = href.slice(1);
        smoothScrollTo(sectionId);
      }
    });
  });

  /* =============================================================
     SCROLL EVENT HANDLER (throttled)
  ============================================================= */
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        handleNavScroll();
        updateActiveNav();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  /* =============================================================
     INITIAL CALLS
  ============================================================= */
  handleNavScroll();
  updateActiveNav();

  /* =============================================================
     SUBTLE HERO ILLUSTRATION ANIMATION
     Animate the data points gently on load
  ============================================================= */
  const dashboardSvg = document.querySelector('.dashboard-svg');
  if (dashboardSvg) {
    const circles = dashboardSvg.querySelectorAll('circle');
    circles.forEach((circle, i) => {
      const originalR = parseFloat(circle.getAttribute('r') || '3');
      circle.style.transition = `r 0.3s ease, opacity 0.3s ease`;

      const delay = i * 120;
      setTimeout(() => {
        circle.setAttribute('r', String(originalR * 1.4));
        setTimeout(() => {
          circle.setAttribute('r', String(originalR));
        }, 300);
      }, delay + 800);
    });
  }

  /* =============================================================
     PROJECT CARD TILT (SUBTLE)
  ============================================================= */
  const projectCards = document.querySelectorAll('.project-card');

  projectCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect  = card.getBoundingClientRect();
      const xPct  = ((e.clientX - rect.left) / rect.width  - 0.5) * 2;
      const yPct  = ((e.clientY - rect.top)  / rect.height - 0.5) * 2;
      const tiltX = yPct * -2;   // max ±2deg
      const tiltY = xPct *  2;

      card.style.transform = `perspective(1200px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-3px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* =============================================================
     TYPING ANIMATION FOR HERO HEADLINE (SUBTLE)
  ============================================================= */
  const heroHeadline = document.querySelector('.hero-headline');
  if (heroHeadline) {
    const text = heroHeadline.textContent;
    heroHeadline.textContent = '';
    heroHeadline.style.visibility = 'visible';

    let i = 0;
    const speed = 35;

    function typeChar() {
      if (i < text.length) {
        heroHeadline.textContent += text.charAt(i);
        i++;
        setTimeout(typeChar, speed);
      }
    }

    // Start typing after a short delay (after page load)
    setTimeout(typeChar, 700);
  }

  /* =============================================================
     SKILL TAGS HOVER RIPPLE (SUBTLE)
  ============================================================= */
  const skillTags = document.querySelectorAll('.skill-tag');

  skillTags.forEach(tag => {
    tag.addEventListener('click', () => {
      tag.style.transform = 'scale(0.95)';
      setTimeout(() => {
        tag.style.transform = '';
      }, 150);
    });
  });

  /* =============================================================
     FOCUS CARD MICRO-INTERACTION
  ============================================================= */
  const focusCards = document.querySelectorAll('.focus-card');
  focusCards.forEach(card => {
    const icon = card.querySelector('.focus-icon');
    card.addEventListener('mouseenter', () => {
      if (icon) icon.style.transform = 'scale(1.1) rotate(-3deg)';
    });
    card.addEventListener('mouseleave', () => {
      if (icon) icon.style.transform = '';
    });
  });

  /* =============================================================
     CERT CARD HOVER ACCENT
  ============================================================= */
  const certCards = document.querySelectorAll('.cert-card');
  certCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      const name = card.querySelector('.cert-name');
      if (name) name.style.color = 'var(--color-accent)';
    });
    card.addEventListener('mouseleave', () => {
      const name = card.querySelector('.cert-name');
      if (name) name.style.color = '';
    });
  });

  /* =============================================================
     ICON TRANSITIONS FOR FOCUS CARDS
  ============================================================= */
  document.querySelectorAll('.focus-icon').forEach(icon => {
    icon.style.transition = 'transform 0.25s ease';
  });

  console.log('%c Thanush Kodi N — Portfolio ', 'background:#0F172A;color:#2563EB;font-weight:bold;font-size:14px;padding:6px 12px;border-radius:4px;');
  console.log('%c Built with HTML, CSS & JavaScript', 'color:#64748B;font-size:12px;');

})();
