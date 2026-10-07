import { Component, ElementRef, ViewChild, OnInit, ChangeDetectorRef } from '@angular/core';
import { CardEvento } from "../../card-evento/card-evento";
import { EventoService } from '../../../../services/evento-service';
import { RouterLink } from "@angular/router";
import { CommonModule } from "@angular/common";
import { Evento } from '../../../../models/evento';

@Component({
  selector: 'app-eventos-perto',
  standalone: true,
  imports: [CardEvento, RouterLink, CommonModule],
  templateUrl: './eventos-perto.html',
  styleUrl: './eventos-perto.css',
})
export class EventosPerto implements OnInit {
  @ViewChild('carouselIp') carouselIp!: ElementRef;
  @ViewChild('carouselGps') carouselGps!: ElementRef;

  eventosCidadeIP: Evento[] = [];
  eventosProximosGps: Evento[] = [];
  localizacaoAtiva = false;
  carregandoGps = false;
  cidadeDetectada = '';

  podeVoltarIp = false;
  podeAvancarIp = false;
  podeVoltarGps = false;
  podeAvancarGps = false;

  constructor(
    private eventoService: EventoService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    this.eventoService.getEventos().subscribe(eventos => {
      this.eventosCidadeIP = eventos;
      this.cdr.detectChanges();
    });

    await this.localizacaoPorIP();

    const gpsJaAtivadoAnteriormente =
      localStorage.getItem('evena_gps_ativo') === 'true';

    if (gpsJaAtivadoAnteriormente && navigator.permissions) {
      try {
        const statusPermissao = await navigator.permissions.query({
          name: 'geolocation' as PermissionName
        });

        if (statusPermissao.state === 'granted') {
          this.solicitarLocalizacao(true);
        } else {
          localStorage.removeItem('evena_gps_ativo');
        }
      } catch (e) {
        console.warn(
          'Não foi possível verificar as permissões nativas.',
          e
        );
      }
    }
  }

  filtrarPorCidade() {
   this.eventoService.getEventos().subscribe(todos => {

     if (!this.cidadeDetectada || this.cidadeDetectada === 'sua região') {
       this.eventosCidadeIP = todos;
       this.cdr.detectChanges();

       setTimeout(() => this.atualizarSetas('ip'));
       return;
     }

     const cidade = this.cidadeDetectada.toLowerCase().trim();

     this.eventosCidadeIP = todos.filter(e => {
       const local = e.cidade.toLowerCase();
       return local.includes(cidade) ||
         (cidade.includes('são paulo') && local.includes('sp')) ||
         (cidade.includes('sp') && local.includes('são paulo'));
     });

     if (this.eventosCidadeIP.length === 0) {
       this.eventosCidadeIP = todos;
     }
     this.cdr.detectChanges();

     setTimeout(() => this.atualizarSetas('ip'));
   });
  }

  async localizacaoPorIP() {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();

      if (data && data.city) {
        this.cidadeDetectada = data.city;
        localStorage.setItem('evena_cidade', data.city);
      } else {
        this.cidadeDetectada = 'sua região';
      }
    } catch (error) {
      this.cidadeDetectada = 'sua região';
    } finally {
      this.filtrarPorCidade();
    }
  }

  solicitarLocalizacao(automatico: boolean = false) {
    if (!navigator.geolocation) return;
    if (this.carregandoGps) return;

    this.carregandoGps = true;
    this.cdr.detectChanges();

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latUser = position.coords.latitude;
        const lngUser = position.coords.longitude;
        this.eventoService.getEventos().subscribe(todos => {

         this.eventosProximosGps = todos
           .filter(e => e.lat && e.lng)
           .map(e => ({
             ...e,
             distancia: this.calcularDistancia(
               latUser,
               lngUser,
               e.lat!,
               e.lng!
             )
           }))
           .filter(e => e.distancia! <= 15)
           .sort((a, b) => a.distancia! - b.distancia!);
         
         this.localizacaoAtiva = true;
         this.carregandoGps = false;
         
         localStorage.setItem('evena_gps_ativo', 'true');
         
         this.cdr.detectChanges();
         
         setTimeout(() => this.atualizarSetas('gps'));
        });

        this.localizacaoAtiva = true;
        this.carregandoGps = false;

        localStorage.setItem('evena_gps_ativo', 'true');

        this.cdr.detectChanges();

        setTimeout(() => this.atualizarSetas('gps'));
      },
      (error) => {
        this.carregandoGps = false;

        if (!automatico) {
          this.tratarErroLocalizacao(error);
        } else {
          localStorage.removeItem('evena_gps_ativo');
          this.localizacaoAtiva = false;
          this.cdr.detectChanges();
        }
      }
    );
  }

  calcularDistancia(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return parseFloat((R * c).toFixed(1));
  }

  private tratarErroLocalizacao(error: any) {
    this.localizacaoAtiva = false;
    localStorage.removeItem('evena_gps_ativo');

    if (error.code === error.PERMISSION_DENIED) {
      alert("Bloqueaste o acesso à localização. Se queres ver os eventos perto de ti, tens de ir às definições do teu navegador ao lado da barra de endereço e permitir a localização.");
    } else {
      alert("Não conseguimos obter o teu GPS neste momento. Tenta novamente.");
    }

    this.cdr.detectChanges();
  }

  atualizarSetas(tipo: 'ip' | 'gps') {
    const element = tipo === 'ip'
      ? this.carouselIp?.nativeElement
      : this.carouselGps?.nativeElement;

    if (!element) return;

    const tolerancia = 5;
    const noInicio = element.scrollLeft <= tolerancia;

    const noFinal =
      element.scrollLeft + element.clientWidth >=
      element.scrollWidth - tolerancia;

    if (tipo === 'ip') {
      this.podeVoltarIp = !noInicio;
      this.podeAvancarIp = !noFinal;
    } else {
      this.podeVoltarGps = !noInicio;
      this.podeAvancarGps = !noFinal;
    }

    this.cdr.detectChanges();
  }

  scrollDireita(tipo: 'ip' | 'gps') {
    const element = tipo === 'ip'
      ? this.carouselIp?.nativeElement
      : this.carouselGps?.nativeElement;

    if (!element || !element.firstElementChild) return;

    const cardWidth =
      element.firstElementChild.getBoundingClientRect().width;

    const gapWidth =
      parseFloat(window.getComputedStyle(element).gap) || 28;

    element.scrollBy({
      left: cardWidth + gapWidth,
      behavior: 'smooth'
    });

    setTimeout(() => this.atualizarSetas(tipo), 350);
  }

  scrollEsquerda(tipo: 'ip' | 'gps') {
    const element = tipo === 'ip'
      ? this.carouselIp?.nativeElement
      : this.carouselGps?.nativeElement;

    if (!element || !element.firstElementChild) return;

    const cardWidth =
      element.firstElementChild.getBoundingClientRect().width;

    const gapWidth =
      parseFloat(window.getComputedStyle(element).gap) || 28;

    element.scrollBy({
      left: -(cardWidth + gapWidth),
      behavior: 'smooth'
    });

    setTimeout(() => this.atualizarSetas(tipo), 350);
  }
}