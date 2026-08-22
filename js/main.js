/* ==========================================================================
   ABHIRAM M - DATA ANALYST PORTFOLIO INTERACTIVE LOGIC
   Engineered by Google Senior UI/UX & Frontend Design Engineering Team
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Lucide Icons
  if (window.lucide) {
    lucide.createIcons();
  }

  // --------------------------------------------------------------------------
  // 2. Interactive Canvas Node Network Background
  // --------------------------------------------------------------------------
  initCanvasBackground();

  // --------------------------------------------------------------------------
  // 3. Typewriter Animated Role Switcher
  // --------------------------------------------------------------------------
  initTypewriter();

  // --------------------------------------------------------------------------
  // 4. Render Skills Grid & Filter / Search Logic
  // --------------------------------------------------------------------------
  initSkillsGrid();

  // --------------------------------------------------------------------------
  // 5. Initialize Chart.js Visualizations for Projects Showcase
  // --------------------------------------------------------------------------
  initProjectCharts();

  // --------------------------------------------------------------------------
  // 6. Live Data Studio & SQL Playground Simulator
  // --------------------------------------------------------------------------
  initDataStudio();

  // --------------------------------------------------------------------------
  // 7. Navbar Scroll Effects & Active Navigation Links
  // --------------------------------------------------------------------------
  initNavbarScroll();

  // --------------------------------------------------------------------------
  // 8. Resume Modal Viewer Handlers
  // --------------------------------------------------------------------------
  initResumeModal();

  // --------------------------------------------------------------------------
  // 9. 3D Tilt Cards, Bio Tabs, and Animated Count-Up Numbers
  // --------------------------------------------------------------------------
  init3DTiltCards();
  initBioTabs();
  initBioCounters();
});

/* --------------------------------------------------------------------------
   CANVAS NODE NETWORK BACKGROUND
   -------------------------------------------------------------------------- */
function initCanvasBackground() {
  const canvas = document.getElementById('canvas-bg');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  let mouse = { x: null, y: null, radius: 150 };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Particle Class
  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.radius = Math.random() * 2 + 1;
      this.vx = (Math.random() - 0.5) * 0.6;
      this.vy = (Math.random() - 0.5) * 0.6;
      this.color = Math.random() > 0.4 ? '#66705A' : '#454C3D';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse reactivity
      if (mouse.x !== null && mouse.y !== null) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          let force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 3;
          this.y -= (dy / dist) * force * 3;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = this.color;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  // Generate particles based on screen area
  const particleCount = Math.floor((width * height) / 18000);
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        let dx = particles[i].x - particles[j].x;
        let dy = particles[i].y - particles[j].y;
        let dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          let alpha = (1 - dist / 120) * 0.25;
          ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* --------------------------------------------------------------------------
   TYPEWRITER ROLE ANIMATION
   -------------------------------------------------------------------------- */
function initTypewriter() {
  const target = document.getElementById('typewriter');
  if (!target) return;

  const roles = [
    "Predictive ML Models.",
    "Interactive BI Dashboards.",
    "Automated ETL Pipelines.",
    "Data-Driven Business Growth."
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 90;

  function type() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      target.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 40;
    } else {
      target.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 90;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      typingSpeed = 1800; // Pause at top
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 400;
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* --------------------------------------------------------------------------
   SKILLS MATRIX & FILTERING
   -------------------------------------------------------------------------- */
const skillsData = [
  { name: 'Python', category: 'language', level: 92, icon: 'code-2' },
  { name: 'SQL & T-SQL', category: 'language', level: 90, icon: 'database' },
  { name: 'R Language', category: 'language', level: 80, icon: 'terminal' },

  { name: 'Power BI & DAX', category: 'viz', level: 95, icon: 'bar-chart-3' },
  { name: 'Tableau', category: 'viz', level: 88, icon: 'pie-chart' },
  { name: 'MS Excel (Power Query)', category: 'viz', level: 94, icon: 'table' },

  { name: 'Pandas & NumPy', category: 'ml', level: 92, icon: 'cpu' },
  { name: 'Scikit-Learn', category: 'ml', level: 86, icon: 'brain-circuit' },
  { name: 'XGBoost & Random Forest', category: 'ml', level: 85, icon: 'git-branch' },
  { name: 'Machine Learning & EDA', category: 'ml', level: 88, icon: 'sparkles' },

  { name: 'MySQL & SQL Server', category: 'db', level: 89, icon: 'server' },
  { name: 'ETL & Data Cleaning', category: 'db', level: 94, icon: 'filter' },
  { name: 'KPI Reporting & Dashboards', category: 'db', level: 96, icon: 'trending-up' }
];

function initSkillsGrid() {
  const container = document.getElementById('skills-grid');
  if (!container) return;

  function renderSkills(filterCategory = 'all', searchQuery = '') {
    container.innerHTML = '';

    const filtered = skillsData.filter(skill => {
      const matchCategory = filterCategory === 'all' || skill.category === filterCategory;
      const matchSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });

    if (filtered.length === 0) {
      container.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:2rem; color:var(--text-muted);">No matching skills found.</div>`;
      return;
    }

    filtered.forEach(skill => {
      const card = document.createElement('div');
      card.className = 'skill-card';
      card.innerHTML = `
        <div class="skill-head">
          <div class="skill-name">
            <i data-lucide="${skill.icon}" style="color:var(--accent-cyan)"></i>
            ${skill.name}
          </div>
          <div class="skill-percentage">${skill.level}%</div>
        </div>
        <div class="progress-track">
          <div class="progress-fill" data-level="${skill.level}"></div>
        </div>
      `;
      container.appendChild(card);
    });

    if (window.lucide) lucide.createIcons();

    // Trigger bar fill animation
    setTimeout(() => {
      document.querySelectorAll('.progress-fill').forEach(bar => {
        bar.style.width = `${bar.getAttribute('data-level')}%`;
      });
    }, 100);
  }

  renderSkills();

  // Tab Filtering
  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-category');
      const searchVal = document.getElementById('skill-search').value;
      renderSkills(cat, searchVal);
    });
  });

  // Search Bar Input
  const searchInput = document.getElementById('skill-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const activeTab = document.querySelector('.tab-btn.active');
      const cat = activeTab ? activeTab.getAttribute('data-category') : 'all';
      renderSkills(cat, e.target.value);
    });
  }
}

