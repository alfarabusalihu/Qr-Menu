import { useThemeStore } from '../store/useThemeStore';

export const useThemeColors = () => {
    const { theme } = useThemeStore();
    const isDark = theme === 'dark';

    return {
        isDark,
        colors: {
            yellow: isDark ? '#caa40e' : '#facc15',

            background: isDark ? '#001f33' : '#f8fafc',
            surface: isDark ? '#002849' : '#ffffff',
            text: isDark ? '#ffffff' : '#0f172a',
            subText: isDark ? '#9ca3af' : '#64748b',
            border: isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0',

            icon: isDark ? '#caa40e' : '#003153',
        }
    };
};
