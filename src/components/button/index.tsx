import { TouchableOpacity, Text, TouchableOpacityProps} from "react-native"

import {styles} from './styles'

type Props = TouchableOpacityProps & {
    title: string;
    buttonStyle?: object;
    textStyle?: object; 
}

export default function Button({ title, buttonStyle, textStyle, ...rest } : Props){
    return (    
        <TouchableOpacity activeOpacity={0.7} style={[styles.button, buttonStyle]} {...rest}>

            <Text style={[styles.title, textStyle]}>{title}</Text>

        </TouchableOpacity>
    )
}