/**
 * main.js — Interactive & Animation Engine
 * José Antonio Martínez Castañón — Portfolio
 * Standard: GSAP 3 + ScrollTrigger + Web Interface Guidelines
 */

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ==========================================================================
  // 1. Ambient Mouse Spotlight Effect (Desktop)
  // ==========================================================================
  const spotlight = document.querySelector('.ambient-spotlight');
  if (spotlight && !prefersReducedMotion && window.innerWidth > 768) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }, { passive: true });

    const animateSpotlight = () => {
      currentX += (mouseX - currentX) * 0.08;
      currentY += (mouseY - currentY) * 0.08;
      spotlight.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      requestAnimationFrame(animateSpotlight);
    };
    animateSpotlight();
  }

  // ==========================================================================
  // 2. Mobile Menu Toggle & Keyboard Accessibility
  // ==========================================================================
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (mobileToggle && navMenu) {
    const toggleMenu = (open) => {
      const isOpen = typeof open === 'boolean' ? open : !navMenu.classList.contains('open');
      navMenu.classList.toggle('open', isOpen);
      mobileToggle.setAttribute('aria-expanded', String(isOpen));
      mobileToggle.innerHTML = isOpen ? '✕' : '☰';
    };

    mobileToggle.addEventListener('click', () => toggleMenu());

    // Cerrar al hacer clic en un enlace de navegación
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => toggleMenu(false));
    });

    // Cerrar al hacer clic fuera
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target) && navMenu.classList.contains('open')) {
        toggleMenu(false);
      }
    });

    // Cerrar con tecla Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        toggleMenu(false);
        mobileToggle.focus();
      }
    });
  }

  // ==========================================================================
  // 3. Highlight Active Navigation Link
  // ==========================================================================
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ==========================================================================
  // 4. Toast Notification Utility (Accesible con aria-live)
  // ==========================================================================
  window.showToast = function(message) {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<iconify-icon icon="lucide:check-circle-2" style="color: var(--accent-emerald); font-size: 18px;"></iconify-icon> <span>${message}</span>`;
    toast.classList.add('show');
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  };

  // ==========================================================================
  // 5. Copy to Clipboard Buttons
  // ==========================================================================
  document.querySelectorAll('[data-copy]').forEach(button => {
    button.addEventListener('click', async (e) => {
      e.preventDefault();
      const textToCopy = button.getAttribute('data-copy');
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(textToCopy);
        } else {
          const textArea = document.createElement('textarea');
          textArea.value = textToCopy;
          textArea.style.position = 'fixed';
          textArea.style.opacity = '0';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
        }

        const originalText = button.textContent;
        button.textContent = '¡Copiado!';
        button.classList.add('copied');
        window.showToast(`Copiado al portapapeles: ${textToCopy}`);

        setTimeout(() => {
          button.textContent = originalText;
          button.classList.remove('copied');
        }, 2200);
      } catch (err) {
        window.showToast('No se pudo copiar automáticamente');
      }
    });
  });

  // ==========================================================================
  // 6. Interactive Engineering Console Tabs (Hero Section)
  // ==========================================================================
  const tabBtns = document.querySelectorAll('.console-tab-btn');
  const tabPanes = document.querySelectorAll('.console-tab-pane');

  if (tabBtns.length > 0) {
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');
        tabBtns.forEach(b => b.classList.remove('active'));
        tabPanes.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const activePane = document.getElementById(targetTab);
        if (activePane) {
          activePane.classList.add('active');
        }
      });
    });
  }

  // ==========================================================================
  // 7. Interactive Skills Category Filter
  // ==========================================================================
  const filterBtns = document.querySelectorAll('.skills-filter-btn');
  const skillCards = document.querySelectorAll('.skill-category-card');

  if (filterBtns.length > 0 && skillCards.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');

        skillCards.forEach(card => {
          const category = card.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            card.style.display = 'flex';
            if (!prefersReducedMotion && window.gsap) {
              gsap.fromTo(card, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' });
            } else {
              card.style.opacity = '1';
              card.style.transform = 'none';
            }
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // ==========================================================================
  // 8. Contact Page: Dynamic Mailto Topic Generator
  // ==========================================================================
  const topicBtns = document.querySelectorAll('.mailto-topic-btn');
  const mainMailtoLink = document.getElementById('main-mailto-btn');

  if (topicBtns.length > 0 && mainMailtoLink) {
    const templates = {
      job: {
        subject: 'Propuesta Laboral / Oportunidad de Empleo',
        body: 'Hola José Antonio,\n\nMe pongo en contacto contigo para presentarte una oportunidad profesional en nuestro equipo...'
      },
      project: {
        subject: 'Propuesta de Proyecto / Desarrollo de Software',
        body: 'Hola José Antonio,\n\nTenemos en mente un proyecto de software y nos gustaría contar con tu experiencia técnica en desarrollo...'
      },
      consulting: {
        subject: 'Consulta Técnica / Colaboración',
        body: 'Hola José Antonio,\n\nMe gustaría consultarte sobre una colaboración técnica o resolver algunas dudas relacionadas con ingeniería...'
      }
    };

    topicBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        topicBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const topicKey = btn.getAttribute('data-topic');
        const template = templates[topicKey] || templates.job;

        const encodedSubject = encodeURIComponent(template.subject);
        const encodedBody = encodeURIComponent(template.body);
        mainMailtoLink.setAttribute('href', `mailto:jose.antonio.pepe@icloud.com?subject=${encodedSubject}&body=${encodedBody}`);
        window.showToast(`Plantilla seleccionada: ${template.subject}`);
      });
    });
  }

  // ==========================================================================
  // 9. Card 3D Hover Spotlight / Sheen Effect (Desktop)
  // ==========================================================================
  if (!prefersReducedMotion && window.innerWidth > 992) {
    const interactiveCards = document.querySelectorAll('.project-card, .timeline-card, .skill-category-card, .hero-console-card, .contact-card');
    interactiveCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });
    });
  }

  // ==========================================================================
  // 10. GSAP & ScrollTrigger Animations Orchestration
  // ==========================================================================
  if (prefersReducedMotion) {
    // Si el usuario prefiere movimiento reducido, asegurar visibilidad inmediata
    document.querySelectorAll('.gsap-reveal').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    return;
  }

  if (typeof gsap !== 'undefined') {
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    // A. Hero Load Entrance Timeline
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    heroTl
      .fromTo('.site-header', { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 })
      .fromTo('.terminal-tag', { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5 }, '-=0.4')
      .fromTo('.hero-title', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, '-=0.3')
      .fromTo('.hero-subtitle', { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, '-=0.4')
      .fromTo('.hero-description', { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, '-=0.3')
      .fromTo('.hero-meta-badges .meta-chip', { y: 12, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.06, duration: 0.4 }, '-=0.2')
      .fromTo('.hero-cta .btn', { y: 14, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1, duration: 0.5 }, '-=0.2')
      .fromTo('.hero-console-card', { x: 30, opacity: 0, rotationY: -6 }, { x: 0, opacity: 1, rotationY: 0, duration: 0.8 }, '-=0.6');

    // B. ScrollTrigger para Secciones (.gsap-reveal)
    if (typeof ScrollTrigger !== 'undefined') {
      const revealElements = document.querySelectorAll('.gsap-reveal');
      revealElements.forEach(el => {
        gsap.fromTo(el,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              toggleActions: 'play none none none',
              once: true
            }
          }
        );
      });

      // Animación progresiva de la línea del timeline
      const timelineTrack = document.querySelector('.timeline-track');
      if (timelineTrack) {
        gsap.fromTo(timelineTrack, 
          { scaleY: 0, transformOrigin: 'top center' },
          {
            scaleY: 1,
            duration: 1.2,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: '.timeline-wrapper',
              start: 'top 80%',
              once: true
            }
          }
        );
      }
    }
  } else {
    // Fallback con IntersectionObserver si GSAP no está cargado
    const revealElements = document.querySelectorAll('.gsap-reveal');
    if ('IntersectionObserver' in window && revealElements.length > 0) {
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });

      revealElements.forEach(el => observer.observe(el));
    } else {
      revealElements.forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
    }
  }
});
