import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { OrganizerForm } from '../../shared/components/cadastroLogin/organizer-form/organizer-form';
import { BrandSideAuth } from '../../shared/components/cadastroLogin/brand-side-auth/brand-side-auth';
import { ProfileToggle } from '../../shared/components/cadastroLogin/profile-toggle/profile-toggle';
import { SocialLogin } from '../../shared/components/cadastroLogin/social-login/social-login';
import { Header } from '../../shared/components/header/header';
import { Footer } from '../../shared/components/footer/footer';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [
    FormsModule, RouterLink, BrandSideAuth, ProfileToggle, SocialLogin, OrganizerForm, Header, Footer ],
  templateUrl: './cadastro.html',
  styleUrl: './cadastro.css'
})
export class Cadastro {

  tipoPerfil: 'usuario' | 'organizador' = 'usuario';

  nome = '';
  emailUsuario = '';
  nomeUsuario = '';
  senhaUsuario = '';
  confirmarSenhaUsuario = '';

  cadastrandoOrganizador = false;
  mensagemErro = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    if (
      this.route.snapshot.queryParamMap.get('perfil') === 'organizador'
    ) {
      this.tipoPerfil = 'organizador';
    }
  }

  mudarPerfil(perfil: string): void {
    this.tipoPerfil =
      perfil as 'usuario' | 'organizador';

    this.mensagemErro = '';
  }

  executarCadastroUsuario(event: Event): void {
    event.preventDefault();

    if (
      this.senhaUsuario !==
      this.confirmarSenhaUsuario
    ) {
      this.mensagemErro =
        'As senhas não coincidem.';
      return;
    }

    this.mensagemErro = '';

    console.log(
      'Cadastro de usuário comum ainda não integrado.'
    );
  }

  executarCadastroOrganizador(
    dadosOrganizador: any
  ): void {

    if (this.cadastrandoOrganizador) {
      return;
    }

    this.mensagemErro = '';
    this.cadastrandoOrganizador = true;

    this.authService
      .cadastrarOrganizador(dadosOrganizador)
      .subscribe({

        next: () => {
          this.router.navigate([
            '/perfil-organizador'
          ]);
        },

        error: (erro) => {
          this.cadastrandoOrganizador = false;

          this.mensagemErro =
            erro.error?.erro ||
            erro.error?.mensagem ||
            'Não foi possível concluir o cadastro. Tente novamente.';

          console.error(
            'Erro ao cadastrar organizador:',
            erro
          );
        }

      });
  }

  cadastroComGoogle(): void {
    console.log(
      `Cadastro Google: ${this.tipoPerfil}`
    );
  }

  cadastroComApple(): void {
    console.log(
      `Cadastro Apple: ${this.tipoPerfil}`
    );
  }
}