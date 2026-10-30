// ============================================================
//  ANIRUDDH PARMAR — script.js (v4 PREMIUM)
//  Loading · Lenis · GSAP · Cursor · Particles · Globe
//  Typewriter · Tabs · Counters · Magnetic · Tilt · Reveal
// ============================================================

/* ══════════════════════════════════════════
   0. LOADING SCREEN
══════════════════════════════════════════ */
(function () {
  const loader = document.getElementById('loader');
  const progress = document.getElementById('loaderProgress');
  if (!loader || !progress) return;

  let p = 0;
  const interval = setInterval(() => {
    p += Math.random() * 15 + 5;
    if (p >= 100) { p = 100; clearInterval(interval); }
    progress.style.width = p + '%';
  }, 120);

  function hideLoader() {
    progress.style.width = '100%';
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.style.overflow = '';
      initGSAPAnimations();
    }, 600);
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    hideLoader();
  } else {
    window.addEventListener('load', hideLoader);
  }

  // Prevent scrolling during load
  document.body.style.overflow = 'hidden';
})();

/* ══════════════════════════════════════════
   1. LENIS SMOOTH SCROLLING
══════════════════════════════════════════ */
let lenis;
(function () {
  if (typeof Lenis === 'undefined') return;
  lenis = new Lenis({
    duration: 0.7,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 0.9,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Connect Lenis to GSAP ScrollTrigger
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
  }
})();

/* ══════════════════════════════════════════
   2. CUSTOM CURSOR
══════════════════════════════════════════ */
(function () {
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || window.innerWidth < 641) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top = my + 'px';
  });

  (function lag() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(lag);
  })();

  const sel = 'a,button,.tab-btn,.proj-card,.skill-pill,.hobby-card,.soc,.skill-tag,.info-card,.hack-card,.social-card,.achieve-card,input,textarea,select,.magnetic-btn,.hero-soc';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(sel)) { dot.classList.add('h'); ring.classList.add('h'); }
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(sel)) { dot.classList.remove('h'); ring.classList.remove('h'); }
  });
  document.addEventListener('mousedown', () => { dot.style.transform = 'translate(-50%,-50%) scale(.6)'; });
  document.addEventListener('mouseup', () => { dot.style.transform = 'translate(-50%,-50%) scale(1)'; });
})();

/* ══════════════════════════════════════════
   3. MOUSE SPOTLIGHT
══════════════════════════════════════════ */
(function () {
  const spot = document.getElementById('mouseSpotlight');
  if (!spot || window.innerWidth < 641) return;
  document.addEventListener('mousemove', e => {
    spot.style.left = e.clientX + 'px';
    spot.style.top = e.clientY + 'px';
  });
})();

/* ══════════════════════════════════════════
   4. STAR / CONSTELLATION PARTICLES
══════════════════════════════════════════ */
(function () {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, pts = [], id;

  const randPt = () => ({
    x: Math.random() * W, y: Math.random() * H,
    vx: (Math.random() - .5) * .22,
    vy: (Math.random() - .5) * .22,
    r: Math.random() * 1.3 + .3,
    a: Math.random() * .3 + .06,
  });

  function resize() {
    W = canvas.width = innerWidth;
    H = canvas.height = innerHeight;
  }

  function frame() {
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];
      for (let j = i + 1; j < pts.length; j++) {
        const q = pts[j];
        const d = Math.hypot(p.x - q.x, p.y - q.y);
        if (d < 110) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(6,182,212,${.06 * (1 - d / 110)})`;
          ctx.lineWidth = .5;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      const hue = Math.random() > .5 ? '20,184,166' : '6,182,212';
      ctx.fillStyle = `rgba(${hue},${p.a})`;
      ctx.fill();
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
    }
    id = requestAnimationFrame(frame);
  }

  function init() {
    resize();
    pts = [];
    const n = Math.min(Math.floor(W * H / 12000), 90);
    for (let i = 0; i < n; i++) pts.push(randPt());
    cancelAnimationFrame(id);
    frame();
  }

  addEventListener('resize', init);
  init();
})();

/* ══════════════════════════════════════════
   5. NAVBAR — scroll + hamburger
══════════════════════════════════════════ */
(function () {
  const nav = document.getElementById('navbar');
  const hb = document.getElementById('hamburger');
  const nl = document.getElementById('navLinks');
  const links = document.querySelectorAll('.nav-link');
  const secs = document.querySelectorAll('section[id]');

  addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', scrollY > 40);
    let cur = '';
    secs.forEach(s => { if (scrollY >= s.offsetTop - 160) cur = s.id; });
    links.forEach(l => { l.classList.toggle('active', l.getAttribute('href') === `#${cur}`); });
  });

  hb?.addEventListener('click', () => { hb.classList.toggle('open'); nl.classList.toggle('open'); });
  links.forEach(l => l.addEventListener('click', () => { hb?.classList.remove('open'); nl?.classList.remove('open'); }));
})();

