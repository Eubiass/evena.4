import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  ChangeDetectorRef,
  NgZone,
  OnDestroy
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FiltroEventosService } from '../../../../services/filtros/filtro-eventos-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './categorias.html',
  styleUrl: './categorias.css',
})
export class Categorias implements AfterViewInit, OnDestroy {

  categorias = [
    { id: 1, nome: "Networking", icone: 'categorias/negocios.png' },
    { id: 2, nome: "Música", icone: 'categorias/shows.png' },
    { id: 3, nome: "Teatro", icone: 'categorias/teatro.png' },
    { id: 4, nome: "Festival", icone: 'categorias/viagem.png' },
    { id: 5, nome: "Educação", icone: 'categorias/educacao.png' },
    { id: 6, nome: "Infantil", icone: 'categorias/infantil.png' },
    { id: 7, nome: "Tecnologia", icone: 'categorias/tech.png' },
    { id: 8, nome: "Gastronomia", icone: 'categorias/gastronomia.png' },
    { id: 9, nome: "Esportes", icone: 'categorias/esportes.png' },
    { id: 10, nome: "Workshop", icone: 'categorias/games.png' }
  ];

  @ViewChild('carousel') carousel!: ElementRef<HTMLElement>;

  podeVoltar = false;
  podeAvancar = false;

  private resizeObserver?: ResizeObserver;

  constructor(
    private filtroService: FiltroEventosService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngAfterViewInit() {
    this.ngZone.onStable
      .pipe()
      .subscribe(() => {
        this.atualizarSetas();
      });

    setTimeout(() => {
      this.atualizarSetas();
    }, 0);

    requestAnimationFrame(() => {
      this.atualizarSetas();

      requestAnimationFrame(() => {
        this.atualizarSetas();
      });
    });

    this.resizeObserver = new ResizeObserver(() => {
      this.atualizarSetas();
    });

    if (this.carousel?.nativeElement) {
      this.resizeObserver.observe(this.carousel.nativeElement);
    }
  }

  ngOnDestroy() {
    this.resizeObserver?.disconnect();
  }

  atualizarSetas() {
    const element = this.carousel?.nativeElement;

    if (!element) {
      return;
    }

    const tolerancia = 5;
    const noInicio = element.scrollLeft <= tolerancia;
    const noFinal =
      element.scrollLeft + element.clientWidth >=
      element.scrollWidth - tolerancia;

    this.podeVoltar = !noInicio;
    this.podeAvancar = !noFinal;

    this.cdr.detectChanges();
  }

  scrollDireita() {
    const element = this.carousel?.nativeElement;
    if (!element) {
      return;
    }

    const primeiroItem =
      element.querySelector('.item-wrapper') as HTMLElement;
    if (!primeiroItem) {
      return;
    }

    const larguraItem = primeiroItem.offsetWidth;
    const gap = 26;

    element.scrollBy({
      left: larguraItem + gap,
      behavior: 'smooth'
    });

    setTimeout(() => {
      this.atualizarSetas();
    }, 350);
  }

  scrollEsquerda() {
    const element = this.carousel?.nativeElement;
    if (!element) {
      return;
    }

    const primeiroItem =
      element.querySelector('.item-wrapper') as HTMLElement;
    if (!primeiroItem) {
      return;
    }

    const larguraItem = primeiroItem.offsetWidth;
    const gap = 26;

    element.scrollBy({
      left: -(larguraItem + gap),
      behavior: 'smooth'
    });

    setTimeout(() => {
      this.atualizarSetas();
    }, 350);
  }

  selecionarCategoria(nome: string): void {
    this.filtroService.atualizarFiltros({ categoria: nome });
    this.router.navigate(['/eventos']);
  }
}