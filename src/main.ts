import './style.css'
import gsap from 'gsap'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="hex-bg"></div>
  <div class="glow-overlay"></div>
  
  <!-- Transition Effects -->
  <div class="glitch-overlay" id="glitch-overlay"></div>
  <div class="scan-line" id="scan-line"></div>
  <div class="color-wave" id="color-wave"></div>
  <div class="morph-shape" id="morph-shape"></div>
  <div class="hex-transition" id="hex-transition"></div>
  <div class="ripple-effect" id="ripple-effect"></div>
  <div class="digital-rain" id="digital-rain"></div>
  <div class="vortex-transition" id="vortex-transition"></div>
  <div class="grid-transition" id="grid-transition"></div>
  
  <div class="page-login">
    <div class="login-card">
      <div class="login-card-corner-br"></div>
      <h1>HOSPIT-X</h1>
      <h2>SECURE DOCTOR PORTAL</h2>
      
      <div class="input-group">
        <label>DOCTOR ID</label>
        <input type="text" id="doctor-id" placeholder="DR-UNKNOWN" autocomplete="off" value="DR-STRANGE">
      </div>
      <div class="input-group">
        <label>Security Key</label>
        <input type="password" id="access-key" placeholder="••••••••" value="admin123">
      </div>
      <button class="btn-connect" id="connect-btn">AUTHENTICATE</button>
    </div>
  </div>

  <div class="warp-tunnel"></div>

  <div class="page-dashboard">
    <div class="dashboard-bg-deco"></div>
    <header class="dashboard-header">
      <div class="logo" style="font-size: 1.5rem; letter-spacing: 2px;">
        HOSPIT-X <span style="color:var(--neon-blue); font-size: 0.8em; border: 1px solid var(--neon-blue); padding: 2px 5px;">SYS.ADMIN</span>
      </div>
      <div class="user-status" style="font-family: 'Orbitron'; display: flex; align-items: center; gap: 15px;">
        <div class="system-status" style="font-size: 0.7rem; display: flex; align-items: center; gap: 5px;">
          <span class="status-dot pulse"></span>
          SYS: <span id="sys-status-text" style="color:var(--neon-blue)">SYNCING</span>
        </div>
        LOGIN: <span id="display-id" style="color:var(--neon-green)">---</span>
        <button id="logout-btn" class="btn-logout">LOGOUT [X]</button>
      </div>
    </header>
    
    <div class="grid-container">
      
      <!-- DNA VISUALIZER (Main View) -->
      <div class="panel center-view" style="padding:0; overflow:hidden; position: relative;">
        <h3 style="position: absolute; top: 1rem; left: 1rem; z-index: 2; text-shadow: 0 0 5px black;">GENOMIC SEQUENCE VISUALIZER</h3>
        <div id="dna-canvas-container" style="width: 100%; height: 100%;"></div>
      </div>
      
      <div class="panel right-hud">
        <h3>PATIENT REPORT ENTRY</h3>
         <div class="report-form-container">
            <input type="text" class="report-input" placeholder="PATIENT NAME" id="p-name">
            <input type="text" class="report-input" placeholder="AGE / GENDER" id="p-age">
            <input type="text" class="report-input" placeholder="BLOOD GROUP" id="p-blood">
            <input type="text" class="report-input" placeholder="DISEASE/CONDITION" id="p-disease">
            <textarea class="report-input" placeholder="DIAGNOSIS NOTES" rows="3" id="p-diagnosis"></textarea>
            <button class="btn-submit" id="submit-report">UPLOAD TO BACKEND</button>
         </div>
         <div style="flex-grow: 1; margin-top: 1rem; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 0.5rem;">
            <div style="font-size: 0.8rem; color: var(--neon-purple); margin-bottom: 0.5rem;">SYS LOGS:</div>
            <ul id="console-logs" style="list-style: none; padding: 0; font-size: 0.7rem; color: #888; overflow-y: auto; height: 100px; font-family: 'monospace';">
              <li>[SYS] Standing by...</li>
            </ul>
         </div>
      </div>
    </div>
  </div>

  <div class="page-analysis">
      <div class="dashboard-bg-deco" style="border-color: var(--neon-green);"></div>
      <header class="dashboard-header">
        <div class="logo">DRUG DISCOVERY <span style="color:var(--neon-green)">ANALYTICS</span></div>
        <button id="back-dashboard" class="btn-logout">BACK</button>
      </header>
      
      <div class="analysis-container">
          <div class="panel">
              <h3>MOLECULAR PARAMETERS</h3>
              <div class="report-form-container">
                <label>Target Protein</label>
                <input type="text" class="report-input" value="EGFR-Kinase-Mutant" id="ana-target">
                <label>Ligand ID</label>
                <input type="text" class="report-input" value="LIG-4920" id="ana-ligand">
                <label>Molecular Weight (Da)</label>
                <input type="number" class="report-input" value="452.3" id="ana-mw">
                 <label>LogP (Hydrophobicity)</label>
                <input type="number" class="report-input" value="3.2" id="ana-logp">
                
                <button class="btn-submit" id="btn-predict" style="margin-top: 2rem; background: linear-gradient(90deg, #002, var(--neon-purple), #002); color: white;">RUN AI PREDICTION MODEL</button>
              </div>
          </div>
          
          <div class="panel" style="display:flex; flex-direction: column;">
              <h3>PREDICTION RESULTS & GRAPHS</h3>
              <div class="graph-container" id="results-graph">
                  <!-- Bars inserted here -->
                  <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: #555;" id="graph-placeholder">AWAITING INPUT...</div>
              </div>
              <div class="result-card" style="margin-top: 1rem; opacity: 0;" id="text-result">
                  <div style="color: var(--neon-green); font-size: 1.2rem; margin-bottom: 5px;">SUCCESS: POTENTIAL CANDIDATE FOUND</div>
                  <div style="font-size: 0.9rem; color: #ccc;">Binding Affinity: <span style="color: white; font-weight: bold;">-9.4 kcal/mol</span> | Toxicity Risk: LOW</div>
              </div>
          </div>
      </div>
      
      <!-- Drug-Disease Compatibility Analysis -->
      <div class="analysis-container" style="margin-top: 1.5rem;">
          <div class="panel" style="grid-column: 1 / -1;">
              <h3>DRUG-DISEASE COMPATIBILITY ANALYSIS</h3>
              <div id="compatibility-result" style="padding: 1.5rem; text-align: center; color: #888;">
                  <div style="font-size: 0.9rem;">Run prediction model to analyze drug compatibility with patient's disease</div>
              </div>
          </div>
      </div>
  </div>
