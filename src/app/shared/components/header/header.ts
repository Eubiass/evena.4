import {
  Component,
  ElementRef,
  HostListener,
  OnInit
} from '@angular/core';

import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive
} from '@angular/router';

import { FormsModule } from '@angular/forms';

import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    FormsModule
  ],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {

  menuAberto = false;
  pesquisaAtiva = false;

  termoPesquisa = '';

  usuarioAutenticado = false;
  nomeUsuario = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private elementRef: ElementRef,
    private authService: AuthService
  ) {}

  ngOnInit(): void {

    const sessao = this.authService.getSessao();

    this.usuarioAutenticado = sessao !== null;

    this.nomeUsuario =
      sessao?.empresa?.nome ||
      sessao?.perfil?.nome ||
      '';

    this.route.queryParams.subscribe(params => {
      this.termoPesquisa = params['q'] || '';
    });

  }

  @HostListener('document:click', ['$event'])
  onClickFora(event: Event): void {

    if (!this.menuAberto) {
      return;
    }

    const target = event.target as HTMLElement;

    const clicouDentroDoHeader =
      this.elementRef.nativeElement.contains(target);

    if (!clicouDentroDoHeader) {
      this.menuAberto = false;
    }

  }

  toggleMenu(): void {
    this.menuAberto = !this.menuAberto;
  }

  fecharMenu(): void {
    this.menuAberto = false;
  }

  togglePesquisa(): void {

    /*
     * Desktop:
     * pesquisa sempre permanece visível.
     */
    if (window.innerWidth > 1024) {

      document
        .getElementById('campo-busca')
        ?.focus();

      return;
    }

    /*
     * Mobile:
     * abre e fecha a pesquisa.
     */
    this.pesquisaAtiva = !this.pesquisaAtiva;

    if (this.pesquisaAtiva) {

      this.menuAberto = false;

      setTimeout(() => {

        document
          .getElementById('campo-busca')
          ?.focus();

      }, 100);

    }

  }

  fazerPesquisa(): void {

    this.router.navigate(
      ['/eventos'],
      {
        queryParams: {
          q: this.termoPesquisa.trim() || null
        },

        queryParamsHandling: 'merge'
      }
    );

    if (
      window.innerWidth <= 1024 &&
      this.termoPesquisa.trim()
    ) {
      this.pesquisaAtiva = false;
    }

  }

  limparPesquisa(): void {

    this.termoPesquisa = '';

    this.router.navigate(
      ['/eventos'],
      {
        queryParams: {
          q: null
        },

        queryParamsHandling: 'merge'
      }
    );

  }

  sair(): void {

    this.menuAberto = false;

    this.authService.logout();

    this.usuarioAutenticado = false;
    this.nomeUsuario = '';

    this.router.navigate(['/']);

  }

}