import { Component, OnInit, OnDestroy, HostListener, ChangeDetectorRef } from '@angular/core';
import { Evento } from '../../../../model/evento';
import { EventoService } from '../../../../services/evento-service';

@Component({
  selector: 'app-banner-eventos',
  standalone: true,
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
  constructor(
    private eventoService: EventoService,
    private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    // 1. Pega todos os eventos do service
    const todosEventos = this.eventoService.getEventos();

    // 2. Filtra para mostrar apenas os IDs que estão na lista de destaques
    this.listaBanner = todosEventos.filter(evento => 
      this.idsDestaque.includes(evento.id)
    );

    // 3. Opcional: Se quiser garantir uma ordem específica baseada no array idsDestaque
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
    this.index = (this.index + 1) % this.listaBanner.length;
    this.cdr.detectChanges();
    if (manual) {
      this.iniciarTimer();

    }
  }

  anterior() {
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

  abrirEvento(id: number) {
    if (this.isMoving) return;
    console.log('Navegando para o evento:', id);
  }
}