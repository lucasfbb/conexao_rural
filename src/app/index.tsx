import { useEffect, useState } from "react";
import { View, Image, Text, StyleSheet} from "react-native";

import LoadingScreen from "@/components/loadingScreen";
import LoginScreen from '@/app/login'
import Button from "@/components/button";
import { router } from "expo-router";

export default function Index() {
    const [isLoading, setIsLoading] = useState(true);
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setFadeOut(true); // 🔹 Ativa a animação de saída
            setTimeout(() => {
                setIsLoading(false);
                // router.replace("/login");
            }, 1000); // Aguarda a animação antes de remover
        }, 2000); // Simula um carregamento de 2 segundos
    }, []);

    if (isLoading) {
        return <LoadingScreen fadeOut={fadeOut} />;
    }

    return (
            <LoginScreen/>
        );
}

