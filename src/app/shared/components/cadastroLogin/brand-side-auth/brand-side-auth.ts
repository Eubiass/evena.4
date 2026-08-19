import { Component, Input } from "@angular/core";

@Component({
  selector: "app-brand-side-auth",
  standalone: true,
  imports: [],
  templateUrl: "./brand-side-auth.html",
  styleUrl: "./brand-side-auth.css",
})
export class BrandSideAuth {
  @Input() tagline: string = 'Viver é melhor ao vivo.';
  @Input() logoSrc: string = 'coroaEvena.svg';
}
