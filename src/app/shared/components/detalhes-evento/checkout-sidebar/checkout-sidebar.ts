
import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

import { Evento } from '../../../../models/evento';
import { AuthService } from '../../../../services/auth.service';
import { FavoritosService } from '../../../../services/favoritos.service';

import { OrganizerCard } from './organizer-card/organizer-card';
import { EventActions } from './event-actions/event-actions';
import { EventBriefInfo } from './event-brief-info/event-brief-info';
import { PriceHeader } from './price-header/price-header';

@Component({
  selector: 'app-checkout-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    OrganizerCard,
    EventActions,
    EventBriefInfo,
    PriceHeader
  ],
  templateUrl: './checkout-sidebar.html',
  styleUrl: './checkout-sidebar.css'
})
export class CheckoutSidebar implements OnChanges, OnDestroy {
  @Input() evento?: Evento;

  isFavoritado = false;
  isSeguindo = false;
  salvandoFavorito = false;

  private perfilId: number | null = null;
  private eventoId: number | null = null;

  private idsSubscription?: Subscription;
  private carregamentoSubscription?: Subscription;
  private operacaoSubscription?: Subscription;

  constructor(
    private readonly authService: AuthService,
    private readonly favoritosService: FavoritosService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['evento']) {
      this.carregarEstadoFavorito();
    }
  }

  ngOnDestroy(): void {
    this.idsSubscription?.unsubscribe();
    this.carregamentoSubscription?.unsubscribe();
    this.operacaoSubscription?.unsubscribe();
  }

  get organizador() {
    return {
      nome: this.evento?.organizadorNome
        || 'Organizador não informado',
      foto: '',
      verificado: false,
      seguidores: 0
    };
  }

  private carregarEstadoFavorito(): void {
    this.idsSubscription?.unsubscribe();
    this.carregamentoSubscription?.unsubscribe();

    this.isFavoritado = false;

    const sessao = this.authService.getSessaoUsuario();
    const perfilId = Number(sessao?.id);
    const eventoId = Number(this.evento?.id);

    if (
      !sessao ||
      !Number.isInteger(perfilId) ||
      perfilId <= 0 ||
      !Number.isInteger(eventoId) ||
      eventoId <= 0
    ) {
      this.perfilId = null;
      this.eventoId = null;
      this.cdr.markForCheck();
      return;
    }

    this.perfilId = perfilId;
    this.eventoId = eventoId;

    // O botão acompanha o mesmo estado utilizado pelos cards.
    this.idsSubscription = this.favoritosService.ids$.subscribe(ids => {
      if (
        this.perfilId === perfilId &&
        this.eventoId === eventoId
      ) {
        this.isFavoritado = ids.has(eventoId);
        this.cdr.markForCheck();
      }
    });

    // O serviço compartilha a consulta com os demais componentes.
    this.carregamentoSubscription = this.favoritosService
      .carregarFavoritos(perfilId)
      .subscribe({
        error: erro => {
          console.error(
            'Não foi possível carregar os favoritos:',
            erro
          );
        }
      });
  }

  alternarFavorito(): void {
    if (this.salvandoFavorito) {
      return;
    }

    const sessao = this.authService.getSessaoUsuario();
    const perfilId = Number(sessao?.id);
    const eventoId = Number(this.evento?.id);

    if (!sessao || !Number.isInteger(perfilId) || perfilId <= 0) {
      alert('Entre na sua conta de frequentador para favoritar eventos.');
      return;
    }

    if (!Number.isInteger(eventoId) || eventoId <= 0) {
      alert('Não foi possível identificar este evento. Tente novamente.');
      return;
    }

    this.salvandoFavorito = true;
    this.cdr.markForCheck();

    this.operacaoSubscription?.unsubscribe();

    this.operacaoSubscription = this.favoritosService
      .definirFavorito(perfilId, eventoId, !this.isFavoritado)
      .subscribe({
        next: () => {
          this.salvandoFavorito = false;
          this.cdr.markForCheck();
        },
        error: erro => {
          console.error('Erro ao atualizar favorito:', erro);

          this.salvandoFavorito = false;
          this.cdr.markForCheck();

          alert(
            erro?.name === 'TimeoutError'
              ? 'A solicitação demorou demais. Verifique sua conexão e tente novamente.'
              : erro?.error?.mensagem ||
                'Não foi possível atualizar seus favoritos. Tente novamente.'
          );
        }
      });
  }

  alternarSeguir(event: Event): void {
    event.stopPropagation();
    this.isSeguindo = !this.isSeguindo;
  }

  irParaPerfilOrganizador(): void {
    /*
     * O EventoResponse atual ainda não fornece
     * um ID de perfil público para navegação.
     */
  }

  adicionarAoCalendario(): void {
    if (!this.evento?.datasOcorrencia?.length) {
      return;
    }

    const dataInicio = this.formatarDataGoogle(
      this.evento.datasOcorrencia[0]
    );

    if (!dataInicio) {
      return;
    }

    const titulo = encodeURIComponent(this.evento.titulo);
    const detalhes = encodeURIComponent(
      this.evento.descricao || ''
    );

    const local = encodeURIComponent(
      this.evento.online
        ? 'Evento online'
        : (
            this.evento.enderecoCompleto ||
            this.evento.localNome ||
            ''
          )
    );

    const googleCalendarUrl =
      'https://calendar.google.com/calendar/render' +
      '?action=TEMPLATE' +
      `&text=${titulo}` +
      `&dates=${dataInicio}/${dataInicio}` +
      `&details=${detalhes}` +
      `&location=${local}`;

    window.open(googleCalendarUrl, '_blank');
  }

  compartilharEvento(): void {
    if (!this.evento) {
      return;
    }

    const dadosCompartilhar = {
      title: this.evento.titulo,
      text: `Confira o evento ${this.evento.titulo} no Evena!`,
      url: window.location.href
    };

    if (navigator.share) {
      navigator.share(dadosCompartilhar).catch(() => {});
      return;
    }

    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        alert('Link copiado para a área de transferência!');
      })
      .catch(() => {
        alert('Não foi possível copiar o link.');
      });
  }

  redirecionarParceiro(): void {
    const link = this.evento?.linkCompra;

    if (!link) {
      const busca = encodeURIComponent(
        `${this.evento?.titulo || ''} ingressos oficial`
      );

      window.open(
        `https://www.google.com/search?q=${busca}`,
        '_blank'
      );

      return;
    }

    const url = /^https?:\/\//i.test(link)
      ? link
      : `https://${link}`;

    window.open(url, '_blank');
  }

  private formatarDataGoogle(dataHora: string): string {
    if (!dataHora) {
      return '';
    }

    return dataHora
      .replace(/[-:]/g, '')
      .replace(/\.\d+$/, '');
  }
}
