import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Evento, DiaFestival } from '../../../../model/evento';
import { SobreBloco } from "./sobre-bloco/sobre-bloco";
import { LineupBloco } from "./lineup-bloco/lineup-bloco";
import { InfoGeraisBloco } from "./info-gerais-bloco/info-gerais-bloco";
import { ComodidadesBloco } from "./comodidades-bloco/comodidades-bloco";
import { LocalizacaoBloco } from "./localizacao-bloco/localizacao-bloco";
import { SelecaoDiasBloco } from './selecao-dias-bloco/selecao-dias-bloco';

@Component({
  selector: 'app-info-esquerda',
  standalone: true,
  imports: [CommonModule, SelecaoDiasBloco, SobreBloco, LineupBloco, InfoGeraisBloco, ComodidadesBloco, LocalizacaoBloco ],
  templateUrl: './info-esquerda.html',
  styleUrl: './info-esquerda.css'
})
export class InfoEsquerda {
  @Input() evento!: Evento;
  @Input() diaAtivoIndex: number = 0;
  
  @Output() diaAlteradoNoBloco = new EventEmitter<number>();

  // Centraliza o acesso ao dia atual do festival de forma segura
  private get diaAtual(): DiaFestival | undefined {
    return this.evento?.diasDetalhados?.[this.diaAtivoIndex];
  }

  get obterDescricao(): string {
    return this.diaAtual?.descricaoEspecifica || this.evento?.descricao || '';
  }

  get obterArtistas(): string[] {
    return this.diaAtual?.artistasDoDia || this.evento?.artista || [];
  }

  repassarMudancaDia(index: number): void {
    this.diaAlteradoNoBloco.emit(index);
  }
}