import { Component, EventEmitter, Input, OnInit, OnChanges, SimpleChanges, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DataEvento, DadosEvento } from '../../../../../models/dados-evento';

interface Estado {
  sigla: string;
  nome: string;
}

interface MunicipioIbge {
  id: number;
  nome: string;
}

@Component({
  selector: 'app-etapa-data-local',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './etapa-data-local.html',
  styleUrl: './etapa-data-local.css'
})
export class EtapaDataLocal implements OnInit, OnChanges {
  @Input()
  dadosEvento!: DadosEvento;

  @Input()
  modoEdicao = false;

  @Output()
  continuar = new EventEmitter<Partial<DadosEvento>>();

  @Output()
  voltar = new EventEmitter<void>();

  datas: DataEvento[] = [
    this.criarData()
  ];

  tipoLocal: 'presencial' | 'online' = 'presencial';

  estado = '';
  cidade = '';
  endereco = '';
  numero = '';
  complemento = '';
  link = '';

  cidades: string[] = [];

  carregandoCidades = false;
  dataMinima = '';
  erro = '';

  private requisicaoCidades = 0;

  readonly estados: Estado[] = [
    { sigla: 'AC', nome: 'Acre' },
    { sigla: 'AL', nome: 'Alagoas' },
    { sigla: 'AP', nome: 'Amapá' },
    { sigla: 'AM', nome: 'Amazonas' },
    { sigla: 'BA', nome: 'Bahia' },
    { sigla: 'CE', nome: 'Ceará' },
    { sigla: 'DF', nome: 'Distrito Federal' },
    { sigla: 'ES', nome: 'Espírito Santo' },
    { sigla: 'GO', nome: 'Goiás' },
    { sigla: 'MA', nome: 'Maranhão' },
    { sigla: 'MT', nome: 'Mato Grosso' },
    { sigla: 'MS', nome: 'Mato Grosso do Sul' },
    { sigla: 'MG', nome: 'Minas Gerais' },
    { sigla: 'PA', nome: 'Pará' },
    { sigla: 'PB', nome: 'Paraíba' },
    { sigla: 'PR', nome: 'Paraná' },
    { sigla: 'PE', nome: 'Pernambuco' },
    { sigla: 'PI', nome: 'Piauí' },
    { sigla: 'RJ', nome: 'Rio de Janeiro' },
    { sigla: 'RN', nome: 'Rio Grande do Norte' },
    { sigla: 'RS', nome: 'Rio Grande do Sul' },
    { sigla: 'RO', nome: 'Rondônia' },
    { sigla: 'RR', nome: 'Roraima' },
    { sigla: 'SC', nome: 'Santa Catarina' },
    { sigla: 'SP', nome: 'São Paulo' },
    { sigla: 'SE', nome: 'Sergipe' },
    { sigla: 'TO', nome: 'Tocantins' }
  ];

  constructor(
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    if (!this.modoEdicao) {
      this.definirDataMinima();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dadosEvento'] && this.dadosEvento) {
      this.carregarDados();
    }
  }

  selecionarTipoLocal(
    tipo: 'presencial' | 'online'
  ): void {
    this.tipoLocal = tipo;
    this.erro = '';

    if (tipo === 'online') {
      this.estado = '';
      this.cidade = '';
      this.endereco = '';
      this.numero = '';
      this.complemento = '';
      this.cidades = [];

      return;
    }

    this.link = '';
  }

  estadoAlterado(): void {
    this.cidade = '';
    this.cidades = [];
    this.erro = '';

    if (!this.estado) {
      return;
    }

    this.carregarCidades(this.estado);
  }

  adicionarData(): void {
    this.datas.push(this.criarData());
  }

  removerData(index: number): void {
    if (this.datas.length <= 1) {
      return;
    }

    this.datas.splice(index, 1);
  }

