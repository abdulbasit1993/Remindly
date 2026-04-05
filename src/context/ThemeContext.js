import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { THEMES } from '../theme/themes';
import { getAppTheme, setAppTheme } from '../utils/storage';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const systemTheme = useColorScheme();

  const [theme, setThemeState] = useState('system');

  useEffect(() => {
    const storedTheme = getAppTheme();
    setThemeState(storedTheme);
  }, []);

  const setTheme = newTheme => {
    setThemeState(newTheme);
    setAppTheme(newTheme);
  };

  const activeTheme = theme === 'system' ? systemTheme : theme;

  const colors = THEMES[activeTheme] || THEMES.light;

  return (
    <ThemeContext.Provider
      value={{
        theme,
        activeTheme,
        colors,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
