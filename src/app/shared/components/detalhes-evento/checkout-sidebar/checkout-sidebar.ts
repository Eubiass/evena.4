import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-checkout-sidebar",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./checkout-sidebar.html",
  styleUrl: "./checkout-sidebar.css",
})
export class CheckoutSidebar {
  @Input() evento: any;

  // Estados de controle das interações da tela
  isSalvo: boolean = false;
  isSeguindo: boolean = false;

  // 1. Lógica do Botão Salvar (Ativa as animações de raios no CSS)
  alternarSalvar(): void {
    this.isSalvo = !this.isSalvo;
  }

  // 2. Lógica de Seguir o Organizador (Modifica o contador local e evita propagação)
  alternarSeguir(event: Event): void {
    event.stopPropagation(); // Evita que o clique dispare o método 'irParaPerfilOrganizador' do container pai
    this.isSeguindo = !this.isSeguindo;
    
    if (this.evento?.organizador) {
      if (!this.evento.organizador.seguidores) {
        this.evento.organizador.seguidores = 0;
      }
      this.isSeguindo ? this.evento.organizador.seguidores++ : this.evento.organizador.seguidores--;
    }
  }

  // 3. Redirecionamento para o Perfil do Organizador
  irParaPerfilOrganizador(): void {
    if (this.evento?.organizador?.id) {
      console.log('Redirecionando para o perfil do organizador ID:', this.evento.organizador.id);
      // Aqui, futuramente, você pode injetar o Router do Angular e navegar:
      // this.router.navigate(['/organizador', this.evento.organizador.id]);
    }
  }

  // 4. Lógica da Agenda (Abre o formulário do Google Agenda preenchido em nova aba)
  adicionarAoCalendario(): void {
    if (!this.evento) return;

    const titulo = encodeURIComponent(this.evento.titulo || 'Evento Evena');
    const detalhes = encodeURIComponent(`${this.evento.descricao?.substring(0, 300) || ''}... Saiba mais no Evena!`);
    const local = encodeURIComponent(this.evento.enderecoCompleto || this.evento.localNome || 'Local a definir');
    
    let dataInicio = '20271027T203000'; 
    let dataFim = '20271027T233000';

    if (this.evento.intervalo?.inicio) {
      const dataLimpaIn = this.evento.intervalo.inicio.replace(/-/g, '');
      const horaLimpaIn = this.evento.horario?.replace(':', '') || '0000';
      dataInicio = `${dataLimpaIn}T${horaLimpaIn}00`;
      
      const dataLimpaFim = this.evento.intervalo.fim?.replace(/-/g, '') || dataLimpaIn;
      dataFim = `${dataLimpaFim}T235900`;
    } else if (this.evento.datasOcorrencia?.length) {
      const dataLimpa = this.evento.datasOcorrencia[0].replace(/-/g, '');
      const horaLimpa = this.evento.horario?.replace(/[^0-9]/g, '') || '2030';
      dataInicio = `${dataLimpa}T${horaLimpa}00`;
      dataFim = `${dataLimpa}T233000`;
    }

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${titulo}&dates=${dataInicio}/${dataFim}&details=${detalhes}&location=${local}`;
    window.open(googleCalendarUrl, '_blank');
  }

  // 5. Lógica de Compartilhamento (Usa a folha nativa do celular ou copia o link)
  compartilharEvento(): void {
    if (!this.evento) return;

    const dadosCompartilhar = {
      title: this.evento.titulo,
      text: `Confira o evento ${this.evento.titulo} no Evena!`,
      url: window.location.href 
    };

    if (navigator.share) {
      navigator.share(dadosCompartilhar).catch((err) => console.log(err));
    } else {
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert('Link copiado para a área de transferência!'))
        .catch(() => alert('Erro ao copiar link.'));
    }
  }

  // 6. Botão Principal (Redirecionamento para o link de compra externo)
  redirecionarParceiro(): void {
    if (this.evento?.linkIngresso) {
      window.open(this.evento.linkIngresso, "_blank");
    } else {
      const busca = encodeURIComponent(`${this.evento?.titulo} ingressos oficial`);
      window.open(`https://www.google.com/search?q=${busca}`, "_blank");
    }
  }
}