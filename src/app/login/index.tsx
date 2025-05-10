import { useEffect, useState } from "react";
import { View, Image, Text, StyleSheet, Dimensions } from "react-native";
import { RFValue } from "react-native-responsive-fontsize"

import Button from "@/components/button";
import { router } from "expo-router";

const { height } = Dimensions.get("window");

export default function LoginScreen() {
    
    return (
            <View style={styles.container}>
                {/* Logo na parte superior */}
                <View style={styles.topContainer}>
                    <Image
                        source={require("../../../assets/images/logo_grande.png")}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </View>
    
                {/* Parte inferior verde com conteúdo */}
                <View style={styles.bottomContainer}>
                    <Text style={styles.title}>Bem-vindo</Text>
                    <Text style={styles.description}>
                        Bem vindo ao aplicativo de entrega de produtos agríicolas.
                    </Text>
    
                    {/* Botões */}
                    <View style={styles.buttonContainer}>
    
                        <Button title="Entrar" style={styles.signInButton} textStyle={styles.signInText} onPress={() => router.push('/login/loginPage')}/>
                        <Button title="Cadastrar" style={styles.signUpButton} textStyle={styles.signUpText} onPress={() => router.push('/login/cadastroPage')} />
                        {/* <Button title="Config" style={styles.signUpButton} textStyle={styles.signUpText} onPress={() => router.push('/configuracoes')} /> */}
    
                    </View>
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
        flex: 1.2, //  Parte superior maior que a inferior
        justifyContent: "center",
        alignItems: "center",
    },
    logo: {
        width: "70%",
        height: "50%",
        marginLeft:30
    },
    bottomContainer: {
        flex: 1,
        backgroundColor: "#4D7E1B", // Verde
        borderTopLeftRadius: 70, // Arredondamento do topo
        padding: 20,
        alignItems: "center",
        paddingBottom: height * 0.05,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        fontStyle: "italic",
        color: "#FFF",
        marginBottom: height * 0.02,
    },
    description: {
        textAlign: "center",
        color: "#FFF",
        fontSize: 18,
        paddingHorizontal: 10,
        marginTop: height * 0.02,
        marginBottom: height * 0.07,
    },
    buttonContainer: {
        width:'80%',
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: height * 0.02,
    },
    signInButton: {
        borderWidth: 2,
        borderColor: "#FFF",
        paddingVertical: 8,
        paddingHorizontal: 30,
        borderRadius: 20,
        width: "45%",
        height: 52, // talvez tenha que mudar para algo mais responsivo
        justifyContent: 'center',
        alignItems: 'center'
    },
    signInText: {
        color: "#FFF",
        fontSize: RFValue(12),
        fontWeight: "bold",
    },
    signUpButton: {
        backgroundColor: "#FFF",
        paddingVertical: 8,
        paddingHorizontal: 30,
        borderRadius: 20,
        width: "45%",
        height: 52,
        justifyContent: 'center',
        alignItems: 'center'
    },
    signUpText: {
        color: "#4D7E1B",
        fontSize: RFValue(12),
        fontWeight: "bold",
    },
});