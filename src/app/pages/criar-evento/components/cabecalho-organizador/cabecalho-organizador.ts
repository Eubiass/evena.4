import { Component } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-cabecalho-organizador',
  standalone: true,
  imports: [],
  templateUrl: './cabecalho-organizador.html',
  styleUrl: './cabecalho-organizador.css'
})
export class CabecalhoOrganizador {

  constructor(private authService: AuthService) {}

  get nomePerfil(): string {
    return this.authService.getSessao()?.empresa?.nome ?? '';
  }

  get inicialPerfil(): string {
    const nome = this.nomePerfil.trim();

    if (!nome) {
      return '?';
    }

    return nome.charAt(0).toUpperCase();
  }
}