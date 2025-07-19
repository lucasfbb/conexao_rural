import React from 'react';
import { Modal, View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';

interface Props {
  visible: boolean;
  onClose: () => void;
  qrCodeBase64: string;
  qrCodeText: string;
  valor: number;
  status: string;
  carregando?: boolean;
}

const ModalPixPagamento: React.FC<Props> = ({ visible, onClose, qrCodeBase64, qrCodeText, valor, status, carregando }) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.titulo}>Pagamento via PIX</Text>

          {carregando ? (
            <ActivityIndicator size="large" color="#4D7E1B" />
          ) : (
            <>
              <Image
                style={styles.qrCode}
                source={{ uri: `data:image/png;base64,${qrCodeBase64}` }}
              />

              <Text style={styles.valor}>R$ {valor.toFixed(2)}</Text>
              <Text selectable style={styles.codigoPix}>{qrCodeText}</Text>
              <Text style={styles.status}>Status: {status}</Text>
            </>
          )}

          <TouchableOpacity style={styles.botaoFechar} onPress={onClose}>
            <Text style={styles.textoFechar}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ModalPixPagamento;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#00000099',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#fff',
    width: '85%',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  qrCode: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
  valor: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  codigoPix: {
    fontSize: 12,
    marginBottom: 10,
    textAlign: 'center',
    color: '#555'
  },
  status: {
    fontSize: 14,
    color: 'green',
    marginBottom: 15,
  },
  botaoFechar: {
    marginTop: 10,
    backgroundColor: '#4D7E1B',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  textoFechar: {
    color: '#fff',
    fontWeight: 'bold',
  }
});
