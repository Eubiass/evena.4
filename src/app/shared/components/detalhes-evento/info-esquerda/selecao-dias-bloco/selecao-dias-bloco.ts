import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from "@angular/core";
import { DiaFestival } from "../../../../../model/evento";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-selecao-dias-bloco",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./selecao-dias-bloco.html",
  styleUrl: "./selecao-dias-bloco.css",
})
export class SelecaoDiasBloco {
  // Recebe o container dos botões do HTML para controlar a rolagem
  @ViewChild('diasContainer') diasContainer!: ElementRef<HTMLDivElement>;

  // Recebe os dias vindos do pai
  @Input() dias: DiaFestival[] = [];
  
  // Recebe qual índice está ativo para saber qual botão colorir
  @Input() diaAtivoIndex: number = 0;

  // Emissor de evento: avisa o pai que o usuário mudou o dia
  @Output() diaAlterado = new EventEmitter<number>();

  selecionarDia(index: number): void {
    this.diaAlterado.emit(index);
  }

  // Controla a rolagem suave ao clicar nas setas de navegação no Desktop
  rolarDias(direcao: 'esquerda' | 'direita'): void {
    if (!this.diasContainer) return;

    // Distância em pixels para cada clique (largura aproximada de 2 botões)
    const distancia = 180;
    const valorRolagem = direcao === 'esquerda' ? -distancia : distancia;

    this.diasContainer.nativeElement.scrollBy({
      left: valorRolagem,
      behavior: 'smooth'
    });
  }
}
