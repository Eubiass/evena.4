
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbaPerfil } from '../../models/evento-perfil.model';

@Component({
  selector: 'app-header-perfil-usuario',
  standalone: true,
  templateUrl: './header-perfil-usuario.html',
  styleUrl: './header-perfil-usuario.css'
})
export class HeaderPerfilUsuario {
  @Input() nomeUsuario = 'Usuário';
  @Input() arrobaUsuario = 'usuario';
  @Input() descricaoUsuario = 'Conte um pouco sobre você.';
  @Input() fotoUsuario = '';
  @Input() inicialUsuario = 'U';
  @Input() membroDesde = 'Data não disponível';
  @Input() abaAtiva: AbaPerfil = 'visao-geral';

  @Output() abaSelecionada = new EventEmitter<AbaPerfil>();
  @Output() solicitouSair = new EventEmitter<Event>();

  selecionarAba(aba: AbaPerfil): void {
    this.abaSelecionada.emit(aba);
  }

  sair(event: Event): void {
    this.solicitouSair.emit(event);
  }
}
