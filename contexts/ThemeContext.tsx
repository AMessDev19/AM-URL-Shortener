import React, { createContext, useContext, useState } from "react";
import { ThemeProvider, createTheme, CssBaseline, Theme, colors } from "@mui/material";

// Define the context type for TypeScript
interface ThemeContextType {
    darkMode: boolean;
    toggleDarkMode: () => void;
}

// Create the context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Hook to use context
export const useThemeContext = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useThemeContext must be used within a ThemeProviderCustom");
    }
    return context;
};

// ThemeProviderCustom component
export const ThemeProviderCustom: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [darkMode, setDarkMode] = useState(false); // Track darkMode state

    const toggleDarkMode = () => {
        setDarkMode((prev) => !prev);  // Toggle darkMode
    };

    // Create a theme based on the dark mode state
    const theme = createTheme({
        palette: {
            mode: darkMode ? 'dark' : 'light', // Switch between light and dark mode
            primary: {
                main: darkMode ? '#90caf9' : '#1976d2', // Blue color for dark and light modes
            },
            background: {
                default: darkMode ? '#121212' : '#ffffff', // Custom background color for both modes
                paper: darkMode ? '#121212' : '#fafafa', // Paper background (cards, etc.)
            },
            text: {
                primary: darkMode ? '#ffffff' : '#000000', // White text in dark mode, black text in light mode
            },
        },
        components: {
            // Override input field colors
            MuiTextField: {
                styleOverrides: {
                    root: {
                        backgroundColor: darkMode ? '' : '#fff', // Dark background for input in dark mode
                        color: darkMode ? '#fff' : '#000', // Text color
                    },
                },
            },
            MuiButton: {
                styleOverrides: {
                    root: {
                        backgroundColor: darkMode ? '#1976d2' : '#90caf9', // Button color changes based on mode
                        color: '#fff',
                    },
                },
            },
        },
    });

    return (
        <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    );
};
