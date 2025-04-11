import { View, Text, Button } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import Header from '@/components/header'

export default function PerfilHome() {
    return (
        <>
            <SafeAreaView edges={["top"]} style={{ backgroundColor: '#4D7E1B' }} />
            <View>
                <Header />
                <Text>Notificações</Text>
                {/* <Button title="Editar Perfil" onPress={() => router.push("/perfil")} /> */}
            </View>
        </>
    );
}
