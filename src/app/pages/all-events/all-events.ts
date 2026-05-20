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
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all-events',
  standalone: true,
  imports: [CommonModule, HeaderFiltroComponent, CategoriasNavComponent, BuscaEventosComponent, ListaEventosComponent],
  templateUrl: './all-events.html',
  styleUrl: './all-events.css'
})
export class AllEvents implements OnInit {
  // Usamos o sinal "$" para indicar que é um fluxo de dados (Observable)
  eventosFiltrados$!: Observable<Evento[]>;

  temFiltroAtivo$!: Observable<boolean>

  constructor(
    private eventoService: EventoService,
    private filtroService: FiltroEventosService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const termo = params['q'] || '';
      // 2. Atualiza o serviço de filtro com o termo da URL
      this.filtroService.atualizarFiltros({ termo: termo });
    });

    // Chamamos o getEventos() que retorna o array e passamos para o filtro
    const dados = this.eventoService.getEventos();
    this.eventosFiltrados$ = this.filtroService.obterEventosFiltrados(dados);

    this.temFiltroAtivo$ = this.filtroService.filtros$.pipe(
      map(filtros => {
        return !!(
          filtros.termo.trim() !== '' || 
          filtros.estado !== '' || 
          filtros.cidade !== '' || 
          filtros.categoria !== 'Todos' ||
          filtros.data !== ''
        );
      })
    );
  }

  limparTudo() {
    // Limpa os filtros do Service (Estado, Cidade, Categoria)
    this.filtroService.resetarFiltros();
    
    // Limpa a URL (Barra de pesquisa do Header)
    this.router.navigate([], {
      queryParams: { q: null },
      queryParamsHandling: 'merge'
    });
  }
}