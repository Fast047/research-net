<template>
    <main class="flex-1 flex flex-col w-full">
        <!-- Hero Section -->
        <section class="relative py-20 lg:py-32 overflow-hidden" id="pg-land1">
            <div class="container mx-auto px-6 min-h-[50vh] flex flex-col justify-center items-center">
                <div class="flex flex-col justify-center items-center w-full gap-8">
                    <h1 class="land-h1 text-[clamp(32px,5vw,64px)] text-center leading-tight">ระบบ<em>เครือข่ายวิจัย</em><br>เชิงรุก SOC CMU</h1>
                    <p class="land-sub text-center max-w-2xl text-lg opacity-90">ศูนย์กลางข้อมูลความร่วมมือวิจัย MOU ระหว่างสถาบัน นักวิจัย/กลุ่มวิจัย และหน่วยงานทั้งในและต่างประเทศ ด้วย AI-powered Matching & Visualization แบบ Real-time</p>
                    <div class="flex flex-col sm:flex-row gap-4 items-center justify-center">
                        <Button size="large" :pt="{
                            root: {
                                style: {
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    borderRadius: '12px',
                                    padding: '14px 32px'
                                },
                                class: 'font-semibold bg-primary/50'
                            }
                        }" 
                        style="animation: rise .6s .3s ease both"
                        @click.once="overView()">
                            🔍 ข้อมูลภาพรวม
                        </Button>
                        <Button outlined size="large" :pt="{
                            root: {
                                style: {
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    borderRadius: '12px',
                                    padding: '14px 32px'
                                },
                                class: 'font-semibold bg-primary/50'
                            }
                        }" 
                        style="animation: rise .6s .3s ease both"
                        @click.once="router.push('/login')">
                            🔐 เข้าสู่ระบบ
                        </Button>
                        <!-- <div class="role-card admin" onclick="enterApp('admin')">
                            <div class="rc-icon">🔑</div>
                            <div class="rc-title">Admin / Officer</div>
                            <div class="rc-sub">จัดการฐานข้อมูล เพิ่ม-แก้ไขข้อมูล ตรวจสอบ Data Integrity และรายงานระบบ</div>
                            <div class="rc-tags">
                                <span class="rc-tag" style="background:var(--am-d);color:var(--am)">Data Mgmt</span>
                                <span class="rc-tag" style="background:var(--em-d);color:var(--em)">Full Access</span>
                            </div>
                        </div>
                        <div class="role-card viewer" onclick="enterApp('viewer')">
                            <div class="rc-icon">🔭</div>
                            <div class="rc-title">Viewer / Researcher</div>
                            <div class="rc-sub">สำรวจเครือข่าย วิเคราะห์ MOU Feasibility และดูแผนที่ความสัมพันธ์แบบ Interactive</div>
                            <div class="rc-tags">
                                <span class="rc-tag" style="background:var(--c-d);color:var(--c)">Visual Map</span>
                                <span class="rc-tag" style="background:var(--vi-d);color:var(--vi)">Analytics</span>
                            </div>
                        </div> -->
                    </div>
                </div>
            </div>
            <!-- Stats Strip -->
            <div class="land-stats grid grid-cols-2 md:grid-cols-5 border-y border-[var(--color-b1)] bg-[var(--color-stats)] backdrop-blur-md">
                <div class="land-stat py-8 px-4 border-r border-[var(--color-b1)] last:border-none text-center"><div class="land-stat-val text-3xl font-bold" style="color: var(--color-p);">2,847</div><div class="land-stat-lbl text-[11px] uppercase tracking-wider opacity-60">นักวิจัย</div></div>
                <div class="land-stat py-8 px-4 border-r border-[var(--color-b1)] last:border-none text-center"><div class="land-stat-val text-3xl font-bold" style="color: var(--color-s);">186</div><div class="land-stat-lbl text-[11px] uppercase tracking-wider opacity-60">สถาบัน</div></div>
                <div class="land-stat py-8 px-4 border-r border-[var(--color-b1)] last:border-none text-center"><div class="land-stat-val text-3xl font-bold" style="color: var(--color-green);">634</div><div class="land-stat-lbl text-[11px] uppercase tracking-wider opacity-60">โครงการ</div></div>
                <div class="land-stat py-8 px-4 border-r border-[var(--color-b1)] last:border-none text-center"><div class="land-stat-val text-3xl font-bold" style="color: var(--color-violet);">48</div><div class="land-stat-lbl text-[11px] uppercase tracking-wider opacity-60">ประเทศ MOU</div></div>
                <div class="land-stat py-8 px-4 last:border-none text-center"><div class="land-stat-val text-3xl font-bold" style="color:var(--color-teal)">4.2B</div><div class="land-stat-lbl text-[11px] uppercase tracking-wider opacity-60">งบประมาณรวม (฿)</div></div>
            </div>
        </section>
        <section class="land-mou container mx-auto py-24 px-6" id="mou">
            <div class="section-label">● MOU INTERNATIONAL</div>
                <h2 class="section-title">ความร่วมมือนานาชาติ</h2>
                <p class="section-sub">MOU กับสถาบันชั้นนำทั่วโลก ครอบคลุม 48 ประเทศ</p>
                <div class="flex flex-col w-full h-fit">
                    <FlowMapForeign :isLight="true" width="100%" height="500px" />
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
                    <div class="mou-card"><div class="mou-flag">🇺🇸</div><div class="mou-info"><div class="mou-country">สหรัฐอเมริกา</div><div class="mou-count">28 ความร่วมมือ</div><div class="mou-bar"><div class="mou-bar-fill" style="width:95%"></div></div></div></div>
                    <div class="mou-card"><div class="mou-flag">🇯🇵</div><div class="mou-info"><div class="mou-country">ญี่ปุ่น</div><div class="mou-count">24 ความร่วมมือ</div><div class="mou-bar"><div class="mou-bar-fill" style="width:82%"></div></div></div></div>
                    <div class="mou-card"><div class="mou-flag">🇩🇪</div><div class="mou-info"><div class="mou-country">เยอรมนี</div><div class="mou-count">19 ความร่วมมือ</div><div class="mou-bar"><div class="mou-bar-fill" style="width:65%"></div></div></div></div>
                    <div class="mou-card"><div class="mou-flag">🇨🇳</div><div class="mou-info"><div class="mou-country">จีน</div><div class="mou-count">22 ความร่วมมือ</div><div class="mou-bar"><div class="mou-bar-fill" style="width:75%"></div></div></div></div>
                    <div class="mou-card"><div class="mou-flag">🇬🇧</div><div class="mou-info"><div class="mou-country">สหราชอาณาจักร</div><div class="mou-count">16 ความร่วมมือ</div><div class="mou-bar"><div class="mou-bar-fill" style="width:55%"></div></div></div></div>
                    <div class="mou-card"><div class="mou-flag">🇰🇷</div><div class="mou-info"><div class="mou-country">เกาหลีใต้</div><div class="mou-count">18 ความร่วมมือ</div><div class="mou-bar"><div class="mou-bar-fill" style="width:62%"></div></div></div></div>
                    <div class="mou-card"><div class="mou-flag">🇫🇷</div><div class="mou-info"><div class="mou-country">ฝรั่งเศส</div><div class="mou-count">12 ความร่วมมือ</div><div class="mou-bar"><div class="mou-bar-fill" style="width:42%"></div></div></div></div>
                    <div class="mou-card"><div class="mou-flag">🇸🇬</div><div class="mou-info"><div class="mou-country">สิงคโปร์</div><div class="mou-count">21 ความร่วมมือ</div><div class="mou-bar"><div class="mou-bar-fill" style="width:72%"></div></div></div></div>
            </div>
        </section>
        <section class="container mx-auto py-24 px-6" id="features">
            <div class="section-label">● FEATURES</div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
                <div class="feat-card p-8 bg-[var(--color-card)] border border-[var(--color-b1)] rounded-2xl hover:border-[var(--color-b2)] transition-all">
                    <div class="feat-icon" style="background:var(--color-p-dim)">🕸️</div>
                    <h3>Network Visualization</h3>
                    <p>แสดงความสัมพันธ์เชิงเครือข่ายระหว่างสถาบันด้วย Force-directed Graph พร้อม Interactive Exploration</p>
                </div>
                <div class="feat-card">
                    <div class="feat-icon" style="background:var(--color-s-dim)">🗺️</div>
                    <h3>Flow Map นานาชาติ</h3>
                    <p>แผนที่แสดงกระแสความร่วมมือ MOU ระหว่างไทยกับต่างประเทศ แบบ Choropleth และ Flow Lines</p>
                </div>
                <div class="feat-card">
                    <div class="feat-icon" style="background:var(--color-violet-dim)">📊</div>
                    <h3>Dashboard วิเคราะห์</h3>
                    <p>รายงานสถิติเชิงลึก แนวโน้มงบประมาณ สัดส่วนสาขา และตัวชี้วัดผลงานวิจัยระดับชาติ</p>
                </div>
                <div class="feat-card">
                    <div class="feat-icon" style="background:var(--color-green-dim)">🔐</div>
                    <h3>Role-based Access</h3>
                    <p>ระบบสิทธิ์การใช้งาน แบ่งระหว่าง Admin/Officer และ Viewer ด้วย Login ที่ปลอดภัย</p>
                </div>
                <div class="feat-card">
                    <div class="feat-icon" style="background:var(--color-teal-dim)">⚡</div>
                    <h3>Real-time Updates</h3>
                    <p>ข้อมูลอัปเดตแบบ Real-time รองรับการเพิ่ม แก้ไข และลบข้อมูลโครงการโดย Admin</p>
                </div>
                <div class="feat-card">
                    <div class="feat-icon" style="background:var(--color-red-dim)">📋</div>
                    <h3>รายงานและส่งออก</h3>
                    <p>สร้างรายงานสรุปผลงานวิจัย ส่งออกข้อมูลเป็น CSV/PDF และแชร์ Dashboard ได้ทันที</p>
                </div>
            </div>
        </section>
        <footer class="land-footer mt-auto py-10 border-t border-[var(--color-b1)] container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm opacity-60">
            <div>© 2568 ResearchNet — ระบบเครือข่ายความร่วมมือวิจัยเชิงรุก</div>
            <div style="display:flex;gap:20px">
                <span style="cursor:pointer" onclick="showPage('page-login')">เข้าสู่ระบบ Admin</span>
                <span style="cursor:pointer" onclick="loginAs('viewer')">ดูข้อมูล</span>
            </div>
        </footer>
    </main>
