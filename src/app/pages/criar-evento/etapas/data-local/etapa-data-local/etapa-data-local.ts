import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import {
  DadosEvento,
  DataEvento
} from '../../../../../models/dados-evento';

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

  tipoLocal = 'presencial';

  endereco = '';
  numero = '';
  complemento = '';
  cidade = '';
  estado = '';

  cidadesPorEstado: Record<string, string[]> = {
    AC: ['Rio Branco', 'Cruzeiro do Sul'],
    AL: ['Maceió', 'Arapiraca'],
    AP: ['Macapá', 'Santana'],
    AM: ['Manaus', 'Parintins'],
    BA: ['Salvador', 'Feira de Santana', 'Vitória da Conquista'],
    CE: ['Fortaleza', 'Caucaia', 'Juazeiro do Norte'],
    DF: ['Brasília'],
    ES: ['Vitória', 'Vila Velha', 'Serra'],
    GO: ['Goiânia', 'Aparecida de Goiânia', 'Anápolis'],
    MA: ['São Luís', 'Imperatriz'],
    MT: ['Cuiabá', 'Várzea Grande', 'Rondonópolis'],
    MS: ['Campo Grande', 'Dourados', 'Três Lagoas'],
    MG: ['Belo Horizonte', 'Uberlândia', 'Contagem', 'Juiz de Fora'],
    PA: ['Belém', 'Ananindeua', 'Santarém'],
    PB: ['João Pessoa', 'Campina Grande'],
    PR: ['Curitiba', 'Londrina', 'Maringá', 'Cascavel'],
    PE: ['Recife', 'Jaboatão dos Guararapes', 'Olinda'],
    PI: ['Teresina', 'Parnaíba'],
    RJ: ['Rio de Janeiro', 'Niterói', 'Petrópolis', 'Nova Iguaçu'],
    RN: ['Natal', 'Mossoró', 'Parnamirim'],
    RS: ['Porto Alegre', 'Caxias do Sul', 'Pelotas'],
    RO: ['Porto Velho', 'Ji-Paraná'],
    RR: ['Boa Vista', 'Rorainópolis'],
    SC: ['Florianópolis', 'Joinville', 'Blumenau', 'Chapecó'],
    SP: ['São Paulo', 'Campinas', 'Santos', 'Ribeirão Preto', 'Sorocaba'],
    SE: ['Aracaju', 'Nossa Senhora do Socorro'],
    TO: ['Palmas', 'Araguaína']
  };

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

  get cidadesDisponiveis(): string[] {
    return this.cidadesPorEstado[this.estado] || [];
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

    this.tipoLocal = 'presencial';
    this.endereco = this.dadosEvento.endereco;
    this.numero = this.dadosEvento.numero;
    this.complemento = this.dadosEvento.complemento;
    this.cidade = this.dadosEvento.cidade;
    this.estado = this.dadosEvento.estado;

    if (!this.cidadesDisponiveis.includes(this.cidade)) {
      this.cidade = '';
    }
  }

  private definirDataMinima() {
    const hoje = new Date();

    this.dataMinima =
      `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(hoje.getDate()).padStart(2, '0')}`;
  }

  alterarEstado() {
    this.cidade = '';
    this.camposInvalidos = this.camposInvalidos.filter(
      campo => campo !== 'cidade'
    );
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
      this.erroGeradorDatas = 'A data final não pode ser anterior à data inicial.';
      return;
    }

    if (!this.horarioInicial || !this.horarioFinal) {
      this.erroGeradorDatas = 'Informe o horário de início e término.';
      return;
    }

    if (this.horarioInicial === this.horarioFinal) {
      this.erroGeradorDatas = 'O horário de início e término não podem ser iguais.';
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
      const data =
        `${inicio.getFullYear()}-${String(inicio.getMonth() + 1).padStart(2, '0')}-${String(inicio.getDate()).padStart(2, '0')}`;

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

  horarioUltrapassaMeiaNoite(item: DataEvento) {
    return !!item.inicio &&
      !!item.fim &&
      item.fim < item.inicio;
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

    if (!this.estado) {
      this.camposInvalidos.push('estado');
    }

    if (!this.cidade || !this.cidadesDisponiveis.includes(this.cidade)) {
      this.camposInvalidos.push('cidade');
    }

    if (!this.endereco.trim()) {
      this.camposInvalidos.push('endereco');
    }

    return !this.camposInvalidos.length;
  }

  enviarFormulario() {
    this.continuar.emit({
      datas: this.datas,
      tipoLocal: 'presencial',
      endereco: this.endereco,
      numero: this.numero,
      complemento: this.complemento,
      cidade: this.cidade,
      estado: this.estado,
      link: ''
    });
  }

  voltarEtapa() {
    this.voltar.emit();
  }
}