
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { Subscription, filter } from 'rxjs';

import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer implements OnInit, OnDestroy {

  rotaPerfil = '/login';

  private inscricaoRotas?: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.atualizarSessao();

    this.inscricaoRotas = this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe(() => {
        this.atualizarSessao();
      });
  }

  private atualizarSessao(): void {
    const usuario = this.authService.getSessaoUsuario();
    const organizador = this.authService.getSessao();

    if (usuario) {
      this.rotaPerfil = '/perfil-usuario';
    } else if (organizador) {
      this.rotaPerfil = '/perfil-organizador';
    } else {
      this.rotaPerfil = '/login';
    }
  }

  ngOnDestroy(): void {
    this.inscricaoRotas?.unsubscribe();
  }
}
