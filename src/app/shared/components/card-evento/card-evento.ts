import { Component, Input } from '@angular/core';
import { Evento } from '../../../model/evento';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router'; // Mantemos o RouterLink que você já usava

@Component({
  selector: 'app-card-evento',
  standalone: true,
  imports: [CommonModule, RouterLink], // Certifique-se de que ele está aqui
  templateUrl: './card-evento.html',
  styleUrl: './card-evento.css',
})
export class CardEvento {
  @Input({ required: true }) dadosEvento!: Evento;

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
