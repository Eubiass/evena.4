
import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  OnDestroy
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
import { AuthService, PerfilResponse } from '../../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header implements OnInit, OnDestroy {
  menuAberto = false;
  pesquisaAtiva = false;
  termoPesquisa = '';

  usuarioAutenticado = false;
  nomeUsuario = '';
  fotoUsuario = '';
  rotaPerfil = '/login';
  tipoConta: 'usuario' | 'organizador' | null = null;

  private inscricaoRota?: Subscription;

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
      .subscribe(() => this.atualizarSessao());

    this.route.queryParams.subscribe(params => {
      this.termoPesquisa = params['q'] || '';
    });
  }

  ngOnDestroy(): void {
    this.inscricaoRota?.unsubscribe();
  }

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

  @HostListener('document:click', ['$event'])
  onClickFora(event: Event): void {
    if (!this.menuAberto) return;

    const target = event.target as HTMLElement;

    if (!this.elementRef.nativeElement.contains(target)) {
      this.menuAberto = false;
    }
  }

  @HostListener('window:storage')
  aoAlterarArmazenamento(): void {
    this.atualizarSessao();
  }

  toggleMenu(): void {
    this.menuAberto = !this.menuAberto;
  }

  fecharMenu(): void {
    this.menuAberto = false;
  }

  togglePesquisa(): void {
    if (window.innerWidth > 1024) {
      document.getElementById('campo-busca')?.focus();
      return;
    }

    this.pesquisaAtiva = !this.pesquisaAtiva;

    if (this.pesquisaAtiva) {
      this.menuAberto = false;
      setTimeout(() => {
        document.getElementById('campo-busca')?.focus();
      }, 100);
    }
  }

  fazerPesquisa(): void {
    this.router.navigate(['/eventos'], {
      queryParams: { q: this.termoPesquisa.trim() || null },
      queryParamsHandling: 'merge'
    });

    if (window.innerWidth <= 1024 && this.termoPesquisa.trim()) {
      this.pesquisaAtiva = false;
    }
  }

  limparPesquisa(): void {
    this.termoPesquisa = '';

    this.router.navigate(['/eventos'], {
      queryParams: { q: null },
      queryParamsHandling: 'merge'
    });
  }

  sair(): void {
    this.menuAberto = false;

    if (this.tipoConta === 'usuario') {
      this.authService.logoutUsuario();
    } else {
      this.authService.logout();
    }

    this.atualizarSessao();
    this.router.navigate(['/']);
  }
}
