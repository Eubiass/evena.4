
import { Component } from "@angular/core";
import { Header } from "../../shared/components/header/header";
import { Footer } from "../../shared/components/footer/footer";

interface SecaoPolitica {
  id: string;
  titulo: string;
  paragrafos: string[];
  itens?: string[];
}

@Component({
  selector: "app-politica-de-privacidade",
  imports: [Header, Footer],
  templateUrl: "./politica-de-privacidade.html",
  styleUrl: "./politica-de-privacidade.css",
})
export class PoliticaDePrivacidade {

  ultimaAtualizacao = "24 de novembro de 2026";

  secoes: SecaoPolitica[] = [
    {
      id: "introducao",
      titulo: "Apresentação",
      paragrafos: [
        "O Evena é uma plataforma desenvolvida para facilitar a descoberta, divulgação e organização de eventos. Esta Política de Privacidade explica quais informações podem ser coletadas durante o uso da plataforma, como são utilizadas e quais são os direitos dos usuários em relação aos seus dados pessoais.",
        "Ao utilizar o Evena, o usuário deve estar ciente das práticas descritas neste documento. Recomendamos a leitura desta política para compreender como suas informações são tratadas."
      ]
    },
    {
      id: "dados-coletados",
      titulo: "Quais dados coletamos?",
      paragrafos: [
        "As informações coletadas variam de acordo com o tipo de conta e a forma como o usuário utiliza o Evena."
      ],
      itens: [
        "Usuários: nome, endereço de e-mail e senha.",
        "Organizadores: endereço de e-mail, telefone, senha, razão social, nome fantasia, CNPJ, ramo de atuação e informações de endereço, incluindo CEP, estado, cidade, bairro, logradouro, número e complemento.",
        "Dados de utilização: informações relacionadas às interações realizadas na plataforma, como cliques e navegação.",
        "Favoritos: informações sobre os eventos que o usuário escolhe salvar em sua lista de favoritos.",
        "Localização: informações de localização do dispositivo, mediante autorização do usuário, ou localização aproximada estimada a partir do endereço IP, quando a permissão de localização não é concedida."
      ]
    },
    {
      id: "finalidade",
      titulo: "Como utilizamos os dados?",
      paragrafos: [
        "As informações coletadas são utilizadas para permitir o funcionamento dos recursos do Evena, oferecer uma experiência adequada aos usuários e facilitar a divulgação e descoberta de eventos."
      ],
      itens: [
        "Criar e gerenciar contas de usuários e organizadores.",
        "Permitir o acesso ao Evena e a utilização de suas funcionalidades.",
        "Identificar organizadores e apresentar suas informações na plataforma.",
        "Permitir que usuários salvem e consultem eventos favoritos.",
        "Auxiliar na apresentação de eventos próximos à localização do usuário.",
        "Compreender como os recursos do Evena são utilizados, por meio de informações sobre interações e cliques."
      ]
    },
    {
      id: "localizacao",
      titulo: "Como utilizamos a localização?",
      paragrafos: [
        "O Evena utiliza informações de localização para auxiliar os usuários a encontrar eventos próximos de sua região.",
        "Inicialmente, o navegador solicita autorização para acessar a localização do dispositivo. Caso o usuário não conceda essa permissão, o Evena poderá utilizar o endereço IP para estimar uma localização aproximada.",
        "A localização aproximada obtida pelo endereço IP não possui necessariamente a mesma precisão da localização fornecida pelo dispositivo."
      ]
    },
    {
      id: "armazenamento",
      titulo: "Como os dados são armazenados?",
      paragrafos: [
        "O Evena utiliza uma API interna para processar e gerenciar as informações necessárias ao funcionamento da plataforma.",
        "Algumas informações também podem ser armazenadas localmente no navegador do usuário, por meio do localStorage. Esse recurso permite manter determinados dados disponíveis durante a utilização do Evena.",
        "O armazenamento local ocorre no próprio navegador e pode ser afetado pela limpeza dos dados de navegação ou pelas configurações do dispositivo."
      ]
    },
    {
      id: "servicos-externos",
      titulo: "Serviços externos",
      paragrafos: [
        "O Evena disponibiliza uma integração com o Google Maps para que os usuários possam visualizar a localização dos eventos e consultar sua posição no mapa.",
        "Ao utilizar esse recurso, o usuário poderá ser direcionado a um serviço externo, que possui suas próprias políticas e práticas de privacidade. O Evena não controla o tratamento de dados realizado diretamente por esses serviços."
      ]
    },
    {
      id: "agenda",
      titulo: "Integração com a agenda do dispositivo",
      paragrafos: [
        "O Evena oferece a opção de adicionar a data de um evento à agenda do dispositivo do usuário.",
        "Essa ação depende da escolha do próprio usuário. A utilização desse recurso não significa que o Evena tenha acesso geral à agenda pessoal ou aos demais compromissos armazenados no dispositivo."
      ]
    },
    {
      id: "compartilhamento",
      titulo: "Compartilhamento de dados",
      paragrafos: [
        "As informações são utilizadas para viabilizar os recursos e funcionalidades do Evena. O uso de serviços externos, como o Google Maps, pode envolver o acesso a informações pelo respectivo fornecedor, conforme suas próprias condições e políticas de privacidade.",
        "As informações sobre interações e eventos favoritados também poderão ser utilizadas futuramente para a elaboração de indicadores e estatísticas de utilização do Evena. Essa possibilidade não deve ser entendida como uma funcionalidade de dashboard já disponível."
      ]
    },
    {
      id: "seguranca",
      titulo: "Segurança das informações",
      paragrafos: [
        "O Evena busca adotar cuidados técnicos e organizacionais para proteger as informações utilizadas pela plataforma contra acessos não autorizados, alterações ou utilizações inadequadas.",
        "Apesar dos cuidados adotados, nenhum sistema digital pode garantir segurança absoluta. Por isso, recomendamos que os usuários mantenham suas credenciais de acesso em sigilo e evitem compartilhá-las."
      ]
    },
    {
      id: "direitos",
      titulo: "Direitos dos titulares",
      paragrafos: [
        "De acordo com a Lei Geral de Proteção de Dados Pessoais (LGPD), os titulares possuem direitos relacionados ao tratamento de seus dados pessoais. Entre eles estão:"
      ],
      itens: [
        "Confirmar a existência de tratamento de seus dados pessoais.",
        "Solicitar acesso aos seus dados.",
        "Solicitar a correção de informações incompletas, inexatas ou desatualizadas.",
        "Solicitar a anonimização, o bloqueio ou a eliminação de dados desnecessários ou tratados em desconformidade com a legislação.",
        "Solicitar a portabilidade dos dados, observadas as condições legais.",
        "Solicitar a eliminação dos dados pessoais tratados com consentimento, respeitadas as exceções previstas em lei.",
        "Obter informações sobre o compartilhamento de dados com entidades públicas e privadas.",
        "Revogar o consentimento, quando essa for a base legal utilizada para o tratamento."
      ]
    },
    {
      id: "atualizacoes",
      titulo: "Atualizações desta política",
      paragrafos: [
        "Esta Política de Privacidade poderá ser atualizada para acompanhar mudanças nas funcionalidades do Evena, nas práticas de tratamento de dados ou na legislação aplicável.",
        "Sempre que houver alterações, a data da última atualização será modificada nesta página. Recomendamos que os usuários consultem este documento periodicamente."
      ]
    },
    {
      id: "contato",
      titulo: "Contato",
      paragrafos: [
        "Em caso de dúvidas, solicitações ou questões relacionadas à privacidade e ao tratamento de dados pessoais, o usuário deverá utilizar os canais oficiais de contato disponibilizados pelo Evena."
      ]
    }
  ];

  irParaSecao(id: string): void {
    const elemento = document.getElementById(id);

    if (elemento) {
      elemento.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  }

}
