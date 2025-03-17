import { useEffect, useState } from "react";
import { View, Image, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { useSafeAreaInsets, SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import Button from "@/components/button";
import Input from "@/components/input";


export default function LoginPage() {
    
    return (
            <View style={styles.container}>
                {/* Logo na parte superior */}
                <SafeAreaView style={styles.topContainer}>
                    <TouchableOpacity onPress={() => router.push('/')}>
                        <Image
                            source={require("../../../assets/images/voltar26.png")}
                            style={styles.logoVoltar}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>

                    <Image
                        source={require("../../../assets/images/logo_carro_verde.png")}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </SafeAreaView>

                <View style={styles.textContainer}>
                    <Text style={styles.titleText}>Entrar</Text>
                    <Text style={styles.descriptionText}>
                        «Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa, quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt, explicabo. Nemo enim ipsam voluptatem, quia voluptas sit, aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos, qui ratione voluptatem sequi nesciunt, neque porro quisquam est, qui dolorem ipsum, quia dolor sit, amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt, ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure
                    </Text>
                </View>
    
                {/* Parte inferior verde com conteúdo */}
                <View style={styles.bottomContainer}>
                    
                    <Input placeholder="Digite seu e-mail" containerStyle={styles.containerEmail}/>
                    <Input placeholder="Digite sua senha" containerStyle={styles.containerSenha} secureTextEntry />

                    <TouchableOpacity>
                        <Text style={styles.forgotPassword}>Esqueceu a senha?</Text>
                    </TouchableOpacity>

                    {/* Botões */}
                    <View style={styles.buttonContainer}>

                        <Button title="Entrar" style={styles.signInButton} textStyle={styles.signInText} onPress={() => router.push('/configuracoes')}/>
    
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
        flex: 0.3, //  Parte superior maior que a inferior
        flexDirection: 'row',
        justifyContent: "space-between",
        // backgroundColor: 'yellow'
    },
    textContainer: {
        flex: 0.8, //  Parte superior maior que a inferior
        alignItems: 'flex-start',
        justifyContent: 'center',
        // backgroundColor: 'blue',
        marginLeft: 40,
        marginRight: 40
    },
    logo: {
        marginTop: 10,
        marginRight:30
    },
    logoVoltar: {
        marginTop: 30,
        marginLeft:30,
    },
    bottomContainer: {
        flex: 2,
        backgroundColor: "#4D7E1B", // Verde
        borderTopLeftRadius: 70, // Arredondamento do topo
        padding: 20,
        alignItems: "center",
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        fontStyle: "italic",
        color: "#FFF",
        marginBottom: 10,
    },
    titleText: {
        fontSize: 28,
        fontWeight: "bold",
        fontStyle: "italic",
        color: "black",
        marginBottom: 10,
    },
    description: {
        textAlign: "center",
        color: "#FFF",
        fontSize: 18,
        marginBottom: 100,
        paddingHorizontal: 10,
        marginTop: 25
    },
    descriptionText: {
        textAlign: "center",
        color: "black",
        fontSize: 14,
        marginBottom: 45,
        paddingHorizontal: 10,
        // backgroundColor:'red'
    },
    buttonContainer: {
        width:'80%',
        flexDirection: "row",
        justifyContent: "center",
        alignItems: 'center'
    },
    signInButton: {
        backgroundColor: "#FFF",
        paddingVertical: 8,
        paddingHorizontal: 30,
        borderRadius: 20,
        width: "60%",
        height: 52,
        justifyContent: 'center',
        alignItems: 'center'
    },
    signInText: {
        color: "#4D7E1B",
        fontSize: 18,
        fontWeight: "bold",
    },
    containerEmail: {
        alignItems: 'center',
        width: '60%',
        marginTop: 60
    },
    containerSenha: {
        alignItems: 'center',
        width: '60%',
        marginTop: 10
    },
    forgotPassword: {
        alignSelf: "flex-end",
        color: "darkred",
        fontStyle: "italic",
        fontSize: 16,
        marginBottom: 60,
        marginTop: 15
    },
    input: {
        backgroundColor:'blue',
        // alignItems:'flex-start'
    },
    underline: {
        height: 1,
        backgroundColor: "white",
        width: "100%",
    },
});