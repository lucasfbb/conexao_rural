import { View, Image, StyleSheet, ActivityIndicator } from "react-native";

import { styles } from './styles'

export default function LoadingScreen() {
    return (
        <View >
            {/* Imagem da Splash Screen */}
            <Image 
                source={require("../../../assets/images/carregamento.png")} 
              
            />
            
            {/* Indicador de carregamento */}
            <ActivityIndicator size="large" color="#3F7F3F" />
        </View>
    );
}

