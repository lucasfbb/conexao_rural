import { View, Text, Button } from "react-native";
import { router } from "expo-router";

export default function Carrinho() {
    return (
        <View>
            <Text>Carrinho</Text>
            <Button title='Voltar' onPress={() => router.back()} />
            {/* <Button title="Editar Perfil" onPress={() => router.push("/perfil")} /> */}
        </View>
    );
}
