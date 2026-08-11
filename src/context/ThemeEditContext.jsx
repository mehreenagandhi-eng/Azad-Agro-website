import React, { createContext, useContext } from "react";

const ThemeEditContext = createContext(null);

export function ThemeEditProvider({ value, children }) {
  return <ThemeEditContext.Provider value={value}>{children}</ThemeEditContext.Provider>;
}

export function useThemeEdit() {
  return useContext(ThemeEditContext);
}
