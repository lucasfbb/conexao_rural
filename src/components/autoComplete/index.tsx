// import React, { useState, useEffect } from "react";
// import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
// import Autocomplete from "react-native-autocomplete-input";
// import { api } from "../../../services/api";

// export default function AutocompleteProduto({
//   value,
//   onChange,
//   placeholder = "Nome do produto"
// }: {
//   value: string;
//   onChange: (v: string) => void;
//   placeholder?: string;
// }) {
//   const [query, setQuery] = useState(value);
//   const [suggestions, setSuggestions] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (!query || query.length < 1) {
//       setSuggestions([]);
//       return;
//     }
//     setLoading(true);
//     const timeout = setTimeout(() => {
//       api.get("/produtos/search?q=" + encodeURIComponent(query))
//         .then(res => setSuggestions(res.data))
//         .finally(() => setLoading(false));
//     }, 250); // debounce
//     return () => clearTimeout(timeout);
//   }, [query]);

//   return (
//     <View style={{ flex: 1, zIndex: 100 }}>
//       <Autocomplete
//         data={suggestions}
//         defaultValue={query}
//         onChangeText={txt => {
//           setQuery(txt);
//           onChange(txt); // Já atualiza o nome no modal
//         }}
//         flatListProps={{
//           keyExtractor: (item) => String(item.id),
//           renderItem: ({ item }) => (
//             <TouchableOpacity
//               style={styles.suggestionItem}
//               onPress={() => {
//                 setQuery(item.nome);
//                 onChange(item.nome);
//                 setSuggestions([]);
//               }}
//             >
//               <Text style={{ fontSize: 16 }}>{item.nome}</Text>
//               {item.categoria ? (
//                 <Text style={{ fontSize: 12, color: "#666" }}>{item.categoria}</Text>
//               ) : null}
//             </TouchableOpacity>
//           ),
//         }}
//         inputContainerStyle={styles.inputContainer}
//         // listStyle={styles.list}
//         placeholder={placeholder}
//       />
//       {loading && <ActivityIndicator size="small" style={{ position: "absolute", right: 12, top: 14 }} />}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   inputContainer: {
//     borderWidth: 1,
//     borderColor: "#4D7E1B",
//     borderRadius: 7,
//     paddingHorizontal: 4,
//     marginBottom: 2,
//     backgroundColor: "#fff"
//   },
//   list: {
//     borderWidth: 1,
//     borderColor: "#4D7E1B",
//     borderRadius: 7,
//     backgroundColor: "#fff",
//     zIndex: 9999,
//     maxHeight: 140
//   },
//   suggestionItem: {
//     padding: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: "#eee",
//   },
// });

import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { useState, useEffect } from "react";

export interface ProdutoGlobal {
  id: number;
  nome: string;
  categoria?: string;
}

interface AutocompleteProdutoProps {
  produtosGlobais: ProdutoGlobal[];
  onSelect: (produto: ProdutoGlobal) => void;
}

export default function AutocompleteProduto({ produtosGlobais, onSelect }: AutocompleteProdutoProps) {
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState<ProdutoGlobal[]>([]);
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    if (query.length > 0) {
      // Filtra ignorando acento e maiúsculas
      const termo = query.toLocaleLowerCase();
      setFiltered(
        produtosGlobais.filter(prod =>
          prod.nome.toLocaleLowerCase().includes(termo)
        )
      );
      setShowList(true);
    } else {
      setFiltered([]);
      setShowList(false);
    }
  }, [query, produtosGlobais]);

  return (
    <View style={{ width: 300, alignSelf: "center" }}>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Digite ou selecione o produto"
        style={styles.input}
        onFocus={() => setShowList(true)}
        onBlur={() => setTimeout(() => setShowList(false), 150)} // timeout para dar tempo do touch
      />
      {showList && filtered.length > 0 && (
        <View style={styles.suggestionBox}>
          <FlatList
            data={filtered}
            keyExtractor={item => String(item.id)}
            style={{ maxHeight: 140 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  setQuery(item.nome);
                  setShowList(false);
                  onSelect(item);
                }}
                style={styles.suggestionItem}
              >
                <Text style={{ fontSize: 16 }}>{item.nome}</Text>
                {item.categoria && (
                  <Text style={{ fontSize: 12, color: "#888" }}>{item.categoria}</Text>
                )}
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#4D7E1B",
    borderRadius: 7,
    padding: 12,
    fontSize: 17,
    backgroundColor: "#FFF",
  },
  suggestionBox: {
    position: "absolute",
    top: 50, // ajuste conforme altura do input
    left: 0,
    right: 0,
    backgroundColor: "#FFF",
    zIndex: 100,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: "#CCC",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 4,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  }
});
