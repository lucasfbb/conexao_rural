import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import Header from '@/components/header';
import { useTema } from '@/contexts/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get("window");

export default function Finalizacao() {

  const { colors } = useTema()

  const produtor = {
    nome: 'Produtor 001',
    subtitulo: 'Voltar para loja',
  };

  const endereco = 'Minha Localização';
  const pagamento = 'Meu cartão';
  const data = '28/02/2025';
  const subtotal = 40.00;
  const frete = 10.00;
  const total = subtotal + frete;

  return (
      <>

        <SafeAreaView
            edges={["top"]}
            style={{ backgroundColor: '#4D7E1B' }} 
        />

        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["left", "right"]}>
          <View style={{ flex: 1 }}>
            <Header showGoBack />

            <ScrollView contentContainerStyle={{  padding: 25 }} showsVerticalScrollIndicator={false} bounces={false} >
            
                <Text style={[styles.title, { color: colors.title }]}>Finalização</Text>

                {/* Produtor */}
                <View style={styles.produtorContainer}>
                  <View style={styles.logo} />
                  <View>
                    <Text style={styles.produtorNome}>{produtor.nome}</Text>
                    <Text style={styles.produtorVoltar}>{produtor.subtitulo}</Text>
                  </View>
                </View>

                {/* Resumo */}
                <Text style={[styles.sectionTitle, { color: colors.title }]}>Resumo</Text>
                <View style={styles.resumo}>
                  <View style={styles.linha}>
                    <Text style={styles.label}>Subtotal</Text>
                    <Text style={styles.valor}>R$ {subtotal.toFixed(2)}</Text>
                  </View>
                  <View style={styles.linha}>
                    <Text style={styles.label}>Frete</Text>
                    <Text style={styles.valor}>R$ {frete.toFixed(2)}</Text>
                  </View>
                  <View style={styles.linha}>
                    <Text style={[styles.label, { fontWeight: 'bold' }]}>Total</Text>
                    <Text style={[styles.valor, { fontWeight: 'bold' }]}>R$ {total.toFixed(2)}</Text>
                  </View>
                </View>

                {/* Informações adicionais */}
                <View style={styles.infosContainer}>
                  <View style={styles.infoItem}>
                    <Feather name="map-pin" size={18} color="#4D7E1B" />
                    <Text style={styles.infoText}>{endereco}</Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Feather name="credit-card" size={18} color="#4D7E1B" />
                    <Text style={styles.infoText}>{pagamento}</Text>
                  </View>
                  <View style={styles.infoItem}>
                    <MaterialIcons name="calendar-today" size={18} color="#4D7E1B" />
                    <Text style={styles.infoText}>{data}</Text>
                  </View>
                </View>

                
            </ScrollView>

            {/* Rodapé */}
            <SafeAreaView style={styles.footer} edges={["bottom"]}>
              <Text style={styles.total}>Total com entrega R$ {total.toFixed(2)}</Text>
              <TouchableOpacity style={styles.btnFinalizar}>
                <Text style={styles.btnTexto}>Finalizar Pedido</Text>
              </TouchableOpacity>
            </SafeAreaView>

          </View>

        </SafeAreaView>
      </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#4D7E1B', fontStyle: 'italic', marginTop: 10, marginBottom: 20 },
  produtorContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 10 },
  logo: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#ccc' },
  produtorNome: { fontSize: 16, color: '#4D7E1B', fontWeight: 'bold' },
  produtorVoltar: { fontSize: 12, color: '#777', fontStyle: 'italic' },
  sectionTitle: { fontSize: 18, color: '#4D7E1B', fontWeight: 'bold', fontStyle: 'italic', marginBottom: 10 },
  resumo: { marginBottom: 20 },
  linha: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 3 },
  label: { fontSize: 14, color: '#555' },
  valor: { fontSize: 14, color: '#555' },
  infosContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 25 },
  infoItem: { alignItems: 'center', gap: 4 },
  infoText: { fontSize: 12, color: '#4D7E1B', textAlign: 'center' },
  footer: { alignItems: 'center', gap: 10 },
  total: { fontSize: 14, color: '#4D7E1B', marginBottom: 10 },
  btnFinalizar: { backgroundColor: '#4D7E1B', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 25 },
  btnTexto: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});
