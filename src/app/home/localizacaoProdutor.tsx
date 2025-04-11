import { useEffect, useState, useRef } from "react";
import MapView, { Marker } from "react-native-maps";
import { View, StyleSheet, Text, Dimensions, ActivityIndicator, Linking } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from "expo-location";

import Header from "@/components/header";
import Button from "@/components/button";
import { useTema } from "@/contexts/ThemeContext";

const { height, width } = Dimensions.get('window');

export default function LocalizacaoProdutor() {
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [coordenadas, setCoordenadas] = useState<Location.LocationGeocodedLocation | null>(null);
    const [carregando, setCarregando] = useState(true);

    const endereco = {
    cidade: 'Rio de Janeiro',
    estado: 'Rio de Janeiro',
    rua_numero: 'Rua Odorico Mendes 43',
    complemento: 'Bloco H',
    cep: '992295-000'
    }

    const { colors } = useTema();
    const mapRef = useRef<MapView>(null);


    const abrirNoGoogleMaps = (latitude: number, longitude: number) => {
        const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
        Linking.openURL(url);
    };

    useEffect(() => {

    const carregarLocalizacoes = async () => {
        try {
        // Requisição de localização atual
        const { granted } = await Location.requestForegroundPermissionsAsync();
        if (granted) {
            const pos = await Location.getCurrentPositionAsync();
            setLocation(pos);
        }

        // Busca coordenadas pelo endereço
        const resultado = await Location.geocodeAsync(endereco.rua_numero);
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
    }, []);

    useEffect(() => {
    if (
        location?.coords &&
        coordenadas &&
        mapRef.current
    ) {
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
                        title="Rua Odorico Mendes"
                        description="Localização do Produtor"
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

            <View style={styles.informacoes}>
                <Text style={styles.font}>Cidade: {endereco.cidade}</Text>
                <Text style={styles.font}>Estado: {endereco.estado}</Text>
                <Text style={styles.font}>Endereço: {endereco.rua_numero}</Text>
                <Text style={styles.font}>Complemento: {endereco.complemento}</Text>
                <Text style={styles.font}>CEP: {endereco.cep}</Text>
            </View>

            <Button title={"Ver no Google Maps"} buttonStyle={styles.button} onPress={() => {
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
