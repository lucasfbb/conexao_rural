import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import Header from '@/components/header';
import { useSettings } from '@/contexts/SettingsContext';

export default function Configuracoes() {
  const { isNightMode, setNightMode, allowNotifications, setAllowNotifications } = useSettings();

  return (
    <View style={styles.container}>
        <Header />
        <View style={{ padding:20 }}>
            <Text style={styles.title}>Configurações Gerais</Text>

            <View style={styles.option}>
                <Text style={styles.label}>Modo Noturno</Text>
                <Switch value={isNightMode} onValueChange={setNightMode} />
            </View>

            <View style={styles.option}>
                <Text style={styles.label}>Notificações</Text>
                <Switch value={allowNotifications} onValueChange={setAllowNotifications} />
            </View>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#4D7E1B', marginBottom: 20 },
  option: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderColor: '#eee' },
  label: { fontSize: 16 },
});
