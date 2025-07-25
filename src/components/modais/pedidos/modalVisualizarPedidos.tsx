import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { api } from '../../../../services/api';
import { useTema } from "@/contexts/ThemeContext";

const { width, height } = Dimensions.get("window");

interface Pedido {
  id: number;
  usuario_id: number;
  id_endereco: number;
  status: string;
  valor: number;
  nome_cliente: string;
  endereco: string;
}

interface ModalVisualizarPedidosProps {
  visible: boolean;
  onClose: () => void;
}

export default function ModalVisualizarPedidos({
  visible,
  onClose,
}: ModalVisualizarPedidosProps) {
  const { colors } = useTema();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (visible) {
      setLoading(true);
      api.get("/pedidos/produtor") 
        .then(response => {
          console.log("Pedidos do produtor:", response.data);
          setPedidos(response.data);
        })
        .catch(error => {
          console.error("Erro ao buscar pedidos:", error);
        })
        .finally(() => setLoading(false));
    }
  }, [visible]);

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.modalBackground}>
        <View style={styles.modalWrapper}>
          <View style={styles.header}>
            <Text style={[styles.modalTitle, { color: colors.title }]}>
              Pedidos do Produtor
            </Text>
          </View>

          <ScrollView style={styles.scrollContent}>
            {loading ? (
              <ActivityIndicator size="large" color="#4D7E1B" />
            ) : pedidos.length === 0 ? (
              <Text style={{ textAlign: "center", marginTop: 20 }}>
                Nenhum pedido encontrado.
              </Text>
            ) : (
              pedidos.map((pedido) => (
                <View key={pedido.id} style={styles.pedidoBox}>
                  <Text style={styles.pedidoTitulo}>Pedido #{pedido.id}</Text>
                  <Text>Nome do cliente: {pedido.nome_cliente}</Text>

                  <Text>Status: {pedido.status}</Text>
                  <Text>Valor: R$ {pedido.valor.toFixed(2)}</Text>
                </View>
              ))
            )}
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity onPress={onClose}>
              <Text style={{ color: "#B00020" }}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalWrapper: {
    width: width * 0.9,
    height: height * 0.85,
    borderRadius: 15,
    overflow: "hidden",
    backgroundColor: "#FFF",
    justifyContent: "space-between",
  },
  header: {
    paddingTop: 20,
    paddingBottom: 10,
    alignItems: "center",
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  modalTitle: {
    fontSize: width * 0.05,
    fontWeight: "bold",
  },
  pedidoBox: {
    marginBottom: 20,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#FAFAFA",
  },
  pedidoTitulo: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 6,
    color: "#4D7E1B",
  },
});
