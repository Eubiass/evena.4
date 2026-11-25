
import { Component } from "@angular/core";
import { Header } from "../../shared/components/header/header";
import { Footer } from "../../shared/components/footer/footer";

interface SecaoTermos {
  id: string;
  titulo: string;
  paragrafos: string[];
  itens?: string[];
}

@Component({
  selector: "app-termos-de-uso",
  imports: [Header, Footer],
  templateUrl: "./termos-de-uso.html",
  styleUrl: "./termos-de-uso.css",
})
export class TermosDeUso {

  ultimaAtualizacao = "24 de novembro de 2026";

  secoes: SecaoTermos[] = [
    {
      id: "apresentacao",
      titulo: "Apresentação e aceitação dos termos",
      paragrafos: [
        "Bem-vindo ao Evena! Estes Termos de Uso estabelecem as condições para acesso e utilização da plataforma, que tem como objetivo facilitar a descoberta e a divulgação de eventos.",
        "Ao acessar ou utilizar o Evena, o usuário declara estar ciente das condições apresentadas neste documento. Caso não concorde com alguma delas, recomendamos que não utilize os serviços da plataforma.",
        "Estes termos devem ser interpretados em conjunto com a Política de Privacidade do Evena, que apresenta informações sobre a coleta e o tratamento de dados pessoais."
      ]
    },
    {
      id: "sobre",
      titulo: "Sobre o Evena",
      paragrafos: [
        "O Evena é uma plataforma digital desenvolvida para aproximar pessoas de eventos e facilitar a divulgação de atividades promovidas por organizadores.",
        "Por meio da plataforma, os usuários podem explorar eventos, consultar informações, visualizar detalhes, salvar eventos como favoritos e utilizar outros recursos disponibilizados.",
        "O Evena atua como um espaço de divulgação e descoberta de eventos. A plataforma apresenta as informações disponibilizadas pelos organizadores e pode direcionar os interessados a páginas externas para obter mais informações ou realizar a compra de ingressos."
      ]
    },
    {
      id: "cadastro",
      titulo: "Cadastro e conta de usuário",
      paragrafos: [
        "Para utilizar determinadas funcionalidades, pode ser necessário criar uma conta no Evena e fornecer as informações solicitadas durante o cadastro.",
        "O usuário é responsável por fornecer informações verdadeiras, completas e atualizadas, além de manter a confidencialidade de suas credenciais de acesso.",
        "O usuário deve comunicar ao Evena, por meio dos canais de contato disponibilizados, caso identifique alguma utilização não autorizada de sua conta.",
        "Cada usuário deve utilizar sua conta de maneira pessoal e responsável, respeitando estes termos e a legislação aplicável."
      ]
    },
    {
      id: "organizadores",
      titulo: "Cadastro e responsabilidades dos organizadores",
      paragrafos: [
        "Os organizadores podem utilizar o Evena para divulgar eventos e apresentar informações relacionadas às atividades que promovem.",
        "Ao cadastrar uma organização ou publicar um evento, o responsável deve garantir que as informações fornecidas sejam verdadeiras, atualizadas e apresentadas de maneira clara.",
        "O organizador é responsável pelo conteúdo publicado, pela organização e pela realização do evento, bem como pelas condições oferecidas aos participantes."
      ],
      itens: [
        "Fornecer informações corretas sobre a organização e seus responsáveis.",
        "Apresentar informações claras sobre o evento, incluindo data, horário, local e descrição.",
        "Manter os dados do evento atualizados sempre que houver alterações.",
        "Respeitar os direitos de terceiros e a legislação aplicável.",
        "Responder pela organização, divulgação e realização do evento anunciado.",
        "Disponibilizar informações corretas sobre as condições de participação e aquisição de ingressos."
      ]
    },
    {
      id: "eventos",
      titulo: "Publicação e divulgação de eventos",
      paragrafos: [
        "As informações dos eventos disponibilizadas no Evena são fornecidas pelos respectivos organizadores e apresentadas aos usuários para facilitar a descoberta de atividades.",
        "Os organizadores devem revisar as informações antes da publicação e atualizá-las sempre que necessário, especialmente em situações de alteração de data, horário, endereço, programação ou outras condições do evento.",
        "A divulgação de um evento na plataforma não representa uma garantia de sua realização ou de disponibilidade de vagas. Os usuários devem verificar as informações e, quando necessário, entrar em contato diretamente com o organizador responsável."
      ]
    },
    {
      id: "ingressos",
      titulo: "Ingressos, preços e compras externas",
      paragrafos: [
        "O Evena tem como finalidade apresentar e divulgar eventos, permitindo que os usuários conheçam as atividades e encontrem informações sobre como participar.",
        "Quando houver interesse na compra de ingressos, a plataforma poderá disponibilizar um link que direciona o usuário à página externa indicada para essa finalidade.",
        "A compra dos ingressos acontece fora do Evena, diretamente na página ou no serviço responsável pela comercialização. O Evena não realiza a venda, não processa pagamentos e não administra diretamente as transações relacionadas aos ingressos.",
        "Preços, disponibilidade, formas de pagamento, emissão de ingressos, cancelamentos e reembolsos são condições administradas pelo responsável pela venda ou pelo organizador, conforme o serviço utilizado.",
        "Antes de realizar uma compra ou fornecer informações pessoais e financeiras em uma página externa, o usuário deve conferir o endereço do site e verificar se está acessando o serviço indicado pelo organizador.",
        "Em caso de dúvidas ou problemas relacionados à compra, o usuário deverá procurar o organizador ou o serviço responsável pela comercialização dos ingressos."
      ]
    },
    {
      id: "funcionalidades",
      titulo: "Utilização das funcionalidades",
      paragrafos: [
        "O Evena disponibiliza recursos para facilitar a navegação e a interação dos usuários com os eventos apresentados na plataforma.",
        "Entre as funcionalidades disponíveis estão a exploração de eventos, a consulta de informações, a utilização de filtros, o salvamento de eventos favoritos e a visualização de localizações.",
        "Alguns recursos podem depender de permissões concedidas pelo usuário ou de serviços externos. A utilização dessas funcionalidades deve respeitar as configurações do dispositivo e as condições dos respectivos serviços."
      ]
    },
    {
      id: "condutas",
      titulo: "Condutas proibidas",
      paragrafos: [
        "Durante a utilização do Evena, todos os usuários e organizadores devem agir de maneira responsável, respeitosa e de acordo com a legislação vigente.",
        "Não é permitido utilizar a plataforma para atividades que prejudiquem seu funcionamento, comprometam a segurança de outros usuários ou violem direitos de terceiros.",
        "Entre as condutas não permitidas estão:"
      ],
      itens: [
        "Fornecer informações falsas, enganosas ou fraudulentas.",
        "Publicar conteúdo ilegal, ofensivo, discriminatório ou que viole direitos de terceiros.",
        "Utilizar a plataforma para aplicar golpes ou praticar atividades fraudulentas.",
        "Tentar acessar contas, informações ou áreas restritas sem autorização.",
        "Interferir no funcionamento, na segurança ou na disponibilidade do Evena.",
        "Utilizar informações ou conteúdos da plataforma de maneira indevida."
      ]
    },
    {
      id: "denuncias",
      titulo: "Denúncias e revisão de eventos",
      paragrafos: [
        "O Evena disponibiliza uma funcionalidade para que os usuários possam denunciar eventos que apresentem informações suspeitas, conteúdo inadequado ou possíveis irregularidades.",
        "Ao realizar uma denúncia, o usuário encaminha as informações relacionadas ao evento para a área administrativa da plataforma.",
        "As denúncias recebidas são avaliadas pela equipe responsável pelo Evena, composta por sete fundadores que atuam em diferentes áreas do projeto. Cada denúncia passa por um processo de revisão para que a situação apresentada seja analisada.",
        "O envio de uma denúncia não significa que a irregularidade tenha sido confirmada. A avaliação considera as informações disponíveis e a situação relatada.",
        "Os usuários devem utilizar esse recurso de maneira responsável, apresentando informações verdadeiras e evitando denúncias realizadas com a intenção de prejudicar organizadores ou outros usuários."
      ]
    },
    {
      id: "propriedade",
      titulo: "Propriedade intelectual",
      paragrafos: [
        "Os elementos que compõem o Evena, incluindo sua identidade visual, marca, estrutura, elementos gráficos, textos institucionais e demais materiais próprios, são protegidos pelas normas aplicáveis de propriedade intelectual.",
        "A utilização da plataforma não concede ao usuário direitos de propriedade sobre esses elementos. Sua reprodução, distribuição ou utilização fora das finalidades permitidas depende de autorização dos respectivos titulares, quando exigida por lei.",
        "Os organizadores permanecem responsáveis por garantir que possuem autorização para utilizar imagens, textos, marcas e demais materiais enviados ou publicados na plataforma."
      ]
    },
    {
      id: "servicos-externos",
      titulo: "Serviços e links externos",
      paragrafos: [
        "O Evena pode disponibilizar links e recursos integrados a serviços externos, como páginas de venda de ingressos e ferramentas de mapas e localização.",
        "Ao acessar um link externo, o usuário deixa o ambiente do Evena e passa a utilizar um serviço que possui suas próprias condições de uso, políticas de privacidade e práticas de segurança.",
        "O Evena não controla diretamente o funcionamento, a disponibilidade, as transações ou as práticas de tratamento de informações realizadas por serviços de terceiros.",
        "Recomendamos que os usuários verifiquem as informações e o endereço das páginas externas antes de realizar compras ou fornecer dados pessoais."
      ]
    },
    {
      id: "responsabilidades",
      titulo: "Responsabilidades e limitações",
      paragrafos: [
        "O Evena atua como uma plataforma de divulgação e descoberta de eventos, apresentando informações disponibilizadas pelos organizadores e facilitando o acesso dos usuários às páginas externas relacionadas às atividades divulgadas.",
        "A responsabilidade pela veracidade das informações fornecidas, pela organização, pelas condições de participação e pela realização de cada evento é do respectivo organizador.",
        "Como a compra de ingressos ocorre em páginas externas, eventuais problemas relacionados a pagamentos, emissão de ingressos, cancelamentos ou reembolsos devem ser tratados diretamente com o serviço responsável pela venda ou com o organizador.",
        "O Evena busca manter a plataforma disponível e suas informações organizadas, mas não garante que o acesso será ininterrupto ou livre de falhas, considerando possíveis manutenções, problemas técnicos e fatores externos.",
        "Os usuários devem utilizar a plataforma com atenção e verificar as informações relevantes diretamente com os responsáveis pelos eventos e pelos serviços externos."
      ]
    },
    {
      id: "disponibilidade",
      titulo: "Disponibilidade e alterações da plataforma",
      paragrafos: [
        "As funcionalidades e os recursos do Evena podem passar por melhorias, atualizações ou modificações para acompanhar as necessidades da plataforma.",
        "Alguns recursos podem ficar temporariamente indisponíveis em razão de manutenção, atualizações ou dificuldades técnicas.",
        "O Evena poderá modificar, incluir ou descontinuar funcionalidades, buscando preservar a organização e o funcionamento da plataforma."
      ]
    },
    {
      id: "alteracoes",
      titulo: "Alterações destes Termos de Uso",
      paragrafos: [
        "Estes Termos de Uso podem ser atualizados para refletir mudanças nas funcionalidades do Evena, nas condições de utilização da plataforma ou na legislação aplicável.",
        "Sempre que houver alterações, a data da última atualização será modificada nesta página.",
        "Recomendamos que os usuários consultem este documento periodicamente para acompanhar suas condições de utilização."
      ]
    },
    {
      id: "contato",
      titulo: "Contato",
      paragrafos: [
        "Em caso de dúvidas, solicitações, sugestões ou questões relacionadas a estes Termos de Uso, os usuários podem entrar em contato com a equipe responsável pelo Evena por meio do e-mail oficial:",
        "evena.brasil@gmail.com",
        "A equipe do Evena é formada por sete fundadores, responsáveis por diferentes áreas do desenvolvimento e da organização da plataforma. As solicitações recebidas pelo canal oficial serão encaminhadas para avaliação da equipe responsável."
      ]
    }
  ];

  irParaSecao(id: string): void {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }
}
