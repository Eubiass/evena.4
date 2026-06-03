import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Evento } from '../../../../model/evento';
import { CardEvento } from '../../card-evento/card-evento';

@Component({
  selector: 'app-lista-eventos',
  standalone: true,
  imports: [CommonModule, CardEvento],
  templateUrl: './lista-eventos.html',
  styleUrl: './lista-eventos.css'
})
export class ListaEventosComponent {
  @Input() eventos$!: Observable<Evento[]>;
  @Output() resetar = new EventEmitter<void>();

  onResetarClique(): void {
    this.resetar.emit();
  }
}