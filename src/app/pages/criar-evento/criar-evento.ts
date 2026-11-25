import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize,
  catchError,
  forkJoin,
  map,
  Observable,
  of,
  switchMap,
  throwError
} from 'rxjs';

import {
  Atracao,
  criarDadosEventoVazio,
  DadosEvento
} from '../../models/dados-evento';

import { AuthService } from '../../services/auth.service';

import {
  ArtistaResponse,
  CategoriaRequest,
  CategoriaResponse,
  DataEventoRequest,
  DataEventoResponse,
  EventoEdicaoResponse,
  EventoRequest,
  EventoService,
  LocalizacaoRequest,
  LocalizacaoResponse
} from '../../services/evento-service';

import { BarraEtapas } from './components/barra-etapas/barra-etapas';
import { CabecalhoOrganizador } from './components/cabecalho-organizador/cabecalho-organizador';
import { EtapaInformacoes } from './etapas/informacoes/etapa-informacoes/etapa-informacoes';
import { EtapaDataLocal } from './etapas/data-local/etapa-data-local/etapa-data-local';
import { EtapaDetalhes } from './etapas/detalhes/etapa-detalhes/etapa-detalhes';
import { EtapaRevisao } from './etapas/revisao/etapa-revisao/etapa-revisao';

@Component({
  selector: 'app-criar-evento',
  standalone: true,
  imports: [
    CabecalhoOrganizador,
    BarraEtapas,
    EtapaInformacoes,
    EtapaDataLocal,
    EtapaDetalhes,
    EtapaRevisao
  ],
  templateUrl: './criar-evento.html',
  styleUrl: './criar-evento.css'
})
export class CriarEvento implements OnInit {
  etapaAtual = 1;

  dadosEvento = criarDadosEventoVazio();

  publicando = false;
  carregandoEvento = false;

  modoEdicao = false;
  eventoId: number | null = null;

  private statusEvento = true;

  private artistasOriginais: string[] = [];

  constructor(
    private authService: AuthService,
    private eventoService: EventoService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      return;
    }

    const eventoId = Number(id);

    if (!Number.isInteger(eventoId) || eventoId <= 0) {
      alert('Identificador do evento inválido.');
      this.router.navigate(['/perfil-organizador']);
      return;
    }

    this.modoEdicao = true;
    this.eventoId = eventoId;

