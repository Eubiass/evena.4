import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {
  menuAberto = false;
  pesquisaAtiva = false;
  termoPesquisa = '';
  usuarioAutenticado = false;

  // Injete o ElementRef para conseguir acessar os elementos HTML deste componente
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private elementRef: ElementRef
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.termoPesquisa = params['q'] || '';
    });
  }

  // Escuta todos os cliques feitos no documento
  @HostListener('document:click', ['$event'])
  onClickFora(event: Event) {
    // Se o menu não estiver aberto, não precisa fazer nada
    if (!this.menuAberto) return;

    // Obtém o elemento HTML do clique
    const target = event.target as HTMLElement;

    // Verifica se o elemento clicado está DENTRO do componente header
    const clicouDentroDoHeader = this.elementRef.nativeElement.contains(target);

    // Se o clique foi fora do header, fecha o menu
    if (!clicouDentroDoHeader) {
      this.menuAberto = false;
    }
  }

  toggleMenu() {
    this.menuAberto = !this.menuAberto;
  }

  togglePesquisa() {
    if (window.innerWidth > 1024) {
      document.getElementById('campo-busca')?.focus();
      return;
    }

    this.pesquisaAtiva = !this.pesquisaAtiva;

    if (this.pesquisaAtiva) {
      setTimeout(() => document.getElementById('campo-busca')?.focus(), 100);
    }
  }

  fazerPesquisa() {
    this.router.navigate(['/eventos'], { 
      queryParams: { q: this.termoPesquisa.trim() || null },
      queryParamsHandling: 'merge'
    });
    
    if (window.innerWidth <= 768 && this.termoPesquisa.trim()) {
      this.pesquisaAtiva = false;
    }
  }
}