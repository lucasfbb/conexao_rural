import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert, Platform } from "react-native";
import { router } from "expo-router";
// import "local-tunnel";

// 🔹 Substitua pelo IP local ou URL da API
// const baseURL = "http://192.168.0.17:5000/";

// export const baseURL = "http://10.0.2.2:5000/";
export const baseURL = "http://192.168.15.7:5000/";
// export const baseURL = "https://silly-icons-cheer.loca.lt/";
export const api = axios.create({ baseURL });

let setAuthenticatedExternal: ((auth: boolean) => void) | null = null;

export const setAuthHandler = (cb: (auth: boolean) => void) => {
  setAuthenticatedExternal = cb;
};

// Interceptador para adicionar o token automaticamente
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Interceptador para lidar com erros de token
// api.interceptors.response.use(
//   response => response,
//   async error => {
//     const isLoginRoute = error.config?.url?.includes("/auth/login");

//     // Só trata como sessão expirada se NÃO for na rota de login
//     if (error.response?.status === 401 && !isLoginRoute) {
//       await AsyncStorage.removeItem("token");
//       Alert.alert("Sessão expirada", "Faça login novamente");
//       router.replace("/login");
//     }

//     return Promise.reject(error);
//   }
// );

api.interceptors.response.use(
  response => response,
  async error => {
    const isLoginRoute = error.config?.url?.includes("/auth/login");

    if (error.response?.status === 401 && !isLoginRoute) {
      await AsyncStorage.removeItem("token");
      Alert.alert("Sessão expirada", "Faça login novamente");
      if (setAuthenticatedExternal) {
        setAuthenticatedExternal(false); // 🔁 dispara redirecionamento no contexto
      }
    }

    return Promise.reject(error);
  }
);