</template>

<script lang="ts" setup>
definePageMeta({
    title: 'ระบบเครือข่ายวิจัยเชิงรุก',
    layout: "main-layout",
});
const router = useRouter();
const { isLight, setDark, setLight } = useTheme();
if(isLight.value) setDark();
const overView = () => {
    if(!isLight.value) setLight();
    router.push('/admin/overview');
}
</script>

<style scoped>
/* STATS STRIP */
.land-stats{
    position:relative;
    display:flex;
    justify-content:center;
    gap:0;
    border-top:1px solid var(--color-b1);
    border-bottom:1px solid var(--color-b1);
    background: var(--color-stats);
    backdrop-filter:blur(12px);
    animation:slideUp .6s .4s ease both
}
.land-stat{
    flex:1;
    max-width:200px;
    padding:24px 20px;
    text-align:center;
    border-right:1px solid var(--color-b1)
}
.land-stat:last-child{
    border-right:none
}
.land-stat-val{
    font-family: var(--font-mono);
    font-size:32px;
    font-weight:600;
    color:var(--color-t0);
    line-height:1
}
.land-stat-lbl{
    font-size:11px;
    color:var(--color-t3);
    margin-top:5px;
    text-transform:uppercase;
    letter-spacing:.06em
}

.section-label {
    font-size: 11px;
    font-weight: 700;
    color: var(--color-p);
    letter-spacing: .1em;
    text-transform: uppercase;
    margin-bottom: 10px;
}

