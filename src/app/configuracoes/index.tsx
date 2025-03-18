import { View, Text, StyleSheet, Button } from 'react-native';
import { router } from 'expo-router';

import Header from '@/components/header';

export default function Configuracoes() {
    return (
        <View style={styles.container}>
            {/* 🔹 Header Fixo no Topo */}
            <Header />

            {/* 🔹 Conteúdo separado do Header */}
            <View style={styles.content}>
                <Text style={styles.title}>Configurações</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    content: {
        flex: 1, // 🔹 Faz o conteúdo ocupar a área abaixo do Header
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
});
