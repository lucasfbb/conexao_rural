import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Dimensions, ScrollView, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Header from '@/components/header';
import { router } from 'expo-router';
import { useTema } from '@/contexts/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ItemCarrinho, useCarrinho } from '@/contexts/CarrinhoContext';
import { useEffect, useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { api } from '../../../services/api';
import AwesomeAlert from 'react-native-awesome-alerts';

const { width, height } = Dimensions.get("window");

export default function Carrinho() {
  const { itens, alterarQuantidade, limparCarrinho } = useCarrinho();
  const { user } = useUser();
  const { colors } = useTema();

  const [alertSemEndereco, setAlertSemEndereco] = useState(false);

  // useEffect(() => {
  //   console.log("Itens no carrinho:", itens);  
  // }, [itens]);

  const aumentarQuantidade = (id: number) => {
    const item = itens.find(i => i.id_listagem === id);
    if (item) alterarQuantidade(id, item.qtd + 1);
  };

  const diminuirQuantidade = (id: number) => {
    const item = itens.find(i => i.id_listagem === id);
    if (item && item.qtd > 1) alterarQuantidade(id, item.qtd - 1);
  };

  const total = itens.reduce((acc, item) => acc + item.preco * item.qtd, 0);

  const itensAgrupados: Record<number, ItemCarrinho[]> = itens.reduce((acc, item) => {
    const produtorId = item.produtor_id ?? 0;
    if (!acc[produtorId]) acc[produtorId] = [];
    acc[produtorId].push(item);
    return acc;
  }, {} as Record<number, ItemCarrinho[]>);


  const continuarConfirmacao = async () => {
    if (!user?.id) {
      Alert.alert("Erro", "Usuário não identificado.");
      return;
    }

    try {
      const response = await api.get(`usuarios/perfil/${user.id}/tem-endereco`);

      if (response.data?.tem_endereco) {
        router.push('/carrinho/confirmacao');
      } else {
        setAlertSemEndereco(true);
      }
    } catch (error) {
      console.error("Erro ao verificar endereços:", error);
      Alert.alert("Erro", "Não foi possível verificar os endereços.");
    }
  };

  return (
    <>
      <SafeAreaView edges={["top"]} style={{ backgroundColor: '#4D7E1B' }} />

      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header />
        <Text style={[styles.title, { color: colors.title }]}>Carrinho</Text>

        {itens.length === 0 ? (
          <View style={styles.vazioContainer}>
            <Image
              source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2038/2038854.png' }}
              style={styles.imagemVazia}
              resizeMode="contain"
            />
            <Text style={styles.mensagemVazio}>Seu carrinho está vazio...</Text>
            <Text style={styles.mensagemVazio}>Que tal adicionar alguma coisa? 🛒</Text>
          </View>
        ) : (

          // <FlatList
          //   data={itens}
          //   keyExtractor={(item) => item.id_listagem.toString()}
          //   contentContainerStyle={{ padding: 15 }}
          //   renderItem={({ item }) => {
          //     // console.log("Item no carrinho:", item);

          //     return (
          //       <View style={[styles.produtoContainer, { backgroundColor: colors.produtoContainer }]}>
          //         <Image source={item.imagem} style={styles.img} />
          //         <View style={{ flex: 1 }}>
          //           <Text style={[styles.nome, { color: colors.title }]}>{item.nome}</Text>
          //           <Text style={styles.preco}>
          //             R$ {typeof item.preco === "number" ? item.preco.toFixed(2) : "0,00"}
          //           </Text>
          //         </View>
          //         <View style={styles.qtdContainer}>
          //           <TouchableOpacity onPress={() => diminuirQuantidade(item.id_listagem)}>
          //             <Feather name="minus" size={18} />
          //           </TouchableOpacity>
          //           <Text style={styles.qtd}>{item.qtd}</Text>
          //           <TouchableOpacity onPress={() => aumentarQuantidade(item.id_listagem)}>
          //             <Feather name="plus" size={18} />
          //           </TouchableOpacity>
          //         </View>
          //       </View>
          //     );
          //   }}
          // />

          <ScrollView contentContainerStyle={{ padding: 15 }}>
            {Object.entries(itensAgrupados).map(([produtorId, lista]) => (
              <View key={produtorId}>
                <Text style={{ fontWeight: 'bold', marginBottom: 10, fontSize: 16 }}>
                  Produtos do produtor #{produtorId}
                </Text>

                {lista.map((item) => (
                  <View key={item.id_listagem} style={[styles.produtoContainer, { backgroundColor: colors.produtoContainer }]}>
                    <Image source={item.imagem} style={styles.img} />
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.nome, { color: colors.title }]}>{item.nome}</Text>
                      <Text style={styles.preco}>
                        R$ {typeof item.preco === "number" ? item.preco.toFixed(2) : "0,00"}
                      </Text>
                    </View>
                    <View style={styles.qtdContainer}>
                      <TouchableOpacity onPress={() => diminuirQuantidade(item.id_listagem)}>
                        <Feather name="minus" size={18} />
                      </TouchableOpacity>
                      <Text style={styles.qtd}>{item.qtd}</Text>
                      <TouchableOpacity onPress={() => aumentarQuantidade(item.id_listagem)}>
                        <Feather name="plus" size={18} />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            ))}
          </ScrollView>

        )}
      </View>

      <SafeAreaView style={[styles.footer, { backgroundColor: colors.produtoContainer }]} edges={["bottom"]}>
        <Text style={[styles.total, { color: colors.title }]}>
          Total sem entrega: R$ {total.toFixed(2)}
        </Text>

        <TouchableOpacity
          style={[
            styles.continuar,
            { backgroundColor: itens.length === 0 ? '#ccc' : '#4D7E1B' }
          ]}
          onPress={continuarConfirmacao}
          disabled={itens.length === 0}
        >
          <Text style={styles.continuarText}>Continuar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.continuar, { backgroundColor: '#999', marginTop: 10 }]}
          onPress={limparCarrinho}
        >
          <Text style={styles.continuarText}>Limpar Carrinho</Text>
        </TouchableOpacity>

        <AwesomeAlert
          show={alertSemEndereco}
          showCancelButton={true}
          showConfirmButton={true}
          title="Endereço necessário"
          message="Você precisa cadastrar ao menos um endereço para continuar."
          confirmText="Me leve lá"
          cancelText="OK"
          confirmButtonColor="#4D7E1B"
          cancelButtonColor="#999"
          onCancelPressed={() => setAlertSemEndereco(false)}
          onConfirmPressed={() => {
            setAlertSemEndereco(false);
            router.push('/perfil'); // ou a rota correta do perfil
          }}
          titleStyle={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}
          messageStyle={{ fontSize: 16, textAlign: 'center' }}
          contentStyle={{
            padding: 20,
            borderRadius: 10,
            width: 300,
            backgroundColor: '#fff'
          }}
        />

      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  title: {
    fontSize: 22, fontWeight: 'bold', color: '#4D7E1B', fontStyle: 'italic',
    marginTop: height * 0.03, marginLeft: 20, marginBottom: height * 0.005
  },
  produtoContainer: {
    flexDirection: 'row', alignItems: 'center', borderRadius: 10,
    padding: 10, marginBottom: height * 0.015, gap: 10,
  },
  img: { width: 60, height: 60, borderRadius: 8, backgroundColor: '#ddd' },
  nome: { fontSize: 16, fontWeight: 'bold', color: '#4D7E1B' },
  preco: { fontSize: 14, color: '#4D7E1B', marginTop: 5 },
  qtdContainer: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#E6F2D8',
    borderRadius: 5, paddingHorizontal: 8, paddingVertical: 4, gap: 8
  },
  qtd: { fontSize: 16, fontWeight: 'bold', color: '#4D7E1B' },
  footer: {
    borderTopWidth: 1, borderTopColor: '#eee',
    padding: 25, paddingBottom: 40, alignItems: 'center', justifyContent: 'center',
  },
  total: { fontSize: 16, fontWeight: 'bold', color: '#4D7E1B', marginBottom: height * 0.025 },
  continuar: { backgroundColor: '#4D7E1B', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 25 },
  continuarText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  vazioContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40
  },
  imagemVazia: {
    width: 180,
    height: 180,
    marginBottom: 20
  },
  mensagemVazio: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginBottom: 5
  }
});
