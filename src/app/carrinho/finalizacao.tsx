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

import { geocodeEndereco, obterFrete } from '../../../services/utils';

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

  const [fretesPorProdutor, setFretesPorProdutor] = useState<{ [chave: string]: number }>({});
  const [frete, setFrete] = useState<number>(0.00);
  const [distancia, setDistancia] = useState<number>(0);

  const subtotal = itens.reduce((acc, item) => acc + item.preco * item.qtd, 0);
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
        // console.log(itens)
        try {
          const resEnd = await api.get("usuarios/perfil/enderecos");
          setEnderecos(resEnd.data);
          if (resEnd.data.length > 0) setEnderecoSelecionado(resEnd.data[0]);

          const resPag = await api.get("usuarios/perfil/pagamentos");
          // console.log("Formas de pagamento:", resPag.data);
          setPagamentos(resPag.data);
          if (resPag.data.length > 0) setPagamentoSelecionado(resPag.data[0]);
        } catch (e) {
          console.error("Erro ao carregar endereços/pagamentos", e);
        }
      };
      carregarDados();
    }, []);

    useEffect(() => {
      const calcularFrete = async () => {
        let origemCliente = {
          latitude: enderecoSelecionado?.latitude,
          longitude: enderecoSelecionado?.longitude,
        };

        if (!origemCliente.latitude || !origemCliente.longitude) {
          // monta o endereço textual
          const textoEndereco = `${enderecoSelecionado?.rua ?? ''}, ${enderecoSelecionado?.numero ?? ''}, ${enderecoSelecionado?.bairro ?? ''}`;
          let coords = await geocodeEndereco(textoEndereco);

          // Se não encontrou, tenta só com o bairro
          if (!coords && enderecoSelecionado?.bairro) {
            console.warn("Endereço completo falhou. Tentando com apenas o bairro...");
            coords = await geocodeEndereco(enderecoSelecionado.bairro);
          }

          // Se ainda falhar, aborta
          if (!coords) {
            console.error("Não foi possível geocodificar o endereço do cliente.");
            return;
          }

          console.log("📍 Coordenadas do cliente:", coords);

          origemCliente = coords;
        }

        let totalFrete = 0;
        const fretesIndividuais: { [chave: string]: number } = {};
        const destinosUnicos = new Set();

        for (const item of itens) {
          const coords = item.endereco_produtor;
          if (!coords?.latitude || !coords?.longitude) continue;

          const chave = `${coords.latitude},${coords.longitude}`;
          if (destinosUnicos.has(chave)) continue;
          destinosUnicos.add(chave);

          const valor = obterFrete(
            { lat: origemCliente.latitude!, lon: origemCliente.longitude! },
            { lat: coords.latitude!, lon: coords.longitude! }
          );

          fretesIndividuais[chave] = valor;
          totalFrete += valor;
        }
        
        console.log("💰 Frete total calculado:", totalFrete);

        setFrete(totalFrete);
        setFretesPorProdutor(fretesIndividuais);
      };

      if (enderecoSelecionado && itens.length > 0) {
        calcularFrete();
      }
    }, [enderecoSelecionado, itens]);

  // const finalizarPedido = async () => {
  //   const payload = {
  //     cpf_usuario: user?.cpf_cnpj,
  //     id_endereco: enderecoSelecionado?.id,
  //     id_pagamento: pagamentoSelecionado?.id,
  //     itens: itens.map(i => ({
  //       id_listagem: i.id_listagem,
  //       quantidade: i.qtd
  //     }))
  //   };

  //   try {
  //     await api.post('/pedidos/', payload);
  //     limparCarrinho();
  //     Alert.alert("Sucesso", "Pedido finalizado com sucesso!");
  //     router.push('/home');
  //   } catch (error) {
  //     console.error(error);
  //     Alert.alert("Erro", "Falha ao finalizar pedido.");
  //   }
  // };

  const finalizarPedido = async () => {
    if (!pagamentoSelecionado || !enderecoSelecionado || !user) {
      Alert.alert("Erro", "Selecione endereço e forma de pagamento.");
      return;
    }

    const groupHash = Date.now().toString(36) + Math.random().toString(36).slice(2);

    const payload = {
      usuario_id: user?.id,
      id_endereco: enderecoSelecionado.id,
      id_pagamento: pagamentoSelecionado.id,
      group_hash: groupHash,
      itens: itens.map(i => ({
        id_listagem: i.id_listagem,
        quantidade: i.qtd
      }))
    };

    try {
      const resposta = await api.post('/pedidos/pagar', payload);

      if (resposta.data.status === 'aprovado') {
        limparCarrinho();
        Alert.alert("Sucesso", "Pagamento aprovado e pedido finalizado!");
        router.push('/home');
      } else {
        Alert.alert("Pagamento recusado", "Houve um problema ao processar o pagamento.");
      }
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
              {/* <View style={styles.linha}><Text style={styles.label}>Frete</Text><Text style={styles.valor}>R$ {frete.toFixed(2)}</Text></View> */}
              
              {Object.entries(fretesPorProdutor).map(([chave, valor], idx) => {
                const item = itens.find(i =>
                  `${i.endereco_produtor?.latitude},${i.endereco_produtor?.longitude}` === chave
                );

                const nomeProdutor = item?.nome_produtor ?? `Produtor ${idx + 1}`;

                return (
                  <View style={styles.linha} key={chave}>
                    <Text style={styles.label}>Frete ({nomeProdutor})</Text>
                    <Text style={styles.valor}>R$ {valor.toFixed(2)}</Text>
                  </View>
                );
              })}
              
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
