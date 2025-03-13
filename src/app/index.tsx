import { useState } from 'react'
import { View, Text, StyleSheet, Alert } from "react-native"
import { DrawerToggleButton } from '@react-navigation/drawer'

import { router } from 'expo-router'

import Button from "@/components/button"
import Input from "@/components/input"

export default function Index(){

    const [name, setName] = useState('')

    function handleNext() {
        router.navigate('/dashboard')
    }

    return (    
        <View style={styles.container}>
            <Text style={styles.title}>Olá, {name}</Text>

            <Input onChangeText={setName} />

            <Button title='Entrar' onPress={handleNext}/>

            {/* <DrawerToggleButton /> */}
            
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        padding: 32,
        justifyContent: 'center',
        gap: 16
    },

    title: {
        color: "black",
        fontSize: 24,
        fontWeight: "bold"
    }
})
