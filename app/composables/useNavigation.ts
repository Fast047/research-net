// composables/useNavigation.ts
export interface NavItem {
  groupId: string;
  id: string;
  icon?: string;
  label?: string;
  href?: string;
  pip?: { cls: string; n: string | number } | null;
}

export const useNavigation = () => {
  // Replace this with your actual auth/role logic
  const role = useState<'admin' | 'viewer'>('user-role', () => 'viewer')
  const GROUP_NAV = [
    { id: 'G01', name: 'ภาพรวม'},
    { id: 'G02', name: 'ข้อมูลพื้นฐาน'},
    { id: 'G03', name: 'วิเคราะห์ความสัมพันธ์'},
    { id: 'G04', name: 'อื่นๆ'},
  ]

  const ADMIN_NAV: NavItem[] = [
  { groupId: 'G01', id:'dashboard',icon:'⬛',label:'Admin Dashboard', href: '/admin/dashboard', pip:null},
  { groupId: 'G01', id:'overview',icon:'◻',label:'Overview Dashboard', href: '/admin/overview', pip:null},
  { groupId: 'G02', id:'data',icon:'🗄',label:'ฐานข้อมูลโครงการ',href: '/admin/dataMgmts', pip:{cls:'cyan',n: RESEARCHERS.length}},
  { groupId: 'G01', id:'dq',icon:'🔍',label:'Data Quality / Integrity', href: '/admin/data-quality', pip:{cls:'amber',n:'3 issues'}},
  { groupId: 'G01', id:'bulk',icon:'📤',label:'Bulk Upload / Import', href: '/admin/bulk', pip:null},
  { groupId: 'G01', id:'network',icon:'🕸',label:'Network Map', href: '/admin/network', pip:{cls:'green',n:'LIVE'}},
  { groupId: 'G03', id:'feasibility',icon:'⚡',label:'MOU Feasibility', href: '/admin/feasibility', pip: { cls:'red',n:'NEW'}},
  { groupId: 'G02', id:'researchers',icon:'👩‍🔬',label:'นักวิจัยและผู้เชี่ยวชาญ', href: '/admin/dataMgmts/researchers', pip:{cls:'cyan',n:RESEARCHERS.length}},
  { groupId: 'G02', id:'groups',icon:'🏛',label:'Research Groups', href: '/admin/dataMgmts/groups', pip:{cls:'cyan',n:GROUPS.length}},
  { groupId: 'G02', id:'works',icon:'🏆',label:'Featured Works', href: '/admin/dataMgmts/works', pip:{cls:'amber',n:WORKS.length}},
  { groupId: 'G02', id:'thematic',icon:'🗺',label:'Thematic Mapping', href: '/admin/dataMgmts/thematic', pip:null},
  { groupId: 'G03', id:'gap',icon:'📊',label:'Gap Analysis', href: '/admin/gap', pip:null},
  { groupId: 'G03', id:'cluster',icon:'🔗',label:'Cluster Analysis', href: '/admin/cluster', pip:null},
  { groupId: 'G03', id:'statistics',icon:'🔗',label:' สถิติ & วิเคราะห์', href: '/admin/analytics', pip:null},
  { groupId: 'G02', id:'history',icon:'📋',label:'Historical Records', href: '/admin/dataMgmts/history', pip:{cls:'cyan',n:HISTORY.length}},
]

  const VIEWER_NAV: NavItem[] = [
  { groupId: 'G01', id:'overview',icon:'◻',label:'Overview Dashboard', href: '/viewer/overview', pip:null},
  { groupId: 'G01', id:'network',icon:'🕸',label:'Interactive Network', href: '/viewer/network', pip:{cls:'green',n:'LIVE'}},
  { groupId: 'G01', id:'moumap',icon:'🗺',label:'MOU Flow Map', href: '/viewer/moumap', pip:null},
  // { groupId: 'G02', id:'thematic',icon:'🎯',label:'Thematic Explorer', href: '/viewer/thematic', pip:null},
  // { groupId: 'G03', id:'feasibility',icon:'⚡',label:'MOU Feasibility AI', href: '/viewer/feasibility',pip:{cls:'red',n:'NEW'}},
  // { groupId: 'G03', id:'cluster',icon:'🔗',label:'Collaboration Clusters', href: '/viewer/cluster', pip:null},
  // { groupId: 'G02', id:'groups',icon:'🏛',label:'Research Groups',href: '/viewer/dataMgmts/groups', pip:{cls:'cyan',n:GROUPS.length}},
  // { groupId: 'G02', id:'researchers',icon:'👩‍🔬',label:'นักวิจัย', href: '/viewer/dataMgmts/researchers', pip:{cls:'cyan',n:RESEARCHERS.length}},
  // { groupId: 'G02', id:'works',icon:'🏆',label:'Featured Works', href: '/viewer/dataMgmts/works', pip:{cls:'amber',n:WORKS.length}},
  ];

  const ADMIN_TABS=[{id:'dashboard',l:'Dashboard'},{id:'data',l:'Data Mgmt'},{id:'network',l:'Network'},{id:'feasibility',l:'Feasibility'},{id:'gap',l:'Gap'},{id:'cluster',l:'Clusters'}];
  const VIEWER_TABS=[{id:'overview',l:'Overview'},{id:'network',l:'Network Map'},{id:'moumap',l:'MOU Flow'},{id:'thematic',l:'Thematic'},{id:'feasibility',l:'MOU Feasibility ✦'},{id:'cluster',l:'Clusters'}];


  const navItems = computed(() => {
    if(role.value === 'admin') {
      return GROUP_NAV.map(group => ({
        ...group, chiledren: ADMIN_NAV.filter(item => item.groupId === group.id)})
      ).filter(group => group.chiledren.length > 0)
    } 
    return GROUP_NAV.map(group => ({
      ...group, chiledren: VIEWER_NAV.filter(item => item.groupId === group.id)})
    ).filter(group => group.chiledren.length > 0)
  })

  const tabItem = computed(() => {
    if(role.value === 'admin') {
      return ADMIN_TABS
    } 
    return VIEWER_TABS
  })

  return {
    role,
    navItems,
    tabItem
  }
}