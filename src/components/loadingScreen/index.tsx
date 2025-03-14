import { View, Image, StyleSheet, ActivityIndicator, Animated, Dimensions } from "react-native";
import { useEffect, useRef } from "react";
import { styles } from './styles'

// Definindo o tipo da prop `fadeOut`
interface LoadingScreenProps {
    fadeOut: boolean;
}

export default function LoadingScreen({ fadeOut }: LoadingScreenProps) { 
    
    const fadeAnim = useRef(new Animated.Value(1)).current; // 🔹 Começa visível

    useEffect(() => {
        if (fadeOut) {
            Animated.timing(fadeAnim, {
                toValue: 0, // opacidade vai para 0 (desaparece)
                duration: 800, // tempo da animação (1s)
                useNativeDriver: true,
            }).start();
        }
    }, [fadeOut]);

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
            {/* 🔹 Imagem da Splash Screen ocupando toda a tela */}
            <Image 
                source={require("../../../assets/images/carregamento.png")} 
                style={styles.image}
                resizeMode="cover" // 🔹 Cobre toda a tela sem bordas brancas
            />

            {/* 🔹 Indicador de carregamento sobreposto na tela */}
            <ActivityIndicator size="large" color="#3F7F3F" style={styles.loader} />
        </Animated.View>
    );
}