`

// Logic
const connectBtn = document.getElementById('connect-btn');
const logoutBtn = document.getElementById('logout-btn');
const pageLogin = document.querySelector('.page-login') as HTMLElement;
const pageDashboard = document.querySelector('.page-dashboard') as HTMLElement;
const pageAnalysis = document.querySelector('.page-analysis') as HTMLElement;
const warpTunnel = document.querySelector('.warp-tunnel');
const bg = document.querySelector('.hex-bg');
const doctorIdInput = document.getElementById('doctor-id') as HTMLInputElement;
const displayId = document.getElementById('display-id');
const consoleLogs = document.getElementById('console-logs');
const submitBtn = document.getElementById('submit-report');
const predictBtn = document.getElementById('btn-predict');
const backDashBtn = document.getElementById('back-dashboard');


// ... (Existing variables)
let dnaRenderer: THREE.WebGLRenderer, dnaScene: THREE.Scene, dnaCamera: THREE.PerspectiveCamera;
let labelRenderer: CSS2DRenderer;

// ========== TRANSITION EFFECT FUNCTIONS ========== 

// Particle Burst Effect
function createParticleBurst(x: number, y: number, count: number = 30) {
  const colors = ['#ff00ff', '#00d4ff', '#ff0080', '#0aff0a'];

  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle-burst';
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    particle.style.background = colors[Math.floor(Math.random() * colors.length)];
    document.body.appendChild(particle);

    const angle = (Math.PI * 2 * i) / count;
    const velocity = 100 + Math.random() * 200;
    const tx = Math.cos(angle) * velocity;
    const ty = Math.sin(angle) * velocity;

    gsap.to(particle, {
      x: tx,
      y: ty,
      opacity: 0,
      scale: Math.random() * 2,
      duration: 0.8 + Math.random() * 0.4,
      ease: 'power2.out',
      onComplete: () => particle.remove()
    });
  }
}

// Glitch Overlay Effect
function triggerGlitchEffect() {
  const glitch = document.getElementById('glitch-overlay');
  if (!glitch) return;

  const tl = gsap.timeline();
  tl.to(glitch, { opacity: 0.8, duration: 0.05 });
  tl.to(glitch, { x: -5, duration: 0.05 });
  tl.to(glitch, { x: 5, duration: 0.05 });
  tl.to(glitch, { x: -3, duration: 0.05 });
  tl.to(glitch, { x: 0, opacity: 0, duration: 0.1 });
}

// Scan Line Effect
function triggerScanLine() {
  const scanLine = document.getElementById('scan-line');
  if (!scanLine) return;

  gsap.fromTo(scanLine,
    { top: '0%', opacity: 1 },
    {
      top: '100%',
      opacity: 0,
      duration: 0.6,
      ease: 'power2.inOut'
    }
  );
}

// Color Wave Effect
function triggerColorWave() {
  const wave = document.getElementById('color-wave');
  if (!wave) return;

  gsap.fromTo(wave,
    { left: '-100%', opacity: 0.7 },
    {
      left: '100%',
      opacity: 0,
      duration: 1.2,
      ease: 'power2.inOut'
    }
  );
}

// Morphing Shape Effect
function triggerMorphingShape() {
  const shape = document.getElementById('morph-shape');
  if (!shape) return;

  const tl = gsap.timeline();
  tl.to(shape, {
    opacity: 1,
    width: 200,
    height: 200,
    rotation: 45,
    duration: 0.4,
    ease: 'power2.out'
  });
  tl.to(shape, {
    width: 300,
    height: 100,
    rotation: 90,
    borderRadius: '50%',
    duration: 0.3
  });
  tl.to(shape, {
    opacity: 0,
    scale: 2,
    duration: 0.3
  });
  tl.set(shape, { width: 100, height: 100, rotation: 0, scale: 1, borderRadius: 0 });
}

// Hexagon Transition
function triggerHexagonTransition() {
  const hex = document.getElementById('hex-transition');
  if (!hex) return;

  gsap.fromTo(hex,
    { width: 0, height: 0, opacity: 1 },
    {
      width: '200vw',
      height: '200vw',
      opacity: 0,
      duration: 1,
      ease: 'power2.out'
    }
  );
}

// Ripple Effect
function triggerRippleEffect() {
  const ripple = document.getElementById('ripple-effect');
  if (!ripple) return;

  const tl = gsap.timeline();
  for (let i = 0; i < 3; i++) {
    tl.fromTo(ripple,
      { width: 50, height: 50, opacity: 0.8 },
      {
        width: 800,
        height: 800,
        opacity: 0,
        duration: 1,
        ease: 'power2.out'
      },
      i * 0.2
    );
  }
}

// Digital Rain Effect
function triggerDigitalRain(duration: number = 1) {
  const rain = document.getElementById('digital-rain');
  if (!rain) return;

  rain.innerHTML = '';
  const columnCount = 30;

  gsap.to(rain, { opacity: 1, duration: 0.1 });

  for (let i = 0; i < columnCount; i++) {
    const column = document.createElement('div');
    column.className = 'rain-column';
    column.style.left = (Math.random() * 100) + '%';
    column.style.animationDelay = (Math.random() * 0.5) + 's';
    rain.appendChild(column);
  }

  setTimeout(() => {
    gsap.to(rain, {
      opacity: 0,
      duration: 0.3,
      onComplete: () => { rain.innerHTML = ''; }
    });
  }, duration * 1000);
}

// Vortex Transition
function triggerVortexTransition() {
  const vortex = document.getElementById('vortex-transition');
  if (!vortex) return;

  gsap.fromTo(vortex,
    { width: 0, height: 0, opacity: 1, rotation: 0 },
    {
      width: 800,
      height: 800,
      opacity: 0,
      rotation: 720,
      duration: 1.2,
      ease: 'power2.out'
    }
  );
}

// Grid Transition
function triggerGridTransition(duration: number = 0.8) {
  const grid = document.getElementById('grid-transition');
  if (!grid) return;

  const tl = gsap.timeline();
  tl.to(grid, { opacity: 0.5, duration: 0.2 });
  tl.to(grid, { opacity: 0, duration: duration - 0.2 });
}

// Combined Transition Effect
function playTransitionEffects(effectType: 'login' | 'dashboard' | 'analysis' | 'back') {
  switch (effectType) {
    case 'login':
      // Login to Dashboard: Vortex + Scan + Particles
      createParticleBurst(window.innerWidth / 2, window.innerHeight / 2, 40);
      triggerVortexTransition();
      setTimeout(() => triggerScanLine(), 300);
      setTimeout(() => triggerGlitchEffect(), 600);
      break;

    case 'dashboard':
      // Dashboard to Analysis: Hexagon + Color Wave + Digital Rain
      triggerHexagonTransition();
      setTimeout(() => triggerColorWave(), 200);
      setTimeout(() => triggerDigitalRain(0.8), 400);
      setTimeout(() => triggerGlitchEffect(), 800);
      break;

    case 'analysis':
      // Analysis Page Effects: Morphing + Ripple + Grid
      triggerMorphingShape();
      setTimeout(() => triggerRippleEffect(), 200);
      setTimeout(() => triggerGridTransition(), 400);
      break;

    case 'back':
      // Back Navigation: Color Wave + Scan + Particles
      triggerColorWave();
      setTimeout(() => triggerScanLine(), 300);
      setTimeout(() => createParticleBurst(window.innerWidth / 2, window.innerHeight / 2, 30), 500);
      setTimeout(() => triggerGlitchEffect(), 700);
      break;
  }
}


function addLog(msg: string) {
  if (!consoleLogs) return;
  const now = new Date();
  const time = now.getHours().toString().padStart(2, '0') + ":" +
    now.getMinutes().toString().padStart(2, '0') + ":" +
    now.getSeconds().toString().padStart(2, '0');

  const li = document.createElement('li');
  li.style.marginTop = "5px";
  li.style.borderLeft = "2px solid rgba(10, 255, 10, 0.3)";
  li.style.paddingLeft = "8px";
  li.innerHTML = `<span style="color:#555">[${time}]</span> <span style="color:var(--neon-green)">PRC:</span> ${msg}`;
  consoleLogs.appendChild(li);
  consoleLogs.scrollTop = consoleLogs.scrollHeight;

  // Scroller fade out effect for old logs
  if (consoleLogs.children.length > 50) {
    consoleLogs.removeChild(consoleLogs.children[0]);
  }
}

// Three.js DNA Setup - Modern Cinematic Glass & Neon with Precision Pins
function initDNA() {
  const container = document.getElementById('dna-canvas-container');
  if (!container) return;

  container.innerHTML = '';

  // Scene
  dnaScene = new THREE.Scene();
  dnaScene.fog = new THREE.FogExp2(0x020408, 0.02);

  // Camera
  dnaCamera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 100);
  dnaCamera.position.set(0, 0, 45);

  // Renderer (WebGL)
  dnaRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  dnaRenderer.setSize(container.clientWidth, container.clientHeight);
  dnaRenderer.setPixelRatio(window.devicePixelRatio);
  dnaRenderer.toneMapping = THREE.ACESFilmicToneMapping;
  dnaRenderer.toneMappingExposure = 1.2;
  container.appendChild(dnaRenderer.domElement);

  // Renderer (CSS2D - For Labels)
  labelRenderer = new CSS2DRenderer();
  labelRenderer.setSize(container.clientWidth, container.clientHeight);
  labelRenderer.domElement.style.position = 'absolute';
  labelRenderer.domElement.style.top = '0px';
  labelRenderer.domElement.style.pointerEvents = 'none';
  container.appendChild(labelRenderer.domElement);

  // Controls
  const controls = new OrbitControls(dnaCamera, dnaRenderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.enableZoom = true;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 1.0;

  // Lighting
  const ambientLight = new THREE.AmbientLight(0x404040, 2);
  dnaScene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 2);
  dirLight.position.set(10, 20, 10);
  dnaScene.add(dirLight);

  const blueSpot = new THREE.PointLight(0x0088ff, 5, 50);
  blueSpot.position.set(-20, 10, 20);
  dnaScene.add(blueSpot);

  const orangeSpot = new THREE.PointLight(0xff8800, 5, 50);
  orangeSpot.position.set(20, -10, 20);
  dnaScene.add(orangeSpot);

  const dnaGroup = new THREE.Group();
  dnaScene.add(dnaGroup);

  // Materials
  const backboneMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x88ccff,
    metalness: 0.1,
    roughness: 0.1,
    transmission: 0.9,
    thickness: 1.5,
    clearcoat: 1.0,
    opacity: 0.8,
    transparent: true,
    side: THREE.DoubleSide
  });

  // Materials for 4 Bases
  const matAdenine = new THREE.MeshStandardMaterial({ color: 0x00f3ff, emissive: 0x00f3ff, emissiveIntensity: 2, roughness: 0.2, metalness: 0.8 }); // Cyan
  const matThymine = new THREE.MeshStandardMaterial({ color: 0xff8800, emissive: 0xff8800, emissiveIntensity: 2, roughness: 0.2, metalness: 0.8 }); // Orange
  const matGuanine = new THREE.MeshStandardMaterial({ color: 0x0aff0a, emissive: 0x0aff0a, emissiveIntensity: 2, roughness: 0.2, metalness: 0.8 }); // Green
  const matCytosine = new THREE.MeshStandardMaterial({ color: 0xff00ff, emissive: 0xff00ff, emissiveIntensity: 2, roughness: 0.2, metalness: 0.8 }); // Purple

  // Geometry Generation
  const pointCount = 100;
  const radius = 6;
  const height = 45;
  const turns = 3;

  const pointsA = [];
  const pointsB = [];

  for (let i = 0; i <= pointCount; i++) {
    const t = i / pointCount;
    const angle = t * Math.PI * 2 * turns;
    const y = (t - 0.5) * height;

    const x1 = Math.cos(angle) * radius;
    const z1 = Math.sin(angle) * radius;
    pointsA.push(new THREE.Vector3(x1, y, z1));

    const x2 = Math.cos(angle + Math.PI) * radius;
    const z2 = Math.sin(angle + Math.PI) * radius;
    pointsB.push(new THREE.Vector3(x2, y, z2));
  }

  const curveA = new THREE.CatmullRomCurve3(pointsA);
  const curveB = new THREE.CatmullRomCurve3(pointsB);

  const tubeGeoA = new THREE.TubeGeometry(curveA, 128, 0.4, 16, false);
  const tubeGeoB = new THREE.TubeGeometry(curveB, 128, 0.4, 16, false);

  const strandA = new THREE.Mesh(tubeGeoA, backboneMaterial);
  const strandB = new THREE.Mesh(tubeGeoB, backboneMaterial);
  dnaGroup.add(strandA);
  dnaGroup.add(strandB);

  // Helpers
  function createRadialPinLabel(text: string, position: THREE.Vector3, color: string) {
    // Create a local group at the position
    const group = new THREE.Group();
    group.position.copy(position);

    // Calculate radial vector (pointing away from Y axis)
    const radial = new THREE.Vector3(position.x, 0, position.z).normalize();

    // Target Dot
    const dot = new THREE.Mesh(new THREE.SphereGeometry(0.3), new THREE.MeshBasicMaterial({ color: color }));
    group.add(dot);

    // Pin Line
    const pinLen = 5.0; // Slightly longer
    const endPoint = radial.clone().multiplyScalar(pinLen);
    const lineGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), endPoint]);
    const line = new THREE.Line(lineGeo, new THREE.LineBasicMaterial({ color: color, transparent: true, opacity: 0.5 }));
    group.add(line);

    // Label Element
    const div = document.createElement('div');
    div.className = 'mole-label';
    div.innerHTML = text; // allow html
    div.style.color = color;
    div.style.border = '1px solid ' + color;
    div.style.background = 'rgba(0,10,20,0.85)';
    div.style.padding = '4px 8px';
    div.style.borderRadius = '4px';
    div.style.marginTop = '-10px';

    const label = new CSS2DObject(div);
    label.position.copy(endPoint);
    group.add(label);

    return group;
  }

  // Rungs & Labels
  const rungCount = 35;
  const cylGeo = new THREE.CylinderGeometry(0.2, 0.2, 1, 16);
  const sphereGeo = new THREE.SphereGeometry(0.5, 16, 16);

  let labeledA = false;
  let labeledT = false;
  let labeledG = false;
  let labeledC = false;

  for (let i = 1; i < rungCount; i++) {
    const t = i / rungCount;
    const ptA = curveA.getPoint(t);
    const ptB = curveB.getPoint(t);
    const dist = ptA.distanceTo(ptB);
    const mid = new THREE.Vector3().lerpVectors(ptA, ptB, 0.5);

    const halfLen = (dist / 2) - 0.5;

    // Determine Pair Type: A-T or G-C
    // Pattern: A-T, G-C, G-C, A-T ...
    const pairType = i % 4; // 0=A-T, 1=G-C, 2=G-C, 3=A-T

    let mat1, mat2;
    let col1, col2;
    let type1 = '', type2 = '';

    if (pairType === 0 || pairType === 3) {
      // A-T Pair
      mat1 = matAdenine; col1 = '#00f3ff'; type1 = 'A';
      mat2 = matThymine; col2 = '#ff8800'; type2 = 'T';
    } else {
      // G-C Pair
      mat1 = matGuanine; col1 = '#0aff0a'; type1 = 'G';
      mat2 = matCytosine; col2 = '#ff00ff'; type2 = 'C';
    }

    // Rungs
    const r1 = new THREE.Mesh(cylGeo, mat1);
    r1.scale.y = halfLen;
    r1.position.copy(ptA).lerp(mid, 0.5);
    r1.lookAt(ptB);
    r1.rotateX(Math.PI / 2);
    dnaGroup.add(r1);

    const r2 = new THREE.Mesh(cylGeo, mat2);
    r2.scale.y = halfLen;
    r2.position.copy(ptB).lerp(mid, 0.5);
    r2.lookAt(ptA);
    r2.rotateX(Math.PI / 2);
    dnaGroup.add(r2);

    // Connectors
    const s1 = new THREE.Mesh(sphereGeo, mat1);
    s1.position.copy(ptA);
    dnaGroup.add(s1);

    const s2 = new THREE.Mesh(sphereGeo, mat2);
    s2.position.copy(ptB);
    dnaGroup.add(s2);

    // Labels
    // Spread them out vertically
    if (type1 === 'A' && !labeledA && i > 5) {
      dnaGroup.add(createRadialPinLabel("Adenine (A)", r1.position, col1));
      labeledA = true;
    }
    if (type2 === 'T' && !labeledT && i > 8) {
      dnaGroup.add(createRadialPinLabel("Thymine (T)", r2.position, col2));
      labeledT = true;
    }
    if (type1 === 'G' && !labeledG && i > 15) {
      dnaGroup.add(createRadialPinLabel("Guanine (G)", r1.position, col1));
      labeledG = true;
    }
    if (type2 === 'C' && !labeledC && i > 20) {
      dnaGroup.add(createRadialPinLabel("Cytosine (C)", r2.position, col2));
      labeledC = true;
    }
  }

  // Backbone Label
  const bbPoint = curveA.getPoint(0.9);
  dnaGroup.add(createRadialPinLabel("Sugar-Phosphate<br>Backbone", bbPoint, "#88ccff"));

  // Particles
  const pCount = 300;
  const pPos = [];
  const pCols = [];
  for (let i = 0; i < pCount; i++) {
    pPos.push((Math.random() - 0.5) * 50, (Math.random() - 0.5) * 70, (Math.random() - 0.5) * 50);
    const c = Math.random() > 0.5 ? new THREE.Color(0x00aaff) : new THREE.Color(0xffaa00);
    pCols.push(c.r, c.g, c.b);
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.Float32BufferAttribute(pPos, 3));
  pGeo.setAttribute('color', new THREE.Float32BufferAttribute(pCols, 3));
  const pMat = new THREE.PointsMaterial({
    vertexColors: true, size: 0.4, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending
  });
  const pSys = new THREE.Points(pGeo, pMat);
  dnaScene.add(pSys);

  // Animate
  const animate = () => {
    if (!dnaRenderer) return;
    requestAnimationFrame(animate);
    controls.update();
    dnaGroup.rotation.y += 0.002;
    pSys.rotation.y -= 0.001;

    dnaRenderer.render(dnaScene, dnaCamera);
    labelRenderer.render(dnaScene, dnaCamera);
  };
  animate();

  const handleResize = () => {
    if (!container || !dnaCamera) return;
    const w = container.clientWidth;
    const h = container.clientHeight;
    dnaCamera.aspect = w / h;
    dnaCamera.updateProjectionMatrix();
    dnaRenderer.setSize(w, h);
    labelRenderer.setSize(w, h);
  };
  window.addEventListener('resize', handleResize);
  setTimeout(handleResize, 100);
}

if (connectBtn) {
  connectBtn.addEventListener('click', () => {
    const docId = doctorIdInput.value || "UNKNOWN";

    // Trigger transition effects
    playTransitionEffects('login');

    // Sequence
    const tl = gsap.timeline();

    // 1. Inputs fade out
    tl.to('.login-card', {
      scaleY: 0.01,
      scaleX: 1.2,
      opacity: 0.5,
      duration: 0.4,
      ease: "power2.in"
    });
    // ...
    tl.to('.login-card', {
      scaleX: 0,
      opacity: 0,
      duration: 0.2,
      ease: "power2.in"
    });

    // 2. Background zooms
    tl.to(bg, {
      scale: 8,
      opacity: 0,
      duration: 1.5,
      ease: "expo.in"
    }, "-=0.3");

    // 3. Tunnel Flash
    tl.to(warpTunnel, {
      width: '400vw',
      height: '400vw',
      opacity: 1,
      duration: 1.2,
      ease: "expo.in"
    }, "<");

    // 4. Reveal
    tl.to(warpTunnel, {
      opacity: 0,
      duration: 0.2,
      onComplete: () => {
        initDNA(); // Start 3D
      }
    }, "-=0.2");

    tl.set(pageLogin, { display: 'none' });
    tl.set(pageDashboard, { display: 'block', opacity: 0 });

    if (displayId) {
      // Scramble
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
      const targetText = docId;
      const duration = 1.5;
      const obj = { value: 0 };
      gsap.to(obj, {
        duration: duration,
        value: 1,
        ease: "none",
        onUpdate: () => {
          const progress = obj.value;
          const len = Math.floor(progress * targetText.length);
          let result = targetText.substring(0, len);
          if (len < targetText.length) {
            for (let i = 0; i < 3; i++) {
              result += chars[Math.floor(Math.random() * chars.length)];
            }
          }
          displayId.innerText = result;
        },
        onComplete: () => {
          displayId.innerText = targetText;
        }
      });
    }

    tl.to(pageDashboard, {
      opacity: 1,
      duration: 1
    });

    tl.from('.panel', {
      y: 100,
      opacity: 0,
      stagger: 0.2,
      duration: 0.8,
      ease: "power4.out"
    }, "-=0.5");

    setTimeout(() => addLog("Authenticating Credentials..."), 2000);
    setTimeout(() => addLog("Establish Secure Link..."), 3000);
    setTimeout(() => addLog("Network Handshake: SUCCESS"), 4000);
    setTimeout(() => addLog("Genomic Visualizer Loaded..."), 4500);
    setTimeout(() => addLog("SYSTEM ONLINE"), 5500);
  });
}

// Logout
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    const tl = gsap.timeline();

    tl.to(pageDashboard, {
      opacity: 0,
      duration: 0.5,
      onComplete: () => {
        pageDashboard.style.display = 'none';
        pageLogin.style.display = 'flex';
        gsap.set('.login-card', { scale: 1, opacity: 1, scaleX: 1, scaleY: 1 });
        gsap.from('.login-card', { y: -50, opacity: 0, duration: 0.5 });

        const container = document.getElementById('dna-canvas-container');
        if (container) container.innerHTML = '';
      }
    });

    tl.to(bg, {
      scale: 1,
      opacity: 0.6,
      duration: 1
    }, "-=0.5");
  });
}

// Submit / Navigate to Analysis
if (submitBtn) {
  submitBtn.addEventListener('click', () => {
    const pName = (document.getElementById('p-name') as HTMLInputElement).value;
    const pAge = (document.getElementById('p-age') as HTMLInputElement).value;

    if (!pName || !pAge) {
      alert("Please enter patient details first.");
      return;
    }

    addLog("Processing Patient Data...");

    // Trigger transition effects
    playTransitionEffects('dashboard');

    // Transition to Analysis
    const tl = gsap.timeline();

    tl.to('.page-dashboard', {
      scale: 0.9,
      opacity: 0,
      duration: 0.5,
      ease: "power2.in"
    });

    tl.to(warpTunnel, {
      width: '400vw',
      height: '400vw',
      opacity: 1,
      duration: 1,
      ease: "expo.out"
    });

    tl.set('.page-dashboard', { display: 'none' });
    tl.set('.page-analysis', { display: 'flex', opacity: 0 });

    tl.to(warpTunnel, {
      opacity: 0,
      duration: 0.5
    });

    tl.to('.page-analysis', {
      opacity: 1,
      duration: 0.5
    });

    tl.from('.analysis-container .panel', {
      y: 50,
      opacity: 0,
      stagger: 0.2
    }, "-=0.3");
  });
}

// Drug-Disease Compatibility Database
interface DrugDiseaseMatch {
  disease: string;
  targetProtein: string;
  compatibility: number;
  mechanism: string;
  sideEffects: string[];
  clinicalEvidence: string;
}

const drugDiseaseDatabase: DrugDiseaseMatch[] = [
  {
    disease: "lung cancer",
    targetProtein: "EGFR-Kinase-Mutant",
    compatibility: 95,
    mechanism: "Inhibits EGFR tyrosine kinase activity, blocking cancer cell proliferation",
    sideEffects: ["Skin rash", "Diarrhea", "Fatigue"],
    clinicalEvidence: "Phase III trials show 70% response rate"
  },
  {
    disease: "non-small cell lung cancer",
    targetProtein: "EGFR-Kinase-Mutant",
    compatibility: 98,
    mechanism: "Targets EGFR mutations common in NSCLC, preventing tumor growth",
    sideEffects: ["Skin rash", "Diarrhea", "Liver enzyme elevation"],
    clinicalEvidence: "FDA approved with strong clinical data"
  },
  {
    disease: "breast cancer",
    targetProtein: "EGFR-Kinase-Mutant",
    compatibility: 45,
    mechanism: "Limited EGFR expression in most breast cancers",
    sideEffects: ["Skin rash", "Diarrhea"],
    clinicalEvidence: "Limited efficacy in clinical trials"
  },
  {
    disease: "colorectal cancer",
    targetProtein: "EGFR-Kinase-Mutant",
    compatibility: 72,
    mechanism: "Blocks EGFR signaling in KRAS wild-type tumors",
    sideEffects: ["Skin reactions", "Hypomagnesemia"],
    clinicalEvidence: "Effective in KRAS wild-type patients"
  },
  {
    disease: "diabetes",
    targetProtein: "EGFR-Kinase-Mutant",
    compatibility: 15,
    mechanism: "No therapeutic benefit for diabetes",
    sideEffects: ["May worsen glucose control"],
    clinicalEvidence: "Not indicated for metabolic disorders"
  },
  {
    disease: "hypertension",
    targetProtein: "EGFR-Kinase-Mutant",
    compatibility: 10,
    mechanism: "No cardiovascular therapeutic effect",
    sideEffects: ["Potential cardiac complications"],
    clinicalEvidence: "Not recommended for cardiovascular conditions"
  },
  {
    disease: "glioblastoma",
    targetProtein: "EGFR-Kinase-Mutant",
    compatibility: 68,
    mechanism: "Targets EGFR amplification common in glioblastoma",
    sideEffects: ["Fatigue", "Headache", "Skin rash"],
    clinicalEvidence: "Moderate efficacy in EGFR-amplified cases"
  }
];

function analyzeDrugDiseaseCompatibility(disease: string, targetProtein: string): DrugDiseaseMatch | null {
  const normalizedDisease = disease.toLowerCase().trim();

  // Find exact or partial match
  let match = drugDiseaseDatabase.find(entry =>
    entry.disease === normalizedDisease && entry.targetProtein === targetProtein
  );

  // If no exact match, try partial match
  if (!match) {
    match = drugDiseaseDatabase.find(entry =>
      normalizedDisease.includes(entry.disease) || entry.disease.includes(normalizedDisease)
    );
  }

  return match || null;
}

// Predict Graph Logic
if (predictBtn) {
  predictBtn.addEventListener('click', () => {
    const btn = predictBtn as HTMLButtonElement;
    btn.innerHTML = "RUNNING SIMULATION...";
    btn.disabled = true;

    const graphContainer = document.getElementById('results-graph');
    if (graphContainer) graphContainer.innerHTML = ''; // Clear placeholder

    const resultText = document.getElementById('text-result');
    if (resultText) gsap.set(resultText, { opacity: 0, y: 20 });

    // Creating Bars
    const data = [
      { label: 'Binding', value: 85, color: '#00f3ff' },
      { label: 'Stability', value: 92, color: '#0aff0a' },
      { label: 'Solubility', value: 64, color: '#ffff00' },
      { label: 'Toxicity', value: 12, color: '#ff0055' }, // Lower is better usually, but bar height represents magnitude
      { label: 'Synth-Ease', value: 78, color: '#ff00ff' }
    ];

    data.forEach((d, i) => {
      const bar = document.createElement('div');
      bar.className = 'bar-chart-bar';
      bar.style.height = '0%';
      bar.style.backgroundColor = d.color;

      const label = document.createElement('div');
      label.className = 'bar-label';
      label.innerText = d.label;
      bar.appendChild(label);

      const val = document.createElement('div');
      val.className = 'bar-value';
      val.innerText = d.value + '%';
      val.style.opacity = '0';
      bar.appendChild(val);

      if (graphContainer) graphContainer.appendChild(bar);

      // Animate
      setTimeout(() => {
        bar.style.height = d.value + '%';
        gsap.to(val, { opacity: 1, delay: 1 });
      }, i * 200 + 500);
    });

    // Drug-Disease Compatibility Analysis
    setTimeout(() => {
      const diseaseInput = (document.getElementById('p-disease') as HTMLInputElement);
      const targetProteinInput = (document.getElementById('ana-target') as HTMLInputElement);
      const compatibilityContainer = document.getElementById('compatibility-result');

      if (diseaseInput && targetProteinInput && compatibilityContainer) {
        const disease = diseaseInput.value;
        const targetProtein = targetProteinInput.value;

        if (disease && disease.trim() !== '') {
          const match = analyzeDrugDiseaseCompatibility(disease, targetProtein);

          if (match) {
            const isSupported = match.compatibility >= 60;
            const statusColor = isSupported ? 'var(--neon-green)' : 'var(--neon-red, #ff0055)';
            const statusText = isSupported ? '✓ SUPPORTED' : '✗ NOT RECOMMENDED';
            const statusIcon = isSupported ? '✓' : '⚠';

            compatibilityContainer.innerHTML = `
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; text-align: left;">
                <div>
                  <div style="font-size: 1.3rem; color: ${statusColor}; margin-bottom: 1rem; font-weight: bold;">
                    ${statusIcon} ${statusText}
                  </div>
                  <div style="margin-bottom: 1rem;">
                    <div style="color: var(--neon-blue); font-size: 0.85rem; margin-bottom: 0.3rem;">DISEASE:</div>
                    <div style="color: white; font-size: 1rem;">${match.disease.toUpperCase()}</div>
                  </div>
                  <div style="margin-bottom: 1rem;">
                    <div style="color: var(--neon-blue); font-size: 0.85rem; margin-bottom: 0.3rem;">COMPATIBILITY SCORE:</div>
                    <div style="color: ${statusColor}; font-size: 1.5rem; font-weight: bold;">${match.compatibility}%</div>
                    <div style="width: 100%; height: 8px; background: rgba(255,255,255,0.1); border-radius: 4px; margin-top: 0.5rem; overflow: hidden;">
                      <div style="width: ${match.compatibility}%; height: 100%; background: ${statusColor}; transition: width 1s ease;"></div>
                    </div>
                  </div>
                  <div style="margin-bottom: 1rem;">
                    <div style="color: var(--neon-blue); font-size: 0.85rem; margin-bottom: 0.3rem;">TARGET PROTEIN:</div>
                    <div style="color: #ccc; font-size: 0.9rem;">${match.targetProtein}</div>
                  </div>
                </div>
                <div>
                  <div style="margin-bottom: 1rem;">
                    <div style="color: var(--neon-purple); font-size: 0.85rem; margin-bottom: 0.3rem;">MECHANISM OF ACTION:</div>
                    <div style="color: #ccc; font-size: 0.85rem; line-height: 1.4;">${match.mechanism}</div>
                  </div>
                  <div style="margin-bottom: 1rem;">
                    <div style="color: var(--neon-purple); font-size: 0.85rem; margin-bottom: 0.3rem;">POTENTIAL SIDE EFFECTS:</div>
                    <div style="color: #ccc; font-size: 0.85rem;">
                      ${match.sideEffects.map(effect => `<div style="margin: 0.2rem 0;">• ${effect}</div>`).join('')}
                    </div>
                  </div>
                  <div>
                    <div style="color: var(--neon-purple); font-size: 0.85rem; margin-bottom: 0.3rem;">CLINICAL EVIDENCE:</div>
                    <div style="color: #ccc; font-size: 0.85rem; line-height: 1.4;">${match.clinicalEvidence}</div>
                  </div>
                </div>
              </div>
              ${isSupported ?
                `<div style="margin-top: 1.5rem; padding: 1rem; background: rgba(0, 255, 100, 0.1); border: 1px solid var(--neon-green); border-radius: 8px; text-align: center;">
                  <div style="color: var(--neon-green); font-size: 1rem;">
                    ✓ This drug candidate shows strong compatibility with the patient's condition
                  </div>
                </div>` :
                `<div style="margin-top: 1.5rem; padding: 1rem; background: rgba(255, 0, 85, 0.1); border: 1px solid #ff0055; border-radius: 8px; text-align: center;">
                  <div style="color: #ff0055; font-size: 1rem;">
                    ⚠ This drug candidate is NOT recommended for the patient's condition
                  </div>
                </div>`
              }
            `;

            gsap.from(compatibilityContainer.children, {
              opacity: 0,
              y: 20,
              stagger: 0.1,
              duration: 0.5
            });
          } else {
            compatibilityContainer.innerHTML = `
              <div style="padding: 2rem; text-align: center;">
                <div style="color: #ffaa00; font-size: 1.2rem; margin-bottom: 1rem;">⚠ UNKNOWN DISEASE</div>
                <div style="color: #888; font-size: 0.9rem;">
                  No compatibility data available for "${disease}"<br>
                  <span style="font-size: 0.8rem; margin-top: 0.5rem; display: block;">
                    Supported diseases: Lung Cancer, NSCLC, Breast Cancer, Colorectal Cancer, Glioblastoma
                  </span>
                </div>
              </div>
            `;
          }
        } else {
          compatibilityContainer.innerHTML = `
            <div style="padding: 2rem; text-align: center; color: #888;">
              <div style="font-size: 1rem;">⚠ Please enter patient's disease in the Patient Report Entry section</div>
            </div>
          `;
        }
      }
    }, 2000);

    // Trigger analysis effects
    setTimeout(() => playTransitionEffects('analysis'), 1000);

    setTimeout(() => {
      btn.innerHTML = "RUN AI PREDICTION MODEL";
      btn.disabled = false;

      if (resultText) {
        gsap.to(resultText, { opacity: 1, y: 0, duration: 0.5 });
      }
    }, 2500);
  });
}

// Back to Dashboard
if (backDashBtn) {
  backDashBtn.addEventListener('click', () => {
    // Trigger transition effects
    playTransitionEffects('back');

    const tl = gsap.timeline();

    tl.to('.page-analysis', {
      opacity: 0,
      duration: 0.5,
      onComplete: () => {
        pageAnalysis.style.display = 'none';
        pageDashboard.style.display = 'block';
      }
    });

    tl.to('.page-dashboard', {
      opacity: 1,
      scale: 1,
      duration: 0.5
    });
  });
}

// Code organization: Section 1 - Imports

// Code organization: Section 2 - UI Selectors

// Code organization: Section 3 - DNA Initialization

// Code organization: Section 4 - Authentication Logic

// Code organization: Section 5 - Dashboard Navigation

// Code organization: Section 6 - Prediction Engine

// Code organization: Section 7 - Compatibility Matching
