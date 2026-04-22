// utils/mockData.ts
export const THEMES:any = {
  AI: { value:'AI', name: 'AI & Technology', icon: '🤖', color: '#00d4ff', mou_count: 18, researchers: 14, budget: 680 },
  Health: { value:'Health', name: 'Healthcare & Bio', icon: '🏥', color: '#00e5a0', mou_count: 22, researchers: 18, budget: 920 },
  Energy: { value:'Energy', name: 'Clean Energy', icon: '⚡', color: '#f5a623', mou_count: 12, researchers: 9, budget: 480 },
  Env: { value: 'Env', name: 'Environment', icon: '🌱', color: '#2dd4bf', mou_count: 14, researchers: 11, budget: 360 },
  Agri: { value: 'Agri',name: 'Smart Agriculture', icon: '🌾', color: '#84cc16', mou_count: 10, researchers: 8, budget: 280 },
  Social: { value: 'Social',name: 'Social Sciences', icon: '👥', color: '#a78bfa', mou_count: 8, researchers: 6, budget: 180 },
  Nano: { value: 'Nano', name: 'Nano & Materials', icon: '⚗️', color: '#ff4d6d', mou_count: 10, researchers: 8, budget: 320 },
  Quantum: { value: 'Quantum',name: 'Quantum & Physics', icon: '🔬', color: '#38bdf8', mou_count: 6, researchers: 5, budget: 420 }
};

export const GROUPS = [
  { id: 'G01', name: 'AI & Intelligent Systems Lab', short: 'AI-Lab', theme: 'AI', inst: 'จุฬาลงกรณ์มหาวิทยาลัย', lead: 'R01', members: ['R01', 'R02', 'R17'], expertise: ['Machine Learning', 'Computer Vision', 'NLP', 'Deep Learning', 'Robotics'], hindex: 42, pubs: 118, projects: 9, budget: 280, exp_score: 88, established: 2562, mou_ids: ['M01', 'M02', 'M03'] },
  { id: 'G02', name: 'Genomics & Precision Medicine', short: 'GenMed', theme: 'Health', inst: 'มหาวิทยาลัยมหิดล', lead: 'R03', members: ['R03', 'R04'], expertise: ['Genomics', 'Bioinformatics', 'Clinical Trials', 'Drug Discovery'], hindex: 58, pubs: 195, projects: 13, budget: 540, exp_score: 95, established: 2558, mou_ids: ['M06', 'M02'] },
  { id: 'G03', name: 'Clean Energy & Nanomaterials', short: 'CEN-Lab', theme: 'Nano', inst: 'สวทช.', lead: 'R05', members: ['R05', 'R06', 'R18'], expertise: ['Nanomaterials', 'Battery Technology', 'Solar Cells', 'Energy Storage'], hindex: 49, pubs: 168, projects: 10, budget: 480, exp_score: 91, established: 2560, mou_ids: ['M04', 'M05', 'M07'] },
  { id: 'G04', name: 'Biomedical & Vaccine Research', short: 'BiVac', theme: 'Health', inst: 'สถาบันวิจัยจุฬาภรณ์', lead: 'R07', members: ['R07', 'R08'], expertise: ['Vaccinology', 'Immunology', 'Drug Discovery', 'Cancer Biology'], hindex: 52, pubs: 142, projects: 8, budget: 390, exp_score: 90, established: 2555, mou_ids: ['M06'] },
  { id: 'G05', name: 'Quantum Computing & Physics', short: 'Q-Lab', theme: 'Quantum', inst: 'สวทช./NSTDA', lead: 'R09', members: ['R09', 'R10', 'R16'], expertise: ['Quantum Computing', 'Quantum Cryptography', 'Semiconductor', 'Photonics'], hindex: 38, pubs: 84, projects: 5, budget: 420, exp_score: 82, established: 2564, mou_ids: ['M01', 'M07'] },
  { id: 'G06', name: 'Smart Agriculture & IoT', short: 'AgriTech', theme: 'Agri', inst: 'มหาวิทยาลัยเกษตรศาสตร์', lead: 'R11', members: ['R11', 'R12'], expertise: ['Precision Farming', 'IoT Systems', 'Plant Genetics', 'Food Science'], hindex: 26, pubs: 67, projects: 6, budget: 220, exp_score: 74, established: 2561, mou_ids: ['M08', 'M10'] },
  { id: 'G07', name: 'Environmental & Climate Science', short: 'EcoLab', theme: 'Env', inst: 'มหาวิทยาลัยเชียงใหม่', lead: 'R13', members: ['R13', 'R14'], expertise: ['Climate Change', 'Carbon Capture', 'Remote Sensing', 'Ecology'], hindex: 30, pubs: 81, projects: 7, budget: 200, exp_score: 77, established: 2560, mou_ids: ['M09', 'M08'] },
  { id: 'G08', name: 'Social Innovation & Policy', short: 'SocLab', theme: 'Social', inst: 'มหาวิทยาลัยขอนแก่น', lead: 'R15', members: ['R15'], expertise: ['Social Policy', 'Digital Society', 'Health Systems', 'Community Research'], hindex: 20, pubs: 50, projects: 5, budget: 140, exp_score: 68, established: 2562, mou_ids: [] }
];

