import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  Input
} from '@angular/core';
import {
  DomSanitizer,
  SafeResourceUrl
} from '@angular/platform-browser';

import { Evento } from '../../../../../models/evento';

@Component({
  selector: 'app-localizacao-bloco',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './localizacao-bloco.html',
  styleUrl: './localizacao-bloco.css'
})
export class LocalizacaoBloco {
  @Input()
  evento?: Evento;

  private sanitizer =
    inject(DomSanitizer);

  getUrlMapaSafe():
    SafeResourceUrl | string {
    if (
      this.evento?.lat &&
      this.evento?.lng
    ) {
      const url =
        `https://maps.google.com/maps?q=${this.evento.lat},${this.evento.lng}&z=15&output=embed`;

      return this.sanitizer
        .bypassSecurityTrustResourceUrl(
          url
        );
    }

    return '';
  }

  abrirNoMaps(): void {
    if (
      !this.evento
        ?.enderecoCompleto
    ) {
      return;
    }

    const enderecoQuery =
      encodeURIComponent(
        `${this.evento.localNome || ''} ${this.evento.enderecoCompleto}`
      );

    window.open(
      `https://www.google.com/maps/search/?api=1&query=${enderecoQuery}`,
      '_blank'
    );
  }
}