import { useWindowDimensions } from "react-native";
import { View, Image, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView } from "react-native";
import { useSafeAreaInsets, SafeAreaView } from "react-native-safe-area-context";
import { CodeField, useBlurOnFulfill, useClearByFocusCell } from "react-native-confirmation-code-field";
import { router } from "expo-router";
import { useState } from "react";

import Button from "@/components/button";
import Input from "@/components/input";

export default function ForgotPasswordSMS() {
    const { width, height } = useWindowDimensions(); // Dimensões da tela
    const [value, setValue] = useState(""); // Estado para armazenar o código digitado
    const CELL_COUNT = 6; // Número de dígitos
    const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT }); // Quando todos os 6 dígitos forem preenchidos, o campo perde automaticamente o foco
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({ value, setValue }); // Permite apagar o código ao clicar na célula novamente

    return (
        <View style={styles.container}>
            {/* 🔹 Logo + Botão Voltar */}
            <SafeAreaView style={styles.topContainer}>
                <TouchableOpacity onPress={() => router.push('/login/loginPage')}>
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

                <Text style={[styles.infoTitle, { fontSize: width * 0.045, width: width * 0.8, textAlign: 'center'}]}>Digite o código de 6 dígitos que enviamos por SMS</Text>

                <CodeField
                    ref={ref} // Ref para controlar o foco automático
                    {...props} //  Passa propriedades do hook `useClearByFocusCell`
                    value={value} // Estado que armazena os números digitados
                    onChangeText={setValue} // Atualiza o estado quando o usuário digita
                    cellCount={CELL_COUNT} // Define quantos dígitos serão inseridos (6 neste caso)
                    rootStyle={[styles.codeFieldRoot, { marginVertical: height * 0.01 }]} // Estilização do campo inteiro
                    keyboardType="number-pad" // Garante que apenas números possam ser digitados
                    textContentType="oneTimeCode" // No iOS, ajuda a preencher automaticamente o código enviado via SMS
                    renderCell={({ index, symbol, isFocused }) => (
                        <View
                            key={index}
                            style={[styles.cell, isFocused && styles.focusCell]}
                            onLayout={getCellOnLayoutHandler(index)}
                        >
                            <Text style={styles.cellText}>{symbol || " "}</Text>
                        </View>
                    )}
                />
                
                <TouchableOpacity onPress={() => router.push('/login/forgotPassword')}>
                    <Text style={[styles.infoTelefone, { fontSize: width * 0.03, width: width * 0.75, marginBottom: height * 0.02}]}>Recuperar pelo email</Text>
                </TouchableOpacity>

                <Text style={[styles.info, { fontSize: width * 0.04, width: width * 0.75, marginBottom: height * 0.03}]}>Enviaremos as instruções para você alterar a senha por SMS</Text>
            
                <Button title="Enviar" style={[styles.signInButton, { width: width * 0.6, marginBottom: height * 0.03}]} textStyle={[styles.signInText, { fontSize: width * 0.04 }]} onPress={() => router.push('/login/passwordChange')} />
                
                <Button title="Reenviar Código" style={[styles.signUpButton, { width: width * 0.6 }]} textStyle={[styles.signUpText, { fontSize: width * 0.04 }]} onPress={() => router.push('/home')} />

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
    },
    signUpButton: {
        backgroundColor: "#4D7E1B",
        paddingVertical: 8,
        paddingHorizontal: 30,
        borderRadius: 20,
        width: "45%",
        height: 52,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: "#FFF",
    },
    signUpText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
    codeFieldRoot: {
        width: "80%",
    },
    cell: {
        width: 40,
        height: 40,
        borderWidth: 2,
        borderColor: "#4D7E1B",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5,
        marginHorizontal: 5,
        backgroundColor: "white",
    },
    cellText: {
        fontSize: 22,
        color: "#4D7E1B",
        textAlign: "center",
    },
    focusCell: {
        borderColor: "#396110",
    },
});



