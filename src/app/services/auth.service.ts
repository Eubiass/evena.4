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

  constructor(private http: HttpClient) {}

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
              tap(empresa => {
                this.salvarSessao({
                  perfil,
                  empresa
                });
              }),
                map(empresa => ({
                  perfil,
                  empresa
                }))
            );
        })
      );
  }

    login(email: string, senha: string): Observable<SessaoOrganizador> {
      return this.http
        .post<PerfilResponse>(`${this.perfilUrl}/autenticar`, { email, senha }) .pipe( switchMap(perfil => this.http
              .get<EmpresaResponse[]>(this.empresaUrl)
              .pipe(
                map(empresas => {
                  const empresa = empresas.find(
                    item => item.perfil?.id === perfil.id
                  );

                  if (!empresa) {
                    throw new Error(
                      'Empresa não encontrada para o organizador.'
                    );
                  }

                  return {
                    perfil,
                    empresa
                  };
                }),
                tap(sessao => {
                  this.salvarSessao(sessao);
                })
              )
          )
        );
    }

  getSessao(): SessaoOrganizador | null {
    const sessao = localStorage.getItem('evena_sessao');

    if (!sessao) {
      return null;
    }

    return JSON.parse(sessao);
  }

  getEmpresaId(): number | null {
    const sessao = this.getSessao();

    return sessao?.empresa?.id ?? null;
  }

  getPerfilId(): number | null {
    const sessao = this.getSessao();

    return sessao?.perfil?.id ?? null;
  }

  logout(): void {
    localStorage.removeItem('evena_sessao');
  }

  private salvarSessao(sessao: SessaoOrganizador): void {
    localStorage.setItem(
      'evena_sessao',
      JSON.stringify(sessao)
    );
  }

  private montarEndereco(dados: any): string {

    const partes = [
      dados.endereco,
      dados.numero,
      dados.complemento,
      dados.bairro,
      dados.cidade,
      dados.estado,
      dados.cep
    ].filter(Boolean);

    return partes.join(', ');
  }
}