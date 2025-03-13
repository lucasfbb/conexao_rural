import { View, Text, Button } from "react-native";
import { router } from "expo-router";

export default function PerfilHome() {
    return (
        <View>
            <Text>Perfil</Text>
            {/* <Button title="Editar Perfil" onPress={() => router.push("/perfil")} /> */}
        </View>
    );
}
