import { TextInput, View, TextInputProps, StyleSheet } from "react-native";

import { styles } from "./styles";
interface InputProps extends TextInputProps {
    containerStyle?: object;
    inputStyle?: object;
}

export default function Input({ containerStyle, inputStyle, ...props }: InputProps) {
    return (
        <View style={[styles.container, containerStyle]}>
            <TextInput
                style={[styles.input, inputStyle]}
                placeholderTextColor="rgba(255, 255, 255, 0.6)"
                {...props} // 🔹 Permite passar qualquer outra prop do TextInput
            />
            <View style={styles.underline} />
        </View>
    );
}