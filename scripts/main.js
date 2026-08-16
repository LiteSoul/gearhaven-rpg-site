/* ==========================================================================
   GEARHAVEN: SKYWARD BOUND - MAIN APPLICATION CONTROLLER
   ========================================================================== */

// --- Character Roster Data ---
const characterRosterData = {
  sprocket: {
    name: "Sprocket",
    title: "The Brass Wanderer • Model Atom-7",
    role: "Spellblade / Vanguard",
    quote: '"Even if my body is forged of brass and gears, this starlight heart feels everything!"',
    image: "assets/images/hero_sprocket.jpg",
    bio: "Created in the secret laboratories of District 03, Sprocket was fitted with the fabled Starlight Core rather than an ordinary steam condenser. Possessing boundless courage, retro rocket boots, and an ancient energy blade, he ventures into the sky to uncover why the great clockwork engines are falling silent.",
    stats: {
      atk: 88,
      def: 76,
      steam: 90,
      speed: 94,
      sync: 98
    },
    skills: ["Rocket Surge", "Steam Slash", "Starlight Overdrive", "Chrono Dash"]
  },
  electra: {
    name: "Electra",
    title: "The Spark Weaver • Model Volt-9",
    role: "Tesla Mage / Field Support",
    quote: '"Calibrating vacuum frequencies! Let\'s electrify their circuitry!"',
    image: "assets/images/hero_electra.jpg",
    bio: "An ingenious retro-futuristic android maiden with vacuum-tube neural antennae and high-voltage magnetic resonators. Electra can manipulate magnetic currents, deflect incoming artillery shells, and chain devastating blue lightning arcs across enemy automatons.",
    stats: {
      atk: 92,
      def: 65,
      steam: 85,
      speed: 82,
      sync: 90
    },
    skills: ["Tesla Arc", "Magnetic Ward", "Static Discharge", "Vacuum Resonance"]
  },
  prof_gear: {
    name: "Prof. Gear",
    title: "The Master Artificer • Cyber-Scholar",
    role: "Artificer / Tactician",
    quote: '"Fascinating! A 0.04 millimeter cog misalignment. Let me adjust my wrench!"',
    image: "assets/images/hero_prof_gear.jpg",
    bio: "The legendary eccentric cyborg engineer who helped design Gearhaven's elevated railway and municipal steam network. Sporting glowing ocular spectacles, exposed cranial gear trains, and a steam-pipe tobacco inhaler, he buffs party mechanisms and deploys tactical clockwork turrets.",
    stats: {
      atk: 70,
      def: 80,
      steam: 95,
      speed: 68,
      sync: 85
    },
    skills: ["Clockwork Turret", "Overclock Tune", "Steam Exhaust", "Pressure Calibrator"]
  },
  baron: {
    name: "Baron Boilerplate",
    title: "The Steam Juggernaut • Titan-01",
    role: "Ironclad Sentinel / Heavy Tank",
    quote: '"Stand behind my furnace grate, little ones! No piston shall breach this iron!"',
    image: "assets/images/hero_baron.jpg",
    bio: "A behemoth of heavy riveted steel with a glowing coal furnace in his chest and a classic rounded iron dome head. Built originally to reinforce deep geological airship anchors, Baron is a gentle soul who uses his massive pneumatic piledriver fist to protect his allies from colossal titans.",
    stats: {
      atk: 95,
      def: 98,
      steam: 80,
      speed: 45,
      sync: 80
    },
    skills: ["Furnace Slam", "Iron Fortress", "Steam Vent Roar", "Anchor Piledriver"]
  }
};

// --- Story Lore Tabs Data ---
const loreTabsData = {
  cataclysm: {
    title: "The Great Chrono-Tear & The Skyward Ascent",
    desc: "Three centuries ago, the world below cracked under the weight of runaway seismic fissures. To save civilization, humanity and early clockwork automatons built giant steam-lift anchors, hoisting seven grand metropolis districts into the endless clouds. Thus, Gearhaven was born — suspended between the sun and the golden sunset haze.",
    quote: '"We left the broken earth behind, but the ticking of time never ceases."'
  },
  cores: {
    title: "The Mystery of the Starlight Androids",
    desc: "Unlike standard automatons powered by charcoal boilers, the rare Tezuka-class androids are infused with 'Starlight Cores' — mysterious celestial crystals discovered adrift in the skyward cloud seas. These cores grant androids true emotional empathy, self-awareness, and astonishing energy manipulation.",
    quote: '"A heart of brass that pulses with the light of ancient stars."'
  },
  titan: {
    title: "The Menace of the Void Machine: Kronos",
    desc: "From the forgotten abyss of District 00, ancient clockwork titans have begun to reactivate without human command. The colossal automaton Kronos Mk. III has seized the Prime Clocktower, disrupting the steam pressure balances that keep the city afloat in the sky.",
    quote: '"When the central gears jam, the entire skyward realm will plunge."'
  }
};

