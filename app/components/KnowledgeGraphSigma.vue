<template>
  <div class="kg-wrapper" :class="{ 'is-light': isLight }">
    <!-- Search & Filters Toolbar -->
    <div class="kg-toolbar">
      <div class="search-box">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="ค้นหาชื่อนักวิจัย, กลุ่ม หรือหน่วยงาน..."
          @keyup.enter="handleSearch"
        />
        <button @click="handleSearch" class="btn-search">
          <Icon name="ph:magnifying-glass-bold" />
        </button>
      </div>
      
      <div class="filters">
        <select v-model="filters.theme">
          <option value="">ทุก Theme</option>
          <option v-for="(t, key) in THEMES" :key="key" :value="key">{{ t.name }}</option>
        </select>
        
        <select v-model="filters.type">
          <option value="">ทุกประเภท</option>
          <option value="Researcher">Researcher</option>
          <option value="Group">Group</option>
          <option value="MOU">MOU</option>
        </select>

        <button @click="resetView" class="btn-icon" title="Reset View">
          <Icon name="ph:arrows-counter-clockwise-bold" />
        </button>
      </div>
    </div>

    <div class="kg-main">
      <!-- Graph Area -->
      <div ref="chartRef" class="chart-container"></div>

      <!-- Left Panel: Stats -->
      <div class="panel stats-panel" v-if="!selectedNode">
        <h3 class="font-bold mb-2 flex items-center gap-2 text-xs uppercase tracking-widest opacity-70">
          <Icon name="ph:chart-bar-bold" /> Network Stats
        </h3>
        <div class="stat-item">
          <span class="label">Nodes:</span>
          <span class="value font-mono font-bold">{{ stats.nodes }}</span>
        </div>
        <div class="stat-item">
          <span class="label">Edges:</span>
          <span class="value font-mono font-bold">{{ stats.edges }}</span>
        </div>
        <div class="stat-item">
          <span class="label">Clusters:</span>
          <span class="value font-mono font-bold">{{ stats.communities }}</span>
        </div>
      </div>

      <!-- Right Panel: Node Detail -->
      <div v-if="selectedNode" class="panel detail-panel animate-in zoom-in-95 fade-in slide-in-from-right-8 duration-500">
        <div class="panel-header flex justify-between items-center mb-4">
          <span class="type-tag" :class="selectedNode.type.toLowerCase()">{{ selectedNode.type }}</span>
          <button @click="clearSelection" class="close-btn hover:rotate-90 transition-transform">
            <Icon name="ph:x-bold" />
          </button>
        </div>
        <h2 class="text-xl font-bold leading-tight">{{ selectedNode.label }}</h2>
        <div class="panel-body space-y-4 mt-4">
          <div v-if="selectedNode.data?.expertise" class="detail-section">
            <label class="text-[10px] font-bold uppercase text-slate-400 block mb-1">Expertise Keywords</label>
            <div class="tags flex flex-wrap gap-1">
              <span v-for="exp in selectedNode.data.expertise" :key="exp" class="tag bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-[10px] font-bold">
                {{ exp }}
              </span>
            </div>
          </div>
          <div v-if="selectedNode.data?.inst" class="detail-section">
            <label class="text-[10px] font-bold uppercase text-slate-400 block mb-1">Institution</label>
            <p class="text-sm font-semibold">{{ selectedNode.data.inst }}</p>
          </div>
          <div v-if="selectedNode.data?.hindex !== undefined" class="detail-section grid grid-cols-2 gap-4">
             <div>
               <label class="text-[10px] font-bold uppercase text-slate-400 block mb-1">H-Index</label>
               <p class="text-lg font-mono font-black text-blue-500">{{ selectedNode.data.hindex }}</p>
             </div>
             <div>
               <label class="text-[10px] font-bold uppercase text-slate-400 block mb-1">Impact Score</label>
               <p class="text-lg font-mono font-black text-emerald-500">{{ selectedNode.data.exp_score || 0 }}</p>
             </div>
          </div>
          
          <div class="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
            <button @click="toggleExpand" :class="isExpanded ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'" class="action-btn w-full py-3 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg">
              <Icon :name="isExpanded ? 'ph:arrows-in-bold' : 'ph:graph-bold'" /> 
              {{ isExpanded ? 'Collapse Relationship' : 'Focus & Expand' }}
            </button>
            <button @click="clearSelection" class="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-600 py-2">
              Back to Overview
            </button>
          </div>
        </div>
      </div>

      <!-- Legend Layer -->
      <div class="absolute bottom-6 left-6 flex items-center gap-6 text-[10px] font-bold tracking-widest uppercase backdrop-blur px-4 py-2 rounded-full transition-colors"
           :class="isLight ? 'text-slate-600 bg-white/60 border-slate-200/50' : 'text-slate-400 bg-slate-900/40 border-white/5'"
      >
        <div class="flex items-center gap-2"><div class="w-2 h-2 rounded-full bg-emerald-500"></div> Researcher</div>
        <div class="flex items-center gap-2"><div class="w-2 h-2 rounded-full bg-blue-500"></div> Group</div>
        <div class="flex items-center gap-2"><div class="w-2 h-2 rounded-full bg-amber-500"></div> MOU</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Sigma from 'sigma';
