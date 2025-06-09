// import React, { useState } from 'react';
// import { View, Text, StyleSheet } from 'react-native';
// import { Checkbox as PaperCheckbox, RadioButton as PaperRadioButton } from 'react-native-paper';
// import { styles } from './styles';

// interface SelectProps {
//   newValue?: string;
// }

// export default function Checkbox() {
//   const [selectedOption, setSelectedOption] = useState('Consumidor');
  
//   const [checked, setChecked] = useState(false);

//   function handleChange(newValue:string) {
//     setChecked(newValue==="Produtor");
//     setSelectedOption(newValue)
//   }

//   return (
//     <View>
//       <Text style={styles.text}>Você é um produtor?</Text>
//       <PaperRadioButton.Group onValueChange={newValue => handleChange(newValue)} value={selectedOption}>
//         <View style={styles.container}>
//           <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//             <PaperRadioButton value="Produtor" color='#ffffff' uncheckedColor='#ffffff'/>
//             <Text style={styles.text}>Sim</Text>
//           </View>
//           <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//             <PaperRadioButton value="Consumidor" color='#ffffff' uncheckedColor='#ffffff'/>
//             <Text style={styles.text}>Não</Text>
//           </View>
//         </View>
//       </PaperRadioButton.Group>
//     </View>
//   );
// }

// Checkbox.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { RadioButton as PaperRadioButton } from 'react-native-paper';
import { styles } from './styles';

interface CheckboxProps {
  selectedOption: string;
  onChange: (value: string) => void;
}

export default function Checkbox({ selectedOption, onChange }: CheckboxProps) {
  return (
    <View style={styles.checkboxContainer}>
      <Text style={styles.text}>Você é um produtor?</Text>
      <PaperRadioButton.Group onValueChange={onChange} value={selectedOption}>
        <View style={styles.container}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <PaperRadioButton value="Produtor" color="#ffffff" uncheckedColor="#ffffff" />
            <Text style={styles.text}>Sim</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <PaperRadioButton value="Consumidor" color="#ffffff" uncheckedColor="#ffffff" />
            <Text style={styles.text}>Não</Text>
          </View>
        </View>
      </PaperRadioButton.Group>
    </View>
  );
}



