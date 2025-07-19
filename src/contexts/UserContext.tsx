import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type User = {
    id: number;
    cpf_cnpj: string;
    email: string;
    nome: string;
    e_vendedor: boolean;
    avaliacao?: string | null;
    foto_perfil?: string | null;
    telefone_1?: string | null;
    telefone_2?: string | null;
    data_nascimento?: string | null;
    criado_em?: string | null;
    token?: string;
};

type UserContextType = {
    user: User | null;
    login: (userData: User) => Promise<void>;
    logout: () => Promise<void>;
    isLoading: boolean;
};

const UserContext = createContext<UserContextType>({} as UserContextType);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const savedUser = await AsyncStorage.getItem("usuario");
                if (savedUser) {
                    setUser(JSON.parse(savedUser));
                }
            } catch (err) {
                console.error("Erro ao carregar usuário:", err);
            } finally {
                setIsLoading(false);
            }
        };

        loadUser();
    }, []);

    const login = async (userData: User) => {
        try {
            setUser(userData);
            await AsyncStorage.setItem("usuario", JSON.stringify(userData));
        } catch (err) {
            console.error("Erro ao salvar usuário:", err);
        }
    };

    const logout = async () => {
        try {
            setUser(null);
        } catch (err) {
            console.error("Erro ao remover usuário:", err);
        }
    };

    return (
        <UserContext.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) throw new Error("useUser precisa estar dentro de UserProvider");
    return context;
};