export const RESEARCHERS = [
  {id:'R01',name:'ผศ.ดร.พรรณี ศักดิ์เจริญ',   group:'G01',inst:'จุฬาฯ',hindex:34,pubs:94, projects:8, expertise:['Machine Learning','Computer Vision','Medical AI'],themes:['AI','Health'],score_by_theme:{AI:95,Health:72,Quantum:35,Nano:20},exp_score:88,collab_ids:['R03','R09'],works:['W01','W05']},
  {id:'R02',name:'ดร.สมศักดิ์ อัลกอริทึม',       group:'G01',inst:'จุฬาฯ',hindex:28,pubs:67, projects:6, expertise:['NLP','LLM','Thai Language AI'],themes:['AI'],score_by_theme:{AI:92,Social:58,Health:35},exp_score:80,collab_ids:['R09'],works:['W05']},
  {id:'R03',name:'ศ.ดร.ชนกนาถ พันธุกรรม',       group:'G02',inst:'มหิดล',hindex:52,pubs:168,projects:11,expertise:['Genomics','Bioinformatics','AI-Genomics'],themes:['Health','AI'],score_by_theme:{Health:98,AI:68,Nano:30},exp_score:95,collab_ids:['R01','R07'],works:['W02','W03']},
  {id:'R04',name:'รศ.ดร.สมชาย วิทยาสิทธิ์',     group:'G02',inst:'มหิดล',hindex:29,pubs:87, projects:9, expertise:['Virology','Vaccines','Epidemiology'],themes:['Health'],score_by_theme:{Health:94,Env:45,Social:50},exp_score:88,collab_ids:['R07','R08'],works:[]},
  {id:'R05',name:'ดร.วิทยา อัจฉริยะ',            group:'G03',inst:'สวทช.',hindex:44,pubs:142,projects:14,expertise:['Nanomaterials','Battery','Solar Cells'],themes:['Nano','Energy'],score_by_theme:{Nano:97,Energy:85,Env:60},exp_score:93,collab_ids:['R06','R09'],works:['W04','W11']},
  {id:'R06',name:'ดร.นิรันดร์ นาโน',             group:'G03',inst:'สวทช.',hindex:31,pubs:89, projects:8, expertise:['Composite Materials','Carbon Nanotube'],themes:['Nano'],score_by_theme:{Nano:90,Energy:70,Env:55},exp_score:84,collab_ids:['R05'],works:['W12']},
  {id:'R07',name:'ศ.ดร.นภา ชีวิตมีสุข',          group:'G04',inst:'สถาบันจุฬาภรณ์',hindex:48,pubs:128,projects:11,expertise:['Drug Discovery','Cancer','Pharmacology'],themes:['Health'],score_by_theme:{Health:97,Nano:62,AI:40},exp_score:91,collab_ids:['R03','R04'],works:['W06']},
  {id:'R08',name:'ดร.อมรรัตน์ วัคซีน',           group:'G04',inst:'สถาบันจุฬาภรณ์',hindex:24,pubs:61, projects:5, expertise:['Immunology','Vaccine Design'],themes:['Health'],score_by_theme:{Health:89,Social:40},exp_score:72,collab_ids:[],works:['W09']},
  {id:'R09',name:'ดร.พิชัย ภาษาศาสตร์',          group:'G05',inst:'NSTDA',hindex:29,pubs:78, projects:7, expertise:['Quantum Computing','Semiconductor'],themes:['Quantum','AI'],score_by_theme:{Quantum:91,AI:75,Nano:55},exp_score:82,collab_ids:['R01','R05','R16'],works:['W13','W15']},
  {id:'R10',name:'ดร.กวินท์ ควอนตัม',            group:'G05',inst:'NSTDA',hindex:22,pubs:54, projects:4, expertise:['Quantum Cryptography','Photonics'],themes:['Quantum'],score_by_theme:{Quantum:88,AI:60},exp_score:75,collab_ids:['R16'],works:[]},
  {id:'R11',name:'รศ.ดร.นงลักษณ์ พืชผล',        group:'G06',inst:'มหาวิทยาลัยเกษตรฯ',hindex:22,pubs:58, projects:6, expertise:['Smart Farming','IoT','Plant Genetics'],themes:['Agri','AI'],score_by_theme:{Agri:93,AI:65,Env:72},exp_score:76,collab_ids:['R13'],works:['W08','W14']},
  {id:'R12',name:'ดร.สิรินทร์ อาหารปลอดภัย',    group:'G06',inst:'มหาวิทยาลัยเกษตรฯ',hindex:18,pubs:42, projects:4, expertise:['Food Science','Food Safety'],themes:['Agri'],score_by_theme:{Agri:87,Health:60},exp_score:68,collab_ids:[],works:[]},
  {id:'R13',name:'รศ.ดร.ชัชวาล มนุษยชาติ',      group:'G07',inst:'มหาวิทยาลัยเชียงใหม่',hindex:27,pubs:71, projects:6, expertise:['Climate Change','Carbon','Ecology'],themes:['Env'],score_by_theme:{Env:93,Social:72,Agri:55},exp_score:79,collab_ids:['R11','R14'],works:['W10']},
  {id:'R14',name:'ดร.ประภาพร น้ำสะอาด',         group:'G07',inst:'มหาวิทยาลัยเชียงใหม่',hindex:19,pubs:47, projects:4, expertise:['Water Science','Remote Sensing'],themes:['Env'],score_by_theme:{Env:86,Agri:60},exp_score:70,collab_ids:['R13'],works:[]},
  {id:'R15',name:'รศ.วิมล น้ำใส',               group:'G08',inst:'มหาวิทยาลัยขอนแก่น',hindex:18,pubs:45, projects:5, expertise:['Health Policy','Telemedicine'],themes:['Social','Health'],score_by_theme:{Social:88,Health:76},exp_score:69,collab_ids:[],works:[]},
  {id:'R16',name:'Prof. James Chen',             group:'G05',inst:'MIT',hindex:61,pubs:312,projects:7, expertise:['Quantum ML','AI Systems','Physics'],themes:['Quantum','AI'],score_by_theme:{Quantum:96,AI:90,Nano:70},exp_score:96,collab_ids:['R09','R10'],works:['W07']},
  {id:'R17',name:'Dr. Kenji Tanaka',            group:'G01',inst:'Osaka University',hindex:41,pubs:137,projects:8, expertise:['Robotics','AI','Manufacturing'],themes:['AI'],score_by_theme:{AI:88,Nano:65,Energy:50},exp_score:84,collab_ids:['R01'],works:[]},
  {id:'R18',name:'ดร.อรุณ พลังชีวิต',           group:'G03',inst:'PTT Research',hindex:19,pubs:52, projects:6, expertise:['Bioenergy','Petroleum Chemistry'],themes:['Energy'],score_by_theme:{Energy:91,Env:68,Nano:45},exp_score:73,collab_ids:[],works:[]},
];
export const WORKS = [
  {id:'W01',type:'patent', title:'ระบบ AI วิเคราะห์ภาพทางการแพทย์',researcher:'R01',year:2566,impact:4.2,citations:142,award:'สิทธิบัตรไทย #AI-001',theme:'AI'},
  {id:'W02',type:'award',  title:'ASEAN Best Research Award 2566',researcher:'R03',year:2566,impact:5.0,citations:0,award:'ASEAN S&T Award',theme:'Health'},
  {id:'W03',type:'paper',  title:'Thai Genome Reference Panel 10K',researcher:'R03',year:2567,impact:8.4,citations:287,award:'Nature Genetics IF 38.1',theme:'Health'},
  {id:'W04',type:'patent', title:'Carbon Nanotube Battery Composite',researcher:'R05',year:2566,impact:6.1,citations:198,award:'PCT International Patent',theme:'Nano'},
  {id:'W05',type:'project',title:'Thai LLM — Large Language Model',researcher:'R02',year:2567,impact:4.8,citations:0,award:'ทุน NRF 78M',theme:'AI'},
  {id:'W06',type:'award',  title:'King Bhumibol Innovation Award',researcher:'R07',year:2565,impact:5.0,citations:0,award:'รางวัลวิจัยระดับชาติ',theme:'Health'},
  {id:'W07',type:'paper',  title:'Quantum Error Correction NISQ',researcher:'R16',year:2567,impact:9.2,citations:312,award:'Physical Review X IF 15.6',theme:'Quantum'},
  {id:'W08',type:'patent', title:'Smart Irrigation IoT + AI',researcher:'R11',year:2566,impact:3.8,citations:67,award:'สิทธิบัตรไทย + ASEAN',theme:'Agri'},
  {id:'W09',type:'project',title:'BIOTEC Dengue Vaccine Phase II',researcher:'R08',year:2567,impact:4.5,citations:0,award:'WHO + วช. 45M',theme:'Health'},
  {id:'W10',type:'paper',  title:'Net Zero Pathway Northern Thailand',researcher:'R13',year:2566,impact:5.3,citations:112,award:'Nature Sustainability IF 27.6',theme:'Env'},
  {id:'W11',type:'award',  title:'TRF Outstanding Research Award',researcher:'R05',year:2566,impact:5.0,citations:0,award:'สำนักงานการวิจัยแห่งชาติ',theme:'Nano'},
  {id:'W12',type:'patent', title:'Perovskite Solar Cell 28% Efficiency',researcher:'R06',year:2567,impact:7.8,citations:234,award:'PCT + US Patent Pending',theme:'Nano'},
  {id:'W13',type:'project',title:'Quantum Computing for Drug Discovery',researcher:'R09',year:2567,impact:5.0,citations:0,award:'NRF + MIT 250M',theme:'Quantum'},
  {id:'W14',type:'paper',  title:'CRISPR Malaria Resistance in Rice',researcher:'R11',year:2566,impact:6.7,citations:189,award:'PNAS IF 11.2',theme:'Agri'},
  {id:'W15',type:'award',  title:'NSTDA Researcher of the Year',researcher:'R09',year:2566,impact:5.0,citations:0,award:'สวทช. Best Researcher',theme:'Quantum'},
];

