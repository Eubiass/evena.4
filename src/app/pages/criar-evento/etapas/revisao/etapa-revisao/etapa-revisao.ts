import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

import {
  DataEvento,
  DadosEvento
} from '../../../../../models/dados-evento';

@Component({
  selector: 'app-etapa-revisao',
  standalone: true,
  imports: [],
  templateUrl: './etapa-revisao.html',
  styleUrl: './etapa-revisao.css'
})
export class EtapaRevisao {
  @Input()
  dadosEvento!: DadosEvento;

  @Input()
  publicando = false;

  @Output()
  voltar =
    new EventEmitter<void>();

  @Output()
  editar =
    new EventEmitter<number>();

  @Output()
  publicar =
    new EventEmitter<void>();

  editarEtapa(
    etapa: number
  ): void {
    if (
      this.publicando
    ) {
      return;
    }

    this.editar.emit(
      etapa
    );
  }

  voltarEtapa(): void {
    if (
      this.publicando
    ) {
      return;
    }

    this.voltar.emit();
  }

  publicarEvento(): void {
    if (
      this.publicando
    ) {
      return;
    }

    this.publicar.emit();
  }

  formatarData(
    data: string
  ): string {
    if (!data) {
      return 'Não informado';
    }

    const [
      ano,
      mes,
      dia
    ] = data.split('-');

    if (
      !ano ||
      !mes ||
      !dia
    ) {
      return data;
    }

    return `${dia}/${mes}/${ano}`;
  }

  formatarHorario(
    item: DataEvento
  ): string {
    if (
      !item.inicio
    ) {
      return 'Não informado';
    }

    if (
      !item.fim
    ) {
      return item.inicio;
    }

    const diaSeguinte =
      item.terminaNoDiaSeguinte
        ? ' (+1 dia)'
        : '';

    return `${item.inicio} - ${item.fim}${diaSeguinte}`;
  }

  formatarTipoLocal(
    tipo: string
  ): string {
    if (
      tipo === 'presencial'
    ) {
      return 'Presencial';
    }

    if (
      tipo === 'online'
    ) {
      return 'Online';
    }

    return 'Não informado';
  }

  formatarTipoIngresso(
    tipo: string
  ): string {
    if (
      tipo === 'gratuito'
    ) {
      return 'Gratuito';
    }

    if (
      tipo === 'pago'
    ) {
      return 'Pago';
    }

    return 'Não informado';
  }

  formatarPreco(): string {
    if (
      this.dadosEvento.tipoIngresso !==
      'pago'
    ) {
      return 'Gratuito';
    }

    if (
      !this.dadosEvento.preco
    ) {
      return 'Não informado';
    }

    return `R$ ${this.dadosEvento.preco}`;
  }

  formatarEndereco(): string {
    const endereco = [
      this.dadosEvento.endereco,
      this.dadosEvento.numero,
      this.dadosEvento.complemento
    ]
      .map(
        valor =>
          valor.trim()
      )
      .filter(Boolean)
      .join(', ');

    const cidadeEstado = [
      this.dadosEvento.cidade,
      this.dadosEvento.estado
    ]
      .map(
        valor =>
          valor.trim()
      )
      .filter(Boolean)
      .join(' - ');

    return [
      endereco,
      cidadeEstado
    ]
      .filter(Boolean)
      .join(' · ') ||
      'Não informado';
  }
}