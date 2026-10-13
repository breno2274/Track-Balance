/**
 * Configurações e constantes globais do Track Balance.
 */

export const STORAGE_KEY = 'trackbalance.transactions_v2';

export const TRANSACTION_TYPES = {
  INCOME: 'income',
  EXPENSE: 'expense'
};

export const CATEGORIES = {
  income: [
    'Salário',
    'Renda',
    'Investimentos',
    'Freelance',
    'Outros'
  ],
  expense: [
    'Alimentação',
    'Transporte',
    'Moradia',
    'Lazer',
    'Saúde',
    'Educação',
    'Outros'
  ]
};

/**
 * Cores temáticas das categorias para o gráfico
 */
export const CATEGORY_COLORS = {
  'Alimentação': '#10b981',
  'Transporte': '#06b6d4',
  'Moradia': '#22c55e',
  'Lazer': '#14532d',
  'Outros': '#334155',
  'Salário': '#10b981',
  'Renda': '#10b981',
  'Investimentos': '#3b82f6',
  'Freelance': '#8b5cf6',
  'Saúde': '#ec4899',
  'Educação': '#f59e0b'
};

/**
 * Massa de dados inicial calibrada exatamente com a interface de referência:
 * Receitas: R$ 5.200,00 | Despesas: R$ 2.350,00 | Saldo: R$ 2.850,00
 */
export const SEED_TRANSACTIONS = [
  {
    id: 'tx-01',
    description: 'Mercado',
    amount: 120.00,
    type: 'expense',
    category: 'Alimentação',
    date: '2026-10-12',
    createdAt: '2026-10-12T14:00:00.000Z'
  },
  {
    id: 'tx-02',
    description: 'Salário',
    amount: 5200.00,
    type: 'income',
    category: 'Salário',
    date: '2026-10-10',
    createdAt: '2026-10-10T09:00:00.000Z'
  },
  {
    id: 'tx-03',
    description: 'Uber',
    amount: 45.00,
    type: 'expense',
    category: 'Transporte',
    date: '2026-10-09',
    createdAt: '2026-10-09T18:30:00.000Z'
  },
  {
    id: 'tx-04',
    description: 'Academia',
    amount: 89.90,
    type: 'expense',
    category: 'Lazer',
    date: '2026-10-08',
    createdAt: '2026-10-08T07:15:00.000Z'
  },
  {
    id: 'tx-05',
    description: 'Supermercado Mensal',
    amount: 700.00,
    type: 'expense',
    category: 'Alimentação',
    date: '2026-10-06',
    createdAt: '2026-10-06T15:20:00.000Z'
  },
  {
    id: 'tx-06',
    description: 'Combustível',
    amount: 475.00,
    type: 'expense',
    category: 'Transporte',
    date: '2026-10-05',
    createdAt: '2026-10-05T11:45:00.000Z'
  },
  {
    id: 'tx-07',
    description: 'Aluguel / Condomínio',
    amount: 480.00,
    type: 'expense',
    category: 'Moradia',
    date: '2026-10-04',
    createdAt: '2026-10-04T10:00:00.000Z'
  },
  {
    id: 'tx-08',
    description: 'Cinema e Restaurante',
    amount: 220.10,
    type: 'expense',
    category: 'Lazer',
    date: '2026-10-03',
    createdAt: '2026-10-03T20:00:00.000Z'
  },
  {
    id: 'tx-09',
    description: 'Outras despesas operacionais',
    amount: 220.00,
    type: 'expense',
    category: 'Outros',
    date: '2026-10-02',
    createdAt: '2026-10-02T16:00:00.000Z'
  }
];
