import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { DadosEvento } from '../../../../../models/dados-evento';

@Component({
  selector: 'app-etapa-informacoes',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './etapa-informacoes.html',
  styleUrl: './etapa-informacoes.css'
})
export class EtapaInformacoes implements OnInit {
  @Input() dadosEvento!: DadosEvento;

  @Output()
  continuar = new EventEmitter<Partial<DadosEvento>>();

  nome = '';
  categoria = '';
  classificacao = '';
  descricao = '';

  imagemSelecionada = false;
  imagemPreview: string | null = null;
  nomeImagem = '';
  arquivoImagem: File | null = null;

  erro = '';

  readonly categorias = [
    {
      valor: 'musica',
      nome: 'Música'
    },
    {
      valor: 'esportes',
      nome: 'Esportes'
    },
    {
      valor: 'cultura',
      nome: 'Cultura'
    },
    {
      valor: 'gastronomia',
      nome: 'Gastronomia'
    },
    {
      valor: 'teatro',
      nome: 'Teatro'
    },
    {
      valor: 'festival',
      nome: 'Festival'
    },
    {
      valor: 'tecnologia',
      nome: 'Tecnologia'
    },
    {
      valor: 'educacao',
      nome: 'Educação'
    }
  ];

  readonly classificacoes = [
    'Livre',
    '10',
    '12',
    '14',
    '16',
    '18'
  ];

  ngOnInit(): void {
    this.carregarDados();
  }

  selecionarCategoria(
    categoria: string
  ): void {
    this.categoria = categoria;
    this.erro = '';
  }

  selecionarClassificacao(
    classificacao: string
  ): void {
    this.classificacao = classificacao;
    this.erro = '';
  }

  selecionarImagem(
    event: Event
  ): void {
    const input =
      event.target as HTMLInputElement;

    const arquivo =
      input.files?.[0];

    if (!arquivo) {
      return;
    }

    const tiposPermitidos = [
      'image/jpeg',
      'image/png',
      'image/webp'
    ];

    if (
      !tiposPermitidos.includes(
        arquivo.type
      )
    ) {
      this.erro =
        'Selecione uma imagem JPG, PNG ou WebP.';

      input.value = '';
      return;
    }

    const limite =
      5 * 1024 * 1024;

    if (
      arquivo.size > limite
    ) {
      this.erro =
        'A imagem deve ter no máximo 5 MB.';

      input.value = '';
      return;
    }

    if (
      this.imagemPreview?.startsWith(
        'blob:'
      )
    ) {
      URL.revokeObjectURL(
        this.imagemPreview
      );
    }

    this.arquivoImagem =
      arquivo;

    this.nomeImagem =
      arquivo.name;

    this.imagemPreview =
      URL.createObjectURL(
        arquivo
      );

    this.imagemSelecionada = true;
    this.erro = '';
  }

  removerImagem(): void {
    if (
      this.imagemPreview?.startsWith(
        'blob:'
      )
    ) {
      URL.revokeObjectURL(
        this.imagemPreview
      );
    }

    this.imagemSelecionada = false;
    this.imagemPreview = null;
    this.nomeImagem = '';
    this.arquivoImagem = null;
  }

  enviarFormulario(): void {
    if (!this.validar()) {
      return;
    }

    this.continuar.emit({
      nome:
        this.nome.trim(),

      categoria:
        this.categoria,

      classificacao:
        this.classificacao,

      descricao:
        this.descricao.trim(),

      imagemSelecionada:
        this.imagemSelecionada,

      imagemPreview:
        this.imagemPreview ?? '',

      nomeImagem:
        this.nomeImagem,

      arquivoImagem:
        this.arquivoImagem
    });
  }

  private carregarDados(): void {
    if (!this.dadosEvento) {
      return;
    }

    this.nome =
      this.dadosEvento.nome;

    this.categoria =
      this.dadosEvento.categoria;

    this.classificacao =
      this.dadosEvento.classificacao;

    this.descricao =
      this.dadosEvento.descricao;

    this.imagemSelecionada =
      this.dadosEvento.imagemSelecionada;

    this.imagemPreview =
      this.dadosEvento.imagemPreview ||
      null;

    this.nomeImagem =
      this.dadosEvento.nomeImagem;

    this.arquivoImagem =
      this.dadosEvento.arquivoImagem;
  }

  private validar(): boolean {
    this.erro = '';

    if (!this.nome.trim()) {
      this.erro =
        'Informe o nome do evento.';

      return false;
    }

    if (!this.categoria) {
      this.erro =
        'Selecione uma categoria.';

      return false;
    }

    if (!this.classificacao) {
      this.erro =
        'Selecione a classificação etária.';

      return false;
    }

    if (!this.descricao.trim()) {
      this.erro =
        'Informe a descrição do evento.';

      return false;
    }

    return true;
  }
}