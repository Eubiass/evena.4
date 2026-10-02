import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild
} from "@angular/core";

import { CommonModule } from "@angular/common";
import { DiaFestival } from "../../../../../models/evento";

@Component({
  selector: "app-selecao-dias-bloco",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./selecao-dias-bloco.html",
  styleUrl: "./selecao-dias-bloco.css",
})
export class SelecaoDiasBloco implements AfterViewInit, OnDestroy {

  @ViewChild('diasContainer')
  diasContainer!: ElementRef<HTMLDivElement>;

  @Input() dias: DiaFestival[] = [];

  @Input() diaAtivoIndex: number = 0;

  @Output() diaAlterado = new EventEmitter<number>();

  // Controlam a exibição das setas
  mostrarSetaEsquerda = false;
  mostrarSetaDireita = false;

  private resizeObserver?: ResizeObserver;


  ngAfterViewInit(): void {

    // Verifica inicialmente se existe conteúdo sobrando
    setTimeout(() => {
      this.atualizarSetas();
    });

    // Observa mudanças no tamanho do container
    this.resizeObserver = new ResizeObserver(() => {
      this.atualizarSetas();
    });

    this.resizeObserver.observe(this.diasContainer.nativeElement);
  }


  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }


  selecionarDia(index: number): void {
    this.diaAlterado.emit(index);
  }


  atualizarSetas(): void {

    if (!this.diasContainer) {
      return;
    }

    const container = this.diasContainer.nativeElement;

    const scrollLeft = container.scrollLeft;

    const larguraVisivel = container.clientWidth;

    const larguraTotal = container.scrollWidth;

    // Verifica se existe conteúdo escondido para a direita
    const existeConteudoDireita =
      scrollLeft + larguraVisivel < larguraTotal - 1;

    // Verifica se existe conteúdo escondido para a esquerda
    const existeConteudoEsquerda =
      scrollLeft > 1;

    this.mostrarSetaDireita = existeConteudoDireita;
    this.mostrarSetaEsquerda = existeConteudoEsquerda;
  }


  rolarDias(direcao: 'esquerda' | 'direita'): void {

    if (!this.diasContainer) {
      return;
    }

    const container = this.diasContainer.nativeElement;

    const distancia = 180;

    const valorRolagem =
      direcao === 'esquerda'
        ? -distancia
        : distancia;

    container.scrollBy({
      left: valorRolagem,
      behavior: 'smooth'
    });

    // Atualiza depois que a rolagem começar
    setTimeout(() => {
      this.atualizarSetas();
    }, 300);
  }
}