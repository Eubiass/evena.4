import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: "app-header-events",
  imports: [],
  templateUrl: "./header-events.html",
  styleUrl: "./header-events.css",
})
export class HeaderEvents {
  @Input() titulo: string = 'Explorar Eventos';
  @Input() subtitulo: string = 'Descubra os melhores eventos e experiências perto de você';
  @Input() temFiltroAtivo: boolean = false;

  @Output() abrirFiltros = new EventEmitter<void>();
  @Output() limparFiltros = new EventEmitter<void>();

  onAbrirFiltros(): void {
    this.abrirFiltros.emit();
  }

  onLimparFiltros(): void {
    this.limparFiltros.emit();
  }
}
