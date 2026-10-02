import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { DadosEvento, DataEvento } from '../../../../../models/dados-evento';


@Component({
  selector: 'app-etapa-revisao',
  standalone: true,
  imports: [],
  templateUrl: './etapa-revisao.html',
  styleUrl: './etapa-revisao.css'
})
export class EtapaRevisao {
  @Input() dadosEvento!: DadosEvento;

  @Output() voltar = new EventEmitter<void>();
  @Output() editar = new EventEmitter<number>();

  voltarEtapa() {
    this.voltar.emit();
  }

  editarEtapa(etapa: number) {
    this.editar.emit(etapa);
  }

  publicarEvento() {
    console.log('Evento pronto para publicação:', this.dadosEvento);
  }

  formatarData(data: string): string {
    if (!data) return 'Não informado';

    const partes = data.split('-');

    if (partes.length !== 3) return data;

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }

  formatarHorario(item: DataEvento): string {
    if (!item.inicio || !item.fim) return 'Não informado';

    const horario = `${item.inicio} às ${item.fim}`;

    return item.terminaNoDiaSeguinte
      ? `${horario} (dia seguinte)`
      : horario;
  }

  formatarTipoLocal(tipo: string): string {
    const tipos: Record<string, string> = {
      presencial: 'Presencial',
      online: 'Online',
      hibrido: 'Híbrido'
    };

    return tipos[tipo] || 'Não informado';
  }

  formatarTipoIngresso(tipo: string): string {
    const tipos: Record<string, string> = {
      gratuito: 'Gratuito',
      pago: 'Pago'
    };

    return tipos[tipo] || 'Não informado';
  }

  formatarPreco(minimo: string, maximo: string): string {
    if (!minimo && !maximo) return 'Não informado';
    if (minimo === maximo) return `R$ ${minimo}`;

    return `R$ ${minimo} até R$ ${maximo}`;
  }

  formatarEndereco(): string {
    const partes = [
      this.dadosEvento.endereco,
      this.dadosEvento.numero,
      this.dadosEvento.complemento,
      this.dadosEvento.cidade,
      this.dadosEvento.estado
    ].filter(Boolean);

    return partes.length
      ? partes.join(', ')
      : 'Não informado';
  }
}