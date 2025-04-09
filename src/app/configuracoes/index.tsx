import React from 'react';
import { View, Text, Switch, StyleSheet, ScrollView } from 'react-native';
import Header from '@/components/header';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSettings } from '@/contexts/SettingsContext';
import { useTema } from '@/contexts/ThemeContext';
import { useNotificacoes } from '@/contexts/NotificationsContext';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Configuracoes() {
  const { colors, isNightMode, toggleNightMode } = useTema();
  const { notificacoesAtivas, toggleNotificacoes } = useNotificacoes();

  return (
    <>
      <SafeAreaView
          edges={["top"]}
          style={{ backgroundColor: '#4D7E1B' }} 
      />

      <View style={[styles.container, { backgroundColor: colors.background }]}>
          <Header />
          <ScrollView contentContainerStyle={{  padding: 20 }} showsVerticalScrollIndicator={false} bounces={false} >
              <Text style={[styles.title, { color: colors.title }]}>Configurações Gerais</Text>

              <View style={styles.option}>
                  <Text style={[styles.label, { color: colors.text }]}>Modo Noturno</Text>
                  <Switch value={isNightMode} onValueChange={toggleNightMode} />
              </View>

              <View style={styles.option}>
                  <Text style={[styles.label, { color: colors.text }]}>Notificações</Text>
                  <Switch value={notificacoesAtivas} onValueChange={toggleNotificacoes} />
              </View>
          </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#4D7E1B', marginBottom: 20 },
  option: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderColor: '#eee' },
  label: { fontSize: 16 },
});
