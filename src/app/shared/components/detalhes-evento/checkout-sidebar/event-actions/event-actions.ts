import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: "app-event-actions",
  imports: [],
  templateUrl: "./event-actions.html",
  styleUrl: "./event-actions.css",
})
export class EventActions {
  @Input() isSalvo: boolean = false;

  @Output() comprar = new EventEmitter<void>();
  @Output() salvar = new EventEmitter<void>();
  @Output() agenda = new EventEmitter<void>();
  @Output() compartilhar = new EventEmitter<void>();

  onComprar(): void {
    this.comprar.emit();
  }

  onSalvar(): void {
    this.salvar.emit();
  }

  onAgenda(): void {
    this.agenda.emit();
  }

  onCompartilhar(): void {
    this.compartilhar.emit();
  }
}
