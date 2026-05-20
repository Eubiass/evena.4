import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { CardEvento } from "../../card-evento/card-evento";
import { Evento } from '../../../../model/evento';
import { EventoService } from '../../../../services/evento-service';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-eventos-perto',
  standalone: true,
  imports: [CardEvento, RouterLink],
  templateUrl: './eventos-perto.html',
  styleUrl: './eventos-perto.css',
})
export class EventosPerto implements OnInit {
  @ViewChild('carousel') carousel!: ElementRef;
  
  // LISTA DE EVENTOS
  eventosCidadeIP: Evento[] = [];      // Para a seção "Eventos em [Cidade]"
  eventosProximosGps: Evento[] = [];   // Para a seção "Eventos perto de você"
  localizacaoAtiva = false;
  cidadeDetectada = '';

  constructor(private eventoService: EventoService) {}

  async ngOnInit() {
    // 1. Já carrega todos os eventos para não ficar branco
    this.eventosCidadeIP = this.eventoService.getEventos();

    await this.localizacaoPorIP(); // Pega a cidade
    this.filtrarPorCidade();       // Filtra a primeira lista
  }
  filtrarPorCidade() {
    const todos = this.eventoService.getEventos();
    const cidade = this.cidadeDetectada.toLowerCase();

    // Filtro inteligente: procura "São Paulo" ou "SP"
    this.eventosCidadeIP = todos.filter(e => {
      const local = e.cidade.toLowerCase();
      return local.includes(cidade) || 
             (cidade === 'são paulo' && cidade.includes('sp'));
    });

    if (this.eventosCidadeIP.length === 0) this.eventosCidadeIP = todos;
  }

  async localizacaoPorIP() {
    try {
      const response = await fetch('http://ip-api.com/json');
      const data = await response.json();
      if (data.city) {
        this.cidadeDetectada = data.city;
        localStorage.setItem('evena_cidade', data.city);
        this.filtrarPorCidade(); // Atualiza a lista assim que descobre a cidade
      }
    } catch (error) {
      this.cidadeDetectada = 'sua região';
      this.filtrarPorCidade();
    }
  }
  

  // FILTRO 2: Apenas por distância (GPS)
  solicitarLocalizacao() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const latUser = position.coords.latitude;
        const lngUser = position.coords.longitude;
        this.localizacaoAtiva = true;

        this.eventosProximosGps = this.eventoService.getEventos()
          .filter(e => e.lat && e.lng)
          .map(e => ({
            ...e,
            distancia: this.calcularDistancia(latUser, lngUser, e.lat!, e.lng!)
          }))
          .filter(e => e.distancia! <= 15) // Apenas os de 15km
          .sort((a, b) => a.distancia! - b.distancia!);
      });
    }
  }

  // 2. Adicione a função de cálculo (Haversine)
  calcularDistancia(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; 
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * (Math.PI/180)) * Math.cos(lat2 * (Math.PI/180)) * Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return parseFloat((R * c).toFixed(1)); 
  }

  private tratarErroLocalizacao(error: any) {
    switch(error.code) {
      case error.PERMISSION_DENIED:
        console.warn("Usuário negou GPS.");
        break;
      case error.POSITION_UNAVAILABLE:
        console.error("Localização indisponível.");
        break;
      case error.TIMEOUT:
        console.error("A requisição de GPS expirou.");
        break;
    }
  }

  // CONTROLES DO CARROSSEL
  scrollDireita() {
    const cardWidth = this.carousel.nativeElement.firstElementChild?.offsetWidth || 333;
    this.carousel.nativeElement.scrollLeft += (cardWidth + 29);
  }

  scrollEsquerda() {
    const cardWidth = this.carousel.nativeElement.firstElementChild?.offsetWidth || 333;
    this.carousel.nativeElement.scrollLeft -= (cardWidth + 29);
  }

  abrirDetalhes(id: number) {
    console.log("Navegando para o evento ID:", id);
  }
}