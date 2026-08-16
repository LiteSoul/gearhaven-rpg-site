/* ==========================================================================
   GEARHAVEN: SKYWARD BOUND - PLAYABLE CHRONO-SYNERGY COMBAT DEMO
   Interactive Turn-Based Battle Mini-Game
   ========================================================================== */

class CombatDemo {
  constructor() {
    this.bossMaxHP = 2400;
    this.bossHP = 2400;
    this.turn = 1;
    this.isBusy = false;
    this.overclockActive = false;

    this.party = [
      { id: 'sprocket', name: 'SPROCKET', maxHp: 450, hp: 450, maxSteam: 100, steam: 80 },
      { id: 'electra', name: 'ELECTRA', maxHp: 380, hp: 380, maxSteam: 100, steam: 65 },
      { id: 'prof_gear', name: 'PROF. GEAR', maxHp: 410, hp: 410, maxSteam: 100, steam: 70 }
    ];

    this.dom = {};
  }

  init() {
    this.cacheDOM();
    this.bindEvents();
    this.updateUI();
    this.logMessage("⚔️ Encounter Start! Boss: KRONOS MK. III. Choose your command.");
  }

  cacheDOM() {
    this.dom.battleWrapper = document.getElementById('battle-demo-wrapper');
    this.dom.bossHpBar = document.getElementById('boss-hp-fill');
    this.dom.bossHpText = document.getElementById('boss-hp-text');
    this.dom.logTicker = document.getElementById('battle-log-text');
    this.dom.turnCounter = document.getElementById('turn-counter-badge');
    this.dom.canvasArea = document.getElementById('battle-canvas-area');

    // Party DOM
    this.party.forEach(p => {
      p.domHpFill = document.getElementById(`${p.id}-hp-fill`);
      p.domHpText = document.getElementById(`${p.id}-hp-text`);
      p.domSteamFill = document.getElementById(`${p.id}-steam-fill`);
      p.domSteamText = document.getElementById(`${p.id}-steam-text`);
      p.domCard = document.getElementById(`party-card-${p.id}`);
    });

    // Command buttons
    this.dom.btnSlash = document.getElementById('cmd-btn-slash');
    this.dom.btnTesla = document.getElementById('cmd-btn-tesla');
    this.dom.btnBuff = document.getElementById('cmd-btn-buff');
    this.dom.btnSynergy = document.getElementById('cmd-btn-synergy');
    this.dom.btnHeal = document.getElementById('cmd-btn-heal');
    this.dom.btnReset = document.getElementById('cmd-btn-reset');
  }

  bindEvents() {
    if (this.dom.btnSlash) this.dom.btnSlash.addEventListener('click', () => this.handlePlayerAction('slash'));
    if (this.dom.btnTesla) this.dom.btnTesla.addEventListener('click', () => this.handlePlayerAction('tesla'));
    if (this.dom.btnBuff) this.dom.btnBuff.addEventListener('click', () => this.handlePlayerAction('buff'));
    if (this.dom.btnSynergy) this.dom.btnSynergy.addEventListener('click', () => this.handlePlayerAction('synergy'));
    if (this.dom.btnHeal) this.dom.btnHeal.addEventListener('click', () => this.handlePlayerAction('heal'));
    if (this.dom.btnReset) this.dom.btnReset.addEventListener('click', () => this.resetBattle());
  }

  async handlePlayerAction(action) {
    if (this.isBusy || this.bossHP <= 0) return;
    this.isBusy = true;

    // Execute Player action
    switch (action) {
      case 'slash':
        await this.execSlash();
        break;
      case 'tesla':
        await this.execTesla();
        break;
      case 'buff':
        await this.execBuff();
        break;
      case 'synergy':
        await this.execSynergy();
        break;
      case 'heal':
        await this.execHeal();
        break;
    }

    this.updateUI();

    // Check boss defeat
    if (this.bossHP <= 0) {
      this.bossDefeated();
      return;
    }

    // Boss retaliates after short delay
    await this.delay(650);
    await this.execBossTurn();
    this.updateUI();

    // Check party wipe
    const aliveMembers = this.party.filter(p => p.hp > 0);
    if (aliveMembers.length === 0) {
      this.partyWiped();
      return;
    }

    this.turn++;
    if (this.dom.turnCounter) this.dom.turnCounter.innerText = `TURN ${this.turn}`;
    this.isBusy = false;
  }

