import { useWindowDimensions } from "react-native";
import { View, Image, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView } from "react-native";
import { useSafeAreaInsets, SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useState } from "react";

import Button from "@/components/button";
import Input from "@/components/input";

export default function PasswordChange() {
    const { width, height } = useWindowDimensions(); // 🔹 Obtém dimensões da tela
    
    const [password, setPassword] = useState("");

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


            </SafeAreaView>

            <View style={[styles.logoContainer, { paddingHorizontal: width * 0.08 }]}>
                <Image  
                    source={require("../../../assets/images/logo_carro_verde.png")}
                    style={[styles.logo, { marginTop: height * 0.01, marginBottom: height * 0.04}]}
                    resizeMode="contain"
                />
            </View>

            {/* 🔹 Inputs e Botão */}
            <View style={styles.bottomContainer}>

                <Text style={[styles.infoTitle, { fontSize: width * 0.05 }]}>Mudança de Senha</Text>

                <Input placeholder="Digite sua senha nova" containerStyle={[styles.inputContainer, { width: width * 0.75 }]} secureTextEntry onChangeText={setPassword}/>

                <Input placeholder="Confirme sua senha" containerStyle={[styles.inputContainer, { width: width * 0.75, marginBottom: height * 0.045 }]} secureTextEntry onChangeText={setPassword}/>
                
                <Button title="Salvar" style={[styles.signInButton, { width: width * 0.6 }]} textStyle={[styles.signInText, { fontSize: width * 0.045 }]} onPress={() => router.push('/login/loginPage')} /> 

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF",
    },
    info: {
        color: "white",
        fontStyle: "italic",
        marginTop: 10,
        marginBottom: 40,
        textAlign: 'center'
    },
    infoTelefone: {
        color: "darkred",
        fontStyle: "italic",
        textAlign: 'right'
    },
    infoTitle: {
        color: "white",
        fontStyle: "italic",
        fontSize: 20,
        marginTop: 10,
        marginBottom: 30,
    },
    topContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 20 // 🔹 Garante espaço lateral
    },
    logoContainer: {
        flex:0.4,
        justifyContent: "center",
        alignItems: 'center'
    },
    logo: {
        width: 110, // 🔹 Define um tamanho fixo adequado
        height: 80
    },
    logoVoltar: {
        width: 30,
        height: 30,
    },
    bottomContainer: {
        flex: 1,
        backgroundColor: "#4D7E1B",
        borderTopLeftRadius: 70,
        alignItems: "center",
        paddingVertical: "2%",
        paddingTop: '10%'
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
    }
});



