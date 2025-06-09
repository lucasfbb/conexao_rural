import { TextInput, View, TextInputProps, StyleSheet, TouchableOpacity } from "react-native";
import { TextInputMask } from 'react-native-masked-text';
import { styles } from "./styles";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
interface InputProps extends TextInputProps {
    containerStyle?: object;
    inputStyle?: object;
    isPassword?: boolean;
}

export default function Input({ containerStyle, inputStyle, isPassword = false, ...props }: InputProps) {
    const [mostrarSenha, setMostrarSenha] = useState(false);

    return (
        <View style={[styles.container, containerStyle]}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TextInput
                    style={[styles.input, inputStyle, { flex: 1 }]}
                    placeholderTextColor="rgba(255, 255, 255, 0.6)"
                    secureTextEntry={isPassword && !mostrarSenha}
                    {...props} // permite passar qualquer outra prop do TextInput
                    value={props.value}
                />
                {isPassword && (
                    <TouchableOpacity onPress={() => setMostrarSenha(!mostrarSenha)} style={{ paddingHorizontal: 8 }}>
                        <Ionicons name={mostrarSenha ? "eye-off" : "eye"} size={20} color="#fff" />
                    </TouchableOpacity>
                )}
            </View>
            <View style={styles.underline} />
        </View>
    );
}