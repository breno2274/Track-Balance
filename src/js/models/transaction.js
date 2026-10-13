/**
 * Model de Transação Financeira.
 * Fábrica responsável por instanciar e padronizar o esquema da entidade.
 */

/**
 * @typedef {Object} Transaction
 * @property {string} id - Identificador único UUIDv4
 * @property {string} description - Descrição clara do lançamento
 * @property {number} amount - Valor monetário sempre positivo
 * @property {'income' | 'expense'} type - Tipo da transação
 * @property {string} category - Categoria associada
 * @property {string} date - Data ISO YYYY-MM-DD
 * @property {string} createdAt - Data/hora de registro no sistema
 */

/**
 * Cria uma nova instância de Transação validada.
 * @param {Object} params
 * @param {string} [params.id]
 * @param {string} params.description
 * @param {number} params.amount
 * @param {'income' | 'expense'} params.type
 * @param {string} params.category
 * @param {string} params.date
 * @param {string} [params.createdAt]
 * @returns {Transaction}
 */
export function createTransaction({
  id = generateUUID(),
  description,
  amount,
  type,
  category,
  date,
  createdAt = new Date().toISOString()
}) {
  return {
    id,
    description: String(description).trim(),
    amount: Math.round(Math.abs(Number(amount)) * 100) / 100,
    type: type === 'income' ? 'income' : 'expense',
    category: String(category).trim(),
    date: String(date).trim(),
    createdAt
  };
}

/**
 * Gera um UUIDv4 compatível com browsers modernos e ambientes de teste Node.js.
 * @returns {string}
 */
function generateUUID() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
