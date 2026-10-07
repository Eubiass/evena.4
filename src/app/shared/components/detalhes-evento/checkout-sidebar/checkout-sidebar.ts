import {
  Component,
  Input
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { Evento } from '../../../../models/evento';

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
export class CheckoutSidebar {
  @Input()
  evento?: Evento;

  isSalvo = false;
  isSeguindo = false;

  get organizador() {
    return {
      nome:
        this.evento
          ?.organizadorNome ||
        'Organizador não informado',

      foto: '',

      verificado: false,

      seguidores: 0
    };
  }

  alternarSalvar(): void {
    this.isSalvo =
      !this.isSalvo;
  }

  alternarSeguir(
    event: Event
  ): void {
    event.stopPropagation();

    this.isSeguindo =
      !this.isSeguindo;
  }

  irParaPerfilOrganizador(): void {
    /*
     * O EventoResponse atual ainda não
     * fornece um ID de perfil público
     * para navegação.
     */
  }

  adicionarAoCalendario(): void {
    if (
      !this.evento ||
      !this.evento
        .datasOcorrencia
        .length
    ) {
      return;
    }

    const dataInicio =
      this.formatarDataGoogle(
        this.evento
          .datasOcorrencia[0]
      );

    if (!dataInicio) {
      return;
    }

    const titulo =
      encodeURIComponent(
        this.evento.titulo
      );

    const detalhes =
      encodeURIComponent(
        this.evento
          .descricao ||
        ''
      );

    const local =
      encodeURIComponent(
        this.evento.online
          ? 'Evento online'
          : (
              this.evento
                .enderecoCompleto ||
              this.evento
                .localNome ||
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

    window.open(
      googleCalendarUrl,
      '_blank'
    );
  }

  compartilharEvento(): void {
    if (!this.evento) {
      return;
    }

    const dadosCompartilhar = {
      title:
        this.evento.titulo,

      text:
        `Confira o evento ${this.evento.titulo} no Evena!`,

      url:
        window.location.href
    };

    if (
      navigator.share
    ) {
      navigator
        .share(
          dadosCompartilhar
        )
        .catch(
          () => {}
        );

      return;
    }

    navigator.clipboard
      .writeText(
        window.location.href
      )
      .then(() =>
        alert(
          'Link copiado para a área de transferência!'
        )
      )
      .catch(() =>
        alert(
          'Não foi possível copiar o link.'
        )
      );
  }

  redirecionarParceiro(): void {
    const link =
      this.evento
        ?.linkCompra;

    if (!link) {
      const busca =
        encodeURIComponent(
          `${this.evento?.titulo || ''} ingressos oficial`
        );

      window.open(
        `https://www.google.com/search?q=${busca}`,
        '_blank'
      );

      return;
    }

    const url =
      /^https?:\/\//i.test(
        link
      )
        ? link
        : `https://${link}`;

    window.open(
      url,
      '_blank'
    );
  }

  private formatarDataGoogle(
    dataHora: string
  ): string {
    if (!dataHora) {
      return '';
    }

    return dataHora
      .replace(
        /[-:]/g,
        ''
      )
      .replace(
        /\.\d+$/,
        ''
      );
  }
}