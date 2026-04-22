<template>
  <div class="network-container">
    <div ref="container" class="map-area">
      <div class="map-toolbar">
        <button class="mc on" onclick="setML('force',this)">⊕ Force</button>
        <button class="mc" onclick="setML('radial',this)">◎ Radial</button>
        <div style="width:1px;height:16px;background:var(--b1)"></div>
        <button class="mc" onclick="mzoom(1.15)">+</button>
        <button class="mc" onclick="mzoom(.87)">−</button>
        <button class="mc" onclick="mreset()">↺</button>
        <div style="width:1px;height:16px;background:var(--b1)"></div>
        <select class="mc" id="mf-theme" onchange="drawMap()" style="border:none;padding:4px 8px">
          <option value="">ทุก Theme</option>${Object.keys(THEMES).map(t=>`<option>${t}</option>`).join('')}
        </select>
        <select class="mc" id="mf-type" onchange="drawMap()" style="border:none;padding:4px 8px">
          <option value="">ทุกประเภท</option>
          <option value="group">Groups</option>
          <option value="res">Researchers</option>
          <option value="mou">MOU</option>
        </select>
        <div style="margin-left:auto;font-size:14px;color:var(--t3)">คลิก = Drill-down · ลาก = เลื่อน · Scroll = Zoom
        </div>
      </div>
      <canvas ref="canvas" id="fc" @mousedown="onMouseDown" @mousemove="onMouseMove" @mouseup="mDrag = false"
        @mouseleave="mDrag = false; mHover = null"></canvas>
      <div class="map-legend">
        <div class="leg-hd">Node Types</div>
        <div class="leg-row">
          <div class="leg-dot" style="background:var(--c)"></div>Research Group
        </div>
        <div class="leg-row">
          <div class="leg-dot" style="border-radius:50%;background:var(--em)"></div>Researcher
        </div>
        <div class="leg-row">
          <div class="leg-dot" style="transform:rotate(45deg);background:var(--am)"></div>MOU
        </div>
        <div class="leg-note">── Membership<br>── Partnership<br>- - Expertise Match</div>
      </div>
    </div>
    <!-- <div class="toolbar">
      <div class="controls">
        <button @click="mLayout = 'force'" :class="{ active: mLayout === 'force' }">Force</button>
        <select v-model="filterTheme">
          <option value="">ทุก Theme</option>
          <option v-for="(v, k) in THEMES" :key="k" :value="k">{{ v.name }}</option>
        </select>
      </div>
      <div class="hint">คลิกและลากเพื่อเคลื่อนย้าย · Scroll เพื่อ Zoom</div>
    </div> -->

    <div ref="container" class="canvas-box">
      <!-- <canvas 
        ref="canvas"
        id="fc"
        @mousedown="onMouseDown"
        @mousemove="onMouseMove"
        @mouseup="mDrag = false"
        @mouseleave="mDrag = false; mHover = null"
      ></canvas> -->

      <div v-if="mHover" class="node-tooltip">
        <div class="tt-header">
          <span class="type-tag" :style="{ background: mHover.color }">{{ mHover.type }}</span>
          <strong>{{ mHover.data.name || mHover.data.inst }}</strong>
        </div>
        <div class="tt-body">
          <p v-if="mHover.type === 'res'">{{ mHover.data.expertise.join(', ') }}</p>
          <div class="stats">
            <span>H-Index: {{ mHover.data.hindex || 'N/A' }}</span>
            <span>Exp: {{ mHover.data.exp_score }}</span>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
<script setup lang="ts">
const canvasRef = useTemplateRef<HTMLCanvasElement>('canvas');
const containerRef = useTemplateRef<HTMLDivElement>('container');
// Panel State
const selectedNode = ref<{ type: 'group' | 'res' | 'mou', data: any } | null>(null);
const isPanelOpen = ref(false);
// State
const mLayout = ref<'force' | 'radial'>('force');
const mScale = ref(1);
const mOX = ref(0);
const mOY = ref(0);
const mHover = ref<any>(null);
const filterTheme = ref('');
const filterType = ref('');

