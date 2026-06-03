import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FiltroEventosService } from '../../../../services/filtros/filtro-eventos-service';

@Component({
  selector: 'app-categorias-nav',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './categorias-nav.html',
  styleUrl: './categorias-nav.css'
})
export class CategoriasNavComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLElement>;

  public categorias: string[] = ['Todos', 'Música', 'Teatro', 'Educação', 'Infantil', 'Tecnologia', 'Gastronomia', 'Esportes', 'Festival', 'Workshop', 'Stand-up', 'Networking'];
  public categoriaAtiva: string = 'Todos';
  
  public podeScrollEsquerda = false;
  public podeScrollDireita = true;

  private resizeListener!: () => void;

  constructor(public filtroService: FiltroEventosService) {}

  ngOnInit(): void {
    this.filtroService.filtros$.subscribe(f => this.categoriaAtiva = f.categoria);
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.verificarScroll(), 100);
    
    this.resizeListener = () => this.verificarScroll();
    window.addEventListener('resize', this.resizeListener);
  }

  ngOnDestroy(): void {
    if (this.resizeListener) {
      window.removeEventListener('resize', this.resizeListener);
    }
  }

  public mover(direcao: number): void {
    if (!this.scrollContainer) return;
    const el = this.scrollContainer.nativeElement;
    const scrollAmount = el.offsetWidth * 0.7; 
    el.scrollBy({ left: direcao * scrollAmount, behavior: 'smooth' });
  }

  public verificarScroll(): void {
    if (!this.scrollContainer) return;
    const el = this.scrollContainer.nativeElement;
    
    this.podeScrollEsquerda = el.scrollLeft > 5;
    this.podeScrollDireita = el.scrollLeft + el.offsetWidth < el.scrollWidth - 5;
  }

  public selecionar(cat: string): void {
    this.filtroService.atualizarFiltros({ categoria: cat });
  }

  /**
   * REQUISITO WCAG: Permite que usuários de teclado naveguem entre os chips usando as setas horizontais.
   */
   public moverFocoTeclado(event: any, direcao: number): void {
    const target = event.target as HTMLElement;
    const li = target.parentElement;
    if (!li) return;

    const proximoLi = direcao === 1 ? li.nextElementSibling : li.previousElementSibling;
    const proximoBotao = proximoLi?.querySelector('button') as HTMLElement;

    if (proximoBotao) {
      proximoBotao.focus();
      event.preventDefault(); // Evita o scroll padrão das setas do teclado
    }
  }
}