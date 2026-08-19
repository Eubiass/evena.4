import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router'; 
import { BrandSideAuth } from '../../shared/components/cadastroLogin/brand-side-auth/brand-side-auth';
import { ProfileToggle } from '../../shared/components/cadastroLogin/profile-toggle/profile-toggle';
import { SocialLogin } from '../../shared/components/cadastroLogin/social-login/social-login';
import { OrganizerForm } from '../../shared/components/cadastroLogin/organizer-form/organizer-form';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [FormsModule, RouterLink, BrandSideAuth, ProfileToggle, SocialLogin, OrganizerForm], 
  templateUrl: './cadastro.html',
  styleUrl: './cadastro.css'
})
export class Cadastro {
  tipoPerfil: 'usuario' | 'organizador' = 'usuario';
  passoOrganizador = 1;

  // --- DADOS DO USUÁRIO ---
  nome = '';
  // dataNascimento = '';
  emailUsuario = '';
  nomeUsuario = '';
  senhaUsuario = '';
  confirmarSenhaUsuario = '';

  // --- DADOS DO ORGANIZADOR ---
  emailEmpresa = '';
  telefoneEmpresa = '';
  senhaOrganizador = '';
  confirmarSenhaOrganizador = '';
  
  razaoSocial = '';
  nomeFantasia = '';
  cnpj = '';
  ramoEmpresa = '';

  cep = '';
  estado = '';
  cidade = '';
  bairro = '';
  endereco = '';
  numero = '';
  complemento = '';

  mudarPerfil(perfil: string) {
    this.tipoPerfil = perfil as 'usuario' | 'organizador';
    this.passoOrganizador = 1;
  }

  avancarPasso() {
    if (this.passoOrganizador < 3) this.passoOrganizador++;
  }

  voltarPasso() {
    if (this.passoOrganizador > 1) this.passoOrganizador--;
  }

  executarCadastro(event: Event) {
    event.preventDefault();
    if (this.tipoPerfil === 'usuario') {
      if (this.senhaUsuario !== this.confirmarSenhaUsuario) {
        alert('As senhas não coincidem!');
        return;
      }
      console.log('Usuário cadastrado com sucesso.');
    } else {
      if (this.senhaOrganizador !== this.confirmarSenhaOrganizador) {
        alert('As senhas não coincidem!');
        return;
      }
      console.log('Organizador cadastrado com sucesso.');
    }
  }

  cadastroComGoogle() {
    console.log(`Iniciando cadastro via GOOGLE para o perfil: ${this.tipoPerfil.toUpperCase()}`);
  }

  cadastroComApple() {
    console.log(`Iniciando cadastro via APPLE para o perfil: ${this.tipoPerfil.toUpperCase()}`);
  }

  executarCadastroOrganizador(dadosOrganizador: any) {
    console.log('Dados do Organizador recebidos:', dadosOrganizador);
    // Lógica para enviar para a API / backend
  }
}