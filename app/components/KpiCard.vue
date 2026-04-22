<template>
  <div class="kpi" :class="className">
    <div class="text-lg kpi-icon">{{ icon }}</div>
    <div class="text-xs kpi-lbl">{{ label }}</div>
    <div class="text-lg kpi-val">{{ value }}</div>
    <div class="text-xs text-emerald-400 kpi-trend">{{ trend }}</div>
  </div>
</template>

<script setup>
defineProps({
  className: String,
  icon: String,
  label: String,
  value: [String, Number],
  trend: String
})
</script>

<style scoped>
.kpi {
  background: var(--color-card);
  border: 1px solid var(--color-b1);
  border-radius: var(--r10);
  padding: 15px;
  position: relative;
  overflow: hidden;
  transition: all .2s;
}
.kpi::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px
}

.kpi.ck::before {
    background: linear-gradient(90deg, var(--c), var(--c3))
}

.kpi.cg::before {
    background: linear-gradient(90deg, var(--em), var(--em2))
}

.kpi.ca::before {
    background: linear-gradient(90deg, var(--am), var(--am2))
}

.kpi.cr::before {
    background: linear-gradient(90deg, var(--ro), var(--ro2))
}

.kpi.cv::before {
    background: linear-gradient(90deg, var(--vi), var(--vi2))
}
.kpi-icon {
    position: absolute;
    right: 12px;
    top: 12px;
    font-size: 22px;
    opacity: .2;
}
.kpi-lbl {
    font-size: 10px;
    font-weight: 700;
    color: var(--color-t3);
    text-transform: uppercase;
    letter-spacing: .06em;
    margin-bottom: 7px;
}
.kpi-val {
    font-size: 26px;
    font-weight: 800;
    color: var(--color-t0);
    line-height: 1;
    font-family: var(--font-mono);
}
.kpi-trend {
    font-size: 10px;
    color: var(--color-t3);
    margin-top: 5px;
}
</style>