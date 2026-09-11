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