import Graph from 'graphology';
import forceAtlas2 from 'graphology-layout-forceatlas2';
import { animateNodes } from "sigma/utils";
import { useGraphQuery } from '~/composables/useGraphQuery';
import { THEMES } from '~/utils/mockData';
import { TC } from '~/utils';

const { isLight } = useTheme();
const { getCommunityGraph, searchGraph } = useGraphQuery();
const chartRef = useTemplateRef<HTMLElement>('chartRef');

let sigmaInstance: Sigma | null = null;
const graph = new Graph();

const searchQuery = ref('');
const selectedNode = ref<any>(null);
const hoveredNode = ref<string | null>(null);
const isExpanded = ref(false);
const hoveredNeighbors = ref<Set<string>>(new Set());

const filters = reactive({
  theme: '',
  type: ''
});

const stats = reactive({
  nodes: 0,
  edges: 0,
  communities: 0
});

const TYPE_COLORS: Record<string, string> = {
  Researcher: '#10b981',
  Group: '#3b82f6',
  MOU: '#f59e0b',
  Theme: '#8b5cf6' // Added a specific color for 'Theme' nodes
};

const applyDefaultReducers = () => {
  if (!sigmaInstance) return;

  sigmaInstance.setSetting("nodeReducer", (node, data) => {
    const attr = { ...data };
    // 1. Filter level
    if (filters.theme) {
      const nodeTheme = data.data?.theme;
      const isMatch = Array.isArray(nodeTheme)
        ? nodeTheme.includes(filters.theme)
        : nodeTheme === filters.theme;

      if (!isMatch) attr.hidden = true;
    }
    if (filters.type && data.data?.type !== filters.type) attr.hidden = true;

    // 2. Focus level (Expanded Mode)
    // If focused, hide everything that isn't a direct neighbor or the node itself
    if (selectedNode.value && isExpanded.value) {
      const neighbors = graph.neighbors(selectedNode.value.id);
      if (node !== selectedNode.value.id && !neighbors.includes(node)) {
        attr.hidden = true;
      }
      return attr;
    }

    // 3. Interaction level (Hover & Selection)
    // Cognitive Load reduction: Dim nodes that are not the focus
    if (hoveredNode.value || selectedNode.value) {
      const isSelected = selectedNode.value?.id === node;
      const isHovered = hoveredNode.value === node;
      const isNeighborOfHovered = hoveredNeighbors.value.has(node);
      const isNeighborOfSelected = selectedNode.value ? graph.neighbors(selectedNode.value.id).includes(node) : false;

      if (!isSelected && !isHovered && !isNeighborOfHovered && !isNeighborOfSelected) {
        attr.alpha = 0.1;
        attr.label = ""; // Hide label to reduce visual noise
        attr.color = isLight.value ? "#cbd5e1" : "#1e293b";
      }
    }

    return attr;
  });

  sigmaInstance.setSetting("edgeReducer", (edge, data) => {
    const attr = { ...data };
    const [source, target] = graph.extremities(edge);
    
    // Isolation mode: hide edges not connected to the selected node
    if (selectedNode.value && isExpanded.value) {
      if (!graph.hasExtremity(edge, selectedNode.value.id)) {
        attr.hidden = true;
        return attr;
      }
    }

    // Default edge style: solid contrast based on theme for clarity
    attr.color = isLight.value ? "#cbd5e1" : "#334155";

    // Highlight edge if connected to focused node
    if (hoveredNode.value === source || hoveredNode.value === target || 
        selectedNode.value?.id === source || selectedNode.value?.id === target) {
      attr.color = isLight.value ? "#3b82f6" : "#60a5fa";
      attr.size = 2;
    }
    
    const sAttr = graph.getNodeAttributes(source);
    const tAttr = graph.getNodeAttributes(target);
    
    // Edge Filtering: Hide edges if either connected node doesn't match the theme filter
    if (filters.theme) {
      const sMatch = Array.isArray(sAttr.theme) ? sAttr.theme.includes(filters.theme) : sAttr.theme === filters.theme;
      const tMatch = Array.isArray(tAttr.theme) ? tAttr.theme.includes(filters.theme) : tAttr.theme === filters.theme;
      if (!sMatch || !tMatch) {
        attr.hidden = true;
      }
    }
    return attr;
  });
};

