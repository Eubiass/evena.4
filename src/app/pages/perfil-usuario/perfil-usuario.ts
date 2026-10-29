
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

import { API_URL } from '../../config/api.config';
import { AuthService, PerfilResponse } from '../../services/auth.service';
import {
  EventoFavorito,
  FavoritosService
} from '../../services/favoritos.service';
import { Footer } from '../../shared/components/footer/footer';
import { Header } from '../../shared/components/header/header';
import {
  AbaPerfil,
  EventoPerfil
} from './models/evento-perfil.model';
import { HeaderPerfilUsuario } from './components/header-perfil-usuario/header-perfil-usuario';
import { EventosFavoritos } from './components/eventos-favoritados/eventos-favoritos';
import { HistoricoEventos } from './components/historico-eventos/historico-eventos';
 
@Component({
  selector: 'app-perfil-usuario',
  standalone: true,
  imports: [
    Header,
    Footer,
    HeaderPerfilUsuario,
    EventosFavoritos,
    HistoricoEventos
  ],
  templateUrl: './perfil-usuario.html',
  styleUrl: './perfil-usuario.css'
})
export class PerfilUsuario implements OnInit {
  abaAtiva: AbaPerfil = 'visao-geral';

  carregandoPerfil = true;
  carregandoFavoritos = true;

  erroPerfil = '';
  erroFavoritos = '';

  usuario: PerfilResponse | null = null;
  favoritos: EventoPerfil[] = [];
  historico: EventoPerfil[] = [];

  private readonly apiBaseUrl = API_URL.replace(/\/api\/?$/, '');

