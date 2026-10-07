import { Component } from '@angular/core';
import { Router } from '@angular/router';

import {
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
  DataEventoRequest,
  EventoRequest,
  EventoService,
  LocalizacaoRequest
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
export class CriarEvento {
  etapaAtual = 1;

  dadosEvento =
    criarDadosEventoVazio();

  publicando = false;

  constructor(
    private authService: AuthService,
    private eventoService: EventoService,
    private router: Router
  ) {}

  receberDados(
    dados: Partial<DadosEvento>
  ): void {
    this.dadosEvento = {
      ...this.dadosEvento,
      ...dados
    };

    this.avancarEtapa();
  }

  editarEtapa(
    etapa: number
  ): void {
    if (
      this.publicando ||
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
      this.etapaAtual >= 4
    ) {
      return;
    }

    this.etapaAtual++;
    this.irParaTopo();
  }

  voltarEtapa(): void {
    if (
      this.publicando ||
      this.etapaAtual <= 1
    ) {
      return;
    }

    this.etapaAtual--;
    this.irParaTopo();
  }

  publicarEvento(): void {
  if (this.publicando) {
    return;
  }

  const empresaId =
    this.authService.getEmpresaId();

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
        this.eventoService
          .publicarEvento(
            empresaId,
            this.montarEventoRequest(
              urlImagem
            )
          )
      ),

      switchMap(evento =>
        forkJoin({
          datas:
            this.salvarDatas(
              evento.id
            ),

          localizacao:
            this.salvarLocalizacao(
              evento.id
            ),

          artistas:
            this.salvarArtistas(
              evento.id
            )
        }).pipe(
          switchMap(resultado =>
            this.salvarCategoriaTemporaria(
              evento.id,
              resultado.artistas
            )
          ),

          map(() => evento),

          catchError(erro =>
            this.desfazerPublicacao(
              evento.id,
              erro
            )
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

        console.error(
          'Erro ao publicar evento:',
          erro
        );

        alert(
          erro.error?.erro ??
          erro.error?.mensagem ??
          erro.message ??
          'Não foi possível publicar o evento.'
        );
      }
    });
}

private enviarImagem():
  Observable<string> {
  const arquivo =
    this.dadosEvento
      .arquivoImagem;

  if (!arquivo) {
    return of('');
  }

  return this.eventoService
    .uploadImagem(
      arquivo
    )
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

  private salvarDatas(
    eventoId: number
  ): Observable<unknown> {
    const requests =
      this.montarDatasRequest();

    if (!requests.length) {
      return of(null);
    }

    return forkJoin(
      requests.map(request =>
        this.eventoService
          .adicionarData(
            eventoId,
            request
          )
      )
    );
  }

  private salvarLocalizacao(
    eventoId: number
  ): Observable<unknown> {
    if (
      this.dadosEvento.tipoLocal ===
      'online'
    ) {
      return of(null);
    }

    return this.eventoService
      .adicionarLocalizacao(
        this.montarLocalizacaoRequest(
          eventoId
        )
      );
  }

  private salvarArtistas(
    eventoId: number
  ): Observable<ArtistaResponse[]> {
    const atracoes =
      this.dadosEvento
        .atracoes
        .filter(
          atracao =>
            atracao.nome.trim()
        );

    if (!atracoes.length) {
      return of([]);
    }

    return this.eventoService
      .listarArtistas()
      .pipe(
        switchMap(artistas =>
          forkJoin(
            atracoes.map(
              atracao =>
                this.obterArtista(
                  atracao,
                  artistas
                )
            )
          )
        ),

        switchMap(artistas =>
          forkJoin(
            artistas.map(
              artista =>
                this.eventoService
                  .vincularArtista(
                    eventoId,
                    artista.id
                  )
                  .pipe(
                    map(
                      () =>
                        artista
                    )
                  )
            )
          )
        )
      );
  }

  private obterArtista(
    atracao: Atracao,
    artistas: ArtistaResponse[]
  ): Observable<ArtistaResponse> {
    const nome =
      atracao.nome.trim();

    const existente =
      artistas.find(
        artista =>
          artista.nome
            .trim()
            .toLowerCase() ===
          nome.toLowerCase()
      );

    if (existente) {
      return of(existente);
    }

    return this.eventoService
      .cadastrarArtista({
        nome,
        obras: '',
        foto: ''
      });
  }

  private salvarCategoriaTemporaria(
    eventoId: number,
    artistas: ArtistaResponse[]
  ): Observable<unknown> {
    const tipo =
      this.dadosEvento
        .categoria
        .trim();

    if (
      !tipo ||
      !artistas.length
    ) {
      return of(null);
    }

    const request:
      CategoriaRequest = {
        eventoId,

        artistaId:
          artistas[0].id,

        tipo,

        estilo: '',

        foto: ''
      };

    return this.eventoService
      .adicionarCategoria(
        request
      );
  }

  private desfazerPublicacao(
    eventoId: number,
    erro: unknown
  ): Observable<never> {
    return this.eventoService
      .removerEvento(
        eventoId
      )
      .pipe(
        catchError(
          () =>
            of(null)
        ),

        switchMap(
          () =>
            throwError(
              () => erro
            )
        )
      );
  }

  private montarEventoRequest(
  urlImagem: string
): EventoRequest {
  return {
    titulo:
      this.dadosEvento
        .nome
        .trim(),

    status: true,

    classificacao:
      this.dadosEvento
        .classificacao
        .trim(),

    banner:
      urlImagem,

    capa:
      urlImagem,

    descricao:
      this.dadosEvento
        .descricao
        .trim(),

    preco:
      this.obterPreco(),

    link:
      this.obterLink()
  };
}

  private montarDatasRequest():
    DataEventoRequest[] {
    return this.dadosEvento
      .datas
      .filter(
        data =>
          data.data &&
          data.inicio
      )
      .map(
        data => ({
          dataHora:
            `${data.data}T${data.inicio}:00`
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
        .map(
          valor =>
            valor.trim()
        )
        .filter(Boolean)
        .join(', '),

      uf:
        this.dadosEvento
          .estado
          .trim(),

      cep: '',

      cidade:
        this.dadosEvento
          .cidade
          .trim(),

      nomeEstabelecimento: ''
    };
  }

  private obterPreco(): number {
    if (
      this.dadosEvento
        .tipoIngresso !==
        'pago' ||
      !this.dadosEvento
        .preco
        .trim()
    ) {
      return 0;
    }

    const valor =
      this.dadosEvento
        .preco
        .replace(
          'R$',
          ''
        )
        .replace(
          /\s/g,
          ''
        )
        .replace(
          /\./g,
          ''
        )
        .replace(
          ',',
          '.'
        );

    const preco =
      Number(valor);

    return Number.isFinite(
      preco
    )
      ? preco
      : 0;
  }

  private obterLink(): string {
    if (
      this.dadosEvento
        .tipoIngresso ===
      'pago'
    ) {
      return this.dadosEvento
        .linkIngresso
        .trim();
    }

    if (
      this.dadosEvento
        .tipoLocal ===
      'online'
    ) {
      return this.dadosEvento
        .link
        .trim();
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