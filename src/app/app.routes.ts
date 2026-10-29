import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { AllEvents } from './pages/all-events/all-events';
import { DetalhesEvento } from './pages/detalhes-evento/detalhes-evento';
import { Login } from './pages/login/login';
import { Cadastro } from './pages/cadastro/cadastro';
import { CriarEvento } from './pages/criar-evento/criar-evento';
import { PerfilOrganizador } from './pages/perfil-organizador/perfil-organizador';
import { EditarPerfilOrganizador } from './pages/editar-perfil-organizador/editar-perfil-organizador';
import { PerfilUsuario } from './pages/perfil-usuario/perfil-usuario';
import { usuarioAuthGuard } from './guards/usuario-auth.guard';
import { organizadorAuthGuard } from './guards/organizador-auth.guards';

export const routes: Routes = [
  { path: '', 
    component: Home },
    
  { path: 'eventos', 
    component: AllEvents },

  { path: 'detalhes-evento/:slug', 
    component: DetalhesEvento },

  { path: 'login', 
    component: Login },

  { path: 'cadastro', 
    component: Cadastro },

  {
    path: 'criar-evento',
    component: CriarEvento,
    canActivate: [organizadorAuthGuard]
  },
  {
    path: 'perfil-organizador',
    component: PerfilOrganizador,
    canActivate: [organizadorAuthGuard]
  },
  {
    path: 'editar-perfil-organizador',
    component: EditarPerfilOrganizador,
    canActivate: [organizadorAuthGuard]
  },
  {
    path: 'perfil-usuario',
    component: PerfilUsuario,
    canActivate: [usuarioAuthGuard]
  },

  { path: '**', redirectTo: '' }
];