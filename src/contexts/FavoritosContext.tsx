import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../../services/api";
import { useUser } from "./UserContext";

type FavoritosContextType = {
  favoritos: string[];
  produtosFavoritos: number[];
  carregarFavoritos: () => void;
  adicionarFavorito: (cpfProdutor: string) => void;
  removerFavorito: (cpfProdutor: string) => void;
  isFavorito: (cpfProdutor: string) => boolean;
  favoritarProduto: (id: number) => void;
  desfavoritarProduto: (id: number) => void;
  isProdutoFavorito: (id: number) => boolean;
};

const FavoritosContext = createContext<FavoritosContextType>({
  favoritos: [],
  produtosFavoritos: [],
  carregarFavoritos: () => {},
  adicionarFavorito: () => {},
  removerFavorito: () => {},
  isFavorito: () => false,
  favoritarProduto: () => {},
  desfavoritarProduto: () => {},
  isProdutoFavorito: () => false,
});

export const useFavoritos = () => useContext(FavoritosContext);

export const FavoritosProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();
  const [favoritos, setFavoritos] = useState<string[]>([]);
  const [produtosFavoritos, setProdutosFavoritos] = useState<number[]>([]);

  const carregarFavoritos = async () => {
    if (!user?.id) return;
    try {
      const [resProdutores, resProdutos] = await Promise.all([
        api.get(`/favoritos/produtor?id_usuario=${user.id}`),
        api.get(`/favoritos/produto?id_usuario=${user.id}`),
      ]);

      setFavoritos(resProdutores.data || []);
      setProdutosFavoritos((resProdutos.data || []).map((p: any) => p.id));
    } catch (err) {
      console.error("Erro ao carregar favoritos:", err);
    }
  };

  const adicionarFavorito = async (cpfProdutor: string) => {
    if (!user?.id) return;
    try {
      await api.post("/favoritos/produtor", null, {
        params: {
          id_usuario: user.id,
          cpf_produtor: cpfProdutor,
        },
      });
      setFavoritos((prev) => [...prev, cpfProdutor]);
    } catch (err) {
      console.error("Erro ao adicionar favorito:", err);
    }
  };

  const removerFavorito = async (cpfProdutor: string) => {
    if (!user?.id) return;
    try {
      await api.delete("/favoritos/produtor", {
        params: {
          id_usuario: user.id,
          cpf_produtor: cpfProdutor,
        },
      });
      setFavoritos((prev) => prev.filter((cpf) => cpf !== cpfProdutor));
    } catch (err) {
      console.error("Erro ao remover favorito:", err);
    }
  };

  const favoritarProduto = async (id: number) => {
    if (!user?.id || produtosFavoritos.includes(id)) return;

    try {
      await api.post(`/favoritos/produto`, null, {
        params: {
          id_usuario: user.id,
          id_produto: id,
        },
      });
      setProdutosFavoritos((prev) => [...prev, id]);
    } catch (err) {
      console.error("Erro ao favoritar produto:", err);
    }
  };

  const desfavoritarProduto = async (id: number) => {
    if (!user?.id) return;

    try {
      await api.delete(`/favoritos/produto`, {
        params: {
          id_usuario: user.id,
          id_produto: id,
        },
      });
      setProdutosFavoritos((prev) => prev.filter((pid) => pid !== id));
    } catch (err) {
      console.error("Erro ao desfavoritar produto:", err);
    }
  };

  const isFavorito = (cpfProdutor: string) => favoritos.includes(cpfProdutor);
  const isProdutoFavorito = (id: number) => produtosFavoritos.includes(id);

  useEffect(() => {
    carregarFavoritos();
  }, [user?.id]);

  return (
    <FavoritosContext.Provider
      value={{
        favoritos,
        produtosFavoritos,
        carregarFavoritos,
        adicionarFavorito,
        removerFavorito,
        isFavorito,
        favoritarProduto,
        desfavoritarProduto,
        isProdutoFavorito,
      }}
    >
      {children}
    </FavoritosContext.Provider>
  );
};
