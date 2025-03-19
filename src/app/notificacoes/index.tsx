import { View, Text, Button } from "react-native";
import { router } from "expo-router";

import Header from '@/components/header'
export default function PerfilHome() {
    return (
        <View>
            <Header />
            <Text>Notificações</Text>
            {/* <Button title="Editar Perfil" onPress={() => router.push("/perfil")} /> */}
        </View>
    );
}
