import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, Alert } from "react-native";
import { useEffect, useState } from "react";
import { Feather } from "@expo/vector-icons";
import Header from "@/components/header";
import { api } from '../../../services/api';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Notificacoes() {
  const [notificacoes, setNotificacoes] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [notificacaoSelecionada, setNotificacaoSelecionada] = useState<any>(null);

  useEffect(() => {
    buscarNotificacoes();
  }, []);

  const buscarNotificacoes = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await api.get("/notificacoes", {
        headers: { Authorization: `Bearer ${token}` }
      });

      const formatadas = res.data.map((n: any) => ({
        id: n.id.toString(),
        titulo: n.titulo,
        descricao: n.mensagem,
        data: new Date(n.criado_em).toLocaleDateString("pt-BR"),
      }));

      setNotificacoes(formatadas);
    } catch (error) {
      console.error("Erro ao buscar notificações:", error);
    }
  };

  const abrirModal = (notificacao: any) => {
    setNotificacaoSelecionada(notificacao);
    setModalVisible(true);
  };

  const excluirNotificacao = (id: string) => {
    Alert.alert("Confirmar", "Deseja excluir esta notificação?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem("token");
            await api.delete(`/notificacoes/${id}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            setNotificacoes(prev => prev.filter(n => n.id !== id));
          } catch (error) {
            console.error("Erro ao excluir notificação:", error);
            Alert.alert("Erro", "Não foi possível excluir a notificação.");
          }
        }
      }
    ]);
  };

  const renderItem = ({ item }: any) => (
    <TouchableOpacity style={styles.item} onPress={() => abrirModal(item)}>
      <View style={styles.itemInfo}>
        <Text style={styles.titulo}>{item.titulo}</Text>
        <Text style={styles.data}>{item.data}</Text>
      </View>
      <TouchableOpacity onPress={() => excluirNotificacao(item.id)} style={styles.btnDelete}>
        <Feather name="trash" size={24} color="#B00020" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header />
      <Text style={styles.headerText}>Notificações</Text>

      <FlatList
        data={notificacoes}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 10 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={{ padding: 20, alignItems: 'center' }}>
            <Text style={{ fontSize: 16, color: '#777' }}>Nenhuma notificação encontrada.</Text>
          </View>
        }
      />

      {/* Modal Detalhes */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitulo}>{notificacaoSelecionada?.titulo}</Text>
            <Text style={styles.modalDescricao}>{notificacaoSelecionada?.descricao}</Text>
            <Text style={styles.modalData}>{notificacaoSelecionada?.data}</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.fecharBotao}>
              <Text style={{ color: '#4CAF50', fontWeight: 'bold' }}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 15,
    color: '#4D7E1B'
  },
  item: {
    backgroundColor: '#F9F9F9',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#4D7E1B'
  },
  itemInfo: {
    flex: 1,
    marginRight: 10,
  },
  titulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4D7E1B'
  },
  data: {
    fontSize: 12,
    color: '#777',
    marginTop: 4,
  },
  btnDelete: {
    padding: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000099',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalBox: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '85%',
    gap: 10
  },
  modalTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4D7E1B'
  },
  modalDescricao: {
    fontSize: 14,
    color: '#555'
  },
  modalData: {
    fontSize: 12,
    color: '#999'
  },
  fecharBotao: {
    marginTop: 10,
    alignSelf: 'flex-end'
  }
});
