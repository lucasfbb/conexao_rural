import { View, Text, FlatList, Image, TouchableOpacity, Alert, StyleSheet, Modal, TextInput, ScrollView } from "react-native";
import { useState } from "react";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import Header from "@/components/header";

export default function AreaProdutor() {
  const [produtos, setProdutos] = useState([
    {
      id: '1',
      nome: 'Tomate',
      preco: 'R$ 5,00',
      quantidade: '10kg',
      imagem: require('../../../assets/images/principais/alface.png'),
    },
    {
      id: '2',
      nome: 'Alface',
      preco: 'R$ 3,00',
      quantidade: '20kg',
      imagem: require('../../../assets/images/principais/alface.png'),
    },
     {
      id: '3',
      nome: 'Alface',
      preco: 'R$ 3,00',
      quantidade: '20kg',
      imagem: require('../../../assets/images/principais/alface.png'),
    },
     {
      id: '4',
      nome: 'Alface',
      preco: 'R$ 3,00',
      quantidade: '20kg',
      imagem: require('../../../assets/images/principais/alface.png'),
    },
     {
      id: '5',
      nome: 'Alface',
      preco: 'R$ 3,00',
      quantidade: '20kg',
      imagem: require('../../../assets/images/principais/alface.png'),
    },
     {
      id: '6',
      nome: 'Alface',
      preco: 'R$ 3,00',
      quantidade: '20kg',
      imagem: require('../../../assets/images/principais/alface.png'),
    },
     {
      id: '7',
      nome: 'Alface',
      preco: 'R$ 3,00',
      quantidade: '20kg',
      imagem: require('../../../assets/images/principais/alface.png'),
    },
     {
      id: '8',
      nome: 'Alface',
      preco: 'R$ 3,00',
      quantidade: '20kg',
      imagem: require('../../../assets/images/principais/alface.png'),
    },
     {
      id: '9',
      nome: 'Alface',
      preco: 'R$ 3,00',
      quantidade: '20kg',
      imagem: require('../../../assets/images/principais/alface.png'),
    },
     {
      id: '10',
      nome: 'Alface',
      preco: 'R$ 3,00',
      quantidade: '20kg',
      imagem: require('../../../assets/images/principais/alface.png'),
    },
     {
      id: '11',
      nome: 'Alface',
      preco: 'R$ 3,00',
      quantidade: '20kg',
      imagem: require('../../../assets/images/principais/alface.png'),
    },
     {
      id: '12',
      nome: 'Alface',
      preco: 'R$ 3,00',
      quantidade: '20kg',
      imagem: require('../../../assets/images/principais/alface.png'),
    },
     {
      id: '13',
      nome: 'Alface',
      preco: 'R$ 3,00',
      quantidade: '20kg',
      imagem: require('../../../assets/images/principais/alface.png'),
    },
     {
      id: '14',
      nome: 'Alface',
      preco: 'R$ 3,00',
      quantidade: '20kg',
      imagem: require('../../../assets/images/principais/alface.png'),
    },
     {
      id: '15',
      nome: 'Alface',
      preco: 'R$ 3,00',
      quantidade: '20kg',
      imagem: require('../../../assets/images/principais/alface.png'),
    },
     {
      id: '16',
      nome: 'Alface',
      preco: 'R$ 3,00',
      quantidade: '20kg',
      imagem: require('../../../assets/images/principais/alface.png'),
    }
  ]);

  const [imagemProdutor, setImagemProdutor] = useState<string | null>(null);
  const [nomeProdutor, setNomeProdutor] = useState("João da Feira");

  const [modalNome, setModalNome] = useState(false);
  const [novoNome, setNovoNome] = useState(nomeProdutor);

  const [modalNovoProduto, setModalNovoProduto] = useState(false);
  const [novoNomeProd, setNovoNomeProd] = useState("");
  const [novoPrecoProd, setNovoPrecoProd] = useState("");
  const [novaQtdProd, setNovaQtdProd] = useState("");
  const [imagemProdutoNovo, setImagemProdutoNovo] = useState<string | null>(null);

  const escolherImagemProdutor = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });
    if (!result.canceled) setImagemProdutor(result.assets[0].uri);
  };

  const escolherImagemProduto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });
    if (!result.canceled) setImagemProdutoNovo(result.assets[0].uri);
  };

  const excluirProduto = (id: string) => {
    Alert.alert("Confirmar exclusão", "Tem certeza que deseja excluir este produto?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: () => setProdutos(prev => prev.filter(prod => prod.id !== id)),
      },
    ]);
  };

  const salvarNovoProduto = () => {
    if (!novoNomeProd || !novoPrecoProd || !novaQtdProd || !imagemProdutoNovo) {
      Alert.alert("Preencha todos os campos");
      return;
    }

    const novo = {
      id: Date.now().toString(),
      nome: novoNomeProd,
      preco: novoPrecoProd,
      quantidade: novaQtdProd,
      imagem: { uri: imagemProdutoNovo },
    };

    setProdutos(prev => [...prev, novo]);
    setModalNovoProduto(false);
    setNovoNomeProd("");
    setNovoPrecoProd("");
    setNovaQtdProd("");
    setImagemProdutoNovo(null);
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.produtoItem}>
      <View style={styles.produtoEsquerda}>
        <Image source={item.imagem} style={styles.produtoImagem} />
        <View>
          <Text style={styles.produtoNome}>{item.nome}</Text>
          <Text style={styles.produtoPreco}>{item.quantidade} - {item.preco}</Text>
        </View>
      </View>
      <View style={styles.botoesContainer}>
        <TouchableOpacity onPress={() => alert(`Editar ${item.nome}`)}>
          <Feather name="edit" size={24} color="#E15610" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => excluirProduto(item.id)}>
          <Feather name="trash" size={24} color="#B00020" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <Header />

      <View style={{ alignItems: 'center', marginVertical: 20 }}>
        <TouchableOpacity onPress={escolherImagemProdutor}>
          {imagemProdutor ? (
            <Image source={{ uri: imagemProdutor }} style={styles.imagemPerfil} />
          ) : (
            <View style={styles.placeholderImagem}>
              <Text>Adicionar Foto</Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.nomeContainer}>
          <Text style={styles.nomeProdutor}>{nomeProdutor}</Text>
          <TouchableOpacity onPress={() => {
            setNovoNome(nomeProdutor);
            setModalNome(true);
          }}>
            <Feather name="edit-2" size={18} color="#E15610" />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.titulo}>Estoque dos produtos</Text>

      <FlatList
        data={produtos}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        style={{ marginHorizontal: 20, marginTop: 10 }}
      />

      <View style={{ margin: 20, gap: 10 }}>
        <TouchableOpacity style={styles.buttonAdicionar} onPress={() => setModalNovoProduto(true)}>
          <Text style={styles.title}>Adicionar Produto</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonPedidos} onPress={() => alert("Ver pedidos")}>
          <Text style={styles.title}>Ver Pedidos</Text>
        </TouchableOpacity>
      </View>

      {/* Modal editar nome produtor */}
      <Modal visible={modalNome} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Editar nome do produtor</Text>
            <TextInput style={styles.input} value={novoNome} onChangeText={setNovoNome} />
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setModalNome(false)}>
                <Text style={{ color: '#B00020' }}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {
                setNomeProdutor(novoNome);
                setModalNome(false);
              }}>
                <Text style={{ color: '#4CAF50' }}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal adicionar produto */}
      <Modal visible={modalNovoProduto} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <ScrollView contentContainerStyle={styles.modalBox}>
            <Text style={styles.modalTitle}>Novo Produto</Text>

            <TextInput placeholder="Nome" style={styles.input} value={novoNomeProd} onChangeText={setNovoNomeProd} />
            <TextInput placeholder="Preço" style={styles.input} value={novoPrecoProd} onChangeText={setNovoPrecoProd} />
            <TextInput placeholder="Quantidade" style={styles.input} value={novaQtdProd} onChangeText={setNovaQtdProd} />

            <TouchableOpacity onPress={escolherImagemProduto}>
              {imagemProdutoNovo ? (
                <Image source={{ uri: imagemProdutoNovo }} style={styles.produtoImagemPreview} />
              ) : (
                <View style={[styles.placeholderImagem, { width: 80, height: 80 }]}>
                  <Text>Imagem</Text>
                </View>
              )}
            </TouchableOpacity>

            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setModalNovoProduto(false)}>
                <Text style={{ color: '#B00020' }}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={salvarNovoProduto}>
                <Text style={{ color: '#4CAF50' }}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  imagemPerfil: { width: 120, height: 120, borderRadius: 60 },
  placeholderImagem: {
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: '#ccc', justifyContent: 'center', alignItems: 'center'
  },
  nomeContainer: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10 },
  nomeProdutor: { fontSize: 18, fontWeight: 'bold' },
  titulo: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginVertical: 10 },
  produtoItem: {
    borderBottomWidth: 1, borderColor: '#ccc', paddingVertical: 10,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
  },
  produtoEsquerda: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  produtoImagem: { width: 40, height: 40, borderRadius: 5 },
  produtoImagemPreview: { width: 80, height: 80, borderRadius: 8, marginVertical: 10 },
  produtoNome: { fontSize: 16, fontWeight: 'bold' },
  produtoPreco: { fontSize: 14, color: '#555' },
  botoesContainer: { flexDirection: 'row', gap: 15, alignItems: 'center' },
  buttonAdicionar: {
    width: "100%", height: 52, backgroundColor: '#E15610',
    borderRadius: 10, justifyContent: 'center', alignItems: 'center'
  },
  buttonPedidos: {
    width: "100%", height: 52, backgroundColor: '#4CAF50',
    borderRadius: 10, justifyContent: 'center', alignItems: 'center'
  },
  title: { fontSize: 16, fontWeight: 'bold', color: 'white' },
  modalOverlay: {
    flex: 1, backgroundColor: '#00000099', justifyContent: 'center', alignItems: 'center'
  },
  modalBox: {
    width: '85%', backgroundColor: 'white', borderRadius: 10,
    padding: 20, gap: 10, elevation: 5
  },
  modalTitle: { fontSize: 16, fontWeight: 'bold' },
  input: {
    borderWidth: 1, borderColor: '#ccc',
    borderRadius: 8, padding: 10
  },
  modalButtons: {
    flexDirection: 'row', justifyContent: 'space-between', marginTop: 10
  }
});
