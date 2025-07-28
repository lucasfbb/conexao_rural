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
import { useTema } from "@/contexts/ThemeContext";
import { geocodeEndereco, obterFrete } from '../../../services/utils';
import ModalPixPagamento from '@/components/modais/pagamentos/modalPixPagamento';

const { height } = Dimensions.get("window");

export default function Finalizacao() {
  const { user } = useUser();
  const { itens, limparCarrinho } = useCarrinho();
  const router = useRouter();
  const { colors } = useTema()
  const { enderecoId, pagamentoId } = useLocalSearchParams();

  const [alertPedido, setAlertPedido] = useState(false);
  const [enderecosProdutores, setEnderecosProdutores] = useState<{ [produtorId: number]: any }>({});
  const [enderecos, setEnderecos] = useState<EnderecoOut[]>([]);
  const [pagamentos, setPagamentos] = useState<FormaPagamentoOut[]>([]);
  const [enderecoSelecionado, setEnderecoSelecionado] = useState<EnderecoOut | null>(null);
  const [pagamentoSelecionado, setPagamentoSelecionado] = useState<FormaPagamentoOut | null>(null);

  const [fretesPorProdutor, setFretesPorProdutor] = useState<{ [chave: string]: number }>({});
  const [frete, setFrete] = useState<number>(0.00);

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

  const formatarEndereco = (e: EnderecoOut) =>
    `${e.rua}${e.numero ? `, ${e.numero}` : ''}${e.complemento ? `, ${e.complemento}` : ''}${e.cidade ? ` - ${e.cidade}` : ''}`;

  return (
    <>
      <SafeAreaView edges={["top"]} style={{ backgroundColor: '#4D7E1B' }} />
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["left", "right"]}>
        <View style={{ flex: 1 }}>
          <Header showGoBack />

          <ScrollView contentContainerStyle={{ padding: 25 }} showsVerticalScrollIndicator={false} bounces={false}>
            <Text style={[styles.title, { color: colors.text }]}>Finalização</Text>

            {/* Endereço selecionado */}
            <Text style={[styles.label, { color: colors.text }]}>Endereço de Entrega</Text>
            <View style={styles.card}>
              <Text style={styles.texto}>
                {enderecoSelecionado ? formatarEndereco(enderecoSelecionado) : 'Carregando...'}
              </Text>
            </View>

            {/* Resumo */}
            <View style={styles.resumo}>
              <View style={styles.linha}><Text style={[styles.label, { color: colors.text }]}>Subtotal</Text><Text style={[styles.valor, { color: colors.text }]}>R$ {subtotal.toFixed(2)}</Text></View>
              {/* <View style={styles.linha}><Text style={styles.label}>Frete</Text><Text style={styles.valor}>R$ {frete.toFixed(2)}</Text></View> */}
              
              {Object.entries(fretesPorProdutor).map(([chave, valor], idx) => {
                const produtorIdCorrespondente = Object.entries(enderecosProdutores).find(
                  ([_, endereco]) => `${endereco.latitude},${endereco.longitude}` === chave
                )?.[0];

                const item = itens.find(i => i.produtor_id.toString() === produtorIdCorrespondente);
                const nomeProdutor = item?.nome_produtor ?? `Produtor ${idx + 1}`;

                return (
                  <View style={styles.linha} key={chave}>
                    <Text style={[styles.label, { color: colors.text }]}>Frete ({nomeProdutor})</Text>
                    <Text style={[styles.valor, { color: colors.text }]}>R$ {valor.toFixed(2)}</Text>
                  </View>
                );
              })}

              <View style={styles.linha}><Text style={[styles.label, { fontWeight: 'bold', color: colors.text }]}>Total</Text><Text style={[styles.valor, { fontWeight: 'bold', color: colors.text }]}>R$ {total.toFixed(2)}</Text></View>
            </View>
          </ScrollView>

          {/* Rodapé */}
          <SafeAreaView style={styles.footer} edges={["bottom"]}>
            <Text style={[styles.total, { color: colors.text }]}>Total com entrega R$ {total.toFixed(2)}</Text>
            <TouchableOpacity style={styles.btnFinalizar} onPress={finalizarPedido}>
              <Text style={[styles.btnTexto, { color: colors.text }]}>Finalizar Pedido</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </View>

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
