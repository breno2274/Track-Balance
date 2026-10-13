/**
 * Serviço de Cálculos e Regras de Negócio Financeiras.
 * Funções puras, desacopladas de qualquer dependência visual ou de navegador.
 */

/**
 * Arredonda um número float para duas casas decimais com precisão.
 * @param {number} value
 * @returns {number}
 */
function roundCurrency(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/**
 * Calcula o saldo consolidado de uma lista de transações.
 * @param {Array<{ amount: number, type: 'income' | 'expense' }>} transactions
 * @returns {number}
 */
export function calculateBalance(transactions = []) {
  if (!Array.isArray(transactions) || transactions.length === 0) {
    return 0;
  }
  const total = transactions.reduce((acc, tx) => {
    const val = Number(tx.amount) || 0;
    return tx.type === 'income' ? acc + val : acc - val;
  }, 0);

  return roundCurrency(total);
}

/**
 * Gera o resumo consolidado com receitas, despesas, saldo e percentuais.
 * @param {Array<{ amount: number, type: 'income' | 'expense' }>} transactions
 * @returns {{ income: number, expenses: number, balance: number, savingsRate: number, expenseRatio: number }}
 */
export function calculateSummary(transactions = []) {
  if (!Array.isArray(transactions) || transactions.length === 0) {
    return {
      income: 0,
      expenses: 0,
      balance: 0,
      savingsRate: 0,
      expenseRatio: 0
    };
  }

  const income = roundCurrency(
    transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0)
  );

  const expenses = roundCurrency(
    transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0)
  );

  const balance = roundCurrency(income - expenses);

  // Taxa de Poupança (quanto das receitas sobrou como saldo)
  let savingsRate = 0;
  if (income > 0) {
    savingsRate = roundCurrency((balance / income) * 100);
  }

  // Percentual do orçamento consumido
  let expenseRatio = 0;
  if (income > 0) {
    expenseRatio = roundCurrency((expenses / income) * 100);
  } else if (expenses > 0) {
    expenseRatio = 100;
  }

  return {
    income,
    expenses,
    balance,
    savingsRate,
    expenseRatio
  };
}

/**
 * Agrupa os valores de despesas ou receitas por categoria.
 * @param {Array<{ amount: number, type: string, category: string }>} transactions
 * @param {'expense' | 'income'} [type='expense']
 * @returns {Record<string, number>} Dicionário ordenado com categoria -> total
 */
export function calculateCategoryTotals(transactions = [], type = 'expense') {
  if (!Array.isArray(transactions)) {
    return {};
  }

  const filtered = transactions.filter((t) => t.type === type);
  const totals = {};

  for (const tx of filtered) {
    const cat = tx.category || 'Outros';
    const amount = Number(tx.amount) || 0;
    totals[cat] = (totals[cat] || 0) + amount;
  }

  // Arredonda e ordena de forma decrescente
  const sortedEntries = Object.entries(totals)
    .map(([cat, val]) => [cat, roundCurrency(val)])
    .sort((a, b) => b[1] - a[1]);

  return Object.fromEntries(sortedEntries);
}

/**
 * Agrupa o histórico mensal de receitas e despesas ordenado cronologicamente.
 * @param {Array<{ amount: number, type: string, date: string }>} transactions
 * @returns {{ labels: string[], incomeData: number[], expenseData: number[] }}
 */
export function calculateMonthlyEvolution(transactions = []) {
  if (!Array.isArray(transactions) || transactions.length === 0) {
    return { labels: [], incomeData: [], expenseData: [] };
  }

  const monthsMap = new Map();

  for (const tx of transactions) {
    if (!tx.date) continue;
    const monthKey = tx.date.slice(0, 7); // 'YYYY-MM'
    if (!monthsMap.has(monthKey)) {
      monthsMap.set(monthKey, { income: 0, expense: 0 });
    }
    const current = monthsMap.get(monthKey);
    const amount = Number(tx.amount) || 0;
    if (tx.type === 'income') {
      current.income += amount;
    } else if (tx.type === 'expense') {
      current.expense += amount;
    }
  }

  // Ordena os meses cronologicamente
  const sortedMonths = Array.from(monthsMap.keys()).sort();

  const labels = [];
  const incomeData = [];
  const expenseData = [];

  for (const key of sortedMonths) {
    const [year, month] = key.split('-');
    const monthShortNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const monthIndex = parseInt(month, 10) - 1;
    const label = `${monthShortNames[monthIndex] || month}/${year.slice(2)}`;

    labels.push(label);
    const data = monthsMap.get(key);
    incomeData.push(roundCurrency(data.income));
    expenseData.push(roundCurrency(data.expense));
  }

  return { labels, incomeData, expenseData };
}
