import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FiltroEventosService } from '../../../../services/filtros/filtro-eventos-service'; // Ajuste o caminho se necessário

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
}