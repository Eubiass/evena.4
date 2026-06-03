import { Component, OnInit, OnDestroy, HostListener, ChangeDetectorRef } from '@angular/core';
import { Evento } from '../../../../model/evento';
import { EventoService } from '../../../../services/evento-service';
import { Router, RouterLink } from '@angular/router'; // CORREÇÃO: Importado o Router do Angular

@Component({
  selector: 'app-banner-eventos',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './banner-eventos.html',
  styleUrl: './banner-eventos.css',
})
export class BannerEventos implements OnInit, OnDestroy {
  listaBanner: Evento[] = []; // Começa vazia
  index = 0;
  timer: any;

  idsDestaque = [1, 3, 4, 6, 8];

  private touchStartX = 0;
  private touchEndX = 0;
  private isMoving = false; // Proteção para não clicar enquanto desliza

  // CORREÇÃO: Injetado o 'Router' dentro do construtor
  constructor(
    private eventoService: EventoService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    // 1. Pega todos os eventos do service
    const todosEventos = this.eventoService.getEventos();

    // 2. Filtra para mostrar apenas os IDs que estão na lista de destaques
    this.listaBanner = todosEventos.filter(evento => 
      this.idsDestaque.includes(evento.id)
    );

    // 3. Garante a ordem específica baseada no array idsDestaque
    this.listaBanner.sort((a, b) => 
      this.idsDestaque.indexOf(a.id) - this.idsDestaque.indexOf(b.id)
    );

    this.iniciarTimer();
  }

  ngOnDestroy() {
    this.pararTimer();
  }

  iniciarTimer() {
    this.pararTimer();
    this.timer = setInterval(() => {
      this.proximo(false);
    }, 4000);
  }

  pararTimer() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  proximo(manual: boolean = true) {
    if (this.listaBanner.length === 0) return;
    this.index = (this.index + 1) % this.listaBanner.length;
    this.cdr.detectChanges();
    if (manual) {
      this.iniciarTimer();
    }
  }

  anterior() {
    if (this.listaBanner.length === 0) return;
    this.index = (this.index - 1 + this.listaBanner.length) % this.listaBanner.length;
    this.cdr.detectChanges();
    this.iniciarTimer();
  }

  irPara(i: number) {
    this.index = i;
    this.iniciarTimer(); // Reinicia o contador de 4 segundos
    this.cdr.detectChanges(); // Garante que a bolinha mude de cor na hora
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

    if (event.key === 'ArrowRight') this.proximo();
    else if (event.key === 'ArrowLeft') this.anterior();
  }

  touchStart(e: TouchEvent) {
    this.touchStartX = e.changedTouches[0].screenX;
    this.isMoving = false;
    this.pararTimer();
  }

  touchEnd(e: TouchEvent) {
    this.touchEndX = e.changedTouches[0].screenX;
    const diff = Math.abs(this.touchStartX - this.touchEndX);
    
    if (diff > 10) this.isMoving = true; // Se moveu mais de 10px, é swipe
    
    this.handleSwipe();
  }

  handleSwipe() {
    const threshold = 50;
    const diff = this.touchStartX - this.touchEndX;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) this.proximo();
      else this.anterior();
    }
    this.iniciarTimer();
  }

  abrirEvento(titulo: string) {
    if (this.isMoving) return;
    
    // Gera o slug com base no título antes de navegar
    const slug = this.gerarSlug(titulo);
    this.router.navigate(['/detalhes-evento', slug]);
  }

  // Função para converter o título em slug (se você já tiver uma global, pode importar)
  gerarSlug(texto: string): string {
    return texto
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-') // <-- Adicione isso aqui para garantir um único hífen
      .trim();
  }
}