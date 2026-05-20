import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { CommonModule } from "@angular/common";
import { Evento } from "../../model/evento";
import { EventoService } from "../../services/evento-service";
import { HeaderDetalhe } from "../../shared/components/detalhes-evento/header-detalhe/header-detalhe";
import { InfoEsquerda } from "../../shared/components/detalhes-evento/info-esquerda/info-esquerda";
import { CheckoutSidebar } from "../../shared/components/detalhes-evento/checkout-sidebar/checkout-sidebar";

@Component({
  selector: "app-detalhes-evento",
  standalone: true,
  imports: [CommonModule, HeaderDetalhe, InfoEsquerda, CheckoutSidebar],
  templateUrl: "./detalhes-evento.html",
  styleUrl: "./detalhes-evento.css",
})
export class DetalhesEvento implements OnInit {
  evento: Evento | undefined;
  diaSelecionadoIndex: number = 0;
  
  mudarDia(index: number): void {
    this.diaSelecionadoIndex = index;
  }

  constructor(
    private route: ActivatedRoute,
    private eventoService: EventoService
  ){}

  ngOnInit(): void {
    // Captura o slug da URL (ex: 'show-patati-patata')
    const slug = this.route.snapshot.paramMap.get('slug') || '';
    
    // Busca no serviço comparando dinamicamente com os títulos transformados
    this.evento = this.eventoService.obterEventoPorSlug(slug);
    
    window.scrollTo(0, 0);
  }
}