import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  DataEvento,
  DadosEvento
} from '../../../../../models/dados-evento';

@Component({
  selector: 'app-etapa-data-local',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './etapa-data-local.html',
  styleUrl: './etapa-data-local.css'
})
export class EtapaDataLocal
  implements OnInit {

  @Input()
  dadosEvento!: DadosEvento;

  @Output()
  continuar =
    new EventEmitter<Partial<DadosEvento>>();

  @Output()
  voltar =
    new EventEmitter<void>();

  datas: DataEvento[] = [
    this.criarData()
  ];

  tipoLocal:
    'presencial' |
    'online' = 'presencial';

  estado = '';
  cidade = '';

  endereco = '';
  numero = '';
  complemento = '';

  link = '';

  dataMinima = '';

  erro = '';

  ngOnInit(): void {
    this.definirDataMinima();
    this.carregarDados();
  }

  selecionarTipoLocal(
    tipo:
      'presencial' |
      'online'
  ): void {
    this.tipoLocal = tipo;
    this.erro = '';

    if (
      tipo === 'presencial'
    ) {
      this.link = '';
      return;
    }

    this.estado = '';
    this.cidade = '';
    this.endereco = '';
    this.numero = '';
    this.complemento = '';
  }

  adicionarData(): void {
    this.datas.push(
      this.criarData()
    );
  }

  removerData(
    index: number
  ): void {
    if (
      this.datas.length <= 1
    ) {
      return;
    }

    this.datas.splice(
      index,
      1
    );
  }

  continuarEtapa(): void {
    if (!this.validar()) {
      return;
    }

    this.continuar.emit({
      datas:
        this.datas.map(
          data => ({
            ...data
          })
        ),

      tipoLocal:
        this.tipoLocal,

      endereco:
        this.tipoLocal ===
        'presencial'
          ? this.endereco.trim()
          : '',

      numero:
        this.tipoLocal ===
        'presencial'
          ? this.numero.trim()
          : '',

      complemento:
        this.tipoLocal ===
        'presencial'
          ? this.complemento.trim()
          : '',

      cidade:
        this.tipoLocal ===
        'presencial'
          ? this.cidade.trim()
          : '',

      estado:
        this.tipoLocal ===
        'presencial'
          ? this.estado.trim()
          : '',

      link:
        this.tipoLocal ===
        'online'
          ? this.link.trim()
          : ''
    });
  }

  voltarEtapa(): void {
    this.voltar.emit();
  }

  private carregarDados(): void {
    if (!this.dadosEvento) {
      return;
    }

    const dados =
      this.dadosEvento;

    this.tipoLocal =
      dados.tipoLocal ===
      'online'
        ? 'online'
        : 'presencial';

    this.datas =
      dados.datas.length
        ? dados.datas.map(
            data => ({
              ...data
            })
          )
        : [
            this.criarData()
          ];

    this.estado =
      dados.estado;

    this.cidade =
      dados.cidade;

    this.endereco =
      dados.endereco;

    this.numero =
      dados.numero;

    this.complemento =
      dados.complemento;

    this.link =
      dados.link;
  }

  private validar(): boolean {
    this.erro = '';

    if (!this.datas.length) {
      this.erro =
        'Informe pelo menos uma data.';

      return false;
    }

    for (
      let i = 0;
      i < this.datas.length;
      i++
    ) {
      const data =
        this.datas[i];

      if (
        !data.data ||
        !data.inicio ||
        !data.fim
      ) {
        this.erro =
          `Preencha a data e os horários da data ${i + 1}.`;

        return false;
      }

      if (
        !data.terminaNoDiaSeguinte &&
        data.fim <= data.inicio
      ) {
        this.erro =
          `O horário final da data ${i + 1} deve ser posterior ao horário inicial.`;

        return false;
      }
    }

    if (
      this.tipoLocal ===
      'presencial'
    ) {
      if (!this.estado.trim()) {
        this.erro =
          'Informe o estado.';

        return false;
      }

      if (!this.cidade.trim()) {
        this.erro =
          'Informe a cidade.';

        return false;
      }

      if (!this.endereco.trim()) {
        this.erro =
          'Informe o endereço.';

        return false;
      }

      if (!this.numero.trim()) {
        this.erro =
          'Informe o número do endereço.';

        return false;
      }
    }

    if (
      this.tipoLocal ===
        'online' &&
      !this.link.trim()
    ) {
      this.erro =
        'Informe o link do evento online.';

      return false;
    }

    return true;
  }

  private criarData():
    DataEvento {
    return {
      data: '',
      inicio: '',
      fim: '',
      terminaNoDiaSeguinte: false
    };
  }

  private definirDataMinima(): void {
    const hoje =
      new Date();

    const ano =
      hoje.getFullYear();

    const mes =
      String(
        hoje.getMonth() + 1
      ).padStart(
        2,
        '0'
      );

    const dia =
      String(
        hoje.getDate()
      ).padStart(
        2,
        '0'
      );

    this.dataMinima =
      `${ano}-${mes}-${dia}`;
  }
}