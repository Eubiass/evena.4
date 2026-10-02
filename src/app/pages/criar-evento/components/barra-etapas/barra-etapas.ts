import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-barra-etapas',
  standalone: true,
  templateUrl: './barra-etapas.html',
  styleUrl: './barra-etapas.css'
})
export class BarraEtapas {
  @Input() etapaAtual = 1;

  etapas = ['Informações', 'Data e local', 'Detalhes', 'Revisão'];
}