/* MOU PREVIEW */
.mou-grid{
    display:grid;
    grid-template-columns:repeat(4,1fr);
    gap:12px;
    margin-top:24px
}
.mou-card{
    background:var(--color-card);
    border:1px solid var(--color-b1);
    border-radius:var(--r12);
    padding:16px;
    display:flex;
    align-items:center;
    gap:12px;
    transition:border-color .2s
}
.mou-card:hover{
    border-color:var(--color-b2)
}
.mou-flag{
    font-size:24px;
    flex-shrink:0
}
.mou-info{
    overflow:hidden
}
.mou-country{
    font-size:13px;
    font-weight:600;
    color:var(--color-t0);
    white-space:nowrap;
    overflow:hidden;
    text-overflow:ellipsis
}
.mou-count{
    font-size:11px;
    color:var(--color-t3);
    margin-top:1px
}
.mou-bar{
    height:2px;
    background:var(--color-b1);
    border-radius:1px;
    margin-top:8px;
    overflow:hidden
}
.mou-bar-fill{
    height:100%;
    border-radius:1px;
    background:linear-gradient(90deg,var(--color-p),var(--color-s))
}
.land-features {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 16px;
    width: 100%
}

.feat-card {
    background: var(--color-card);
    border: 1px solid var(--color-b1);
    border-radius: var(--r16);
    padding: 24px;
    transition: all .25s;
    cursor: default
}

.feat-card:hover {
    border-color: var(--color-b2);
    transform: translateY(-3px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, .4)
}

.feat-icon {
    width: 44px;
    height: 44px;
    border-radius: var(--r12);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
    font-size: 20px
}

.feat-card h3 {
    font-family: var(--font-display);
    font-size: 15px;
    font-weight: 700;
    color: var(--t0);
    margin-bottom: 8px
}

.feat-card p {
    font-size: 13px;
    color: var(--color-t2);
    line-height: 1.7
}
</style>
