<template>
  <div>
    <div class="flex flex-wrap gap-3 items-end p-4 rounded-t-xl border border-slate-100" style="background: var(--color-card);">
      <div class="flex flex-col gap-1.5">
        <label class="text-[10px] font-bold uppercase text-slate-500 ml-1">ค้นหา</label>
        <InputText v-model="filterCond.keywords" type="text" placeholder="ค้นหานักวิจัย..." class="w-92" size="small"  />
      </div>
      <div class="flex flex-col gap-1.5">
        <label class="text-[10px] font-bold uppercase text-slate-500 ml-1">Theme</label>
        <Select v-model="filterCond.theme" :options="opts.themes" optionLabel="label" optionValue="value" placeholder="เลือก Theme" class="w-48" size="small" />
      </div>
      
      <div class="flex flex-col gap-1.5">
        <label class="text-[10px] font-bold uppercase text-slate-500 ml-1">Group</label>
        <Select v-model="filterCond.group" :options="opts.groups" optionLabel="label" optionValue="value" placeholder="เลือก Group" class="w-40" size="small" />
      </div>
    </div>
    <TableData :data-table="dataTable" :is-header="false" :search="filterCond.keywords" :is-selection-mode="'single'"
      data-key="id"
      :tab-option="{ class:'baseTable-customers baseTable-header-none baseTable-border-none' }"
      @row-select="onSelected">
      <Column field="name" header="ชื่อ" headerStyle="font-size: 14px;" body-class="font-semibold" />
      <Column field="group.short" header="กลุ่มวิจัย" headerStyle="font-size: 14px;">
        <template #body="{ data: { group } }">
          <span v-if="group" class="tag text-xs" :style="{ color: TC(group.theme), background: `${TC(group.theme)}12`}">
            {{ group.short }}
          </span>
        </template>
      </Column>
      <Column field="expertise_str" header="Expertise" header-class="uppercase" headerStyle="font-size: 14px;" bodyClass="truncate"/>      
      <Column field="hindex" header="H-Index" header-class="uppercase" headerStyle="font-size: 14px;" bodyClass="mono text-emerald-400"/>
      <Column field="pubs" header="Publications" header-class="uppercase" headerStyle="font-size: 14px;" bodyClass="mono"/>
      <Column field="exp_score" header="Exp Score" header-class="uppercase" headerStyle="font-size: 14px;">
        <template #body="{ data }">
          <div class="flex items-center gap-1.5">
            <div class="strack w-15">
              <div class="sfill" :style="{ background: data.exp_score>=85 ? 'var(--em)' : data.exp_score>=70 ? 'var(--c)':'var(--am)', width: `${data?.exp_score ?? 0}%`}"></div>
            </div>
            <span class="mono" :style="{ color:data.exp_score>=85 ?'var(--em)': data.exp_score>=70 ? 'var(--c)' : 'var(--am)'}">{{ data?.exp_score ?? 0}}</span>
          </div>
        </template>
      </Column>
      <Column field="collabs" header="Collab" header-class="uppercase" headerStyle="font-size: 14px;" bodyClass="mono"/>
    </TableData>
    <Drawer v-model:visible="visibleRight" position="right" style="width: 370px">
      <template #header>
        <div class="flex flex-col">
          <div class="text-base font-bold">
            {{ selectedItem.name }}
          </div>
          <div class="text-[11px]">
            {{ selectedItem.group?.name ?? '' }}
          </div>
        </div>
      </template>
      <div class="space-y-4">
        <div class="flex flex-col gap-3">
          <div class="text-[10px] font-bold uppercase text-slate-500 leading-6 border-b border-slate-200">
            Profile
          </div>
          <div class="flex flex-col gap-2">
            <div class="flex items-center justify-between text-xs">
              <div style="color: var(--color-t3)" >สถาบัน</div>
              <div class="font-bold">
                {{ selectedItem.inst }}
              </div>
            </div>
            <div class="flex items-center justify-between text-xs">
              <div style="color: var(--color-t3)">กลุ่มวิจัย</div>
              <div class="font-bold">
                {{ selectedItem?.group?.short ?? '-' }}
              </div>
            </div>
            <div class="flex items-center justify-between text-xs">
              <div style="color: var(--color-t3)">H-Index</div>
              <div class="font-bold mono text-emerald-400">
                {{ selectedItem?.hindex ?? '-' }}
              </div>
            </div>
            <div class="flex items-center justify-between text-xs">
              <div style="color: var(--color-t3)">Publications</div>
              <div class="font-bold mono">
                {{ selectedItem?.pubs ?? '-' }}
              </div>
            </div>
            <div class="flex items-center justify-between text-xs">
              <div style="color: var(--color-t3)">Projects</div>
              <div class="font-bold mono">
                {{ selectedItem?.projects ?? '-' }}
              </div>
            </div>
            <div class="flex items-center justify-between text-xs">
              <div style="color: var(--color-t3)">Experience Score</div>
              <div class="font-bold mono text-emerald-400 text-[14px]">
                {{ selectedItem?.exp_score ?? '-' }}
              </div>
            </div>
            <div class="flex items-center justify-between text-xs">
              <div style="color: var(--color-t3)">Collaborators</div>
              <div class="font-bold mono">
                {{ selectedItem?.collabs ?? '0' }} คน
              </div>
            </div>
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <div class="text-[10px] font-bold uppercase text-slate-500 leading-6 border-b border-slate-200">
            Theme Alignment Scores
          </div>
          <div class="flex flex-col gap-3">
            <div v-for="(value, key, index) in selectedItem?.score_by_theme" :key="key">
              <div class="flex justify-between text-[11px] mb-0.75">
                <span style="color:var(--color-t2)">{{ TN(key.toString()) }}</span>
                <span class="mono font-semibold" :style="{ color: TC(key.toString())}">{{value ?? 0}}%</span>
              </div>
              <div class="strack">
                <div class="sfill" :style="{ background: TC(key.toString()), width: `${value}%` }"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <div class="text-[10px] font-bold uppercase text-slate-500 leading-6 border-b border-slate-200">
            Expertise
          </div>
          <div class="flex flex-wrap gap-1">
            <span  v-for="item in selectedItem.expertise" :key="item.id" class="tag" style="background:var(--c-d);color:var(--c)">
              {{ item }}
            </span>
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <div class="text-[10px] font-bold uppercase text-slate-500 leading-6 border-b border-slate-200">
            Featured Works {{ selectedItem?.works?.length > 0 ? `(${selectedItem.works.length})` : '' }}
          </div>
          <div class="flex flex-col">
            <div v-for="item in selectedItem.works" :key="item.id"  style="background:var(--color-bg2); border-radius:var(--r6); padding:8px; margin-bottom:5px; font-size:11px">
              <div style="color:var(--color-t0);font-weight:700">{{ item?.title ?? '' }}</div>
              <div class="mt-0.5" style="color:var(--am);font-weight:600">{{ item?.award ?? '' }}</div>
              <div style="color:var(--color-t3)">
                {{ item?.year ?? '' }} · IF {{item?.impact ?? 0 }} · {{ item?.citations ??  0}} cit. 
              </div>
            </div>
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <div class="text-[10px] font-bold uppercase text-slate-500 leading-6 border-b border-slate-200">
            MOU Experience {{ selectedItem?.hist?.length > 0 ? `(${selectedItem.hist.length})` : '' }}
          </div>
          <div class="flex flex-col">
            <div v-for="item in selectedItem.hist" :key="item.id"  style="background:var(--color-bg2); border-radius:var(--r6); padding:8px; margin-bottom:5px; font-size:11px">
              <div style="color:var(--color-t0);font-weight:600">{{ item?.mou?.flag ?? '' }} {{ item?.mou?.inst ?? '' }}</div>
              <div style="color:var(--color-t3)">
                {{ item?.role ? `${item?.role} · `  :'' }}{{ item?.year ? `${item?.year}` : '' }}{{ item?.output ? ` · ${item.output}` : ''  }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Drawer>
  </div>
</template>

<script lang="ts" setup>
import { clone } from 'lodash-es';

const filterCond = ref({
  keywords: '',
  theme: '',
  group: '',
});
const visibleRight = ref(false);
const selectedItem = ref<any>(null);

const opts = computed(() =>{  
  const themelist = Object.keys(THEMES).map((k)=> ({ value: k, label: k }));
  const grouplist = GROUPS.map(g => ({ value: g.id, label: g.short}))
  
  const status = [
    { value: '', label: 'ทุกสถานะ'},
    { value: 'active', label: 'active' },
    { value: 'planning', label: 'planning' },
    { value: 'done', label: 'done' },
    { value: 'paused', label: 'paused' },
  ]
  return {
    themes: [{ value: '', label: 'ทุก Theme'}].concat(themelist),
    groups: [{ value: '', label: 'ทุก Group'}].concat(grouplist),
  }
});

const dataTable = computed(() => {
  const { theme, group } = filterCond.value;

  const items = clone(RESEARCHERS).map(r => {
    const group = GROUPS.find(g => g.id === r.group) ?? null
    return {
      ...r,
      group,
      expertise_str: r.expertise.join(','),
      collabs: r?.collab_ids?.length ?? 0
    }
  });

  return items.filter(item => {
    const matchTheme = !theme || (item.group && item.group.theme === theme);
    const matchGroup = !group || item.group?.id === group;
    return matchTheme && matchGroup;
  });
});

const onSelected = (val:any) => {
  visibleRight.value = true;
  if(val?.id) {
    const works= val.works.map((w:any) => {
     return WORKS.find(r => r.id === w);
    })
    const hist= HISTORY.filter(h=> h.researcher_id=== val.id)?.map((h)=> {
      const mou = MOUS.find(m => m.id === h.mou_id)
        return {
          ...h,
          mou
        }
    });
    selectedItem.value = {
      ...val,
      hist,
      expertise: Array.isArray(val.expertise) ? val.expertise : (val.expertise_str?.split(',') ?? []),
      works
    }
  }
}
</script>

<style>

</style>