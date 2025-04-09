import { useEffect, useState } from "react";
import MapView, { Marker } from "react-native-maps";
import { View, StyleSheet, Text, Dimensions } from "react-native";
import { Entypo, Feather, MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import Header from "@/components/header";
import { requestForegroundPermissionsAsync, getCurrentPositionAsync, LocationObject } from "expo-location";
import Button from "@/components/button";
import { useTema } from "@/contexts/ThemeContext";

const { height, width } = Dimensions.get('window')


export default function LocalizacaoProdutor() {
    const [location, setLocation] = useState<LocationObject | null >(null)
    
    const insets = useSafeAreaInsets();

    const { colors } = useTema()

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
        <>  

            <SafeAreaView
                edges={["top"]}
                style={{ backgroundColor: '#4D7E1B' }} 
            />

            <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["left", "right"]}>
                <View style={{ flex: 1 }}>
                    
                    <Header showFavoriteicon={true} showGoBack={true} />

                    <View style={{ alignItems: 'center', paddingHorizontal: 20, justifyContent: 'center', flex:0.8}}>
                        {location && (
                            <View style={styles.mapArea}>
                                <MapView
                                    style={styles.map}
                                    initialRegion={{
                                        latitude: location.coords.latitude,
                                        longitude: location.coords.longitude,
                                        latitudeDelta: 0.05,
                                        longitudeDelta: 0.05,
                                    }}
                                >
                                    <Marker
                                        coordinate={{
                                            latitude: location.coords.latitude,
                                            longitude: location.coords.longitude,
                                        }}
                                    />
                                </MapView>
                            </View>
                        )}

                        <View style={[styles.descricao, { marginTop: height * 0.02 }]}>
                            <Entypo name="location" size={16} color={colors.title} />
                            <Text style={{ marginLeft: 8, fontWeight: 'bold', color: colors.text }}>Localização do produtor</Text>
                        </View>

                        <View style={styles.informacoes}>
                            <Text style={styles.font}>Cidade: Rio de Janeiro</Text>
                            <Text style={styles.font}>Estado: Rio de Janeiro</Text>
                            <Text style={styles.font}>Endereço: Rua Teste, 145</Text>
                            <Text style={styles.font}>Complemento: Bloco H</Text>
                            <Text style={styles.font}>CEP: 99999-999</Text>
                        </View>

                        <Button title={"Ver no Google Maps"} buttonStyle={styles.button} />
                    </View>


                </View>
            </SafeAreaView>
        </>
    )
}

const styles = StyleSheet.create({
    
    map: { 
        flex: 1, 
        width: '100%', 
        height: '100%' // 🔹 Garante que o mapa ocupe o espaço do `mapArea`
    },
    font: {
        color: 'white',
        fontSize: width * 0.043
    },

    mapArea: { 
        width: '100%',
        aspectRatio: 1.6,
        borderRadius: 15,
        overflow: 'hidden',
        borderWidth: 1.5,
        borderColor: '#4D7E1B'
    },
    descricao: {
        flexDirection: 'row',
        alignItems: 'center'
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
        gap: 10
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
