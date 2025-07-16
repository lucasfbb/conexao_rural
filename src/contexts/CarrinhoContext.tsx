import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUser } from './UserContext';

export type ItemCarrinho = {
  id_listagem: number;
  nome: string;
  preco: number;
  qtd: number;
  produtor_id: number;  // ✅ novo campo
  nome_produtor?: string;
  imagem?: any;
  endereco_produtor?: {
    texto: string;
    rua?: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
    latitude?: number;
    longitude?: number;
  };
};

type CarrinhoContextType = {
  itens: ItemCarrinho[];
  adicionarItem: (item: ItemCarrinho) => void;
  alterarQuantidade: (id_listagem: number, novaQtd: number) => void;
  removerItem: (id_listagem: number) => void;
  limparCarrinho: () => void;
  agruparPorProdutor: () => { [produtorId: number]: ItemCarrinho[] };  // ✅ útil no checkout
};

const CarrinhoContext = createContext<CarrinhoContextType>({} as CarrinhoContextType);

export const CarrinhoProvider = ({ children }: { children: ReactNode }) => {
  const [itens, setItens] = useState<ItemCarrinho[]>([]);
  const { user } = useUser();

  const getStorageKey = () => `carrinho_${user?.cpf_cnpj}`;

  useEffect(() => {
    const carregarCarrinho = async () => {
      if (!user?.cpf_cnpj) return;
      try {
        const json = await AsyncStorage.getItem(getStorageKey());
        if (json) setItens(JSON.parse(json));
        else setItens([]);
      } catch (e) {
        console.error("Erro ao carregar carrinho", e);
      }
    };
    carregarCarrinho();
  }, [user]);

  useEffect(() => {
    if (!user?.cpf_cnpj) return;
    AsyncStorage.setItem(getStorageKey(), JSON.stringify(itens)).catch(err =>
      console.error("Erro ao salvar carrinho", err)
    );
  }, [itens, user]);

  const adicionarItem = (novo: ItemCarrinho) => {
    setItens(prev => {
      const existente = prev.find(i => i.id_listagem === novo.id_listagem);
      if (existente) {
        return prev.map(i =>
          i.id_listagem === novo.id_listagem
            ? { ...i, qtd: i.qtd + novo.qtd }
            : i
        );
      }
      return [...prev, novo];
    });
  };

  const alterarQuantidade = (id: number, qtd: number) => {
    setItens(prev =>
      prev.map(i =>
        i.id_listagem === id ? { ...i, qtd } : i
      ).filter(i => i.qtd > 0)
    );
  };

  const removerItem = (id: number) => {
    setItens(prev => prev.filter(i => i.id_listagem !== id));
  };

  const limparCarrinho = () => {
    setItens([]);
    if (user?.cpf_cnpj) {
      AsyncStorage.removeItem(getStorageKey()).catch(err =>
        console.error("Erro ao limpar carrinho", err)
      );
    }
  };

  const agruparPorProdutor = () => {
    const grupos: { [produtorId: number]: ItemCarrinho[] } = {};
    for (const item of itens) {
      if (!grupos[item.produtor_id]) grupos[item.produtor_id] = [];
      grupos[item.produtor_id].push(item);
    }
    return grupos;
  };

  return (
    <CarrinhoContext.Provider
      value={{ itens, adicionarItem, alterarQuantidade, removerItem, limparCarrinho, agruparPorProdutor }}
    >
      {children}
    </CarrinhoContext.Provider>
  );
};

export const useCarrinho = () => {
  const context = useContext(CarrinhoContext);
  if (!context) throw new Error("useCarrinho precisa estar dentro de CarrinhoProvider");
  return context;
};
