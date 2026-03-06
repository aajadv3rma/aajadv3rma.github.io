// ============================================
// DOM Ready
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initCursor();
  initNavigation();
  initScrollProgress();
  initParticles();
  initRevealAnimations();
  initSkillsAnimation();
  fetchGitHubRepos();
  initTerminal();
  initBackToTop();
  initThemeToggle();
  initTiltEffect();
  initContribGraph();
  initStatsCounter();
  initContactForm();
});

// ============================================
// Page Loader
// ============================================
function initLoader() {
  const loader = document.getElementById('page-loader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('loaded');
    }, 2000);
  });
  // Fallback
  setTimeout(() => {
    loader.classList.add('loaded');
  }, 4000);
}

// ============================================
// Custom Cursor
// ============================================
function initCursor() {
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');

  if (!dot || !ring) return;
  if (window.innerWidth <= 768) return;

  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top = mouseY + 'px';
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    ring.style.left = ringX + 'px';
    ring.style.top = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover effect on interactive elements
  const hoverElements = document.querySelectorAll('a, button, input, textarea, .skill-card, .project-card, .timeline-card, .stats-card');
  hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
  });
}

// ============================================
// Navigation
// ============================================
function initNavigation() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  const links = document.querySelectorAll('.nav-link');

  // Scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveLink();
  });

  // Mobile menu
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  // Smooth scroll & close mobile menu
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  // Active link on scroll
  function updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.scrollY + 150;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      const link = document.querySelector(`.nav-link[href="#${id}"]`);

      if (link) {
        if (scrollY >= top && scrollY < top + height) {
          links.forEach(l => l.classList.remove('active'));
          link.classList.add('active');
        }
      }
    });
  }
}

// ============================================
// Scroll Progress Bar
// ============================================
function initScrollProgress() {
  const progressBar = document.getElementById('scroll-progress');

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    progressBar.style.width = progress + '%';
  });
}

