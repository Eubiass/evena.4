import { Component, Input } from "@angular/core";

@Component({
  selector: "app-price-header",
  imports: [],
  templateUrl: "./price-header.html",
  styleUrl: "./price-header.css",
})
export class PriceHeader {
  @Input() preco?: number;
}
