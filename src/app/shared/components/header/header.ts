
import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  OnDestroy,
  ViewChild
} from '@angular/core';

import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive
} from '@angular/router';

import { filter, Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';

import {
  AuthService,
  PerfilResponse
} from '../../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    FormsModule
  ],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header implements OnInit, OnDestroy {

  @ViewChild('campoBusca')
  campoBusca?: ElementRef<HTMLInputElement>;

  @ViewChild('botaoMenu')
  botaoMenu?: ElementRef<HTMLButtonElement>;

  @ViewChild('painelMenu')
  painelMenu?: ElementRef<HTMLElement>;

  @ViewChild('botaoFecharMenu')
  botaoFecharMenu?: ElementRef<HTMLButtonElement>;

  menuAberto = false;
  pesquisaAtiva = false;
  termoPesquisa = '';

  usuarioAutenticado = false;
  nomeUsuario = '';
  fotoUsuario = '';
  rotaPerfil = '/login';

  tipoConta: 'usuario' | 'organizador' | null = null;

  private inscricaoRota?: Subscription;
  private inscricaoParametros?: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private elementRef: ElementRef,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.atualizarSessao();

    this.inscricaoRota = this.router.events
      .pipe(filter(evento => evento instanceof NavigationEnd))
      .subscribe(() => {
        this.atualizarSessao();
      });

    this.inscricaoParametros = this.route.queryParams
      .subscribe(params => {
        this.termoPesquisa = params['q'] || '';
      });
  }

  ngOnDestroy(): void {
    this.inscricaoRota?.unsubscribe();
    this.inscricaoParametros?.unsubscribe();
  }

  // =========================
  // SESSÃO DO USUÁRIO
  // =========================

  private atualizarSessao(): void {
    const usuario = this.authService.getSessaoUsuario();
    const organizador = this.authService.getSessao();

    // A sessão de frequentador tem prioridade se existir.
    if (usuario) {
      this.configurarUsuario(usuario);
      return;
    }

    if (organizador) {
      this.usuarioAutenticado = true;
      this.tipoConta = 'organizador';

      this.nomeUsuario =
        organizador.empresa?.nome ||
        organizador.perfil?.nome ||
        'Organizador';

      this.fotoUsuario = organizador.perfil?.foto || '';
      this.rotaPerfil = '/perfil-organizador';

      return;
    }

    this.usuarioAutenticado = false;
    this.tipoConta = null;
    this.nomeUsuario = '';
    this.fotoUsuario = '';
    this.rotaPerfil = '/login';
  }

  private configurarUsuario(usuario: PerfilResponse): void {
    this.usuarioAutenticado = true;
    this.tipoConta = 'usuario';
    this.nomeUsuario = usuario.nome || 'Usuário';
    this.fotoUsuario = usuario.foto || '';
    this.rotaPerfil = '/perfil-usuario';
  }

  // =========================
  // MENU MOBILE
  // =========================

  toggleMenu(): void {
    if (this.menuAberto) {
      this.fecharMenu(true);
      return;
    }

    this.menuAberto = true;
    this.pesquisaAtiva = false;

    setTimeout(() => {
      this.botaoFecharMenu?.nativeElement.focus();
    }, 50);
  }

  fecharMenu(restaurarFoco = false): void {
    if (!this.menuAberto) {
      return;
    }

    this.menuAberto = false;

    if (restaurarFoco) {
      setTimeout(() => {
        this.botaoMenu?.nativeElement.focus();
      }, 50);
    }
  }

  @HostListener('document:click', ['$event'])
  onClickFora(event: Event): void {
    if (!this.menuAberto) {
      return;
    }

    const target = event.target as HTMLElement;

    if (!this.elementRef.nativeElement.contains(target)) {
      this.fecharMenu();
    }
  }

  // =========================
  // TECLADO E ACESSIBILIDADE
  // =========================

  @HostListener('document:keydown', ['$event'])
  aoPressionarTecla(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      if (this.menuAberto) {
        event.preventDefault();
        this.fecharMenu(true);
        return;
      }

      if (this.pesquisaAtiva) {
        event.preventDefault();
        this.fecharPesquisa();
      }

      return;
    }

    if (event.key === 'Tab' && this.menuAberto) {
      this.controlarFocoMenu(event);
    }
  }

  private controlarFocoMenu(event: KeyboardEvent): void {
    const painel = this.painelMenu?.nativeElement;

    if (!painel) {
      return;
    }

    const elementos = painel.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    if (!elementos.length) {
      return;
    }

    const primeiro = elementos[0];
    const ultimo = elementos[elementos.length - 1];

    if (event.shiftKey && document.activeElement === primeiro) {
      event.preventDefault();
      ultimo.focus();
      return;
    }

    if (!event.shiftKey && document.activeElement === ultimo) {
      event.preventDefault();
      primeiro.focus();
    }
  }

  @HostListener('window:storage')
  aoAlterarArmazenamento(): void {
    this.atualizarSessao();
  }

  // =========================
  // PESQUISA
  // =========================

  togglePesquisa(): void {
    // No desktop, a pesquisa permanece visível.
    if (window.innerWidth > 1024) {
      this.campoBusca?.nativeElement.focus();
      return;
    }

    this.pesquisaAtiva = !this.pesquisaAtiva;

    if (this.pesquisaAtiva) {
      this.fecharMenu();

      setTimeout(() => {
        this.campoBusca?.nativeElement.focus();
      }, 50);
    }
  }

  fecharPesquisa(): void {
    this.pesquisaAtiva = false;
  }

  fazerPesquisa(): void {
    const termo = this.termoPesquisa.trim();

    this.router.navigate(['/eventos'], {
      queryParams: {
        q: termo || null
      },
      queryParamsHandling: 'merge'
    });

    if (window.innerWidth <= 1024) {
      this.pesquisaAtiva = false;
    }
  }

  limparPesquisa(): void {
    this.termoPesquisa = '';

    this.router.navigate(['/eventos'], {
      queryParams: {
        q: null
      },
      queryParamsHandling: 'merge'
    });

    if (window.innerWidth <= 1024) {
      this.pesquisaAtiva = false;
    }
  }

  // =========================
  // SAIR DA CONTA
  // =========================

  sair(): void {
    this.fecharMenu();

    if (this.tipoConta === 'usuario') {
      this.authService.logoutUsuario();
    } else if (this.tipoConta === 'organizador') {
      this.authService.logout();
    }

    this.atualizarSessao();
    this.router.navigate(['/']);
  }
}
