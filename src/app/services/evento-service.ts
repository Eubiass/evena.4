
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { API_URL } from '../config/api.config';
import { DiaFestival, Evento } from '../models/evento';

export interface EventoRequest {
  titulo: string;
  status: boolean;
  classificacao: string;
  banner: string;
  capa: string;
  descricao: string;
  preco: number;
  link: string;
}

export interface DataEventoRequest {
  dataHora: string;
}

export interface DataEventoResponse {
  id: number;
  dataHora: string;
  evento?: {
    id: number;
  };
}

export interface DataEventoDetalhadaResponse {
  dataHora: string;
  dataHoraFim: string | null;
}

export interface EventoResponse {
  id: number;
  titulo: string;
  status: boolean;
  classificacao: string;
  banner?: string;
  capa?: string;
  descricao: string;
  preco: number;
  link?: string;
  empresaId: number;
  empresaNome: string;
  datas?: Array<string | DataEventoResponse>;
  categoria?: string | null;
  local?: string | null;
  endereco?: string | null;
  cidade?: string | null;
  uf?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  artistas?: string[];
}

/**
 * Resposta utilizada especificamente
 * no carregamento do formulário de edição.
 *
 * Alguns campos existem na resposta da API
 * online, mas não estão presentes no DTO
 * do backend enviado no ZIP.
 */
export interface EventoEdicaoResponse extends EventoResponse {
  datasDetalhadas?: DataEventoDetalhadaResponse[];
  linkTransmissao?: string | null;
  comodidades?: string[];
}

export interface LocalizacaoRequest {
  eventoId: number;
  latitude: number | null;
  longitude: number | null;
  endereco: string;
  uf: string;
  cep: string;
  cidade: string;
  nomeEstabelecimento: string;
}

export interface LocalizacaoResponse {
  id: number;
  latitude: number | null;
  longitude: number | null;
  endereco: string | null;
  uf: string | null;
  cep: string | null;
  cidade: string | null;
  nomeEstabelecimento: string | null;
  evento?: {
    id: number;
  };
}

export interface ArtistaRequest {
  nome: string;
  obras: string;
  foto: string;
}

export interface ArtistaResponse {
  id: number;
  nome: string;
  obras?: string;
  foto?: string;
}

export interface UploadImagemResponse {
  url: string;
}

export interface CategoriaRequest {
  eventoId: number;
  artistaId: number;
  tipo: string;
  estilo: string;
  foto: string;
}

