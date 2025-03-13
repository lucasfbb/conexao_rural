import { View, Image } from "react-native";
import { DrawerToggleButton } from '@react-navigation/drawer';
import { styles } from './styles';

export default function Header() {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.toggleButton}>
                    <DrawerToggleButton tintColor="white" />
                </View>

                <Image source={require('../../../assets/images/logo_comprido.png')} style={styles.img} />

                {/* 🔹 Espaço vazio para alinhar corretamente */}
                <View style={{ width: 40 }} />
            </View>
        </View>
    );
}
