import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BrandSideAuth } from '../../shared/components/cadastroLogin/brand-side-auth/brand-side-auth';
import { ProfileToggle } from '../../shared/components/cadastroLogin/profile-toggle/profile-toggle';
import { SocialLogin } from '../../shared/components/cadastroLogin/social-login/social-login';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink, BrandSideAuth, ProfileToggle, SocialLogin],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  constructor(
    private route: ActivatedRoute
  ){}

  tipoPerfil: 'usuario' | 'organizador' = 'usuario';

  usuario = '';
  senha = '';

  mudarPerfil(perfil: string) {
    this.tipoPerfil = perfil as 'usuario' | 'organizador';
  }

  executarLogin(event: Event) {
    event.preventDefault();
    if (this.tipoPerfil === 'usuario') {
      console.log('Autenticando Usuário Comum:', this.usuario);
    } else {
      console.log('Autenticando Organizador do Evento:', this.usuario);
    }
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