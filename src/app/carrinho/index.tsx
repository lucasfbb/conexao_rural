import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Header from '@/components/header';
import { router } from 'expo-router';
import { useTema } from '@/contexts/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCarrinho } from '@/contexts/CarrinhoContext';

const { width, height } = Dimensions.get("window");

export default function Carrinho() {
  const { itens, alterarQuantidade, limparCarrinho } = useCarrinho();
  const { colors } = useTema();

  const aumentarQuantidade = (id: number) => {
    const item = itens.find(i => i.id_listagem === id);
    if (item) alterarQuantidade(id, item.qtd + 1);
  };

  const diminuirQuantidade = (id: number) => {
    const item = itens.find(i => i.id_listagem === id);
    if (item && item.qtd > 1) alterarQuantidade(id, item.qtd - 1);
  };

  const total = itens.reduce((acc, item) => acc + item.preco * item.qtd, 0);

  return (
    <>
      <SafeAreaView edges={["top"]} style={{ backgroundColor: '#4D7E1B' }} />

      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header />
        <Text style={[styles.title, { color: colors.title }]}>Carrinho</Text>

        <FlatList
          data={itens}
          keyExtractor={(item) => item.id_listagem.toString()}
          contentContainerStyle={{ padding: 15 }}
          renderItem={({ item }) => {
            // console.log("Item no carrinho:", item);

            return (
              <View style={[styles.produtoContainer, { backgroundColor: colors.produtoContainer }]}>
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
            );
          }}
        />
      </View>

      <SafeAreaView style={styles.footer} edges={["bottom"]}>
        <Text style={[styles.total, { color: colors.title }]}>
          Total sem entrega: R$ {total.toFixed(2)}
        </Text>

        <TouchableOpacity style={styles.continuar} onPress={() => router.push('/carrinho/confirmacao')}>
          <Text style={styles.continuarText}>Continuar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.continuar, { backgroundColor: '#999', marginTop: 10 }]}
          onPress={limparCarrinho}
        >
          <Text style={styles.continuarText}>Limpar Carrinho</Text>
        </TouchableOpacity>
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
});
