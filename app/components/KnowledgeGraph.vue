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
          <Icon name="material-symbols:search" />
        </button>
      </div>
      
      <div class="filters">
        <select v-model="filters.theme">
          <option value="">ทุก Theme</option>
          <option v-for="theme in themes" :key="theme" :value="theme">{{ theme }}</option>
        </select>
        
        <select v-model="filters.type">
          <option value="">ทุกประเภท</option>
          <option value="Researcher">Researcher</option>
          <option value="Group">Group</option>
          <option value="MOU">MOU</option>
        </select>

        <button @click="resetView" class="btn-icon" title="Reset View">
          <Icon name="material-symbols:restart-alt" />
        </button>
      </div>
    </div>

    <div class="kg-main">
      <!-- Graph Area -->
      <div ref="chartRef" class="chart-container"></div>

      <!-- Left Panel: Stats -->
      <div class="panel stats-panel">
        <h3>Graph Statistics</h3>
        <div class="stat-item">
          <span class="label">Nodes:</span>
          <span class="value">{{ stats.nodes }}</span>
        </div>
        <div class="stat-item">
          <span class="label">Edges:</span>
          <span class="value">{{ stats.edges }}</span>
        </div>
        <div class="stat-item">
          <span class="label">Communities:</span>
          <span class="value">{{ stats.communities }}</span>
        </div>
      </div>

      <!-- Right Panel: Node Detail -->
      <div v-if="selectedNode" class="panel detail-panel">
        <div class="panel-header">
          <span class="type-tag" :class="selectedNode.type.toLowerCase()">{{ selectedNode.type }}</span>
          <button @click="selectedNode = null" class="close-btn">×</button>
        </div>
        <h2>{{ selectedNode.label }}</h2>
        <div class="panel-body">
          <div v-if="selectedNode.data?.expertise" class="detail-section">
            <label>Expertise:</label>
            <div class="tags">
              <span v-for="exp in selectedNode.data.expertise" :key="exp" class="tag">{{ exp }}</span>
            </div>
          </div>
          <div v-if="selectedNode.data?.inst" class="detail-section">
            <label>Institution:</label>
            <p>{{ selectedNode.data.inst }}</p>
          </div>
          <button @click="expandNode(selectedNode.id)" class="action-btn">Expand Connections</button>
        </div>
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

const { isLight } = useTheme();
const { getCommunityGraph, searchGraph } = useGraphQuery();
const chartRef = useTemplateRef<HTMLElement>('chartRef');

let sigmaInstance: Sigma | null = null;
const graph = new Graph();

const searchQuery = ref('');
const selectedNode = ref<any>(null);
const filters = reactive({
  theme: '',
  type: ''
});

const stats = reactive({
  nodes: 0,
  edges: 0,
  communities: 0
});

const themes = ['Agriculture', 'Medicine', 'Engineering', 'Digital'];

const TYPE_COLORS: Record<string, string> = {
  Researcher: '#10b981',
  Group: '#3b82f6',
  MOU: '#f59e0b'
};

const initChart = () => {
  if (!chartRef.value) return;

  // Initialize Sigma
  sigmaInstance = new Sigma(graph, chartRef.value, {
    renderEdgeLabels: true,
    enableEdgeEvents: true,
  });

  // Node Reducer for Filtering
  sigmaInstance.setSetting("nodeReducer", (node, data) => {
    const attr = { ...data };
    if (filters.theme && data.data.theme !== filters.theme) attr.hidden = true;
    if (filters.type && data.data.type !== filters.type) attr.hidden = true;
    return attr;
  });

  // Edge Reducer
  sigmaInstance.setSetting("edgeReducer", (edge, data) => {
    const attr = { ...data };
    const [source, target] = graph.extremities(edge);
    const sHidden = filters.theme && graph.getNodeAttribute(source, 'theme') !== filters.theme;
    const tHidden = filters.theme && graph.getNodeAttribute(target, 'theme') !== filters.theme;
    
    if (sHidden || tHidden) attr.hidden = true;
    return attr;
  });

  // Event Listeners
  sigmaInstance.on('clickNode', (params) => {
    const nodeData = graph.getNodeAttributes(params.node);
    selectedNode.value = { id: params.node, ...nodeData };
  });

  sigmaInstance.on('doubleClickNode', (params) => {
    expandNode(params.node);
  });

  updateChart();
};

