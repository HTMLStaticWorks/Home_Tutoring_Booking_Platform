/**
 * Tutorly — Main JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu Toggle
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const closeDrawerBtn = document.querySelector('.close-drawer');
  const mobileDrawer = document.querySelector('.mobile-drawer');
  const drawerOverlay = document.querySelector('.mobile-drawer-overlay');

  if (mobileMenuBtn && mobileDrawer && drawerOverlay) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileDrawer.classList.add('active');
      drawerOverlay.classList.add('active');
      document.body.style.overflow = 'hidden'; // Prevent scrolling
    });

    const closeMenu = () => {
      mobileDrawer.classList.remove('active');
      drawerOverlay.classList.remove('active');
      document.body.style.overflow = '';
    };

    closeDrawerBtn.addEventListener('click', closeMenu);
    drawerOverlay.addEventListener('click', closeMenu);
  }

  // Sticky Header
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 10) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // Theme Toggle
  const themeToggles = document.querySelectorAll('.theme-toggle');
  
  // Check localStorage or system preference
  const getPreferredTheme = () => {
    const savedTheme = localStorage.getItem('tutorly-theme');
    if (savedTheme) {
      return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const setTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('tutorly-theme', theme);
    
    // Update icons
    themeToggles.forEach(toggle => {
      if (theme === 'dark') {
        toggle.innerHTML = '<i class="ph ph-sun"></i>';
      } else {
        toggle.innerHTML = '<i class="ph ph-moon"></i>';
      }
    });
  };

  // Initialize theme
  setTheme(getPreferredTheme());

  themeToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
    });
  });

  // RTL Toggle
  const rtlToggles = document.querySelectorAll('.rtl-toggle');
  
  const getPreferredDir = () => {
    const savedDir = localStorage.getItem('tutorly-dir');
    return savedDir ? savedDir : 'ltr';
  };

  const setDir = (dir) => {
    document.documentElement.setAttribute('dir', dir);
    localStorage.setItem('tutorly-dir', dir);
    
    // Ensure rtl.css is loaded or removed based on dir
    let rtlLink = document.getElementById('rtl-stylesheet');
    if (dir === 'rtl') {
      if (rtlLink) {
        // The markup ships the link disabled — enable it for a saved RTL preference.
        rtlLink.disabled = false;
      } else {
        rtlLink = document.createElement('link');
        rtlLink.id = 'rtl-stylesheet';
        rtlLink.rel = 'stylesheet';
        rtlLink.href = 'assets/css/rtl.css';
        document.head.appendChild(rtlLink);
      }
    } else {
      if (rtlLink) {
        rtlLink.remove();
      }
    }
  };

  // Initialize RTL
  setDir(getPreferredDir());

  rtlToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const currentDir = document.documentElement.getAttribute('dir');
      const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
      setDir(newDir);
    });
  });
  
  // Dashboard Sidebar Mobile Toggle
  const dashboardToggle = document.querySelector('.dashboard-toggle');
  const dashboardSidebar = document.querySelector('.dashboard-sidebar');
  if(dashboardToggle && dashboardSidebar) {
      dashboardToggle.addEventListener('click', () => {
          dashboardSidebar.classList.toggle('active');
      });
  }

  // Filters Drawer (tutor listing) — the sidebar goes off-canvas under 1025px
  const filtersPanel = document.getElementById('filters-panel');
  const filtersOverlay = document.querySelector('[data-filters-overlay]');
  const filtersOpenBtn = document.querySelector('[data-filters-open]');

  if (filtersPanel && filtersOverlay && filtersOpenBtn) {
    const desktopQuery = window.matchMedia('(min-width: 1025px)');

    const openFilters = () => {
      filtersPanel.classList.add('active');
      filtersOverlay.classList.add('active');
      filtersOpenBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      const firstField = filtersPanel.querySelector('select, input, button');
      if (firstField) firstField.focus();
    };

    const closeFilters = ({ restoreFocus = true } = {}) => {
      if (!filtersPanel.classList.contains('active')) return;
      filtersPanel.classList.remove('active');
      filtersOverlay.classList.remove('active');
      filtersOpenBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      if (restoreFocus) filtersOpenBtn.focus();
    };

    filtersOpenBtn.addEventListener('click', openFilters);
    filtersOverlay.addEventListener('click', () => closeFilters());
    filtersPanel.querySelectorAll('[data-filters-close], [data-filters-apply]').forEach(btn => {
      btn.addEventListener('click', () => closeFilters());
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeFilters();
    });

    // Back at desktop width the panel is a static column again — drop the drawer state.
    const syncToViewport = () => {
      if (desktopQuery.matches) closeFilters({ restoreFocus: false });
    };
    if (desktopQuery.addEventListener) {
      desktopQuery.addEventListener('change', syncToViewport);
    } else {
      desktopQuery.addListener(syncToViewport); // Safari < 14
    }
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Back To Top — injected here so every page gets it without extra markup
  const backToTop = document.createElement('button');
  backToTop.type = 'button';
  backToTop.className = 'back-to-top';
  backToTop.setAttribute('aria-label', 'Back to top');
  backToTop.setAttribute('title', 'Back to top');
  backToTop.innerHTML = '<i class="ph ph-arrow-up"></i>';
  document.body.appendChild(backToTop);

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });

  let backToTopTicking = false;
  const updateBackToTop = () => {
    backToTop.classList.toggle('is-visible', window.scrollY > 500);
    backToTopTicking = false;
  };
  window.addEventListener('scroll', () => {
    if (!backToTopTicking) {
      window.requestAnimationFrame(updateBackToTop);
      backToTopTicking = true;
    }
  }, { passive: true });
  updateBackToTop();

  // FAQ Accordion — one answer open at a time
  document.querySelectorAll('[data-accordion]').forEach(list => {
    const items = Array.from(list.querySelectorAll('.faq-item'));
    if (!items.length) return;

    // Signals to the CSS that collapsing is safe now that the script runs.
    list.classList.add('faq-ready');

    const setOpen = (item, open) => {
      const btn = item.querySelector('.faq-question');
      const panel = item.querySelector('.faq-answer');
      if (!btn || !panel) return;
      item.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', String(open));
      panel.style.maxHeight = open ? `${panel.scrollHeight}px` : '';
    };

    items.forEach(item => {
      const btn = item.querySelector('.faq-question');
      if (!btn) return;
      btn.addEventListener('click', () => {
        const willOpen = !item.classList.contains('is-open');
        items.forEach(other => setOpen(other, other === item && willOpen));
      });
    });

    // The open answer reflows at other widths, so re-measure it.
    window.addEventListener('resize', () => {
      const open = items.find(item => item.classList.contains('is-open'));
      if (!open) return;
      const panel = open.querySelector('.faq-answer');
      if (panel) panel.style.maxHeight = `${panel.scrollHeight}px`;
    });
  });

  // Interactive Showcase — tabbed image panel with optional autoplay
  document.querySelectorAll('[data-showcase]').forEach(showcase => {
    const tabs = Array.from(showcase.querySelectorAll('[role="tab"]'));
    const panels = Array.from(showcase.querySelectorAll('[role="tabpanel"]'));
    const timer = showcase.querySelector('[data-showcase-timer]');
    if (!tabs.length || tabs.length !== panels.length) return;

    const interval = Number(showcase.dataset.autoplay || 0);
    const canAutoplay = interval > 0 && !prefersReducedMotion;
    let current = tabs.findIndex(tab => tab.getAttribute('aria-selected') === 'true');
    if (current < 0) current = 0;
    let autoplayId = null;
    // Once the visitor drives the panel themselves, autoplay never resumes.
    let engaged = false;

    const restartTimerBar = () => {
      if (!timer) return;
      timer.classList.remove('is-running');
      if (!canAutoplay || autoplayId === null) return;
      timer.style.animationDuration = `${interval}ms`;
      void timer.offsetWidth; // force reflow so the animation replays
      timer.classList.add('is-running');
    };

    const activate = (index, { focusTab = false } = {}) => {
      current = (index + tabs.length) % tabs.length;
      tabs.forEach((tab, i) => {
        const selected = i === current;
        tab.setAttribute('aria-selected', String(selected));
        tab.tabIndex = selected ? 0 : -1;
        panels[i].classList.toggle('is-active', selected);
      });
      if (focusTab) tabs[current].focus();
      restartTimerBar();
    };

    const stopAutoplay = () => {
      if (autoplayId !== null) {
        window.clearInterval(autoplayId);
        autoplayId = null;
      }
      if (timer) timer.classList.remove('is-running');
    };

    const startAutoplay = () => {
      if (!canAutoplay || engaged || autoplayId !== null) return;
      autoplayId = window.setInterval(() => activate(current + 1), interval);
      restartTimerBar();
    };

    const takeOver = () => {
      engaged = true;
      stopAutoplay();
    };

    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => {
        takeOver();
        activate(i);
      });
      tab.addEventListener('keydown', e => {
        const keys = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
        if (e.key in keys) {
          e.preventDefault();
          takeOver();
          activate(current + keys[e.key], { focusTab: true });
        } else if (e.key === 'Home' || e.key === 'End') {
          e.preventDefault();
          takeOver();
          activate(e.key === 'Home' ? 0 : tabs.length - 1, { focusTab: true });
        }
      });
    });

    showcase.addEventListener('mouseenter', stopAutoplay);
    showcase.addEventListener('mouseleave', startAutoplay);
    showcase.addEventListener('focusin', takeOver);

    activate(current);
    startAutoplay();
  });

  // Stories Carousel — arrows, dots, keyboard and drag/swipe
  document.querySelectorAll('[data-stories]').forEach(carousel => {
    const track = carousel.querySelector('[data-stories-track]');
    const viewport = carousel.querySelector('.stories-viewport');
    const dotsWrap = carousel.querySelector('[data-stories-dots]');
    const prevBtn = carousel.querySelector('[data-stories-prev]');
    const nextBtn = carousel.querySelector('[data-stories-next]');
    if (!track || !viewport) return;

    const slides = Array.from(track.children);
    if (slides.length < 2) return;

    const interval = Number(carousel.dataset.autoplay || 0);
    const canAutoplay = interval > 0 && !prefersReducedMotion;
    let current = 0;
    let autoplayId = null;
    // Once the visitor drives the carousel themselves, autoplay never resumes.
    let engaged = false;

    const dots = slides.map((_, i) => {
      if (!dotsWrap) return null;
      const dot = document.createElement('button');
      dot.className = 'stories-dot';
      dot.type = 'button';
      dot.setAttribute('aria-label', `Go to story ${i + 1}`);
      dot.addEventListener('click', () => {
        takeOver();
        goTo(i);
      });
      dotsWrap.appendChild(dot);
      return dot;
    });

    function goTo(index) {
      current = (index + slides.length) % slides.length;
      const rtl = document.documentElement.getAttribute('dir') === 'rtl';
      track.style.transform = `translateX(${(rtl ? 1 : -1) * current * 100}%)`;
      slides.forEach((slide, i) => slide.setAttribute('aria-hidden', String(i !== current)));
      dots.forEach((dot, i) => {
        if (dot) dot.setAttribute('aria-current', String(i === current));
      });
    }

    const stopAutoplay = () => {
      if (autoplayId === null) return;
      window.clearInterval(autoplayId);
      autoplayId = null;
    };

    const startAutoplay = () => {
      if (!canAutoplay || engaged || autoplayId !== null) return;
      autoplayId = window.setInterval(() => goTo(current + 1), interval);
    };

    function takeOver() {
      engaged = true;
      stopAutoplay();
    }

    if (prevBtn) prevBtn.addEventListener('click', () => { takeOver(); goTo(current - 1); });
    if (nextBtn) nextBtn.addEventListener('click', () => { takeOver(); goTo(current + 1); });

    viewport.addEventListener('keydown', e => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      e.preventDefault();
      takeOver();
      const forward = document.documentElement.getAttribute('dir') === 'rtl'
        ? e.key === 'ArrowLeft'
        : e.key === 'ArrowRight';
      goTo(current + (forward ? 1 : -1));
    });

    // Drag / swipe
    let startX = null;
    viewport.addEventListener('pointerdown', e => {
      startX = e.clientX;
      takeOver();
    });
    viewport.addEventListener('pointerup', e => {
      if (startX === null) return;
      const delta = e.clientX - startX;
      startX = null;
      if (Math.abs(delta) < 45) return;
      const rtl = document.documentElement.getAttribute('dir') === 'rtl';
      const forward = rtl ? delta > 0 : delta < 0;
      goTo(current + (forward ? 1 : -1));
    });
    viewport.addEventListener('pointercancel', () => { startX = null; });

    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);
    carousel.addEventListener('focusin', takeOver);

    // Keep the offset correct when the RTL toggle flips direction.
    document.querySelectorAll('.rtl-toggle').forEach(toggle => {
      toggle.addEventListener('click', () => goTo(current));
    });

    goTo(0);
    startAutoplay();
  });

  // Reveal On Scroll — progressive enhancement, elements stay visible without JS
  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    const revealTargets = document.querySelectorAll(
      '.section-header, .steps-grid > *, .subjects-grid > *, .grid-3 > *, .grid-2 > *, .grid-4 > *, .hero-actions, .filter-bar, .footer-grid > *'
    );

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const el = entry.target;
        el.classList.add('is-visible');
        obs.unobserve(el);

        // Drop the reveal styles once the animation is done so they never
        // interfere with hover transitions on the same element.
        const delay = Number(el.dataset.revealDelay || 0);
        window.setTimeout(() => {
          el.style.transitionDelay = '';
          el.classList.remove('reveal', 'is-visible');
        }, delay + 900);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealTargets.forEach((el, index) => {
      // Stagger siblings slightly for a smoother cascade
      const delay = (index % 4) * 80;
      el.dataset.revealDelay = delay;
      el.style.transitionDelay = `${delay}ms`;
      el.classList.add('reveal');
      observer.observe(el);
    });
  }

  /* ---------------------------------------------------------------
     Pointer spotlight — writes the cursor position into --mx/--my on
     the hovered tile so CSS can paint a radial highlight under it.
     Pointer events only: touch and keyboard fall back to the centred
     default already declared in the stylesheet.
  --------------------------------------------------------------- */
  document.querySelectorAll('[data-spotlight]').forEach(board => {
    board.addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse') return;
      const tile = e.target.closest('.cat-tile');
      if (!tile) return;
      const rect = tile.getBoundingClientRect();
      tile.style.setProperty('--mx', `${e.clientX - rect.left}px`);
      tile.style.setProperty('--my', `${e.clientY - rect.top}px`);
    });
    board.addEventListener('pointerleave', () => {
      board.querySelectorAll('.cat-tile').forEach(tile => {
        tile.style.removeProperty('--mx');
        tile.style.removeProperty('--my');
      });
    });
  });

});
