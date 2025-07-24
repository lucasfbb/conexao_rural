import React, { useState, useEffect } from "react";
import { View, TextInput, TouchableOpacity, TextInputProps } from "react-native";
import Voice from "@react-native-community/voice";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./styles";

interface VoiceInputProps extends TextInputProps {
  containerStyle?: object;
  inputStyle?: object;
  isPassword?: boolean;
  placeholderTextColor?: string;
  iconColor?: string; // 🎙 e 👁 cor dos ícones
}

export default function VoiceInput({
  containerStyle,
  inputStyle,
  isPassword = false,
  placeholderTextColor = "#4D7E1B",
  iconColor = "#4D7E1B",
  value: propValue = "",
  onChangeText,
  ...props
}: VoiceInputProps) {
  const [value, setValue] = useState(propValue);
  const [isListening, setIsListening] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  useEffect(() => {
    setValue(propValue);
  }, [propValue]);

  useEffect(() => {
    Voice.onSpeechResults = (event) => {
      const text = event.value?.[0];
      if (text) {
        setValue(text);
        onChangeText?.(text);
        setIsListening(false);
      }
    };

    Voice.onSpeechEnd = () => setIsListening(false);
    Voice.onSpeechError = () => setIsListening(false);

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const startListening = async () => {
    try {
      setIsListening(true);
      await Voice.start("pt-BR");
    } catch (err) {
      console.error("Erro ao iniciar reconhecimento de voz:", err);
      setIsListening(false);
    }
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TextInput
          {...props}
          onFocus={props.onFocus}
          onBlur={props.onBlur}
          style={[styles.input, inputStyle, { flex: 1 }]}
          placeholderTextColor={placeholderTextColor}
          secureTextEntry={isPassword && !mostrarSenha}
          value={value}
          onChangeText={(text) => {
            setValue(text);
            onChangeText?.(text);
          }}
        />

        {/* 🎙 Microfone */}
        <TouchableOpacity onPress={startListening} style={{ paddingHorizontal: 4 }}>
          <Ionicons name={isListening ? "mic-circle" : "mic"} size={22} color={iconColor} />
        </TouchableOpacity>

        {/* 👁 Olho para senha */}
        {isPassword && (
          <TouchableOpacity onPress={() => setMostrarSenha(!mostrarSenha)} style={{ paddingHorizontal: 4 }}>
            <Ionicons name={mostrarSenha ? "eye-off" : "eye"} size={22} color={iconColor} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.underline} />
    </View>
  );
}
