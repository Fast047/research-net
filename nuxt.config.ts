// https://nuxt.com/docs/api/configuration/nuxt-config
import { appPreset } from './app/assets/presets/themeCustom';
import { systemLocale } from './app/assets/locale/systemLocale';
import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  devServer: {
    port: process.env.NUXT_APP_PORT ? Number(process.env.NUXT_APP_PORT) : 3000,
    host: process.env.NUXT_APP_HOST || "0.0.0.0", 
    url: process.env.NUXT_APP_URL || "http://localhost",
  },
  buildDir: '.nuxt',
  build: {
    transpile: ['echarts', 'zrender', 'echarts-leaflet', 'leaflet'],
  },
  app: {
    head: {
      title: "ระบบฐานข้อมูลและแผนที่เครือข่ายความร่วมมือวิจัยเชิงรุก",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        // Enables fullscreen on iOS 
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'apple-mobile-web-app-title', content: 'E-research-linK' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/images/soc_logo68.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/images/soc_logo68.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/images/soc_logo68.png' },
        { rel: 'icon', type: 'image/png', sizes: '96x96', href: '/images/soc_logo68.png' },
        // { rel: 'apple-touch-icon', sizes: '180x180', href: '/images/apple-touch-icon.png' },
        // iOS icon 
        { rel: 'shortcut icon', href: '/images/soc_logo68.png' }
      ],
    },
  },
  modules: [
    'nuxt-echarts',
    '@primevue/nuxt-module',
    '@vee-validate/nuxt',
    '@nuxt/icon',
    '@nuxt/fonts',
    // '@sidebase/nuxt-auth',
    '@vite-pwa/nuxt',
  ],
  css: ['~/assets/css/main.css'],
  echarts: {
    renderer: ['svg','canvas']
  },
  postcss: {
    plugins: {
      "@tailwindcss/postcss": {},
      autoprefixer: {},
    },
  },
  fonts: {
    families: [
      {
        name: 'IBM Plex Mono',
        provider: 'google',
        weights: [400, 500, 600],
        global: true
        // subsets: [
        //   'cyrillic-ext',
        //   'cyrillic',
        //   'vietnamese',
        //   'latin-ext',
        //   'latin',
        // ]
      },
      {
        name: 'Noto Sans Thai',
        provider: 'google',
        weights: [300, 400, 500, 600, 700],
        subsets: ['latin','thai']
      },
      {
        name: 'Plus Jakarta Sans',
        provider: 'google',
        weights: [300, 400, 500, 600, 700, 800],
        global: true
        // subsets: [
        //   'cyrillic-ext', 
        //   'cyrillic', 
        //   'vietnamese', 
        //   'latin-ext', 
        //   'latin'
        // ]
      },
      {
        name: 'Prompt',
        provider: 'google',
        weights: [200, 300, 400, 500, 600, 700, 800],
        subsets: ['latin', 'thai']
      }
    ]
  },
  pwa: {
    manifest: {
      name: 'E-research-link',
      short_name: 'ResearchLink',
      theme_color: '#ffffff',
    },
    devOptions: {
      enabled: true
    }
  },
  primevue: {
    usePrimeVue: true,
    autoImport: true,
    directives: {
      include: ["Ripple", "Tooltip", "Badge", "Focustrap"],
    },
    options: {
      ripple: true, 
      inputVariant: 'filled',
      theme: {
        preset: appPreset,
        // importTheme: {
        //   from: '@primeuix/themes/aura'
        // },
        options: {
          // prefix: 'p',
          darkModeSelector: false,
          cssLayer: {
            name: 'primevue',
            order: 'theme, base, utilities, primevue' 
          },
        },
        locale: systemLocale,
      }
    },
  },
  nitro: {
    compressPublicAssets: false,
    minify: false,
    esbuild: {
      options: {
        target: 'esnext',
      },
    },
  },
  vite: {
    build: {
      target: 'esnext',
      // cssMinify: 'esbuild',
    },
    server: { 
      watch: { 
        usePolling: false, 
      }, 
    },
    resolve: {
      alias: {
        'echarts/lib/echarts': 'echarts',
      }
    },
    optimizeDeps: {
      include: ['echarts', 'echarts-leaflet', 'zrender'],
    },
    plugins: [
      tailwindcss(),
    ],
    css: {
      preprocessorOptions: {
        scss: {
          silenceDeprecations: ['mixed-decls', 'color-functions', 'global-builtin'],
        },
      },
    },
  }
})
