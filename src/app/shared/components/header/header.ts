import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true, // Garante que é standalone
  imports: [RouterLink, RouterLinkActive, FormsModule], // Adicione CommonModule aqui
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  menuAberto = false;
  pesquisaAtiva = false;
  termoPesquisa = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(){
    // Escuta a URL. Se o parâmetro 'q' sumir, limpa a caixa de texto
    this.route.queryParams.subscribe(params => {
      if (!params['q']) {
        this.termoPesquisa = ''; 
      } else {
        this.termoPesquisa = params['q']; // Mantém o texto sincronizado com a URL
      }
    });
  }

  toggleMenu() {
    this.menuAberto = !this.menuAberto;
  }

  togglePesquisa() {
    // Se for desktop, apenas foca. Se for mobile, expande.
    if (window.innerWidth > 1024) {
      document.getElementById('campo-busca')?.focus();
      return;
    }

    this.pesquisaAtiva = !this.pesquisaAtiva;

    if (this.pesquisaAtiva) {
      setTimeout(() => document.getElementById('campo-busca')?.focus(), 100);
    }
  }

  // Função disparada ao digitar ou dar Enter
    fazerPesquisa() {
    // Navega mesmo se estiver vazio para permitir "limpar" a busca
    this.router.navigate(['/eventos'], { 
      queryParams: { q: this.termoPesquisa.trim() || null }, // Se vazio, remove o 'q' da URL
      queryParamsHandling: 'merge' // Mantém outros filtros se houver
    });
    
    if (window.innerWidth <= 768 && this.termoPesquisa.trim()) {
      this.pesquisaAtiva = false;
    }
  }
}