  async execSlash() {
    window.retroAudio.playSlash();
    this.setActivePartyMember('sprocket');
    let dmg = Math.floor(Math.random() * 60) + 260;
    if (this.overclockActive) {
      dmg = Math.floor(dmg * 1.5);
      this.overclockActive = false;
    }
    const isCrit = Math.random() > 0.65;
    if (isCrit) dmg = Math.floor(dmg * 1.35);

    this.bossHP = Math.max(0, this.bossHP - dmg);
    this.party[0].steam = Math.min(100, this.party[0].steam + 15);

    this.showDamageNumber(dmg, isCrit, false, 75, 45);
    this.shakeCanvas(8);
    this.logMessage(`⚔️ Sprocket uses [STEAM SLASH] dealing ${dmg} ${isCrit ? 'CRITICAL ' : ''}damage to Kronos!`);
    await this.delay(400);
  }

  async execTesla() {
    window.retroAudio.playLightning();
    this.setActivePartyMember('electra');
    let dmg = Math.floor(Math.random() * 80) + 310;
    if (this.overclockActive) {
      dmg = Math.floor(dmg * 1.5);
      this.overclockActive = false;
    }
    const isCrit = Math.random() > 0.7;
    if (isCrit) dmg = Math.floor(dmg * 1.4);

    this.bossHP = Math.max(0, this.bossHP - dmg);
    this.party[1].steam = Math.min(100, this.party[1].steam + 20);

    this.showDamageNumber(dmg, isCrit, false, 72, 40);
    this.shakeCanvas(10);
    this.logMessage(`⚡ Electra casts [TESLA ARC]! Electrifying Kronos for ${dmg} damage!`);
    await this.delay(400);
  }

  async execBuff() {
    window.retroAudio.playSteam();
    this.setActivePartyMember('prof_gear');
    this.overclockActive = true;
    this.party.forEach(p => {
      p.steam = Math.min(100, p.steam + 25);
    });
    this.logMessage(`🔧 Prof. Gear activates [OVERCLOCK SYSTEM]! +25% Steam to all, next attack +50% ATK!`);
    this.showFloatingText("OVERCLOCK ON!", '#38bdf8', 35, 65);
    await this.delay(400);
  }

  async execSynergy() {
    const avgSteam = (this.party[0].steam + this.party[1].steam + this.party[2].steam) / 3;
    if (avgSteam < 40) {
      window.retroAudio.playBlip();
      this.logMessage(`⚠️ Not enough steam pressure for Grand Synergy! Need at least 40% Steam.`);
      return;
    }

    window.retroAudio.playExplosion();
    this.party.forEach(p => p.steam = Math.max(10, p.steam - 40));
    let dmg = Math.floor(Math.random() * 150) + 850;
    if (this.overclockActive) {
      dmg = Math.floor(dmg * 1.4);
      this.overclockActive = false;
    }
    this.bossHP = Math.max(0, this.bossHP - dmg);

    this.showDamageNumber(dmg, true, false, 70, 35);
    this.shakeCanvas(18);
    this.flashScreen();
    this.logMessage(`💥 GRAND SYNERGY BURST! All androids combine power for a devastating ${dmg} DMG!`);
    await this.delay(500);
  }

  async execHeal() {
    window.retroAudio.playHeal();
    this.party.forEach(p => {
      const healAmount = Math.floor(Math.random() * 40) + 140;
      p.hp = Math.min(p.maxHp, p.hp + healAmount);
    });
    this.showFloatingText("+160 REPAIR", '#34d399', 30, 75);
    this.logMessage(`🧪 Steam Vent Repair initiated! Restored HP to all party automatons.`);
    await this.delay(400);
  }

  async execBossTurn() {
    const alive = this.party.filter(p => p.hp > 0);
    if (alive.length === 0) return;

    const target = alive[Math.floor(Math.random() * alive.length)];
    const bossMoves = ['Gear Cleave', 'Steam Roar', 'Chrono Cannon'];
    const chosenMove = bossMoves[Math.floor(Math.random() * bossMoves.length)];

    window.retroAudio.playExplosion();
    this.shakeCanvas(12);

    let dmg = 0;
    if (chosenMove === 'Gear Cleave') {
      dmg = Math.floor(Math.random() * 30) + 65;
      target.hp = Math.max(0, target.hp - dmg);
      this.logMessage(`🤖 Boss uses [${chosenMove}] hitting ${target.name} for ${dmg} DMG!`);
      this.showDamageNumber(dmg, false, true, 30, 65);
    } else if (chosenMove === 'Steam Roar') {
      this.party.forEach(p => {
        const d = Math.floor(Math.random() * 20) + 35;
        p.hp = Math.max(0, p.hp - d);
      });
      this.logMessage(`🔥 Boss unleashes [${chosenMove}]! Area damage to entire party!`);
      this.showFloatingText("AOE -45", '#ef4444', 35, 70);
    } else {
      dmg = Math.floor(Math.random() * 40) + 95;
      target.hp = Math.max(0, target.hp - dmg);
      this.logMessage(`⚡ Boss fires [${chosenMove}] directly into ${target.name} for ${dmg} DMG!`);
      this.showDamageNumber(dmg, true, true, 30, 65);
    }
  }

