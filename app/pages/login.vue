<template>
<div>
    <div class="page on" id="page-login">
        <div class="login-bg">
            <div class="login-grid"></div>
        </div>
        <div class="login-card">
            <div class="login-header">
                <div class="login-title">เข้าสู่ระบบ ResearchNet</div>
                <div class="login-sub">สำหรับ Admin และ Officer เท่านั้น</div>
            </div>

            <div class="form-group">
                <label class="form-label">อีเมล / ชื่อผู้ใช้</label>
                <input class="form-input" id="login-user" type="text" placeholder="admin@research.go.th" value="admin@research.go.th">
            </div>
            <div class="form-group">
                <label class="form-label">รหัสผ่าน</label>
                <input class="form-input" id="login-pass" type="password" placeholder="••••••••" value="••••••••">
            </div>
            <div class="login-opts">
                <label class="login-remember"><input type="checkbox" checked> จดจำการเข้าสู่ระบบ</label>
                <span class="login-forgot">ลืมรหัสผ่าน?</span>
            </div>
            <button class="btn-login cursor-pointer" @click="loginAs('admin')">เข้าสู่ระบบ →</button>

            <div class="login-divider">หรือทดลองใช้ด้วย Demo Account</div>

            <div class="demo-accounts">
                <button class="demo-btn cursor-pointer" @click="loginAs('admin')">
                    <div class="demo-av" style="background:var(--color-s-dim);color:var(--color-s-active)">A</div>
                    <div class="demo-info">
                        <div class="demo-name">System Admin</div>
                        <div class="demo-role">สิทธิ์เต็ม — จัดการฐานข้อมูล + วิเคราะห์</div>
                    </div>
                    <div class="demo-enter">เข้าใช้ →</div>
                </button>
                <button class="demo-btn cursor-pointer" @click="loginAs('officer')">
                    <div class="demo-av" style="background:var(--color-p-dim);color:var(--color-p2)">O</div>
                    <div class="demo-info">
                        <div class="demo-name">Research Officer</div>
                        <div class="demo-role">สิทธิ์เพิ่ม/แก้ไขข้อมูล — ไม่สามารถลบ</div>
                    </div>
                    <div class="demo-enter">เข้าใช้ →</div>
                </button>
                <button class="demo-btn cursor-pointer" @click="loginAs('viewer')">
                    <div class="demo-av" style="background:var(--color-violet-dim);color:var(--color-violet)">V</div>
                    <div class="demo-info">
                        <div class="demo-name">General Viewer</div>
                        <div class="demo-role">ดูข้อมูลภาพรวม — ไม่ต้อง Login</div>
                    </div>
                    <div class="demo-enter">เข้าใช้ →</div>
                </button>
            </div>

            <div class="login-back" @click="router.replace('/')">
                ← กลับหน้าแรก
            </div>
        </div>
    </div>
    <section class="hidden w-full h-dvh items-center justify-center bg-slate-100">
        <div class="flex h-fit min-w-lg flex-col justify-center rounded-3xl shadow-lg px-3 py-8 lg:px-4 bg-white">
            <div class="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 class="mt-10 text-center text-3xl/9 font-bold tracking-tight ">เข้าสู่ระบบ</h2>
            </div>
            <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <Button label="CMU Account (MS Entra ID)" variant="link" size="large" fluid class=" hover:bg-primary-100" />
                <Divider align="center">
                    <span class="text-sm text-gray-400">Or with username/email</span>
                </Divider>
                <form action="#" method="POST" class="space-y-6">
                    <div>
                        <label for="email" class="block text-sm/6 font-medium ">Username/Email</label>
                        <div class="mt-2">
                            <InputText id="email" type="email" name="email" variant="filled" fluid />
                        </div>
                    </div>
                    <div>
                        <div class="flex items-center justify-between">
                            <label for="password" class="block text-sm/6 font-medium">Password</label>
                        </div>
                        <div class="mt-2">
                            <Password :feedback="false" variant="filled" fluid />
                        </div>
                    </div>
                    <Button label="Sign in" type="submit" rounded size="large" fluid />
                </form>
            </div>
        </div>
    </section>
</div>
</template>

<script lang="ts" setup>
definePageMeta({
    title: 'ระบบฐานข้อมูลและแผนที่เครือข่ายความร่วมมือวิจัยเชิงรุก',
});
const { setLight } = useTheme()
const router = useRouter();
const loginAs = (role: string) => {
    setLight();
    setTimeout(() => {
        router.push({
            name: 'admin-dashboard',
            query: {
                role: role
            }
        })
    }, 300);
}
</script>

<style scoped>
#page-login {
    background: var(--color-void);
    align-items: center;
    justify-content: center
}

