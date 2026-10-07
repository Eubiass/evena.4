export interface DataEvento {
  data: string;
  inicio: string;
  fim: string;
  terminaNoDiaSeguinte: boolean;
}

export interface Atracao {
  nome: string;
  descricao: string;
}

export interface DadosEvento {
  nome: string;
  // categorias: string[];
  categoria: string;
  classificacao: string;
  descricao: string;

  imagemSelecionada: boolean;
  imagemPreview: string;
  nomeImagem: string;

  datas: DataEvento[];

  tipoLocal: string;
  endereco: string;
  numero: string;
  complemento: string;
  cidade: string;
  estado: string;
  link: string;

  tipoIngresso: string;
  precoMinimo: string;
  precoMaximo: string;
  linkIngresso: string;

  atracoes: Atracao[];

  estacionamento: boolean;
  guardaVolumes: boolean;
  acessibilidade: boolean;
  recursos: Recurso[];

  informacoes: string;
  pergunta: string;
  resposta: string;
}

export function criarDadosEventoVazio(): DadosEvento {
  return {
    nome: '',
    //categorias: [],
    categoria: '',
    classificacao: '',
    descricao: '',

    imagemSelecionada: false,
    imagemPreview: '',
    nomeImagem: '',

    datas: [{
      data: '',
      inicio: '',
      fim: '',
      terminaNoDiaSeguinte: false
    }],

    tipoLocal: '',
    endereco: '',
    numero: '',
    complemento: '',
    cidade: '',
    estado: '',
    link: '',

    tipoIngresso: '',
    precoMinimo: '',
    precoMaximo: '',
    linkIngresso: '',

    atracoes: [],

    estacionamento: false,
    guardaVolumes: false,
    acessibilidade: false,
    recursos: [],

    informacoes: '',
    pergunta: '',
    resposta: ''
  };
}

export interface Recurso {
  nome: string;
  selecionado: boolean;
}