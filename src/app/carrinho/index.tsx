import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useState } from 'react';

import Header from '@/components/header';
import { router } from 'expo-router';

const { width, height } = Dimensions.get("window");

const mockCarrinho = [
    {
        id: '1',
        nome: 'Alface Crespa',
        descricao: 'Direto da horta, super fresca!',
        preco: 4.50,
        qtd: 1,
        imagem: require('../../../assets/images/principais/alface.png'),
      },
      {
        id: '2',
        nome: 'Tomate Italiano',
        descricao: 'Vermelho, suculento e docinho.',
        preco: 7.25,
        qtd: 2,
        imagem: require('../../../assets/images/promocoes/maca.png'),
      },
]

// const removerItem = (id: string) => {
//     setCarrinho(prev => prev.filter(item => item.id !== id));
// };

export default function Carrinho() {

    const [carrinho, setCarrinho] = useState(mockCarrinho);

    const diminuirQuantidade = (id: string) => {
        setCarrinho(prev =>
        prev
            .map(item =>
            item.id === id ? { ...item, qtd: item.qtd - 1 } : item
            )
            .filter(item => item.qtd > 0)
        );
    };

    const aumentarQuantidade = (id: string) => {
        setCarrinho(prev =>
        prev.map(item =>
            item.id === id ? { ...item, qtd: item.qtd + 1 } : item
        )
        );
    };

    const total = carrinho.reduce((acc, item) => acc + item.preco * item.qtd, 0);
    
    return (
        <View style={styles.container}>
          <Header />
    
          <Text style={styles.title}>Carrinho</Text>
    
          <FlatList
            data={carrinho}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: 15 }}
            renderItem={({ item }) => (
              <View style={styles.produtoContainer}>
                <Image source={item.imagem} style={styles.img} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.nome}>{item.nome}</Text>
                  <Text style={styles.descricao}>{item.descricao}</Text>
                  <Text style={styles.preco}>R$ {item.preco.toFixed(2)}</Text>
                </View>
                <View style={styles.qtdContainer}>
                  <TouchableOpacity onPress={() => diminuirQuantidade(item.id)}>
                    <Feather name="minus" size={18} />
                  </TouchableOpacity>
                  <Text style={styles.qtd}>{item.qtd}</Text>
                  <TouchableOpacity onPress={() => aumentarQuantidade(item.id)}>
                    <Feather name="plus" size={18} />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
    
          <View style={styles.footer}>
            <Text style={styles.total}>Total sem entrega: R$ {total.toFixed(2)}</Text>
            <TouchableOpacity style={styles.continuar} onPress={() => router.push('/carrinho/confirmacao')}>
              <Text style={styles.continuarText}>Continuar</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
  
    title: {
      fontSize: 22,
      fontWeight: 'bold',
      color: '#4D7E1B',
      fontStyle: 'italic',
      marginTop: height * 0.03,
      marginLeft: 20,
      marginBottom: height * 0.005,
    },
  
    produtoContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#F7FAF0',
      borderRadius: 10,
      padding: 10,
      marginBottom: height * 0.015,
      gap: 10,
    },
  
    img: {
      width: 60,
      height: 60,
      borderRadius: 8,
      backgroundColor: '#ddd',
    },
  
    nome: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#4D7E1B',
    },
  
    descricao: {
      fontSize: 12,
      color: '#777',
      fontStyle: 'italic',
    },
  
    preco: {
      fontSize: 14,
      color: '#4D7E1B',
      marginTop: 5,
    },
  
    qtdContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#E6F2D8',
      borderRadius: 5,
      paddingHorizontal: 8,
      paddingVertical: 4,
      gap: 8,
    },
  
    qtd: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#4D7E1B',
    },
  
    footer: {
      borderTopWidth: 1,
      borderTopColor: '#eee',
      padding: 25,
      paddingBottom: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
  
    total: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#4D7E1B',
      marginBottom: height * 0.025,
    },
  
    continuar: {
      backgroundColor: '#4D7E1B',
      paddingVertical: 12,
      paddingHorizontal: 30,
      borderRadius: 25,
    },
  
    continuarText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
    },
  })
