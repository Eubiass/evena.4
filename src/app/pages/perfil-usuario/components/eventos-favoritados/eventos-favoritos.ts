import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  AbaPerfil,
  EventoPerfil
} from '../../models/evento-perfil.model';

@Component({
  selector: 'app-eventos-favoritos',
  standalone: true,
  templateUrl: './eventos-favoritos.html',
  styleUrl: './eventos-favoritos.css'
})
export class EventosFavoritos {
  @Input() abaAtiva: AbaPerfil = 'visao-geral';
  @Input() favoritos: EventoPerfil[] = [];
  @Input() carregandoFavoritos = false;
  @Input() erroFavoritos = '';

  @Output() verTodos = new EventEmitter<void>();
  @Output() abrir = new EventEmitter<EventoPerfil>();
  @Output() remover = new EventEmitter<{
    evento: EventoPerfil;
    clique: Event;
  }>();
  @Output() erroImagem = new EventEmitter<EventoPerfil>();

  get eventosExibidos(): EventoPerfil[] {
    return this.abaAtiva === 'visao-geral'
      ? this.favoritos.slice(0, 3)
      : this.favoritos;
  }

  solicitarRemocao(evento: EventoPerfil, clique: Event): void {
    this.remover.emit({ evento, clique });
  }
}
