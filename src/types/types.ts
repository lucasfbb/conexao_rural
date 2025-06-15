export interface Item {
    title?: string;
    subtitle?: string;
    details?: string[];
    addNew?: boolean;
  }

export interface ItemHome {
    cpf_cnpj: string;
    nome: string;
    endereco?: string;
    distancia?: number;
    categoria?: string;
    foto?: string;
    banner?: string;
}

export type Produto = {
  id: number;
  nome: string;
  sazonal: boolean;
}

export type Produtor = {
  nome: string;
  banner?: string;
  foto?: string;
  categoria?: string;
  endereco?: string;
  telefone1?: string;
  telefone2?: string;
  distancia?: number;
  email?: string;
}

