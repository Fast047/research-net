export const useDataQuality = () => {
  const dqMetrics = computed(() => [
    { t: 'Schema Completeness', s: 94, c: '#00e5a0', sub: '8/8 entities populated' },
    { t: 'Reference Integrity', s: 88, c: '#3b82f6', sub: 'Orphan records: 3' },
    { 
      t: 'Researcher Coverage', 
      s: Math.round(RESEARCHERS.length / 48 * 100), 
      c: '#f5a623', 
      sub: `${RESEARCHERS.length}/48 target researchers` 
    },
    { 
      t: 'MOU Linkage', 
      s: Math.round(PROJECTS.filter(p => p.mou_id).length / PROJECTS.length * 100), 
      c: '#a78bfa', 
      sub: `${PROJECTS.filter(p => p.mou_id).length}/${PROJECTS.length} linked` 
    },
    { 
      t: 'Historical Records', 
      s: Math.round(HISTORY.length / PROJECTS.length * 100), 
      c: '#2dd4bf', 
      sub: `${HISTORY.length}/${PROJECTS.length} projects` 
    },
    { t: 'Expertise Tags', s: 82, c: '#f5a623', sub: '120/146 tags assigned' }
  ]);

  const detectedIssues = computed(() => [
    {
      id: 1,
      type: 'error',
      icon: '❌',
      color: '#ff4d6d',
      msg: 'Missing PI assignment — 2 Projects',
      sub: 'P07 Smart Water, P11 Biosensor — ยังไม่มี Researcher เป็น PI',
      action: 'แก้ไข'
    },
    {
      id: 2,
      type: 'warning',
      icon: '⚠️',
      color: '#f5a623',
      msg: 'Orphan Projects (No MOU Linked) — 3 Projects',
      sub: 'P11, P18, P19 — ไม่มี MOU เชื่อมโยง อาจเป็นโครงการภายใน',
      action: 'ตรวจสอบ'
    },
    {
      id: 3,
      type: 'info',
      icon: 'ℹ️',
      color: '#a78bfa',
      msg: 'Stale Research Group — G08 SocLab',
      sub: 'G08 ไม่มี MOU ใหม่ตั้งแต่ปี 2562 — ควรตรวจสอบความ active',
      action: 'ดูข้อมูล'
    }
  ]);

  return { dqMetrics, detectedIssues };
}