const clearSelection = () => {
  selectedNode.value = null;
  isExpanded.value = false;
  applyDefaultReducers();
  sigmaInstance?.refresh();
};

const initChart = async () => {
  if (!chartRef.value) return;

  // Wait for the next tick to ensure parent layout calculations are finished
  await nextTick();

  sigmaInstance = new Sigma(graph, chartRef.value, {
    renderEdgeLabels: true,
    enableEdgeEvents: true,
    labelFont: "Plus Jakarta Sans",
    labelWeight: "700",
    labelSize: 11,
    defaultEdgeType: "line",
    allowInvalidContainer: true, // Fixes the "Container has no height" error
  });

  applyDefaultReducers();

  // Events for reducing cognitive load
  sigmaInstance.on('clickNode', (params) => {
    if (selectedNode.value?.id !== params.node) {
      isExpanded.value = false; // Reset expansion when switching nodes
    }
    const nodeData = graph.getNodeAttributes(params.node);
    selectedNode.value = { id: params.node, ...nodeData };
    sigmaInstance?.refresh();
  });

  sigmaInstance.on('doubleClickNode', (params) => {
    isExpanded.value = true;
    toggleExpand();
  });

  sigmaInstance.on('enterNode', (params) => {
    hoveredNode.value = params.node;
    hoveredNeighbors.value = new Set(graph.neighbors(params.node));
    sigmaInstance?.refresh();
  });

  sigmaInstance.on('leaveNode', () => {
    hoveredNode.value = null;
    hoveredNeighbors.value.clear();
    sigmaInstance?.refresh();
  });

  sigmaInstance.on('clickStage', () => {
    clearSelection();
  });

  updateChart();
};

const updateChart = () => {
  const data = getCommunityGraph();
  graph.clear();

  data.nodes.forEach((n: any) => {
    graph.addNode(n.id, {
      x: Math.random() * 100,
      y: Math.random() * 100,
      label: n.name,
      size: n.dataType === 'Group' ? 14 : n.dataType === 'MOU' ? 10 : 7,
      color: TYPE_COLORS[n.dataType] || n.itemStyle?.color || TC(n.data?.theme) || '#94a3b8',
      type: 'circle',
      theme: n.data?.theme,
      community: n.community,
      data: { ...n, theme: n.dataTheme, type: n.dataType },
    });
  });

  data.links.forEach((l: any) => {
    if (graph.hasNode(l.source) && graph.hasNode(l.target)) {
      graph.mergeEdge(l.source, l.target, { 
      });
    }
  });

  const positions = forceAtlas2(graph, { 
    iterations: 120, 
    settings: { 
      gravity: 0.8, 
      barnesHutOptimize: true, 
      scalingRatio: 12,
      strongGravityMode: false // Less aggressive for smoother look
    } 
  });
  
  animateNodes(graph, positions, { duration: 1500, easing: "cubicInOut" });

  stats.nodes = data.nodes.length;
  stats.edges = data.links.length;
  stats.communities = new Set(data.nodes.map(n => n.community)).size;

  sigmaInstance?.refresh();
};

const handleSearch = async () => {
  if (!searchQuery.value) return;
  const found = searchGraph(searchQuery.value);
  
  if (found && found.length > 0) {
    const nodeId = found[0]?.id;
    filters.theme = '';
    filters.type = '';
    await nextTick();

    const nodeDisplayData = sigmaInstance?.getNodeDisplayData(nodeId);
    if (nodeDisplayData) {
      sigmaInstance?.getCamera().animate(
        { x: nodeDisplayData.x, y: nodeDisplayData.y, ratio: 0.08 }, 
        { duration: 800 }
      );
    }
    selectedNode.value = found[0];
  }
};

