// Sample data — used to build/preview the visual before connecting Sanity.
// When Sanity is wired, this is replaced by a GROQ query returning the same shape.

export const posts = [
  {
    slug: 'contestar-multas-excesso-velocidade-frota',
    title: 'Como contestar multas de excesso de velocidade na sua frota',
    tag: 'Gestão de Multas',
    excerpt:
      'Um guia prático para identificar vícios na autuação e aumentar a taxa de deferimento dos recursos da sua operação.',
    cover: 'sample-cover.jpg',
    author: { name: 'Equipe MultaZero', initials: 'MZ' },
    dateLabel: '2 jun 2026',
    date: '2026-06-02',
    readingTime: '6 min de leitura',
    tags: ['Multas', 'Recursos', 'Frotas'],
    body: `
      <p>Multas por excesso de velocidade estão entre as infrações mais comuns em frotas corporativas — e também entre as mais contestáveis. Para operações com dezenas ou centenas de veículos, o volume torna inviável tratar cada auto manualmente, e prazos perdidos viram pontos na CNH dos motoristas.</p>
      <p>A boa notícia: uma parcela relevante dessas autuações apresenta vícios formais que abrem espaço para recurso. O segredo está em padronizar a análise.</p>
      <h2>Comece pela análise do auto de infração</h2>
      <p>Antes de redigir qualquer defesa, verifique se o auto cumpre todos os requisitos legais. Os pontos que mais geram deferimento:</p>
      <ul>
        <li>Erro ou ausência na identificação do veículo (placa, marca, modelo).</li>
        <li>Falta de comprovação da aferição do equipamento medidor (radar) pelo Inmetro.</li>
        <li>Sinalização de velocidade ausente ou irregular no trecho.</li>
        <li>Inconsistências entre data, hora e local da infração.</li>
      </ul>
      <blockquote>Nenhuma empresa idônea garante o cancelamento — o que se entrega é a melhor defesa possível, maximizando a taxa de deferimentos.</blockquote>
      <h2>Padronize o fluxo de recursos</h2>
      <p>Centralize todas as infrações em um único pipeline, com alertas de prazo e modelos de defesa por tipo de infração. Assim, sua equipe deixa de apagar incêndios e passa a trabalhar de forma preventiva — protegendo o caixa e os motoristas.</p>
    `,
  },
  {
    slug: 'erros-gestao-frota-custam-caro',
    title: '5 erros de gestão de frota que custam caro (e como evitá-los)',
    tag: 'Gestão de Frotas',
    excerpt:
      'Da falta de centralização de multas ao descontrole de prazos: os deslizes mais comuns e o impacto direto no seu caixa.',
    cover: 'sample-cover.jpg',
    author: { name: 'Equipe MultaZero', initials: 'MZ' },
    dateLabel: '28 mai 2026',
    date: '2026-05-28',
    readingTime: '5 min de leitura',
    tags: ['Frotas', 'Operação', 'Custos'],
    body: `
      <p>Gerir uma frota é equilibrar prazos, custos e pessoas. Pequenos descuidos, repetidos em escala, viram prejuízos relevantes no fim do mês. Veja os cinco erros mais frequentes.</p>
      <h2>1. Multas espalhadas em planilhas</h2>
      <p>Sem uma fonte única de verdade, prazos passam despercebidos e recursos deixam de ser feitos. Centralizar é o primeiro passo.</p>
      <h2>2. Não acompanhar o desconto de pagamento antecipado</h2>
      <p>Multas pagas com antecedência podem ter desconto. Ignorar isso é deixar dinheiro na mesa todos os meses.</p>
      <h2>3. Indicação de condutor no improviso</h2>
      <p>Sem um fluxo definido, a indicação atrasa e os pontos recaem sobre a empresa ou o motorista errado.</p>
      <blockquote>Cada ponto evitado na CNH de um motorista é um motorista a mais disponível na estrada.</blockquote>
      <h2>4. Falta de visibilidade por condutor</h2>
      <p>Sem score por motorista, fica difícil agir preventivamente sobre quem mais gera infrações.</p>
      <h2>5. Tratar tudo manualmente</h2>
      <p>Automação não substitui o gestor — libera o gestor para decisões estratégicas.</p>
    `,
  },
  {
    slug: 'pontos-cnh-proteger-motoristas',
    title: 'Pontos na CNH: como proteger os motoristas da sua frota',
    tag: 'Compliance',
    excerpt:
      'Estratégias de indicação de condutor e gestão preventiva para manter sua equipe habilitada e na estrada.',
    cover: 'sample-cover.jpg',
    author: { name: 'Equipe MultaZero', initials: 'MZ' },
    dateLabel: '20 mai 2026',
    date: '2026-05-20',
    readingTime: '4 min de leitura',
    tags: ['CNH', 'Compliance', 'Motoristas'],
    body: `
      <p>A CNH é o ativo mais importante de um motorista profissional. Proteger a pontuação é proteger a operação — e isso começa com processos claros.</p>
      <h2>Indicação de condutor sempre em dia</h2>
      <p>Um fluxo automatizado de indicação garante que o ponto recaia sobre o responsável correto, dentro do prazo legal.</p>
      <h2>Gestão preventiva por score</h2>
      <p>Acompanhe a pontuação de cada condutor em tempo real e atue antes que o limite seja atingido, com treinamento e feedback.</p>
      <p>Combinando indicação ágil e visão por motorista, sua frota reduz suspensões e mantém a equipe produtiva.</p>
    `,
  },
];

export const getPost = (slug) => posts.find((p) => p.slug === slug);
