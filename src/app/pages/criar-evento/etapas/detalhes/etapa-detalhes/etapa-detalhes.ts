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
  DadosEvento
} from '../../../../../models/dados-evento';

@Component({
  selector: 'app-etapa-detalhes',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './etapa-detalhes.html',
  styleUrl: './etapa-detalhes.css'
})
export class EtapaDetalhes implements OnInit {
  @Input()
  dadosEvento!: DadosEvento;

  @Output()
  continuar =
    new EventEmitter<Partial<DadosEvento>>();

  @Output()
  voltar =
    new EventEmitter<void>();

  tipoIngresso = '';

  preco = '';
  linkIngresso = '';

  atracoes: Atracao[] = [
    this.criarAtracaoVazia()
  ];

  recursos: string[] = [];

  informacoes = '';

  pergunta = '';
  resposta = '';

  erro = '';

  readonly opcoesRecursos = [
    'Acessibilidade',
    'Estacionamento',
    'Wi-Fi',
    'Alimentação',
    'Banheiros',
    'Segurança',
    'Pet friendly',
    'Espaço kids',
    'Guarda-volumes',
    'Ar-condicionado'
  ];

  ngOnInit(): void {
    this.carregarDados();
  }

  selecionarTipoIngresso(
    tipo: string
  ): void {
    this.tipoIngresso =
      tipo;

    this.erro = '';

    if (
      tipo === 'gratuito'
    ) {
      this.preco = '';
      this.linkIngresso = '';
    }
  }

  adicionarAtracao(): void {
    this.atracoes.push(
      this.criarAtracaoVazia()
    );
  }

  removerAtracao(
    index: number
  ): void {
    if (
      this.atracoes.length === 1
    ) {
      this.atracoes[0] =
        this.criarAtracaoVazia();

      return;
    }

    this.atracoes.splice(
      index,
      1
    );
  }

  alternarRecurso(
    recurso: string
  ): void {
    if (
      this.recursoSelecionado(
        recurso
      )
    ) {
      this.recursos =
        this.recursos.filter(
          item =>
            item !== recurso
        );

      return;
    }

    this.recursos = [
      ...this.recursos,
      recurso
    ];
  }

  recursoSelecionado(
    recurso: string
  ): boolean {
    return this.recursos.includes(
      recurso
    );
  }

  continuarEtapa(): void {
    if (!this.validar()) {
      return;
    }

    this.continuar.emit({
      tipoIngresso:
        this.tipoIngresso,

      preco:
        this.tipoIngresso ===
        'pago'
          ? this.preco.trim()
          : '',

      linkIngresso:
        this.tipoIngresso ===
        'pago'
          ? this.linkIngresso.trim()
          : '',

      atracoes:
        this.atracoes
          .filter(
            atracao =>
              atracao.nome.trim()
          )
          .map(
            atracao => ({
              nome:
                atracao.nome.trim()
            })
          ),

      recursos: [
        ...this.recursos
      ],

      informacoes:
        this.informacoes.trim(),

      pergunta:
        this.pergunta.trim(),

      resposta:
        this.resposta.trim()
    });
  }

  voltarEtapa(): void {
    this.voltar.emit();
  }

  private criarAtracaoVazia():
    Atracao {
    return {
      nome: ''
    };
  }

  private carregarDados(): void {
    if (!this.dadosEvento) {
      return;
    }

    this.tipoIngresso =
      this.dadosEvento.tipoIngresso;

    this.preco =
      this.dadosEvento.preco;

    this.linkIngresso =
      this.dadosEvento.linkIngresso;

    this.atracoes =
      this.dadosEvento.atracoes.length
        ? this.dadosEvento
            .atracoes
            .map(
              atracao => ({
                ...atracao
              })
            )
        : [
            this.criarAtracaoVazia()
          ];

    this.recursos = [
      ...this.dadosEvento.recursos
    ];

    this.informacoes =
      this.dadosEvento.informacoes;

    this.pergunta =
      this.dadosEvento.pergunta;

    this.resposta =
      this.dadosEvento.resposta;
  }

  private validar(): boolean {
    this.erro = '';

    if (!this.tipoIngresso) {
      this.erro =
        'Selecione o tipo de ingresso.';

      return false;
    }

    if (
      this.tipoIngresso ===
      'pago'
    ) {
      if (
        !this.preco.trim()
      ) {
        this.erro =
          'Informe o preço do ingresso.';

        return false;
      }

      const preco =
        this.converterPreco(
          this.preco
        );

      if (
        preco === null ||
        preco <= 0
      ) {
        this.erro =
          'Informe um preço válido.';

        return false;
      }

      if (
        !this.linkIngresso.trim()
      ) {
        this.erro =
          'Informe o link para compra do ingresso.';

        return false;
      }
    }

    const atracoesValidas =
      this.atracoes.filter(
        atracao =>
          atracao.nome.trim()
      );

    /*
     * TEMPORÁRIO:
     * a API ainda exige artistaId
     * para cadastrar categoria.
     */
    if (
      !atracoesValidas.length
    ) {
      this.erro =
        'Informe pelo menos uma atração para o evento.';

      return false;
    }

    return true;
  }

  private converterPreco(
    valor: string
  ): number | null {
    const normalizado =
      valor
        .replace('R$', '')
        .replace(/\s/g, '')
        .replace(/\./g, '')
        .replace(',', '.');

    const preco =
      Number(normalizado);

    return Number.isFinite(
      preco
    )
      ? preco
      : null;
  }
}