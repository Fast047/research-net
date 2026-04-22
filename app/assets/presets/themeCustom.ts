import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';
export const appPreset = definePreset(Aura, {
    semantic: {
        primary: {
            // 50: '#f2f8fd',
            // 100: '#e5eff9',
            // 200: '#c4dff3',
            // 300: '#91c5e8',
            // 400: '#4ba2d8',
            // 500: '#308dc7', // This is the default shade for the primary color
            // 600: '#2070a9',
            // 700: '#1b5a89',
            // 800: '#1a4d72',
            // 900: '#1b415f',
            // 950: '#122a3f'
            50: '#edfaff',
            100: '#d6f3ff',
            200: '#b5eaff',
            300: '#83dfff',
            400: '#48ccff',
            500: '#1eb0ff',
            600: '#0698ff',
            700: '#0088ff',
            800: '#0868c5',
            900: '#0d589b',
            950: '#0e365d'
        },
        surface: {
            ground: '#efefef',
            section: '#fff',
            card: '#fff',
            overlay: '#dee2e6',
            border: '#dee2e6',
            hover: '#e9ecef',
            0: '#ffffff',
            50: '#f8fafc',
            100: '#f1f5f9',
            200: '#e2e8f0',
            300: '#cbd5e1',
            400: '#94a3b8',
            500: '#64748b',
            600: '#475569',
            700: '#334155',
            800: '#1e293b',
            900: '#0f172a',
            950: '#020617',
        }
    }
});
export default appPreset;