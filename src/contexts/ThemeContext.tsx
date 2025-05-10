import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type ThemeColors = {
    background: string;
    text: string;
    endereco: string;
    detail: string;
    title: string;
    primary: string;
    produtoContainer: string;
    borderCard: string;
    profileCard: string;
    modalBackground: string;
    // adicione outras cores conforme necessário
};

type ThemeContextType = {
    isNightMode: boolean;
    colors: ThemeColors;
    toggleNightMode: () => void;
};

// const ThemeContext = createContext<ThemeContextType>({
//     isNightMode: false,
//     toggleNightMode: () => {},
// });

const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType);

// Definição das cores para cada tema
const lightColors: ThemeColors = {
    background: '#ffffff',
    title: '#4D7E1B',
    endereco: '#777',
    detail: '',
    text: '#000000',
    primary: '#6200ee',
    produtoContainer: '#F7FAF0',
    borderCard: '#4D7E1B',
    profileCard: "#ffffff",
    modalBackground: '#ffffff'
};

const darkColors: ThemeColors = {
    background: '#1b1a1d',
    title: '#ffffff',
    endereco: '#d1d1d1',
    detail: '#b0aeae',
    text: '#ffffff',
    primary: '#bb86fc',
    produtoContainer: '#292828',
    borderCard: '#ffffff',
    profileCard: "#4D7E1B",
    modalBackground: '#1b1a1d'
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [isNightMode, setIsNightMode] = useState(false);

    // Memoizando as cores com base no modo noturno
    const colors = useMemo(() => {
        return isNightMode ? darkColors : lightColors;
    }, [isNightMode]);

    useEffect(() => {
        const loadTheme = async () => {
            const saved = await AsyncStorage.getItem("modoNoturno");
            if (saved !== null) setIsNightMode(saved === "true");
        };
        loadTheme();
    }, []);

    const toggleNightMode = async () => {
        const novoModo = !isNightMode;
        setIsNightMode(novoModo);
        await AsyncStorage.setItem("modoNoturno", String(novoModo));
    };

    return (
        <ThemeContext.Provider value={{ isNightMode, colors, toggleNightMode }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTema = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useTema precisa estar dentro de ThemeProvider');
    return context;
};