import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { map, Observable } from 'rxjs';
import { Evento } from '../../model/evento';
import { EventoService } from '../../services/evento-service';
import { FiltroEventosService } from '../../services/filtros/filtro-eventos-service';
import { HeaderFiltroComponent } from "../../shared/components/all-events/header-filtro/header-filtro";
import { CategoriasNavComponent } from "../../shared/components/all-events/categorias-nav/categorias-nav";
import { BuscaEventosComponent } from "../../shared/components/all-events/busca-eventos/busca-eventos";
import { ListaEventosComponent } from "../../shared/components/all-events/lista-eventos/lista-eventos";
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-all-events',
  standalone: true,
  imports: [
    CommonModule, 
    HeaderFiltroComponent, 
    CategoriasNavComponent, 
    BuscaEventosComponent, 
    ListaEventosComponent
  ],
  templateUrl: './all-events.html',
  styleUrl: './all-events.css'
})
export class AllEvents implements OnInit {
  eventosFiltrados$!: Observable<Evento[]>;
  temFiltroAtivo$!: Observable<boolean>;

  constructor(
    private eventoService: EventoService,
    private filtroService: FiltroEventosService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const termo = params['q'] || '';
      this.filtroService.atualizarFiltros({ termo: termo });
    });

    const dados = this.eventoService.getEventos();
    this.eventosFiltrados$ = this.filtroService.obterEventosFiltrados(dados);

    this.temFiltroAtivo$ = this.filtroService.filtros$.pipe(
      map(filtros => {
        return !!(
          (filtros.termo && filtros.termo.trim() !== '') || 
          filtros.estado !== '' || 
          filtros.cidade !== '' || 
          (filtros.categoria && filtros.categoria !== 'Todos') ||
          filtros.data !== ''
        );
      })
    );
  }

  limparTudo(): void {
    this.filtroService.resetarFiltros();
    this.router.navigate([], {
      queryParams: { q: null },
      queryParamsHandling: 'merge'
    });
  }
}