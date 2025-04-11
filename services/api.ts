import axios from "axios";

// quando decidir onde vai ficar o back, preencher aqui

export const api = axios.create({
  baseURL: "http://XXX.yy.aaa.weww:8000/api", // IP local ou hospedagem
});


// exemplo de chamada

// import { api } from "../services/api";

// async function cadastrarUsuario() {
//   try {
//     const response = await api.post("/usuarios", {
//       email: "exemplo@email.com",
//       nome: "João",
//       senha: "123456",
//       e_vendedor: true
//     });
//     console.log("Usuário cadastrado:", response.data);
//   } catch (error) {
//     console.error("Erro ao cadastrar:", error);
//   }
// }