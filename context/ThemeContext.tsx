import React, { createContext, useState, ReactNode } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import { Colors } from '../constants/Colors';

// 1️⃣ Define the shape of context value
type ThemeContextType = {
  colorScheme: ColorSchemeName;
  setColorScheme: React.Dispatch<React.SetStateAction<ColorSchemeName>>;
  theme: typeof Colors.light;
};

// 2️⃣ Create context with default value
export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

// 3️⃣ Define props type for provider
type ThemeProviderProps = {
  children: ReactNode;
};

// 4️⃣ Provider component
export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [colorScheme, setColorScheme] = useState<ColorSchemeName>(
    Appearance.getColorScheme()
  );

  const theme =
    colorScheme === 'dark'
      ? Colors.dark
      : Colors.light;

  return (
    <ThemeContext.Provider
      value={{
        colorScheme,
        setColorScheme,
        theme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
