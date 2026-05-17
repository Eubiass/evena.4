import { Component, Input } from "@angular/core";

@Component({
  selector: "app-lineup-bloco",
  imports: [],
  templateUrl: "./lineup-bloco.html",
  styleUrl: "./lineup-bloco.css",
})
export class LineupBloco {
  @Input() artistas: string[] | undefined;
}