// --- DOM Ready Initialization ---
document.addEventListener('DOMContentLoaded', () => {
  initParticleCanvas();
  initHeaderAndNav();
  initLoreTabs();
  initCharacterRoster();
  initGalleryAndLightbox();
  initWishlistCounter();
  initNewsletterForm();
  initAudioAndCRTControls();
  initHeroVideoControls();

  // Initialize Subsystems
  if (window.combatDemo) window.combatDemo.init();
  if (window.mapExplorer) window.mapExplorer.init();
});

// --- Dynamic Canvas Particle System ---
function initParticleCanvas() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = 45;

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.5 + 1,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: -(Math.random() * 0.6 + 0.2), // float upward like embers/steam
      opacity: Math.random() * 0.7 + 0.2,
      color: Math.random() > 0.4 ? 'rgba(226, 168, 75, ' : 'rgba(34, 211, 238, '
    });
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;

      if (p.y < -10) {
        p.y = height + 10;
        p.x = Math.random() * width;
      }
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;

      ctx.fillStyle = p.color + p.opacity + ')';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(animate);
  }

  animate();
}

// --- Header, Nav & Scroll States ---
function initHeaderAndNav() {
  const header = document.querySelector('.site-header');
  const mobileToggle = document.getElementById('mobile-nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      if (window.retroAudio) window.retroAudio.playBlip();
    });
  }

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu) navMenu.classList.remove('open');
      if (window.retroAudio) window.retroAudio.playBlip();
    });
  });
}

// --- Story & Lore Tabs ---
function initLoreTabs() {
  const tabBtns = document.querySelectorAll('.lore-tab-btn');
  const loreTitle = document.getElementById('lore-panel-title');
  const loreDesc = document.getElementById('lore-panel-desc');
  const loreQuote = document.getElementById('lore-panel-quote');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabKey = btn.getAttribute('data-tab');
      if (!loreTabsData[tabKey]) return;

      if (window.retroAudio) window.retroAudio.playBlip();

      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const data = loreTabsData[tabKey];
      if (loreTitle) loreTitle.innerText = data.title;
      if (loreDesc) loreDesc.innerText = data.desc;
      if (loreQuote) loreQuote.innerText = data.quote;
    });
  });
}

// --- Interactive Character Roster ---
function initCharacterRoster() {
  const navCards = document.querySelectorAll('.roster-card-nav');
  const nameEl = document.getElementById('char-display-name');
  const titleEl = document.getElementById('char-display-title');
  const bioEl = document.getElementById('char-display-bio');
  const imgEl = document.getElementById('char-display-img');
  const voiceBtn = document.getElementById('char-voice-btn');
  const skillsContainer = document.getElementById('char-display-skills');

  // Stats Elements
  const statAtkFill = document.getElementById('stat-atk-fill');
  const statAtkVal = document.getElementById('stat-atk-val');
  const statDefFill = document.getElementById('stat-def-fill');
  const statDefVal = document.getElementById('stat-def-val');
  const statSteamFill = document.getElementById('stat-steam-fill');
  const statSteamVal = document.getElementById('stat-steam-val');
  const statSyncFill = document.getElementById('stat-sync-fill');
  const statSyncVal = document.getElementById('stat-sync-val');

  let activeCharId = 'sprocket';

  function displayCharacter(charId) {
    const char = characterRosterData[charId];
    if (!char) return;
    activeCharId = charId;

    if (nameEl) nameEl.innerText = char.name;
    if (titleEl) titleEl.innerText = char.title;
    if (bioEl) bioEl.innerText = char.bio;
    if (imgEl) {
      imgEl.style.opacity = '0.3';
      setTimeout(() => {
        imgEl.src = char.image;
        imgEl.style.opacity = '1';
      }, 120);
    }

    // Stats
    if (statAtkFill) statAtkFill.style.width = `${char.stats.atk}%`;
    if (statAtkVal) statAtkVal.innerText = `${char.stats.atk}/100`;
    if (statDefFill) statDefFill.style.width = `${char.stats.def}%`;
    if (statDefVal) statDefVal.innerText = `${char.stats.def}/100`;
    if (statSteamFill) statSteamFill.style.width = `${char.stats.steam}%`;
    if (statSteamVal) statSteamVal.innerText = `${char.stats.steam}%`;
    if (statSyncFill) statSyncFill.style.width = `${char.stats.sync}%`;
    if (statSyncVal) statSyncVal.innerText = `${char.stats.sync}%`;

    // Skills
    if (skillsContainer) {
      skillsContainer.innerHTML = '';
      char.skills.forEach(sk => {
        const span = document.createElement('span');
        span.className = 'skill-pill';
        span.innerText = `⚙️ ${sk}`;
        span.addEventListener('click', () => {
          if (window.retroAudio) window.retroAudio.playSlash();
        });
        skillsContainer.appendChild(span);
      });
    }

    // Update Nav Active State
    navCards.forEach(c => {
      if (c.getAttribute('data-char') === charId) {
        c.classList.add('active');
      } else {
        c.classList.remove('active');
      }
    });
  }

  navCards.forEach(card => {
    card.addEventListener('click', () => {
      const charId = card.getAttribute('data-char');
      if (window.retroAudio) window.retroAudio.playBlip();
      displayCharacter(charId);
    });
  });

  if (voiceBtn) {
    voiceBtn.addEventListener('click', () => {
      if (window.retroAudio) {
        window.retroAudio.playVoice(activeCharId);
      }
      const char = characterRosterData[activeCharId];
      if (char) {
        alert(`${char.name}: ${char.quote}`);
      }
    });
  }

  // Initial load
  displayCharacter('sprocket');
}

