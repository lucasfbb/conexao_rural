import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { router } from "expo-router";

// 🔹 Substitua pelo IP local ou URL da API
const baseURL = "http://192.168.0.17:5000/";

// "http://10.0.2.2:5000/";

export const api = axios.create({ baseURL });

// Interceptador para adicionar o token automaticamente
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Interceptador para lidar com erros de token
api.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem("token");
      Alert.alert("Sessão expirada", "Faça login novamente");
      router.replace("/login");
    }

    return Promise.reject(error);
  }
);