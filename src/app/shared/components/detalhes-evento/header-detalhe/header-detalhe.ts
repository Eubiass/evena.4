import { CommonModule } from '@angular/common';
import {
  Component,
  Input
} from '@angular/core';

import { Evento } from '../../../../models/evento';

@Component({
  selector: 'app-header-detalhe',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './header-detalhe.html',
  styleUrl: './header-detalhe.css'
})
export class HeaderDetalhe {
  @Input()
  evento?: Evento;
}