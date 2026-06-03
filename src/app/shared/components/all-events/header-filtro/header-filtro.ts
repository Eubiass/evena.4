import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FiltroEventosService } from '../../../../services/filtros/filtro-eventos-service'; 

@Component({
  selector: 'app-header-filtro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./header-filtro.html",
  styleUrl: "./header-filtro.css",
})
export class HeaderFiltroComponent implements OnInit {
  estadoSelecionado: string = '';

  constructor(private filtroService: FiltroEventosService) {}

  ngOnInit(): void {
    this.filtroService.filtros$.subscribe(filtros => {
      this.estadoSelecionado = filtros.estado;
    });
  }

  onEstadoChange(): void {
    this.filtroService.atualizarFiltros({ 
      estado: this.estadoSelecionado,
      cidade: ''
    });
  }

  /**
   * Calcula dinamicamente a largura do select baseado na opção ativa
   * para garantir que a linha sublinhada abrace apenas o texto visível.
   */
  get selectWidth(): string {
    if (!this.estadoSelecionado) {
      return '7.5ch'; // Tamanho seguro para a palavra "Brasil" + espaço do ícone
    }

    const estados: { [key: string]: string } = {
      AC: 'Acre', AL: 'Alagoas', AP: 'Amapá', AM: 'Amazonas', BA: 'Bahia', CE: 'Ceará',
      DF: 'Distrito Federal', ES: 'Espírito Santo', GO: 'Goiás', MA: 'Maranhão',
      MT: 'Mato Grosso', MS: 'Mato Grosso do Sul', MG: 'Minas Gerais', PA: 'Pará',
      PB: 'Paraíba', PR: 'Paraná', PE: 'Pernambuco', PI: 'Piauí', RJ: 'Rio de Janeiro',
      RN: 'Rio Grande do Norte', RS: 'Rio Grande do Sul', RO: 'Rondônia', RR: 'Roraima',
      SC: 'Santa Catarina', SP: 'São Paulo', SE: 'Sergipe', TO: 'Tocantins'
    };

    const nomeEstado = estados[this.estadoSelecionado] || 'Brasil';
    
    // Retorna o tamanho do texto do estado com uma folga para acomodar a seta interna
    return `${nomeEstado.length + 2.5}ch`;
  }
}