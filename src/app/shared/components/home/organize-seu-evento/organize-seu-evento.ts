
import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';


@Component({
  selector: 'app-organize-seu-evento',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './organize-seu-evento.html',
  styleUrl: './organize-seu-evento.css'
})
export class OrganizeSeuEvento implements OnInit, OnDestroy {
  exibirSecao = true;

  private readonly verificarSessao = () => {
    this.atualizarVisibilidade();
  };

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.atualizarVisibilidade();

    window.addEventListener('storage', this.verificarSessao);
  }

  ngOnDestroy(): void {
    window.removeEventListener('storage', this.verificarSessao);
  }

  private atualizarVisibilidade(): void {
    const frequentador = this.authService.getSessaoUsuario();
    const organizador = this.authService.getSessao();

    this.exibirSecao = !frequentador && !organizador;
  }
}