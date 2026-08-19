import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: "app-profile-toggle",
  standalone: true,
  imports: [],
  templateUrl: "./profile-toggle.html",
  styleUrl: "./profile-toggle.css",
})
export class ProfileToggle {
  // Recebe o perfil vindo do pai ('usuario' ou 'organizador')
  @Input() perfilSelecionado: string = 'usuario';

  // Notifica o componente pai quando a opção mudar
  @Output() perfilChange = new EventEmitter<string>();

  selecionarPerfil(perfil: string): void {
    this.perfilSelecionado = perfil;
    this.perfilChange.emit(perfil);
  }
}