export const MOUS = [
  {id:'M01',flag:'🇺🇸',country:'USA',inst:'MIT',theme:'Quantum',desc:'Joint Quantum Computing Lab for Drug Discovery',budget:250,status:'active',matched_groups:['G05','G01'],year:2567,projects_count:3,exp_score:91},
  {id:'M02',flag:'🇺🇸',country:'USA',inst:'Stanford',theme:'AI',desc:'AI in Healthcare & Biomedical Research',budget:120,status:'active',matched_groups:['G01','G02'],year:2566,projects_count:4,exp_score:87},
  {id:'M03',flag:'🇯🇵',country:'Japan',inst:'Osaka Univ.',theme:'AI',desc:'Osaka-Thai Robotics & AI Hub',budget:180,status:'planning',matched_groups:['G01','G05'],year:2567,projects_count:2,exp_score:79},
  {id:'M04',flag:'🇩🇪',country:'Germany',inst:'TU Munich',theme:'Energy',desc:'Green Hydrogen & Clean Energy Research',budget:95,status:'active',matched_groups:['G03'],year:2566,projects_count:2,exp_score:82},
  {id:'M05',flag:'🇸🇬',country:'Singapore',inst:'A*STAR',theme:'Nano',desc:'Advanced Materials Joint Exchange',budget:88,status:'active',matched_groups:['G03'],year:2566,projects_count:2,exp_score:85},
  {id:'M06',flag:'🇬🇧',country:'UK',inst:'Oxford',theme:'Health',desc:'Precision Medicine & Vaccine Research',budget:140,status:'active',matched_groups:['G02','G04'],year:2565,projects_count:5,exp_score:92},
  {id:'M07',flag:'🇰🇷',country:'Korea',inst:'KAIST',theme:'Nano',desc:'Semiconductor & Quantum Joint Research',budget:110,status:'planning',matched_groups:['G03','G05'],year:2567,projects_count:1,exp_score:74},
  {id:'M08',flag:'🇨🇳',country:'China',inst:'PKU',theme:'Agri',desc:'Food Security & Smart Agriculture Alliance',budget:75,status:'active',matched_groups:['G06','G07'],year:2566,projects_count:3,exp_score:78},
  {id:'M09',flag:'🇫🇷',country:'France',inst:'CNRS',theme:'Env',desc:'Climate Change & Carbon Capture Research',budget:68,status:'active',matched_groups:['G07'],year:2565,projects_count:2,exp_score:80},
  {id:'M10',flag:'🇦🇺',country:'Australia',inst:'CSIRO',theme:'Agri',desc:'Aquaculture & Precision Agriculture Tech',budget:55,status:'active',matched_groups:['G06'],year:2566,projects_count:2,exp_score:75},
];
export const PROJECTS = [
  {id:'P01',name:'วัคซีนไข้เลือดออก Phase II',  inst:'มหิดล',field:'Health',type:'นานาชาติ',status:'active',year:'2567',budget:45,pi:'R04',desc:'DENV-1-4 Clinical Trial',mou_id:'M06',theme:'Health'},
  {id:'P02',name:'AI วิเคราะห์ภาพทางการแพทย์',inst:'จุฬาฯ',field:'AI',type:'ระดับชาติ',status:'active',year:'2567',budget:32.5,pi:'R01',desc:'X-ray/MRI Cancer Detection AI',mou_id:'M02',theme:'AI'},
  {id:'P03',name:'วัสดุนาโนกักเก็บพลังงาน',    inst:'สวทช.',field:'Nano',type:'นานาชาติ',status:'active',year:'2566',budget:67,pi:'R05',desc:'Li-S Battery Nanocomposite',mou_id:'M05',theme:'Nano'},
  {id:'P04',name:'เกษตรอัจฉริยะ IoT+Drone',     inst:'เกษตรฯ',field:'Agri',type:'อุตสาหกรรม',status:'planning',year:'2567',budget:28,pi:'R11',desc:'Precision Irrigation + Drone',mou_id:'M08',theme:'Agri'},
  {id:'P05',name:'ยาต้านมะเร็งตับจากสมุนไพร',  inst:'จุฬาภรณ์',field:'Health',type:'นานาชาติ',status:'active',year:'2565',budget:120,pi:'R07',desc:'Hepatocellular Carcinoma Drug',mou_id:'M06',theme:'Health'},
  {id:'P06',name:'พลังงานทดแทนชีวมวล',          inst:'PTT',field:'Energy',type:'อุตสาหกรรม',status:'done',year:'2565',budget:89.5,pi:'R18',desc:'Palm Oil Biodiesel',mou_id:'M04',theme:'Energy'},
  {id:'P07',name:'Smart Water Management',       inst:'วว.',field:'Env',type:'ระดับชาติ',status:'active',year:'2567',budget:38,pi:'R14',desc:'AI Precision Irrigation',mou_id:'M09',theme:'Env'},
  {id:'P08',name:'Quantum Computing Pharma',     inst:'NSTDA',field:'Quantum',type:'นานาชาติ',status:'planning',year:'2567',budget:250,pi:'R09',desc:'Drug Discovery via Quantum',mou_id:'M01',theme:'Quantum'},
  {id:'P09',name:'Thai LLM — NLP ภาษาไทย',      inst:'NSTDA',field:'AI',type:'ระดับชาติ',status:'active',year:'2567',budget:78,pi:'R02',desc:'Thai Large Language Model',mou_id:'M02',theme:'AI'},
  {id:'P10',name:'Osaka-Thai Robotics Hub',      inst:'NSTDA',field:'AI',type:'นานาชาติ',status:'planning',year:'2567',budget:180,pi:'R17',desc:'AI Robotics Industry 4.0',mou_id:'M03',theme:'AI'},
  {id:'P11',name:'Biosensor ตรวจโรค',            inst:'กวพ.',field:'Health',type:'ระดับชาติ',status:'active',year:'2566',budget:22,pi:'R08',desc:'10-Disease Point-of-Care',mou_id:null,theme:'Health'},
  {id:'P12',name:'Thai Genome Project Phase II', inst:'จุฬาฯ',field:'Health',type:'นานาชาติ',status:'active',year:'2567',budget:95,pi:'R03',desc:'10,000 Thai Genome Samples',mou_id:'M06',theme:'Health'},
  {id:'P13',name:'Net Zero ภาคเหนือ',            inst:'มช.',field:'Env',type:'ระดับชาติ',status:'active',year:'2566',budget:42,pi:'R13',desc:'Northern Thailand Net Zero',mou_id:'M09',theme:'Env'},
  {id:'P14',name:'Perovskite Solar Cell 28%',   inst:'สวทช.',field:'Nano',type:'นานาชาติ',status:'active',year:'2567',budget:62,pi:'R06',desc:'High Efficiency Solar Cell',mou_id:'M05',theme:'Nano'},
  {id:'P15',name:'Smart Grid ชนบท',              inst:'CPAC',field:'Energy',type:'อุตสาหกรรม',status:'planning',year:'2567',budget:44,pi:'R18',desc:'Solar Microgrid Remote Area',mou_id:'M04',theme:'Energy'},
  {id:'P16',name:'ASEAN Dengue Research',        inst:'มข.',field:'Health',type:'นานาชาติ',status:'paused',year:'2566',budget:31,pi:'R04',desc:'8-Country ASEAN Network',mou_id:'M06',theme:'Health'},
  {id:'P17',name:'CRISPR Rice Malaria Resist.',  inst:'เกษตรฯ',field:'Agri',type:'นานาชาติ',status:'active',year:'2566',budget:38,pi:'R11',desc:'Disease Resistant Rice CRISPR',mou_id:'M08',theme:'Agri'},
  {id:'P18',name:'Telemedicine ชนบทห่างไกล',    inst:'มข.',field:'Health',type:'ระดับชาติ',status:'active',year:'2567',budget:27,pi:'R15',desc:'Rural Healthcare Telemedicine',mou_id:null,theme:'Health'},
  {id:'P19',name:'Digital Society Impact Study', inst:'มช.',field:'Social',type:'ระดับชาติ',status:'active',year:'2566',budget:15,pi:'R13',desc:'Social Media Youth Behavior',mou_id:null,theme:'Social'},
  {id:'P20',name:'Quantum Cryptography System', inst:'NSTDA',field:'Quantum',type:'นานาชาติ',status:'planning',year:'2567',budget:88,pi:'R10',desc:'Quantum-Safe Encryption',mou_id:'M01',theme:'Quantum'},
];

