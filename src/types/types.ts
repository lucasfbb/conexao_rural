export interface Item {
    title?: string;
    subtitle?: string;
    details?: string[];
    addNew?: boolean;
  }

export interface ItemHome {
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
