import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class Localidade {
  // Mock de dados - Futuramente isso pode vir de uma API (como a do IBGE)
  private cidadesPorEstado: { [key: string]: string[] } = {
    'SP': ['São Paulo', 'Campinas', 'Santos', 'São José dos Campos'],
    'RJ': ['Rio de Janeiro', 'Niterói', 'Angra dos Reis', 'Búzios'],
    'MG': ['Belo Horizonte', 'Uberlândia', 'Ouro Preto', 'Tiradentes'],
    'PR': ['Curitiba', 'Londrina', 'Maringá']
  };

  obterCidades(uf: string): string[] {
    return this.cidadesPorEstado[uf] || [];
  }
}
