import { View, Text, Button } from "react-native";
import { router } from "expo-router";

export default function Secundaria() {
    return (
        <View>
            <Text>Secundaria</Text>
            <Button title='Voltar' onPress={() => router.back()} />
            {/* <Button title="Editar Perfil" onPress={() => router.push("/perfil")} /> */}
        </View>
    );
}