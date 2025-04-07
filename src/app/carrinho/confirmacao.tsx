// app/home/confirmacao.tsx
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';
import Header from '@/components/header';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTema } from '@/contexts/ThemeContext';

const { width, height } = Dimensions.get("window");

export default function Confirmacao() {
  const router = useRouter();

  const { colors } = useTema()

  const endereco = {
    local: 'Minha Localização',
    rua: 'Rua Teste 145',
    cidade: 'Rio de Janeiro - Rio de Janeiro',
    complemento: 'Bloco H'
  };

  const dataEntrega = '28/02/2025';
  const frete = 10.00;

  const pagamento = {
    tipo: 'Crédito',
    final: '9999'
  };

  const total = 40.00;
  const totalFinal = total + frete;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header showGoBack />
      <View style={{ padding:25 }}>
      <Text style={[styles.titulo, { color: colors.title }]}>Carrinho</Text>

      {/* Endereço */}
      <Text style={[styles.label, { color: colors.title }]}>Endereço entrega</Text>
      <View style={[styles.card, { backgroundColor: colors.produtoContainer }]}>
        <View style={styles.row}>
          <Feather name="map-pin" size={20} color="#4D7E1B" />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.texto}>{endereco.local}</Text>
            <Text style={styles.subtexto}>{endereco.rua}</Text>
            <Text style={styles.subtexto}>{endereco.cidade}</Text>
            <Text style={styles.subtexto}>{endereco.complemento}</Text>
          </View>
        </View>
      </View>

      {/* Data */}
      <Text style={[styles.label, { color: colors.title }]}>Data de entrega</Text>
      <View style={[styles.card, { backgroundColor: colors.produtoContainer }]}>
        <View style={styles.row}>
          <MaterialIcons name="calendar-today" size={20} color="#4D7E1B" />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.texto}>{dataEntrega}</Text>
            <Text style={styles.subtexto}>Frete: R$ {frete.toFixed(2)}</Text>
          </View>
        </View>
      </View>

      {/* Pagamento */}
      <Text style={[styles.label, { color: colors.title }]}>Forma de pagamento</Text>
      <View style={[styles.card, { backgroundColor: colors.produtoContainer }]}>
        <View style={styles.row}>
          <Feather name="credit-card" size={20} color="#4D7E1B" />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.texto}>Meu cartão - {pagamento.tipo}</Text>
            <Text style={styles.subtexto}>●●●● {pagamento.final}</Text>
            <TouchableOpacity><Text style={styles.trocar}>Trocar</Text></TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Total */}
      <View style={styles.totalContainer}>
        <Text style={styles.total}>Total com entrega</Text>
        <Text style={styles.totalValor}>R$ {totalFinal.toFixed(2)}</Text>
      </View>

      <TouchableOpacity style={styles.botao} onPress={() => router.push('/carrinho/finalizacao')}>
        <Text style={styles.botaoTexto}>Confirmar Pedido</Text>
      </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff'},
  titulo: { fontSize: 22, fontWeight: 'bold', color: '#4D7E1B', marginBottom: height * 0.015, fontStyle: 'italic' },
  label: { fontSize: 16, fontWeight: 'bold', marginTop: height * 0.025, marginBottom: height * 0.01 },
  card: {
    backgroundColor: '#F7FAF0',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  texto: { color: '#4D7E1B', fontWeight: 'bold' },
  subtexto: { color: '#555', fontSize: 12 },
  trocar: { marginTop: height * 0.008, color: '#4D7E1B', textDecorationLine: 'underline' },
  totalContainer: { marginTop: height * 0.05, alignItems: 'center' },
  total: { fontSize: 14, color: '#777' },
  totalValor: { fontSize: 20, color: '#4D7E1B', fontWeight: 'bold', marginBottom: height * 0.045 },
  botao: {
    backgroundColor: '#4D7E1B',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignSelf: 'center'
  },
  botaoTexto: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});
