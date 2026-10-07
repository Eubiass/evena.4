import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  combineLatest,
  map
} from 'rxjs';

import { Evento } from '../../models/evento';

export interface Filtros {
  termo: string;
  estado: string;
  cidade: string;
  preco: string;
  data: string;
  categoria: string;
}

@Injectable({ providedIn: 'root' })
export class FiltroEventosService {

  private readonly filtrosPadrao: Filtros = {
    termo: '',
    estado: '',
    cidade: '',
    preco: 'todos',
    data: '',
    categoria: 'Todos'
  };

  private filtrosSubject =
    new BehaviorSubject<Filtros>(this.filtrosPadrao);

  filtros$ = this.filtrosSubject.asObservable();

  private normalizarTexto(texto: string): string {
    return texto
      ? texto
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
      : '';
  }

  atualizarFiltros(novosFiltros: Partial<Filtros>): void {
    this.filtrosSubject.next({
      ...this.filtrosSubject.value,
      ...novosFiltros
    });
  }

  resetarFiltros(): void {
    this.filtrosSubject.next(this.filtrosPadrao);
  }

  obterEventosFiltrados(
    eventos$: Observable<Evento[]>
  ): Observable<Evento[]> {

    return combineLatest([
      eventos$,
      this.filtros$
    ]).pipe(

      map(([eventos, filtros]) => {

        const termoBusca =
          this.normalizarTexto(filtros.termo).trim();

        const cidadeBusca =
          this.normalizarTexto(filtros.cidade).trim();

        return eventos.filter(evento => {

          // 1. PESQUISA GLOBAL
          const textoPesquisa = [
            evento.titulo,
            evento.cidade,
            evento.uf,
            evento.categoria,
            evento.localNome,
            evento.descricao,
            ...(evento.artista ?? [])
          ]
            .map(valor => this.normalizarTexto(valor ?? ''))
            .join(' ');

          const matchTermo =
            !termoBusca ||
            textoPesquisa.includes(termoBusca);


          // 2. CIDADE
          const matchCidade =
            !cidadeBusca ||
            this.normalizarTexto(evento.cidade)
              .includes(cidadeBusca);


          // 3. PREÇO
          const preco = evento.preco;
          const filtroPreco = filtros.preco;

          const matchPreco =
            filtroPreco === 'todos' ? true :
            filtroPreco === 'gratis' ? preco === 0 :
            filtroPreco === 'ate50' ? (
              preco > 0 && preco <= 50
            ) :
            filtroPreco === '50-150' ? (
              preco > 50 && preco <= 150
            ) :
            filtroPreco === 'mais150' ? (
              preco > 150
            ) :
            true;


          // 4. DATA
          const filtroData = filtros.data;

          let matchData = true;

          if (filtroData) {

            const existeNaLista =
              evento.datasOcorrencia?.includes(filtroData);

            const existeNoIntervalo =
              evento.intervalo &&
              filtroData >= evento.intervalo.inicio &&
              filtroData <= evento.intervalo.fim;

            matchData =
              !!(existeNaLista || existeNoIntervalo);
          }


          // 5. CATEGORIA
          const matchCategoria =
            filtros.categoria === 'Todos' ||
            evento.categoria === filtros.categoria;


          // 6. ESTADO
          const matchEstado =
            !filtros.estado ||
            evento.uf === filtros.estado;


          return (
            matchTermo &&
            matchCidade &&
            matchPreco &&
            matchData &&
            matchCategoria &&
            matchEstado
          );
        });
      })
    );
  }
}