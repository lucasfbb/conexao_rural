export interface Item {
    title?: string;
    subtitle?: string;
    details?: string[];
    addNew?: boolean;
  }

export interface ItemHome {
    id: number;
    usuario_id: number;
    cpf_cnpj: string;
    nome: string;
    endereco?: string;
    rua?: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
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
  id?: number;
  nome: string;
  banner?: string;
  foto?: string;
  categoria?: string;
  endereco?: string;
  rua?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
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
  bairro?: string;
  estado: string;
  cidade: string;
  rua: string;
  complemento?: string;
  referencia?: string;
  latitude?: number;
  longitude?: number;
}

export interface FormaPagamentoOut {
  id: number;
  gateway: string;
  token: string;
  bandeira: string;
  final_cartao: string; // pode ser final "**** 1234"
  nome_cartao: string;
}

export interface PedidoOut {
  id: number;
  usuario_id: number;
  id_endereco: number;
  status: string;
  valor: number;
  group_hash: string;
  nome_produtor: string;
}
