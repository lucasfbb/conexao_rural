import { View, Text, FlatList, Image, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import * as ImagePicker from 'expo-image-picker';
import Header from "@/components/header";

export default function AreaProdutor() {
  const [produtos, setProdutos] = useState([
    { id: '1', nome: 'Tomate', preco: 'R$ 5,00' },
    { id: '2', nome: 'Alface', preco: 'R$ 3,00' },
  ]);
  const [imagem, setImagem] = useState<string | null>(null);

  const escolherImagem = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImagem(result.assets[0].uri);
    }
  };

  const excluirProduto = (id: string) => {
    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja excluir este produto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: () => {
            setProdutos(prev => prev.filter(prod => prod.id !== id));
          }
        },
      ]
    );
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.produtoItem}>
      <View>
        <Text style={styles.produtoNome}>{item.nome}</Text>
        <Text style={styles.produtoPreco}>{item.preco}</Text>
      </View>
      <View style={styles.botoesContainer}>
        <TouchableOpacity style={styles.buttonEditar} onPress={() => alert(`Editar ${item.nome}`)}>
          <Text style={styles.title}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonExcluir} onPress={() => excluirProduto(item.id)}>
          <Text style={styles.title}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <View >
        <Header />
      </View>

      <View style={{ alignItems: 'center', marginVertical: 20 }}>
        <TouchableOpacity onPress={escolherImagem}>
          {imagem ? (
            <Image source={{ uri: imagem }} style={styles.imagemPerfil} />
          ) : (
            <View style={styles.placeholderImagem}>
              <Text>Adicionar Foto</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <Text style={styles.titulo}>Produtos Cadastrados:</Text>

      <FlatList
        data={produtos}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        style={{ marginHorizontal: 20, marginTop: 10 }}
      />

      <View style={{ margin: 20, gap: 10 }}>
        <TouchableOpacity style={styles.buttonAdicionar} onPress={() => router.push('/produtos/adicionar')}>
          <Text style={styles.title}>Adicionar Produto</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonPedidos} onPress={() => router.push('/pedidos')}>
          <Text style={styles.title}>Ver Pedidos</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  imagemPerfil: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  placeholderImagem: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center'
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 20,
    marginTop: 10
  },
  produtoItem: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 10,
    flexDirection: 'column',
    gap: 10
  },
  produtoNome: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  produtoPreco: {
    fontSize: 14,
    color: '#555'
  },
  botoesContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 5
  },
  buttonEditar: {
    flex: 1,
    height: 52,
    backgroundColor: '#E15610',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonExcluir: {
    flex: 1,
    height: 52,
    backgroundColor: '#B00020',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonAdicionar: {
    width: "100%",
    height: 52,
    backgroundColor: '#E15610',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonPedidos: {
    width: "100%",
    height: 52,
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white'
  }
});
