import { Component, Input } from "@angular/core";
import { CommonModule } from '@angular/common';

@Component({
  selector: "app-header-detalhe",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./header-detalhe.html",
  styleUrl: "./header-detalhe.css",
})
export class HeaderDetalhe {
  @Input() evento: any; 
}
