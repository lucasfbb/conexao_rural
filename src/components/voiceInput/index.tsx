import React, { useState, useEffect } from "react";
import { View, TextInput, TouchableOpacity, TextInputProps } from "react-native";
import Voice from "@react-native-voice/voice";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./styles";

interface VoiceInputProps extends TextInputProps {
  containerStyle?: object;
  inputStyle?: object;
}

export default function VoiceInput({ containerStyle, inputStyle, ...props }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [value, setValue] = useState(props.value || "");

  useEffect(() => {
    Voice.onSpeechResults = (event) => {
      const text = event.value?.[0];
      if (text) {
        setValue(text);
        props.onChangeText?.(text); // notifica o componente pai
        setIsListening(false);
      }
    };

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const startListening = async () => {
    try {
      setIsListening(true);
      await Voice.start("pt-BR");
    } catch (err) {
      console.error(err);
      setIsListening(false);
    }
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TextInput
          style={[styles.input, inputStyle, { flex: 1 }]}
          placeholderTextColor="rgba(255, 255, 255, 0.6)"
          value={value}
          onChangeText={(text) => {
            setValue(text);
            props.onChangeText?.(text);
          }}
          {...props}
        />
        <TouchableOpacity onPress={startListening} style={{ paddingHorizontal: 8 }}>
          <Ionicons name={isListening ? "mic-circle" : "mic"} size={22} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={styles.underline} />
    </View>
  );
}