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
  @Output() continuar = new EventEmitter<Partial<DadosEvento>>();

  nome = '';
  categoria = '';
  classificacao = '';
  descricao = '';
  imagemSelecionada = false;
  imagemPreview: string | null = null;
  nomeImagem = '';

  categorias = [
    { valor: 'musica', nome: 'Música' },
    { valor: 'esportes', nome: 'Esportes' },
    { valor: 'cultura', nome: 'Cultura' },
    { valor: 'gastronomia', nome: 'Gastronomia' }
  ];

  classificacoes = ['Livre', '10', '12', '14', '16', '18'];

  ngOnInit() {
    this.carregarDados();
  }

  private carregarDados() {
    if (!this.dadosEvento) return;

    this.nome = this.dadosEvento.nome;
    this.categoria = this.dadosEvento.categoria;
    this.classificacao = this.dadosEvento.classificacao;
    this.descricao = this.dadosEvento.descricao;
    this.imagemSelecionada = this.dadosEvento.imagemSelecionada;
    this.imagemPreview = this.dadosEvento.imagemPreview || null;
    this.nomeImagem = this.dadosEvento.nomeImagem;
  }

  selecionarClassificacao(classificacao: string) {
    this.classificacao = classificacao;
  }

  selecionarImagem(event: Event) {
    const input = event.target as HTMLInputElement;
    const arquivo = input.files?.[0];

    if (!arquivo || !arquivo.type.startsWith('image/')) return;

    if (this.imagemPreview) {
      URL.revokeObjectURL(this.imagemPreview);
    }

    this.imagemSelecionada = true;
    this.nomeImagem = arquivo.name;
    this.imagemPreview = URL.createObjectURL(arquivo);
  }

  enviarFormulario() {
    this.continuar.emit({
      nome: this.nome,
      categoria: this.categoria,
      classificacao: this.classificacao,
      descricao: this.descricao,
      imagemSelecionada: this.imagemSelecionada,
      imagemPreview: this.imagemPreview || '',
      nomeImagem: this.nomeImagem
    });
  }
}