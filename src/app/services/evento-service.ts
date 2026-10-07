import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';

import { API_URL } from '../config/api.config';
import { Evento } from '../models/evento';

@Injectable({
  providedIn: 'root',
})
export class EventoService {

  private readonly eventos$: Observable<Evento[]>;

  constructor(private http: HttpClient) {
    this.eventos$ = this.http
      .get<any[]>(`${API_URL}/eventos/ativos`)
      .pipe(
        map(eventos =>
          eventos.map(evento => this.mapearEvento(evento))
        ),
        shareReplay(1)
      );
  }

  getEventos(): Observable<Evento[]> {
    return this.eventos$;
  }

  obterEventoPorId(id: number): Observable<Evento> {
    return this.http
      .get<any>(`${API_URL}/eventos/${id}`)
      .pipe(
        map(evento => this.mapearEvento(evento))
      );
  }

  obterEventoPorSlug(slug: string): Observable<Evento | undefined> {
    return this.eventos$.pipe(
      map(eventos =>
        eventos.find(
          evento => this.limparTexto(evento.titulo) === slug
        )
      )
    );
  }

  limparTexto(texto: string): string {
    if (!texto) return '';

    return texto
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  private mapearEvento(e: any): Evento {
    const datas = Array.isArray(e.datas)
      ? e.datas.map((data: unknown) => String(data))
      : [];

    const primeiraData = datas.length
      ? new Date(datas[0])
      : null;

    const ultimaData = datas.length
      ? new Date(datas[datas.length - 1])
      : null;

    return {
      id: Number(e.id),

      titulo: String(e.titulo ?? ''),

      preco: Number(e.preco ?? 0),

      imagem: this.normalizarImagem(
        e.capa || e.banner
      ),

      descricao: e.descricao
        ? String(e.descricao)
        : undefined,

      horario: primeiraData
        ? primeiraData.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
          })
        : '',

      dataExibicao: primeiraData
        ? primeiraData.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          })
        : '',

      datasOcorrencia: datas.map(
        (data: string) => data.substring(0, 10)
      ),

      intervalo:
        datas.length > 1
          ? {
              inicio: datas[0].substring(0, 10),
              fim: datas[datas.length - 1].substring(0, 10),
            }
          : undefined,

      localNome: String(e.local ?? ''),

      enderecoCompleto: e.endereco
        ? String(e.endereco)
        : undefined,

      cidade: String(e.cidade ?? ''),

      uf: String(e.uf ?? ''),

      /*
       * A API atualmente não envia latitude e longitude.
       * Por isso não podemos inventar esses valores.
       */
      lat: Number(e.latitude ?? 0),
      lng: Number(e.longitude ?? 0),

      /*
       * O Evena trabalha com uma categoria por evento.
       * O model atual ainda espera um array, então mantemos
       * o formato atual para não quebrar os componentes.
       */
      categoria: e.categoria ? String(e.categoria) : '',

      artista: Array.isArray(e.artistas)
        ? e.artistas.map(
            (artista: unknown) => String(artista)
          )
        : [],

      linkCompra: e.link
        ? String(e.link)
        : undefined,

      classificacao: e.classificacao
        ? String(e.classificacao)
        : undefined,

      organizadorNome: e.empresaNome
        ? String(e.empresaNome)
        : undefined,
    };
  }

  private normalizarImagem(imagem: unknown): string {
    const valor = String(imagem ?? '').trim();

    if (!valor) {
      return '';
    }

    if (
      valor.startsWith('http://') ||
      valor.startsWith('https://') ||
      valor.startsWith('data:image/')
    ) {
      return valor;
    }

    const nomeArquivo = valor.split('/').pop();

    return nomeArquivo
      ? `/${nomeArquivo}`
      : '';
  }
}