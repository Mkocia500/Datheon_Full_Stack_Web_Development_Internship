document.addEventListener('DOMContentLoaded', () => {
  // ==========================
  // 1. Dark / Light Theme Toggle
  // ==========================
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const htmlElement = document.documentElement;

  // Check saved theme or system preference
  const savedTheme = localStorage.getItem('theme') || 'light';
  if (savedTheme === 'dark') {
    htmlElement.setAttribute('data-theme', 'dark');
    themeIcon.textContent = '☀️';
  }

  themeToggle.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    if (currentTheme === 'dark') {
      htmlElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
      themeIcon.textContent = '🌙';
    } else {
      htmlElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
      themeIcon.textContent = '☀️';
    }
  });

  // ==========================
  // 2. Mobile Hamburger Menu
  // ==========================
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav__link');

  navToggle.addEventListener('click', () => {
    const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', !isExpanded);
    navMenu.classList.toggle('active');
  });

  // Close menu when clicking any nav link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // ==========================
  // 3. Dynamic Project Modals
  // ==========================
  const projectData = {
    ecommerce: {
      tag: 'Web App • React',
      title: 'Modern E-Commerce Platform',
      desc: 'A feature-rich e-commerce storefront developed with React and Vite. Includes responsive product grids, search filtering, an interactive shopping cart drawer, and clean modular component architecture designed for high maintainability.',
      tech: ['React', 'Vite', 'JavaScript (ES6+)', 'CSS3 Flexbox/Grid', 'Git'],
      repo: 'https://github.com/Mkocia500/Datheon_Full_Stack_Web_Development_Internship',
      demo: '#'
    },
    'student-reg': {
      tag: 'Android & Node.js',
      title: 'Student Registration & Lab Portal',
      desc: 'A comprehensive academic management suite featuring a native Java Android application with local Room database caching, background SyncWorker synchronization, PDF report generation, and a Node.js connection-pooling backend.',
      tech: ['Java (Android)', 'Room Database', 'WorkManager', 'Node.js', 'MySQL', 'REST API'],
      repo: 'https://github.com/Mkocia500',
      demo: '#'
    },
    unilife: {
      tag: 'Cross-Platform • Flutter',
      title: 'UniLife Campus Companion',
      desc: 'A cross-platform mobile application built using Flutter to streamline student onboarding and campus registration workflows. Features responsive state management and seamless multi-screen view transitions.',
      tech: ['Flutter', 'Dart', 'State Management', 'Mobile UI/UX'],
      repo: 'https://github.com/Mkocia500',
      demo: '#'
    },
    portfolio: {
      tag: 'HTML5 • CSS3 • JS',
      title: 'Developer Portfolio Showcase',
      desc: 'This exact portfolio website! Built from scratch with semantic HTML5, modern CSS Grid/Flexbox layouts, persistent dark/light theming, mobile hamburger navigation, and interactive project modal dialogs.',
      tech: ['HTML5', 'Modern CSS3', 'Vanilla JavaScript', 'Local Storage'],
      repo: 'https://github.com/Mkocia500',
      demo: '#'
    }
  };

  const modalBackdrop = document.getElementById('project-modal');
  const modalClose = document.getElementById('modal-close');
  const modalTag = document.getElementById('modal-tag');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');
  const modalTech = document.getElementById('modal-tech');
  const modalRepo = document.getElementById('modal-repo');
  const modalDemo = document.getElementById('modal-demo');
  const projectCards = document.querySelectorAll('.project-card');

  projectCards.forEach(card => {
    card.addEventListener('click', () => {
      const projectId = card.getAttribute('data-project');
      const data = projectData[projectId];
      if (!data) return;

      modalTag.textContent = data.tag;
      modalTitle.textContent = data.title;
      modalDesc.textContent = data.desc;
      modalRepo.href = data.repo;
      modalDemo.href = data.demo;

      // Populate tech stack tags inside modal
      modalTech.innerHTML = '';
      data.tech.forEach(t => {
        const span = document.createElement('span');
        span.textContent = t;
        modalTech.appendChild(span);
      });

      modalBackdrop.classList.add('active');
      modalBackdrop.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeModal = () => {
    modalBackdrop.classList.remove('active');
    modalBackdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = 'auto';
  };

  modalClose.addEventListener('click', closeModal);
  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('active')) {
      closeModal();
    }
  });

  // ==========================
  // 4. Contact Form Handler
  // ==========================
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    formStatus.style.color = 'var(--primary)';
    formStatus.textContent = 'Sending message...';

    setTimeout(() => {
      formStatus.style.color = '#10b981';
      formStatus.textContent = 'Message sent successfully! I will get back to you soon.';
      contactForm.reset();
    }, 1000);
  });

  // ==========================
  // 5. Dynamic Footer Year
  // ==========================
  const yearSpan = document.getElementById('year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
});