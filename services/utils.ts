import { api } from "./api";

export function validarCPF(cpf: string): boolean {
    cpf = cpf.replace(/[^\d]+/g, ''); // remove pontos e traços
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(9))) return false;

    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(10))) return false;

    return true;
}

function validarCNPJ(cnpj: string): boolean {
  cnpj = cnpj.replace(/[^\d]+/g, ''); // remove pontos, traços e barras
  if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false;

  let tamanho = 12;
  let numeros = cnpj.substring(0, tamanho);
  let digitos = cnpj.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;

  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(0))) return false;

  tamanho = 13;
  numeros = cnpj.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;

  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  return resultado === parseInt(digitos.charAt(1));
}

export function validarCPFouCNPJ(valor: string): boolean {
  console.log(valor);
  const documento = valor.replace(/[^\d]+/g, '');
  if (documento.length === 11) {
    return validarCPF(valor);
  } else if (documento.length === 14) {
    return validarCNPJ(valor);
  } else {
    return false;
  }
}

export function validarEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.toLowerCase());
}

export function formatarTelefone(telefone: string) {
  if (!telefone) return "Não informado";

  // Remove caracteres não numéricos
  const numeros = telefone.replace(/\D/g, '');

  // Aplica máscara com ou sem DDD
  if (numeros.length === 11) {
    return numeros.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (numeros.length === 10) {
    return numeros.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  } else {
    return telefone; // Retorna como está se o formato for inesperado
  }
}

export const formatarNumeroCartao = (numero: string) => {
  return numero
    .replace(/\D/g, "")                // remove tudo que não é número
    .slice(0, 16)                      // máximo de 16 dígitos
    .replace(/(\d{4})(?=\d)/g, "$1 "); // insere espaço a cada 4 dígitos
};

export const parsePreco = (valor: string) => {
  if (!valor) return 0;
  return Number(valor.replace("R$", "").replace(/\s/g, "").replace(",", "."));
};

export function obterFrete(origem: { lat: number, lon: number }, destino: { lat: number, lon: number }): number {
  const toRad = (v: number) => v * Math.PI / 180;
  const R = 6371; // raio da Terra em km

  const dLat = toRad(destino.lat - origem.lat);
  const dLon = toRad(destino.lon - origem.lon);

  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(toRad(origem.lat)) * Math.cos(toRad(destino.lat)) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distanciaKm = R * c;
  const precoKm = 1.5; // valor por km

  return distanciaKm * precoKm;
}

export async function geocodeEndereco(enderecoTexto: string): Promise<{ latitude: number; longitude: number } | null> {
  try {
    const query = encodeURIComponent(enderecoTexto);
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`, {
      headers: {
        'User-Agent': 'conexao-rural-app' // obrigatório
      }
    });

    const data = await response.json();

    if (data.length > 0) {
      return {
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon)
      };
    }

    return null;
  } catch (error) {
    console.error("Erro ao geocodificar endereço:", error);
    return null;
  }
}

