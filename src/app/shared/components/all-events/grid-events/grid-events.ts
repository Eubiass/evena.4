import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Evento } from "../../../../model/evento";
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';
import { CardEvento } from "../../card-evento/card-evento";
import { AsyncPipe, CommonModule } from "@angular/common";

@Component({
  selector: "app-grid-events",
  imports: [CommonModule, CardEvento, AsyncPipe],
  templateUrl: "./grid-events.html",
  styleUrl: "./grid-events.css",
})
export class GridEvents {
  @Input() eventos$!: Observable<Evento[]>;
  @Output() resetar = new EventEmitter<void>();

  paginaAtual: number = 1;
  itensPorPagina: number = 6;
  totalItens: number = 0;

  get eventosPaginados$(): Observable<Evento[]> {
    return this.eventos$.pipe(
      map((eventos: Evento[]) => {
        if (!eventos) {
          this.totalItens = 0;
          return [];
        }
        this.totalItens = eventos.length;
        const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
        const fim = inicio + this.itensPorPagina;
        return eventos.slice(inicio, fim);
      })
    );
  }

  get totalPaginas(): number {
    return Math.ceil(this.totalItens / this.itensPorPagina) || 1;
  }

  proximaPagina(): void {
    if (this.paginaAtual < this.totalPaginas) {
      this.paginaAtual++;
    }
  }

  paginaAnterior(): void {
    if (this.paginaAtual > 1) {
      this.paginaAtual--;
    }
  }

  onResetarClique(): void {
    this.paginaAtual = 1;
    this.resetar.emit();
  }
}