/* ══════════════════════════════════════════
   6. TYPEWRITER EFFECT
══════════════════════════════════════════ */
(function () {
  const el = document.getElementById('typewriterText');
  if (!el) return;
  const roles = [
    'Full-Stack Developer',
    'Teaching Assistant',
    'AI & ML Developer',
    'ASP.NET Backend Developer',
    'Problem Solver',
    'Builder',
  ];
  let ri = 0, ci = 0, del = false;

  (function type() {
    const cur = roles[ri];
    el.textContent = del ? cur.slice(0, ci - 1) : cur.slice(0, ci + 1);
    del ? ci-- : ci++;
    let spd = del ? 45 : 85;
    if (!del && ci === cur.length) { spd = 2000; del = true; }
    else if (del && ci === 0) { del = false; ri = (ri + 1) % roles.length; spd = 400; }
    setTimeout(type, spd);
  })();
})();

/* ══════════════════════════════════════════
   7. ABOUT TABS
══════════════════════════════════════════ */
(function () {
  const btns = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.tab-content');

  btns.forEach(b => b.addEventListener('click', () => {
    const t = b.dataset.tab;
    btns.forEach(x => x.classList.remove('active'));
    panels.forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    document.getElementById(`tab-content-${t}`)?.classList.add('active');
    if (t === 'languages') setTimeout(() => animateLangBars(), 120);
  }));
})();

function animateLangBars() {
  document.querySelectorAll('.lang-fill').forEach(b => b.classList.add('animated'));
}

/* ══════════════════════════════════════════
   8. SCROLL REVEAL (Intersection Observer)
══════════════════════════════════════════ */
(function () {
  const els = document.querySelectorAll('.reveal');
  
  // Hide dynamically on JS execute to guarantee progressive fallback
  els.forEach(el => el.classList.add('reveal-init'));

  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: .05, rootMargin: '0px 0px -20px 0px' });

  els.forEach(el => obs.observe(el));
})();

/* ══════════════════════════════════════════
   9. COUNTER ANIMATION (Stats + Achievements)
══════════════════════════════════════════ */
(function () {
  const nums = document.querySelectorAll('.stat-num, .achieve-num');
  if (!nums.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const end = parseFloat(el.dataset.target);
      const suffix = el.dataset.suffix || '';
      const duration = 2000;
      const startTime = performance.now();

      function animate(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * end);
        el.textContent = current + suffix;
        if (progress < 1) requestAnimationFrame(animate);
      }
      requestAnimationFrame(animate);
      obs.unobserve(el);
    });
  }, { threshold: .4 });

  nums.forEach(n => obs.observe(n));
})();

/* ══════════════════════════════════════════
   10. GSAP ANIMATIONS
══════════════════════════════════════════ */
function initGSAPAnimations() {
  if (typeof gsap === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  // Hero entrance timeline
  const heroTl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.8 } });
  heroTl
    .from('.hero-greeting', { y: 30, opacity: 0 }, 0.1)
    .from('.name-l1', { y: 60, opacity: 0, skewY: 3 }, 0.2)
    .from('.name-l2', { y: 60, opacity: 0, skewY: 3 }, 0.35)
    .from('.hero-roles', { y: 30, opacity: 0 }, 0.45)
    .from('.hero-terminal', { y: 40, opacity: 0, scale: 0.95 }, 0.55)
    .from('.hero-bio', { y: 30, opacity: 0 }, 0.65)
    .from('.hero-cta', { y: 30, opacity: 0 }, 0.75)
    .from('.hero-socials', { y: 20, opacity: 0 }, 0.85)
    .from('.hero-right', { x: 80, opacity: 0, scale: 0.9 }, 0.4)
    .from('.hero-scroll-hint', { opacity: 0 }, 1.2);

  // Parallax effect on profile card
  gsap.to('.profile-card-wrapper', {
    y: -30,
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
    }
  });
}

/* ══════════════════════════════════════════
   11. PROFILE CARD 3D TILT
══════════════════════════════════════════ */
(function () {
  const card = document.getElementById('profileCard');
  if (!card || window.innerWidth < 641) return;

  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;

    const rotateX = ((y - cy) / cy) * -8;
    const rotateY = ((x - cx) / cx) * 8;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02,1.02,1.02)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1,1,1)';
  });
})();

/* ══════════════════════════════════════════
   12. MAGNETIC BUTTONS
══════════════════════════════════════════ */
(function () {
  if (window.innerWidth < 641) return;
  const btns = document.querySelectorAll('.magnetic-btn');

  btns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
      btn.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
      setTimeout(() => { btn.style.transition = ''; }, 400);
    });
  });
})();

