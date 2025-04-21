import { Keyboard, useWindowDimensions } from "react-native";
import { View, Image, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView } from "react-native";
import { useSafeAreaInsets, SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { router } from "expo-router";

import Button from "@/components/button";
import Input from "@/components/input";
import Select from "@/components/select";
import { useEffect, useState } from "react";

export default function CadastroPage() {
    const { width, height } = useWindowDimensions(); // 🔹 Obtém a largura e altura da tela
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

    let fontSizeResponsive = height * 0.02

        useEffect(() => {
            const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", () => {
                setIsKeyboardVisible(true);
            });

            const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () => {
                setIsKeyboardVisible(false);
            });

            return () => {
                keyboardDidShowListener.remove();
                keyboardDidHideListener.remove();
            };
        }, []);

        return (
            
            <KeyboardAwareScrollView
                style={styles.container}
                contentContainerStyle={{ flexGrow: 1 }}
                enableOnAndroid
                scrollEnabled={false}
                extraScrollHeight={20} // Ajusta a altura ao focar em inputs
                keyboardShouldPersistTaps="handled"
            >
                {/* 🔹 Cabeçalho (Some quando o teclado está aberto) */}
              
                <SafeAreaView style={styles.topContainer}>
                    <TouchableOpacity onPress={() => router.push('/')}>
                    <Image
                        source={require("../../../assets/images/voltar26.png")}
                        style={[styles.logoVoltar, { marginTop: height * 0.03 }]} 
                        resizeMode="contain"
                    />
                    </TouchableOpacity>

                    <Image
                    source={require("../../../assets/images/logo_carro_verde.png")}
                    style={[styles.logo, { marginTop: height * 0.01 }]}
                    resizeMode="contain"
                    />
                </SafeAreaView>
              

                
                <View style={[styles.textContainer, { paddingHorizontal: width * 0.08 }]}>
                    <Text style={[styles.titleText, { fontSize: width * 0.07, marginBottom: height * 0.01}]}>Cadastro</Text> 
                    <Text style={[styles.descriptionText, { fontSize: width * 0.04 }]}>
                    Lorem ipsum is simply dummy text of the printing and typesetting industry.
                    </Text>
                </View>
              

                {/* 🔹 Inputs e Botão */}
                <View style={styles.bottomContainer}>
                    <Input placeholder="Digite seu nome completo*" containerStyle={[styles.inputContainer, { width: width * 0.8 }]} inputStyle={{ fontSize: fontSizeResponsive }} />
                    <Input placeholder="Digite seu e-mail*" containerStyle={[styles.inputContainer, { width: width * 0.8 }]} inputStyle={{ fontSize: fontSizeResponsive }} />
                    <Input placeholder="Digite seu CPF*" containerStyle={[styles.inputContainer, { width: width * 0.8 }]} inputStyle={{ fontSize: fontSizeResponsive}} />
                    
                    <Select 
                        options={["Categoria 1", "Categoria 2", "Categoria 3"]} 
                        placeholder="Selecione uma categoria" 
                        onSelect={(value) => console.log("Selecionado:", value)}
                    />

                    <Input placeholder="Digite seu primeiro telefone*" containerStyle={[styles.inputContainer, { width: width * 0.8 }]} inputStyle={{ fontSize: fontSizeResponsive }} />
                    <Input placeholder="Digite seu segundo telefone" containerStyle={[styles.inputContainer, { width: width * 0.8 }]} inputStyle={{ fontSize: fontSizeResponsive }} />
                    <Input placeholder="Digite sua senha*" containerStyle={[styles.inputContainer, { width: width * 0.8 }]} inputStyle={{ fontSize: fontSizeResponsive }} secureTextEntry />
                    <Input placeholder="Confirme sua senha*" containerStyle={[styles.inputContainer, { width: width * 0.8 }]} inputStyle={{ fontSize: fontSizeResponsive }} secureTextEntry />

                    <Button 
                        title="Cadastrar" 
                        style={[styles.signInButton, { width: width * 0.35, height: height * 0.055, marginTop: height * 0.02}]} 
                        textStyle={[styles.signInText, { fontSize: fontSizeResponsive }]} 
                        onPress={() => router.push('/login/loginPage')} 
                    />
                </View>
            </KeyboardAwareScrollView>
            
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF",
    },
    topContainer: {
        flex: 0.2,
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 20,
    },
    textContainer: {
        flex: 0.5,
        justifyContent: "center",
    },
    logo: {
        width: 80,
        height: 50,
    },
    logoVoltar: {
        width: 30,
        height: 30,
    },
    bottomContainer: {
        flex: 2,
        backgroundColor: "#4D7E1B",
        borderTopLeftRadius: 70,
        alignItems: "center",
        paddingVertical: "5%",
    },
    titleText: {
        fontWeight: "bold",
        fontStyle: "italic",
        color: "black",
        textAlign: "left",
    },
    descriptionText: {
        textAlign: "center",
        color: "black",
    },
    inputContainer: {
        maxWidth: 400,
        minWidth: 280,
        marginBottom: 15,
    },
    signInButton: {
        backgroundColor: "#FFF",
        paddingVertical: 8,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center"
    },
    signInText: {
        color: "#4D7E1B",
        fontWeight: "bold",
    },
});

// import { useState, useEffect } from "react";
// import { 
//     View, Image, Text, StyleSheet, TouchableOpacity, Keyboard, useWindowDimensions
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
// import { router } from "expo-router";

// import Button from "@/components/button";
// import Input from "@/components/input";
// import Select from "@/components/select";

