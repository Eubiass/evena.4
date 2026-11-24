/*import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Header } from '../../shared/components/header/header';
import { Footer } from '../../shared/components/footer/footer';
import { BrandSideAuth } from '../../shared/components/cadastroLogin/brand-side-auth/brand-side-auth';

@Component({
  selector: 'app-esqueci-senha',
  standalone: true,
  imports: [ FormsModule, RouterLink, Header, Footer, BrandSideAuth ],
  templateUrl: './esqueci-senha.html',
  styleUrl: './esqueci-senha.css'
})
export class EsqueciSenha {
  email = '';
  mensagem = '';
  carregando = false;

  solicitarRecuperacao(): void {
    this.mensagem = '';

    if (!this.email.trim()) {
      this.mensagem = 'Informe seu e-mail.';
      return;
    }

    // A integração com o serviço de recuperação será adicionada
    // quando o fluxo seguro estiver disponível no backend.
    this.mensagem =
      'A recuperação de senha ainda não está disponível. Tente novamente mais tarde.';
  }
}*/

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { Header } from '../../shared/components/header/header';
import { Footer } from '../../shared/components/footer/footer';
import { BrandSideAuth } from '../../shared/components/cadastroLogin/brand-side-auth/brand-side-auth';

@Component({
  selector: 'app-esqueci-senha',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    Header,
    Footer,
    BrandSideAuth
  ],
  templateUrl: './esqueci-senha.html',
  styleUrl: './esqueci-senha.css'
})
export class EsqueciSenha {
  etapa = 1;

  email = '';
  codigo = '';
  senha = '';
  confirmarSenha = '';

  mostrarSenha = false;
  mostrarConfirmarSenha = false;

  mensagem = '';
  tipoMensagem: 'erro' | 'sucesso' | 'aviso' = 'aviso';

  carregando = false;

  solicitarRecuperacao(): void {
    this.limparMensagem();

    if (!this.email.trim()) {
      this.exibirMensagem('Informe seu e-mail.', 'erro');
      return;
    }

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email.trim());

    if (!emailValido) {
      this.exibirMensagem('Informe um endereço de e-mail válido.', 'erro');
      return;
    }

    // Demonstração: ainda não existe envio real de e-mail pela API.
    this.etapa = 2;

    this.exibirMensagem(
      'Esta é uma demonstração. Nenhum código foi enviado ao seu e-mail.',
      'aviso'
    );
  }

  atualizarCodigo(valor: string): void {
    this.codigo = valor.replace(/\D/g, '').slice(0, 6);
  }

  verificarCodigo(): void {
    this.limparMensagem();

    if (this.codigo.length !== 6) {
      this.exibirMensagem(
        'Digite os seis números do código.',
        'erro'
      );
      return;
    }

    // Demonstração: o código ainda não é validado pelo backend.
    this.etapa = 3;

    this.exibirMensagem(
      'Etapa demonstrativa: o código não foi validado pelo servidor.',
      'aviso'
    );
  }

  finalizarRecuperacao(): void {
    this.limparMensagem();

    if (this.senha.length < 8) {
      this.exibirMensagem(
        'A senha precisa ter pelo menos 8 caracteres.',
        'erro'
      );
      return;
    }

    if (this.senha !== this.confirmarSenha) {
      this.exibirMensagem(
        'As senhas não coincidem.',
        'erro'
      );
      return;
    }

    // Demonstração: nenhuma senha é enviada ou alterada.
    this.exibirMensagem(
      'A interface está pronta! A alteração da senha depende da integração com a API.',
      'sucesso'
    );
  }

  voltarEtapa(): void {
    this.limparMensagem();

    if (this.etapa > 1) {
      this.etapa--;
    }
  }

  reenviarCodigo(): void {
    this.exibirMensagem(
      'O envio de códigos estará disponível quando a API for integrada.',
      'aviso'
    );
  }

  private exibirMensagem(
    texto: string,
    tipo: 'erro' | 'sucesso' | 'aviso'
  ): void {
    this.mensagem = texto;
    this.tipoMensagem = tipo;
  }

  private limparMensagem(): void {
    this.mensagem = '';
  }
}