const updateChart = () => {
  const data = getCommunityGraph();
  
  graph.clear();

  // Add Nodes
  data.nodes.forEach((n: any) => {
    graph.addNode(n.id, {
      x: Math.random() * 100,
      y: Math.random() * 100,
      label: n.name,
      size: n.dataType === 'Group' ? 15 : 8,
      color: TYPE_COLORS[n.dataType] || n.itemStyle?.color ||  '#94a3b8',
      type: n.type,
      theme: n.data?.theme,
      community: n.community,
      data: { ...n.data, type: n.dataType },
    });
  });

  // Add Edges
  data.links.forEach((l: any) => {
    if (graph.hasNode(l.source) && graph.hasNode(l.target)) {
      graph.mergeEdge(l.source, l.target, { size: 1, color: isLight.value ? '#cbd5e1' : '#475569' });
    }
  });

  // Apply Layout
  const positions = forceAtlas2(graph, { 
    iterations: 100, 
    settings: { gravity: 1, barnesHutOptimize: true, scalingRatio: 10 } 
  });
  
  animateNodes(graph, positions, { duration: 800, easing: "quadraticInOut" });

  // Stats Calculation
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
    
    // Clear filters to ensure node is visible
    filters.theme = '';
    filters.type = '';
    await nextTick();

    const nodeDisplayData = sigmaInstance?.getNodeDisplayData(nodeId);
    if (nodeDisplayData) {
      sigmaInstance?.getCamera().animate(
        { x: nodeDisplayData.x, y: nodeDisplayData.y, ratio: 0.15 }, 
        { duration: 600 }
      );
    }

    selectedNode.value = found[0];
  }
};

const expandNode = (nodeId: string) => {
  if (!sigmaInstance) return;

  const neighbors = graph.neighbors(nodeId);
  const nodeDisplayData = sigmaInstance.getNodeDisplayData(nodeId);

  // Animate camera to focus on the node
  if (nodeDisplayData) {
    sigmaInstance.getCamera().animate(
      { x: nodeDisplayData.x, y: nodeDisplayData.y, ratio: 0.2 },
      { duration: 600 }
    );
  }

  // Highlighting: Fade out non-neighbors using Sigma's reducer
  sigmaInstance.setSetting("nodeReducer", (node, data) => {
    if (node === nodeId || neighbors.includes(node)) return data;
    return { ...data, color: isLight.value ? "#e2e8f0" : "#334155", label: "", alpha: 0.2 };
  });

  sigmaInstance.setSetting("edgeReducer", (edge, data) => {
    if (graph.hasExtremity(edge, nodeId)) return data;
    return { ...data, hidden: true };
  });
};

const resetView = () => {
  filters.theme = '';
  filters.type = '';
  searchQuery.value = '';
  updateChart();
};

// Watch for filter changes and refresh Sigma (using the reducer)
watch(filters, () => {
  sigmaInstance?.refresh();
});

// Watch for theme change to update edge colors and refresh sigma
watch(isLight, () => {
  graph.updateEachEdgeAttributes((edge, attr) => {
    return { ...attr, color: isLight.value ? '#cbd5e1' : '#475569' };
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
  height: 100vh;
  background: #0f172a;
  color: white;
  transition: background 0.3s ease, color 0.3s ease;
}

.kg-wrapper.is-light {
  background: #f8fafc;
  color: #1e293b;
}

.kg-toolbar {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: rgba(30, 41, 59, 0.8);
  backdrop-filter: blur(10px);
  z-index: 10;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.kg-wrapper.is-light .kg-toolbar {
  background: rgba(241, 245, 249, 0.8);
  border-bottom: 1px solid #e2e8f0;
}

.search-box {
  display: flex;
  background: #334155;
  border-radius: 8px;
  overflow: hidden;
  flex: 1;
  max-width: 400px;
}

.kg-wrapper.is-light .search-box {
  background: #fff;
  border: 1px solid #e2e8f0;
}

.search-box input {
  background: transparent;
  border: none;
  padding: 0.5rem 1rem;
  color: white;
  flex: 1;
  outline: none;
}

.kg-wrapper.is-light .search-box input {
  color: #1e293b;
}

.btn-search {
  background: #3b82f6;
  border: none;
  padding: 0 1rem;
  cursor: pointer;
  color: white;
}

.filters {
  display: flex;
  gap: 0.5rem;
}

.filters select {
  background: #334155;
  color: white;
  border: none;
  padding: 0 0.75rem;
  border-radius: 8px;
  outline: none;
}

.kg-wrapper.is-light .filters select {
  background: #fff;
  color: #1e293b;
  border: 1px solid #e2e8f0;
}

.btn-icon {
  background: #334155;
  color: white;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
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
  background: rgba(30, 41, 59, 0.9);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.3);
  color: white;
}

.kg-wrapper.is-light .panel {
  background: rgba(255, 255, 255, 0.9);
  border-color: #e2e8f0;
  color: #1e293b;
}

.stats-panel {
  top: 1rem;
  left: 1rem;
  width: 220px;
}

.detail-panel {
  top: 1rem;
  right: 1rem;
  width: 320px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  margin-top: 0.5rem;
  font-size: 0.9rem;
}

.kg-wrapper.is-light .stat-item .label {
  color: #64748b;
}

.type-tag {
  font-size: 0.7rem;
  padding: 2px 8px;
  border-radius: 4px;
  text-transform: uppercase;
  font-weight: bold;
}

.type-tag.researcher { background: #10b981; }
.type-tag.group { background: #3b82f6; }
.type-tag.mou { background: #f59e0b; }

.tag {
  display: inline-block;
  background: rgba(255,255,255,0.1);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.8rem;
  margin-right: 4px;
}
</style>