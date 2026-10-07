import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { Evento } from '../../models/evento';
import { EventoService } from '../../services/evento-service';

import { HeaderDetalhe } from '../../shared/components/detalhes-evento/header-detalhe/header-detalhe';
import { InfoEsquerda } from '../../shared/components/detalhes-evento/info-esquerda/info-esquerda';
import { CheckoutSidebar } from '../../shared/components/detalhes-evento/checkout-sidebar/checkout-sidebar';
import { Header } from '../../shared/components/header/header';
import { Footer } from '../../shared/components/footer/footer';

@Component({
  selector: 'app-detalhes-evento',
  standalone: true,
  imports: [
    CommonModule,
    HeaderDetalhe,
    InfoEsquerda,
    CheckoutSidebar,
    Header,
    Footer
  ],
  templateUrl: './detalhes-evento.html',
  styleUrl: './detalhes-evento.css'
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
    this.route.paramMap.subscribe(
      params => {
        const slug =
          params.get('slug') ?? '';

        if (!slug) {
          return;
        }

        this.eventoService
          .obterEventoPorSlug(
            slug
          )
          .subscribe({
            next: evento => {
              this.evento =
                evento;

              this.diaSelecionadoIndex =
                0;

              this.cdr.detectChanges();
            },

            error: erro => {
              console.error(
                'Erro ao carregar evento:',
                erro
              );
            }
          });
      }
    );

    window.scrollTo(
      0,
      0
    );
  }

  mudarDia(
    index: number
  ): void {
    this.diaSelecionadoIndex =
      index;
  }
}