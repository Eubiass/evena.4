import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SobreBloco } from "./sobre-bloco/sobre-bloco";
import { LineupBloco } from "./lineup-bloco/lineup-bloco";
import { InfoGeraisBloco } from "./info-gerais-bloco/info-gerais-bloco";
import { ComodidadesBloco } from "./comodidades-bloco/comodidades-bloco";
import { LocalizacaoBloco } from "./localizacao-bloco/localizacao-bloco";

@Component({
  selector: 'app-info-esquerda',
  standalone: true,
  imports: [CommonModule, SobreBloco, LineupBloco, InfoGeraisBloco, ComodidadesBloco, LocalizacaoBloco],
  templateUrl: './info-esquerda.html',
  styleUrl: './info-esquerda.css'
})
export class InfoEsquerda {
  @Input() evento: any;
}