  continuarEtapa(): void {
    if (!this.validar()) {
      return;
    }

    this.continuar.emit({
      datas: this.datas.map(data => ({
        ...data
      })),

      tipoLocal: this.tipoLocal,

      endereco:
        this.tipoLocal === 'presencial'
          ? this.endereco.trim()
          : '',

      numero:
        this.tipoLocal === 'presencial'
          ? this.numero.trim()
          : '',

      complemento:
        this.tipoLocal === 'presencial'
          ? this.complemento.trim()
          : '',

      cidade:
        this.tipoLocal === 'presencial'
          ? this.cidade.trim()
          : '',

      estado:
        this.tipoLocal === 'presencial'
          ? this.estado.trim()
          : '',

      link:
        this.tipoLocal === 'online'
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

    const dados = this.dadosEvento;

    this.tipoLocal = dados.tipoLocal === 'online'
      ? 'online'
      : 'presencial';

    this.datas = dados.datas?.length
      ? dados.datas.map(data => ({
          ...data
        }))
      : [this.criarData()];

    this.estado = dados.estado ?? '';
    this.cidade = dados.cidade ?? '';

    this.endereco = dados.endereco ?? '';
    this.numero = dados.numero ?? '';
    this.complemento = dados.complemento ?? '';

    this.link = dados.link ?? '';

    if (
      this.tipoLocal === 'presencial' &&
      this.estado
    ) {
      this.separarEnderecoCombinado();

      this.carregarCidades(
        this.estado,
        this.cidade
      );
    } else {
      this.cidades = [];
    }
  }

  private separarEnderecoCombinado(): void {
    // Não altera os campos se a API já os enviou separados.
    if (this.numero || this.complemento) {
      return;
    }

    const partes = this.endereco
      .split(',')
      .map(parte => parte.trim())
      .filter(Boolean);

    if (partes.length < 2) {
      return;
    }

    const parteNumero = partes[1];

    const resultado = parteNumero.match(
      /^(?:n[º°.]?\s*)?(\d+[a-zA-Z]?)(?:\s*[-/]\s*(.*))?$/i
    );

    if (!resultado) {
      return;
    }

    this.endereco = partes[0];
    this.numero = resultado[1];

    const complementoNumero = resultado[2]?.trim() ?? '';
    const complementoRestante = partes.slice(2).join(', ');

    this.complemento = [
      complementoNumero,
      complementoRestante
    ]
      .filter(Boolean)
      .join(', ');
  }

  private carregarCidades(
    uf: string,
    cidadeSelecionada = ''
  ): void {
    const numeroRequisicao = ++this.requisicaoCidades;

    this.carregandoCidades = true;

    this.http
      .get<MunicipioIbge[]>(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`
      )
      .subscribe({
        next: municipios => {
          // Ignora respostas antigas caso o estado tenha sido alterado.
          if (numeroRequisicao !== this.requisicaoCidades) {
            return;
          }

          this.cidades = municipios
            .map(municipio => municipio.nome)
            .sort((a, b) =>
              a.localeCompare(b, 'pt-BR')
            );

          if (cidadeSelecionada) {
            const cidadeEncontrada = this.cidades.find(
              cidade =>
                this.normalizarTexto(cidade) ===
                this.normalizarTexto(cidadeSelecionada)
            );

            this.cidade = cidadeEncontrada ?? cidadeSelecionada;
          }

          this.carregandoCidades = false;
        },

        error: erro => {
          if (numeroRequisicao !== this.requisicaoCidades) {
            return;
          }

          console.error(
            'Erro ao carregar cidades:',
            erro
          );

          this.cidades = [];
          this.carregandoCidades = false;

          this.erro =
            'Não foi possível carregar as cidades. Tente novamente.';
        }
      });
  }

  private normalizarTexto(valor: string): string {
    return valor
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
      .toLowerCase();
  }

  private validar(): boolean {
    this.erro = '';

    if (!this.datas.length) {
      this.erro = 'Informe pelo menos uma data.';
      return false;
    }

    for (let i = 0; i < this.datas.length; i++) {
      const data = this.datas[i];

      if (!data.data) {
        this.erro =
          `Informe a data do evento na opção ${i + 1}.`;

        return false;
      }

      if (!data.inicio) {
        this.erro =
          `Informe o horário de início na opção ${i + 1}.`;

        return false;
      }

      if (!data.fim && !this.modoEdicao) {
        this.erro =
          `Informe o horário de término na opção ${i + 1}.`;

        return false;
      }

      if (
        data.fim &&
        !data.terminaNoDiaSeguinte &&
        data.fim <= data.inicio
      ) {
        this.erro =
          `O horário final da opção ${i + 1} deve ser posterior ao horário inicial.`;

        return false;
      }
    }

    if (this.tipoLocal === 'presencial') {
      if (!this.estado) {
        this.erro = 'Selecione o estado do evento.';
        return false;
      }

      if (!this.cidade) {
        this.erro = 'Selecione a cidade do evento.';
        return false;
      }

      if (!this.endereco.trim()) {
        this.erro = 'Informe o endereço do evento.';
        return false;
      }

      if (!this.numero.trim() && !this.modoEdicao) {
        this.erro = 'Informe o número do endereço.';
        return false;
      }
    }

    if (
      this.tipoLocal === 'online' &&
      !this.link.trim()
    ) {
      this.erro =
        'Informe o link de acesso ao evento online.';

      return false;
    }

    return true;
  }

  private criarData(): DataEvento {
    return {
      data: '',
      inicio: '',
      fim: '',
      terminaNoDiaSeguinte: false
    };
  }

  private definirDataMinima(): void {
    const hoje = new Date();

    const ano = hoje.getFullYear();

    const mes = String(
      hoje.getMonth() + 1
    ).padStart(2, '0');

    const dia = String(
      hoje.getDate()
    ).padStart(2, '0');

    this.dataMinima = `${ano}-${mes}-${dia}`;
  }
}
