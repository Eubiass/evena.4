import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { AllEvents } from './pages/all-events/all-events';
import { DetalhesEvento } from './pages/detalhes-evento/detalhes-evento';

export const routes: Routes = [
  { path: '', 
    component: Home 
  }, // Página inicial
  { path: 'eventos', 
    component: AllEvents 
  }, // Página de listagem
  { path: 'detalhes-evento/:id', component: DetalhesEvento },
];
