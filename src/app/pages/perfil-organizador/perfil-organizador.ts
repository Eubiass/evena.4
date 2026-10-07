import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Header } from '../../shared/components/header/header';
import { Footer } from '../../shared/components/footer/footer';
import { AuthService, SessaoOrganizador } from '../../services/auth.service';

@Component({
  selector: 'app-perfil-organizador',
  standalone: true,
  imports: [ RouterLink, Header, Footer ],
  templateUrl: './perfil-organizador.html',
  styleUrl: './perfil-organizador.css'
})
export class PerfilOrganizador {

  sessao: SessaoOrganizador | null;

  constructor(
    private authService: AuthService
    ) {
      this.sessao = this.authService.getSessao();
    }

  get perfil() {
    return this.sessao?.perfil;
  }

  get empresa() {
    return this.sessao?.empresa;
  }

  sair(): void {
    this.authService.logout();
    window.location.href = '/';
  }
}