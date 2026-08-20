import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from "@angular/core";
import { FiltroEventosService, Filtros } from "../../../../services/filtros/filtro-eventos-service";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-modal-filtros",
  imports: [CommonModule, FormsModule],
  templateUrl: "./modal-filtros.html",
  styleUrl: "./modal-filtros.css",
})
export class ModalFiltros implements OnChanges{
  @Input() aberto = false;
  @Input() filtrosIniciais!: Filtros;

  @Output() fechar = new EventEmitter<void>();
  @Output() aplicar = new EventEmitter<Filtros>();
  @Output() resetar = new EventEmitter<void>();

  filtrosLocal: Filtros = {
    termo: '',
    estado: '',
    cidade: '',
    preco: 'todos',
    data: '',
    categoria: 'Todos'
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filtrosIniciais'] && this.filtrosIniciais) {
      this.filtrosLocal = { ...this.filtrosIniciais };
    }
  }

  onFechar(): void {
    this.fechar.emit();
  }

  onAplicar(): void {
    this.aplicar.emit(this.filtrosLocal);
  }

  onLimpar(): void {
    this.resetar.emit();
  }
}
