'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type ThemeContextType = {
    darkMode: boolean;
    accentColor: string;
    setTheme: (settings: { darkMode: boolean; accentColor: string }) => void;
};

const ThemeContext = createContext<ThemeContextType>({
    darkMode: false,
    accentColor: 'blue',
    setTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [darkMode, setDarkMode] = useState(false);
    const [accentColor, setAccentColor] = useState('blue');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // Fetch user preferences on mount
        const fetchTheme = async () => {
            try {
                // Fetch settings globally from student profile for now
                const res = await fetch('/api/student/profile');
                if (res.ok) {
                    const data = await res.json();
                    if (data.appearance) {
                        setDarkMode(data.appearance.darkMode || false);
                        setAccentColor(data.appearance.accentColor || 'blue');
                    }
                }
            } catch (err) {
                console.error('Failed to fetch theme', err);
            } finally {
                setMounted(true);
            }
        };
        fetchTheme();
    }, []);

    useEffect(() => {
        if (!mounted) return;
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode, mounted]);

    const setTheme = (settings: { darkMode: boolean; accentColor: string }) => {
        setDarkMode(settings.darkMode);
        setAccentColor(settings.accentColor);
    };

    const getBgGradient = (color: string, isDark: boolean) => {
        switch (color) {
            case 'indigo': return isDark ? 'from-slate-900 via-slate-800 to-indigo-950' : 'from-slate-50 via-white to-indigo-50';
            case 'purple': return isDark ? 'from-slate-900 via-slate-800 to-purple-950' : 'from-slate-50 via-white to-purple-50';
            case 'rose': return isDark ? 'from-slate-900 via-slate-800 to-rose-950' : 'from-slate-50 via-white to-rose-50';
            case 'emerald': return isDark ? 'from-slate-900 via-slate-800 to-emerald-950' : 'from-slate-50 via-white to-emerald-50';
            case 'amber': return isDark ? 'from-slate-900 via-slate-800 to-amber-950' : 'from-slate-50 via-white to-amber-50';
            case 'blue':
            default: return isDark ? 'from-slate-900 via-slate-800 to-blue-950' : 'from-slate-50 via-white to-blue-50';
        }
    };

    return (
        <ThemeContext.Provider value={{ darkMode, accentColor, setTheme }}>
            <div className={`min-h-screen bg-gradient-to-br flex flex-col transition-all duration-500 ${mounted ? getBgGradient(accentColor, darkMode) : 'from-slate-50 via-white to-blue-50'}`}>
                {children}
            </div>
        </ThemeContext.Provider>
    );
}
