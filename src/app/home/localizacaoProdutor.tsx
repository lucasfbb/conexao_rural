import { useEffect, useState } from "react";
import MapView, { Marker } from "react-native-maps";
import { View, StyleSheet, Text, Dimensions } from "react-native";
import { Entypo, Feather, MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Header from "@/components/header";
import { requestForegroundPermissionsAsync, getCurrentPositionAsync, LocationObject } from "expo-location";
import Button from "@/components/button";

const { height, width } = Dimensions.get('window')


export default function LocalizacaoProdutor() {
    const [location, setLocation] = useState<LocationObject | null >(null)
    
    const insets = useSafeAreaInsets();

    async function requestLocationPermissions() {
        const { granted } = await requestForegroundPermissionsAsync();

        if (granted) {
            const currentPosition = await getCurrentPositionAsync()
            setLocation(currentPosition)
        }
    }

    useEffect(() => {
        requestLocationPermissions()
        // console.log(location
    }, [])
    
    return (
        <View style={[styles.container, { paddingBottom: insets.bottom+25 }]}>
            
            <Header showFavoriteicon={true} showGoBack={true} backRoute="produtorProfile" />

            <View style={styles.mapArea}>
                {
                    location &&
                    <MapView
                        style={styles.map}
                        initialRegion={{
                            latitude: location.coords.latitude,
                            longitude: location.coords.longitude,
                            latitudeDelta: 0.05,
                            longitudeDelta: 0.05
                        }}
                    >
                        <Marker
                            coordinate={{
                                latitude: location.coords.latitude,
                                longitude: location.coords.longitude,
                            }}
                        />
                    </MapView>

                }
            </View>

            <View style={styles.descricao}>
                <Entypo name="location" size={16} color="#4D7E1B" />
                <Text style={{ marginLeft: width * 0.02, fontWeight: 'bold' }}>Localização do produtor</Text>
            </View>

            <View style={styles.informacoes}>
                {/* <Text style={styles.font}>Endereço Produtor</Text> */}
                <Text style={styles.font}>Cidade: Rio de Janeiro</Text>
                <Text style={styles.font}>Estado: Rio de Janeiro</Text>
                <Text style={styles.font}>Endereço: Rua Teste, 145</Text>
                <Text style={styles.font}>Complemento: Bloco H</Text>
                <Text style={styles.font}>CEP: 99999-999</Text>
            </View>

            <Button title={"Ver no Google Maps"} buttonStyle={styles.button}/>


        </View>
    )
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: 'white',
        alignItems: 'center',
    },
    mapArea: { 
        width: '88%', 
        height: '43%', // 🔹 Ajuste o tamanho do mapa (pode mudar conforme necessário)
        marginTop: 20, // 🔹 Dá um espaçamento do Header
        borderRadius: 15, // 🔹 Deixa as bordas arredondadas
        overflow: 'hidden', // 🔹 Garante que o MapView respeite o borderRadius
        borderWidth: 1.5,
        borderColor: '#4D7E1B'
    },
    map: { 
        flex: 1, 
        width: '100%', 
        height: '100%' // 🔹 Garante que o mapa ocupe o espaço do `mapArea`
    },
    descricao: {
        flexDirection: 'row',
        marginTop: height * 0.02
    },
    informacoes: {
        width: '90%', 
        height: '26%', // 🔹 Ajuste o tamanho do mapa (pode mudar conforme necessário)
        marginTop: 20, // 🔹 Dá um espaçamento do Header
        borderRadius: 40, // 🔹 Deixa as bordas arredondadas
        overflow: 'hidden', // 🔹 Garante que o MapView respeite o borderRadius
        borderWidth: 1.5,
        borderColor: 'black',
        backgroundColor: '#4D7E1B',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12
    },
    font: {
        color: 'white',
        fontSize: width * 0.043
    },
    button: {
        backgroundColor: '#4D7E1B',
        borderColor: 'black',
        borderWidth: 1.5,
        width: '80%',
        borderRadius: 25,
        marginTop: height * 0.03,
        padding: 5
    }
});
