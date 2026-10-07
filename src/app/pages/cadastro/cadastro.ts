import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router'; 
import { BrandSideAuth } from '../../shared/components/cadastroLogin/brand-side-auth/brand-side-auth';
import { ProfileToggle } from '../../shared/components/cadastroLogin/profile-toggle/profile-toggle';
import { SocialLogin } from '../../shared/components/cadastroLogin/social-login/social-login';
import { OrganizerForm } from '../../shared/components/cadastroLogin/organizer-form/organizer-form';
import { Header } from '../../shared/components/header/header';
import { Footer } from '../../shared/components/footer/footer';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [FormsModule, RouterLink, BrandSideAuth, ProfileToggle, SocialLogin, OrganizerForm, Header, Footer], 
  templateUrl: './cadastro.html',
  styleUrl: './cadastro.css'
})
export class Cadastro {
  tipoPerfil: 'usuario' | 'organizador' = 'usuario';
  passoOrganizador = 1;

  constructor(
  private route: ActivatedRoute,
  private authService: AuthService
  ) {
    if (this.route.snapshot.queryParamMap.get('perfil') === 'organizador') {
      this.tipoPerfil = 'organizador';
    }
  }

  // --- DADOS DO USUÁRIO ---
  nome = '';
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
    this.authService.cadastrarOrganizador(dadosOrganizador).subscribe({
      next: (sessao) => {
        console.log('Organizador cadastrado com sucesso:', sessao);
        alert('Organizador cadastrado com sucesso!');
      },
      error: (erro) => {
        console.error('ERRO COMPLETO:', erro);
        console.error('STATUS:', erro.status);
        console.error('URL:', erro.url);
        console.error('ERROR DA API:', erro.error);
        console.error('MENSAGEM:', erro.message);
      
        alert(`Erro ${erro.status}: ${erro.message}`);
      }
    });
  }
}