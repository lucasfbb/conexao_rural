import { Alert, BackHandler, Keyboard, useWindowDimensions } from "react-native";
import { View, Image, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView } from "react-native";
import { useSafeAreaInsets, SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { router, useFocusEffect } from "expo-router";
import Button from "@/components/button";
import Input from "@/components/input";
import Select from "@/components/select";
import Checkbox from "@/components/checkbox";
import { useCallback, useEffect, useState } from "react";
import { api } from "../../../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MaskedInput from "@/components/maskedInput";
import { validarCPFouCNPJ, validarEmail } from "../../../services/utils";
import VoiceInput from "@/components/voiceInput";


export default function CadastroPage() {
    const { width, height } = useWindowDimensions(); // 🔹 Obtém a largura e altura da tela
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [cpf_cnpj, setCpf_Cnpj] = useState("");
    const [tipoDocumento, setTipoDocumento] = useState<"cpf" | "cnpj">("cpf");
    const [telefone1, setTelefone1] = useState("");
    const [telefone2, setTelefone2] = useState("");
    const [categoria, setCategoria] = useState<string>('Consumidor');
    const [senha, setSenha] = useState("");
    const [confirmacaoSenha, setConfirmacaoSenha] = useState("");

    let fontSizeResponsive = height * 0.02

    useFocusEffect(
        useCallback(() => {

            const onBackPress = () => {
                router.replace('/login');
                return true;
            };

            BackHandler.addEventListener('hardwareBackPress', onBackPress);
            return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, [])
    );

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

    const handleCadastro = async () => {
        if (senha !== confirmacaoSenha) {
            alert("As senhas não coincidem. Por favor, verifique.");
            return;
        }
        
        if (!nome || !email || !cpf_cnpj || !telefone1  || !senha) {
            alert("Preencha todos os campos obrigatórios!");
            return;
        }

        if (email !== "admin@admin.com" && !validarCPFouCNPJ(cpf_cnpj)) {
            alert("CPF ou CPNJ inválido. Por favor, verifique.");
            return;
        }

        if (!validarEmail(email)) {
            alert("E-mail inválido. Por favor, verifique.");
            return;
        }

        try {
            const response = await api.post("/usuarios/cadastrar_user", {
                cpf_cnpj: cpf_cnpj,
                email: email,
                nome: nome,
                telefone_1: telefone1,
                telefone_2: telefone2 || null,
                e_vendedor: categoria === "Produtor",
                senha: senha,
            });

            router.push("/login/loginPage");  
        } catch (err: any) {
            if (err.response && err.response.status === 400) {
                Alert.alert("Erro", err.response.data.detail);
            } else {
                Alert.alert("Erro", "Erro ao cadastrar usuário. Tente novamente.");
                console.error(err);
            }
        }
    };

    const handleCpfCnpjChange = (texto: string) => {
        const digits = texto.replace(/\D/g, "");

        if (digits.length > 10) {
            setTipoDocumento("cnpj");
        } else {
            setTipoDocumento("cpf");
        }

        setCpf_Cnpj(texto);
        };

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
                    Faça seu cadastro e tenha acesso ao aplicativo de entrega de produtos de agrícolas!
                    </Text>
                </View>

                {/* 🔹 Inputs e Botão */}
                <View style={styles.bottomContainer}>
                    {/* <Input placeholder="Digite seu nome completo*" onChangeText={setNome} containerStyle={[styles.inputContainer, { width: width * 0.8 }]} inputStyle={{ fontSize: fontSizeResponsive }} /> */}

                    <VoiceInput
                        placeholder="Digite seu nome completo*"
                        value={nome}
                        onChangeText={setNome}
                        placeholderTextColor="rgba(255,255,255,0.6)"
                        iconColor="#fff"
                        containerStyle={[styles.inputContainer, { width: width * 0.8 }]}
                        inputStyle={{ fontSize: fontSizeResponsive }}
                    />

                    {/* <Input placeholder="Digite seu e-mail*" onChangeText={setEmail} containerStyle={[styles.inputContainer, { width: width * 0.8 }]} inputStyle={{ fontSize: fontSizeResponsive }} /> */}
                    
                    <VoiceInput placeholder="Digite seu e-mail*" placeholderTextColor="rgba(255,255,255,0.6)" iconColor="#fff" onChangeText={setEmail} containerStyle={[styles.inputContainer, { width: width * 0.8 }]} inputStyle={{ fontSize: fontSizeResponsive }} />

                    <MaskedInput
                        type={tipoDocumento}
                        value={cpf_cnpj}
                        onChangeText={handleCpfCnpjChange}
                        placeholder="Digite seu CPF ou CNPJ*"
                        containerStyle={[styles.inputContainer, { width: width * 0.8 }]}
                        inputStyle={{ fontSize: fontSizeResponsive }}
                    />
                
                    <MaskedInput
                        type="cel-phone"
                        value={telefone1}
                        onChangeText={setTelefone1}
                        placeholder="Digite seu primeiro telefone*"
                        options={{
                            maskType: 'BRL',
                            withDDD: true,
                            dddMask: '(99) '
                        }}
                        containerStyle={[styles.inputContainer, { width: width * 0.8 }]}
                        inputStyle={{ fontSize: fontSizeResponsive }}
                    />

                    <MaskedInput
                        type="cel-phone"
                        value={telefone2}
                        onChangeText={setTelefone2}
                        placeholder="Digite seu segundo telefone"
                        options={{
                            maskType: 'BRL',
                            withDDD: true,
                            dddMask: '(99) '
                        }}
                        containerStyle={[styles.inputContainer, { width: width * 0.8 }]}
                        inputStyle={{ fontSize: fontSizeResponsive }}
                    />

                    <VoiceInput
                        placeholder="Digite sua senha*"
                        value={senha}
                        onChangeText={setSenha}
                        placeholderTextColor="rgba(255,255,255,0.6)"
                        iconColor="#fff"
                        containerStyle={[styles.inputContainer, { width: width * 0.8 }]}
                        inputStyle={{ fontSize: fontSizeResponsive }}
                        isPassword
                    />
                    
                    <VoiceInput
                        placeholder="Confirme sua senha*"
                        value={confirmacaoSenha}
                        onChangeText={setConfirmacaoSenha}
                        placeholderTextColor="rgba(255,255,255,0.6)"
                        iconColor="#fff"
                        containerStyle={[styles.inputContainer, { width: width * 0.8 }]}
                        inputStyle={{ fontSize: fontSizeResponsive }}
                        isPassword
                    />
                    
                    <Checkbox 
                        selectedOption={categoria} 
                        onChange={setCategoria} 
                    />
                    
                    <Button 
                        title="Cadastrar" 
                        style={[styles.signInButton, { width: width * 0.35, height: height * 0.055, marginTop: height * 0.02}]} 
                        textStyle={[styles.signInText, { fontSize: fontSizeResponsive }]} 
                        onPress={handleCadastro}
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