// Non-reactive physics data
let MAP_NODES: any[] = [];
let MAP_EDGES: any[] = [];
let mRaf: number;
let mDrag = false;
let mDS = { x: 0, y: 0 };
let mVS = { x: 0, y: 0 };

// Helper: Get Theme Color
const TC = (themeKey: string) => THEMES[themeKey as keyof typeof THEMES]?.color || '#cbd5e0';

const buildMapNodes = () => {
  MAP_NODES = [];
  MAP_EDGES = [];

  // 1. Groups (The Core)
  GROUPS.forEach(g => {
    MAP_NODES.push({ 
      id: 'G' + g.id, label: g.short, type: 'group', data: g, 
      x: 0, y: 0, vx: 0, vy: 0, r: 18 + g.hindex / 8, color: TC(g.theme) 
    });
  });

  // 2. Researchers (Connected to Groups)
  RESEARCHERS.forEach(r => {
    MAP_NODES.push({ 
      id: 'R' + r.id, label: r.name.split(' ')[1]?.slice(0, 5) || r.name.slice(0, 5), 
      type: 'res', data: r, x: 0, y: 0, vx: 0, vy: 0, r: 10 + r.hindex / 10, color: TC(r.themes[0] || '') 
    });
    MAP_EDGES.push({ s: 'G' + r.group, t: 'R' + r.id, w: 1.5, type: 'member' });
  });

  // 3. MOUs (External Partners)
  MOUS.forEach(m => {
    MAP_NODES.push({ 
      id: 'M' + m.id, label: m.flag + m.inst.slice(0, 4), type: 'mou', 
      data: m, x: 0, y: 0, vx: 0, vy: 0, r: 14, color: TC(m.theme) 
    });
    m.matched_groups.forEach(gid => {
      MAP_EDGES.push({ s: 'G' + gid, t: 'M' + m.id, w: 2.5, type: 'partner' });
    });
  });

  placeNodesInitial();
};

const placeNodesInitial = () => {
  const W = containerRef.value?.clientWidth || 800;
  const H = containerRef.value?.clientHeight || 600;
  const cx = W / 2; const cy = H / 2;

  MAP_NODES.forEach(n => {
    n.x = cx + (Math.random() - 0.5) * W * 0.8;
    n.y = cy + (Math.random() - 0.5) * H * 0.8;
  });
};

const runForce = () => {
  const W = canvasRef.value?.width || 800;
  const H = canvasRef.value?.height || 600;
  const cx = W / 2; const cy = H / 2;

  // Repulsion & Collision
  MAP_NODES.forEach(a => {
    MAP_NODES.forEach(b => {
      if (a.id === b.id) return;
      const dx = a.x - b.x, dy = a.y - b.y, d = Math.sqrt(dx * dx + dy * dy) || 1;
      const minDist = a.r + b.r + 30;
      if (d < minDist) {
        const f = (minDist - d) / d * 0.4;
        a.vx += dx * f; a.vy += dy * f;
      }
      const rep = 1800 / (d * d);
      a.vx += (dx / d) * rep * 0.05; a.vy += (dy / d) * rep * 0.05;
    });
  });

  // Attraction (Edges)
  MAP_EDGES.forEach(e => {
    const a = MAP_NODES.find(n => n.id === e.s);
    const b = MAP_NODES.find(n => n.id === e.t);
    if (!a || !b) return;
    const dx = b.x - a.x, dy = b.y - a.y, d = Math.sqrt(dx * dx + dy * dy) || 1;
    const target = a.type === 'group' && b.type === 'res' ? 80 : 150;
    const f = (d - target) / d * 0.04;
    a.vx += dx * f; a.vy += dy * f;
    b.vx -= dx * f; b.vy -= dy * f;
  });

  // Apply friction and bounds
  MAP_NODES.forEach(n => {
    n.vx += (cx - n.x) * 0.003;
    n.vy += (cy - n.y) * 0.003;
    n.vx *= 0.82; n.vy *= 0.82;
    n.x += n.vx; n.y += n.vy;
  });
};

