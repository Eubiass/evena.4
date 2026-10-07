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
  imports: [FormsModule, CommonModule, RouterLink, BrandSideAuth, ProfileToggle, SocialLogin, Header, Footer],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  tipoPerfil: 'usuario' | 'organizador' = 'usuario';

  usuario = '';
  senha = '';

  mudarPerfil(perfil: string) {
    this.tipoPerfil = perfil as 'usuario' | 'organizador';
  }

  executarLogin(event: Event) {
    event.preventDefault();
    if (this.tipoPerfil === 'usuario') {
      console.log('Login de usuário comum ainda não conectado à API.');
      return;
    }
    this.authService.login(this.usuario, this.senha).subscribe({
      next: (sessao) => {
        console.log('Organizador autenticado com sucesso:', sessao);
        this.router.navigate(['/perfil-organizador']); },
      error: (erro) => {
        console.error('Erro ao realizar login:', erro);
        const mensagem =
          erro?.error?.message ||
          'E-mail ou senha inválidos.';
        alert(mensagem);
      }
    });
  }

  // Métodos prontos para acoplamento das bibliotecas de Autenticação Social
  loginComGoogle() {
    console.log(`Iniciando fluxo de login via GOOGLE para o perfil: ${this.tipoPerfil.toUpperCase()}`);
    // Futuramente adicione a chamada do SDK do Google Auth aqui
  }

  loginComApple() {
    console.log(`Iniciando fluxo de login via APPLE para o perfil: ${this.tipoPerfil.toUpperCase()}`);
    // Futuramente adicione a chamada do SDK do Apple SignIn aqui
  }
}