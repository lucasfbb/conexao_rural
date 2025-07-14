import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import Header from '@/components/header';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '@/contexts/UserContext';
import { useCarrinho } from '@/contexts/CarrinhoContext';
import { api } from '../../../services/api';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { EnderecoOut, FormaPagamentoOut } from '@/types/types';

const { height } = Dimensions.get("window");

export default function Finalizacao() {
  const { user } = useUser();
  const { itens, limparCarrinho } = useCarrinho();
  const router = useRouter();
  const { enderecoId, pagamentoId } = useLocalSearchParams();

  const [enderecos, setEnderecos] = useState<EnderecoOut[]>([]);
  const [pagamentos, setPagamentos] = useState<FormaPagamentoOut[]>([]);
  const [enderecoSelecionado, setEnderecoSelecionado] = useState<EnderecoOut | null>(null);
  const [pagamentoSelecionado, setPagamentoSelecionado] = useState<FormaPagamentoOut | null>(null);

  const subtotal = itens.reduce((acc, item) => acc + item.preco * item.qtd, 0);
  const frete = 10.00;
  const total = subtotal + frete;

  // useEffect(() => {
  //   const carregarDados = async () => {
  //     try {
  //       const resEnd = await api.get("usuarios/perfil/enderecos");
  //       setEnderecos(resEnd.data);
  //       const endereco = resEnd.data.find((e: EnderecoOut) => e.id === parseInt(enderecoId as string));
  //       setEnderecoSelecionado(endereco ?? null);

  //       const resPag = await api.get("usuarios/perfil/pagamentos");
  //       setPagamentos(resPag.data);
  //       const pagamento = resPag.data.find((p: FormaPagamentoOut) => p.id === parseInt(pagamentoId as string));
  //       setPagamentoSelecionado(pagamento ?? null);
  //     } catch (e) {
  //       console.error("Erro ao buscar dados", e);
  //     }
  //   };

  //   carregarDados();
  // }, [enderecoId, pagamentoId]);

    useEffect(() => {
      const carregarDados = async () => {
        try {
          const resEnd = await api.get("usuarios/perfil/enderecos");
          setEnderecos(resEnd.data);
          if (resEnd.data.length > 0) setEnderecoSelecionado(resEnd.data[0]);

          const resPag = await api.get("usuarios/perfil/pagamentos");
          console.log("Formas de pagamento:", resPag.data);
          setPagamentos(resPag.data);
          if (resPag.data.length > 0) setPagamentoSelecionado(resPag.data[0]);
        } catch (e) {
          console.error("Erro ao carregar endereços/pagamentos", e);
        }
      };
      carregarDados();
    }, []);

  const finalizarPedido = async () => {
    const payload = {
      cpf_usuario: user?.cpf_cnpj,
      id_endereco: enderecoSelecionado?.id,
      id_pagamento: pagamentoSelecionado?.id,
      itens: itens.map(i => ({
        id_listagem: i.id_listagem,
        quantidade: i.qtd
      }))
    };

    try {
      await api.post('/pedidos/', payload);
      limparCarrinho();
      Alert.alert("Sucesso", "Pedido finalizado com sucesso!");
      router.push('/home');
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Falha ao finalizar pedido.");
    }
  };

  const formatarEndereco = (e: EnderecoOut) =>
    `${e.rua}${e.numero ? `, ${e.numero}` : ''}${e.complemento ? `, ${e.complemento}` : ''}${e.cidade ? ` - ${e.cidade}` : ''}`;

  const formatarCartao = (c: FormaPagamentoOut) =>
    `${c.bandeira ?? ''} •••• ${c.final_cartao?.slice(-4) ?? '0000'}`;

  return (
    <>
      <SafeAreaView edges={["top"]} style={{ backgroundColor: '#4D7E1B' }} />
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} edges={["left", "right"]}>
        <View style={{ flex: 1 }}>
          <Header showGoBack />

          <ScrollView contentContainerStyle={{ padding: 25 }} showsVerticalScrollIndicator={false} bounces={false}>
            <Text style={styles.title}>Finalização</Text>

            {/* Endereço selecionado */}
            <Text style={styles.label}>Endereço de Entrega</Text>
            <View style={styles.card}>
              <Text style={styles.texto}>
                {enderecoSelecionado ? formatarEndereco(enderecoSelecionado) : 'Carregando...'}
              </Text>
            </View>

            {/* Pagamento selecionado */}
            <Text style={[styles.label, { marginTop: 20 }]}>Forma de Pagamento</Text>
            <View style={styles.card}>
              <Text style={styles.texto}>
                {pagamentoSelecionado ? formatarCartao(pagamentoSelecionado) : 'Carregando...'}
              </Text>
            </View>

            {/* Resumo */}
            <View style={styles.resumo}>
              <View style={styles.linha}><Text style={styles.label}>Subtotal</Text><Text style={styles.valor}>R$ {subtotal.toFixed(2)}</Text></View>
              <View style={styles.linha}><Text style={styles.label}>Frete</Text><Text style={styles.valor}>R$ {frete.toFixed(2)}</Text></View>
              <View style={styles.linha}><Text style={[styles.label, { fontWeight: 'bold' }]}>Total</Text><Text style={[styles.valor, { fontWeight: 'bold' }]}>R$ {total.toFixed(2)}</Text></View>
            </View>
          </ScrollView>

          {/* Rodapé */}
          <SafeAreaView style={styles.footer} edges={["bottom"]}>
            <Text style={styles.total}>Total com entrega R$ {total.toFixed(2)}</Text>
            <TouchableOpacity style={styles.btnFinalizar} onPress={finalizarPedido}>
              <Text style={styles.btnTexto}>Finalizar Pedido</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: 'bold', fontStyle: 'italic', marginBottom: 20 },
  label: { fontSize: 14, color: '#555', marginBottom: 6 },
  card: {
    backgroundColor: '#F7FAF0',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  texto: { color: '#4D7E1B', fontWeight: 'bold' },
  resumo: { marginTop: 20, marginBottom: 20 },
  linha: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 3 },
  valor: { fontSize: 14, color: '#555' },
  footer: { alignItems: 'center', gap: 10, marginBottom: height * 0.05 },
  total: { fontSize: 14, color: '#4D7E1B', marginBottom: 10 },
  btnFinalizar: { backgroundColor: '#4D7E1B', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 25 },
  btnTexto: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});
