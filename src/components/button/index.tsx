import { TouchableOpacity, Text, TouchableOpacityProps} from "react-native"

import {styles} from './styles'

type Props = TouchableOpacityProps & {
    title: string
}

export default function Button({ title, ...rest } : Props){
    return (    
        <TouchableOpacity activeOpacity={0.7} style={styles.button} {...rest}>

            <Text style={styles.title}>{title}</Text>

        </TouchableOpacity>
    )
}