// --- Media Gallery & Lightbox ---
function initGalleryAndLightbox() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryCards = document.querySelectorAll('.gallery-card');
  const modal = document.getElementById('lightbox-modal');
  const modalImg = document.getElementById('lightbox-img');
  const modalCaption = document.getElementById('lightbox-caption');
  const closeBtn = document.getElementById('lightbox-close');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (window.retroAudio) window.retroAudio.playBlip();
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      galleryCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  galleryCards.forEach(card => {
    card.addEventListener('click', () => {
      const img = card.querySelector('img');
      const caption = card.querySelector('.gallery-card-caption');
      if (img && modal && modalImg) {
        modalImg.src = img.src;
        if (modalCaption && caption) modalCaption.innerText = caption.innerText;
        modal.classList.add('open');
        if (window.retroAudio) window.retroAudio.playBlip();
      }
    });
  });

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('open');
      if (window.retroAudio) window.retroAudio.playBlip();
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('open');
      }
    });
  }
}

// --- Steam Wishlist Counter Clicker ---
function initWishlistCounter() {
  const countEl = document.getElementById('wishlist-count');
  const btn = document.getElementById('hero-wishlist-btn');
  let count = 48290;

  if (btn && countEl) {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      count++;
      countEl.innerText = count.toLocaleString();
      if (window.retroAudio) window.retroAudio.playHeal();
      btn.innerText = "⭐ WISHLISTED! (+1)";
      setTimeout(() => {
        btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg> WISHLIST ON STEAM';
      }, 2500);
    });
  }
}

// --- Newsletter Email Form ---
function initNewsletterForm() {
  const form = document.getElementById('newsletter-form');
  const input = document.getElementById('newsletter-email');
  const successMsg = document.getElementById('newsletter-success');

  if (form && input && successMsg) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!input.value || !input.value.includes('@')) {
        alert("Please enter a valid email address!");
        return;
      }

      if (window.retroAudio) window.retroAudio.playVictory();
      successMsg.style.display = 'block';
      successMsg.innerHTML = `🎉 WELCOME TO THE COG UNION! Your exclusive in-game code is: <strong>[BRASS-SPROCKET-2026]</strong>`;
      input.value = '';
    });
  }
}

// --- Audio & CRT Scanlines Controls ---
function initAudioAndCRTControls() {
  const audioBtn = document.getElementById('audio-toggle-btn');
  const crtBtn = document.getElementById('crt-toggle-btn');

  if (audioBtn) {
    audioBtn.addEventListener('click', () => {
      if (window.retroAudio) {
        const isUnmuted = window.retroAudio.toggleMute();
        audioBtn.classList.toggle('active', isUnmuted);
        audioBtn.innerHTML = isUnmuted 
          ? '🔊 <span>AUDIO: ON</span>' 
          : '🔇 <span>AUDIO: OFF</span>';
      }
    });
  }

  if (crtBtn) {
    crtBtn.addEventListener('click', () => {
      document.body.classList.toggle('crt-mode');
      const isCRT = document.body.classList.contains('crt-mode');
      crtBtn.classList.toggle('active', isCRT);
      if (window.retroAudio) window.retroAudio.playBlip();
    });
  }
}

// --- Hero Video Preview Player Controls ---
function initHeroVideoControls() {
  const video = document.getElementById('hero-preview-video');
  const soundBtn = document.getElementById('video-sound-btn');
  const playBtn = document.getElementById('video-play-btn');

  if (!video) return;

  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      video.muted = !video.muted;
      if (!video.muted) {
        video.volume = 0.5;
        soundBtn.innerHTML = '🔊 <span>TEASER AUDIO: ON</span>';
        soundBtn.classList.add('active');
      } else {
        soundBtn.innerHTML = '🔇 <span>TEASER AUDIO: OFF</span>';
        soundBtn.classList.remove('active');
      }
      if (window.retroAudio) window.retroAudio.playBlip();
    });
  }

  if (playBtn) {
    playBtn.addEventListener('click', () => {
      if (video.paused) {
        video.play();
        playBtn.innerHTML = '⏸️ <span>PAUSE</span>';
      } else {
        video.pause();
        playBtn.innerHTML = '▶️ <span>PLAY</span>';
      }
      if (window.retroAudio) window.retroAudio.playBlip();
    });
  }
}
