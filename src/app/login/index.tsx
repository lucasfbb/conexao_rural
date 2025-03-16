import { useEffect, useState } from "react";
import { View, Image, Text, StyleSheet} from "react-native";

import Button from "@/components/button";
import { router } from "expo-router";

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
                        Lorem ipsum is simply dummy text of the printing and typesetting industry.
                        Lorem Ipsum has been the industry’s standard dummy text since the 1500s.
                    </Text>
    
                    {/* Botões */}
                    <View style={styles.buttonContainer}>
    
                        <Button title="Entrar" style={styles.signInButton} textStyle={styles.signInText} onPress={() => router.push('/configuracoes')}/>
                        <Button title="Sair" style={styles.signUpButton} textStyle={styles.signUpText}/>
    
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
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        fontStyle: "italic",
        color: "#FFF",
        marginBottom: 10,
    },
    description: {
        textAlign: "center",
        color: "#FFF",
        fontSize: 14,
        marginBottom: 100,
        paddingHorizontal: 10,
        marginTop: 25
    },
    buttonContainer: {
        width:'80%',
        flexDirection: "row",
        justifyContent: "space-between",
    },
    signInButton: {
        borderWidth: 2,
        borderColor: "#FFF",
        paddingVertical: 8,
        paddingHorizontal: 30,
        borderRadius: 20,
        width: "45%",
        height: 52,
        justifyContent: 'center',
        alignItems: 'center'
    },
    signInText: {
        color: "#FFF",
        fontSize: 16,
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
        fontSize: 16,
        fontWeight: "bold",
    },
});