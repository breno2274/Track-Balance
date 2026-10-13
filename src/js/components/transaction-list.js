/**
 * Componente da Tabela e Lista de Transações (TransactionList).
 * Lida com a renderização segura e os eventos de ação (editar e excluir).
 */

import { formatCurrency } from '../utils/currency.js';
import { formatDate } from '../utils/dates.js';

export class TransactionList {
  /**
   * @param {HTMLElement} tableBody
   * @param {HTMLElement} counterElement
   * @param {Object} callbacks
   * @param {(id: string) => void} callbacks.onEdit
   * @param {(id: string) => void} callbacks.onDelete
   */
  constructor(tableBody, counterElement, { onEdit, onDelete }) {
    this.tableBody = tableBody;
    this.counterElement = counterElement;
    this.onEdit = onEdit;
    this.onDelete = onDelete;

    this.bindEvents();
  }

  /**
   * Configura delegação de eventos para botões de ação na tabela.
   */
  bindEvents() {
    if (!this.tableBody) return;

    this.tableBody.addEventListener('click', (event) => {
      const target = event.target;
      const editBtn = target.closest('[data-action="edit"]');
      const deleteBtn = target.closest('[data-action="delete"]');

      if (editBtn) {
        const id = editBtn.getAttribute('data-id');
        if (id && this.onEdit) this.onEdit(id);
      } else if (deleteBtn) {
        const id = deleteBtn.getAttribute('data-id');
        if (id && this.onDelete) this.onDelete(id);
      }
    });
  }

  /**
   * Renderiza a listagem de transações.
   * @param {Array<Object>} transactions
   */
  render(transactions = []) {
    if (!this.tableBody) return;

    if (this.counterElement) {
      this.counterElement.textContent = `${transactions.length} ${
        transactions.length === 1 ? 'registro' : 'registros'
      }`;
    }

    if (transactions.length === 0) {
      this.tableBody.innerHTML = `
        <tr>
          <td colspan="5">
            <div class="empty-state">
              <div class="empty-icon" aria-hidden="true">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="m4.93 4.93 14.14 14.14"/>
                </svg>
              </div>
              <h3 class="empty-title">Nenhuma transação encontrada</h3>
              <p class="empty-text">Não há registros para os filtros selecionados ou nenhuma transação foi cadastrada ainda.</p>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    const rowsHtml = transactions
      .map((tx) => {
        const isIncome = tx.type === 'income';
        const sign = isIncome ? '+' : '-';
        const typeBadge = isIncome
          ? `<span class="badge badge-income" aria-label="Receita">↑ Receita</span>`
          : `<span class="badge badge-expense" aria-label="Despesa">↓ Despesa</span>`;

        return `
          <tr data-transaction-id="${tx.id}">
            <td>
              <div class="transaction-desc">${this.escapeHtml(tx.description)}</div>
              <div class="transaction-date">${formatDate(tx.date)}</div>
            </td>
            <td>
              <span class="badge badge-category">${this.escapeHtml(tx.category)}</span>
            </td>
            <td>
              ${typeBadge}
            </td>
            <td>
              <span class="transaction-amount ${isIncome ? 'income' : 'expense'}">
                ${sign}${formatCurrency(tx.amount)}
              </span>
            </td>
            <td style="text-align: right;">
              <div style="display: inline-flex; gap: 6px;">
                <button
                  type="button"
                  class="btn-icon"
                  data-action="edit"
                  data-id="${tx.id}"
                  aria-label="Editar transação ${this.escapeHtml(tx.description)}"
                  title="Editar"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                    <path d="m15 5 4 4"/>
                  </svg>
                </button>
                <button
                  type="button"
                  class="btn-icon"
                  data-action="delete"
                  data-id="${tx.id}"
                  aria-label="Excluir transação ${this.escapeHtml(tx.description)}"
                  title="Excluir"
                  style="color: var(--color-expense-light);"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M3 6h18"/>
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        `;
      })
      .join('');

    this.tableBody.innerHTML = rowsHtml;
  }

  /**
   * Sanitiza strings prevenindo injeções no innerHTML.
   * @param {string} str
   * @returns {string}
   */
  escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}
