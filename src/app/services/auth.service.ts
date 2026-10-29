
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, switchMap, tap } from 'rxjs';
import { API_URL } from '../config/api.config';

export interface PerfilResponse {
  id: number;
  nome: string;
  email: string;
  telefone?: string;
  dataCriacao?: string;
  foto?: string;
  banner?: string;
  descricao?: string;
  site?: string;
}

export interface EmpresaResponse {
  id: number;
  cnpj?: string;
  nome: string;
  endereco?: string;
  setor?: string;
  perfil?: PerfilResponse;
}

export interface SessaoOrganizador {
  perfil: PerfilResponse;
  empresa: EmpresaResponse;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly perfilUrl = `${API_URL}/perfis`;
  private readonly empresaUrl = `${API_URL}/empresas`;

  private readonly chaveSessaoUsuario = 'evena_sessao_usuario';
  private readonly chaveSessaoOrganizador = 'evena_sessao';

  constructor(private http: HttpClient) {}

  // FREQUENTADOR

  cadastrarUsuario(dados: {
    nome: string;
    email: string;
    senha: string;
  }): Observable<PerfilResponse> {
    return this.http
      .post<PerfilResponse>(`${this.perfilUrl}/cadastrar`, {
        nome: dados.nome.trim(),
        email: dados.email.trim().toLowerCase(),
        senha: dados.senha
      })
      .pipe(
        tap(perfil => this.salvarSessaoUsuario(perfil))
      );
  }

  loginUsuario(email: string, senha: string): Observable<PerfilResponse> {
    return this.http
      .post<PerfilResponse>(`${this.perfilUrl}/autenticar`, {
        email: email.trim().toLowerCase(),
        senha
      })
      .pipe(
        tap(perfil => this.salvarSessaoUsuario(perfil))
      );
  }

  getSessaoUsuario(): PerfilResponse | null {
    return this.lerSessao<PerfilResponse>(this.chaveSessaoUsuario);
  }

  private salvarSessaoUsuario(perfil: PerfilResponse): void {
    localStorage.setItem(
      this.chaveSessaoUsuario,
      JSON.stringify(perfil)
    );
  }

  // ORGANIZADOR

  cadastrarOrganizador(dados: any): Observable<SessaoOrganizador> {
    const perfilRequest = {
      nome: dados.nomeFantasia || dados.razaoSocial,
      email: dados.emailEmpresa,
      senha: dados.senhaOrganizador
    };

    return this.http
      .post<PerfilResponse>(`${this.perfilUrl}/cadastrar`, perfilRequest)
      .pipe(
        switchMap(perfil => {
          const empresaRequest = {
            perfilId: perfil.id,
            cnpj: dados.cnpj,
            nome: dados.nomeFantasia || dados.razaoSocial,
            endereco: this.montarEndereco(dados),
            setor: dados.ramoEmpresa
          };

          return this.http
            .post<EmpresaResponse>(this.empresaUrl, empresaRequest)
            .pipe(
              map(empresa => ({ perfil, empresa })),
              tap(sessao => this.salvarSessaoOrganizador(sessao))
            );
        })
      );
  }

  login(email: string, senha: string): Observable<SessaoOrganizador> {
    return this.http
      .post<PerfilResponse>(`${this.perfilUrl}/autenticar`, {
        email: email.trim().toLowerCase(),
        senha
      })
      .pipe(
        switchMap(perfil =>
          this.http.get<EmpresaResponse[]>(this.empresaUrl).pipe(
            map(empresas => {
              const empresa = empresas.find(
                item => item.perfil?.id === perfil.id
              );

              if (!empresa) {
                throw new Error(
                  'Empresa não encontrada para o organizador.'
                );
              }

              return { perfil, empresa };
            }),
            tap(sessao => this.salvarSessaoOrganizador(sessao))
          )
        )
      );
  }

  getSessao(): SessaoOrganizador | null {
    return this.lerSessao<SessaoOrganizador>(
      this.chaveSessaoOrganizador
    );
  }

  getEmpresaId(): number | null {
    return this.getSessao()?.empresa?.id ?? null;
  }

  getPerfilId(): number | null {
    return this.getSessao()?.perfil?.id ?? null;
  }

  logout(): void {
    localStorage.removeItem(this.chaveSessaoOrganizador);
    localStorage.removeItem(this.chaveSessaoUsuario);
  }

  logoutUsuario(): void {
    localStorage.removeItem(this.chaveSessaoUsuario);
  }

  private salvarSessaoOrganizador(sessao: SessaoOrganizador): void {
    localStorage.setItem(
      this.chaveSessaoOrganizador,
      JSON.stringify(sessao)
    );
  }

  private lerSessao<T>(chave: string): T | null {
    try {
      const valor = localStorage.getItem(chave);
      return valor ? JSON.parse(valor) as T : null;
    } catch {
      localStorage.removeItem(chave);
      return null;
    }
  }

  private montarEndereco(dados: any): string {
    return [
      dados.endereco,
      dados.numero,
      dados.complemento,
      dados.bairro,
      dados.cidade,
      dados.estado,
      dados.cep
    ].filter(Boolean).join(', ');
  }
}
