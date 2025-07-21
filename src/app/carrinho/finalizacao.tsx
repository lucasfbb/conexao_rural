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
import AwesomeAlert from 'react-native-awesome-alerts';

import { geocodeEndereco, obterFrete } from '../../../services/utils';
import ModalPixPagamento from '@/components/modais/pagamentos/modalPixPagamento';

const { height } = Dimensions.get("window");

export default function Finalizacao() {
  const { user } = useUser();
  const { itens, limparCarrinho } = useCarrinho();
  const router = useRouter();

  const { enderecoId, pagamentoId } = useLocalSearchParams();

  const [alertPedido, setAlertPedido] = useState(false);
  const [enderecosProdutores, setEnderecosProdutores] = useState<{ [produtorId: number]: any }>({});
  const [enderecos, setEnderecos] = useState<EnderecoOut[]>([]);
  const [pagamentos, setPagamentos] = useState<FormaPagamentoOut[]>([]);
  const [enderecoSelecionado, setEnderecoSelecionado] = useState<EnderecoOut | null>(null);
  const [pagamentoSelecionado, setPagamentoSelecionado] = useState<FormaPagamentoOut | null>(null);

  const [fretesPorProdutor, setFretesPorProdutor] = useState<{ [chave: string]: number }>({});
  const [frete, setFrete] = useState<number>(0.00);
  const [distancia, setDistancia] = useState<number>(0);

  const [modalPixVisivel, setModalPixVisivel] = useState(false);
  const [dadosPix, setDadosPix] = useState<any>(null);

  const subtotal = itens.reduce((acc, item) => acc + item.preco * item.qtd, 0);
  const total = subtotal + frete;

  useEffect(() => {
    const buscarEnderecosProdutores = async () => {
      const resultado: { [produtorId: number]: any } = {};
      const produtoresUnicos = [...new Set(itens.map(i => i.produtor_id))];

      for (const id of produtoresUnicos) {
        try {
          const res = await api.get(`/produtores/${id}/endereco-coordenadas`);
          const enderecoTexto = `${res.data.rua ?? ''}, ${res.data.numero ?? ''}, ${res.data.bairro ?? ''}`;
          
          console.log('Endereco texto ', enderecoTexto)
          let coords = await geocodeEndereco(enderecoTexto);
          console.log('Coordenadas encontradas ', coords)

          if (!coords && res.data.bairro) {
            console.warn("Geocodificação do endereço completo falhou. Tentando com bairro...");
            coords = await geocodeEndereco(res.data.bairro);
          }

          if (coords) {
            resultado[id] = {
              latitude: coords.latitude,
              longitude: coords.longitude,
              nome: res.data.nome ?? '', // opcional para exibição
            };
          }
        } catch (e) {
          console.error(`Erro ao buscar endereço do produtor ${id}`, e);
        }
      }

      setEnderecosProdutores(resultado);
    };

    if (itens.length > 0) {
      buscarEnderecosProdutores();
    }
  }, [itens]);

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

        // console.log("Itens do carrinho:", itens);
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

        // console.log("📍 Coordenadas do cliente:", coords);

        origemCliente = coords;
      }

      let totalFrete = 0;
      const fretesIndividuais: { [chave: string]: number } = {};
      const destinosUnicos = new Set();

      for (const item of itens) {
        const coords = enderecosProdutores[item.produtor_id];

        // console.log('Coordenadas do produtor ',coords)
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
      
      // console.log("💰 Frete total calculado:", totalFrete);

      setFrete(totalFrete);
      setFretesPorProdutor(fretesIndividuais);
    };

    if (enderecoSelecionado && itens.length > 0) {
      calcularFrete();
    }
  }, [enderecoSelecionado, itens, enderecosProdutores]);

  // const finalizarPedido = async () => {
  //   if (!pagamentoSelecionado || !enderecoSelecionado || !user) {
  //     Alert.alert("Erro", "Selecione endereço e forma de pagamento.");
  //     return;
  //   }

  //   const groupHash = Date.now().toString(36) + Math.random().toString(36).slice(2);

  //   const payload = {
  //     usuario_id: user?.id,
  //     id_endereco: enderecoSelecionado.id,
  //     id_pagamento: pagamentoSelecionado.id,
  //     group_hash: groupHash,
  //     itens: itens.map(i => ({
  //       id_listagem: i.id_listagem,
  //       quantidade: i.qtd
  //     }))
  //   };

  //   try {
  //     const resposta = await api.post('/pedidos/pagar', payload);

  //     if (resposta.data.status === 'aprovado') {
  //       limparCarrinho();
  //       Alert.alert("Sucesso", "Pagamento aprovado e pedido finalizado!");
  //       router.push('/home');
  //     } else {
  //       Alert.alert("Pagamento recusado", "Houve um problema ao processar o pagamento.");
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     Alert.alert("Erro", "Falha ao finalizar pedido.");
  //   }
  // };

  // const finalizarPedido = async () => {
  //   if (!pagamentoSelecionado || !enderecoSelecionado || !user) {
  //     Alert.alert("Erro", "Selecione endereço e forma de pagamento.");
  //     return;
  //   }

  //   const groupHash = Date.now().toString(36) + Math.random().toString(36).slice(2);

  //   const payload = {
  //     usuario_id: user.id,
  //     id_endereco: enderecoSelecionado.id,
  //     id_pagamento: pagamentoSelecionado.id,
  //     group_hash: groupHash,
  //     itens: itens.map(i => ({
  //       id_listagem: i.id_listagem,
  //       quantidade: i.qtd
  //     }))
  //   };

  //   try {
  //     const resposta = await api.post('/pedidos/pagar_pix', payload);
  //     setDadosPix(resposta.data);
  //     setModalPixVisivel(true);
  //     limparCarrinho();
  //   } catch (error) {
  //     console.error(error);
  //     Alert.alert("Erro", "Falha ao iniciar pagamento via PIX.");
  //   }
  // };

  const finalizarPedido = async () => {
    if (!enderecoSelecionado || !user) {
      Alert.alert("Erro", "Endereço não selecionado.");
      return;
    }

    const groupHash = Date.now().toString(36) + Math.random().toString(36).slice(2);

    const payload = {
      id_endereco: enderecoSelecionado.id,
      group_hash: groupHash,
      valor: total,
      itens: itens.map(i => ({
        id_listagem: i.id_listagem,
        quantidade: i.qtd
      }))
    };

    try {
      // Cria o pedido
      await api.post("/pedidos/novo", payload);

      // Cria a notificação
      await api.post("/notificacoes", {
        usuario_id: user.id, // ou remova se o backend já identifica pelo token
        titulo: "Pedido Confirmado!",
        mensagem: "Seu pedido foi realizado com sucesso e está em andamento.",
        tipo: "pedido"
      });

      limparCarrinho();

      setTimeout(() => {
        setAlertPedido(true);
      }, 200);
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Falha ao registrar pedido.");
    }
  };

  // useEffect(() => {
  //   let intervalo: any;

  //   if (modalPixVisivel && dadosPix?.id_pagamento) {
  //     intervalo = setInterval(async () => {
  //       try {
  //         const resp = await api.get(`/pagamento/status/${dadosPix.id_pagamento}`);
  //         const status = resp.data.status;
  //         console.log("📦 Status atual do PIX:", status);

  //         if (status === "approved") {
  //           clearInterval(intervalo);
  //           Alert.alert("Pagamento Aprovado", "Seu pagamento foi confirmado!");
  //           setModalPixVisivel(false);
  //           router.push('/home');
  //         } else if (status === "rejected") {
  //           clearInterval(intervalo);
  //           Alert.alert("Pagamento Recusado", "Houve um problema com o pagamento via PIX.");
  //         }

  //         // Você pode exibir o status dinamicamente no modal se quiser
  //       } catch (e) {
  //         console.error("Erro ao consultar status do pagamento:", e);
  //       }
  //     }, 10000); // 10 segundos
  //   }

  //   return () => clearInterval(intervalo);
  // }, [modalPixVisivel, dadosPix?.id_pagamento]);


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
                const produtorIdCorrespondente = Object.entries(enderecosProdutores).find(
                  ([_, endereco]) => `${endereco.latitude},${endereco.longitude}` === chave
                )?.[0];

                const item = itens.find(i => i.produtor_id.toString() === produtorIdCorrespondente);
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
{/* 
        <ModalPixPagamento
          visible={modalPixVisivel}
          onClose={() => setModalPixVisivel(false)}
          qrCodeBase64={dadosPix?.qr_code_base64}
          qrCodeText={dadosPix?.qr_code}
          valor={dadosPix?.valor}
          status={dadosPix?.status}
        /> */}

        <AwesomeAlert
          show={alertPedido}
          showCancelButton={true}
          showConfirmButton={true}
          title="Pedido confirmado!"
          message="Seu pedido foi registrado com sucesso."
          confirmText="Acompanhar"
          cancelText="OK"
          confirmButtonColor="#4D7E1B"
          cancelButtonColor="#999"
          onCancelPressed={() => {
            setAlertPedido(false)
            router.push('/carrinho');
            router.push('/home')
          }}
          onConfirmPressed={() => {
            setAlertPedido(false);
            router.push('/pedidos');
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
