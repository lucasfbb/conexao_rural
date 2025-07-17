import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons"; // Ícone do lápis para edição

interface CardProps {
  id?: number;
  title: string;
  subtitle: string;
  details: string[];
  isPayment?: boolean;
  titular?: string; // Para cartões de pagamento
  onPress?: () => void;
}

import { styles } from "./styles";
import { useTema } from "@/contexts/ThemeContext";

export default function Card({ id, title, subtitle, details, isPayment, titular, onPress }: CardProps) {
  const { colors } = useTema()
  
  // useEffect(() => {
  //   // Log para verificar se o componente está recebendo os dados corretamente
  //   console.log("Card props:", { id, title, subtitle, details, isPayment, titular });
  // }, [id, title, subtitle, details, isPayment, titular]);

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.profileCard, borderColor: colors.borderCard }]}
      onPress={onPress}
      activeOpacity={0.8}
    >     
      {/* Ícone de edição */}
      {/* <TouchableOpacity style={styles.editIcon}>
        <AntDesign name="edit" size={10} color="green" />
      </TouchableOpacity> */}

      {/* Conteúdo do Card */}
      <Text style={[styles.title, { color: colors.title }]}>{title}</Text>
      <Text style={[styles.subtitle, { color: colors.endereco }]}>{subtitle}</Text>

      {details.map((item, index) => (
        <Text key={index} style={[styles.detail, { color: colors.detail }]}>{item}</Text>
      ))}

      {/* Se for pagamento, mostra o nome do titular */}
      {isPayment && <Text style={styles.detail}>{titular}</Text>}
    </TouchableOpacity>
  );
}