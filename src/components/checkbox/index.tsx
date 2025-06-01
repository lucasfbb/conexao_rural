import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Checkbox as PaperCheckbox, RadioButton as PaperRadioButton } from 'react-native-paper';
import { styles } from './styles';

interface SelectProps {
  newValue?: string;
}

// export default function Checkbox({ placeholder = "Você é produtor?" }: SelectProps) {


//   return (
//     <View style={styles.container}>
//       <PaperCheckbox
//         status={checked ? 'checked' : 'unchecked'}
//         onPress={() => setChecked(!checked)}
//         color="#FFFFFF"
//         uncheckedColor="#FFFFFF" 
//       />
//       <Text style={styles.text}>{placeholder}</Text>
//     </View>
//   );
// }
export default function Checkbox() {
  const [selectedOption, setSelectedOption] = useState('Consumidor');
  
  const [checked, setChecked] = useState(false);

  function handleChange(newValue:string) {
    setChecked(newValue==="Produtor");
    setSelectedOption(newValue)
  }

  return (
    <View>
      <Text style={styles.text}>Você é um produtor?</Text>
      <PaperRadioButton.Group onValueChange={newValue => handleChange(newValue)} value={selectedOption}>
        <View style={styles.container}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <PaperRadioButton value="Produtor" color='#ffffff' uncheckedColor='#ffffff'/>
            <Text style={styles.text}>Sim</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <PaperRadioButton value="Consumidor" color='#ffffff' uncheckedColor='#ffffff'/>
            <Text style={styles.text}>Não</Text>
          </View>
        </View>
      </PaperRadioButton.Group>
    </View>
  );
}
