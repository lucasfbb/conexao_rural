import { View } from "react-native";
import { TextInputMask } from 'react-native-masked-text';
import { styles } from './styles'

interface MaskedInputProps {
    type: 'cpf' | 'cel-phone';
    value: string;
    onChangeText: (text: string) => void;
    placeholder: string;
    options?: object;
    containerStyle?: object;
    inputStyle?: object;
}

export default function MaskedInput({ type, value, onChangeText, placeholder, options, containerStyle, inputStyle }: MaskedInputProps) {
    return (
        <View style={[styles.container, containerStyle]}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TextInputMask
                    type={type}
                    options={options}
                    value={value}
                    onChangeText={onChangeText}
                    style={[styles.input, inputStyle, { flex: 1, color: '#fff' }]}
                    placeholder={placeholder}
                    placeholderTextColor="rgba(255, 255, 255, 0.6)"
                />
            </View>
            <View style={styles.underline} />
        </View>
    );
}
