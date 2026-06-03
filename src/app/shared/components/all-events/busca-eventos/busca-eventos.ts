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
  isFiltrado: boolean = false; // Propriedade direta monitorada pelo escopo

  constructor(private filtroService: FiltroEventosService) {}

  ngOnInit(): void {
    this.filtroService.filtros$.subscribe(f => {
      this.cidade = f.cidade || '';
      this.data = f.data || '';
      this.precoSelecionado = f.preco || 'todos';
      
      // Atualiza o estado booleano de forma reativa a cada emissão do service
      this.isFiltrado = this.cidade !== '' || this.data !== '' || this.precoSelecionatedValido();
    });
  }

  private precoSelecionatedValido(): boolean {
    return this.precoSelecionado !== 'todos' && this.precoSelecionado !== '';
  }

  aoMudarCidade(): void { 
    this.filtroService.atualizarFiltros({ cidade: this.cidade }); 
  }
  
  aoMudarPreco(): void { 
    this.filtroService.atualizarFiltros({ preco: this.precoSelecionado }); 
  }
  
  aoMudarData(): void { 
    this.filtroService.atualizarFiltros({ data: this.data }); 
  }

  limparFiltrosLocal(): void {
    this.cidade = '';
    this.data = '';
    this.precoSelecionado = 'todos';
    this.isFiltrado = false;
    this.filtroService.atualizarFiltros({
      cidade: '',
      data: '',
      preco: 'todos'
    });
  }
}