.login-bg {
    position: fixed;
    inset: 0;
    pointer-events: none
}

.login-bg::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 60% 70% at 30% 50%, rgba(6, 182, 212, .07) 0%, transparent 70%),
        radial-gradient(ellipse 50% 60% at 70% 50%, rgba(129, 140, 248, .06) 0%, transparent 70%)
}

.login-grid {
    position: absolute;
    inset: 0;
    background-image: linear-gradient(rgba(6, 182, 212, .03) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, .03) 1px, transparent 1px);
    background-size: 48px 48px
}

.login-card {
    position: relative;
    z-index: 5;
    width: 420px;
    background: #111c2e;
    border: 1px solid var(--color-b1);
    border-radius: var(--r24);
    padding: 40px;
    box-shadow: 0 32px 80px rgba(0, 0, 0, .6), var(--color-p-glow);
    animation: slideUp .5s ease both
}

.login-header {
    text-align: center;
    margin-bottom: 32px
}

.login-logo {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px
}

.login-logo .logo-mark {
    width: 44px;
    height: 44px;
    border-radius: 14px
}

.login-logo span {
    font-family: var(--font-display);
    font-size: 20px;
    font-weight: 800;
    color: var(--t0)
}

.login-title {
    font-family: var(--font-display);
    font-size: 22px;
    font-weight: 700;
    color: var(--t0);
    margin-bottom: 6px
}

.login-sub {
    font-size: 13px;
    color: var(--color-t2)
}

.role-tabs {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin-bottom: 24px;
    background: var(--color-bg2);
    border-radius: var(--r12);
    padding: 4px
}

.role-tab {
    padding: 10px;
    border-radius: var(--r8);
    font-size: 13px;
    font-weight: 600;
    color: var(--color-t2);
    transition: all .2s;
    text-align: center
}

.role-tab.active {
    background: var(--color-bg4);
    color: var(--color-t0);
    box-shadow: 0 2px 8px rgba(0, 0, 0, .3)
}

.form-group {
    margin-bottom: 16px
}

.form-label {
    display: block;
    font-size: 12px;
    font-weight: 600;
    color: var(--color-t2);
    margin-bottom: 7px;
    letter-spacing: .04em;
    text-transform: uppercase
}

.form-input {
    width: 100%;
    background: var(--color-bg2);
    border: 1px solid var(--color-b1);
    border-radius: var(--r8);
    padding: 11px 14px;
    color: var(--color-t0);
    font-size: 14px;
    transition: all .2s
}

.form-input:focus {
    border-color: var(--color-p);
    box-shadow: 0 0 0 3px rgba(6, 182, 212, .12)
}

.form-input::placeholder {
    color: var(--color-t3)
}

.login-opts {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    font-size: 12px
}

.login-remember {
    display: flex;
    align-items: center;
    gap: 7px;
    color: var(--color-t2);
    cursor: pointer
}

.login-remember input {
    accent-color: var(--color-p)
}

.login-forgot {
    color: var(--color-p);
    cursor: pointer;
    transition: color .2s
}

.login-forgot:hover {
    color: var(--color-p2)
}

.btn-login {
    width: 100%;
    padding: 13px;
    border-radius: var(--r12);
    font-size: 14px;
    font-weight: 700;
    background: linear-gradient(135deg, var(--color-p), #0891b2);
    color: #fff;
    box-shadow: 0 6px 20px rgba(6, 182, 212, .3);
    transition: all .2s;
    margin-bottom: 16px
}

.btn-login:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 28px rgba(6, 182, 212, .45)
}

.login-divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 16px 0;
    color: var(--color-t3);
    font-size: 12px
}

.login-divider::before,
.login-divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--color-b1)
}

.demo-accounts {
    display: flex;
    flex-direction: column;
    gap: 8px
}

.demo-btn {
    background: var(--color-bg3);
    border: 1px solid var(--color-b1);
    border-radius: var(--r8);
    padding: 10px 14px;
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    transition: all .15s;
    text-align: left
}

.demo-btn:hover {
    border-color: var(--color-b2);
    background: var(--color-bg4)
}

.demo-av {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    flex-shrink: 0
}

.demo-info {
    flex: 1
}

.demo-name {
    font-size: 13px;
    font-weight: 600;
    color: var(--color-t0)
}

.demo-role {
    font-size: 11px;
    color: var(--color-t3)
}

.demo-enter {
    font-size: 11px;
    color: var(--color-p);
    opacity: 0;
    transition: opacity .15s
}

.demo-btn:hover .demo-enter {
    opacity: 1
}

.login-back {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    margin-top: 20px;
    font-size: 13px;
    color: var(--color-t3);
    cursor: pointer;
    transition: color .2s
}

.login-back:hover {
    color: var(--color-p)
}
</style>
