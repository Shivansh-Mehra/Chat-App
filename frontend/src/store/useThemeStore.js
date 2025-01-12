import {create} from 'zustand';

export const useThemeStore = create((set) => ({
    theme: localStorage.getItem('theme') || 'dark',
    setTheme: (t) => {
        localStorage.setItem('theme', t);
        set({theme: t});
    }
}))