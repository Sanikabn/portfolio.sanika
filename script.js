// Interactive functionality for Sanika's Portfolio
document.addEventListener('DOMContentLoaded', () => {

  // ========================================================
  // 1. VERTICAL SIDEBAR: MOBILE TOGGLE & ACCESSIBILITY
  // ========================================================
  const sidebar = document.getElementById('vertical-sidebar');
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const sidebarOverlay = document.getElementById('sidebar-overlay');
  const sidebarNavLinks = document.querySelectorAll('.sidebar-nav-link');

  function openSidebar() {
    if (!sidebar) return;
    sidebar.classList.add('is-open');
    if (sidebarOverlay) sidebarOverlay.classList.add('active');
    if (sidebarToggle) {
      sidebarToggle.setAttribute('aria-expanded', 'true');
      const menuLabel = sidebarToggle.querySelector('.menu-label');
      if (menuLabel) menuLabel.textContent = 'CLOSE';
      const menuIcon = sidebarToggle.querySelector('.menu-icon');
      if (menuIcon) menuIcon.textContent = '✕';
    }
  }

  function closeSidebar() {
    if (!sidebar) return;
    sidebar.classList.remove('is-open');
    if (sidebarOverlay) sidebarOverlay.classList.remove('active');
    if (sidebarToggle) {
      sidebarToggle.setAttribute('aria-expanded', 'false');
      const menuLabel = sidebarToggle.querySelector('.menu-label');
      if (menuLabel) menuLabel.textContent = 'MENU';
      const menuIcon = sidebarToggle.querySelector('.menu-icon');
      if (menuIcon) menuIcon.textContent = '☰';
    }
  }

  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', () => {
      const isOpen = sidebar.classList.contains('is-open');
      isOpen ? closeSidebar() : openSidebar();
    });
  }

  if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', closeSidebar);
  }

  // Close sidebar on link click (mobile)
  sidebarNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 1024) {
        closeSidebar();
      }
    });
  });

  // Accessible keyboard ESC key to close sidebar
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar && sidebar.classList.contains('is-open')) {
      closeSidebar();
      if (sidebarToggle) sidebarToggle.focus();
    }
  });


  // ========================================================
  // 2. NIGHT MODE TOGGLE (Detects default browser theme via media queries)
  // ========================================================
  const themeToggleBtn = document.getElementById('theme-toggle');
  const toggleIcon = themeToggleBtn ? themeToggleBtn.querySelector('.toggle-icon') : null;
  const toggleState = document.getElementById('toggle-state');
  
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)');

  function getActiveTheme() {
    const savedTheme = localStorage.getItem('portfolio-theme');
    if (savedTheme) {
      return savedTheme;
    }
    return 'dark'; // Dark theme default as requested
  }

  function applyTheme(theme, isUserAction = false) {
    if (isUserAction) {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('portfolio-theme', theme);
    } else {
      const savedTheme = localStorage.getItem('portfolio-theme');
      if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
      }
    }

    const isDark = (document.documentElement.getAttribute('data-theme') === 'dark');

    if (toggleIcon) {
      toggleIcon.textContent = isDark ? '🌙' : '☀️';
    }
    if (toggleState) {
      const hasOverride = localStorage.getItem('portfolio-theme') !== null;
      toggleState.textContent = isDark ? (hasOverride ? 'ON' : 'AUTO') : (hasOverride ? 'OFF' : 'AUTO');
    }
  }

  applyTheme(getActiveTheme(), false);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme, true);
    });
  }

  systemPrefersDark.addEventListener('change', (e) => {
    if (!localStorage.getItem('portfolio-theme')) {
      applyTheme(e.matches ? 'dark' : 'light', false);
    }
  });


  // ========================================================
  // 3. VERTICAL NAV SCROLLSPY (Tracks all 8 sections)
  // ========================================================
  const sections = document.querySelectorAll('section');

  function updateActiveNav() {
    let currentSectionId = '';
    const scrollPosition = window.scrollY + 250;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
        currentSectionId = section.getAttribute('id');
      }
    });

    sidebarNavLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();


  // ========================================================
  // 4. INTERACTIVE PIXEL CHATBOT CONSOLE
  // ========================================================
  const chatMessages = document.getElementById('chat-messages');
  const chatForm = document.getElementById('chat-input-form');
  const chatInput = document.getElementById('chat-user-input');
  const quickPromptBtns = document.querySelectorAll('.chat-prompt-btn');

  const botResponses = {
    skills: "⚡ Sanika excels in JavaScript (ES6+), React.js, Node.js, Express, Python, SQL, REST APIs, Git, and modern responsive CSS with pixel-perfect precision!",
    experience: "📜 Sanika has built scalable full-stack applications, real-time monitors, and high-performance APIs across engineering internships and academic milestones.",
    hiring: "💼 Yes! Sanika is actively open for Full Stack & Software Engineering opportunities, high-impact collaborations, and innovative product builds.",
    contact: "✉️ You can connect directly via email at your.email@example.com or ping through LinkedIn: linkedin.com/in/sanika-bn-85a476441!",
    default: "🎮 Beep boop! Thanks for chatting. Feel free to explore the Projects or send a direct note in the Contact form below!"
  };

  function appendChatMessage(sender, text, isBot = false) {
    if (!chatMessages) return;

    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${isBot ? 'bot-bubble' : 'user-bubble'}`;

    const header = document.createElement('div');
    header.className = 'bubble-header';
    header.innerHTML = `<span>${isBot ? '🤖 BOT-SANIKA' : '👤 PLAYER'}</span><span>JUST NOW</span>`;

    const content = document.createElement('p');
    content.className = 'bubble-text';
    content.textContent = text;

    bubble.appendChild(header);
    bubble.appendChild(content);
    chatMessages.appendChild(bubble);

    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  if (quickPromptBtns.length > 0) {
    quickPromptBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const promptKey = btn.getAttribute('data-prompt');
        const userText = btn.textContent;
        appendChatMessage('user', userText, false);

        setTimeout(() => {
          const reply = botResponses[promptKey] || botResponses.default;
          appendChatMessage('bot', reply, true);
        }, 400);
      });
    });
  }

  if (chatForm && chatInput) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = chatInput.value.trim();
      if (!val) return;

      appendChatMessage('user', val, false);
      chatInput.value = '';

      setTimeout(() => {
        const lower = val.toLowerCase();
        let reply = botResponses.default;
        if (lower.includes('skill') || lower.includes('stack') || lower.includes('react') || lower.includes('code')) {
          reply = botResponses.skills;
        } else if (lower.includes('exp') || lower.includes('work') || lower.includes('history')) {
          reply = botResponses.experience;
        } else if (lower.includes('hire') || lower.includes('job') || lower.includes('available')) {
          reply = botResponses.hiring;
        } else if (lower.includes('contact') || lower.includes('email') || lower.includes('reach')) {
          reply = botResponses.contact;
        }
        appendChatMessage('bot', reply, true);
      }, 500);
    });
  }


  // ========================================================
  // 5. CONTACT FORM FEEDBACK DEMO
  // ========================================================
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('.submit-btn');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Message Sent! ✨';
      submitBtn.style.background = 'linear-gradient(135deg, #d4af37, #f5d77f)';
      submitBtn.style.color = '#0c1619';

      setTimeout(() => {
        contactForm.reset();
        submitBtn.textContent = originalText;
        submitBtn.style.background = '';
        submitBtn.style.color = '';
      }, 3000);
    });
  }
});
