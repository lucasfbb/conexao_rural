import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import { api } from '../../../services/api';
import { PedidoOut } from '@/types/types';
import Header from '@/components/header';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTema } from '@/contexts/ThemeContext';

export default function AcompanhamentoPedidosScreen() {
  const [pedidos, setPedidos] = useState<PedidoOut[]>([]);
  const [loading, setLoading] = useState(true);
  const { isNightMode, colors } = useTema();
  
  useEffect(() => {
    const buscarPedidos = async () => {
      try {
        const res = await api.get('/pedidos/meus');
        setPedidos(res.data);
      } catch (err) {
        console.error("Erro ao buscar pedidos:", err);
      } finally {
        setLoading(false);
      }
    };

    buscarPedidos();
  }, []);

  return (
    <>
      <SafeAreaView edges={['top']} style={{ backgroundColor: '#4D7E1B' }} />
      <SafeAreaView edges={['left', 'right', 'bottom']} style={{ flex: 1, backgroundColor: colors.background }}>
        <Header />
        <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>
          <Text style={[styles.title, { color: colors.title }]}>Meus Pedidos</Text>

          {loading ? (
            <ActivityIndicator size="large" color="#4D7E1B" />
          ) : pedidos.length === 0 ? (
            <Text style={[styles.texto, { color: colors.title }]}>Você ainda não realizou nenhum pedido.</Text>
          ) : (
            pedidos.map((pedido) => (
              <View key={pedido.id} style={styles.card}>
                <Text style={styles.label}>Produtor:</Text>
                <Text style={styles.valor}>{pedido.nome_produtor}</Text>

                <Text style={styles.label}>Valor Total:</Text>
                <Text style={styles.valor}>R$ {pedido.valor.toFixed(2)}</Text>

                <Text style={styles.label}>Status:</Text>
                <Text style={[styles.valor, styles.status]}>{pedido.status}</Text>
              </View>
            ))
          )}
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 60,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    fontStyle: 'italic',
    marginBottom: 20,
    color: '#333',
  },
  card: {
    backgroundColor: '#F7FAF0',
    padding: 16,
    borderRadius: 10,
    marginBottom: 15,
  },
  label: {
    color: '#777',
    fontSize: 13,
  },
  valor: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#4D7E1B',
  },
  status: {
    textTransform: 'capitalize',
  },
  texto: {
    textAlign: 'center',
    color: '#555',
    fontSize: 16,
  },
});