// ============================================
// Particle System
// ============================================
function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouseX = 0, mouseY = 0;
  let animId;

  function resize() {
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
  }

  resize();
  window.addEventListener('resize', resize);

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  });

  const particleCount = window.innerWidth < 768 ? 40 : 80;

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.radius = Math.random() * 2 + 0.5;
      this.opacity = Math.random() * 0.5 + 0.1;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      // Mouse interaction
      const dx = this.x - mouseX;
      const dy = this.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        const force = (120 - dist) / 120;
        this.vx += (dx / dist) * force * 0.02;
        this.vy += (dy / dist) * force * 0.02;
      }

      // Damping
      this.vx *= 0.99;
      this.vy *= 0.99;

      // Boundaries
      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

      this.x = Math.max(0, Math.min(canvas.width, this.x));
      this.y = Math.max(0, Math.min(canvas.height, this.y));
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(99, 102, 241, ${this.opacity})`;
      ctx.fill();
    }
  }

  // Create particles
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 150) {
          const opacity = (1 - dist / 150) * 0.15;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    drawConnections();
    animId = requestAnimationFrame(animate);
  }

  animate();
}

// ============================================
// Reveal Animations (Intersection Observer)
// ============================================
function initRevealAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
    observer.observe(el);
  });
}

// ============================================
// Skills Animation
// ============================================
function initSkillsAnimation() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const progressBars = entry.target.querySelectorAll('.progress-bar');
        progressBars.forEach(bar => {
          const progress = bar.getAttribute('data-progress');
          const fill = bar.querySelector('.progress-fill');
          setTimeout(() => {
            fill.style.width = progress + '%';
          }, 300);
        });
      }
    });
  }, { threshold: 0.3 });

  const skillsSection = document.getElementById('skills');
  if (skillsSection) observer.observe(skillsSection);
}

// ============================================
// GitHub API Fetch
// ============================================
async function fetchGitHubRepos() {
  const grid = document.getElementById('projects-grid');

  try {
    const response = await fetch('https://api.github.com/users/aajadv3rma/repos?sort=updated&per_page=30');

    if (!response.ok) throw new Error('Failed to fetch');

    const repos = await response.json();

    // Sort by stars then by updated
    repos.sort((a, b) => b.stargazers_count - a.stargazers_count || new Date(b.updated_at) - new Date(a.updated_at));

    const displayRepos = repos.slice(0, 6);

    if (displayRepos.length === 0) {
      grid.innerHTML = '<p style="text-align:center; color: var(--text-muted); grid-column: 1/-1; padding: 40px;">No public repositories found.</p>';
      return;
    }

    grid.innerHTML = '';

    displayRepos.forEach((repo, index) => {
      const langClass = repo.language ? `lang-${repo.language.toLowerCase().replace(/[^a-z]/g, '')}` : 'lang-default';

      const card = document.createElement('div');
      card.className = 'project-card reveal-up';
      card.style.transitionDelay = `${index * 0.1}s`;
      card.setAttribute('data-tilt', '');

      card.innerHTML = `
        <div class="project-header">
          <div class="project-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="project-link" title="View on GitHub">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/>
            </svg>
          </a>
        </div>
        <h3 class="project-name">${repo.name}</h3>
        <p class="project-desc">${repo.description || 'No description provided.'}</p>
        <div class="project-footer">
          <span class="project-lang">
            <span class="lang-dot ${langClass}"></span>
            ${repo.language || 'Unknown'}
          </span>
          <span class="project-stars">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            ${repo.stargazers_count}
          </span>
        </div>
      `;

      grid.appendChild(card);
    });

    // Re-init observers and tilt for new cards
    setTimeout(() => {
      initRevealAnimations();
      initTiltEffect();
      initCursor();
    }, 100);

  } catch (error) {
    grid.innerHTML = `
      <div style="text-align:center; color: var(--text-muted); grid-column: 1/-1; padding: 40px;">
        <p style="font-size: 1.1rem; margin-bottom: 8px;">Unable to fetch repositories</p>
        <p style="font-size: 0.85rem;">Please visit <a href="https://github.com/aajadv3rma" target="_blank" style="color: var(--accent-1);">GitHub</a> directly.</p>
      </div>
    `;
  }
}

// ============================================
// Terminal
// ============================================
function initTerminal() {
  const input = document.getElementById('terminal-input');
  const body = document.getElementById('terminal-body');

  if (!input || !body) return;

  const commands = {
    help: {
      output: [
        'Available commands:',
        '  whoami      — About me',
        '  skills      — My technical skills',
        '  education   — My education background',
        '  contact     — Contact information',
        '  social      — Social media links',
        '  projects    — My projects',
        '  clear       — Clear terminal',
        '  help        — Show this help message'
      ]
    },
    whoami: {
      output: ['Aajad Verma — Java & Android Developer', 'MCA Student | Building modern apps & digital experiences']
    },
    skills: {
      output: ['Java, Android Development, Git & GitHub, Web Technologies (HTML, CSS, JS)']
    },
    education: {
      output: [
        'BCA — Bachelor of Computer Applications (July 2022 – June 2025)',
        'MCA — Master of Computer Applications (January 2026 – Present)'
      ]
    },
    contact: {
      output: [
        'Primary Email : ajadverma666@gmail.com',
        'Secondary Email: aajadverma555@gmail.com'
      ]
    },
    social: {
      output: [
        'GitHub   : https://github.com/aajadv3rma',
        'LinkedIn : https://linkedin.com/in/aajadv3rma'
      ]
    },
    projects: {
      output: ['Visit the Projects section above or check out:', 'https://github.com/aajadv3rma']
    }
  };

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const cmd = input.value.trim().toLowerCase();
      if (!cmd) return;

      // Add command line
      addLine(`<span class="prompt">visitor@portfolio:~$</span> <span class="command">${escapeHtml(input.value.trim())}</span>`);

      if (cmd === 'clear') {
        body.innerHTML = '<div class="terminal-welcome">Terminal cleared. Type \'help\' for commands.</div>';
      } else if (commands[cmd]) {
        commands[cmd].output.forEach(line => {
          addLine(`<span class="output">${escapeHtml(line)}</span>`);
        });
      } else {
        addLine(`<span class="error">Command not found: '${escapeHtml(cmd)}'. Type 'help' for available commands.</span>`);
      }

      input.value = '';
      body.scrollTop = body.scrollHeight;
    }
  });

  function addLine(html) {
    const line = document.createElement('div');
    line.className = 'terminal-line';
    line.innerHTML = html;
    body.appendChild(line);
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Auto-type demo commands on scroll
  const terminalSection = document.getElementById('terminal');
  let autoTyped = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !autoTyped) {
        autoTyped = true;
        autoTypeDemo();
      }
    });
  }, { threshold: 0.5 });

  observer.observe(terminalSection);

  async function autoTypeDemo() {
    const demoCommands = ['whoami', 'skills', 'education'];

    for (const cmd of demoCommands) {
      await typeCommand(cmd);
      await wait(400);

      addLine(`<span class="prompt">visitor@portfolio:~$</span> <span class="command">${cmd}</span>`);

      commands[cmd].output.forEach(line => {
        addLine(`<span class="output">${escapeHtml(line)}</span>`);
      });

      body.scrollTop = body.scrollHeight;
      await wait(800);
    }

    input.focus();
  }

  function typeCommand(cmd) {
    return new Promise(resolve => {
      let i = 0;
      input.value = '';
      const interval = setInterval(() => {
        input.value += cmd[i];
        i++;
        if (i >= cmd.length) {
          clearInterval(interval);
          setTimeout(() => {
            input.value = '';
            resolve();
          }, 300);
        }
      }, 80);
    });
  }

  function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// ============================================
// Back to Top
// ============================================
function initBackToTop() {
  const btn = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ============================================
// Theme Toggle
// ============================================
function initThemeToggle() {
  const toggle = document.getElementById('theme-toggle');
  const html = document.documentElement;

  // Check saved theme
  const saved = localStorage.getItem('theme');
  if (saved) {
    html.setAttribute('data-theme', saved);
  }

  toggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });
}

// ============================================
// Tilt Effect
// ============================================
function initTiltEffect() {
  const cards = document.querySelectorAll('[data-tilt]');

  cards.forEach(card => {
    if (card._tiltInit) return;
    card._tiltInit = true;

    card.addEventListener('mousemove', (e) => {
      if (window.innerWidth <= 768) return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
  });
}

// ============================================
// Contribution Graph
// ============================================
function initContribGraph() {
  const graph = document.getElementById('contrib-graph');
  if (!graph) return;

  const totalCells = 364; // 52 weeks * 7 days
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < totalCells; i++) {
    const cell = document.createElement('div');
    cell.className = 'contrib-cell';

    // Random contribution level
    const rand = Math.random();
    if (rand > 0.7) cell.classList.add('level-1');
    if (rand > 0.82) cell.classList.add('level-2');
    if (rand > 0.9) cell.classList.add('level-3');
    if (rand > 0.96) cell.classList.add('level-4');

    fragment.appendChild(cell);
  }

  graph.appendChild(fragment);
}

// ============================================
// Stats Counter
// ============================================
function initStatsCounter() {
  const counters = document.querySelectorAll('[data-count]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'));
        animateCounter(el, target);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));

  function animateCounter(el, target) {
    let current = 0;
    const increment = target / 60;
    const duration = 2000;
    const stepTime = duration / 60;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current).toLocaleString();
    }, stepTime);
  }
}

// ============================================
// Contact Form
// ============================================
function initContactForm() {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.querySelector('#name').value.trim();
    const email = form.querySelector('#email').value.trim();
    const message = form.querySelector('#message').value.trim();

    if (!name || !email || !message) {
      status.className = 'form-status error';
      status.textContent = 'Please fill in all fields.';
      return;
    }

    // Simulate sending (open mailto as fallback)
    const mailtoLink = `mailto:ajadverma666@gmail.com?subject=Portfolio Contact from ${encodeURIComponent(name)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;

    status.className = 'form-status success';
    status.textContent = '✓ Message prepared! Opening your email client...';

    setTimeout(() => {
      window.location.href = mailtoLink;
    }, 1000);

    form.reset();

    setTimeout(() => {
      status.className = 'form-status';
      status.textContent = '';
    }, 5000);
  });
}
