import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Evento } from '../../../../../model/evento';

@Component({
  selector: 'app-info-gerais-bloco',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './info-gerais-bloco.html',
  styleUrl: './info-gerais-bloco.css'
})
export class InfoGeraisBloco {
  @Input() evento: Evento | undefined;
  @Input() diaAtivoIndex: number = 0;
}