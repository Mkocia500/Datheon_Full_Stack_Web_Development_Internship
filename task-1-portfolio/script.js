document.addEventListener('DOMContentLoaded', () => {


  // DARK AND LIGHT THEME TOGGLE

  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const htmlElement = document.documentElement;

  // Restore previously selected theme from localStorage on initial load
  const savedTheme = localStorage.getItem('theme') || 'light';
  if (savedTheme === 'dark') {
    htmlElement.setAttribute('data-theme', 'dark');
    themeIcon.textContent = '☀️';
  }

  // Toggle theme attribute, swap icon, and save preference
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


  // MOBILE HAMBURGER NAVIGATION MENU

  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav__link');

  // Toggle drawer visibility and update accessibility state
  navToggle.addEventListener('click', () => {
    const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', !isExpanded);
    navMenu.classList.toggle('active');
  });

  // Automatically close the mobile menu after selecting a section link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });


  // PROJECT DETAILS DATA AND MODAL POPUP

  // Project metadata mapped by card data-project attribute
  const projectData = {
    ecommerce: {
      tag: 'Web App • React',
      title: 'Modern E-Commerce Platform',
      desc: 'A feature-rich e-commerce storefront developed with React and Vite. Includes responsive product grids, search filtering, an interactive shopping cart drawer, and clean modular component architecture designed for high maintainability.',
      tech: ['React', 'Vite', 'JavaScript (ES6+)', 'CSS3 Flexbox/Grid', 'Git'],
      repo: 'https://github.com/Mkocia500/Datheon_Full_Stack_Web_Development_Internship',
      demo: ''
    },
    'student-reg': {
      tag: 'Android & Node.js',
      title: 'Student Registration & Lab Portal',
      desc: 'A comprehensive academic management suite featuring a native Java Android application with local Room database caching, background SyncWorker synchronization, PDF report generation, and a Node.js connection-pooling backend.',
      tech: ['Java (Android)', 'Room Database', 'WorkManager', 'Node.js', 'MySQL', 'REST API'],
      repo: 'https://github.com/Mkocia500',
      demo: ''
    },
    unilife: {
      tag: 'Cross-Platform • Flutter',
      title: 'UniLife Campus Companion',
      desc: 'A cross-platform mobile application built using Flutter to streamline student onboarding and campus registration workflows. Features responsive state management and seamless multi-screen view transitions.',
      tech: ['Flutter', 'Dart', 'State Management', 'Mobile UI/UX'],
      repo: 'https://github.com/Mkocia500',
      demo: ''
    },
    portfolio: {
      tag: 'HTML5 • CSS3 • JS',
      title: 'Developer Portfolio Showcase',
      desc: 'This exact portfolio website! Built from scratch with semantic HTML5, modern CSS Grid/Flexbox layouts, persistent dark/light theming, mobile hamburger navigation, and interactive project modal dialogs.',
      tech: ['HTML5', 'Modern CSS3', 'Vanilla JavaScript', 'Local Storage'],
      repo: 'https://github.com/Mkocia500',
      demo: ''
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

  // Populate modal fields with the clicked project's details and lock background scroll
  projectCards.forEach(card => {
    card.addEventListener('click', () => {
      const projectId = card.getAttribute('data-project');
      const data = projectData[projectId];
      if (!data) return;

      modalTag.textContent = data.tag;
      modalTitle.textContent = data.title;
      modalDesc.textContent = data.desc;

      if (modalRepo) {
        modalRepo.href = data.repo || 'https://github.com/Mkocia500';
      }

      if (modalDemo) {
        if (data.demo) {
          modalDemo.href = data.demo;
          modalDemo.style.display = 'inline-block';
        } else {
          modalDemo.style.display = 'none';
        }
      }

      // Render tech stack badges dynamically
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

  // Hide modal and restore normal page scrolling
  const closeModal = () => {
    modalBackdrop.classList.remove('active');
    modalBackdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = 'auto';
  };

  modalClose.addEventListener('click', closeModal);

  // Close modal when clicking the dark backdrop outside the dialog box
  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeModal();
  });

  // Close modal when pressing the Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('active')) {
      closeModal();
    }
  });


  // CONTACT FORM SUBMISSION HANDLER

  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  // Simulate async submission feedback and reset form inputs
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


  // DYNAMIC COPYRIGHT YEAR IN FOOTER

  const yearSpan = document.getElementById('year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }


});