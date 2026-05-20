import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-categorias',
  standalone: true,
  templateUrl: './categorias.html',
  styleUrl: './categorias.css',
})
export class Categorias {
  categorias = [
    { id: 1, nome: "Negócios", icone: 'categorias/negocios.png' },
    { id: 2, nome: "Música", icone: 'categorias/shows.png' },
    { id: 3, nome: "Teatro", icone: 'categorias/teatro.png' },
    { id: 4, nome: "Viagens", icone: 'categorias/viagem.png' },
    { id: 5, nome: "Educação", icone: 'categorias/educacao.png' },
    { id: 6, nome: "Infantil", icone: 'categorias/infantil.png' },
    { id: 7, nome: "Tecnologia", icone: 'categorias/tech.png' },
    { id: 8, nome: "Gastrônomia", icone: 'categorias/gastronomia.png' },
    { id: 9, nome: "Esportes", icone: 'categorias/esportes.png' },
    { id: 10, nome: "Games", icone: 'categorias/games.png' }
  ];

  @ViewChild('carousel') carousel!: ElementRef;

  scrollDireita() {
    this.carousel.nativeElement.scrollLeft += 380;
  }

  scrollEsquerda() {
    this.carousel.nativeElement.scrollLeft -= 380;
  }
}