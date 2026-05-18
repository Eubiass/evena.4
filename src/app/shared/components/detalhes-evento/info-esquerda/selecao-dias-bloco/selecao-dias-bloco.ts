import { Component, EventEmitter, Input, Output } from "@angular/core";
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
  // Recebe os dias vindos do pai
  @Input() dias: DiaFestival[] = [];
  
  // Recebe qual índice está ativo para saber qual botão colorir de verde
  @Input() diaAtivoIndex: number = 0;

  // Emissor de evento: avisa o pai que o usuário mudou o dia
  @Output() diaAlterado = new EventEmitter<number>();

  selecionarDia(index: number): void {
    this.diaAlterado.emit(index);
  }
}