    this.carregarEvento(eventoId);
  }

  private carregarEvento(id: number): void {
  console.log('[EDIÇÃO] Iniciando carregamento');

  this.carregandoEvento = true;

  this.eventoService.obterEventoCompletoPorId(id)
    .pipe(
      finalize(() => {
        this.carregandoEvento = false;
        this.cdr.detectChanges();
      })
    )
    .subscribe({
      next: evento => {
        this.statusEvento = evento.status;
        this.artistasOriginais = [
          ...(evento.artistas ?? [])
        ];

        this.dadosEvento =
          this.converterEventoParaFormulario(evento);
      },

      error: erro => {
        alert('Não foi possível carregar os dados do evento.');
        this.router.navigate(['/perfil-organizador']);
      }
    });
}

  private converterEventoParaFormulario(
    evento: EventoEdicaoResponse
  ): DadosEvento {
    const dadosVazios = criarDadosEventoVazio();

    const imagem = evento.capa || evento.banner || '';
    const preco = Number(evento.preco ?? 0);

    const datasDetalhadas = evento.datasDetalhadas ?? [];

    const datas = datasDetalhadas.length
      ? datasDetalhadas.map(data => {
          const partesInicio = data.dataHora.split('T');
          const partesFim = data.dataHoraFim?.split('T');

          return {
            data: partesInicio[0] ?? '',
            inicio: partesInicio[1]?.substring(0, 5) ?? '',
            fim: partesFim?.[1]?.substring(0, 5) ?? '',
            terminaNoDiaSeguinte: false
          };
        })
      : (evento.datas ?? []).map(data => {
          const dataHora = typeof data === 'string'
            ? data
            : data.dataHora;

          const partes = dataHora.split('T');

          return {
            data: partes[0] ?? '',
            inicio: partes[1]?.substring(0, 5) ?? '',
            fim: '',
            terminaNoDiaSeguinte: false
          };
        });

    const tipoLocal = evento.endereco
     ? 'presencial'
     : evento.linkTransmissao || (preco === 0 && evento.link)
       ? 'online'
       : '';

    return {
      ...dadosVazios,

      nome: evento.titulo ?? '',
      categoria: evento.categoria ?? '',
      classificacao: evento.classificacao ?? '',
      descricao: evento.descricao ?? '',

      imagemSelecionada: !!imagem,
      imagemPreview: imagem,
      nomeImagem: imagem.split('/').pop() ?? '',
      arquivoImagem: null,

      datas: datas.length ? datas : dadosVazios.datas,

      tipoLocal,

      endereco: evento.endereco ?? '',
      numero: '',
      complemento: '',
      cidade: evento.cidade ?? '',
      estado: evento.uf ?? '',

      link: evento.linkTransmissao ??
        (tipoLocal === 'online' ? evento.link ?? '' : ''),

      tipoIngresso: preco > 0 ? 'pago' : 'gratuito',

      preco: preco > 0
        ? preco.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })
        : '',

      linkIngresso: evento.link ?? '',

      atracoes: (evento.artistas ?? []).map(nome => ({
        nome
      })),

      recursos: evento.comodidades ?? [],

      informacoes: '',
      pergunta: '',
      resposta: ''
    };
  }

  receberDados(dados: Partial<DadosEvento>): void {
    this.dadosEvento = {
      ...this.dadosEvento,
      ...dados
    };

    this.avancarEtapa();
  }

  editarEtapa(etapa: number): void {
    if (
      this.publicando ||
      this.carregandoEvento ||
      etapa < 1 ||
      etapa > 3
    ) {
      return;
    }

    this.etapaAtual = etapa;
    this.irParaTopo();
  }

  avancarEtapa(): void {
    if (
      this.etapaAtual >= 4 ||
      this.carregandoEvento
    ) {
      return;
    }

    this.etapaAtual++;
    this.irParaTopo();
  }

  voltarEtapa(): void {
    if (
      this.publicando ||
      this.carregandoEvento ||
      this.etapaAtual <= 1
    ) {
      return;
    }

    this.etapaAtual--;
    this.irParaTopo();
  }

  publicarEvento(): void {
    if (this.publicando || this.carregandoEvento) {
      return;
    }

    if (this.modoEdicao) {
      this.atualizarEvento();
      return;
    }

    const empresaId = this.authService.getEmpresaId();

    if (!empresaId) {
      alert(
        'Não foi possível identificar a empresa do organizador.'
      );

      return;
    }

    this.publicando = true;

    this.enviarImagem()
      .pipe(
        switchMap(urlImagem =>
          this.eventoService.publicarEvento(
            empresaId,
            this.montarEventoRequest(urlImagem)
          )
        ),

        switchMap(evento =>
          forkJoin({
            datas: this.salvarDatas(evento.id),
            localizacao: this.salvarLocalizacao(evento.id),
            artistas: this.salvarArtistas(evento.id)
          }).pipe(
            switchMap(resultado =>
              this.salvarCategoriaTemporaria(
                evento.id,
                resultado.artistas
              )
            ),

            map(() => evento),

            catchError(erro =>
              this.desfazerPublicacao(evento.id, erro)
            )
          )
        )
      )
      .subscribe({
        next: evento => {
          this.publicando = false;

          this.router.navigate(
            ['/perfil-organizador'],
            {
              state: {
                mensagem:
                  `Evento "${evento.titulo}" publicado com sucesso.`
              }
            }
          );
        },

        error: erro => {
          this.publicando = false;

          console.error('Erro ao publicar evento:', erro);

          alert(
            erro.error?.erro ??
            erro.error?.mensagem ??
            erro.message ??
            'Não foi possível publicar o evento.'
          );
        }
      });
  }

  private atualizarEvento(): void {
    if (!this.eventoId) {
      return;
    }

    this.publicando = true;

    const eventoId = this.eventoId;

    this.enviarImagem()
      .pipe(
        switchMap(urlImagem =>
          this.eventoService.atualizarEvento(
            eventoId,
            this.montarEventoRequest(urlImagem)
          )
        ),

        switchMap(evento =>
          forkJoin({
            datas: this.sincronizarDatas(eventoId),
            localizacao: this.sincronizarLocalizacao(eventoId),
            artistas: this.sincronizarArtistasECategoria(eventoId)
          }).pipe(
            map(() => evento)
          )
        )
      )
      .subscribe({
        next: evento => {
          this.publicando = false;

          this.router.navigate(
            ['/perfil-organizador'],
            {
              state: {
                mensagem:
                  `Evento "${evento.titulo}" atualizado com sucesso.`
              }
            }
          );
        },

        error: erro => {
          this.publicando = false;

          console.error('Erro ao atualizar evento:', erro);

          alert(
            erro.error?.erro ??
            erro.error?.mensagem ??
            erro.message ??
            'Não foi possível atualizar o evento.'
          );
        }
      });
  }

  private enviarImagem(): Observable<string> {
    const arquivo = this.dadosEvento.arquivoImagem;

    if (!arquivo) {
      return of(
        this.modoEdicao
          ? this.dadosEvento.imagemPreview
          : ''
      );
    }

    return this.eventoService
      .uploadImagem(arquivo)
      .pipe(
        map(resposta => {
          if (!resposta.url) {
            throw new Error(
              'A API não retornou a URL da imagem.'
            );
          }

          return resposta.url;
        })
      );
  }

  // --------------------------------------------------
  // DATAS
  // --------------------------------------------------

  private salvarDatas(
    eventoId: number
  ): Observable<unknown> {
    const requests = this.montarDatasRequest();

    if (!requests.length) {
      return of(null);
    }

    return forkJoin(
      requests.map(request =>
        this.eventoService.adicionarData(
          eventoId,
          request
        )
      )
    );
  }

  private sincronizarDatas(
    eventoId: number
  ): Observable<unknown> {
    const requests = this.montarDatasRequest();

    return this.eventoService
      .listarDatasEvento(eventoId)
      .pipe(
        switchMap(datasExistentes => {
          const operacoes: Observable<unknown>[] = [];

          requests.forEach((request, index) => {
            const dataExistente = datasExistentes[index];

            if (dataExistente) {
              operacoes.push(
                this.eventoService.atualizarData(
                  dataExistente.id,
                  request
                )
              );
            } else {
              operacoes.push(
                this.eventoService.adicionarData(
                  eventoId,
                  request
                )
              );
            }
          });

          datasExistentes
            .slice(requests.length)
            .forEach(data => {
              operacoes.push(
                this.eventoService.removerData(data.id)
              );
            });

          return this.executarOperacoes(operacoes);
        })
      );
  }

  private montarDatasRequest(): DataEventoRequest[] {
    return this.dadosEvento.datas
      .filter(data => data.data && data.inicio)
      .map(data => ({
        dataHora: `${data.data}T${data.inicio}:00`
      }));
  }

  // --------------------------------------------------
  // LOCALIZAÇÃO
  // --------------------------------------------------

  private salvarLocalizacao(
    eventoId: number
  ): Observable<unknown> {
    if (this.dadosEvento.tipoLocal !== 'presencial') {
      return of(null);
    }

    return this.eventoService
      .adicionarLocalizacao(
        this.montarLocalizacaoRequest(eventoId)
      );
  }

  private sincronizarLocalizacao(
    eventoId: number
  ): Observable<unknown> {
    return this.eventoService
      .listarLocalizacoes()
      .pipe(
        switchMap(localizacoes => {
          const existentes = localizacoes.filter(
            localizacao =>
              localizacao.evento?.id === eventoId
          );

          if (this.dadosEvento.tipoLocal !== 'presencial') {
            const operacoes = existentes.map(localizacao =>
              this.eventoService.removerLocalizacao(
                localizacao.id
              )
            );

            return this.executarOperacoes(operacoes);
          }

          const request =
            this.montarLocalizacaoRequest(eventoId);

          if (!existentes.length) {
            return this.eventoService
              .adicionarLocalizacao(request);
          }

          const [principal, ...duplicadas] = existentes;

          const operacoes: Observable<unknown>[] = [
            this.eventoService.atualizarLocalizacao(
              principal.id,
              request
            )
          ];

          duplicadas.forEach(localizacao => {
            operacoes.push(
              this.eventoService.removerLocalizacao(
                localizacao.id
              )
            );
          });

          return this.executarOperacoes(operacoes);
        })
      );
  }

  private montarLocalizacaoRequest(
    eventoId: number
  ): LocalizacaoRequest {
    return {
      eventoId,

      latitude: null,
      longitude: null,

      endereco: [
        this.dadosEvento.endereco,
        this.dadosEvento.numero,
        this.dadosEvento.complemento
      ]
        .map(valor => valor.trim())
        .filter(Boolean)
        .join(', '),

      uf: this.dadosEvento.estado.trim(),

      cep: '',

      cidade: this.dadosEvento.cidade.trim(),

      nomeEstabelecimento: ''
    };
  }

  // --------------------------------------------------
  // ARTISTAS E CATEGORIA
  // --------------------------------------------------

  private salvarArtistas(
    eventoId: number
  ): Observable<ArtistaResponse[]> {
    const atracoes = this.obterAtracoes();

    if (!atracoes.length) {
      return of([]);
    }

    return this.eventoService
      .listarArtistas()
      .pipe(
        switchMap(artistas =>
          forkJoin(
            atracoes.map(atracao =>
              this.obterArtista(atracao, artistas)
            )
          )
        ),

        switchMap(artistas =>
          this.executarOperacoes(
            artistas.map(artista =>
              this.eventoService.vincularArtista(
                eventoId,
                artista.id
              )
            )
          ).pipe(
            map(() => artistas)
          )
        )
      );
  }

  private sincronizarArtistasECategoria(
    eventoId: number
  ): Observable<unknown> {
    const atracoes = this.obterAtracoes();

    return forkJoin({
      artistasDisponiveis:
        this.eventoService.listarArtistas(),

      categorias:
        this.eventoService.listarCategorias()
    }).pipe(
      switchMap(({ artistasDisponiveis, categorias }) =>
        this.resolverAtracoes(
          atracoes,
          artistasDisponiveis
        ).pipe(
          switchMap(artistasResolvidos =>
            this.sincronizarCategoria(
              eventoId,
              artistasResolvidos,
              categorias
            ).pipe(
              switchMap(() =>
                this.sincronizarVinculosArtistas(
                  eventoId,
                  artistasDisponiveis,
                  artistasResolvidos
                )
              )
            )
          )
        )
      )
    );
  }

  private obterAtracoes(): Atracao[] {
    const nomes = this.dadosEvento.atracoes
      .map(atracao => atracao.nome.trim())
      .filter(Boolean);

    const nomesUnicos = [
      ...new Set(
        nomes.map(nome => nome.toLowerCase())
      )
    ];

    return nomesUnicos.map(nomeNormalizado => ({
      nome: nomes.find(
        nome => nome.toLowerCase() === nomeNormalizado
      ) ?? ''
    }));
  }

  private resolverAtracoes(
    atracoes: Atracao[],
    artistasDisponiveis: ArtistaResponse[]
  ): Observable<ArtistaResponse[]> {
    return atracoes.reduce(
      (resultado$, atracao) =>
        resultado$.pipe(
          switchMap(artistasResolvidos =>
            this.obterArtista(
              atracao,
              [...artistasDisponiveis, ...artistasResolvidos]
            ).pipe(
              map(artista => [
                ...artistasResolvidos,
                artista
              ])
            )
          )
        ),
      of([] as ArtistaResponse[])
    );
  }

  private obterArtista(
    atracao: Atracao,
    artistas: ArtistaResponse[]
  ): Observable<ArtistaResponse> {
    const nome = atracao.nome.trim();

    const existente = artistas.find(
      artista =>
        artista.nome.trim().toLowerCase() ===
        nome.toLowerCase()
    );

    if (existente) {
      return of(existente);
    }

    return this.eventoService.cadastrarArtista({
      nome,
      obras: '',
      foto: ''
    });
  }

  private sincronizarCategoria(
    eventoId: number,
    artistas: ArtistaResponse[],
    categorias: CategoriaResponse[]
  ): Observable<unknown> {
    const categoriasEvento = categorias.filter(
      categoria =>
        categoria.evento?.id === eventoId
    );

    const tipo = this.dadosEvento.categoria.trim();

    if (!tipo || !artistas.length) {
      const operacoes = categoriasEvento.map(categoria =>
        this.eventoService.removerCategoria(
          categoria.id
        )
      );

      return this.executarOperacoes(operacoes);
    }

    const request: CategoriaRequest = {
      eventoId,
      artistaId: artistas[0].id,
      tipo,
      estilo: '',
      foto: ''
    };

    const [categoriaPrincipal, ...duplicadas] =
      categoriasEvento;

    const operacoes: Observable<unknown>[] = [];

    if (categoriaPrincipal) {
      operacoes.push(
        this.eventoService.atualizarCategoria(
          categoriaPrincipal.id,
          request
        )
      );
    } else {
      operacoes.push(
        this.eventoService.adicionarCategoria(request)
      );
    }

    duplicadas.forEach(categoria => {
      operacoes.push(
        this.eventoService.removerCategoria(
          categoria.id
        )
      );
    });

    return this.executarOperacoes(operacoes);
  }

  private sincronizarVinculosArtistas(
    eventoId: number,
    artistasDisponiveis: ArtistaResponse[],
    artistasDesejados: ArtistaResponse[]
  ): Observable<unknown> {
    const nomesOriginais = this.artistasOriginais.map(
      nome => nome.trim().toLowerCase()
    );

    const nomesDesejados = artistasDesejados.map(
      artista => artista.nome.trim().toLowerCase()
    );

    const operacoes: Observable<unknown>[] = [];

    // Vincula somente as atrações novas.
    artistasDesejados.forEach(artista => {
      const nome = artista.nome.trim().toLowerCase();

      if (!nomesOriginais.includes(nome)) {
        operacoes.push(
          this.eventoService.vincularArtista(
            eventoId,
            artista.id
          )
        );
      }
    });

    // Desvincula as atrações que foram removidas.
    this.artistasOriginais.forEach(nomeOriginal => {
      const nome = nomeOriginal.trim().toLowerCase();

      if (nomesDesejados.includes(nome)) {
        return;
      }

      const artista = artistasDisponiveis.find(
        item =>
          item.nome.trim().toLowerCase() === nome
      );

      if (artista) {
        operacoes.push(
          this.eventoService.desvincularArtista(
            eventoId,
            artista.id
          )
        );
      }
    });

    return this.executarOperacoes(operacoes);
  }

  private salvarCategoriaTemporaria(
    eventoId: number,
    artistas: ArtistaResponse[]
  ): Observable<unknown> {
    const tipo = this.dadosEvento.categoria.trim();

    if (!tipo || !artistas.length) {
      return of(null);
    }

    const request: CategoriaRequest = {
      eventoId,
      artistaId: artistas[0].id,
      tipo,
      estilo: '',
      foto: ''
    };

    return this.eventoService
      .adicionarCategoria(request);
  }

  // --------------------------------------------------
  // OPERAÇÕES AUXILIARES
  // --------------------------------------------------

  private executarOperacoes(
    operacoes: Observable<unknown>[]
  ): Observable<unknown[]> {
    return operacoes.length
      ? forkJoin(operacoes)
      : of([]);
  }

  private desfazerPublicacao(
    eventoId: number,
    erro: unknown
  ): Observable<never> {
    return this.eventoService
      .removerEvento(eventoId)
      .pipe(
        catchError(() => of(null)),

        switchMap(() =>
          throwError(() => erro)
        )
      );
  }

  private montarEventoRequest(
    urlImagem: string
  ): EventoRequest {
    return {
      titulo: this.dadosEvento.nome.trim(),

      status: this.statusEvento,

      classificacao:
        this.dadosEvento.classificacao.trim(),

      banner: urlImagem,

      capa: urlImagem,

      descricao:
        this.dadosEvento.descricao.trim(),

      preco: this.obterPreco(),

      link: this.obterLink()
    };
  }

  private obterPreco(): number {
    if (
      this.dadosEvento.tipoIngresso !== 'pago' ||
      !this.dadosEvento.preco.trim()
    ) {
      return 0;
    }

    const valor = this.dadosEvento.preco
      .replace('R$', '')
      .replace(/\s/g, '')
      .replace(/\./g, '')
      .replace(',', '.');

    const preco = Number(valor);

    return Number.isFinite(preco)
      ? preco
      : 0;
  }

  private obterLink(): string {
    if (this.dadosEvento.tipoIngresso === 'pago') {
      return this.dadosEvento.linkIngresso.trim();
    }

    if (this.dadosEvento.tipoLocal === 'online') {
      return this.dadosEvento.link.trim();
    }

    return '';
  }


  private irParaTopo(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}
