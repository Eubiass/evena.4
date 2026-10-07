import { CommonModule } from '@angular/common';
import {
  Component,
  Input
} from '@angular/core';

import { Evento } from '../../../../../models/evento';

@Component({
  selector: 'app-info-gerais-bloco',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './info-gerais-bloco.html',
  styleUrl: './info-gerais-bloco.css'
})
export class InfoGeraisBloco {
  @Input()
  evento?: Evento;

  @Input()
  diaAtivoIndex = 0;
}