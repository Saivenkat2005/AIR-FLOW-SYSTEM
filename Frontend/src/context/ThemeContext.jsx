import React, { createContext, useContext, useEffect, useState } from 'react';

const THEMES = ['dark', 'light', 'amoled'];
const STORAGE_KEY = 'airline-nexus-theme';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem(STORAGE_KEY);
        return THEMES.includes(savedTheme) ? savedTheme : 'dark';
    });

    useEffect(() => {
        document.documentElement.dataset.theme = theme;
        localStorage.setItem(STORAGE_KEY, theme);
    }, [theme]);

    const cycleTheme = () => {
        const nextIndex = (THEMES.indexOf(theme) + 1) % THEMES.length;
        setTheme(THEMES[nextIndex]);
    };

    return (
        <ThemeContext.Provider value={{ theme, cycleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useTheme must be used within ThemeProvider');
    return context;
}
