import { useEffect, useState, useRef } from "react";
import MapView, { Marker } from "react-native-maps";
import { View, StyleSheet, Text, Dimensions, ActivityIndicator, Linking } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from "expo-location";
import { api } from "../../../services/api";
import Header from "@/components/header";
import Button from "@/components/button";
import { useTema } from "@/contexts/ThemeContext";
import { router, useLocalSearchParams } from "expo-router";

const { height, width } = Dimensions.get('window');

export default function LocalizacaoProdutor() {
  const params = useLocalSearchParams();
  const { usuario_id } = params;

  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [coordenadas, setCoordenadas] = useState<Location.LocationGeocodedLocation | null>(null);
  const [carregando, setCarregando] = useState(true);
  const { colors } = useTema();
  const mapRef = useRef<MapView>(null);

  const [endereco, setEndereco] = useState({
    cidade: '',
    estado: '',
    rua_numero: '',
    complemento: '',
    cep: '',
  });

  const abrirNoGoogleMaps = (latitude: number, longitude: number) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    Linking.openURL(url);
  };

  useEffect(() => {
    const carregarLocalizacoes = async () => {
      try {
        const resProdutor = await api.get(`/produtores/${usuario_id}`);
        const produtorData = resProdutor.data;

        const enderecoTexto = `${produtorData?.rua ?? ''}, ${produtorData?.numero ?? ''} - ${produtorData?.bairro ?? ''}`;

        const enderecoCompleto = await buscarEnderecoCompleto(produtorData?.rua, produtorData?.numero, produtorData?.bairro);
        console.log("Endereço completo:", enderecoCompleto);

        setEndereco({
          cidade: enderecoCompleto.cidade ?? 'Cidade não encontrada',
          estado: enderecoCompleto.estado ?? 'Estado não encontrado',
          rua_numero: enderecoTexto,
          complemento: produtorData?.complemento ?? '',
          cep: enderecoCompleto.cep ?? '',
        });

        const { granted } = await Location.requestForegroundPermissionsAsync();
        if (granted) {
          const pos = await Location.getCurrentPositionAsync();
          setLocation(pos);
        }

        const resultado = await Location.geocodeAsync(enderecoTexto);
        if (resultado.length > 0) {
          setCoordenadas(resultado[0]);
        } else {
          alert("Endereço não encontrado");
        }
      } catch (error) {
        console.error("Erro ao buscar localizações:", error);
        alert("Erro ao buscar localização");
      } finally {
        setCarregando(false);
      }
    };

    carregarLocalizacoes();
  }, [usuario_id]);

  useEffect(() => {
    if (location?.coords && coordenadas && mapRef.current) {
      mapRef.current.fitToCoordinates(
        [
          {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          },
          {
            latitude: coordenadas.latitude,
            longitude: coordenadas.longitude,
          },
        ],
        {
          edgePadding: { top: 80, right: 80, bottom: 80, left: 80 },
          animated: true,
        }
      );
    }
  }, [location, coordenadas]);

  async function buscarEnderecoCompleto(rua: string, numero: string, bairro: string) {
    try {
      const query = encodeURIComponent(`${rua} ${numero}, ${bairro}`);
      const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&addressdetails=1`;

      const response = await fetch(url, {
        headers: {
          'User-Agent': 'ReactNativeApp'
        }
      });
      const dados = await response.json();

      if (dados.length > 0) {
        const endereco = dados[0].address;
        return {
          cidade: endereco.city || endereco.town || endereco.village || null,
          estado: endereco.state || null,
          cep: endereco.postcode || null,
        };
      } else {
        return { cidade: null, estado: null, cep: null };
      }
    } catch (error) {
      console.error("Erro ao buscar endereço:", error);
      return { cidade: null, estado: null, cep: null };
    }
  }

  return (
    <>
      <SafeAreaView edges={["top"]} style={{ backgroundColor: '#4D7E1B' }} />
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["left", "right"]}>
        <View style={{ flex: 1 }}>
          <Header showGoBack={true} />

          <View style={{ alignItems: 'center', paddingHorizontal: 20, justifyContent: 'center', flex: 0.8 }}>
            <View style={styles.mapArea}>
              {carregando ? (
                <ActivityIndicator size="large" color="#4D7E1B" style={{ flex: 1 }} />
              ) : (
                <MapView style={styles.map} ref={mapRef}>
                  {location && (
                    <Marker
                      coordinate={{
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                      }}
                      title="Sua localização"
                      pinColor="green"
                    />
                  )}
                  {coordenadas && (
                    <Marker
                      coordinate={{
                        latitude: coordenadas.latitude,
                        longitude: coordenadas.longitude,
                      }}
                      title="Local do Produtor"
                      description={endereco.rua_numero}
                      pinColor="red"
                    />
                  )}
                </MapView>
              )}
            </View>

            <View style={[styles.descricao, { marginTop: height * 0.02 }]}>
              <Entypo name="location" size={16} color={colors.title} />
              <Text style={{ marginLeft: 8, fontWeight: 'bold', color: colors.text }}>
                Localização do produtor
              </Text>
            </View>
              {/* Não adicionei o CEP pq a API retornou o CEP da rua do lado, o resto tá certinho */}
            <View style={styles.informacoes}>
              <Text style={styles.font}>Cidade: {endereco.cidade}</Text>
              <Text style={styles.font}>Estado: {endereco.estado}</Text>
              <Text style={styles.font}>Endereço: {endereco.rua_numero}</Text>
              <Text style={styles.font}>Complemento: {endereco.complemento}</Text>
            </View>

            <Button
              title={"Ver no Google Maps"}
              buttonStyle={styles.button}
              onPress={() => {
                if (coordenadas) {
                  abrirNoGoogleMaps(coordenadas.latitude, coordenadas.longitude);
                } else {
                  alert("Coordenadas não disponíveis.");
                }
              }}
            />

          </View>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  font: {
    color: 'white',
    fontSize: width * 0.043,
  },
  mapArea: {
    width: '100%',
    aspectRatio: 1.6,
    borderRadius: 15,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#4D7E1B',
  },
  descricao: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  informacoes: {
    width: '100%',
    backgroundColor: '#4D7E1B',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'black',
    padding: 15,
    marginTop: 20,
    alignItems: 'center',
    gap: 10,
  },
  button: {
    backgroundColor: '#4D7E1B',
    borderColor: 'black',
    borderWidth: 1.5,
    width: '100%',
    borderRadius: 25,
    marginTop: 20,
    paddingVertical: 8,
  },
});