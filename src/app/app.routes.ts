import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { AllEvents } from './pages/all-events/all-events';
import { DetalhesEvento } from './pages/detalhes-evento/detalhes-evento';
import { Login } from './pages/login/login';
import { Cadastro } from './pages/cadastro/cadastro';
import { CriarEvento } from './pages/criar-evento/criar-evento';

export const routes: Routes = [
  { path: '', 
    component: Home 
  }, // Página inicial
  { path: 'eventos', 
    component: AllEvents 
  }, // Página de listagem
  { path: 'detalhes-evento/:slug', 
    component: DetalhesEvento},
  { path: 'login',
    component: Login},
  { path: 'cadastro',
    component: Cadastro},

  {path: 'criar-evento',
    component: CriarEvento
  }
];
