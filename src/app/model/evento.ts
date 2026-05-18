export interface DiaFestival {
  nomeSemana: string;     
  numeroDia: string;    
  mesAno?: string;        
  descricaoEspecifica?: string; 
  artistasDoDia?: string[];     
}

export interface Evento {
  id: number;          
  titulo: string;
  preco: number;      
  imagem: string;     
  descricao?: string; 
  
  horario: string;
  horarioAbertura?: string;
  dataExibicao: string;   
  
  datasOcorrencia: string[]; 
  diasDetalhados?: DiaFestival[]; 
  intervalo?: {
    inicio: string; 
    fim: string;    
  };
  
  localNome: string;
  enderecoCompleto?: string;
  exibirMapa?: boolean;
  cidade: string; 
  uf: string;
  lat: number;       
  lng: number;       
  distancia?: number;
  
  categoria: string[];
  artista?: string[]; 
  
  linkCompra?: string;
  classificacao?: string;
  organizadorNome?: string;
  
  acessibilidade?: boolean;
  estacionamento?: boolean;
  wifi?: boolean;
  online?: string;
}