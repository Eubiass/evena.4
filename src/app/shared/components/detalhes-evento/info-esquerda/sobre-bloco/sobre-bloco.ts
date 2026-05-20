import { Component, Input } from "@angular/core";

@Component({
  selector: "app-sobre-bloco",
  imports: [],
  templateUrl: "./sobre-bloco.html",
  styleUrl: "./sobre-bloco.css",
})
export class SobreBloco {
  @Input() descricao: string | undefined;
}
