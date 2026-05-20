import { CommonModule } from "@angular/common";
import { Component, inject, Input } from "@angular/core";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";

@Component({
  selector: "app-localizacao-bloco",
  imports: [CommonModule],
  templateUrl: "./localizacao-bloco.html",
  styleUrl: "./localizacao-bloco.css",
})
export class LocalizacaoBloco {
  @Input() evento: any;

  // Injetando o sanitizador do Angular (Evita bypass/erros de segurança no iframe)
  private sanitizer = inject(DomSanitizer);

  // Gera a URL do mapa utilizando as coordenadas reais vindas da sua API
  getUrlMapaSafe(): SafeResourceUrl {
    if (this.evento?.lat && this.evento?.lng) {
      const url = `https://maps.google.com/maps?q=${this.evento.lat},${this.evento.lng}&z=15&output=embed`;
      return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
    return '';
  }

  abrirNoMaps(): void {
    if (this.evento?.enderecoCompleto) {
      const enderecoQuery = encodeURIComponent(`${this.evento.localNome || ''} ${this.evento.enderecoCompleto}`);
      window.open(`https://www.google.com/maps/search/?api=1&query=${enderecoQuery}`, '_blank');
    }
  }
}
