
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs';
import { Header } from '../../shared/components/header/header';
import { Footer } from '../../shared/components/footer/footer';
import { AuthService, PerfilResponse } from '../../services/auth.service';
import { API_URL } from '../../config/api.config';

type AbaPerfil =
  | 'visao-geral'
  | 'favoritos'
  | 'historico'
  | 'configuracoes';

interface EventoApi {
  id: number;
  titulo: string;
  status?: boolean;
  classificacao?: string;
  banner?: string;
  capa?: string;
  descricao?: string;
  preco?: number;
  empresaNome?: string;
  datas?: string[];
  categoria?: string;
  local?: string;
  cidade?: string;
  uf?: string;
}

interface EventoPerfil {
  id: number;
  titulo: string;
  categoria: string;
  local: string;
  horario?: string;
  data: string;
  imagem: string;
  organizador?: string;
}

@Component({
  selector: 'app-perfil-usuario',
  standalone: true,
  imports: [RouterLink, Header, Footer],
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

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private router: Router
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
    return this.usuario?.foto || '/usuario.jpg';
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

  abrirEvento(evento: EventoPerfil): void {
    const slug = evento.titulo
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    this.router.navigate(['/detalhes-evento', slug]);
  }

  sair(event: Event): void {
    event.preventDefault();
    this.authService.logoutUsuario();
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
        })
      )
      .subscribe({
        next: perfil => {
          this.usuario = perfil;
        },
        error: erro => {
          this.erroPerfil =
            erro?.error?.mensagem ||
            'Não foi possível carregar os dados do perfil.';
        }
      });
  }
  
  private carregarFavoritos(perfilId: number): void {
  this.carregandoFavoritos = true;
  this.erroFavoritos = '';

  this.http
    .get<EventoApi[]>(`${API_URL}/perfis/${perfilId}/favoritos`)
    .pipe(
      finalize(() => {
        this.carregandoFavoritos = false;
      })
    )
    .subscribe({
      next: eventos => {
        this.favoritos = (eventos ?? []).map(evento =>
          this.converterEvento(evento)
        );
      },
      error: erro => {
        this.favoritos = [];
        this.erroFavoritos =
          erro?.error?.mensagem ||
          'Não foi possível carregar seus favoritos.';
      }
    });
  }

  private converterEvento(evento: EventoApi): EventoPerfil {
    const primeiraData = evento.datas?.[0] || '';
    const local = [evento.cidade, evento.uf]
      .filter(Boolean)
      .join(', ');

    return {
      id: evento.id,
      titulo: evento.titulo || 'Evento sem título',
      categoria: evento.categoria || 'Evento',
      local: local || evento.local || 'Local não informado',
      horario: primeiraData
        ? this.formatarHorario(primeiraData)
        : '',
      data: this.formatarData(primeiraData),
      imagem: evento.capa || evento.banner || '/evento1.jpg',
      organizador: evento.empresaNome || 'Organizador'
    };
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
}