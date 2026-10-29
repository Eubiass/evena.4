
import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

import { Evento } from '../../../models/evento';
import { AuthService } from '../../../services/auth.service';
import { FavoritosService } from '../../../services/favoritos.service';

@Component({
  selector: 'app-card-evento',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './card-evento.html',
  styleUrl: './card-evento.css'
})
export class CardEvento implements OnChanges, OnDestroy {
  @Input({ required: true }) dadosEvento!: Evento;

  isFavoritado = false;
  salvandoFavorito = false;
  imagemFallback = false;

  private idsSubscription?: Subscription;
  private carregamentoSubscription?: Subscription;
  private operacaoSubscription?: Subscription;

  private perfilId: number | null = null;

  constructor(
    private readonly authService: AuthService,
    private readonly favoritosService: FavoritosService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dadosEvento']) {
      this.imagemFallback = false;
      this.conectarFavoritos();
    }
  }

  ngOnDestroy(): void {
    this.idsSubscription?.unsubscribe();
    this.carregamentoSubscription?.unsubscribe();
    this.operacaoSubscription?.unsubscribe();
  }

  gerarSlug(texto: string): string {
    return (texto ?? '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  get imagemExibida(): string {
    return this.imagemFallback || !this.dadosEvento?.imagem
      ? '/evento1.jpg'
      : this.dadosEvento.imagem;
  }

  tratarErroImagem(): void {
    this.imagemFallback = true;
  }

  alternarFavorito(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();

    if (this.salvandoFavorito) {
      return;
    }

    const sessao = this.authService.getSessaoUsuario();
    const perfilId = Number(sessao?.id);
    const eventoId = Number(this.dadosEvento?.id);

    if (!sessao || !Number.isInteger(perfilId) || perfilId <= 0) {
      alert('Entre na sua conta de frequentador para salvar eventos.');
      return;
    }

    if (!Number.isInteger(eventoId) || eventoId <= 0) {
      console.error('Não foi possível favoritar: ID do evento inválido.');
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

  private conectarFavoritos(): void {
    this.idsSubscription?.unsubscribe();
    this.carregamentoSubscription?.unsubscribe();

    this.isFavoritado = false;

    const sessao = this.authService.getSessaoUsuario();
    const perfilId = Number(sessao?.id);
    const eventoId = Number(this.dadosEvento?.id);

    if (
      !sessao ||
      !Number.isInteger(perfilId) ||
      perfilId <= 0 ||
      !Number.isInteger(eventoId) ||
      eventoId <= 0
    ) {
      this.perfilId = null;
      this.salvandoFavorito = false;
      return;
    }

    this.perfilId = perfilId;

    this.idsSubscription = this.favoritosService.ids$.subscribe(ids => {
      if (this.perfilId === perfilId) {
        this.isFavoritado = ids.has(eventoId);
        this.cdr.markForCheck();
      }
    });

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
}
