import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Header } from '../../shared/components/header/header';
import { Footer } from '../../shared/components/footer/footer';
import { AuthService, SessaoOrganizador } from '../../services/auth.service';

@Component({
  selector: 'app-editar-perfil-organizador',
  standalone: true,
  imports: [ FormsModule, RouterLink, Header, Footer
  ],
  templateUrl: './editar-perfil-organizador.html',
  styleUrl: './editar-perfil-organizador.css'
})
export class EditarPerfilOrganizador {

  sessao: SessaoOrganizador | null;

  mostrarNovaSenha = false;
  mostrarConfirmarSenha = false;

  form = {
    nomeEmpresa: '',
    nomeUsuario: '',
    descricao: '',
    email: '',
    telefone: '',
    site: '',
    localizacao: '',
    instagram: '',
    facebook: '',
    x: '',
    tiktok: '',
    youtube: '',
    linkedin: '',
    novaSenha: '',
    confirmarSenha: ''
  };

  constructor(
    private authService: AuthService
  ) {
    this.sessao = this.authService.getSessao();

    this.form.nomeEmpresa =
      this.sessao?.empresa?.nome || '';

    this.form.email =
      this.sessao?.perfil?.email || '';

    this.form.descricao =
      this.sessao?.perfil?.descricao || '';

    this.form.nomeUsuario =
      this.gerarNomeUsuario(this.form.email);
  }

  get empresa() {
    return this.sessao?.empresa;
  }

  get perfil() {
    return this.sessao?.perfil;
  }

  alternarNovaSenha(): void {
    this.mostrarNovaSenha = !this.mostrarNovaSenha;
  }

  alternarConfirmarSenha(): void {
    this.mostrarConfirmarSenha =
      !this.mostrarConfirmarSenha;
  }

  private gerarNomeUsuario(email: string): string {
    return email.split('@')[0].trim().toLowerCase();
  }

  salvar(): void {
    console.log('Dados do formulário:', this.form);
  }
}