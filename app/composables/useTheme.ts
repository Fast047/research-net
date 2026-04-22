// composables/useTheme.ts
export const useTheme = () => {
  const colorMode = useCookie<'light' | 'dark'>('rs-theme', {
    default: () => 'dark'
  })

  // ✅ ใช้ computed แทน ref
  const isLight = computed({
    get: () => colorMode.value === 'light',
    set: (val: boolean) => {
      colorMode.value = val ? 'light' : 'dark'
    }
  })

  const toggleTheme = () => {
    isLight.value = !isLight.value
  }

  const setLight = () => {
    isLight.value = true
  }

  const setDark = () => {
    isLight.value = false
  }

  return {
    isLight,
    setDark,
    setLight,
    toggleTheme
  }
}