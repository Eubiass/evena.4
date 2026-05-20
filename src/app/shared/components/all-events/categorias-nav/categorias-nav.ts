import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FiltroEventosService } from '../../../../services/filtros/filtro-eventos-service';

@Component({
  selector: 'app-categorias-nav',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './categorias-nav.html',
  styleUrl: './categorias-nav.css'
})
export class CategoriasNavComponent implements OnInit, AfterViewInit {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLElement>;

  public categorias: string[] = ['Todos', 'Música', 'Teatro', 'Educação', 'Infantil', 'Tecnologia', 'Gastronomia', 'Esportes', 'Festival', 'Workshop', 'Stand-up', 'Networking'];
  public categoriaAtiva: string = 'Todos';
  
  public podeScrollEsquerda = false;
  public podeScrollDireita = true;

  constructor(public filtroService: FiltroEventosService) {}

  ngOnInit(): void {
    this.filtroService.filtros$.subscribe(f => this.categoriaAtiva = f.categoria);
  }

  ngAfterViewInit(): void {
    // Pequeno delay para o Angular renderizar os chips antes de calcular o scroll
    setTimeout(() => this.verificarScroll(), 100);
    window.addEventListener('resize', () => this.verificarScroll());
  }

  public mover(direcao: number): void {
    const el = this.scrollContainer.nativeElement;
    // Move 70% da largura visível para uma rolagem fluida
    const scrollAmount = el.offsetWidth * 0.7; 
    el.scrollBy({ left: direcao * scrollAmount, behavior: 'smooth' });
  }

  public verificarScroll(): void {
    if (!this.scrollContainer) return;
    const el = this.scrollContainer.nativeElement;
    
    // Margem de 5px para evitar problemas de arredondamento de pixels nos navegadores
    this.podeScrollEsquerda = el.scrollLeft > 5;
    this.podeScrollDireita = el.scrollLeft + el.offsetWidth < el.scrollWidth - 5;
  }

  public selecionar(cat: string): void {
    this.filtroService.atualizarFiltros({ categoria: cat });
  }
}