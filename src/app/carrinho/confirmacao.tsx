// app/home/confirmacao.tsx
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Header from '@/components/header';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTema } from '@/contexts/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCarrinho } from '@/contexts/CarrinhoContext';
import { useEffect, useState } from 'react';
import { api } from '../../../services/api';
import { Picker } from '@react-native-picker/picker';

const { width, height } = Dimensions.get("window");

const formatarEndereco = (e: any) =>
  `${e.rua}${e.complemento ? `, ${e.complemento}` : ''}${e.cidade ? ` - ${e.cidade}` : ''}`;

const formatarCartao = (c: any) =>
  `${c.bandeira ?? ''} •••• ${c.final_cartao?.slice(-4) ?? '0000'}`;

export default function Confirmacao() {
  const router = useRouter();
  const { colors } = useTema();
  const { itens } = useCarrinho();

  const [enderecos, setEnderecos] = useState<any[]>([]);
  const [pagamentos, setPagamentos] = useState<any[]>([]);
  const [enderecoSelecionado, setEnderecoSelecionado] = useState<number | null>(null);
  const [pagamentoSelecionado, setPagamentoSelecionado] = useState<number | null>(null);
  const [escolhaForma, setEscolhaForma] = useState<string>('cartao'); // default: cartão

  const subtotal = itens.reduce((acc, item) => acc + item.preco * item.qtd, 0);
  const totalFinal = subtotal;

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const resEnd = await api.get("usuarios/perfil/enderecos");
        setEnderecos(resEnd.data);
        if (resEnd.data.length > 0) setEnderecoSelecionado(resEnd.data[0].id);

        const resPag = await api.get("usuarios/perfil/pagamentos");
        setPagamentos(resPag.data);
        if (resPag.data.length > 0) setPagamentoSelecionado(resPag.data[0].id);
      } catch (e) {
        console.error("Erro ao carregar endereços/pagamentos", e);
      }
    };
    carregarDados();
  }, []);

  return (
    <>
      <SafeAreaView edges={["top"]} style={{ backgroundColor: '#4D7E1B' }} />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header showGoBack />
        <View style={{ padding: 25 }}>
          <Text style={[styles.titulo, { color: colors.title }]}>Carrinho</Text>

          {/* Endereço */}
          <Text style={[styles.label, { color: colors.title }]}>Endereço entrega</Text>
          <View style={styles.selectContainer}>
            <Picker
              selectedValue={enderecoSelecionado}
              onValueChange={setEnderecoSelecionado}
              style={styles.picker}
            >
              {enderecos.map(e => (
                <Picker.Item key={e.id} label={formatarEndereco(e)} value={e.id} />
              ))}
            </Picker>
          </View>

          {/* Data */}
          <Text style={[styles.label, { color: colors.title }]}>Data de entrega</Text>
          <View style={[styles.card, { backgroundColor: colors.produtoContainer }]}>
            <View style={styles.row}>
              <MaterialIcons name="calendar-today" size={20} color="#4D7E1B" />
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.texto}>28/02/2025</Text>
              </View>
            </View>
          </View>

          {/* Tipo de pagamento */}
          <Text style={[styles.label, { color: colors.title }]}>Tipo de pagamento</Text>
          <View style={styles.selectContainer}>
            <Picker
              selectedValue={escolhaForma}
              onValueChange={setEscolhaForma}
              style={styles.picker}
            >
              <Picker.Item label="Cartão de Crédito" value="cartao" />
              <Picker.Item label="Pix" value="pix" />
            </Picker>
          </View>

          {/* Se for cartão, mostra picker dos cartões */}
          {escolhaForma === 'cartao' && (
            <>
              <Text style={[styles.label, { color: colors.title }]}>Cartões Salvos</Text>
              <View style={styles.selectContainer}>
                <Picker
                  selectedValue={pagamentoSelecionado}
                  onValueChange={setPagamentoSelecionado}
                  style={styles.picker}
                >
                  {pagamentos.map(p => (
                    <Picker.Item key={p.id} label={formatarCartao(p)} value={p.id} />
                  ))}
                </Picker>
              </View>
            </>
          )}

          {/* Total */}
          <View style={styles.totalContainer}>
            <Text style={styles.total}>Total</Text>
            <Text style={styles.totalValor}>R$ {totalFinal.toFixed(2)}</Text>
          </View>

          <TouchableOpacity
            style={styles.botao}
            onPress={() => {
              router.push({
                pathname: '/carrinho/finalizacao',
                params: {
                  endereco_id: enderecoSelecionado,
                  pagamento_id: pagamentoSelecionado
                }
              });
            }}
          >
            <Text style={styles.botaoTexto}>Confirmar Pedido</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  titulo: { fontSize: 22, fontWeight: 'bold', marginBottom: height * 0.015, fontStyle: 'italic' },
  label: { fontSize: 16, fontWeight: 'bold', marginTop: height * 0.025, marginBottom: height * 0.01 },
  card: {
    borderRadius: 10, padding: 15,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1, shadowRadius: 3, elevation: 2,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  texto: { color: '#4D7E1B', fontWeight: 'bold' },
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
  botaoTexto: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  selectContainer: {
    backgroundColor: '#F7FAF0',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  picker: {
    height: 50,
    width: '100%',
    color: '#4D7E1B',
  }
});
