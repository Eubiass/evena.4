import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FiltroEventosService } from '../../../../services/filtros/filtro-eventos-service';

@Component({
  selector: 'app-busca-eventos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './busca-eventos.html',
  styleUrl: './busca-eventos.css'
})

export class BuscaEventosComponent implements OnInit {
  cidade: string = '';
  data: string = '';
  precoSelecionado: string = 'todos';

  constructor(private filtroService: FiltroEventosService) {}

  ngOnInit(): void {
    this.filtroService.filtros$.subscribe(f => {
      this.cidade = f.cidade;
      this.data = f.data;
      this.precoSelecionado = f.preco;
    });
  }

  aoMudarCidade() { this.filtroService.atualizarFiltros({ cidade: this.cidade }); }
  aoMudarPreco() { this.filtroService.atualizarFiltros({ preco: this.precoSelecionado }); }
  aoMudarData() { this.filtroService.atualizarFiltros({ data: this.data }); }
}