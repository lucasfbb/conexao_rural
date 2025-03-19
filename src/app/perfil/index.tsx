import { View, Text, Button, StyleSheet, Alert, Image, TouchableOpacity, ScrollView, TextInput, FlatList, useWindowDimensions } from "react-native";
import { router } from "expo-router";
import Header from '@/components/header'

export default function PerfilHome() {

    const Cliente = Array(5).fill({
        nome: "Teste da Silva Junior",
        email: "teste@gmail.com",
        categoria: "comprador",
        primeiroTelefone: "(21) 99999-9999",
        segundoTelefone: "(21) 99999-9988",
    });

    return (
        <View>
            <Header />
            <View  style={styles.container}>
                <View>
                    <Text style={styles.informacao}>{Cliente[0].nome}</Text>
                    <Text>Nome Completo</Text>
                    <Text style={styles.informacao}>{Cliente[0].email}</Text>
                    <Text>E-mail de contato</Text>
                    <Text style={styles.informacao}>{Cliente[0].categoria}</Text>
                    <Text>Categoria</Text>
                    <Text style={styles.informacao}>{Cliente[0].primeiroTelefone}</Text>
                    <Text>Primeiro Telefone</Text>
                    <Text style={styles.informacao}>{Cliente[0].segundoTelefone}</Text>
                    <Text>Segundo telefone</Text>
                </View>
                
            </View>
            {/* <Button title="Editar Perfil" onPress={() => router.push("/perfil")} /> */}
        </View>
    );
}

const styles = StyleSheet.create({
   container: {alignItems: "center", marginVertical: 70, marginHorizontal: 10,  borderColor: '#4D7E1B', borderWidth: 1, justifyContent: "center", borderRadius: 10},
   informacao: {borderBottomWidth: 1, borderBottomColor: '#4D7E1B', padding: 10, width: 300},
});