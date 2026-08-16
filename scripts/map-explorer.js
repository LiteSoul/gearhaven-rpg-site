/* ==========================================================================
   GEARHAVEN: SKYWARD BOUND - WORLD ATLAS & REGION MAP EXPLORER
   ========================================================================== */

const worldHubsData = {
  plaza: {
    title: "The Grand Clocktower Plaza",
    tag: "DISTRICT 01 • COMMERCIAL HUB",
    desc: "The beating heart of Gearhaven where steam cable trams glide overhead and brass automatons trade exotic goods from the skyward flotillas. Home to the famous Gear & Grind Café and the master artificers of the Cog Union.",
    image: "assets/images/world_exploration.jpg",
    secrets: ["Secret Pneumatic Tube behind the Baker's Automaton", "Old Clockmaker's Hidden Workshop", "Underground Steam Pipe Passage"],
    dangerLevel: "Peaceful / Trade Zone"
  },
  airships: {
    title: "The Steam-Docks & Sky Flotilla",
    tag: "DISTRICT 02 • AERIAL GATEWAY",
    desc: "Moored above the cloud sea, giant brass zeppelins and solar-sail airships launch into uncharted floating sky islands. Steampunks and sky captains gather here to recruit daring adventurers and brave android crews.",
    image: "assets/images/hero_key_art.jpg",
    secrets: ["Smuggler's Celestial Compass", "Derelict Airship Engine Bay", "Sky Whale Migration Viewpoint"],
    dangerLevel: "Moderate / Wind Storms"
  },
  foundry: {
    title: "The Pneumatic Foundry & Core Labs",
    tag: "DISTRICT 03 • HEAVY INDUSTRY",
    desc: "A roaring expanse of giant smelters, piston presses, and glowing vacuum tube reactors. This is where Osamu Tezuka style android chassis are forged, emotion-cores are calibrated, and heavy boiler armor is assembled.",
    image: "assets/images/boss_encounter.jpg",
    secrets: ["Prototype Starlight Core Schematics", "Abandoned Assembly Line 7", "Overheated Steam Furnace Chamber"],
    dangerLevel: "High / Molten Brass & Guard Bots"
  },
  caverns: {
    title: "The Sunken Gear Ruins",
    tag: "DISTRICT 00 • ANCIENT DEPTHS",
    desc: "Lying deep beneath the bedrock of the floating metropolis are the mysterious titanic cogs of the First Civilization. Ancient clockwork beasts and forgotten guardians prowl these dark, steam-shrouded chasms.",
    image: "assets/images/gameplay_battle.jpg",
    secrets: ["Prismatic Chrono Crystal Shard", "Ancient Automaton Tomb", "The Prime Keyhole of Eternity"],
    dangerLevel: "Extreme / Colossal Bosses"
  }
};

class MapExplorer {
  constructor() {
    this.currentHub = 'plaza';
  }

  init() {
    this.domHubItems = document.querySelectorAll('.world-hub-item');
    this.domImg = document.getElementById('world-map-img');
    this.domTitle = document.getElementById('world-hub-title');
    this.domTag = document.getElementById('world-hub-tag');
    this.domDesc = document.getElementById('world-hub-desc');
    this.domSecretsList = document.getElementById('world-hub-secrets');
    this.domDanger = document.getElementById('world-hub-danger');

    this.bindEvents();
    this.selectHub('plaza');
  }

  bindEvents() {
    this.domHubItems.forEach(item => {
      item.addEventListener('click', () => {
        const hubId = item.getAttribute('data-hub');
        this.selectHub(hubId);
      });
    });
  }

  selectHub(hubId) {
    if (!worldHubsData[hubId]) return;
    this.currentHub = hubId;
    const data = worldHubsData[hubId];

    if (window.retroAudio) {
      window.retroAudio.playBlip();
    }

    // Update active class
    this.domHubItems.forEach(item => {
      if (item.getAttribute('data-hub') === hubId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Update UI details
    if (this.domImg) {
      this.domImg.style.opacity = '0.3';
      setTimeout(() => {
        this.domImg.src = data.image;
        this.domImg.style.opacity = '1';
      }, 150);
    }
    if (this.domTitle) this.domTitle.innerText = data.title;
    if (this.domTag) this.domTag.innerText = data.tag;
    if (this.domDesc) this.domDesc.innerText = data.desc;
    if (this.domDanger) this.domDanger.innerText = data.dangerLevel;

    if (this.domSecretsList) {
      this.domSecretsList.innerHTML = '';
      data.secrets.forEach(sec => {
        const li = document.createElement('li');
        li.innerText = `▸ ${sec}`;
        this.domSecretsList.appendChild(li);
      });
    }
  }
}

// Export singleton
window.mapExplorer = new MapExplorer();
