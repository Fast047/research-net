<template>
  <div class="relative w-full max-w-2xl mx-auto">
    <!-- Search Input Group -->
    <div class="relative group">
      <div class="absolute inset-y-0 left-5 flex items-center pointer-events-none">
        <Icon name="ph:magnifying-glass-bold" 
              class="text-xl transition-colors"
              :class="[
                isExpanded ? 'text-blue-500' : 'text-slate-400',
                isLight ? 'group-hover:text-slate-600' : 'group-hover:text-slate-200'
              ]" />
      </div>
      
      <input
        ref="searchInput"
        v-model="searchQuery"
        type="text"
        placeholder="Search researchers, clusters, or patterns (e.g. 'AI in Health')..."
        class="w-full pl-14 pr-24 py-4 rounded-2xl border-2 transition-all duration-300 outline-none font-medium"
        :class="[
          isLight 
            ? 'bg-white border-slate-100 focus:border-blue-500 shadow-sm focus:shadow-blue-500/10' 
            : 'bg-slate-900 border-slate-800 focus:border-blue-500 text-white placeholder:text-slate-600',
          isExpanded && (suggestions.length > 0 || searchQuery.length > 0) ? 'rounded-b-none' : ''
        ]"
        @focus="isExpanded = true"
        @blur="handleBlur"
        @keydown.down.prevent="moveSelection(1)"
        @keydown.up.prevent="moveSelection(-1)"
        @keydown.enter="selectActiveItem"
        @keydown.esc="isExpanded = false"
      />

      <div class="absolute inset-y-2 right-2 flex items-center gap-2">
        <div v-if="searchQuery" 
             @click="searchQuery = ''"
             class="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer text-slate-400 transition-colors">
          <Icon name="ph:x-bold" />
        </div>
        <div class="hidden md:flex items-center gap-1 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-[10px] font-black text-slate-400">
          <span class="text-xs">⌘</span> K
        </div>
      </div>
    </div>

    <!-- Suggestions Dropdown -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="translate-y-1 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-1 opacity-0"
    >
      <div v-if="isExpanded && (suggestions.length > 0 || searchQuery.length > 0)"
           class="absolute top-full left-0 right-0 z-50 mt-px border-x-2 border-b-2 rounded-b-2xl shadow-2xl overflow-hidden"
           :class="isLight ? 'bg-white border-slate-100' : 'bg-slate-900 border-slate-800'">
        
        <div class="max-h-[400px] overflow-y-auto">
          <!-- NLP Pattern Detected Hint -->
          <div v-if="nlpPattern" 
               class="px-5 py-2 text-[9px] font-black uppercase tracking-[0.2em] bg-blue-500/10 text-blue-500 flex items-center gap-2">
            <Icon name="ph:sparkle-fill" class="animate-pulse" />
            {{ nlpPattern }} Detected
          </div>

          <!-- Empty State -->
          <div v-if="searchQuery.length > 0 && suggestions.length === 0" class="p-8 text-center">
            <Icon name="ph:robot-bold" class="text-4xl text-slate-300 mb-2" />
            <div class="text-sm font-bold text-slate-400">No direct matches found.</div>
            <p class="text-xs text-slate-500 mt-1">Try searching for themes like "AI", "Biotech" or institutions.</p>
          </div>

          <div v-else class="py-2">
            <div v-for="(item, idx) in suggestions" 
                 :key="idx"
                 @mousedown="handleSelect(item)"
                 @mouseenter="selectedIndex = idx"
                 class="px-5 py-3 flex items-center gap-4 cursor-pointer group transition-colors"
                 :class="[
                   selectedIndex === idx ? 'bg-blue-500/10' : 'hover:bg-blue-500/5'
                 ]">
              <div class="w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-transform group-hover:scale-110"
                   :style="item.color ? { backgroundColor: item.color + '15', color: item.color } : {}"
                   :class="!item.color ? (isLight ? 'bg-slate-100 text-slate-500' : 'bg-slate-800 text-slate-400') : ''">
                <Icon :name="item.icon" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="text-sm font-bold truncate" :class="isLight ? 'text-slate-800' : 'text-slate-100'">
                  {{ item.title }}
                </div>
                <div class="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                  {{ item.subtitle }}
                </div>
              </div>
              <Icon 
                name="ph:caret-right-bold" 
                class="text-slate-300 transition-all"
                :class="selectedIndex === idx ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'" 
              />
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-5 py-3 border-t flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/20"
             :class="isLight ? 'border-slate-100' : 'border-slate-800'">
          <div class="flex items-center gap-3">
             <div class="flex items-center gap-1">
               <span class="px-1.5 py-0.5 rounded border bg-white dark:bg-slate-900 text-[9px] font-bold text-slate-400">↵</span>
               <span class="text-[9px] font-bold text-slate-400 uppercase">Select</span>
             </div>
          </div>
          <div class="text-[9px] font-black text-blue-500 uppercase tracking-widest">
            Graph-Aware Engine
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { RESEARCHERS, MOUS } from '../utils/mockData';
import { TI, TN, TC } from '../utils';

