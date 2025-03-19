import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons"; // Ícone do lápis para edição

interface CardProps {
  title: string;
  subtitle: string;
  details: string[];
  isPayment?: boolean;
}

import { styles } from "./styles";

export default function Card({ title, subtitle, details, isPayment }: CardProps) {
  return (
    <View style={styles.card}>
      {/* Ícone de edição */}
      <TouchableOpacity style={styles.editIcon}>
        <AntDesign name="edit" size={8} color="green" />
      </TouchableOpacity>

      {/* Conteúdo do Card */}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>

      {details.map((item, index) => (
        <Text key={index} style={styles.detail}>{item}</Text>
      ))}

      {/* Se for pagamento, mostra o nome do titular */}
      {isPayment && <Text style={styles.detail}>Titular Cartão</Text>}
    </View>
  );
}