/* --------------------------------------------------------------------------
   CHART.JS PROJECT SHOWCASE VISUALIZATIONS
   -------------------------------------------------------------------------- */
function initProjectCharts() {
  Chart.defaults.color = '#6F6D67';
  Chart.defaults.font.family = "'Plus Jakarta Sans', sans-serif";

  // 1. Rainfall Prediction Chart (Line / Regression)
  const ctxRainfall = document.getElementById('chart-rainfall');
  if (ctxRainfall) {
    new Chart(ctxRainfall, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
        datasets: [
          {
            label: 'Actual Rainfall (mm)',
            data: [45, 60, 110, 180, 290, 420, 510, 480, 310, 190],
            borderColor: '#66705A',
            backgroundColor: 'rgba(102, 112, 90, 0.15)',
            fill: true,
            tension: 0.4,
            borderWidth: 2
          },
          {
            label: 'XGBoost Prediction',
            data: [43, 62, 108, 185, 288, 415, 512, 475, 315, 188],
            borderColor: '#454C3D',
            borderDash: [5, 5],
            tension: 0.4,
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: true, position: 'top', labels: { boxWidth: 12, font: { size: 10 } } } },
        scales: { x: { grid: { display: false } }, y: { grid: { color: '#DDDCD6' } } }
      }
    });
  }

  // 2. Top Indian Colleges Report Chart (Grouped Bar Chart)
  const ctxColleges = document.getElementById('chart-colleges');
  if (ctxColleges) {
    new Chart(ctxColleges, {
      type: 'bar',
      data: {
        labels: ['IIT Bombay', 'IIT Delhi', 'BITS Pilani', 'NIT Trichy', 'VIT Vellore'],
        datasets: [
          {
            label: 'Placement Rate (%)',
            data: [98, 96, 94, 91, 88],
            backgroundColor: '#454C3D',
            borderRadius: 6
          },
          {
            label: 'NIRF Score Index',
            data: [92, 90, 85, 82, 78],
            backgroundColor: '#66705A',
            borderRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: true, position: 'top', labels: { boxWidth: 12, font: { size: 10 } } } },
        scales: { x: { grid: { display: false } }, y: { grid: { color: '#DDDCD6' } } }
      }
    });
  }

  // 3. COVID-19 Interactive Dashboard Chart (Time Series Trend Line)
  const ctxCovid = document.getElementById('chart-covid');
  if (ctxCovid) {
    new Chart(ctxCovid, {
      type: 'line',
      data: {
        labels: ['Wave 1', 'Wave 2', 'Recovery Peak', 'Stabilization', 'Current KPI'],
        datasets: [
          {
            label: 'Active Cases (K)',
            data: [350, 850, 420, 150, 25],
            borderColor: '#66705A',
            backgroundColor: 'rgba(102, 112, 90, 0.15)',
            fill: true,
            tension: 0.3
          },
          {
            label: 'Recovery KPI (%)',
            data: [82, 89, 94, 98, 99.4],
            borderColor: '#454C3D',
            tension: 0.3
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: true, position: 'top', labels: { boxWidth: 12, font: { size: 10 } } } },
        scales: { x: { grid: { display: false } }, y: { grid: { color: '#DDDCD6' } } }
      }
    });
  }

  // 4. Walmart Sales Analysis Chart (Seasonal Area Chart)
  const ctxWalmart = document.getElementById('chart-walmart');
  if (ctxWalmart) {
    new Chart(ctxWalmart, {
      type: 'line',
      data: {
        labels: ['Q1 Store Sales', 'Q2 Summer Peak', 'Q3 Back to School', 'Q4 Holiday Rush'],
        datasets: [{
          label: 'Revenue ($ Millions)',
          data: [14.2, 18.6, 21.4, 29.8],
          borderColor: '#454C3D',
          backgroundColor: 'rgba(69, 76, 61, 0.18)',
          fill: true,
          tension: 0.4,
          borderWidth: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: true, position: 'top', labels: { boxWidth: 12, font: { size: 10 } } } },
        scales: { x: { grid: { display: false } }, y: { grid: { color: '#DDDCD6' } } }
      }
    });
  }
}

