import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Checkbox as PaperCheckbox } from 'react-native-paper';
import { styles } from './styles';

interface SelectProps {
  placeholder?: string;
}

export default function Checkbox({ placeholder = "Você é produtor?" }: SelectProps) {
  const [checked, setChecked] = useState(false);

  return (
    <View style={styles.container}>
      <PaperCheckbox
        status={checked ? 'checked' : 'unchecked'}
        onPress={() => setChecked(!checked)}
        color="#FFFFFF"
        uncheckedColor="#FFFFFF" 
      />
      <Text style={styles.text}>{placeholder}</Text>
    </View>
  );
}