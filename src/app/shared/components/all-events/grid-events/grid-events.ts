import {
  Component,
  EventEmitter,
  Input,
  Output
} from "@angular/core";

import { AsyncPipe, CommonModule } from "@angular/common";
import { Observable, BehaviorSubject, combineLatest } from "rxjs";
import { map, shareReplay } from "rxjs/operators";

import { CardEvento } from "../../card-evento/card-evento";
import { Evento } from "../../../../models/evento";

@Component({
  selector: "app-grid-events",
  imports: [CommonModule, CardEvento, AsyncPipe],
  templateUrl: "./grid-events.html",
  styleUrl: "./grid-events.css",
})
export class GridEvents {

  @Input() eventos$!: Observable<Evento[]>;
  @Output() resetar = new EventEmitter<void>();

  paginaAtual = 1;
  itensPorPagina = 6;

  totalItens = 0;

  private paginaSubject = new BehaviorSubject<number>(1);

  eventosPaginados$!: Observable<Evento[]>;

  constructor() {
    // A inicialização real acontece quando o @Input() eventos$ estiver disponível.
  }

  ngOnInit(): void {
    this.eventosPaginados$ = combineLatest([
      this.eventos$,
      this.paginaSubject
    ]).pipe(
      map(([eventos, pagina]) => {

        this.totalItens = eventos?.length ?? 0;

        const inicio =
          (pagina - 1) * this.itensPorPagina;

        const fim =
          inicio + this.itensPorPagina;

        return (eventos ?? []).slice(inicio, fim);
      }),

      shareReplay({
        bufferSize: 1,
        refCount: true
      })
    );
  }

  get totalPaginas(): number {
    return Math.ceil(
      this.totalItens / this.itensPorPagina
    ) || 1;
  }

  proximaPagina(): void {
    if (this.paginaAtual < this.totalPaginas) {
      this.paginaAtual++;

      this.paginaSubject.next(this.paginaAtual);

      this.voltarAoTopo();
    }
  }

  paginaAnterior(): void {
    if (this.paginaAtual > 1) {
      this.paginaAtual--;

      this.paginaSubject.next(this.paginaAtual);

      this.voltarAoTopo();
    }
  }

  private voltarAoTopo(): void {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  onResetarClique(): void {
    this.paginaAtual = 1;

    this.paginaSubject.next(1);

    this.resetar.emit();
  }
}