import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../../services/api";
import { useUser } from "./UserContext";

type FavoritosContextType = {
  favoritos: string[];
  carregarFavoritos: () => void;
  adicionarFavorito: (cpfProdutor: string) => void;
  removerFavorito: (cpfProdutor: string) => void;
  isFavorito: (cpfProdutor: string) => boolean;
};

const FavoritosContext = createContext<FavoritosContextType>({
  favoritos: [],
  carregarFavoritos: () => {},
  adicionarFavorito: () => {},
  removerFavorito: () => {},
  isFavorito: () => false,
});

export const useFavoritos = () => useContext(FavoritosContext);

export const FavoritosProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();
  const [favoritos, setFavoritos] = useState<string[]>([]);

  const carregarFavoritos = async () => {
    if (!user?.cpf_cnpj) return;
    try {
      const res = await api.get(`/favoritos/produtor?cpf_usuario=${user.cpf_cnpj}`);
      setFavoritos(res.data || []);
    } catch (err) {
      console.error("Erro ao carregar favoritos:", err);
    }
  };

  const adicionarFavorito = async (cpfProdutor: string) => {
    if (!user?.cpf_cnpj) return;
    try {
      await api.post("/favoritos/produtor", null, {
        params: {
          cpf_usuario: user.cpf_cnpj,
          cpf_produtor: cpfProdutor,
        },
      });
      setFavoritos((prev) => [...prev, cpfProdutor]);
    } catch (err) {
      console.error("Erro ao adicionar favorito:", err);
    }
  };

  const removerFavorito = async (cpfProdutor: string) => {
    if (!user?.cpf_cnpj) return;
    try {
      await api.delete("/favoritos/produtor", {
        params: {
          cpf_usuario: user.cpf_cnpj,
          cpf_produtor: cpfProdutor,
        },
      });
      setFavoritos((prev) => prev.filter((cpf) => cpf !== cpfProdutor));
    } catch (err) {
      console.error("Erro ao remover favorito:", err);
    }
  };

  const isFavorito = (cpfProdutor: string) => favoritos.includes(cpfProdutor);

  useEffect(() => {
    carregarFavoritos();
  }, [user?.cpf_cnpj]);

  return (
    <FavoritosContext.Provider
      value={{ favoritos, carregarFavoritos, adicionarFavorito, removerFavorito, isFavorito }}
    >
      {children}
    </FavoritosContext.Provider>
  );
};
