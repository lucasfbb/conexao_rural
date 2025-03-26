import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Feather } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

interface ModalProdutoProps {
  visible: boolean;
  onClose: () => void;
  produto: {
    nome: string;
    descricao?: string;
    preco: string;
    imagem: any; // Pode ser require('...') ou uma URI
  };
  onAddToCart: (quantidade: number) => void;
}

export default function ModalProduto({
  visible,
  onClose,
  produto,
  onAddToCart,
}: ModalProdutoProps) {
  const [quantidade, setQuantidade] = useState(1);

  const incrementar = () => setQuantidade(q => q + 1);
  const decrementar = () => setQuantidade(q => (q > 1 ? q - 1 : 1));

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.container}>
          {/* Botão Fechar */}
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Feather name="x" size={24} color="#4D7E1B" />
          </TouchableOpacity>

          <Text style={styles.titulo}>{produto.nome}</Text>

          <Image source={produto.imagem} style={styles.imagem} resizeMode="contain" />

          <Text style={styles.descricao}>{produto.descricao}</Text>

          {/* Contador */}
          <View style={styles.contadorContainer}>
            <TouchableOpacity style={styles.contadorBtn} onPress={decrementar}>
              <Text style={styles.contadorText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.contadorQtd}>{quantidade}</Text>
            <TouchableOpacity style={styles.contadorBtn} onPress={incrementar}>
              <Text style={styles.contadorText}>+</Text>
            </TouchableOpacity>
          </View>

          {/* Botão Adicionar */}
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => onAddToCart(quantidade)}
          >
            <Text style={styles.addBtnText}>Adicionar  {produto.preco}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: width * 0.85,
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    paddingTop: 40,
    alignItems: "center",
    position: "relative",
  },
  closeBtn: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  titulo: {
    fontSize: 18,
    color: "#4D7E1B",
    fontWeight: "bold",
    marginBottom: 10,
    fontStyle: "italic",
  },
  imagem: {
    width: 150,
    height: 100,
    backgroundColor: "#EEE",
    marginBottom: 10,
  },
  descricao: {
    textAlign: "center",
    color: "#4D7E1B",
    fontSize: 14,
    marginBottom: 20,
    fontStyle: "italic",
  },
  contadorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  contadorBtn: {
    padding: 10,
    backgroundColor: "#E6F2D8",
    borderRadius: 5,
    marginHorizontal: 10,
  },
  contadorText: {
    fontSize: 18,
    color: "#4D7E1B",
  },
  contadorQtd: {
    fontSize: 16,
    color: "#4D7E1B",
    fontWeight: "bold",
  },
  addBtn: {
    backgroundColor: "#4D7E1B",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
  },
  addBtnText: {
    color: "white",
    fontWeight: "bold",
  },
});
