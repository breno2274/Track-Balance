/**
 * Configurações e constantes globais do Track Balance.
 */

export const STORAGE_KEY = 'trackbalance.transactions_v1';

export const TRANSACTION_TYPES = {
  INCOME: 'income',
  EXPENSE: 'expense'
};

export const CATEGORIES = {
  income: [
    'Salário',
    'Investimentos',
    'Freelance',
    'Benefícios',
    'Outros'
  ],
  expense: [
    'Moradia',
    'Alimentação',
    'Transporte',
    'Lazer',
    'Saúde',
    'Educação',
    'Assinaturas',
    'Outros'
  ]
};

/**
 * Cores para o gráfico de categorias
 */
export const CATEGORY_COLORS = {
  'Moradia': '#8b5cf6',
  'Alimentação': '#ec4899',
  'Transporte': '#3b82f6',
  'Lazer': '#f59e0b',
  'Saúde': '#10b981',
  'Educação': '#06b6d4',
  'Assinaturas': '#6366f1',
  'Salário': '#10b981',
  'Investimentos': '#06b6d4',
  'Freelance': '#8b5cf6',
  'Benefícios': '#3b82f6',
  'Outros': '#64748b'
};

/**
 * Massa de dados demonstrativa inicial (Seed Data)
 * Permite ao recrutador/avaliador testar a riqueza do dashboard com 1 clique.
 */
export const SEED_TRANSACTIONS = [
  {
    id: 'seed-01',
    description: 'Salário Tech Lead / Desenvolvedor',
    amount: 5400.00,
    type: 'income',
    category: 'Salário',
    date: '2026-10-02',
    createdAt: '2026-10-02T09:00:00.000Z'
  },
  {
    id: 'seed-02',
    description: 'Aluguel & Condomínio',
    amount: 1450.00,
    type: 'expense',
    category: 'Moradia',
    date: '2026-10-05',
    createdAt: '2026-10-05T10:00:00.000Z'
  },
  {
    id: 'seed-03',
    description: 'Supermercado Mensal',
    amount: 620.40,
    type: 'expense',
    category: 'Alimentação',
    date: '2026-10-07',
    createdAt: '2026-10-07T14:30:00.000Z'
  },
  {
    id: 'seed-04',
    description: 'Projeto Freelance Front-end',
    amount: 1200.00,
    type: 'income',
    category: 'Freelance',
    date: '2026-10-08',
    createdAt: '2026-10-08T16:00:00.000Z'
  },
  {
    id: 'seed-05',
    description: 'Combustível & Transporte',
    amount: 280.00,
    type: 'expense',
    category: 'Transporte',
    date: '2026-10-09',
    createdAt: '2026-10-09T18:15:00.000Z'
  },
  {
    id: 'seed-06',
    description: 'Netflix, Spotify & ChatGPT',
    amount: 135.90,
    type: 'expense',
    category: 'Assinaturas',
    date: '2026-10-10',
    createdAt: '2026-10-10T11:20:00.000Z'
  },
  {
    id: 'seed-07',
    description: 'Jantar com Amigos',
    amount: 185.00,
    type: 'expense',
    category: 'Lazer',
    date: '2026-10-11',
    createdAt: '2026-10-11T21:40:00.000Z'
  },
  {
    id: 'seed-08',
    description: 'Rendimento de FIIs e Dividendos',
    amount: 245.50,
    type: 'income',
    category: 'Investimentos',
    date: '2026-10-12',
    createdAt: '2026-10-12T08:00:00.000Z'
  }
];
