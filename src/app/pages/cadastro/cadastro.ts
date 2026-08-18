import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router'; 

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [FormsModule, RouterLink], 
  templateUrl: './cadastro.html',
  styleUrl: './cadastro.css'
})
export class Cadastro {
  tipoPerfil: 'usuario' | 'organizador' = 'usuario';
  passoOrganizador = 1;

  // --- DADOS DO USUÁRIO ---
  nome = '';
  // dataNascimento = '';
  emailUsuario = '';
  nomeUsuario = '';
  senhaUsuario = '';
  confirmarSenhaUsuario = '';

  // --- DADOS DO ORGANIZADOR ---
  emailEmpresa = '';
  telefoneEmpresa = '';
  senhaOrganizador = '';
  confirmarSenhaOrganizador = '';
  
  razaoSocial = '';
  nomeFantasia = '';
  cnpj = '';
  ramoEmpresa = '';

  cep = '';
  estado = '';
  cidade = '';
  bairro = '';
  endereco = '';
  numero = '';
  complemento = '';

  mudarPerfil(perfil: 'usuario' | 'organizador') {
    this.tipoPerfil = perfil;
    this.passoOrganizador = 1;
  }

  avancarPasso() {
    if (this.passoOrganizador < 3) this.passoOrganizador++;
  }

  voltarPasso() {
    if (this.passoOrganizador > 1) this.passoOrganizador--;
  }

  executarCadastro(event: Event) {
    event.preventDefault();
    if (this.tipoPerfil === 'usuario') {
      if (this.senhaUsuario !== this.confirmarSenhaUsuario) {
        alert('As senhas não coincidem!');
        return;
      }
      console.log('Usuário cadastrado com sucesso.');
    } else {
      if (this.senhaOrganizador !== this.confirmarSenhaOrganizador) {
        alert('As senhas não coincidem!');
        return;
      }
      console.log('Organizador cadastrado com sucesso.');
    }
  }
}