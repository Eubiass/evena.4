import { ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Evento } from '../../../../models/evento';
import { AuthService } from '../../../../services/auth.service';
import { API_URL } from '../../../../config/api.config';
import { OrganizerCard } from './organizer-card/organizer-card';
import { EventActions } from './event-actions/event-actions';
import { EventBriefInfo } from './event-brief-info/event-brief-info';
import { PriceHeader } from './price-header/price-header';

interface EventoFavoritoResponse {
  id: number;
}

@Component({
  selector: 'app-checkout-sidebar',
  standalone: true,
  imports: [ CommonModule, OrganizerCard, EventActions, EventBriefInfo, PriceHeader ],
  templateUrl: './checkout-sidebar.html',
  styleUrl: './checkout-sidebar.css'
})
export class CheckoutSidebar implements OnChanges {
  @Input() evento?: Evento;

  isSalvo = false;
  isSeguindo = false;
  salvandoFavorito = false;

  private versaoEstadoFavorito = 0;

  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['evento']) {
      this.carregarEstadoFavorito();
    }
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
    const versao = ++this.versaoEstadoFavorito;
    const eventoId = Number(this.evento?.id);
    const sessao = this.authService.getSessaoUsuario();
    const perfilId = Number(sessao?.id);

    if (
      !sessao ||
      !Number.isInteger(perfilId) ||
      perfilId <= 0 ||
      !Number.isInteger(eventoId) ||
      eventoId <= 0
    ) {
      this.isSalvo = false;
      this.cdr.detectChanges();
      return;
    }

    const url = `${API_URL}/perfis/${perfilId}/favoritos`;

    this.http.get<EventoFavoritoResponse[]>(url).subscribe({
      next: (favoritos) => {
        if (versao !== this.versaoEstadoFavorito) {
          return;
        }

        if (Number(this.evento?.id) !== eventoId) {
          return;
        }

        if (this.salvandoFavorito) {
          return;
        }

        this.isSalvo = (favoritos ?? []).some(
          favorito => Number(favorito.id) === eventoId
        );

        this.cdr.detectChanges();
      },
      error: (erro) => {
        console.error(
          'Não foi possível carregar os favoritos:',
          erro
        );
      }
    });
  }

  alternarSalvar(): void {
    if (this.salvandoFavorito) {
      return;
    }

    const sessao = this.authService.getSessaoUsuario();

    if (!sessao?.id || !this.evento?.id) {
      alert('Entre na sua conta de frequentador para salvar eventos.');
      return;
    }

    const perfilId = Number(sessao.id);
    const eventoId = Number(this.evento.id);
    const estavaSalvo = this.isSalvo;

    const url =
      `${API_URL}/perfis/${perfilId}/favoritos/${eventoId}`;

    this.salvandoFavorito = true;

    // Atualiza a interface imediatamente.
    this.isSalvo = !estavaSalvo;
    this.cdr.detectChanges();

    const requisicao = estavaSalvo
      ? this.http.delete<unknown>(url)
      : this.http.post<unknown>(url, {});

    requisicao.subscribe({
      next: () => {
        this.salvandoFavorito = false;
        this.cdr.detectChanges();
      },
      error: (erro) => {
        console.error('Erro ao atualizar favorito:', erro);

        this.salvandoFavorito = false;
        this.isSalvo = estavaSalvo;
        this.cdr.detectChanges();

        alert(
          erro?.error?.mensagem ||
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
    if (
      !this.evento ||
      !this.evento.datasOcorrencia?.length
    ) {
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
