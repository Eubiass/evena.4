import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  Router,
  RouterLink
} from '@angular/router';
import {
  finalize
} from 'rxjs';

import { Evento } from '../../models/evento';
import {
  AuthService,
  SessaoOrganizador
} from '../../services/auth.service';
import { EventoService } from '../../services/evento-service';

import { Footer } from '../../shared/components/footer/footer';
import { Header } from '../../shared/components/header/header';

@Component({
  selector: 'app-perfil-organizador',
  standalone: true,
  imports: [
    RouterLink,
    Header,
    Footer
  ],
  templateUrl: './perfil-organizador.html',
  styleUrl: './perfil-organizador.css'
})
export class PerfilOrganizador implements OnInit {
  sessao: SessaoOrganizador | null;

  eventos: Evento[] = [];
  carregandoEventos = false;
  erroEventos = '';

  eventoRemovendoId: number | null = null;

  constructor(
    private authService: AuthService,
    private eventoService: EventoService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.sessao = this.authService.getSessao();
  }

  ngOnInit(): void {
    this.carregarEventos();
  }

  get perfil() {
    return this.sessao?.perfil;
  }

  get empresa() {
    return this.sessao?.empresa;
  }

  get usuario(): string {
    const nome =
      this.empresa?.nome ?? '';

    return nome
      .normalize('NFD')
      .replace(
        /[\u0300-\u036f]/g,
        ''
      )
      .toLowerCase()
      .replace(
        /[^a-z0-9]/g,
        ''
      );
  }

  get localizacao(): string {
    const endereco = this.empresa?.endereco;  

    if (!endereco) {
      return '';
    } 

    const partes = endereco
      .split(',')
      .map(parte => parte.trim())
      .filter(Boolean); 

    if (partes.length >= 3) {
      const cidade = partes[partes.length - 3];
      const estado = partes[partes.length - 2]; 

      return `${cidade}, ${estado}`;
    } 

    return endereco;
  }

  abrirEvento(
    evento: Evento
  ): void {
    const slug =
      this.criarSlug(
        evento.titulo
      );

    this.router.navigate([
      '/detalhes-evento',
      slug
    ]);
  }

  removerEvento(
    evento: Evento
  ): void {
    if (
      this.eventoRemovendoId !== null
    ) {
      return;
    }

    const confirmar =
      window.confirm(
        `Deseja excluir o evento "${evento.titulo}"?`
      );

    if (!confirmar) {
      return;
    }

    this.eventoRemovendoId =
      evento.id;

    this.eventoService
      .removerEvento(evento.id)
      .subscribe({
        next: () => {
          this.eventos =
            this.eventos.filter(
              item =>
                item.id !== evento.id
            );

          this.eventoRemovendoId =
            null;
        },

        error: erro => {
          this.eventoRemovendoId =
            null;

          console.error(
            'Erro ao excluir evento:',
            erro
          );

          alert(
            erro.error?.erro ??
            erro.error?.mensagem ??
            'Não foi possível excluir o evento.'
          );
        }
      });
  }

  formatarPreco(
    evento: Evento
  ): string {
    if (!evento.preco) {
      return 'Gratuito';
    }

    return evento.preco.toLocaleString(
      'pt-BR',
      {
        style: 'currency',
        currency: 'BRL'
      }
    );
  }

  sair(): void {
    this.authService.logout();

    this.router.navigate([
      '/'
    ]);
  }

  private carregarEventos(): void {
    const empresaId =
      this.authService.getEmpresaId();  

    this.eventos = [];
    this.erroEventos = '';  

    if (!empresaId) {
      this.erroEventos =
        'Não foi possível identificar a empresa do organizador.'; 

      this.carregandoEventos = false;
      this.cdr.detectChanges();
      return;
    } 

    this.carregandoEventos = true;  

    this.eventoService
      .getEventosDaEmpresa(empresaId)
      .subscribe({
        next: eventos => {
          this.eventos = eventos;
          this.carregandoEventos = false;
          this.cdr.detectChanges();
        },  

        error: erro => {
          console.error(
            'Erro ao carregar eventos da empresa:',
            erro
          );  

          this.erroEventos =
            'Não foi possível carregar os eventos.';  

          this.carregandoEventos = false;
          this.cdr.detectChanges();
        }
      });
  }

  private criarSlug(
    texto: string
  ): string {
    return texto
      .normalize('NFD')
      .replace(
        /[\u0300-\u036f]/g,
        ''
      )
      .toLowerCase()
      .trim()
      .replace(
        /[^a-z0-9]+/g,
        '-'
      )
      .replace(
        /^-+|-+$/g,
        ''
      );
  }
}