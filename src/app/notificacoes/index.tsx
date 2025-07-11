import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, Alert } from "react-native";
import { useState } from "react";
import { Feather } from "@expo/vector-icons";
import Header from "@/components/header";
import { useTema } from '@/contexts/ThemeContext';

const { colors, isNightMode } = useTema()
export default function Notificacoes() {
  
  const [notificacoes, setNotificacoes] = useState([
    {
      id: '1',
      titulo: 'Pedido Confirmado',
      descricao: 'Seu pedido foi confirmado pelo produtor João.',
      data: '14/05/2025',
    },
    {
      id: '2',
      titulo: 'Produto em Promoção',
      descricao: 'Tomate está com 20% de desconto hoje.',
      data: '13/05/2025',
    },{
      id: '3',
      titulo: 'Pedido Confirmado',
      descricao: 'Seu pedido foi confirmado pelo produtor João.',
      data: '14/05/2025',
    },
    {
      id: '4',
      titulo: 'Produto em Promoção',
      descricao: 'Tomate está com 20% de desconto hoje.', 
      data: '13/05/2025',
    },{
      id: '5',
      titulo: 'Pedido Confirmado',
      descricao: 'Seu pedido foi confirmado pelo produtor João.',
      data: '14/05/2025',
    },
    {
      id: '6',
      titulo: 'Produto em Promoção',
      descricao: 'Tomate está com 20% de desconto hoje.',
      data: '13/05/2025',
    },{
      id: '7',
      titulo: 'Pedido Confirmado',
      descricao: 'Seu pedido foi confirmado pelo produtor João.',
      data: '14/05/2025',
    },
    {
      id: '8',
      titulo: 'Produto em Promoção',
      descricao: 'Tomate está com 20% de desconto hoje.',
      data: '13/05/2025',
    },{
      id: '9',
      titulo: 'Pedido Confirmado',
      descricao: 'Seu pedido foi confirmado pelo produtor João.',
      data: '14/05/2025',
    },
    {
      id: '10',
      titulo: 'Produto em Promoção',
      descricao: 'Tomate está com 20% de desconto hoje.',
      data: '13/05/2025',
    },{
      id: '11',
      titulo: 'Pedido Confirmado',
      descricao: 'Seu pedido foi confirmado pelo produtor João.',
      data: '14/05/2025',
    },
    {
      id: '12',
      titulo: 'Produto em Promoção',
      descricao: 'Tomate está com 20% de desconto hoje.',
      data: '13/05/2025',
    },{
      id: '13',
      titulo: 'Pedido Confirmado',
      descricao: 'Seu pedido foi confirmado pelo produtor João.',
      data: '14/05/2025',
    },
    {
      id: '14',
      titulo: 'Produto em Promoção',
      descricao: 'Tomate está com 20% de desconto hoje.',
      data: '13/05/2025',
    },{
      id: '15',
      titulo: 'Pedido Confirmado',
      descricao: 'Seu pedido foi confirmado pelo produtor João.',
      data: '14/05/2025',
    },
    {
      id: '16',
      titulo: 'Produto em Promoção',
      descricao: 'Tomate está com 20% de desconto hoje.',
      data: '13/05/2025',
    },{
      id: '17',
      titulo: 'Pedido Confirmado',
      descricao: 'Seu pedido foi confirmado pelo produtor João.',
      data: '14/05/2025',
    },
    {
      id: '18',
      titulo: 'Produto em Promoção',
      descricao: 'Tomate está com 20% de desconto hoje.',
      data: '13/05/2025',
    },{
      id: '19',
      titulo: 'Pedido Confirmado',
      descricao: 'Seu pedido foi confirmado pelo produtor João.',
      data: '14/05/2025',
    },
    {
      id: '20',
      titulo: 'Produto em Promoção',
      descricao: 'Tomate está com 20% de desconto hoje.',
      data: '13/05/2025',
    }
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [notificacaoSelecionada, setNotificacaoSelecionada] = useState<any>(null);

  

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
        onPress: () => {
          setNotificacoes(prev => prev.filter(n => n.id !== id));
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
        <Feather name="trash" size={24} color={colors.text} />
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
      />

      {/* Modal Detalhes */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitulo}>{notificacaoSelecionada?.titulo}</Text>
            <Text style={styles.modalDescricao}>{notificacaoSelecionada?.descricao}</Text>
            <Text style={styles.modalData}>{notificacaoSelecionada?.data}</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.fecharBotao}>
              <Text style={{ color: colors.text , fontWeight: 'bold' }}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 15,
    color: colors.text
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
    borderColor: colors.borderCard
  },

  itemInfo: {
    flex: 1,
    marginRight: 10,
  },

  titulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text
  },

  data: {
    fontSize: 12,
    color: colors.text,
    marginTop: 4,
  },

  btnDelete: {
    padding: 5,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: colors.modalBackground,
    justifyContent: 'center',
    alignItems: 'center'
  },

  modalBox: {
    backgroundColor: colors.background,
    padding: 20,
    borderRadius: 10,
    width: '85%',
    gap: 10
  },

  modalTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text
  },

  modalDescricao: {
    fontSize: 14,
    color: colors.text
  },

  modalData: {
    fontSize: 12,
    color: colors.text
  },

  fecharBotao: {
    marginTop: 10,
    alignSelf: 'flex-end'
  }
});
