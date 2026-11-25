
import { Component } from "@angular/core";
import { Header } from "../../shared/components/header/header";
import { Footer } from "../../shared/components/footer/footer";

interface PerguntaFrequente {
  id: number;
  categoria: string;
  pergunta: string;
  resposta: string;
}

@Component({
  selector: "app-central-ajuda",
  imports: [Header, Footer],
  templateUrl: "./central-ajuda.html",
  styleUrl: "./central-ajuda.css",
})
export class CentralAjuda {

  categorias: string[] = [
    "Todas",
    "Conta e acesso",
    "Encontrar eventos",
    "Favoritos",
    "Organizadores"
  ];

  categoriaSelecionada = "Todas";
  busca = "";
  perguntaAberta: number | null = null;

  perguntas: PerguntaFrequente[] = [

    // CONTA E ACESSO

    {
      id: 1,
      categoria: "Conta e acesso",
      pergunta: "Como criar uma conta no Evena?",
      resposta:
        "Acesse a página de cadastro, escolha o tipo de conta desejado e preencha as informações solicitadas. Após concluir o cadastro, você poderá acessar a plataforma com seus dados de login."
    },
    {
      id: 2,
      categoria: "Conta e acesso",
      pergunta: "Como entrar na minha conta?",
      resposta:
        "Acesse a página de login e informe o e-mail e a senha utilizados no cadastro. Depois, selecione a opção para entrar."
    },
    {
      id: 3,
      categoria: "Conta e acesso",
      pergunta: "Esqueci minha senha. O que devo fazer?",
      resposta:
        "Na página de login, selecione a opção 'Esqueci minha senha' e siga as orientações apresentadas para recuperar o acesso à sua conta."
    },

    // ENCONTRAR EVENTOS

    {
      id: 4,
      categoria: "Encontrar eventos",
      pergunta: "Como encontrar eventos no Evena?",
      resposta:
        "Acesse a página de eventos para explorar as opções disponíveis. Você pode navegar pelos eventos e consultar informações como descrição, data, local e atrações."
    },
    {
      id: 5,
      categoria: "Encontrar eventos",
      pergunta: "Posso filtrar os eventos?",
      resposta:
        "Sim! Na página de exploração, utilize os filtros disponíveis para refinar a busca e encontrar eventos de acordo com as opções apresentadas."
    },
    {
      id: 6,
      categoria: "Encontrar eventos",
      pergunta: "Onde encontro as informações de um evento?",
      resposta:
        "Selecione o evento desejado para acessar sua página de detalhes. Nela, você poderá consultar as informações disponibilizadas pelo organizador."
    },

    // FAVORITOS

    {
      id: 7,
      categoria: "Favoritos",
      pergunta: "Como salvar um evento nos favoritos?",
      resposta:
        "Ao encontrar um evento de seu interesse, utilize o ícone de favorito disponível no evento para salvá-lo em sua lista."
    },
    {
      id: 8,
      categoria: "Favoritos",
      pergunta: "Onde encontro meus eventos favoritos?",
      resposta:
        "Os eventos salvos ficam disponíveis na área de favoritos do seu perfil de usuário."
    },
    {
      id: 9,
      categoria: "Favoritos",
      pergunta: "Posso remover um evento dos favoritos?",
      resposta:
        "Sim! Acesse o evento salvo e selecione novamente o ícone de favorito para removê-lo da sua lista."
    },

    // ORGANIZADORES

    {
      id: 10,
      categoria: "Organizadores",
      pergunta: "Como divulgar um evento no Evena?",
      resposta:
        "É necessário possuir uma conta de organizador. Depois de acessar seu perfil, utilize a opção de criar evento e preencha as informações solicitadas."
    },
    {
      id: 11,
      categoria: "Organizadores",
      pergunta: "Posso editar as informações de um evento?",
      resposta:
        "As informações dos eventos podem ser gerenciadas pelo organizador responsável, de acordo com as opções disponíveis na plataforma."
    },
    {
      id: 12,
      categoria: "Organizadores",
      pergunta: "Como atualizar meu perfil de organizador?",
      resposta:
        "Acesse seu perfil de organizador e utilize a opção de edição para atualizar as informações disponíveis."
    }

  ];

  get perguntasFiltradas(): PerguntaFrequente[] {
    const termo = this.busca.trim().toLocaleLowerCase("pt-BR");

    return this.perguntas.filter((pergunta) => {

      const correspondeCategoria =
        this.categoriaSelecionada === "Todas" ||
        pergunta.categoria === this.categoriaSelecionada;

      const correspondeBusca =
        !termo ||
        pergunta.pergunta.toLocaleLowerCase("pt-BR").includes(termo) ||
        pergunta.resposta.toLocaleLowerCase("pt-BR").includes(termo) ||
        pergunta.categoria.toLocaleLowerCase("pt-BR").includes(termo);

      return correspondeCategoria && correspondeBusca;

    });
  }

  atualizarBusca(event: Event): void {
    const campo = event.target as HTMLInputElement;

    this.busca = campo.value;
    this.perguntaAberta = null;
  }

  selecionarCategoria(categoria: string): void {
    this.categoriaSelecionada = categoria;
    this.perguntaAberta = null;
  }

  alternarPergunta(id: number): void {
    this.perguntaAberta =
      this.perguntaAberta === id ? null : id;
  }

}