export interface CategoriaResponse {
  id: number;
  tipo: string;
  estilo?: string | null;
  foto?: string | null;
  evento?: {
    id: number;
  };
  artista?: {
    id: number;
    nome?: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class EventoService {
  private readonly url = API_URL;

  private readonly apiBaseUrl =
    API_URL.replace(/\/api\/?$/, '');

  constructor(
    private http: HttpClient
  ) {}

  getEventos(): Observable<Evento[]> {
    return this.buscarEventos().pipe(
      map(eventos =>
        eventos.map(evento =>
          this.mapearEvento(evento)
        )
      )
    );
  }

  getEventosDaEmpresa(
    empresaId: number
  ): Observable<Evento[]> {
    return this.buscarEventos().pipe(
      map(eventos =>
        eventos
          .filter(evento =>
            evento.empresaId === empresaId
          )
          .map(evento =>
            this.mapearEvento(evento)
          )
      )
    );
  }

  publicarEvento(
    empresaId: number,
    request: EventoRequest
  ): Observable<EventoResponse> {
    return this.http.post<EventoResponse>(
      `${this.url}/empresas/${empresaId}/eventos`,
      request
    );
  }

  atualizarEvento(
    eventoId: number,
    request: EventoRequest
  ): Observable<EventoResponse> {
    return this.http.put<EventoResponse>(
      `${this.url}/empresas/eventos/${eventoId}`,
      request
    );
  }

  obterEventoCompletoPorId(
    id: number
  ): Observable<EventoEdicaoResponse> {
    return this.http.get<EventoEdicaoResponse>(
      `${this.url}/eventos/${id}`
    );
  }

  uploadImagem(
    arquivo: File
  ): Observable<UploadImagemResponse> {
    const formData = new FormData();

    formData.append(
      'arquivo',
      arquivo,
      arquivo.name
    );

    return this.http.post<UploadImagemResponse>(
      `${this.url}/arquivos/imagens`,
      formData
    );
  }

  adicionarData(
    eventoId: number,
    request: DataEventoRequest
  ): Observable<DataEventoResponse> {
    return this.http.post<DataEventoResponse>(
      `${this.url}/eventos/${eventoId}/datas`,
      request
    );
  }

  listarDatasEvento(
    eventoId: number
  ): Observable<DataEventoResponse[]> {
    return this.http.get<DataEventoResponse[]>(
      `${this.url}/eventos/${eventoId}/datas`
    );
  }

  atualizarData(
    dataId: number,
    request: DataEventoRequest
  ): Observable<DataEventoResponse> {
    return this.http.put<DataEventoResponse>(
      `${this.url}/datas-evento/${dataId}`,
      request
    );
  }

  removerData(
    dataId: number
  ): Observable<unknown> {
    return this.http.delete(
      `${this.url}/datas-evento/${dataId}`
    );
  }

  adicionarLocalizacao(
    request: LocalizacaoRequest
  ): Observable<unknown> {
    return this.http.post(
      `${this.url}/localizacoes`,
      request
    );
  }

  listarLocalizacoes():
    Observable<LocalizacaoResponse[]> {
    return this.http.get<LocalizacaoResponse[]>(
      `${this.url}/localizacoes`
    );
  }

  atualizarLocalizacao(
    id: number,
    request: LocalizacaoRequest
  ): Observable<LocalizacaoResponse> {
    return this.http.put<LocalizacaoResponse>(
      `${this.url}/localizacoes/${id}`,
      request
    );
  }

  removerLocalizacao(
    id: number
  ): Observable<unknown> {
    return this.http.delete(
      `${this.url}/localizacoes/${id}`
    );
  }

  listarArtistas():
    Observable<ArtistaResponse[]> {
    return this.http.get<ArtistaResponse[]>(
      `${this.url}/artistas`
    );
  }

  cadastrarArtista(
    request: ArtistaRequest
  ): Observable<ArtistaResponse> {
    return this.http.post<ArtistaResponse>(
      `${this.url}/artistas`,
      request
    );
  }

  vincularArtista(
    eventoId: number,
    artistaId: number
  ): Observable<unknown> {
    return this.http.post(
      `${this.url}/eventos/${eventoId}/artistas/${artistaId}`,
      {}
    );
  }

  desvincularArtista(
    eventoId: number,
    artistaId: number
  ): Observable<unknown> {
    return this.http.delete(
      `${this.url}/eventos/${eventoId}/artistas/${artistaId}`
    );
  }

  adicionarCategoria(
    request: CategoriaRequest
  ): Observable<unknown> {
    return this.http.post(
      `${this.url}/categorias`,
      request
    );
  }

  listarCategorias():
    Observable<CategoriaResponse[]> {
    return this.http.get<CategoriaResponse[]>(
      `${this.url}/categorias`
    );
  }

  atualizarCategoria(
    id: number,
    request: CategoriaRequest
  ): Observable<CategoriaResponse> {
    return this.http.put<CategoriaResponse>(
      `${this.url}/categorias/${id}`,
      request
    );
  }

  removerCategoria(
    id: number
  ): Observable<unknown> {
    return this.http.delete(
      `${this.url}/categorias/${id}`
    );
  }

  removerEvento(
    eventoId: number
  ): Observable<unknown> {
    return this.http.delete(
      `${this.url}/empresas/eventos/${eventoId}`
    );
  }

  obterEventoPorId(
    id: number
  ): Observable<Evento> {
    return this.http.get<EventoResponse>(
      `${this.url}/eventos/${id}`
    ).pipe(
      map(evento =>
        this.mapearEvento(evento)
      )
    );
  }

  obterEventoPorSlug(
    slug: string
  ): Observable<Evento | undefined> {
    return this.getEventos().pipe(
      map(eventos =>
        eventos.find(evento =>
          this.criarSlug(evento.titulo) === slug
        )
      )
    );
  }

  limparTexto(
    texto: string | null | undefined
  ): string {
    if (!texto) {
      return '';
    }

    return texto
      .trim()
      .replace(/^["']+|["']+$/g, '')
      .trim();
  }

  private buscarEventos():
    Observable<EventoResponse[]> {
    return this.http.get<EventoResponse[]>(
      `${this.url}/eventos/ativos`
    );
  }

  private mapearEvento(
    evento: EventoResponse
  ): Evento {
    const datas =
      this.normalizarDatas(
        evento.datas
      );

    const primeiraData =
      datas[0] ?? '';

    return {
      id: evento.id,

      titulo:
        this.limparTexto(evento.titulo),

      preco:
        evento.preco ?? 0,

      imagem:
        this.normalizarImagem(
          evento.capa || evento.banner
        ),

      descricao:
        this.limparTexto(evento.descricao),

      horario:
        this.extrairHorario(primeiraData),

      dataExibicao:
        this.formatarDataExibicao(primeiraData),

      datasOcorrencia:
        datas,

      diasDetalhados:
        this.criarDiasDetalhados(datas),

      intervalo:
        this.criarIntervalo(datas),

      localNome:
        evento.local ?? '',

      enderecoCompleto:
        evento.endereco ?? '',

      exibirMapa:
        evento.latitude != null &&
        evento.longitude != null,

      cidade:
        evento.cidade ?? '',

      uf:
        evento.uf ?? '',

      lat:
        evento.latitude ?? 0,

      lng:
        evento.longitude ?? 0,

      categoria:
        evento.categoria ?? '',

      artista:
        evento.artistas ?? [],

      linkCompra:
        evento.link ?? '',

      classificacao:
        evento.classificacao ?? '',

      organizadorNome:
        evento.empresaNome ?? '',

      online:
        !evento.endereco &&
        !!evento.link
          ? evento.link
          : undefined,

      acessibilidade: false,
      estacionamento: false,
      wifi: false
    };
  }

  private normalizarDatas(
    datas?: Array<string | DataEventoResponse>
  ): string[] {
    if (!datas?.length) {
      return [];
    }

    return datas
      .map(data =>
        typeof data === 'string'
          ? data
          : data.dataHora
      )
      .filter(Boolean);
  }

  private criarDiasDetalhados(
    datas: string[]
  ): DiaFestival[] {
    return datas.map(
      dataHora => {
        const data =
          dataHora.split('T')[0];

        const [
          ano,
          mes,
          dia
        ] = data.split('-');

        if (
          !ano ||
          !mes ||
          !dia
        ) {
          return {
            nomeSemana: '',
            numeroDia: ''
          };
        }

        const dataLocal =
          new Date(
            Number(ano),
            Number(mes) - 1,
            Number(dia)
          );

        const nomeSemana =
          new Intl.DateTimeFormat(
            'pt-BR',
            {
              weekday: 'short'
            }
          )
            .format(dataLocal)
            .replace('.', '');

        const mesAno =
          new Intl.DateTimeFormat(
            'pt-BR',
            {
              month: 'long',
              year: 'numeric'
            }
          ).format(dataLocal);

        return {
          nomeSemana,
          numeroDia: dia,
          mesAno
        };
      }
    );
  }

  private criarIntervalo(
    datas: string[]
  ): {
    inicio: string;
    fim: string;
  } | undefined {
    if (!datas.length) {
      return undefined;
    }

    const datasOrdenadas =
      [...datas].sort();

    return {
      inicio:
        datasOrdenadas[0].split('T')[0],

      fim:
        datasOrdenadas[
          datasOrdenadas.length - 1
        ].split('T')[0]
    };
  }

  private extrairHorario(
    dataHora: string
  ): string {
    if (!dataHora) {
      return '';
    }

    const horario =
      dataHora.split('T')[1];

    if (!horario) {
      return '';
    }

    return horario.substring(0, 5);
  }

  private formatarDataExibicao(
    dataHora: string
  ): string {
    if (!dataHora) {
      return '';
    }

    const data =
      dataHora.split('T')[0];

    const [
      ano,
      mes,
      dia
    ] = data.split('-');

    if (
      !ano ||
      !mes ||
      !dia
    ) {
      return data;
    }

    return `${dia}/${mes}/${ano}`;
  }

  private normalizarImagem(
    imagem?: string | null
  ): string {
    if (!imagem) {
      return '';
    }

    const valor =
      imagem.trim();

    if (!valor) {
      return '';
    }

    if (
      valor.startsWith('http://') ||
      valor.startsWith('https://') ||
      valor.startsWith('data:') ||
      valor.startsWith('blob:')
    ) {
      return valor;
    }

    if (
      valor.startsWith('assets/images/') ||
      valor.startsWith('/assets/images/')
    ) {
      const nomeArquivo =
        valor.split('/').pop();

      return nomeArquivo
        ? `/${nomeArquivo}`
        : '';
    }

    if (
      valor.startsWith('/assets/')
    ) {
      return valor;
    }

    if (
      valor.startsWith('assets/')
    ) {
      return `/${valor}`;
    }

    if (
      valor.startsWith('/uploads/') ||
      valor.startsWith('/images/') ||
      valor.startsWith('/imagens/')
    ) {
      return `${this.apiBaseUrl}${valor}`;
    }

    if (
      valor.startsWith('uploads/') ||
      valor.startsWith('images/') ||
      valor.startsWith('imagens/')
    ) {
      return `${this.apiBaseUrl}/${valor}`;
    }

    if (
      valor.startsWith('/')
    ) {
      return valor;
    }

    return `/${valor}`;
  }

  private criarSlug(
    texto: string
  ): string {
    return texto
      .normalize('NFD')
      .replace(
        /[\u0300-\u036f]/g,
        ''
      )
      .toLowerCase()
      .trim()
      .replace(
        /[^a-z0-9]+/g,
        '-'
      )
      .replace(/^-+|-+$/g, '');
  }
}
