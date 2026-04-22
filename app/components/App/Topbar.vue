<template>
<header class="topbar">
    <div class="tb-logo">
        <div class="tb-logomark"><svg viewBox="0 0 18 18" fill="none" stroke="white" stroke-width="1.8">
                <circle cx="9" cy="9" r="3" />
                <circle cx="3" cy="4" r="1.8" opacity=".6" />
                <circle cx="15" cy="4" r="1.8" opacity=".6" />
                <circle cx="3" cy="14" r="1.8" opacity=".6" />
                <circle cx="15" cy="14" r="1.8" opacity=".6" />
                <line x1="9" y1="9" x2="3" y2="4" opacity=".4" />
                <line x1="9" y1="9" x2="15" y2="4" opacity=".4" />
                <line x1="9" y1="9" x2="3" y2="14" opacity=".4" />
                <line x1="9" y1="9" x2="15" y2="14" opacity=".4" /></svg></div>
        ResearchNet
    </div>
    <div class="tb-role uppercase" id="tb-role-badge" :class="role">
        {{ role }}
    </div>
    <div class="tb-sep"></div>
    <div class="tb-search">
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="5.5" cy="5.5" r="4" />
            <line x1="8.5" y1="8.5" x2="12" y2="12" /></svg>
        <input type="text" placeholder="ค้นหานักวิจัย กลุ่ม MOU หรือ Theme..." id="gsearch" oninput="doGlobalSearch(this.value)">
    </div>
    <div class="tb-pulse">
        <div class="pulse-dot"></div> Live
    </div>
    <div class="tb-right">
        <button @click="toggleTheme" id="theme-toggle" class="p-2 transition-colors">
            <svg v-if="!isLight" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>

            <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
        </button>
        <div class="tb-kpi"><strong id="hdr-r">18</strong> นักวิจัย</div>
        <div class="tb-kpi"><strong id="hdr-g">8</strong> กลุ่ม</div>
        <div class="tb-kpi"><strong id="hdr-m">10</strong> MOU</div>
        <div class="tb-kpi"><strong id="hdr-p">20</strong> โครงการ</div>
        <div style="width:1px;height:16px;background:var(--color-b1)"></div> 
        <Button variant="link" size="small" @click="router.replace('/')">
            ⏏ ออกจากระบบ
        </Button>
    </div>
</header>
</template>

<script lang="ts" setup>
const { isLight, toggleTheme } = useTheme();
const route = useRoute();
const router = useRouter();
useHead({
    bodyAttrs: {
        class: computed(() => isLight.value ? 'light-mode' : 'dark-mode')
    }
});
const role = computed(()=> {
    return route.query?.role || 'viewer';
})
</script>

<style scoped>
.topbar {
    grid-column: 1/-1;
    background: var(--color-surface);
    border-bottom: 1px solid var(--color-b1);
    display: flex;
    align-items: center;
    padding: 0 16px;
    gap: 10px;
    z-index: 200;
    position: relative
}

.topbar::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, var(--c-d), transparent)
}

.tb-logo {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 800;
    font-size: 14px;
    color: var(--color-t0);
    flex-shrink: 0;
    letter-spacing: -.02em
}

.tb-logomark {
    width: 28px;
    height: 28px;
    border-radius: 7px;
    background: linear-gradient(135deg, var(--c), #0055ff);
    display: flex;
    align-items: center;
    justify-content: center
}

.tb-logomark svg {
    width: 14px;
    height: 14px
}

.tb-role {
    font-size: 10px;
    font-family: var(--font-mono);
    font-weight: 600;
    padding: 2px 9px;
    border-radius: 99px;
    flex-shrink: 0
}

.tb-role.admin {
    background: var(--am-d);
    color: var(--am);
    border: 1px solid rgba(245, 166, 35, .25)
}

.tb-role.viewer {
    background: var(--c-d);
    color: var(--c);
    border: 1px solid rgba(0, 212, 255, .2)
}

.tb-sep {
    width: 1px;
    height: 20px;
    background: var(--color-b1)
}

.tb-search {
    flex: 1;
    max-width: 360px;
    position: relative
}

.tb-search input {
    width: 100%;
    background: var(--color-bg2);
    border: 1px solid var(--color-b1);
    border-radius: var(--r8);
    padding: 7px 12px 7px 32px;
    color: var(--color-t1);
    font-size: 13px;
    transition: all .2s
}

.tb-search input:focus {
    border-color: var(--c);
    box-shadow: 0 0 0 3px var(--c-d)
}

.tb-search svg {
    position: absolute;
    left: 9px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--color-t3)
}

.tb-pulse {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 11px;
    color: var(--color-t2);
    flex-shrink: 0
}
@keyframes blink {
    0%,
    100% {
        opacity: 1
    }

    50% {
        opacity: .3
    }
}
.pulse-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--em);
    animation: blink 2s infinite;
}

.tb-right {
    margin-left: auto;
    display: flex;
    gap: 8px;
    align-items: center
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
    flex-shrink: 0;
}
.tb-kpi strong {
    font-family: var(--font-mono);
    color: var(--c);
    font-size: 12px;
}
</style>