export const HISTORY = [
  {id:'H01',researcher_id:'R03',mou_id:'M06',project_id:'P12',role:'PI',year:2566,output:'10K Genome Sequences',citation_gain:287},
  {id:'H02',researcher_id:'R01',mou_id:'M02',project_id:'P02',role:'PI',year:2566,output:'AI Model IF4.2',citation_gain:142},
  {id:'H03',researcher_id:'R05',mou_id:'M05',project_id:'P03',role:'PI',year:2566,output:'Patent PCT',citation_gain:198},
  {id:'H04',researcher_id:'R07',mou_id:'M06',project_id:'P05',role:'PI',year:2565,output:'Drug Candidate',citation_gain:210},
  {id:'H05',researcher_id:'R09',mou_id:'M01',project_id:'P08',role:'Co-PI',year:2567,output:'Quantum Circuit',citation_gain:0},
  {id:'H06',researcher_id:'R11',mou_id:'M08',project_id:'P17',role:'PI',year:2566,output:'CRISPR Rice Line',citation_gain:189},
  {id:'H07',researcher_id:'R13',mou_id:'M09',project_id:'P13',role:'PI',year:2566,output:'Net Zero Report',citation_gain:112},
  {id:'H08',researcher_id:'R16',mou_id:'M01',project_id:'P08',role:'Advisor',year:2567,output:'Quantum Algorithm',citation_gain:312},
];

