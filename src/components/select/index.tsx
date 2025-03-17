import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import ModalDropdown from "react-native-modal-dropdown";

import { styles } from "./styles";

interface SelectProps {
    options: string[];
    placeholder?: string;
    onSelect?: (value: string) => void;
}

export default function Select({ options, placeholder = "Selecione", onSelect }: SelectProps) {
    const [selected, setSelected] = useState("");

    return (
        <View style={styles.container}>
            <ModalDropdown
                options={options}
                defaultValue={selected || placeholder}
                onSelect={(index, value) => {
                    setSelected(value);
                    if (onSelect) onSelect(value);
                }}
                textStyle={styles.text}
                dropdownStyle={styles.dropdown}
                dropdownTextStyle={styles.dropdownText}
            />
            <View style={styles.underline} />
        </View>
    );
}