const emit = defineEmits(['select']);
const { isLight } = useTheme();
const searchQuery = ref('');
const isExpanded = ref(false);
const selectedIndex = ref(0);
const searchInput = ref<HTMLInputElement | null>(null);

const nlpPattern = computed(() => {
  const q = searchQuery.value.toLowerCase();
  if (q.includes(' in ') || q.includes(' with ')) return 'Cross-Disciplinary';
  if (q.includes('expert') || q.includes('prof')) return 'Expertise Search';
  return null;
});

const suggestions = computed(() => {
  // Reset selection when typing
  selectedIndex.value = 0;
  if (searchQuery.value.length < 2) return [];
  const q = searchQuery.value.toLowerCase();
   
  const researchers = RESEARCHERS.filter(r => r.name.toLowerCase().includes(q) || r.inst.toLowerCase().includes(q))
    .slice(0, 3).map(r => ({ title: r.name, subtitle: r.inst, icon: 'ph:user-bold', type: 'researcher', color: undefined }));

  const institutions = Array.from(new Set(MOUS.map(m => m.inst)))
    .filter(inst => inst.toLowerCase().includes(q))
    .slice(0, 2).map(inst => ({ title: inst, subtitle: 'Research Partner', icon: 'ph:buildings-bold', type: 'institution', color: undefined }));

  const themes = ['AI', 'Health', 'Energy', 'Env', 'Agri', 'Social', 'Nano', 'Quantum']
    .filter(t => TN(t).toLowerCase().includes(q) || t.toLowerCase().includes(q))
    .map(t => ({ title: TN(t), subtitle: 'Research Theme', icon: TI(t), color: TC(t), type: 'theme' }));

  return [...researchers, ...institutions, ...themes];
});

const handleBlur = () => {
  // ใช้ timeout เพื่อให้ click event ใน dropdown ทำงานก่อนที่จะหายไป
  setTimeout(() => {
    isExpanded.value = false;
  }, 200);
};

const handleSelect = (item: any) => {
  searchQuery.value = item.title;
  isExpanded.value = false;
  emit('select', item);
  console.log('Selected:', item);
};

const moveSelection = (direction: number) => {
  if (suggestions.value.length === 0) return;
  const next = selectedIndex.value + direction;
  if (next >= 0 && next < suggestions.value.length) {
    selectedIndex.value = next;
  }
};

const selectActiveItem = () => {
  if (suggestions.value[selectedIndex.value]) {
    handleSelect(suggestions.value[selectedIndex.value]);
  }
};

// Global Shortcut ⌘K or Ctrl+K
const handleGlobalKeyDown = (e: KeyboardEvent) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    searchInput.value?.focus();
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleGlobalKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalKeyDown);
});
</script>