import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DadosEvento, DataEvento } from '../../../../../models/dados-evento';

@Component({
  selector: 'app-etapa-data-local',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './etapa-data-local.html',
  styleUrl: './etapa-data-local.css'
})
export class EtapaDataLocal implements OnInit {
  @Input() dadosEvento!: DadosEvento;
  @Output() continuar = new EventEmitter<Partial<DadosEvento>>();
  @Output() voltar = new EventEmitter<void>();

  datas: DataEvento[] = [this.criarDataVazia()];

  tipoLocal = '';
  endereco = '';
  numero = '';
  complemento = '';
  cidade = '';
  estado = '';
  link = '';

  dataMinima = '';
  horariosInvalidos: number[] = [];
  camposInvalidos: string[] = [];

  mostrarGeradorDatas = false;
  dataInicial = '';
  dataFinal = '';
  horarioInicial = '';
  horarioFinal = '';
  geradorTerminaNoDiaSeguinte = false;
  erroGeradorDatas = '';

  ngOnInit() {
    this.definirDataMinima();
    this.carregarDados();
  }

  private criarDataVazia(): DataEvento {
    return {
      data: '',
      inicio: '',
      fim: '',
      terminaNoDiaSeguinte: false
    };
  }

  private carregarDados() {
    if (!this.dadosEvento) return;

    this.datas = this.dadosEvento.datas.length
      ? this.dadosEvento.datas.map(item => ({ ...item }))
      : [this.criarDataVazia()];

    Object.assign(this, {
      tipoLocal: this.dadosEvento.tipoLocal,
      endereco: this.dadosEvento.endereco,
      numero: this.dadosEvento.numero,
      complemento: this.dadosEvento.complemento,
      cidade: this.dadosEvento.cidade,
      estado: this.dadosEvento.estado,
      link: this.dadosEvento.link
    });
  }

  private definirDataMinima() {
    const hoje = new Date();

    this.dataMinima =
      `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(hoje.getDate()).padStart(2, '0')}`;
  }

  adicionarData() {
    this.datas.push(this.criarDataVazia());
  }

  removerData(index: number) {
    if (this.datas.length === 1) return;

    this.datas.splice(index, 1);
    this.camposInvalidos = [];
    this.horariosInvalidos = [];
  }

  alternarGeradorDatas() {
    this.mostrarGeradorDatas = !this.mostrarGeradorDatas;
    this.erroGeradorDatas = '';
  }

  gerarDatas() {
    this.erroGeradorDatas = '';

    if (!this.dataInicial || !this.dataFinal) {
      this.erroGeradorDatas = 'Informe a data inicial e a data final.';
      return;
    }

    if (this.dataFinal < this.dataInicial) {
      this.erroGeradorDatas =
        'A data final não pode ser anterior à data inicial.';
      return;
    }

    if (!this.horarioInicial || !this.horarioFinal) {
      this.erroGeradorDatas = 'Informe o horário de início e término.';
      return;
    }

    if (
      this.horarioInicial === this.horarioFinal
    ) {
      this.erroGeradorDatas =
        'O horário de início e término não podem ser iguais.';
      return;
    }

    if (
      this.horarioFinal < this.horarioInicial &&
      !this.geradorTerminaNoDiaSeguinte
    ) {
      this.erroGeradorDatas =
        'Marque "Termina no dia seguinte" para esse horário.';
      return;
    }

    const inicio = new Date(`${this.dataInicial}T00:00:00`);
    const fim = new Date(`${this.dataFinal}T00:00:00`);

    while (inicio <= fim) {
      const data = inicio.toISOString().split('T')[0];

      this.datas.push({
        data,
        inicio: this.horarioInicial,
        fim: this.horarioFinal,
        terminaNoDiaSeguinte: this.geradorTerminaNoDiaSeguinte
      });

      inicio.setDate(inicio.getDate() + 1);
    }

    this.limparGeradorDatas();
  }

  private limparGeradorDatas() {
    this.dataInicial = '';
    this.dataFinal = '';
    this.horarioInicial = '';
    this.horarioFinal = '';
    this.geradorTerminaNoDiaSeguinte = false;
    this.mostrarGeradorDatas = false;
  }

  selecionarTipoLocal(tipo: string) {
    this.tipoLocal = tipo;
    this.camposInvalidos =
      this.camposInvalidos.filter(campo => campo !== 'tipoLocal');
  }

  horarioUltrapassaMeiaNoite(item: DataEvento) {
    return !!item.inicio && !!item.fim && item.fim < item.inicio;
  }

  private validarHorarios() {
    this.horariosInvalidos = [];

    this.datas.forEach((item, index) => {
      if (!item.inicio || !item.fim || item.inicio === item.fim) {
        if (item.inicio === item.fim && item.inicio) {
          this.horariosInvalidos.push(index);
        }
        return;
      }

      const horarioInvertido = item.fim < item.inicio;

      if (horarioInvertido !== item.terminaNoDiaSeguinte) {
        this.horariosInvalidos.push(index);
      }
    });

    return !this.horariosInvalidos.length;
  }

  private validarCampos() {
    this.camposInvalidos = [];

    this.datas.forEach((item, index) => {
      if (!item.data || item.data < this.dataMinima) {
        this.camposInvalidos.push(`data-${index}`);
      }

      if (!item.inicio) {
        this.camposInvalidos.push(`inicio-${index}`);
      }

      if (!item.fim) {
        this.camposInvalidos.push(`fim-${index}`);
      }
    });

    if (!this.tipoLocal) {
      this.camposInvalidos.push('tipoLocal');
    }

    if (
      ['presencial', 'hibrido'].includes(this.tipoLocal) &&
      !this.endereco.trim()
    ) {
      this.camposInvalidos.push('endereco');
    }

    if (
      ['online', 'hibrido'].includes(this.tipoLocal) &&
      !this.link.trim()
    ) {
      this.camposInvalidos.push('link');
    }

    return !this.camposInvalidos.length;
  }

  enviarFormulario() {
    // if (!this.validarCampos() || !this.validarHorarios()) return;

    this.continuar.emit({
      datas: this.datas,
      tipoLocal: this.tipoLocal,
      endereco: this.endereco,
      numero: this.numero,
      complemento: this.complemento,
      cidade: this.cidade,
      estado: this.estado,
      link: this.link
    });
  }

  voltarEtapa() {
    this.voltar.emit();
  }
}