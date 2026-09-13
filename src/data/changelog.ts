// Notas de atualização do Pet-Encanto — aparecem em /admin/updates.
// Cada dia de trabalho vira UM patch (versão), com uma ou mais seções.
//
// Regras:
//  - mais recente PRIMEIRO;
//  - `id` estável — usa a versão (ex.: "1.1");
//  - versão sobe o MINOR a cada patch (1.0, 1.1, 1.2…).

export type ChangeKind = 'novo' | 'melhoria' | 'correção'

export interface ChangelogSection {
  title: string
  changes: { kind: ChangeKind; text: string }[]
}

export interface ChangelogEntry {
  id: string
  version: string
  /** ISO "YYYY-MM-DD". */
  date: string
  sections: ChangelogSection[]
}

export const CHANGELOG: ChangelogEntry[] = [
  {
    id: '2.2',
    version: '2.2',
    date: '2026-09-13',
    sections: [
      {
        title: 'Landing page — redesign completo',
        changes: [
          {
            kind: 'novo',
            text: 'Botão "Agende pelo WhatsApp" no menu, no banner e num novo banner de destaque — separado do login do dono.',
          },
          {
            kind: 'novo',
            text: 'Serviços ganham ícone e descrição; cada um tem um link direto pra agendar pelo WhatsApp.',
          },
          {
            kind: 'novo',
            text: 'Nova seção "Por que confiar" com os diferenciais do petshop.',
          },
          {
            kind: 'novo',
            text: 'Botão "Como chegar" na seção de contato, abre o endereço direto no Google Maps.',
          },
          {
            kind: 'melhoria',
            text: 'Visual todo revisado: cards mais arredondados, sombras suaves, e a Galeria e o Rodapé ganharam mais destaque.',
          },
        ],
      },
    ],
  },
  {
    id: '2.1',
    version: '2.1',
    date: '2026-09-13',
    sections: [
      {
        title: 'Landing page',
        changes: [
          {
            kind: 'melhoria',
            text: 'Menu do topo agora é uma pílula flutuante arredondada, em vez de uma faixa colada nas bordas.',
          },
          {
            kind: 'melhoria',
            text: 'Patinhas decorativas se repetem em todas as seções (antes só apareciam no banner).',
          },
          {
            kind: 'correção',
            text: 'Texto branco do menu tinha contraste fraco com o fundo verde — ajustado para um tom mais escuro.',
          },
        ],
      },
    ],
  },
  {
    id: '2.0',
    version: '2.0',
    date: '2026-09-13',
    sections: [
      {
        title: 'Landing page',
        changes: [
          {
            kind: 'melhoria',
            text: 'Novo banner de entrada: título "Bem-vindos!" em destaque, com patinhas decorativas e botões de ação.',
          },
          {
            kind: 'melhoria',
            text: 'Menu do topo virou uma faixa colorida, mais chamativa.',
          },
        ],
      },
    ],
  },
  {
    id: '1.9',
    version: '1.9',
    date: '2026-09-11',
    sections: [
      {
        title: 'Painel',
        changes: [
          {
            kind: 'novo',
            text: 'Painel agora mostra a agenda do dia, o resumo financeiro do mês e um resumo rápido (clientes, pets, atendimentos hoje, receita do mês).',
          },
        ],
      },
    ],
  },
  {
    id: '1.8',
    version: '1.8',
    date: '2026-09-11',
    sections: [
      {
        title: 'Financeiro',
        changes: [
          {
            kind: 'novo',
            text: 'Aba Financeiro: receita, valor a receber, despesas e saldo, com filtro por período (hoje, semana, mês ou intervalo customizado).',
          },
          {
            kind: 'novo',
            text: 'Receita separada por forma de pagamento (dinheiro, cartão, pix, outro) e por dia.',
          },
          {
            kind: 'novo',
            text: 'Lançamento de despesas do petshop, com valor e data.',
          },
          {
            kind: 'melhoria',
            text: 'Atendimentos agora registram a forma de pagamento quando marcados como pagos.',
          },
        ],
      },
    ],
  },
  {
    id: '1.7',
    version: '1.7',
    date: '2026-09-11',
    sections: [
      {
        title: 'Clubinho',
        changes: [
          {
            kind: 'novo',
            text: 'Aba Clubinho: cadastre um atendimento recorrente (semanal, quinzenal ou mensal) e o sistema já agenda os próximos 3 meses sozinho.',
          },
          {
            kind: 'novo',
            text: 'Dá pra pausar, retomar, cancelar ou gerar mais atendimentos de um clubinho a qualquer momento.',
          },
          {
            kind: 'melhoria',
            text: 'Atendimentos gerados por um clubinho ganham a etiqueta "clubinho" na lista de Atendimentos.',
          },
        ],
      },
    ],
  },
  {
    id: '1.6',
    version: '1.6',
    date: '2026-09-11',
    sections: [
      {
        title: 'Nova cara do app',
        changes: [
          {
            kind: 'novo',
            text: 'Logo oficial do Pet Encanto agora aparece na sidebar, no login e no site.',
          },
          {
            kind: 'melhoria',
            text: 'Fonte de destaque para o nome "Pet Encanto", combinando com a identidade visual.',
          },
          {
            kind: 'melhoria',
            text: 'Cores ajustadas: marrom nos botões (melhor contraste), verde sálvia para status positivo, dourado para destaques.',
          },
          {
            kind: 'melhoria',
            text: 'Painel administrativo com visual em cards arredondados; cabeçalho com avatar do usuário.',
          },
          {
            kind: 'correção',
            text: 'Todo botão e link agora mostra a mãozinha (cursor) e reage ao passar o mouse.',
          },
        ],
      },
    ],
  },
  {
    id: '1.5',
    version: '1.5',
    date: '2026-09-11',
    sections: [
      {
        title: 'Nova identidade visual',
        changes: [
          {
            kind: 'melhoria',
            text: 'Paleta de cores do app inteiro trocada: marrom, verde sálvia, dourado, creme e bege claro.',
          },
        ],
      },
      {
        title: 'Atendimentos',
        changes: [
          {
            kind: 'novo',
            text: 'Dá pra abrir um atendimento sem cliente cadastrado ("avulso"): nome e telefone do cliente, animal, raça e observações (temperamento, alergia, etc.) direto no formulário.',
          },
          {
            kind: 'novo',
            text: 'Editar atendimento agora é completo: dá pra mudar serviço, data, horário, valor, pago e status num só lugar.',
          },
        ],
      },
    ],
  },
  {
    id: '1.4',
    version: '1.4',
    date: '2026-09-11',
    sections: [
      {
        title: 'Mobile',
        changes: [
          {
            kind: 'melhoria',
            text: 'Menu do painel administrativo agora abre como uma gaveta (drawer) no celular, em vez de ocupar a tela toda.',
          },
          {
            kind: 'melhoria',
            text: 'Menu da página inicial vira um botão de hambúrguer no celular.',
          },
          {
            kind: 'correção',
            text: 'Telas de Clientes, Atendimentos e Configurações não estouram mais a largura em telas pequenas.',
          },
        ],
      },
    ],
  },
  {
    id: '1.3',
    version: '1.3',
    date: '2026-09-11',
    sections: [
      {
        title: 'Atendimentos',
        changes: [
          {
            kind: 'melhoria',
            text: '"Agenda" e "Serviços" viram uma única aba: Atendimentos. Cadastrar e visualizar ficou num só lugar.',
          },
          {
            kind: 'novo',
            text: 'Cada atendimento agora tem valor cobrado (editável, vem sugerido do catálogo) e marcação de pago/não pago.',
          },
          {
            kind: 'novo',
            text: 'O catálogo de tipos de serviço (preço base, duração, visibilidade no site) foi para Configurações.',
          },
        ],
      },
    ],
  },
  {
    id: '1.2',
    version: '1.2',
    date: '2026-09-11',
    sections: [
      {
        title: 'Serviços & Agenda',
        changes: [
          {
            kind: 'novo',
            text: 'Catálogo de serviços (banho, tosa, etc.) com preço, duração e opção de aparecer no site.',
          },
          {
            kind: 'novo',
            text: 'Agenda diária de atendimentos: criar, marcar como concluído, cancelar ou apagar.',
          },
        ],
      },
      {
        title: 'Clientes',
        changes: [
          {
            kind: 'melhoria',
            text: 'Formulários de cliente e pet agora abrem em janela (modal) em vez de empurrar a lista.',
          },
          {
            kind: 'melhoria',
            text: 'Cards com avatar, ícones de contato e botão "Ver detalhes".',
          },
        ],
      },
    ],
  },
  {
    id: '1.1',
    version: '1.1',
    date: '2026-09-11',
    sections: [
      {
        title: 'Clientes & Pets',
        changes: [
          {
            kind: 'novo',
            text: 'Cadastro de clientes (donos dos pets): nome, telefone, e-mail e endereço.',
          },
          {
            kind: 'novo',
            text: 'Cada cliente pode ter vários pets cadastrados (espécie, raça e porte).',
          },
          {
            kind: 'novo',
            text: 'Busca de clientes por nome na área administrativa.',
          },
        ],
      },
    ],
  },
  {
    id: '1.0',
    version: '1.0',
    date: '2026-09-11',
    sections: [
      {
        title: 'Primeira versão no ar',
        changes: [
          {
            kind: 'novo',
            text: 'Landing page pública com serviços, mostruário, galeria e contato.',
          },
          {
            kind: 'novo',
            text: 'Login do dono e área administrativa protegida.',
          },
          {
            kind: 'novo',
            text: 'App publicado: site na Vercel, API no Render e banco no Neon.',
          },
        ],
      },
    ],
  },
]
