import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventoService } from '../../../../services/evento-service';
import { FiltroEventosService } from '../../../../services/filtros/filtro-eventos-service';
import { Evento } from '../../../../model/evento';
import { combineLatest, map, Observable } from 'rxjs';
import { CardEvento } from '../../card-evento/card-evento'; // Importando a classe CardEvento

@Component({
  selector: 'app-lista-eventos',
  standalone: true,
  imports: [CommonModule, CardEvento],
  templateUrl: './lista-eventos.html',
  styleUrl: './lista-eventos.css'
})
export class ListaEventosComponent implements OnInit {
  // O componente recebe o fluxo já filtrado do pai (AllEvents)
  @Input() eventos$!: Observable<Evento[]>;
  @Output() resetar = new EventEmitter<void>(); // Novo aviso para o pai

  // Remova toda a lógica de combineLatest daqui, ela não é necessária neste componente
  constructor() {}

  ngOnInit(): void {
    // Não precisa de nada aqui se você usar o [eventos$] no HTML
  }

  onResetarClique() {
    this.resetar.emit();
  }
}