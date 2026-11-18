
document.addEventListener('DOMContentLoaded', () => {

  // EMAILJS CONFIGURATION
  const EMAILJS_PUBLIC_KEY = 'TjZsKS11fbstV0w5K';
  const EMAILJS_SERVICE_ID = 'service_4xz1nbn';
  const EMAILJS_TEMPLATE_ID = 'template_uy04f3r';


  // DARK AND LIGHT THEME TOGGLE

  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const htmlElement = document.documentElement;

  const applyTheme = (theme) => {
    if (theme === 'dark') {
      htmlElement.setAttribute('data-theme', 'dark');

      if (themeIcon) {
        themeIcon.textContent = '☀️';
      }
    } else {
      htmlElement.removeAttribute('data-theme');

      if (themeIcon) {
        themeIcon.textContent = '🌙';
      }
    }
  };

  let savedTheme = 'light';

  try {
    savedTheme = localStorage.getItem('theme') || 'light';
  } catch (error) {
    console.warn('Could not access saved theme:', error);
  }

  applyTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme =
        htmlElement.getAttribute('data-theme') === 'dark'
          ? 'dark'
          : 'light';

      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

      applyTheme(newTheme);

      try {
        localStorage.setItem('theme', newTheme);
      } catch (error) {
        console.warn('Could not save theme preference:', error);
      }
    });
  }


  // MOBILE SLIDE-OUT NAVIGATION

  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navClose = document.getElementById('nav-close');
  const navOverlay = document.getElementById('nav-overlay');
  const navLinks = document.querySelectorAll('.nav__link');

  const openNav = () => {
    if (!navMenu || !navOverlay) return;

    navMenu.classList.add('active');
    navOverlay.classList.add('active');
    document.body.classList.add('nav-open');

    if (navToggle) {
      navToggle.setAttribute('aria-expanded', 'true');
    }

    navOverlay.setAttribute('aria-hidden', 'false');
  };

  const closeNav = () => {
    if (!navMenu || !navOverlay) return;

    navMenu.classList.remove('active');
    navOverlay.classList.remove('active');
    document.body.classList.remove('nav-open');

    if (navToggle) {
      navToggle.setAttribute('aria-expanded', 'false');
    }

    navOverlay.setAttribute('aria-hidden', 'true');
  };

  if (navToggle) {
    navToggle.addEventListener('click', openNav);
  }

  if (navClose) {
    navClose.addEventListener('click', closeNav);
  }

  if (navOverlay) {
    navOverlay.addEventListener('click', closeNav);
  }

  navLinks.forEach((link) => {
    link.addEventListener('click', closeNav);
  });


  // PROJECT DETAILS DATA

  const projectData = {

    ecommerce: {
      tag: 'Web App • React',
      title: 'Modern E-Commerce Storefront',
      desc: 'A responsive e-commerce storefront developed using React and JavaScript. It includes product browsing, category filtering, live search, an interactive shopping cart, quantity management, checkout functionality and order history.',
      tech: [
        'React',
        'JavaScript',
        'Vite',
        'CSS3',
        'FakeStoreAPI',
        'Git'
      ],
      repo: 'https://github.com/Mkocia500/Datheon_Full_Stack_Web_Development_Internship',
      demo: 'https://mkociamart.vercel.app'
    },

    'student-reg': {
      tag: 'Android • Node.js • MySQL',
      title: 'Student Registration & Lab Groups Portal',
      desc: 'An academic registration system designed to help students register for programmes and laboratory groups while allowing lecturers to manage student records and registration requests. The project uses an Android application connected to a Node.js backend and MySQL database.',
      tech: [
        'Java',
        'Android Studio',
        'Node.js',
        'Express.js',
        'MySQL',
        'REST API'
      ],
      repo: 'https://github.com/Mkocia500',
      demo: ''
    },

    unilife: {
      tag: 'Cross-Platform • In Development',
      title: 'UniLife Campus Companion',
      desc: 'A student-life management application planned to bring academic schedules, personal events, budgeting, reminders and study organisation into one platform. The project is planned for Android and iOS using Flutter and Dart, with a Node.js backend and MySQL database.',
      tech: [
        'Flutter',
        'Dart',
        'Node.js',
        'MySQL',
        'UI/UX Design'
      ],
      repo: '',
      demo: ''
    },

    portfolio: {
      tag: 'HTML5 • CSS3 • JavaScript',
      title: 'Developer Portfolio',
      desc: 'A personal developer portfolio built to present my background, technical skills and software development projects. It includes responsive layouts, a dark and light theme, mobile navigation and interactive project details.',
      tech: [
        'HTML5',
        'CSS3',
        'JavaScript',
        'Local Storage',
        'EmailJS',
        'Git'
      ],
      repo: 'https://github.com/Mkocia500',
      demo: 'https://mkociamart.vercel.app/'
    }

  };


  // PROJECT DETAILS MODAL

  const modalBackdrop = document.getElementById('project-modal');
  const modalClose = document.getElementById('modal-close');
  const modalTag = document.getElementById('modal-tag');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');
  const modalTech = document.getElementById('modal-tech');
  const modalRepo = document.getElementById('modal-repo');
  const modalDemo = document.getElementById('modal-demo');

  const projectCards = document.querySelectorAll('[data-project]');

  const openModal = (data) => {
    if (
      !modalBackdrop ||
      !modalTag ||
      !modalTitle ||
      !modalDesc ||
      !modalTech
    ) {
      return;
    }

    modalTag.textContent = data.tag;
    modalTitle.textContent = data.title;
    modalDesc.textContent = data.desc;

    if (modalRepo) {
      if (data.repo) {
        modalRepo.href = data.repo;
        modalRepo.style.display = 'inline-block';
      } else {
        modalRepo.style.display = 'none';
      }
    }

    if (modalDemo) {
      if (data.demo) {
        modalDemo.href = data.demo;
        modalDemo.style.display = 'inline-block';
      } else {
        modalDemo.style.display = 'none';
      }
    }

    modalTech.replaceChildren();

    data.tech.forEach((technology) => {
      const badge = document.createElement('span');
      badge.textContent = technology;
      modalTech.appendChild(badge);
    });

    modalBackdrop.classList.add('active');
    modalBackdrop.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');

    if (modalClose) {
      modalClose.focus();
    }
  };

  const closeModal = () => {
    if (!modalBackdrop) return;

    modalBackdrop.classList.remove('active');
    modalBackdrop.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
  };

  projectCards.forEach((card) => {
    card.addEventListener('click', (event) => {
      if (event.target.closest('a, button')) return;

      const projectId = card.getAttribute('data-project');
      const data = projectData[projectId];

      if (!data) return;

      openModal(data);
    });
  });

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (event) => {
      if (event.target === modalBackdrop) {
        closeModal();
      }
    });
  }


  // GLOBAL KEYBOARD ACCESSIBILITY

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeNav();
      closeModal();
    }
  });


  // EMAILJS CONTACT FORM

  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm) {
    contactForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }

      const submitButton = contactForm.querySelector(
        'button[type="submit"]'
      );

      if (!window.emailjs) {
        if (formStatus) {
          formStatus.style.color = '#ef4444';
          formStatus.textContent =
            'The email service could not load. Please refresh the page and try again.';
        }
        return;
      }

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
      }

      if (formStatus) {
        formStatus.style.color = 'var(--primary)';
        formStatus.textContent = 'Sending your message...';
      }

      try {
        await emailjs.sendForm(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          contactForm,
          {
            publicKey: EMAILJS_PUBLIC_KEY
          }
        );

        if (formStatus) {
          formStatus.style.color = '#10b981';
          formStatus.textContent =
            'Your message has been sent successfully. Thank you for contacting me!';
        }

        contactForm.reset();

      } catch (error) {
        console.error('EmailJS submission error:', error);

        if (formStatus) {
          formStatus.style.color = '#ef4444';
          formStatus.textContent =
            'Sorry, your message could not be sent. Please try again or contact me through LinkedIn.';
        }

      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = 'Send Message';
        }
      }
    });
  }


  // DYNAMIC COPYRIGHT YEAR

  const yearSpan = document.getElementById('year');

  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

});
