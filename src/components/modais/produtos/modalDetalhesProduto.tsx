import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

interface ModalDetalhesProdutoProps {
  visible: boolean;
  onClose: () => void;
  produto: {
    nome: string;
    preco: string;
    descricao?: string;
    produtor?: { nome: string; cpf_cnpj: string };
  } | null;
  onVerDetalhes?: () => void; // opcional, caso queira ação personalizada
}

export default function ModalDetalhesProduto({
  visible,
  onClose,
  produto,
  onVerDetalhes,
}: ModalDetalhesProdutoProps) {
  const router = useRouter();

  if (!produto) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>{produto.nome}</Text>
          <Text style={styles.price}>{produto.preco}</Text>

          <Text style={styles.label}>Produtor:</Text>
          <Text style={styles.text}>{produto.produtor?.nome || 'Desconhecido'}</Text>

          {produto.descricao && (
            <>
              <Text style={styles.label}>Descrição:</Text>
              <Text style={styles.text}>{produto.descricao}</Text>
            </>
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#E15610' }]}
              onPress={() => {
                onClose();
                if (produto.produtor?.cpf_cnpj) {
                  router.push(`/home/produtorProfile?cpf_cnpj=${produto.produtor.cpf_cnpj}`);
                }
              }}
            >
              <Text style={styles.buttonText}>Ver produtor</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)'
  },
  container: {
    margin: 20, padding: 20, backgroundColor: 'white', borderRadius: 10
  },
  title: {
    fontSize: 20, fontWeight: 'bold'
  },
  price: {
    fontSize: 18, marginVertical: 8
  },
  label: {
    fontWeight: 'bold', marginTop: 10
  },
  text: {
    fontSize: 16
  },
  buttonContainer: {
    flexDirection: 'row', justifyContent: 'space-between', marginTop: 20
  },
  button: {
    flex: 1, marginHorizontal: 5, padding: 10, borderRadius: 8, alignItems: 'center'
  },
  buttonText: {
    color: 'white', fontWeight: 'bold'
  }
});
