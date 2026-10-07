export interface DataEvento {
  data: string;
  inicio: string;
  fim: string;
  terminaNoDiaSeguinte: boolean;
}

export interface Atracao {
  nome: string;
}

export interface DadosEvento {
  nome: string;
  categoria: string;
  classificacao: string;
  descricao: string;

  imagemSelecionada: boolean;
  imagemPreview: string;
  nomeImagem: string;
  arquivoImagem: File | null;

  datas: DataEvento[];

  tipoLocal: string;

  endereco: string;
  numero: string;
  complemento: string;
  cidade: string;
  estado: string;

  link: string;

  tipoIngresso: string;
  preco: string;
  linkIngresso: string;

  atracoes: Atracao[];

  recursos: string[];

  informacoes: string;

  pergunta: string;
  resposta: string;
}

export function criarDadosEventoVazio(): DadosEvento {
  return {
    nome: '',
    categoria: '',
    classificacao: '',
    descricao: '',

    imagemSelecionada: false,
    imagemPreview: '',
    nomeImagem: '',
    arquivoImagem: null,

    datas: [
      {
        data: '',
        inicio: '',
        fim: '',
        terminaNoDiaSeguinte: false
      }
    ],

    tipoLocal: '',

    endereco: '',
    numero: '',
    complemento: '',
    cidade: '',
    estado: '',

    link: '',

    tipoIngresso: '',
    preco: '',
    linkIngresso: '',

    atracoes: [],

    recursos: [],

    informacoes: '',

    pergunta: '',
    resposta: ''
  };
}