/**
 * Utilitários de manipulação e formatação de datas.
 */

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric'
});

/**
 * Retorna a data no formato legível brasileiro DD/MM/AAAA.
 * @param {string | Date} dateInput - Data em formato ISO (YYYY-MM-DD) ou objeto Date.
 * @returns {string}
 */
export function formatDate(dateInput) {
  if (!dateInput) return '';
  try {
    // Trata datas "YYYY-MM-DD" para não sofrer deslocamento de fuso horário
    if (typeof dateInput === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
      const [year, month, day] = dateInput.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      return dateFormatter.format(date);
    }
    const date = new Date(dateInput);
    return isNaN(date.getTime()) ? '' : dateFormatter.format(date);
  } catch {
    return '';
  }
}

/**
 * Retorna a chave de mês/ano no formato "YYYY-MM" (ex: "2026-10").
 * @param {string} dateInput
 * @returns {string}
 */
export function getMonthYearKey(dateInput) {
  if (!dateInput || typeof dateInput !== 'string') return '';
  return dateInput.slice(0, 7);
}

/**
 * Formata a chave "YYYY-MM" em nome legível (ex: "Outubro de 2026").
 * @param {string} monthKey
 * @returns {string}
 */
export function formatMonthYear(monthKey) {
  if (!monthKey || !/^\d{4}-\d{2}$/.test(monthKey)) return 'Todos os períodos';
  const [year, month] = monthKey.split('-').map(Number);
  const date = new Date(year, month - 1, 1);
  const name = date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  return name.charAt(0).toUpperCase() + name.slice(1);
}

/**
 * Retorna a data atual no formato ISO YYYY-MM-DD para inicializar inputs de data.
 * @returns {string}
 */
export function getTodayISODate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