export const useClusterAnalysis = () => {
  const clusters = computed(() => {
    const results:any[] = [];
    const seen = new Set<string>();

    RESEARCHERS.forEach(a => {
      RESEARCHERS.forEach(b => {
        // Ensure unique pairs and avoid self-comparison
        if (a.id >= b.id) return;
        const key = `${a.id}-${b.id}`;
        if (seen.has(key)) return;
        seen.add(key);

        // Skip if they already collaborate
        if ((a.collab_ids as string[]).includes(b.id)) return;

        // Shared Themes
        const shared = a.themes.filter(t => b.themes.includes(t));
        
        // Expertise Overlap (matching logic: check if keyword exists in both)
        const expOverlap = a.expertise.filter(e => 
          b.expertise.some(be => be.toLowerCase().includes(e.toLowerCase().split(' ')[0] || ''))
        ).length;

        // Criteria: Must share at least one theme and one expertise keyword
        if (shared.length > 0 && expOverlap > 0) {
          // Formula: (Overlap * 30) + (Themes * 20) + (Avg H-Index * 0.3)
          const potential = Math.round(
            (expOverlap * 30) + 
            (shared.length * 20) + 
            (((a.hindex + b.hindex) / 2) * 0.3)
          );

          results.push({
            a, b,
            shared,
            expOverlap,
            potential
          });
        }
      });
    });

    // Sort by highest potential and take top 8
    return results.sort((x, y) => y.potential - x.potential).slice(0, 8);
  });

  return { clusters };
};

