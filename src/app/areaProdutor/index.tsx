import { View, Text, Button, FlatList, Image, TouchableOpacity } from "react-native";
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

  const renderItem = ({ item }: any) => (
    <View style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 10,
      borderBottomWidth: 1,
      borderColor: '#ccc',
    }}>
      <View>
        <Text style={{ fontSize: 16 }}>{item.nome}</Text>
        <Text style={{ fontSize: 14, color: '#555' }}>{item.preco}</Text>
      </View>
      <TouchableOpacity
        onPress={() => alert(`Editar ${item.nome}`)}
        style={{ backgroundColor: '#2196F3', padding: 8, borderRadius: 5 }}
      >
        <Text style={{ color: 'white' }}>Editar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <Header />
      <View style={{ alignItems: 'center', marginVertical: 20 }}>
        <TouchableOpacity onPress={escolherImagem}>
          {imagem ? (
            <Image source={{ uri: imagem }} style={{ width: 120, height: 120, borderRadius: 60 }} />
          ) : (
            <View style={{
              width: 120,
              height: 120,
              borderRadius: 60,
              backgroundColor: '#ccc',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <Text>Adicionar Foto</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <Text style={{ fontSize: 18, fontWeight: 'bold', marginLeft: 20 }}>Produtos Cadastrados:</Text>

      <FlatList
        data={produtos}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        style={{ marginHorizontal: 20, marginTop: 10 }}
      />

      <View style={{ margin: 20 }}>
        <Button title="Adicionar Produto" onPress={() => router.push('')} />
        <View style={{ height: 10 }} />
        <Button title="Ver Pedidos" onPress={() => router.push('')} color="#4CAF50" />
      </View>
    </View>
  );
}
