
export interface EventoPerfil {
  id: number;
  titulo: string;
  categoria: string;
  local: string;
  horario?: string;
  data: string;
  imagem: string;
  organizador?: string;
}

export type AbaPerfil =
  | 'visao-geral'
  | 'favoritos'
  | 'historico'
  | 'configuracoes';
