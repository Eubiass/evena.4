import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, map } from 'rxjs';
import { Evento } from '../../model/evento'; // Ajuste o caminho

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
    termo: '', estado: '', cidade: '', preco: 'todos', data: '', categoria: 'Todos'
  };

  private filtrosSubject = new BehaviorSubject<Filtros>(this.filtrosPadrao);
  filtros$ = this.filtrosSubject.asObservable();

  private normalizarTexto(t: string): string {
    return t ? t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') : '';
  }

  atualizarFiltros(novosFiltros: Partial<Filtros>) {
    this.filtrosSubject.next({ ...this.filtrosSubject.value, ...novosFiltros });
  }

  resetarFiltros() { this.filtrosSubject.next(this.filtrosPadrao); }

  obterEventosFiltrados(eventosIniciais: Evento[]): Observable<Evento[]> {
    return this.filtros$.pipe(
      map(filtros => {
        const termoBusca = this.normalizarTexto(filtros.termo);
        const cidadeBusca = this.normalizarTexto(filtros.cidade);

        return eventosIniciais.filter(evento => {
          // 1. Busca Global (Termo)
          const matchTermo = !termoBusca || 
            this.normalizarTexto(evento.titulo).includes(termoBusca) ||
            this.normalizarTexto(evento.localNome).includes(termoBusca);

          // 2. Cidade (Input)
          const matchCidade = !cidadeBusca || 
            this.normalizarTexto(evento.cidade).includes(cidadeBusca);

          // 3. Preço (Dropdown)
          const p = evento.preco;
          const fP = filtros.preco;
          const matchPreco = fP === 'todos' ? true :
                             fP === 'gratis' ? p === 0 :
                             fP === 'ate50' ? (p > 0 && p <= 50) :
                             fP === '50-150' ? (p > 50 && p <= 150) :
                             fP === 'mais150' ? p > 150 : true;

          // 4. Data (Calendário ISO)
          const dF = filtros.data; // "2026-07-31"
          let matchData = true;
          if (dF) {
            const noArray = evento.datasOcorrencia?.includes(dF);
            const noIntervalo = evento.intervalo && (dF >= evento.intervalo.inicio && dF <= evento.intervalo.fim);
            matchData = !!(noArray || noIntervalo);
          }

          // 5. Categoria e Estado
          const matchCat = filtros.categoria === 'Todos' || evento.categoria.includes(filtros.categoria);
          const matchEst = !filtros.estado || evento.uf === filtros.estado;

          return matchTermo && matchCidade && matchPreco && matchData && matchCat && matchEst;
        });
      })
    );
  }
}