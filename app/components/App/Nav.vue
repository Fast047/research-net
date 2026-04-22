<template>
<div>
    <nav class="land-nav">
        <div class="brand">
            <div class="brand-logo">
                <svg viewBox="0 0 26 26" fill="none" stroke="white" stroke-width="2">
                    <circle cx="13" cy="13" r="4.5" />
                    <circle cx="4" cy="6" r="2.5" opacity=".6" />
                    <circle cx="22" cy="6" r="2.5" opacity=".6" />
                    <circle cx="4" cy="20" r="2.5" opacity=".6" />
                    <circle cx="22" cy="20" r="2.5" opacity=".6" />
                    <line x1="13" y1="13" x2="4" y2="6" opacity=".4" />
                    <line x1="13" y1="13" x2="22" y2="6" opacity=".4" />
                    <line x1="13" y1="13" x2="4" y2="20" opacity=".4" />
                    <line x1="13" y1="13" x2="22" y2="20" opacity=".4" />
                </svg>
            </div>
            <div class="brand-name">ResearchNet</div>
        </div>
        <div class="land-nav-links"></div>
        <div class="land-nav-right">
          <button 
            @click="toggleTheme" 
            id="theme-toggle"
            class="p-2 transition-colors"
          >
            <svg v-if="!isLight" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
            
            <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          </button>
            <!-- <button class="theme-btn" id="theme-toggle" onclick="toggleTheme()" title="Switch Theme"></button> -->
        </div>
    </nav>
</div>
</template>

<script lang="ts" setup>
const { isLight, toggleTheme } = useTheme();
useHead({
  bodyAttrs: {
    class: computed(() => isLight.value ? 'light-mode' : 'dark-mode')
  }
});

</script>

<style scoped>
.land-nav {
    position: relative;
    z-index: 10;
    display: flex;
    align-items: center;
    padding: 20px 60px;
    border-bottom: 1px solid var(--color-b0)
}

.brand {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0
}

.brand-logo {
    width: 34px;
    height: 34px;
    border-radius: 10px;
    background: linear-gradient(135deg, var(--color-p), var(--color-p2));
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: var(--shadow-p-glow)
}

.brand-logo svg {
    width: 18px;
    height: 18px
}

.brand-name {
    font-size: 16px;
    font-weight: 800;
    letter-spacing: -.02em
}


.tb-right {
    margin-left: auto;
    display: flex;
    gap: 8px;
    align-items: center
}

.theme-btn {
    background: var(--color-bg2);
    border: 1px solid var(--color-b1);
    border-radius: var(--r6);
    padding: 0;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--t2);
    transition: all .15s
}

.theme-btn:hover {
    border-color: var(--c);
    color: var(--c)
}

.tb-kpi {
    background: var(--color-bg2);
    border: 1px solid var(--color-b1);
    border-radius: var(--r6);
    padding: 4px 10px;
    font-size: 11px;
    color: var(--color-t2);
    display: flex;
    align-items: center;
    gap: 5px;
    flex-shrink: 0
}

.tb-kpi strong {
    font-family: var(--font-mono);
    color: var(--c);
    font-size: 12px
}

.btn-exit {
    background: var(--color-bg2);
    border: 1px solid var(--color-b1);
    border-radius: var(--r6);
    padding: 6px 12px;
    font-size: 12px;
    color: var(--color-t2);
    transition: all .15s
}

.btn-exit:hover {
    border-color: var(--ro);
    color: var(--ro)
}
</style>
