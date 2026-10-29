import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-event-actions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-actions.html',
  styleUrl: './event-actions.css'
})
export class EventActions {
  @Input() isFavoritado = false;
  @Input() salvandoFavorito = false;

  @Output() comprar = new EventEmitter<void>();
  @Output() favoritar = new EventEmitter<void>();
  @Output() agenda = new EventEmitter<void>();
  @Output() compartilhar = new EventEmitter<void>();

  onComprar(): void {
    this.comprar.emit();
  }

  onFavoritar(): void {
    if (this.salvandoFavorito) {
      return;
    }

    this.favoritar.emit();
  }

  onAgenda(): void {
    this.agenda.emit();
  }

  onCompartilhar(): void {
    this.compartilhar.emit();
  }
}