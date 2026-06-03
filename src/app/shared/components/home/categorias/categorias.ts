import { Component, ElementRef, ViewChild } from '@angular/core';
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
export class Categorias {
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

  constructor(
    private filtroService: FiltroEventosService,
    private router: Router
  ) {}

  scrollDireita() {
    this.carousel.nativeElement.scrollLeft += 380;
  }

  scrollEsquerda() {
    this.carousel.nativeElement.scrollLeft -= 380;
  }

  selecionarCategoria(nome: string): void {
    this.filtroService.atualizarFiltros({ categoria: nome });
    this.router.navigate(['/eventos']); 
  }
}