const draw = () => {
  const cv = canvasRef.value;
  if (!cv) return;
  const ctx = cv.getContext('2d')!;
  const W = cv.width; const H = cv.height;

  ctx.clearRect(0, 0, W, H);
  
  // Grid Background
  ctx.strokeStyle = 'rgba(255,255,255,0.03)';
  for(let i=0; i<W; i+=50){ ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i,H); ctx.stroke(); }

  ctx.save();
  ctx.translate(mOX.value + W/2, mOY.value + H/2);
  ctx.scale(mScale.value, mScale.value);
  ctx.translate(-W/2, -H/2);

  // Draw Edges
  MAP_EDGES.forEach(e => {
    const a = MAP_NODES.find(n => n.id === e.s);
    const b = MAP_NODES.find(n => n.id === e.t);
    if (!a || !b) return;
    
    const isHigh = mHover.value && (mHover.value.id === a.id || mHover.value.id === b.id);
    ctx.globalAlpha = isHigh ? 0.8 : 0.15;
    ctx.strokeStyle = e.type === 'member' ? '#00d4ff' : '#00e5a0';
    ctx.lineWidth = isHigh ? 2 : 1;
    ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
  });

  // Draw Nodes
  MAP_NODES.forEach(n => {
    const isH = mHover.value?.id === n.id;
    const r = n.r + (isH ? 4 : 0);
    
    ctx.globalAlpha = (filterTheme.value && n.data.theme !== filterTheme.value) ? 0.2 : 1;

    // Outer Glow for hover
    if (isH) {
        const g = ctx.createRadialGradient(n.x, n.y, r, n.x, n.y, r*2);
        g.addColorStop(0, n.color + '44'); g.addColorStop(1, 'transparent');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(n.x, n.y, r*2, 0, Math.PI*2); ctx.fill();
    }

    ctx.fillStyle = n.color;
    ctx.beginPath();
    if (n.type === 'group') ctx.roundRect(n.x - r, n.y - r, r*2, r*2, 6);
    else if (n.type === 'mou') {
        ctx.save(); ctx.translate(n.x, n.y); ctx.rotate(Math.PI/4);
        ctx.roundRect(-r*0.8, -r*0.8, r*1.6, r*1.6, 2); ctx.restore();
    } else ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
    ctx.fill();

    // Label
    ctx.fillStyle = '#fff';
    ctx.font = `bold ${Math.max(8, r*0.5)}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(n.label, n.x, n.y + 4);
  });

  ctx.restore();
  if (mLayout.value === 'force') runForce();
  mRaf = requestAnimationFrame(draw);
};

// Events
const onMouseDown = (e: MouseEvent) => {
    mDrag = true;
    mDS = { x: e.clientX, y: e.clientY };
    mVS = { x: mOX.value, y: mOY.value };
};
const onMouseMove = (e: MouseEvent) => {
    const rect = canvasRef.value!.getBoundingClientRect();
    const ex = e.clientX - rect.left;
    const ey = e.clientY - rect.top;

    if (mDrag) {
        mOX.value = mVS.x + (e.clientX - mDS.x);
        mOY.value = mVS.y + (e.clientY - mDS.y);
        return;
    }

    // Hit detection
    const worldX = (ex - (mOX.value + rect.width/2)) / mScale.value + rect.width/2;
    const worldY = (ey - (mOY.value + rect.height/2)) / mScale.value + rect.height/2;
    mHover.value = MAP_NODES.find(n => Math.hypot(n.x - worldX, n.y - worldY) < n.r + 5);
};

// Synchronize Canvas Buffer with Element Size
const resizeCanvas = () => {
  const canvas = canvasRef.value;
  const container = containerRef.value;
  
  if (canvas && container) {
    // Set the internal drawing surface to match the CSS display size
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    
    // If you have a static placement function, re-run it here
    // placeNodesInitial(); 
  }
};

// Use ResizeObserver for "True" 100% responsiveness
let resizeObs: ResizeObserver;

const closePanel = () => {
  isPanelOpen.value = false;
  setTimeout(() => { selectedNode.value = null; }, 300);
};

// Selection Logic
// const onMouseClick = (e: MouseEvent) => {
//   const rect = canvasRef.value!.getBoundingClientRect();
//   const n = getNodeAt(e.clientX - rect.left, e.clientY - rect.top);
  
//   if (n) {
//     selectedNode.value = { type: n.type, data: n.data };
//     isPanelOpen.value = true;
//   }
// };

// Data getters for the panel
const getGroupMembers = (gid: string) => RESEARCHERS.filter(r => r.group === gid);
const getGroupMous = (gid: string) => MOUS.filter(m => m.matched_groups.includes(gid));
const getResWorks = (rid: string) => WORKS.filter(w => w.researcher === rid);
const getResHistory = (rid: string) => HISTORY.filter(h => h.researcher_id === rid);
onMounted(() => {
  if (containerRef.value) {
    resizeObs = new ResizeObserver(() => {
      resizeCanvas();
    });
    resizeObs.observe(containerRef.value);
  }
  
  // Initial build and draw loop
  buildMapNodes();
  draw();
});

onUnmounted(() => {
  if (resizeObs) resizeObs.disconnect();
  cancelAnimationFrame(mRaf)
});
</script>


<style scoped>
.network-container {
  width: 100%; 
  height: 100%;
  display: flex; 
  flex-direction: column; 
  border-radius: 12px; 
  overflow: hidden;
  
}
.toolbar {
  padding: 12px; background: rgba(255,255,255,0.05);
  display: flex; justify-content: space-between; align-items: center;
}
.controls { display: flex; gap: 10px; }
.hint { font-size: 11px; opacity: 0.5; }

.canvas-box { 
  flex: 1; 
  position: relative; 
  cursor: grab; 
}
.canvas-box:active { cursor: grabbing; }

.map-toolbar {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 8px 14px;
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-b1);
  flex-shrink: 0;
  flex-wrap: wrap
}

.mc {
  background: var(--color-bg2);
  border: 1px solid var(--color-b1);
  border-radius: var(--r6);
  padding: 4px 10px;
  font-size: 11px;
  color: var(--color-t2);
  cursor: pointer;
  font-family: var(--font-sans-color);
  transition: all .15s
}

.mc:hover {
  border-color: var(--color-b2);
  color: var(--color-t0)
}

.mc.on {
  background: var(--c-d);
  border-color: var(--c);
  color: var(--c);
  font-weight: 600
}

.map-area {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  min-height: 0;
}

#fc {
  width: 100%;
  height: 100%;
  display: block;
  cursor: grab
}

#fc:active {
  cursor: grabbing
}

.node-tt {
  position: absolute;
  background: var(--color-surface);
  border: 1px solid var(--color-b2);
  border-radius: var(--r10);
  padding: 11px 14px;
  font-size: 12px;
  pointer-events: none;
  z-index: 100;
  display: none;
  box-shadow: 0 12px 40px rgba(0, 0, 0, .4), var(--c-glow);
  max-width: 220px;
  opacity: 0.96
}

.tt-n {
  font-weight: 800;
  font-size: 13px;
  color: var(--color-t0);
  margin-bottom: 2px
}

.tt-s {
  font-size: 10px;
  color: var(--color-t3);
  margin-bottom: 7px
}

.tt-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5px
}

.tt-kv {
  background: var(--color-bg3);
  border-radius: 5px;
  padding: 5px 7px
}

.tt-k {
  font-size: 9px;
  color: var(--t3)
}

.tt-v {
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 700;
  color: var(--c)
}
.map-legend {
  position: absolute;
  bottom: 12px;
  left: 12px;
  z-index: 50; 
  background: var(--color-surface);
  border: 1px solid var(--color-b1);
  border-radius: var(--r10);
  padding: 12px 14px;
  font-size: 11px;
  opacity: 0.92;
  
  backdrop-filter: blur(8px); 
}

.leg-hd {
  font-size: 9px;
  font-weight: 800;
  color: var(--color-t3);
  text-transform: uppercase;
  letter-spacing: .08em;
  margin-bottom: 7px
}

.leg-row {
  display: flex;
  align-items: center;
  gap: 7px;
  color: var(--color-t2);
  padding: 2px 0
}

.leg-dot {
  width: 10px;
  height: 10px;
  flex-shrink: 0;
  border-radius: 2px
}

.leg-note {
  font-size: 10px;
  color: var(--color-t3);
  margin-top: 7px;
  padding-top: 7px;
  border-top: 1px solid var(--color-b0);
  line-height: 1.5
}
</style>