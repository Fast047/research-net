<template>
  <div class="app-shell">
    <!-- Topbar -->
    <app-topbar />

    <!-- Sidebar -->
    <app-side-nav />

    <!-- Main -->
    <div class="main-area">
      
      <!-- Tabs -->
      <nav class="tab-strip">
        <NuxtLink 
          v-for="tab in currentTabs" 
          :key="tab.id" 
          :to="`${tab?.to ?? '/'}`" 
          class="ts-tab" 
          active-class="on">
          {{ tab.l }}
        </NuxtLink>
      </nav>

      <!-- Content -->
      <main class="content-area">
          <NuxtPage />
          <!-- <div class="page-scroll">
        </div> -->
      </main>

    </div>
  </div>
</template>

<script lang="ts" setup>
const { isLight } = useTheme();
useHead({
    bodyAttrs: {
        class: computed(() => isLight.value ? 'light-mode' : 'dark-mode')
    }
});
const { role } = useNavigation();
const ADMIN_TABS:any[] = [
    { id: 'dashboard', l: 'Dashboard', to: '/admin/overview'},
    { id: 'data', l: 'Data Management', to: '/admin/dataMgmts' },
    { id: 'network', l: 'Knowledge Graph' , to: '/admin/knowledge-graph' },
    { id: 'mouflow', l: 'MOU Flow' , to: '/admin/mouflow' },
    { id: 'feasibility', l: 'MOU Feasibility ✦' , to: '/admin/feasibility' },
    { id: 'gap', l: 'Skill Gap', to: '/admin/skill-gap' },
    { id: 'clusters', l: 'Clusters', to: '/admin/cluster' },
    { id: 'analytics', l: 'Graph Analytics', to: '/admin/graph-analytics' }
]

const VIEWER_TABS:any[] = [
    { id: 'overview', l: 'Overview' },
    { id: 'network', l: 'Network Map' },
    { id: 'thematic', l: 'Thematic' }
]

const currentTabs = computed(() => role.value === 'admin' ? ADMIN_TABS : VIEWER_TABS)
</script>

<style scoped>
/* ===== ROOT LAYOUT ===== */
.app-shell {
  display: grid;
  grid-template-columns: 220px 1fr;
  grid-template-rows: 52px 1fr;
  height: 100vh;
  overflow: hidden;
}

/* ===== MAIN AREA ===== */
.main-area {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
}

/* ===== TABS ===== */
.tab-strip {
  display: flex;
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-b1);
  padding: 0 16px;
  flex-shrink: 0;
}

.ts-tab {
  text-decoration: none;
  padding: 11px 12px;
  font-size: 12px;
  color: var(--color-t3);
  border-bottom: 2px solid transparent;
  font-weight: 500;
}

.ts-tab.on {
  color: var(--c);
  border-bottom-color: var(--c);
}

/* ===== CONTENT ===== */
.content-area {
  flex: 1;
  overflow-y: auto;
  min-height: 0;
}

/* ===== SCROLL AREA ===== */
.page-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  min-height: 0; /* 🔥 KEY FIX */
}
</style>