/* --------------------------------------------------------------------------
   LIVE DATA STUDIO & SQL PLAYGROUND SIMULATOR
   -------------------------------------------------------------------------- */
function initDataStudio() {
  const codeArea = document.getElementById('terminal-code');
  const runBtn = document.getElementById('run-query-btn');
  const resultCanvas = document.getElementById('terminal-result-chart');
  const execTime = document.getElementById('execution-time');
  const presetBtns = document.querySelectorAll('.preset-btn');

  if (!codeArea || !runBtn || !resultCanvas) return;

  let terminalChartInstance = null;

  const queryPresets = {
    sql_sales: {
      code: `SELECT region, SUM(sales_amount) AS total_revenue \nFROM bz_analytics_crm \nWHERE year = 2026 \nGROUP BY region \nORDER BY total_revenue DESC;`,
      chartType: 'bar',
      labels: ['Kerala', 'Dubai UAE', 'Abu Dhabi', 'Kochi Metro', 'Sharjah'],
      datasets: [{
        label: 'Regional Revenue ($K)',
        data: [420, 680, 510, 390, 280],
        backgroundColor: '#66705A',
        borderRadius: 6
      }]
    },
    python_ml: {
      code: `import pandas as pd\nfrom xgboost import XGBRegressor\n\nmodel = XGBRegressor(n_estimators=100, learning_rate=0.05)\nmodel.fit(X_train, y_train)\npreds = model.predict(X_test)\nprint("Model RMSE:", calculate_rmse(y_test, preds))`,
      chartType: 'line',
      labels: ['Iter 10', 'Iter 30', 'Iter 50', 'Iter 70', 'Iter 100'],
      datasets: [
        {
          label: 'Training Loss',
          data: [0.45, 0.28, 0.15, 0.08, 0.03],
          borderColor: '#66705A',
          tension: 0.4
        },
        {
          label: 'Validation Loss',
          data: [0.48, 0.30, 0.18, 0.11, 0.05],
          borderColor: '#454C3D',
          borderDash: [4, 4],
          tension: 0.4
        }
      ]
    },
    dax_colleges: {
      code: `College_Placement_Rate = \nCALCULATE(\n    AVERAGE(Colleges[Placement_Pct]),\n    ALLEXCEPT(Colleges, Colleges[State])\n)`,
      chartType: 'doughnut',
      labels: ['Engineering (94%)', 'Management BBA (89%)', 'Data Analytics (96%)', 'Sciences (82%)'],
      datasets: [{
        data: [94, 89, 96, 82],
        backgroundColor: ['#66705A', '#454C3D', '#8E8C85', '#353B2E'],
        borderWidth: 0
      }]
    }
  };

  function renderTerminalChart(config) {
    if (terminalChartInstance) {
      terminalChartInstance.destroy();
    }

    terminalChartInstance = new Chart(resultCanvas, {
      type: config.chartType,
      data: {
        labels: config.labels,
        datasets: config.datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true, position: 'top', labels: { boxWidth: 10, font: { size: 10 } } }
        },
        scales: config.chartType === 'doughnut' ? {} : {
          x: { grid: { display: false } },
          y: { grid: { color: 'rgba(255,255,255,0.05)' } }
        }
      }
    });
  }

  // Load initial preset
  renderTerminalChart(queryPresets.sql_sales);

  // Preset switch listener
  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      presetBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const key = btn.getAttribute('data-query');
      if (queryPresets[key]) {
        codeArea.value = queryPresets[key].code;
        renderTerminalChart(queryPresets[key]);
        execTime.textContent = (Math.random() * 0.04 + 0.02).toFixed(3) + 'ms';
      }
    });
  });

  // Run Button Click
  runBtn.addEventListener('click', () => {
    runBtn.innerHTML = `<i data-lucide="loader" class="spin"></i> Executing...`;
    if (window.lucide) lucide.createIcons();

    setTimeout(() => {
      runBtn.innerHTML = `<i data-lucide="play"></i> Execute Query`;
      if (window.lucide) lucide.createIcons();

      const activePresetBtn = document.querySelector('.preset-btn.active');
      const key = activePresetBtn ? activePresetBtn.getAttribute('data-query') : 'sql_sales';
      if (queryPresets[key]) {
        renderTerminalChart(queryPresets[key]);
      }
      execTime.textContent = (Math.random() * 0.03 + 0.015).toFixed(3) + 'ms';
    }, 400);
  });
}

