<template>
<div>
    <div class="transition-all duration-300 ease-in-out transform hidden sm:flex h-full">
        <aside class="sidebar" id="app-sidebar">
            <div class="flex h-full flex-col w-full wrap-break-word overflow-x-hidden columns-1">
                <div class="sb-section">
                    <div class="sb-label">
                        {{ role === 'admin' ? 'Administration' : 'Exploration' }}
                    </div>
                    <div v-for="items in roleNavItems" :items="items.id" class="sb-group">
                        <div class="sb-group-label">{{ items.name }}</div>
                        <div v-for="item in items.chiledren" :key="item.id" class="group/item space-y-1">
                            <div v-if="item.id === 'sep'" class="sb-div" />
                            <NuxtLink v-else :to="`${item.href}`" :id="`sb-${item.id}`" :class="[
                              isNavItemActive(pathname, item?.href ?? '')
                              ? 'sb-item on'
                              : 'sb-item'
                            ]">
                                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" stroke-width="1.4">
                                    <circle cx="6.5" cy="6.5" r="5" />
                                </svg>

                                <span class="sb-text">{{ item.label }}</span>

                                <span v-if="item.pip" :class="['sb-pip', item.pip.cls]">
                                    {{ item.pip.n }}
                                </span>
                            </NuxtLink>
                        </div>
                    </div>
                </div>
            </div>

            <div class=" sticky bottom-0 mt-auto whitespace-nowrap mb-4 transition duration-200 block">
                <div class="sb-foot">
                    ResearchNet OS v4.0<br>
                    <strong v-if="role === 'admin'" style="color: var(--am)">Admin Access</strong>
                    <strong v-else style="color: var(--c)">Viewer Mode</strong>
                    <br>
                    Schema: 8 entities · 14 relations
                </div>
            </div>
        </aside>
        <!-- <div class="relative mt-[calc(calc(90vh)-40px)]"></div> -->
    </div>
    <!-- <div :class="[ isSidebarExpanded ? 'w-[250px]' : 'w-[60px]' ,
     'transition-all duration-300 ease-in-out transform hidden sm:flex h-full bg-slate-200/50'  ]">
        <aside class="flex h-full flex-col w-full wrap-break-word overflow-x-hidden columns-1">
            <div class="relative pb-2 mt-4">
                <div class="flex flex-col space-y-1">
                    <div v-for="item in navTop" class="group/item space-y-1">
                        <NuxtLink v-if="item" v-ripple :to="item.href" :class="[
                    isNavItemActive(pathname, item.href)
                    ? 'text-black border-r-4 border-r-primary bg-slate-300'
                    : 'text-gray-950/70 group-hover/item:text-primary hover:bg-slate-200',
                    'flex items-center gap-1 px-6 py-3 text-sm md:text-base w-8rem font-medium cursor-pointer'
                ]">
                            <div class="flex items-center gap-2">
                                <Icon v-if="item.icon" :name="item.icon" class="text-[20px]" />
                                {{ item.name }}
                            </div>
                            <Icon v-if="item.children?.length > 0" name="material-symbols:keyboard-arrow-down-rounded" />
                        </NuxtLink>
                    </div>
                </div>
            </div>
            <div class=" sticky bottom-0 mt-auto whitespace-nowrap mb-4 transition duration-200 block">
                <div v-for="item in navBottom" class="space-y-1">
                    <NuxtLink v-if="item" v-ripple :to="item.href" :class="[
                    isNavItemActive(pathname, item.href)
                    ? 'text-black border-b-4 border-b-primary'
                    : 'text-gray-950/70 group-hover/item:text-primary',
                    'flex items-center gap-1 px-3 py-3 text-sm md:text-base w-8rem font-medium cursor-pointer'
                ]">
                        <div class="flex items-center gap-2">
                            <Icon v-if="item.icon" :name="item.icon" class="text-[20px]" />
                            {{ item.name }}
                        </div>
                        <Icon v-if="item.children?.length > 0" name="material-symbols:keyboard-arrow-down-rounded" />
                    </NuxtLink>
                </div>
            </div>
        </aside>
        <div class="relative mt-[calc(calc(90vh)-40px)]"></div>
    </div> -->
</div>
</template>

