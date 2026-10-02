import { Component } from '@angular/core';

import { CabecalhoOrganizador } from './components/cabecalho-organizador/cabecalho-organizador';
import { BarraEtapas } from './components/barra-etapas/barra-etapas';

import { EtapaInformacoes } from './etapas/informacoes/etapa-informacoes/etapa-informacoes';
import { EtapaDataLocal } from './etapas/data-local/etapa-data-local/etapa-data-local';
import { EtapaDetalhes } from './etapas/detalhes/etapa-detalhes/etapa-detalhes';
import { EtapaRevisao } from './etapas/revisao/etapa-revisao/etapa-revisao';
import { criarDadosEventoVazio, DadosEvento } from '../../models/dados-evento';

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
  dadosEvento: DadosEvento = criarDadosEventoVazio();

  receberDados(dados: Partial<DadosEvento>) {
    this.dadosEvento = {
      ...this.dadosEvento,
      ...dados
    };

    this.avancarEtapa();
  }

  editarEtapa(etapa: number) {
    if (etapa >= 1 && etapa <= 3) {
      this.etapaAtual = etapa;
      this.irParaTopo();
    }
  }

  avancarEtapa() {
    if (this.etapaAtual < 4) {
      this.etapaAtual++;
      this.irParaTopo();
    }
  }

  voltarEtapa() {
    if (this.etapaAtual > 1) {
      this.etapaAtual--;
      this.irParaTopo();
    }
  }

  private irParaTopo() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}