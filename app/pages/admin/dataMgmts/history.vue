<template>
<div class="scroll-pane space-y-6">
    <div class="ph">
        <div>
            <div class="ph-title">Historical Records</div>
            <div class="ph-sub">ประวัติการมีส่วนร่วมของนักวิจัยใน MOU/Projects (Experience Score Source)</div>
        </div>
    </div>

    <TableData :data-table="dataTable" :is-header="false" 
      :tab-option="{ class:'baseTable-customers baseTable-header-none baseTable-border-none' }">
      <Column field="researcher" header="Researcher" header-class="uppercase" body-class="font-semibold" header-style="font-size: 14px;" />
      <Column field="mou" header="MOU" header-class="uppercase" header-style="font-size: 14px;"/>
      <Column field="project" header="Project" header-class="uppercase" header-style="font-size: 14px;" />
      <Column field="role" header="Role" header-class="uppercase" header-style="font-size: 14px;">
        <template #body="{ data }">
          <span class="tag" style="background:var(--c-d); color:var(--c)">
            {{ data.role }}
          </span>
        </template>
      </Column>
      <Column field="year" header="Year" header-class="uppercase" header-style="font-size: 14px;"/>
      <Column field="output" header="Output" header-class="uppercase" header-style="font-size: 14px;"/>
      <Column field="citation_gain" header="Citations Gained" header-class="uppercase" header-style="font-size: 14px;" body-class="text-emerald-400" />
    </TableData>
</div>
</template>

<script lang="ts" setup>
const dataTable = computed(() => {
  return HISTORY.map(h => {
    const r = RESEARCHERS.find(x => x.id === h.researcher_id);
    const m = MOUS.find(x => x.id === h.mou_id);
    const p = PROJECTS.find(x => x.id === h.project_id);
    return {
      researcher: r?.name || '—',
      mou: m ? `${m.flag} ${m.inst}` : '—',
      project: p?.name || '—',
      role: h.role,
      year: h.year,
      output: h.output,
      citation_gain: h.citation_gain || '—'
    }
  });
});

</script>

<style>

</style>
