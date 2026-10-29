import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  Observable,
  catchError,
  finalize,
  map,
  of,
  shareReplay,
  switchMap,
  tap,
  throwError
} from 'rxjs';

import { API_URL } from '../config/api.config';

export interface EventoFavorito {
  id: number;
  titulo?: string;
  status?: boolean;
  classificacao?: string;
  imagem?: string;
  banner?: string;
  capa?: string;
  descricao?: string;
  preco?: number;
  empresaNome?: string;
  datas?: string[];
  categoria?: string;
  local?: string;
  cidade?: string;
  uf?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FavoritosService {
  private readonly idsSubject =
    new BehaviorSubject<ReadonlySet<number>>(new Set<number>());

  readonly ids$ = this.idsSubject.asObservable();

  private perfilAtualId: number | null = null;
  private eventosEmCache: EventoFavorito[] | null = null;

  private carregamentoEmAndamento: {
    perfilId: number;
    observable: Observable<EventoFavorito[]>;
  } | null = null;

  private readonly operacoesPendentes = new Set<string>();
  private readonly versoesEvento = new Map<number, number>();

  private versaoGeral = 0;

  constructor(private readonly http: HttpClient) {}

  carregarFavoritos(perfilId: number): Observable<EventoFavorito[]> {
    if (!Number.isInteger(perfilId) || perfilId <= 0) {
      return throwError(
        () => new Error('ID do perfil inválido.')
      );
    }

    this.prepararPerfil(perfilId);

    if (this.eventosEmCache !== null) {
      return of([...this.eventosEmCache]);
    }

    if (this.carregamentoEmAndamento?.perfilId === perfilId) {
      return this.carregamentoEmAndamento.observable;
    }

    const versaoInicial = this.versaoGeral;

    let requisicao!: Observable<EventoFavorito[]>;

    requisicao = this.http
      .get<EventoFavorito[]>(
        `${API_URL}/perfis/${perfilId}/favoritos`
      )
      .pipe(
        map(eventos => Array.isArray(eventos) ? eventos : []),

        tap(eventos => {
          if (this.perfilAtualId !== perfilId) {
            return;
          }

          if (this.versaoGeral !== versaoInicial) {
            this.eventosEmCache = null;
            return;
          }

          const idsDaApi = new Set<number>(
            eventos
              .map(evento => Number(evento.id))
              .filter(id => Number.isInteger(id) && id > 0)
          );

          this.idsSubject.next(idsDaApi);
          this.eventosEmCache = [...eventos];
        }),

        finalize(() => {
          if (
            this.carregamentoEmAndamento?.observable === requisicao
          ) {
            this.carregamentoEmAndamento = null;
          }
        }),

        shareReplay({
          bufferSize: 1,
          refCount: false
        })
      );

    this.carregamentoEmAndamento = {
      perfilId,
      observable: requisicao
    };

    return requisicao;
  }

  definirFavorito(
    perfilId: number,
    eventoId: number,
    favorito: boolean
  ): Observable<unknown> {
    if (
      !Number.isInteger(perfilId) || perfilId <= 0 ||
      !Number.isInteger(eventoId) || eventoId <= 0
    ) {
      return throwError(
        () => new Error('Perfil ou evento inválido.')
      );
    }

    this.prepararPerfil(perfilId);

    const chaveOperacao = `${perfilId}:${eventoId}`;

    if (this.operacoesPendentes.has(chaveOperacao)) {
      return throwError(
        () => new Error(
          'Já existe uma alteração em andamento para este evento.'
        )
      );
    }

    this.operacoesPendentes.add(chaveOperacao);

    return this.carregarFavoritos(perfilId).pipe(
      switchMap(() => {
        if (this.perfilAtualId !== perfilId) {
          return throwError(
            () => new Error('O perfil ativo foi alterado.')
          );
        }

        const idsAnteriores = new Set(this.idsSubject.value);
        const estavaFavoritado = idsAnteriores.has(eventoId);

        if (estavaFavoritado === favorito) {
          return of(null);
        }

        const idsNovos = new Set(idsAnteriores);

        if (favorito) {
          idsNovos.add(eventoId);
        } else {
          idsNovos.delete(eventoId);
        }

        this.idsSubject.next(idsNovos);

        const versao =
          (this.versoesEvento.get(eventoId) ?? 0) + 1;

        this.versoesEvento.set(eventoId, versao);
        this.versaoGeral++;

        this.eventosEmCache = null;

        const url =
          `${API_URL}/perfis/${perfilId}/favoritos/${eventoId}`;

        const requisicao = favorito
          ? this.http.post<unknown>(url, {})
          : this.http.delete<unknown>(url);

        return requisicao.pipe(
          catchError(erro => {
            if (
              this.perfilAtualId === perfilId &&
              this.versoesEvento.get(eventoId) === versao
            ) {
              const idsRollback = new Set(this.idsSubject.value);

              if (estavaFavoritado) {
                idsRollback.add(eventoId);
              } else {
                idsRollback.delete(eventoId);
              }

              this.idsSubject.next(idsRollback);
              this.versaoGeral++;
              this.eventosEmCache = null;
            }

            return throwError(() => erro);
          })
        );
      }),

      finalize(() => {
        this.operacoesPendentes.delete(chaveOperacao);
      })
    );
  }

  limparEstado(): void {
    this.perfilAtualId = null;
    this.eventosEmCache = null;
    this.carregamentoEmAndamento = null;
    this.versoesEvento.clear();
    this.versaoGeral++;

    this.idsSubject.next(new Set<number>());
  }

  private prepararPerfil(perfilId: number): void {
    if (this.perfilAtualId === perfilId) {
      return;
    }

    this.perfilAtualId = perfilId;
    this.eventosEmCache = null;
    this.versoesEvento.clear();
    this.versaoGeral++;

    this.idsSubject.next(new Set<number>());
  }
}