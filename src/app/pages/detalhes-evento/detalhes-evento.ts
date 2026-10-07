import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EventoService } from '../../services/evento-service';
import { HeaderDetalhe } from '../../shared/components/detalhes-evento/header-detalhe/header-detalhe';
import { InfoEsquerda } from '../../shared/components/detalhes-evento/info-esquerda/info-esquerda';
import { CheckoutSidebar } from '../../shared/components/detalhes-evento/checkout-sidebar/checkout-sidebar';
import { Header } from '../../shared/components/header/header';
import { Footer } from '../../shared/components/footer/footer';
import { Evento } from '../../models/evento';

@Component({
  selector: 'app-detalhes-evento',
  standalone: true,
  imports: [ CommonModule, HeaderDetalhe, InfoEsquerda, CheckoutSidebar, Header, Footer ],
  templateUrl: './detalhes-evento.html',
  styleUrl: './detalhes-evento.css',
})
export class DetalhesEvento implements OnInit {

  evento?: Evento;
  diaSelecionadoIndex = 0;

  constructor(
    private route: ActivatedRoute,
    private eventoService: EventoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug') || '';
      this.eventoService.obterEventoPorSlug(slug).subscribe(evento => {
        this.evento = evento;
        if (!this.evento) {
          console.error(
            'Evento não encontrado para o slug:',
            slug
          );
          return;
        }
        // Garante que o evento seja renderizado imediatamente
        this.cdr.detectChanges();
      });
    });

    window.scrollTo(0, 0);
  }

  mudarDia(index: number): void {
    this.diaSelecionadoIndex = index;
  }
}