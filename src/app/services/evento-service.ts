import { Injectable } from '@angular/core';
import { Evento } from '../model/evento';

@Injectable({
  providedIn: 'root',
})
export class EventoService { 

  private listaEventos: Evento[] = [
    {
      id: 1, 
      titulo: 'Evento de Marketing Digital', 
      dataExibicao: '24 de Fevereiro',
      horario: '20:00',
      datasOcorrencia: ['2026-02-24'],
      localNome: 'Hotel Transilvânia',
      enderecoCompleto: 'Avenida Dona Ruyce Ferraz Alvim, 1088',
      cidade: 'São Paulo', 
      uf: 'SP',
      preco: 0, 
      imagem: 'evento4.webp', 
      lat: -23.5611, 
      lng: -46.6559,
      categoria: ['Marketing'],
      descricao: "Prepare-se para dominar as tendências que estão moldando o futuro do mercado. Neste encontro exclusivo no Hotel Transilvânia, vamos explorar estratégias de tráfego pago, SEO e o impacto da Inteligência Artificial na criação de conteúdo. Uma oportunidade única para fazer networking com grandes players do setor em São Paulo. Evento gratuito com emissão de certificado."
    },
    {
      id: 2, 
      titulo: 'Workshop de Design', 
      dataExibicao: '10 de Março',
      horario: '14:00',
      datasOcorrencia: ['2026-03-10'],
      localNome: 'Teatro Multiplan',
      enderecoCompleto: 'Av. das Américas, 3900 - Barra da Tijuca',
      cidade: 'Rio de Janeiro', 
      uf: 'RJ',
      preco: 50.00, 
      imagem: 'evento2.jpeg', 
      lat: -22.9068, 
      lng: -43.1229,
      categoria: ['Negócios'], 
      descricao: "Transforme sua visão criativa em projetos de alto impacto. Este workshop prático no Teatro Multiplan é focado in UI/UX e Design Thinking, trazendo metodologias ágeis para quem deseja elevar o nível de suas entregas visuais. Seja você iniciante ou profissional, venha aprender a criar experiências que conectam marcas e pessoas."
    },
    {
      id: 3, 
      titulo: 'Show Patati & Patatá', 
      dataExibicao: '07 de Maio',
      horario: '14:00',
      datasOcorrencia: ['2026-05-07'],
      localNome: 'Espaço Itahy',
      enderecoCompleto: 'Rua Jorge Coelho, 98 - Itaim Bibi',
      cidade: 'Barueri', 
      uf: 'SP',
      preco: 40.00,
      imagem: 'https://itapeviacontece.com.br/wp-content/uploads/2025/10/IMG_8020.jpeg', 
      lat: -23.4988, 
      lng: -46.8458,
      categoria: ['Infantil', 'Música'],
      descricao: "O Sorriso Mais Patati e o Sorriso Mais Patatá chegam a Barueri para um espetáculo inesquecível! Com muita música, cores e números circenses, a dupla de palhaços mais amada do Brasil promete fazer a alegria da criançada e de toda a família no Espaço Itahy. Prepare o coração para cantar os maiores sucessos e viver momentos de pura magia."
    },
    {
      id: 4, 
      titulo: 'Feira de Intercâmbio', 
      dataExibicao: '26 de Maio',
      horario: '09:00',
      datasOcorrencia: ['2026-05-26'],
      localNome: 'Espaço Mandacaru',
      enderecoCompleto: 'Rua Manoel Pires, 1260 - Bom Repouso',
      cidade: 'Betim', 
      uf: 'MG',
      preco: 25.00,
      imagem: 'https://www.tvsorocaba.com.br/wp-content/uploads/2024/05/WhatsApp-Image-2024-05-22-at-11.54.59.jpeg', 
      lat: -23.5874, 
      lng: -46.6576,
      categoria: ['Educação'],
      descricao: "O mundo está ao seu alcance! A Feira de Intercâmbio em Betim reúne as melhores agências e instituições internacionais para tirar todas as suas dúvidas sobre cursos de idiomas, graduação e trabalho no exterior. Descubra destinos, custos e bolsas de estudo em um só lugar. O primeiro passo para a sua carreira global começa aqui."
    }, 
    {
      id: 5, 
      titulo: 'Babymetal', 
      dataExibicao: '27 de Outubro de 2027',
      horario: '20:30',
      datasOcorrencia: ['2027-10-27'],
      localNome: 'SESC Sorocaba',
      enderecoCompleto: 'Rua Barão de Piratininga, 555 - Jardim Faculdade',
      cidade: 'Sorocaba', 
      uf: 'SP',
      exibirMapa: true,
      preco: 250.00,
      imagem: 'https://rollingstone.com.br/wp-content/uploads/2025/05/conheca-a-banda-japonesa-babymetal-que-lanca-novo-album-em-breve.jpg', 
      lat: -19.9678, 
      lng: -44.1985,
      categoria: ['Música'],
      descricao: "O fenômeno japonês que revolucionou a música mundial desembarca in Sorocaba! Combinando o peso do Heavy Metal com a energia contagiante do J-Pop, o Babymetal apresenta uma performance eletrizante, coreografias impecáveis e uma produção visual de tirar o fôlego. Uma experiência sonora única que desafia gêneros e fronteiras."
    }, 
    {
      id: 6, 
      titulo: 'Jão - SUPERTURNÊ', 
      dataExibicao: '15 de Janeiro',
      horario: '20:45',
      datasOcorrencia: ['2026-01-15'],
      localNome: 'Allianz Parque',
      enderecoCompleto: 'Rua Palestra Itália, 200 - Água Branco ',
      cidade: 'São Paulo', 
      uf: 'SP',
      preco: 150.00, 
      imagem: 'https://bhdetalhes.com/wp-content/uploads/2024/02/Jao-superturne.jpg', 
      lat: -23.5273, 
      lng: -46.6785,
      exibirMapa: true,
      categoria: ['Música'],
      artista: ['Jão'],
      descricao: "Um dos maiores fenômenos do pop nacional chega ao Allianz Parque com a grandiosa SUPERTURNÊ. Dividido em atos que representam os quatro elementos (Terra, Ar, Água e Fogo), o show é uma celebração da discografia de Jão, unindo cenografia monumental e uma conexão visceral com os fãs. Prepare-se para cantar cada letra a plenos pulmões."
    },
    {
      id: 7,
      titulo: 'Lollapalooza',
      dataExibicao: '30 de Julho a 02 de Agosto',
      horario: 'A partir das 12:00',
      intervalo: { inicio: '2026-07-30', fim: '2026-08-02' },
      datasOcorrencia: [],
      localNome: 'Autódromo de Interlagos',
      enderecoCompleto: 'Avenida Senador Teotônio Vilela, 261 - Cidade Dutra',
      cidade: 'São Paulo',
      uf: 'SP',
      preco: 627.20,
      imagem: 'https://www.showmetech.com.br/wp-content/uploads//2025/08/Veja-o-Lineup-do-Lollapalooza-Brasil-2026.webp',
      categoria: ['Festival'],
      lat: -25.5273, 
      lng: -49.6785,
      exibirMapa: true,
      artista: ["Sabrina Carpenter", "Tyler, The Creator", "Linkin Park", "Deftones", "Chappell Roan", "Shawn Mendes", "Olivia Rodrigo"],
      descricao: "Quatro dias de música, arte e cultura em uma atmosfera incomparável. O Lollapalooza retorna ao Autódromo de Interlagos trazendo um lineup épico com os maiores nomes do indie, rock, eletrônica e hip-hop mundial.",
      acessibilidade: true,
      diasDetalhados: [
        {
          nomeSemana: 'Qui',
          numeroDia: '30',
          descricaoEspecifica: 'A abertura do festival vem com tudo na Quinta-Feira! Portões abrem meio-dia com ativações exclusivas e muita energia pop e indie.',
          artistasDoDia: ['Sabrina Carpenter', 'Chappell Roan']
        },
        {
          nomeSemana: 'Sex',
          numeroDia: '31',
          descricaoEspecifica: 'A sexta-feira do Lolla foca no peso e nas rimas trazendo o headliner do rap e do rock alternativo.',
          artistasDoDia: ['Tyler, The Creator', 'Deftones']
        },
        {
          nomeSemana: 'Sáb',
          numeroDia: '01',
          descricaoEspecifica: 'O sábado é o dia mais aguardado para os fãs do rock mundial. Clássicos e shows monumentais no palco principal.',
          artistasDoDia: ['Linkin Park']
        },
        {
          nomeSemana: 'Dom',
          numeroDia: '02',
          descricaoEspecifica: 'O encerramento do festival traz grandes hits do pop e momentos marcantes para fechar a edição de 2026 com chave de ouro.',
          artistasDoDia: ['Olivia Rodrigo', 'Shawn Mendes']
        }
      ]
    },
    {
      id: 8,
      titulo: 'Show do Bita - Festa dos Bichos',
      dataExibicao: '11 de Abril',
      horario: '14:30',
      datasOcorrencia: ['2026-04-11'],
      localNome: 'Teatro Bradesco',
      enderecoCompleto: 'Rua Palestra Itália, 500 - Perdizes',
      cidade: 'São Paulo',
      uf: 'SP',
      preco: 60.00,
      imagem: 'https://irp.cdn-website.com/2c226423/dms3rep/multi/mundo+bita+em+joinville.jpeg',
      categoria: ['Infantil', 'Música'],
      lat: -23.5270,
      lng: -46.6726,
      wifi: true,
      descricao: "O Mundo Bita convida todos os pequenos para a Festa dos Bichos! Neste espetáculo lúdico e educativo no Teatro Bradesco, Bita, Flora e toda a turma celebra a fauna brasileira com muita animação. Um show repleto de interação, cores e as canções que já acumulam bilhões de visualizações, ideal para a primeira experiência teatral das crianças."
    }
  ];

  constructor() { }

  getEventos(): Evento[] {
    return this.listaEventos;
  }

  limparTexto(texto: string): string {
    if (!texto) return '';
  
  return texto
    .normalize('NFD')                     // 1. Separa os acentos das letras
    .replace(/[\u0300-\u036f]/g, '')       // 2. Remove os acentos
    .toLowerCase()                        // 3. Coloca tudo em minúsculas
    .replace(/[^a-z0-9\s-]/g, '')         // 4. Remove pontuações (preserva letras, números, espaços e hifens)
    .replace(/\s+/g, '-')                 // 5. Transforma qualquer espaço em hífen
    .replace(/-+/g, '-')                  // 6. Junta múltiplos hifens (---) transformando em apenas um (-)
    .trim();
  }

  obterEventoPorSlug(slug: string): Evento | undefined {
    return this.listaEventos.find(evento => this.limparTexto(evento.titulo) === slug);
  }
}