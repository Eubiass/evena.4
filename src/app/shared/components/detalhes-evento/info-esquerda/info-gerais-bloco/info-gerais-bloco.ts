import { Component, Input } from "@angular/core";

@Component({
  selector: "app-info-gerais-bloco",
  imports: [],
  templateUrl: "./info-gerais-bloco.html",
  styleUrl: "./info-gerais-bloco.css",
})
export class InfoGeraisBloco {
  @Input() evento: any;
}
