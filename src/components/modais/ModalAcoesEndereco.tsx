// src/components/modais/ModalAcoesEndereco.tsx

import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface ModalAcoesEnderecoProps {
  visible: boolean;
  onClose: () => void;
  onEditar: () => void;
  onExcluir: () => void;
}

export default function ModalAcoesEndereco({ visible, onClose, onEditar, onExcluir }: ModalAcoesEnderecoProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalBackground}>
        <View style={styles.container}>
          <Text style={styles.title}>Ações do Endereço</Text>

          <TouchableOpacity onPress={onEditar} style={[styles.button, styles.editButton]}>
            <Text style={styles.buttonText}>Editar</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onExcluir} style={[styles.button, styles.deleteButton]}>
            <Text style={[styles.buttonText, { color: "#FFF" }]}>Excluir</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose} style={[styles.button, styles.cancelButton]}>
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 25,
    width: 280,
    alignItems: "center",
    elevation: 5, // Android
    shadowColor: "#000", // iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: "600",
    color: "#333",
  },
  button: {
    width: "100%",
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: "center",
  },
  editButton: {
    backgroundColor: "#E0F2F1",
  },
  deleteButton: {
    backgroundColor: "#F44336",
  },
  cancelButton: {
    backgroundColor: "#ECEFF1",
  },
  buttonText: {
    fontSize: 16,
    color: "#333",
  },
});
