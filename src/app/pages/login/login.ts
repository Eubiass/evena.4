
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BrandSideAuth } from '../../shared/components/cadastroLogin/brand-side-auth/brand-side-auth';
import { ProfileToggle } from '../../shared/components/cadastroLogin/profile-toggle/profile-toggle';
import { SocialLogin } from '../../shared/components/cadastroLogin/social-login/social-login';
import { Header } from '../../shared/components/header/header';
import { Footer } from '../../shared/components/footer/footer';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    RouterLink,
    BrandSideAuth,
    ProfileToggle,
    SocialLogin,
    Header,
    Footer
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  tipoPerfil: 'usuario' | 'organizador' = 'usuario';
  usuario = '';
  senha = '';
  mostrarSenha = false;
  carregando = false;
  mensagemErro = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  mudarPerfil(perfil: string): void {
    this.tipoPerfil = perfil as 'usuario' | 'organizador';
    this.mensagemErro = '';
  }

  executarLogin(event: Event): void {
    event.preventDefault();

    if (this.carregando) {
      return;
    }

    this.mensagemErro = '';
    this.carregando = true;

    if (this.tipoPerfil === 'usuario') {
      this.authService.loginUsuario(this.usuario, this.senha).subscribe({
        next: () => {
          this.carregando = false;
          const destino =
            this.route.snapshot.queryParamMap.get('returnUrl');

          this.router.navigateByUrl(
            destino?.startsWith('/') ? destino : '/perfil-usuario'
          );
        },
        error: erro => {
          this.carregando = false;
          this.mensagemErro = this.obterMensagemErro(
            erro,
            'Não foi possível entrar. Confira seu e-mail e sua senha.'
          );
        }
      });

      return;
    }

    this.authService.login(this.usuario, this.senha).subscribe({
      next: () => {
        this.carregando = false;
        this.router.navigate(['/perfil-organizador']);
      },
      error: erro => {
        this.carregando = false;
        this.mensagemErro = this.obterMensagemErro(
          erro,
          'Não foi possível entrar. Confira o e-mail e a senha do organizador.'
        );
      }
    });
  }

  alternarSenha(): void {
    this.mostrarSenha = !this.mostrarSenha;
  }

  loginComGoogle(): void {
    this.mensagemErro =
      'O login com Google ainda não está integrado.';
  }

  loginComApple(): void {
    this.mensagemErro =
      'O login com Apple ainda não está integrado.';
  }

  private obterMensagemErro(erro: any, padrao: string): string {
    return erro?.error?.mensagem
      || erro?.error?.message
      || erro?.error?.erro
      || erro?.message
      || padrao;
  }
}
