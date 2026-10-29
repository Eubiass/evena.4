import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const organizadorAuthGuard: CanActivateFn = (_route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Frequentadores não podem acessar recursos exclusivos de organizadores.
  if (authService.getSessaoUsuario()) {
    return router.createUrlTree(['/'], {
      queryParams: { acesso: 'restrito' }
    });
  }

  // Somente uma sessão de organizador permite continuar.
  if (authService.getSessao()) {
    return true;
  }

  // Se não estiver autenticado, encaminha para o login.
  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url }
  });
};