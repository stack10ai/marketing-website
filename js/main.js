/* Stack10 — Main JavaScript */

document.addEventListener('DOMContentLoaded', () => {
  // Announcement banner
  const banner = document.getElementById('announcement-banner');
  const bannerClose = document.getElementById('banner-close');
  const nav = document.querySelector('.nav');

  function dismissBanner() {
    if (banner) {
      banner.style.display = 'none';
      document.body.classList.add('banner-dismissed');
    }
  }

  if (banner && bannerClose) {
    bannerClose.addEventListener('click', dismissBanner);
  }

  // Auto-hide banner on scroll, restore at top
  let manuallyDismissed = false;
  if (banner) {
    const origDismiss = dismissBanner;
    // Override manual dismiss to set flag
    bannerClose.addEventListener('click', () => { manuallyDismissed = true; });

    window.addEventListener('scroll', () => {
      if (manuallyDismissed) return;
      if (window.scrollY > 60) {
        banner.style.display = 'none';
        document.body.classList.add('banner-dismissed');
      } else {
        banner.style.display = '';
        document.body.classList.remove('banner-dismissed');
      }
    }, { passive: true });
  }

  // Nav scroll effect + logo swap for dark hero pages
  const navLogo = document.querySelector('.nav-logo img');
  const isDarkHero = document.querySelector('section.hero.section-dark');

  // Set initial logo for dark hero pages
  if (isDarkHero && navLogo && navLogo.src.includes('logo-1.svg')) {
    navLogo.src = navLogo.src.replace('logo-1.svg', 'logo-2.svg');
  }

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY > 10;
    nav.classList.toggle('scrolled', scrolled);
    if (navLogo && isDarkHero) {
      if (scrolled) {
        navLogo.src = navLogo.src.replace('logo-2.svg', 'logo-1.svg');
      } else {
        navLogo.src = navLogo.src.replace('logo-1.svg', 'logo-2.svg');
      }
    }
  });

  // Mobile menu
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('active');
    });
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('active');
      });
    });
  }

  // Scroll animations (IntersectionObserver)
  const fadeEls = document.querySelectorAll('.fade-up');
  if (fadeEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    fadeEls.forEach(el => observer.observe(el));
  }

  // Number count-up animation for stat numbers
  const statNumbers = document.querySelectorAll('.stat-number');
  if (statNumbers.length) {
    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const text = el.textContent.trim();
          countObserver.unobserve(el);
          // Parse the target value
          if (text.includes('%')) {
            const target = parseInt(text);
            animateCount(el, 0, target, '%', 1200);
          } else if (text.startsWith('$')) {
            const num = parseFloat(text.replace(/[$T]/g, ''));
            animateCountDecimal(el, 0, num, '$', 'T', 1400);
          } else if (text.includes('mo')) {
            // "6–18 mo" - just fade in, don't count
            el.style.opacity = '1';
          }
        }
      });
    }, { threshold: 0.5 });

    function animateCount(el, start, end, suffix, duration) {
      const startTime = performance.now();
      el.style.opacity = '1';
      function tick(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(start + (end - start) * eased);
        el.textContent = current + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }

    function animateCountDecimal(el, start, end, prefix, suffix, duration) {
      const startTime = performance.now();
      el.style.opacity = '1';
      function tick(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = (start + (end - start) * eased).toFixed(1);
        el.textContent = prefix + current + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }

    statNumbers.forEach(el => countObserver.observe(el));
  }

  // Contact form
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.querySelector('[name="name"]').value;
      const email = form.querySelector('[name="email"]').value;
      const company = form.querySelector('[name="company"]').value;
      const message = form.querySelector('[name="message"]').value;
      const subject = encodeURIComponent(`Stack10 Inquiry from ${name} — ${company}`);
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nCompany: ${company}\n\n${message}`);
      window.location.href = `mailto:hello@stack10.ai?subject=${subject}&body=${body}`;
    });
  }
});