  bossDefeated() {
    window.retroAudio.playVictory();
    this.logMessage(`🏆 VICTORY! KRONOS MK. III is disassembled! You saved the Floating Metropolis!`);
    this.showFloatingText("VICTORY!!", '#fbbf24', 50, 40);
    if (this.dom.btnReset) this.dom.btnReset.style.display = 'inline-flex';
  }

  partyWiped() {
    this.logMessage(`💀 DEFEAT! All android cores deactivated. Press Reset to try again.`);
    if (this.dom.btnReset) this.dom.btnReset.style.display = 'inline-flex';
  }

  resetBattle() {
    window.retroAudio.playBlip();
    this.bossHP = this.bossMaxHP;
    this.turn = 1;
    this.isBusy = false;
    this.overclockActive = false;
    this.party.forEach(p => {
      p.hp = p.maxHp;
      p.steam = 75;
    });
    if (this.dom.btnReset) this.dom.btnReset.style.display = 'none';
    if (this.dom.turnCounter) this.dom.turnCounter.innerText = 'TURN 1';
    this.updateUI();
    this.logMessage("⚔️ Battle Reset! Party ready for battle against Kronos Mk. III.");
  }

  updateUI() {
    // Boss UI
    const bossPct = Math.max(0, (this.bossHP / this.bossMaxHP) * 100);
    if (this.dom.bossHpBar) this.dom.bossHpBar.style.width = `${bossPct}%`;
    if (this.dom.bossHpText) this.dom.bossHpText.innerText = `${this.bossHP} / ${this.bossMaxHP}`;

    // Party UI
    this.party.forEach(p => {
      const hpPct = Math.max(0, (p.hp / p.maxHp) * 100);
      const steamPct = Math.max(0, (p.steam / p.maxSteam) * 100);
      if (p.domHpFill) p.domHpFill.style.width = `${hpPct}%`;
      if (p.domHpText) p.domHpText.innerText = `${p.hp}/${p.maxHp}`;
      if (p.domSteamFill) p.domSteamFill.style.width = `${steamPct}%`;
      if (p.domSteamText) p.domSteamText.innerText = `${p.steam}%`;
    });
  }

  setActivePartyMember(id) {
    this.party.forEach(p => {
      if (p.domCard) {
        if (p.id === id) {
          p.domCard.classList.add('active-turn');
          setTimeout(() => p.domCard.classList.remove('active-turn'), 600);
        }
      }
    });
  }

  showDamageNumber(val, isCrit, isEnemy, posX, posY) {
    const el = document.createElement('div');
    el.className = `damage-number ${isCrit ? 'crit' : ''} ${isEnemy ? 'enemy' : ''}`;
    el.innerText = `${isCrit ? 'CRIT! ' : ''}-${val}`;
    el.style.left = `${posX}%`;
    el.style.top = `${posY}%`;
    if (this.dom.canvasArea) {
      this.dom.canvasArea.appendChild(el);
      setTimeout(() => el.remove(), 1000);
    }
  }

  showFloatingText(text, color, posX, posY) {
    const el = document.createElement('div');
    el.className = `damage-number`;
    el.innerText = text;
    el.style.color = color;
    el.style.left = `${posX}%`;
    el.style.top = `${posY}%`;
    if (this.dom.canvasArea) {
      this.dom.canvasArea.appendChild(el);
      setTimeout(() => el.remove(), 1200);
    }
  }

  shakeCanvas(intensity) {
    if (!this.dom.battleWrapper) return;
    this.dom.battleWrapper.style.transform = `translate(${Math.random()*intensity - intensity/2}px, ${Math.random()*intensity - intensity/2}px)`;
    setTimeout(() => {
      this.dom.battleWrapper.style.transform = 'translate(0, 0)';
    }, 120);
  }

  flashScreen() {
    const flash = document.createElement('div');
    flash.style.position = 'absolute';
    flash.style.top = '0';
    flash.style.left = '0';
    flash.style.width = '100%';
    flash.style.height = '100%';
    flash.style.backgroundColor = 'rgba(255, 255, 255, 0.4)';
    flash.style.pointerEvents = 'none';
    flash.style.zIndex = '99';
    if (this.dom.canvasArea) {
      this.dom.canvasArea.appendChild(flash);
      setTimeout(() => flash.remove(), 150);
    }
  }

  logMessage(msg) {
    if (this.dom.logTicker) {
      this.dom.logTicker.innerText = msg;
    }
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export singleton
window.combatDemo = new CombatDemo();