/* ══════════════════════════════════════════
   13. PROJECT CARD TILT ON HOVER
══════════════════════════════════════════ */
(function () {
  if (window.innerWidth < 900) return;

  document.querySelectorAll('.proj-card:not(.proj-featured)').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      const rotateX = (y - 0.5) * -6;
      const rotateY = (x - 0.5) * 6;

      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

function handleFormSubmit(e) {
  e.preventDefault();

  const name = document.getElementById('nameInput').value;
  const email = document.getElementById('emailInput').value;
  const company = document.getElementById('companyInput')?.value || '';
  const role = document.getElementById('roleInput')?.value || '';
  const budget = document.getElementById('budgetInput')?.value || '';
  const msg = document.getElementById('messageInput').value;

  if (!name || !email || !msg) {
    showToast('❌ Please fill all required fields');
    return;
  }

  const btn = document.getElementById('contactSubmitBtn');
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
  btn.disabled = true;

  // Helper to open mailto client-side if offline or not on a web server
  function sendEmailClientSide() {
    const subject = encodeURIComponent(`Portfolio Inquiry from ${name}`);
    const body = encodeURIComponent(
      `Hi Aniruddh,\n\n` +
      `You have received a new message from your portfolio contact form:\n\n` +
      `-----------------------------------------\n` +
      `Name: ${name}\n` +
      `Email: ${email}\n` +
      `Company: ${company || 'N/A'}\n` +
      `Role: ${role || 'N/A'}\n` +
      `Budget: ${budget || 'N/A'}\n` +
      `-----------------------------------------\n\n` +
      `Message:\n${msg}\n\n` +
      `Best regards,\n${name}`
    );
    window.location.href = `mailto:aniruddhp16@gmail.com?subject=${subject}&body=${body}`;
    formSuccess(btn, e.target);
  }

  // If running locally as file:/// path, instantly fallback to mailto (FormSubmit/fetch blocks file://)
  if (window.location.protocol === 'file:') {
    sendEmailClientSide();
    return;
  }

  // Fetch payload with parameters
  const formData = {
    name: name,
    email: email,
    company: company,
    role: role,
    budget: budget,
    message: msg,
    _captcha: "false",
    _template: "box",
    _subject: `🚀 Portfolio Lead: ${name} (${company || 'Freelance'})`
  };

  // POST directly to FormSubmit AJAX service
  fetch('https://formsubmit.co/ajax/5b3a75a995050f6c40319c78815388c', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(formData),
  })
    .then(res => res.json())
    .then(data => {
      formSuccess(btn, e.target);
    })
    .catch(() => {
      sendEmailClientSide();
    });
}

function formSuccess(btn, form) {
  btn.innerHTML = '<i class="fas fa-check"></i> Sent!';
  btn.style.background = 'linear-gradient(135deg,#10b981,#059669)';
  showToast("✅ Message sent! Aniruddh will respond within 24 hours.");
  form.reset();
  setTimeout(() => {
    btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
    btn.style.background = '';
    btn.disabled = false;
  }, 3500);
}

/* ══════════════════════════════════════════
   15. TOAST
══════════════════════════════════════════ */
function showToast(msg, dur = 4500) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), dur);
}

/* ══════════════════════════════════════════
   16. SMOOTH ANCHOR SCROLL (Lenis compatible)
══════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    const t = document.querySelector(href);
    if (t) {
      e.preventDefault();
      if (lenis) {
        lenis.scrollTo(t, { offset: -80 });
      } else {
        t.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });
});

/* ══════════════════════════════════════════
   17. PROFILE CARD FLOATING ANIMATION
══════════════════════════════════════════ */
(function () {
  const card = document.querySelector('.profile-card-wrapper');
  if (!card) return;

  let t = 0;
  function float() {
    t += 0.015;
    const y = Math.sin(t) * 8;
    const r = Math.sin(t * 0.7) * 1.5;
    card.style.transform = `translateY(${y}px) rotate(${r}deg)`;
    requestAnimationFrame(float);
  }
  float();
})();

/* ══════════════════════════════════════════
   18. SKILL TAG GLOW ON HOVER
══════════════════════════════════════════ */
(function () {
  document.querySelectorAll('.skill-tag').forEach(tag => {
    tag.addEventListener('mouseenter', function () {
      const tip = this.dataset.tip;
      if (tip) {
        this.title = tip;
      }
    });
  });
})();

