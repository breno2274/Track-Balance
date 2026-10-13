/**
 * Utilitários para formatação e manipulação de valores monetários.
 */

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

/**
 * Formata um valor numérico para a moeda brasileira (ex: R$ 1.250,50).
 * @param {number} value
 * @returns {string}
 */
export function formatCurrency(value) {
  const numericValue = typeof value === 'number' && !isNaN(value) ? value : 0;
  return currencyFormatter.format(numericValue);
}

/**
 * Converte uma entrada de texto de valor monetário para número float seguro.
 * @param {string | number} input
 * @returns {number}
 */
export function parseCurrencyInput(input) {
  if (typeof input === 'number') {
    return Math.abs(input);
  }
  if (!input || typeof input !== 'string') {
    return 0;
  }
  // Normaliza vírgula para ponto e remove caracteres não numéricos exceto ponto e vírgula
  const cleaned = input
    .replace(/[^\d.,]/g, '')
    .replace(',', '.');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : Math.round(parsed * 100) / 100;
}