// export default function CadastroPage() {
//     const { width, height } = useWindowDimensions(); // 🔹 Obtém a largura e altura da tela
//     const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

//     let fontSizeResponsive = height * 0.02;

//     useEffect(() => {
//         const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", () => {
//             setIsKeyboardVisible(true);
//         });

//         const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () => {
//             setIsKeyboardVisible(false);
//         });

//         return () => {
//             keyboardDidShowListener.remove();
//             keyboardDidHideListener.remove();
//         };
//     }, []);

//     return (
//         <KeyboardAwareScrollView 
//             // contentContainerStyle={{ flexGrow: 1 }}
//             enableOnAndroid={true}
//             // extraScrollHeight={height * 0.15} 
//             // enableAutomaticScroll={true}
//             keyboardShouldPersistTaps="handled"
//             // resetScrollToCoords={{ x: 0, y: 0 }}
//         >
//             <View style={styles.container}>
//                 {/* 🔹 Cabeçalho (Some quando o teclado está aberto) */}
//                 {!isKeyboardVisible && (
//                     <SafeAreaView style={styles.topContainer}>
//                         <TouchableOpacity onPress={() => router.push('/')}>
//                             <Image
//                                 source={require("../../../assets/images/voltar26.png")}
//                                 style={[styles.logoVoltar, { marginTop: height * 0.03 }]} 
//                                 resizeMode="contain"
//                             />
//                         </TouchableOpacity>

//                         <Image
//                             source={require("../../../assets/images/logo_carro_verde.png")}
//                             style={[styles.logo, { marginTop: height * 0.01 }]}
//                             resizeMode="contain"
//                         />
//                     </SafeAreaView>
//                 )}

//                 {/* 🔹 Título e Descrição (Some quando o teclado está aberto) */}
//                 {!isKeyboardVisible && (
//                     <View style={[styles.textContainer, { paddingHorizontal: width * 0.08 }]}>
//                         <Text style={[styles.titleText, { fontSize: width * 0.07, marginBottom: height * 0.01}]}>Cadastro</Text> 
//                         <Text style={[styles.descriptionText, { fontSize: width * 0.04 }]}>
//                             Lorem ipsum is simply dummy text of the printing and typesetting industry.
//                         </Text>
//                     </View>
//                 )}

//                 {/* 🔹 Inputs e Botão */}
//                 <View style={styles.bottomContainer}>
//                     <Input placeholder="Digite seu nome completo*" containerStyle={[styles.inputContainer, { width: width * 0.8 }]} inputStyle={{ fontSize: fontSizeResponsive }} />
//                     <Input placeholder="Digite seu e-mail*" containerStyle={[styles.inputContainer, { width: width * 0.8 }]} inputStyle={{ fontSize: fontSizeResponsive }} />
//                     <Input placeholder="Digite seu CPF*" containerStyle={[styles.inputContainer, { width: width * 0.8 }]} inputStyle={{ fontSize: fontSizeResponsive}} />
                    
//                     <Select 
//                         options={["Categoria 1", "Categoria 2", "Categoria 3"]} 
//                         placeholder="Selecione uma categoria" 
//                         onSelect={(value) => console.log("Selecionado:", value)}
//                     />

//                     <Input placeholder="Digite seu primeiro telefone*" containerStyle={[styles.inputContainer, { width: width * 0.8 }]} inputStyle={{ fontSize: fontSizeResponsive }} />
//                     <Input placeholder="Digite seu segundo telefone" containerStyle={[styles.inputContainer, { width: width * 0.8 }]} inputStyle={{ fontSize: fontSizeResponsive }} />
//                     <Input placeholder="Digite sua senha*" containerStyle={[styles.inputContainer, { width: width * 0.8 }]} inputStyle={{ fontSize: fontSizeResponsive }} secureTextEntry />
//                     <Input placeholder="Confirme sua senha*" containerStyle={[styles.inputContainer, { width: width * 0.8 }]} inputStyle={{ fontSize: fontSizeResponsive }} secureTextEntry />

//                     <Button 
//                         title="Cadastrar" 
//                         style={[styles.signInButton, { width: width * 0.35, height: height * 0.055, marginTop: height * 0.02}]} 
//                         textStyle={[styles.signInText, { fontSize: fontSizeResponsive }]} 
//                         onPress={() => router.push('/configuracoes')} 
//                     />
//                 </View>
//             </View>
//         </KeyboardAwareScrollView>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: "#FFF",
//     },
//     topContainer: {
//         flexDirection: "row",
//         justifyContent: "space-between",
//         paddingHorizontal: 20,
//     },
//     textContainer: {
//         justifyContent: "center",
//     },
//     logo: {
//         width: 80,
//         height: 50,
//     },
//     logoVoltar: {
//         width: 30,
//         height: 30,
//     },
//     bottomContainer: {
//         flexGrow: 1,
//         backgroundColor: "#4D7E1B",
//         borderTopLeftRadius: 70,
//         alignItems: "center",
//         paddingVertical: "5%",
//     },
//     titleText: {
//         fontWeight: "bold",
//         fontStyle: "italic",
//         color: "black",
//         textAlign: "left",
//     },
//     descriptionText: {
//         textAlign: "center",
//         color: "black",
//     },
//     inputContainer: {
//         maxWidth: 400,
//         minWidth: 280,
//         marginBottom: 15,
//     },
//     signInButton: {
//         backgroundColor: "#FFF",
//         paddingVertical: 8,
//         borderRadius: 20,
//         justifyContent: "center",
//         alignItems: "center"
//     },
//     signInText: {
//         color: "#4D7E1B",
//         fontWeight: "bold",
//     },
// });

