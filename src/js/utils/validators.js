/**
 * Funções de validação de formulários e integridade de dados.
 */

/**
 * Valida os dados de entrada de uma transação.
 * @param {Object} data
 * @param {string} data.description
 * @param {number} data.amount
 * @param {string} data.type
 * @param {string} data.category
 * @param {string} data.date
 * @returns {{ isValid: boolean, errors: Record<string, string> }}
 */
export function validateTransaction(data) {
  const errors = {};

  if (!data.description || typeof data.description !== 'string' || data.description.trim().length < 2) {
    errors.description = 'A descrição deve ter no mínimo 2 caracteres.';
  }

  if (typeof data.amount !== 'number' || isNaN(data.amount) || data.amount <= 0) {
    errors.amount = 'Informe um valor numérico positivo e maior que zero.';
  }

  if (!['income', 'expense'].includes(data.type)) {
    errors.type = 'O tipo deve ser "income" (receita) ou "expense" (despesa).';
  }

  if (!data.category || typeof data.category !== 'string' || data.category.trim() === '') {
    errors.category = 'Selecione uma categoria válida.';
  }

  if (!data.date || !/^\d{4}-\d{2}-\d{2}$/.test(data.date)) {
    errors.date = 'Selecione uma data válida no formato AAAA-MM-DD.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}
