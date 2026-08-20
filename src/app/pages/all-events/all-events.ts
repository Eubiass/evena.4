import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { map, Observable } from 'rxjs';
import { Evento } from '../../model/evento';
import { EventoService } from '../../services/evento-service';
import { FiltroEventosService, Filtros } from '../../services/filtros/filtro-eventos-service';
import { ActivatedRoute, Router } from '@angular/router';

// Componentes Reutilizáveis
import { HeaderEvents } from '../../shared/components/all-events/header-events/header-events';
import { GridEvents } from '../../shared/components/all-events/grid-events/grid-events';
import { CategoriasNav } from '../../shared/components/all-events/categorias-nav/categorias-nav';
import { ModalFiltros } from '../../shared/components/all-events/modal-filtros/modal-filtros';

@Component({
  selector: 'app-all-events',
  standalone: true,
  imports: [
    CommonModule, 
    HeaderEvents, 
    GridEvents,
    CategoriasNav,
    ModalFiltros
  ],
  templateUrl: './all-events.html',
  styleUrl: './all-events.css'
})
export class AllEvents implements OnInit {
  eventosFiltrados$!: Observable<Evento[]>;
  temFiltroAtivo$!: Observable<boolean>;
  
  modalFiltroAberto = false;
  filtrosAtuais!: Filtros;

  constructor(
    private eventoService: EventoService,
    private filtroService: FiltroEventosService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.filtroService.filtros$.subscribe(f => {
      this.filtrosAtuais = f;
    });

    this.route.queryParams.subscribe(params => {
      const termo = params['q'] || '';
      if (termo) {
        this.filtroService.atualizarFiltros({ termo: termo });
      }
    });

    const dados = this.eventoService.getEventos();
    this.eventosFiltrados$ = this.filtroService.obterEventosFiltrados(dados);

    this.temFiltroAtivo$ = this.filtroService.filtros$.pipe(
      map(filtros => !!(
        (filtros.termo && filtros.termo.trim() !== '') || 
        filtros.estado !== '' || 
        filtros.cidade !== '' || 
        filtros.preco !== 'todos' ||
        (filtros.categoria && filtros.categoria !== 'Todos' && filtros.categoria !== 'todas') ||
        filtros.data !== ''
      ))
    );
  }

  abrirModalFiltros(): void {
    this.modalFiltroAberto = true;
  }

  fecharModalFiltros(): void {
    this.modalFiltroAberto = false;
  }

  aplicarFiltrosDoModal(novosFiltros: Filtros): void {
    this.filtroService.atualizarFiltros(novosFiltros);
    this.fecharModalFiltros();
  }

  aoSelecionarCategoria(categoriaId: string): void {
    const categoriaFiltro = categoriaId === 'todas' ? 'Todos' : categoriaId;
    this.filtroService.atualizarFiltros({ categoria: categoriaFiltro });
  }

  limparTudo(): void {
    this.filtroService.resetarFiltros();
    this.router.navigate([], {
      queryParams: { q: null },
      queryParamsHandling: 'merge'
    });
  }
}