  constructor(
    private readonly authService: AuthService,
    private readonly http: HttpClient,
    private readonly router: Router,
    private readonly favoritosService: FavoritosService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const sessao = this.authService.getSessaoUsuario();

    if (!sessao?.id) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: '/perfil-usuario' }
      });
      return;
    }

    this.carregarPerfil(sessao.id);
    this.carregarFavoritos(sessao.id);
  }

  get nomeUsuario(): string {
    return this.usuario?.nome || 'Usuário';
  }

  get arrobaUsuario(): string {
    return this.usuario?.email?.split('@')[0] || 'usuario';
  }

  get descricaoUsuario(): string {
    return this.usuario?.descricao || 'Conte um pouco sobre você.';
  }

  get fotoUsuario(): string {
    return this.usuario?.foto?.trim() || '';
  }

  get inicialUsuario(): string {
    return this.nomeUsuario.trim().charAt(0).toLocaleUpperCase('pt-BR') || 'U';
  }

  get bannerUsuario(): string {
    return this.usuario?.banner || '';
  }

  get membroDesde(): string {
    const valor = this.usuario?.dataCriacao;

    if (!valor) {
      return 'Data não disponível';
    }

    const data = new Date(valor);

    if (Number.isNaN(data.getTime())) {
      return 'Data não disponível';
    }

    return data.toLocaleDateString('pt-BR', {
      month: 'long',
      year: 'numeric'
    });
  }

  selecionarAba(aba: AbaPerfil): void {
    this.abaAtiva = aba;
  }

  removerFavorito(evento: EventoPerfil, clique: Event): void {
    clique.preventDefault();
    clique.stopPropagation();

    const sessao = this.authService.getSessaoUsuario();
    const perfilId = Number(sessao?.id);

    if (!sessao || !Number.isInteger(perfilId) || perfilId <= 0) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: '/perfil-usuario' }
      });
      return;
    }

    const favoritosAnteriores = [...this.favoritos];

    this.favoritos = this.favoritos.filter(
      favorito => favorito.id !== evento.id
    );

    this.favoritosService
      .definirFavorito(perfilId, evento.id, false)
      .subscribe({
        error: erro => {
          console.error('Erro ao remover evento dos favoritos:', erro);

          this.favoritos = favoritosAnteriores;
          this.cdr.markForCheck();

          alert(
            erro?.name === 'TimeoutError'
              ? 'A solicitação demorou demais. Verifique sua conexão e tente novamente.'
              : erro?.error?.mensagem ||
                'Não foi possível remover este evento dos favoritos. Tente novamente.'
          );
        }
      });
  }

  tratarErroImagem(evento: EventoPerfil): void {
    evento.imagem = '';
    this.cdr.markForCheck();
  }

  abrirEvento(evento: EventoPerfil): void {
    this.router.navigate([
      '/detalhes-evento',
      this.criarSlug(evento.titulo)
    ]);
  }

  sair(event: Event): void {
    event.preventDefault();

    this.authService.logoutUsuario();
    this.favoritosService.limparEstado();

    this.router.navigate(['/login']);
  }

  private carregarPerfil(id: number): void {
    this.carregandoPerfil = true;
    this.erroPerfil = '';

    this.http
      .get<PerfilResponse>(`${API_URL}/perfis/${id}`)
      .pipe(
        finalize(() => {
          this.carregandoPerfil = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: perfil => {
          this.usuario = perfil;
          this.cdr.markForCheck();
        },
        error: erro => {
          this.erroPerfil =
            erro?.error?.mensagem ||
            'Não foi possível carregar os dados do perfil.';

          this.cdr.markForCheck();
        }
      });
  }

  private carregarFavoritos(perfilId: number): void {
    this.carregandoFavoritos = true;
    this.erroFavoritos = '';

    this.favoritosService
      .carregarFavoritos(perfilId)
      .pipe(
        finalize(() => {
          this.carregandoFavoritos = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: eventos => {
          this.favoritos = (eventos ?? []).map(evento =>
            this.converterEvento(evento)
          );
        
          console.log(
            'Imagens dos favoritos:',
            this.favoritos.map(evento => ({
              titulo: evento.titulo,
              imagem: evento.imagem
            }))
          );
        
          this.cdr.markForCheck();
        },
        error: erro => {
          console.error('Erro ao carregar favoritos:', erro);

          this.favoritos = [];
          this.erroFavoritos =
            erro?.error?.mensagem ||
            'Não foi possível carregar seus favoritos.';

          this.cdr.markForCheck();
        }
      });
  }

  private converterEvento(evento: EventoFavorito): EventoPerfil {
    const primeiraData = evento.datas?.[0] || '';
    const local = [evento.cidade, evento.uf].filter(Boolean).join(', ');
    const imagem = evento.imagem || evento.capa || evento.banner || '';

    return {
      id: evento.id,
      titulo: evento.titulo || 'Evento sem título',
      categoria: evento.categoria || 'Evento',
      local: local || evento.local || 'Local não informado',
      horario: primeiraData ? this.formatarHorario(primeiraData) : '',
      data: this.formatarData(primeiraData),
      imagem: this.normalizarImagem(imagem),
      organizador: evento.empresaNome || 'Organizador'
    };
  }
  
  private normalizarImagem(imagem?: string | null): string {
    const valor = imagem?.trim();
    
    if (!valor) return '';
    
    // URLs completas ou imagens em formato de dados
    if (/^(https?:\/\/|data:|blob:)/i.test(valor)) {
      return valor;
    }
  
    // Mockups armazenados diretamente em public/
    if (/^\/?assets\/images\//i.test(valor)) {
      const nomeArquivo = valor.split('/').pop();
      return nomeArquivo ? `/${nomeArquivo}` : '';
    }
  
    // Caminhos de imagens hospedadas pela API
    if (/^\/?(uploads|images|imagens)\//i.test(valor)) {
      const caminho = valor.startsWith('/') ? valor : `/${valor}`;
      return `${this.apiBaseUrl}${caminho}`;
    }
  
    return valor.startsWith('/') ? valor : `/${valor}`;
  }

  private formatarData(valor: string): string {
    if (!valor) {
      return 'Data não informada';
    }

    const data = new Date(valor);

    if (Number.isNaN(data.getTime())) {
      return 'Data não informada';
    }

    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  private formatarHorario(valor: string): string {
    const data = new Date(valor);

    if (Number.isNaN(data.getTime())) {
      return '';
    }

    return data.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  private criarSlug(texto: string): string {
    return texto
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }
}
