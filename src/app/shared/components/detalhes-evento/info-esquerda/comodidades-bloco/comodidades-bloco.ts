import { Component, Input } from "@angular/core";

@Component({
  selector: "app-comodidades-bloco",
  imports: [],
  templateUrl: "./comodidades-bloco.html",
  styleUrl: "./comodidades-bloco.css",
})
export class ComodidadesBloco {
  @Input() evento: any;
}
