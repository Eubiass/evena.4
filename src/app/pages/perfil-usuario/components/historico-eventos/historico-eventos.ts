import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EventoPerfil } from '../../models/evento-perfil.model';

@Component({
  selector: 'app-historico-eventos',
  standalone: true,
  templateUrl: './historico-eventos.html',
  styleUrl: './historico-eventos.css'
})
export class HistoricoEventos {
  @Input() historico: EventoPerfil[] = [];
  @Input() compacto = false;

  @Output() verTodos = new EventEmitter<void>();
}
