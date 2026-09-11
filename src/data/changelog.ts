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