/* ══════════════════════════════════════════
   19. ANIMATED GRADIENT BACKGROUND
══════════════════════════════════════════ */
(function () {
  const blobs = [
    { el: null, x: 20, y: 20, vx: 0.1, vy: 0.07, color: 'rgba(6,182,212,0.035)', size: 600 },
    { el: null, x: 70, y: 60, vx: -0.08, vy: 0.05, color: 'rgba(20,184,166,0.03)', size: 500 },
    { el: null, x: 50, y: 80, vx: 0.05, vy: -0.08, color: 'rgba(52,211,153,0.025)', size: 550 },
  ];

  blobs.forEach(blob => {
    const el = document.createElement('div');
    Object.assign(el.style, {
      position: 'fixed', pointerEvents: 'none', zIndex: '0',
      width: blob.size + 'px', height: blob.size + 'px', borderRadius: '50%',
      background: `radial-gradient(circle, ${blob.color} 0%, transparent 70%)`,
      left: blob.x + '%', top: blob.y + '%',
      transform: 'translate(-50%, -50%)',
      filter: 'blur(40px)',
    });
    document.body.appendChild(el);
    blob.el = el;
  });

  function animate() {
    blobs.forEach(b => {
      b.x += b.vx;
      b.y += b.vy;
      if (b.x < 10 || b.x > 90) b.vx *= -1;
      if (b.y < 10 || b.y > 90) b.vy *= -1;
      b.el.style.left = b.x + '%';
      b.el.style.top = b.y + '%';
    });
    requestAnimationFrame(animate);
  }
  animate();
})();


/* ══════════════════════════════════════════
   21. DYNAMIC STATS FETCHER (GITHUB & LEETCODE)
══════════════════════════════════════════ */
async function fetchRealStats() {
  // 1. GitHub API Fetch
  try {
    const ghRes = await fetch('https://api.github.com/users/aniruddh209');
    if (ghRes.ok) {
      const ghData = await ghRes.json();
      
      // Update Repos and Followers numbers
      const ghNums = document.querySelectorAll('.stats-panel-grid .spc-num');
      if (ghNums.length >= 4) {
        ghNums[0].textContent = ghData.public_repos || '22';
        ghNums[3].textContent = (ghData.followers || '15') + '+';
      }
    }
  } catch (e) {
    console.log('GitHub API error, using fallbacks:', e);
  }

  // 2. LeetCode API Fetch
  try {
    const lcRes = await fetch('https://leetcode-api-faisalshohag.vercel.app/aniruddh_a18');
    if (lcRes.ok) {
      const lcData = await lcRes.json();
      
      // Select elements inside the LeetCode stats card
      const lcCard = document.querySelector('.stats-panel-grid > div:nth-child(2)');
      if (lcCard) {
        const lcNums = lcCard.querySelectorAll('.spc-num');
        if (lcNums.length >= 2) {
          // Total solved
          lcNums[0].textContent = (lcData.totalSolved || '185') + '+';
          // Global ranking
          if (lcData.ranking) {
            lcNums[1].textContent = '#' + lcData.ranking.toLocaleString();
          }
        }

        // Easy / Medium / Hard tracks
        const lcBars = lcCard.querySelectorAll('.lc-bar-wrapper');
        if (lcBars.length >= 3) {
          // Easy
          const easyLabel = lcBars[0].querySelector('.lc-bar-label strong');
          const easyFill = lcBars[0].querySelector('.lc-bar-fill');
          if (easyLabel && easyFill && lcData.easySolved) {
            easyLabel.textContent = `${lcData.easySolved} / ${lcData.totalEasy || '800'}`;
            easyFill.style.width = `${((lcData.easySolved / (lcData.totalEasy || 800)) * 100).toFixed(0)}%`;
          }
          
          // Medium
          const medLabel = lcBars[1].querySelector('.lc-bar-label strong');
          const medFill = lcBars[1].querySelector('.lc-bar-fill');
          if (medLabel && medFill && lcData.mediumSolved) {
            medLabel.textContent = `${lcData.mediumSolved} / ${lcData.totalMedium || '1600'}`;
            medFill.style.width = `${((lcData.mediumSolved / (lcData.totalMedium || 1600)) * 100).toFixed(0)}%`;
          }
          
          // Hard
          const hardLabel = lcBars[2].querySelector('.lc-bar-label strong');
          const hardFill = lcBars[2].querySelector('.lc-bar-fill');
          if (hardLabel && hardFill && lcData.hardSolved) {
            hardLabel.textContent = `${lcData.hardSolved} / ${lcData.totalHard || '700'}`;
            hardFill.style.width = `${((lcData.hardSolved / (lcData.totalHard || 700)) * 100).toFixed(0)}%`;
          }
        }
      }
    }
  } catch (e) {
    console.log('LeetCode API error, using fallbacks:', e);
  }
}

// Call stats fetcher
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  fetchRealStats();
} else {
  window.addEventListener('load', fetchRealStats);
}


