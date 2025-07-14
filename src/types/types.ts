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

export type EnderecoItem =
  | {
      id: number;
      title: string;
      subtitle: string;
      details: string[];
    }
  | {
      addNew: true;
    };

export interface EnderecoOut {
  id: number;
  cep: string;
  numero: string;
  estado: string;
  cidade: string;
  rua: string;
  complemento?: string;
  referencia?: string;
}

export interface FormaPagamentoOut {
  id: number;
  gateway: string;
  token: string;
  bandeira: string;
  final_cartao: string; // pode ser final "**** 1234"
  nome_cartao: string;
}