/* --------------------------------------------------------------------------
   NAVBAR SCROLL & ACTIVE LINK HIGHLIGHTING
   -------------------------------------------------------------------------- */
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active Section Tracking
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.querySelector('.nav-links');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isVisible = navMenu.style.display === 'flex';
      navMenu.style.display = isVisible ? 'none' : 'flex';
      if (!isVisible) {
        navMenu.style.flexDirection = 'column';
        navMenu.style.position = 'absolute';
        navMenu.style.top = '100%';
        navMenu.style.left = '0';
        navMenu.style.width = '100%';
        navMenu.style.background = '#0F172A';
        navMenu.style.padding = '1.5rem';
        navMenu.style.borderBottom = '1px solid var(--border-glass)';
      }
    });
  }
}

/* --------------------------------------------------------------------------
   RESUME MODAL HANDLERS
   -------------------------------------------------------------------------- */
function initResumeModal() {
  const openBtn = document.getElementById('open-resume-btn');
  const downloadBtn = document.getElementById('download-cv-btn');
  const closeBtn = document.getElementById('close-modal-btn');
  const modal = document.getElementById('resume-modal');

  function openModal() {
    if (modal) modal.classList.add('active');
  }

  function closeModal() {
    if (modal) modal.classList.remove('active');
  }

  if (openBtn) openBtn.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      const link = document.createElement('a');
      link.href = 'Abhiram_M_CV.pdf';
      link.download = 'Abhiram_M_CV.pdf';
      link.click();
    });
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }
}

/* --------------------------------------------------------------------------
   3D CARD TILT & SPOTLIGHT BEAM EFFECT
   -------------------------------------------------------------------------- */
function init3DTiltCards() {
  const tiltCards = document.querySelectorAll('.tilt-card');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -8; // Max 8 deg tilt
      const rotateY = ((x - centerX) / centerX) * 8;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(8px)`;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
    });
  });
}

/* --------------------------------------------------------------------------
   BIO TAB SWITCHER
   -------------------------------------------------------------------------- */
function initBioTabs() {
  const tabBtns = document.querySelectorAll('.bio-tab-btn');
  const tabContents = document.querySelectorAll('.bio-tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabKey = btn.getAttribute('data-tab');

      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      tabContents.forEach(content => {
        content.classList.remove('active');
        if (content.getAttribute('id') === `tab-${tabKey}`) {
          content.classList.add('active');
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   ANIMATED COUNT-UP NUMBERS
   -------------------------------------------------------------------------- */
function initBioCounters() {
  const counterElements = document.querySelectorAll('.bio-metric-num[data-count], .metric-number[data-target]');
  if (counterElements.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count') || el.getAttribute('data-target'), 10);
        let start = 0;
        const duration = 1500;
        const stepTime = 30;
        const increment = target / (duration / stepTime);

        const timer = setInterval(() => {
          start += increment;
          if (start >= target) {
            el.textContent = target;
            clearInterval(timer);
          } else {
            el.textContent = Math.floor(start);
          }
        }, stepTime);

        observer.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  counterElements.forEach(el => observer.observe(el));
}