<script lang="ts" setup>
const route = useRoute();
const { role, navItems: roleNavItems } = useNavigation()
role.value = 'admin';
const pathname = computed(() => route.path);
const isSidebarExpanded = ref(true);
const isNavItemActive = (pathname: string, nav: string) => {
    // return pathname.includes(nav);
    return pathname === nav;
}
const navItems = ref < any[] > ([{
        name: 'หน้าหลัก',
        href: '/admin',
        icon: 'material-symbols:home-app-logo',
        active: pathname.value === '/admin',
        position: 'top',
    },
    {
        name: 'เครือข่ายวิจัย',
        href: '/admin/researchers',
        icon: 'material-symbols:network-node',
        active: isNavItemActive(pathname.value, '/admin/researchers'),
        position: 'top',
    },
    {
        name: 'ฐานข้อมูล',
        href: '/admin/databank',
        icon: 'material-symbols:database',
        active: isNavItemActive(pathname.value, '/admin/databank'),
        position: 'top',
    },
    {
        name: 'รายงาน',
        href: '/admin/reports',
        icon: 'material-symbols:insert-chart-rounded',
        active: isNavItemActive(pathname.value, '/admin/reports'),
        position: 'top',
    },
    // {
    //   name: 'ตั้งค่า ',
    //   href: '/admin/settings',
    //   icon: 'material-symbols:settings-b-roll',
    //   active: isNavItemActive(pathname.value, '/admin/settings'),
    //   position: 'top',
    // },
    // {
    //   name: 'ช่วยเหลือ',
    //   href: '/admin/settings',
    //   icon: 'material-symbols:help-rounded',
    //   active: isNavItemActive(pathname.value, '/admin/settings'),
    //   position: 'top',
    // },
    // {
    //   name: 'ออกจากระบบ',
    //   href: '/settings',
    //   icon: 'lucide:log-out',
    //   active: isNavItemActive(pathname.value, '/settings'),
    //   position: 'bottom',
    // },
]);

const navTop = computed(() => navItems.value.filter((item) => item.position === 'top'));
const navBottom = computed(() => navItems.value.filter((item) => item.position === 'bottom'));
</script>

<style scoped>
.sidebar {
    background: var(--color-surface);
    border-right: 1px solid var(--color-b1);
    display: flex;
    flex-direction: column;
    overflow-y: auto
}

.sb-section {
    padding: 14px 0 4px
}

.sb-group {
    padding: 12px 0 4px
}

.sb-group-label {
    font-size: 10px;
    font-weight: 700;
    color: var(--color-t4);
    text-transform: uppercase;
    letter-spacing: .08em;
    padding: 0 16px 6px
}

.sb-label {
    font-size: 9px;
    font-weight: 700;
    color: var(--color-t3);
    text-transform: uppercase;
    letter-spacing: .12em;
    padding: 0 14px 5px
}

.sb-item {
    display: flex;
    align-items: center;
    gap: 9px;
    padding: 8px 14px;
    font-size: 12px;
    color: var(--color-t2);
    cursor: pointer;
    transition: all .15s;
    border-left: 2px solid transparent;
    position: relative
}

.sb-item:hover {
    color: var(--color-t0);
    background: var(--b0)
}

.sb-item.on {
    color: var(--c);
    background: var(--c-d);
    border-left-color: var(--c);
    font-weight: 600
}

.sb-item svg {
    flex-shrink: 0;
    opacity: .6
}

.sb-item.on svg {
    opacity: 1
}

.sb-pip {
    margin-left: auto;
    font-size: 9px;
    font-family: var(--font-mono);
    padding: 1px 6px;
    border-radius: 99px;
    font-weight: 700
}

.sb-pip.cyan {
    background: var(--c-d);
    color: var(--c)
}

.sb-pip.green {
    background: var(--em-d);
    color: var(--em)
}

.sb-pip.red {
    background: var(--ro-d);
    color: var(--ro)
}

.sb-pip.amber {
    background: var(--am-d);
    color: var(--am)
}

.sb-div {
    height: 1px;
    background: var(--color-b0);
    margin: 6px 14px
}

.sb-foot {
    margin-top: auto;
    padding: 12px 14px;
    border-top: 1px solid var(--color-b0);
    font-size: 11px;
    color: var(--color-t3);
    line-height: 1.6
}
</style>
