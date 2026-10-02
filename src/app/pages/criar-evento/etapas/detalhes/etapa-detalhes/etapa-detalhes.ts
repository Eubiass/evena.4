import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';

import { FormsModule } from '@angular/forms';

import {
  Atracao,
  DadosEvento,
  Recurso
} from '../../../../../models/dados-evento';

@Component({
  selector: 'app-etapa-detalhes',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './etapa-detalhes.html',
  styleUrl: './etapa-detalhes.css'
})
export class EtapaDetalhes implements OnInit {
  @Input() dadosEvento!: DadosEvento;
  @Output() continuar = new EventEmitter<Partial<DadosEvento>>();
  @Output() voltar = new EventEmitter<void>();

  tipoIngresso = '';
  precoMinimo = '';
  precoMaximo = '';
  linkIngresso = '';

  atracoes: Atracao[] = [this.criarAtracaoVazia()];

  estacionamento = false;
  guardaVolumes = false;
  acessibilidade = false;

  recursos: Recurso[] = [];
  novoRecurso = '';
  mostrarNovoRecurso = false;

  informacoes = '';
  pergunta = '';
  resposta = '';

  erroPreco = '';

  ngOnInit() {
    this.carregarDados();
  }

  private criarAtracaoVazia(): Atracao {
    return {
      nome: '',
      descricao: ''
    };
  }

  private carregarDados() {
    if (!this.dadosEvento) return;

    const dados = this.dadosEvento;

    this.tipoIngresso = dados.tipoIngresso;
    this.precoMinimo = dados.precoMinimo;
    this.precoMaximo = dados.precoMaximo;
    this.linkIngresso = dados.linkIngresso;

    this.atracoes = dados.atracoes.length
      ? dados.atracoes.map(atracao => ({ ...atracao }))
      : [this.criarAtracaoVazia()];

    this.estacionamento = dados.estacionamento;
    this.guardaVolumes = dados.guardaVolumes;
    this.acessibilidade = dados.acessibilidade;

    this.recursos = dados.recursos.map(recurso => ({ ...recurso }));

    this.informacoes = dados.informacoes;
    this.pergunta = dados.pergunta;
    this.resposta = dados.resposta;
  }

  selecionarTipoIngresso(tipo: string) {
    this.tipoIngresso = tipo;
    this.erroPreco = '';

    if (tipo === 'gratuito') {
      this.precoMinimo = '';
      this.precoMaximo = '';
      this.linkIngresso = '';
    }
  }

  adicionarAtracao() {
    this.atracoes.push(this.criarAtracaoVazia());
  }

  removerAtracao(index: number) {
    if (this.atracoes.length === 1) {
      this.atracoes[0] = this.criarAtracaoVazia();
      return;
    }

    this.atracoes.splice(index, 1);
  }

  adicionarRecurso() {
    const nome = this.novoRecurso.trim();

    if (!nome) return;

    if (this.recursos.some(recurso =>
      recurso.nome.toLowerCase() === nome.toLowerCase()
    )) {
      return;
    }

    this.recursos.push({
      nome,
      selecionado: true
    });

    this.novoRecurso = '';
    this.mostrarNovoRecurso = false;
  }

  removerRecurso(index: number) {
    this.recursos.splice(index, 1);
  }

  cancelarNovoRecurso() {
    this.novoRecurso = '';
    this.mostrarNovoRecurso = false;
  }

  private validarPrecos() {
    this.erroPreco = '';

    if (this.tipoIngresso !== 'pago') return true;

    const minimo = this.converterPreco(this.precoMinimo);
    const maximo = this.converterPreco(this.precoMaximo);

    if (minimo === null || maximo === null) {
      this.erroPreco = 'Informe valores válidos para os preços.';
      return false;
    }

    if (minimo < 0 || maximo < 0) {
      this.erroPreco = 'Os preços não podem ser negativos.';
      return false;
    }

    if (maximo < minimo) {
      this.erroPreco =
        'O preço máximo não pode ser menor que o preço mínimo.';
      return false;
    }

    return true;
  }

  private converterPreco(valor: string): number | null {
    if (!valor.trim()) return null;

    const numero = Number(
      valor
        .replace('R$', '')
        .replace(/\s/g, '')
        .replace(/\./g, '')
        .replace(',', '.')
    );

    return Number.isNaN(numero) ? null : numero;
  }

  private validarAtracoes() {
    return this.atracoes.every(
      atracao => atracao.nome.trim().length > 0
    );
  }

  enviarFormulario() {
    // if (!this.tipoIngresso) return;
    // if (!this.validarPrecos()) return;
    // if (this.tipoIngresso === 'pago' && !this.linkIngresso.trim()) return;
    // if (!this.validarAtracoes()) return;

    this.continuar.emit({
      tipoIngresso: this.tipoIngresso,
      precoMinimo: this.tipoIngresso === 'pago' ? this.precoMinimo : '',
      precoMaximo: this.tipoIngresso === 'pago' ? this.precoMaximo : '',
      linkIngresso: this.tipoIngresso === 'pago' ? this.linkIngresso : '',
      atracoes: this.atracoes,
      estacionamento: this.estacionamento,
      guardaVolumes: this.guardaVolumes,
      acessibilidade: this.acessibilidade,
      recursos: this.recursos,
      informacoes: this.informacoes,
      pergunta: this.pergunta,
      resposta: this.resposta
    });
  }

  voltarEtapa() {
    this.voltar.emit();
  }
}