/**
 * Calculates a granular match score for a researcher based on:
 * 1. Base theme score
 * 2. Keyword overlap (+7 each)
 * 3. Featured works in theme (+4 each)
 * 4. MOU History in theme (+6 each)
 */
export const matchScore = (r: any, themeId: string, kws: string[] = []) => {
  let s = r.score_by_theme[themeId] || 0;

  // 1. Keyword Overlap (+7 per match, case-insensitive)
  kws.forEach(kw => {
    r.expertise.forEach((e: string) => {
      if (e.toLowerCase().includes(kw.toLowerCase())) {
        s = Math.min(100, s + 7);
      }
    });
  });

  // 2. Featured Works in this Theme (+4 each)
  const works = WORKS.filter(w => w.researcher === r.id && w.theme === themeId);
  s = Math.min(100, s + works.length * 4);

  // 3. MOU History Match (+6 per historical MOU that matches themeId)
  const hist = HISTORY.filter(h => h.researcher_id === r.id);
  const mouHist = MOUS.filter(m => m.theme === themeId && hist.some(h => h.mou_id === m.id));
  s = Math.min(100, s + mouHist.length * 6);

  return {
    score: Math.round(s),
    expBonus: hist?.length ?? 0, // Total history count
    works: works?.length ?? 0,   // Themed works count
    mouExp: mouHist?.length ?? 0 // Themed MOU history count
  };
};

/**
 * Ranks researchers for the feasibility engine
 */
export const rankForTheme = (themeId: string, kws: string[] = [], n = 8) => {
  return RESEARCHERS.map(r => ({
    ...r,
    ...matchScore(r, themeId, kws)
  }))
  .sort((a, b) => b.score - a.score)
  .slice(0, n);
};