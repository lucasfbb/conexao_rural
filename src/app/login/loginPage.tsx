import axios from "axios";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useWindowDimensions } from "react-native";
import { View, Image, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView } from "react-native";
import { useSafeAreaInsets, SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import { router } from "expo-router";
import { useState } from "react";
import { api } from "../../../services/api";
import { BackHandler } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

import Button from "@/components/button";
import Input from "@/components/input";

export default function LoginPage() {
    const { width, height } = useWindowDimensions(); // 🔹 Obtém dimensões da tela
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [mostrarSenha, setMostrarSenha] = useState(false);

    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
            // Aqui você decide o que fazer quando o botão voltar for pressionado
            // Por exemplo, pode exibir um alerta ou impedir de sair da tela de login
            return true; // <- true significa "bloquear o voltar"
            };

            BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, [])
    );

    const handleLogin = async () => {
        try {
            if (!email || !password) {
                return Alert.alert("Atenção", "Preencha todos os campos!");
            }
            
            // console.log(email)
            // console.log(password)

            const response = await api.post("/auth/login", {
                email,
                senha: password
            });
        
            const token = response.data.access_token;
        
            // Salve o token no AsyncStorage
            await AsyncStorage.setItem("token", token);
        
            router.push("/home");
        } catch (err) {
            Alert.alert("Erro", "Usuário ou senha incorretos");
        }
    };

    return (
        <View style={styles.container}>
            {/* 🔹 Logo + Botão Voltar */}
            <SafeAreaView style={styles.topContainer}>
                <TouchableOpacity onPress={() => router.push('/')}>
                    <Image
                        source={require("../../../assets/images/voltar26.png")}
                        style={[styles.logoVoltar, { marginTop: height * 0.03 }]} // 🔹 Ajuste dinâmico
                        resizeMode="contain"
                    />
                </TouchableOpacity>

                <Image
                    source={require("../../../assets/images/logo_carro_verde.png")}
                    style={[styles.logo, { marginTop: height * 0.01 }]}
                    resizeMode="contain"
                />
            </SafeAreaView>

            {/* 🔹 Texto "Entrar" + Descrição */}
            <View style={[styles.textContainer, { paddingHorizontal: width * 0.08 }]}>
                <Text style={[styles.titleText, { fontSize: width * 0.07, marginBottom: height * 0.01}]}>Entrar</Text>
                <Text style={[styles.descriptionText, { fontSize: width * 0.04 }]}>
                    Está quase lá! Digite seu e-mail e senha para acessar sua conta.
                </Text>
            </View>

            {/* 🔹 Inputs e Botão */}
            <View style={styles.bottomContainer}>
                <Input placeholder="Digite seu e-mail" containerStyle={[styles.inputContainer, { width: width * 0.75 }]} onChangeText={setEmail} />
                <Input placeholder="Digite sua senha" containerStyle={[styles.inputContainer, { width: width * 0.75 }]} onChangeText={setPassword} isPassword />

                <TouchableOpacity onPress={() => router.push('/login/forgotPassword')}>
                    <Text style={[styles.forgotPassword, { fontSize: width * 0.04 }]}>Esqueceu a senha?</Text>
                </TouchableOpacity>

                <Button title="Entrar" style={[styles.signInButton, { width: width * 0.6 }]} textStyle={[styles.signInText, { fontSize: width * 0.045 }]} onPress={handleLogin} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF",
    },
    topContainer: {
        flex: 0.3,
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 20, // 🔹 Garante espaço lateral
    },
    textContainer: {
        flex: 0.6, // 🔹 Mantém o conteúdo ajustado ao tamanho da tela
        justifyContent: "center",
        alignItems: 'flex-start'
    },
    logo: {
        width: 80, // 🔹 Define um tamanho fixo adequado
        height: 50,
    },
    logoVoltar: {
        width: 30,
        height: 30,
    },
    bottomContainer: {
        flex: 1.5,
        backgroundColor: "#4D7E1B",
        borderTopLeftRadius: 70,
        alignItems: "center",
        paddingVertical: "7%",
        paddingTop: '20%'
    },
    titleText: {
        fontSize: 24,
        fontWeight: "bold",
        fontStyle: "italic",
        color: "black",
        textAlign: "center",
    },
    descriptionText: {
        textAlign: "center",
        color: "black",
        fontSize: 14,
    },
    inputContainer: {
        alignItems: "center",
        maxWidth: 400, // 🔹 Evita que os inputs fiquem muito largos em telas grandes
        minWidth: 280, // 🔹 Evita que os inputs fiquem muito pequenos em telas menores
        marginBottom: 15, // 🔹 Garante espaço entre os campos
    },
    forgotPassword: {
        color: "darkred",
        fontStyle: "italic",
        fontSize: 16,
        marginTop: 10,
        marginBottom: 30,
    },
    signInButton: {
        backgroundColor: "#FFF",
        paddingVertical: 8,
        borderRadius: 20,
        height: 52,
        justifyContent: "center",
        alignItems: "center",
    },
    signInText: {
        color: "#4D7E1B",
        fontSize: 18,
        fontWeight: "bold",
    },
});