const toggleExpand = () => {
  if (!sigmaInstance || !selectedNode.value) return;

  isExpanded.value = !isExpanded.value;

  if (isExpanded.value) {
    const nodeId = selectedNode.value.id;
    const nodeDisplayData = sigmaInstance.getNodeDisplayData(nodeId);

    if (nodeDisplayData) {
      sigmaInstance.getCamera().animate(
        { x: nodeDisplayData.x, y: nodeDisplayData.y, ratio: 0.15 },
        { duration: 600 }
      );
    }
  }
  sigmaInstance?.refresh();
};

const resetView = () => {
  filters.theme = '';
  filters.type = '';
  searchQuery.value = '';
  clearSelection();
  updateChart();
};

watch(filters, () => {
  sigmaInstance?.refresh();
});

watch(isLight, () => {
  graph.updateEachEdgeAttributes((edge, attr) => {
    return { ...attr, color: isLight.value ? '#cbd5e1' : '#334155' };
  });
  sigmaInstance?.refresh();
});

onMounted(initChart);

onBeforeUnmount(() => {
  if (sigmaInstance) sigmaInstance.kill();
});
</script>

<style scoped>
.kg-wrapper {
  display: flex;
  flex-direction: column;
  height: 100vh; /* Changed from 100% to 100vh to ensure it always has height */
  width: 100%;
  background: #0f172a;
  color: white;
  transition: all 0.3s ease;
  position: relative;
}

.kg-wrapper.is-light {
  background: #f8fafc;
  color: #1e293b;
}

.kg-toolbar {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(12px);
  z-index: 20;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.kg-wrapper.is-light .kg-toolbar {
  background: rgba(255, 255, 255, 0.8);
  border-bottom: 1px solid #e2e8f0;
}

.search-box {
  display: flex;
  background: #1e293b;
  border-radius: 16px;
  overflow: hidden;
  flex: 1;
  max-width: 400px;
  border: 1px solid rgba(255,255,255,0.1);
}

.kg-wrapper.is-light .search-box {
  background: #fff;
  border: 1px solid #e2e8f0;
}

.search-box input {
  background: transparent;
  border: none;
  padding: 0.6rem 1rem;
  color: white;
  flex: 1;
  outline: none;
  font-size: 0.85rem;
}

.kg-wrapper.is-light .search-box input {
  color: #1e293b;
}

.btn-search {
  background: #3b82f6;
  border: none;
  padding: 0 1.25rem;
  cursor: pointer;
  color: white;
  display: flex;
  align-items: center;
}

.filters {
  display: flex;
  gap: 0.75rem;
}

.filters select {
  background: #1e293b;
  color: white;
  border: 1px solid rgba(255,255,255,0.1);
  padding: 0 1rem;
  border-radius: 16px;
  outline: none;
  font-size: 0.85rem;
  cursor: pointer;
}

.kg-wrapper.is-light .filters select {
  background: #fff;
  color: #1e293b;
  border: 1px solid #e2e8f0;
}

.btn-icon {
  background: #1e293b;
  color: white;
  border: 1px solid rgba(255,255,255,0.1);
  width: 42px;
  height: 42px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-icon:hover {
  background: #334155;
}

.kg-wrapper.is-light .btn-icon {
  background: #fff;
  color: #1e293b;
  border: 1px solid #e2e8f0;
}

.kg-main {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.chart-container {
  width: 100%;
  height: 100%;
}

.panel {
  position: absolute;
  background: rgba(15, 23, 42, 0.9);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  border-radius: 32px;
  box-shadow: 0 25px 60px -12px rgba(0,0,0,0.5);
}

.kg-wrapper.is-light .panel {
  background: rgba(255, 255, 255, 0.9);
  border-color: #e2e8f0;
  box-shadow: 0 20px 50px rgba(0,0,0,0.1);
}

.stats-panel {
  top: 1.5rem;
  left: 1.5rem;
  width: 240px;
}

.detail-panel {
  top: 1.5rem;
  right: 1.5rem;
  width: 340px;
  z-index: 30;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  margin-top: 0.75rem;
  font-size: 0.85rem;
}

.type-tag {
  font-size: 0.65rem;
  padding: 3px 10px;
  border-radius: 6px;
  text-transform: uppercase;
  font-weight: 900;
  letter-spacing: 0.05em;
  color: white;
}

.type-tag.researcher { background: #10b981; }
.type-tag.group { background: #3b82f6; }
.type-tag.mou { background: #f59e0b; }

.close-btn {
  background: transparent;
  border: none;
  color: inherit;
  font-size: 1.25rem;
  cursor: pointer;
  opacity: 0.5;
}

.close-btn:hover {
  opacity: 1;
}
</style>