/**
 * Componente de Lista de Transações Recentes e Tabela Completa (TransactionList).
 */

import { formatCurrency } from '../utils/currency.js';
import { formatDate } from '../utils/dates.js';

export class TransactionList {
  /**
   * @param {Object} options
   * @param {HTMLElement} options.recentContainer - Container da lista de recentes no card
   * @param {HTMLElement} [options.fullTableBody] - Tbody da tabela no modal completo
   * @param {HTMLElement} [options.recordsCounter] - Contador de registros
   * @param {Object} callbacks
   * @param {(id: string) => void} callbacks.onEdit
   * @param {(id: string) => void} callbacks.onDelete
   */
  constructor({ recentContainer, fullTableBody, recordsCounter }, { onEdit, onDelete }) {
    this.recentContainer = recentContainer;
    this.fullTableBody = fullTableBody;
    this.recordsCounter = recordsCounter;
    this.onEdit = onEdit;
    this.onDelete = onDelete;

    this.bindEvents();
  }

  /**
   * Delegação de eventos para botões de ação na tabela completa.
   */
  bindEvents() {
    if (this.fullTableBody) {
      this.fullTableBody.addEventListener('click', (event) => {
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
  }

  /**
   * Retorna um ícone SVG contextualizado pela categoria da transação.
   * @param {string} category
   * @returns {string}
   */
  getCategoryIcon(category = '') {
    const cat = category.toLowerCase();
    if (cat.includes('aliment') || cat.includes('mercado') || cat.includes('supermercado')) {
      return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>`;
    }
    if (cat.includes('transporte') || cat.includes('uber') || cat.includes('combust')) {
      return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>`;
    }
    if (cat.includes('salário') || cat.includes('renda') || cat.includes('invest')) {
      return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="7" rx="2"/><line x1="16" x2="16.01" y1="2" y2="2"/><path d="M12 22v-4"/><path d="M12 8a2 2 0 1 0 0 4 2 2 0 1 0 0-4Z"/></svg>`;
    }
    if (cat.includes('lazer') || cat.includes('acad') || cat.includes('saúde')) {
      return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6.5 6.5 11 11"/><path d="m21 21-1-1"/><path d="m3 3 1 1"/><path d="m18 22 4-4"/><path d="m2 6 4-4"/><path d="m3 10 7-7"/><path d="m14 21 7-7"/></svg>`;
    }
    return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
  }

  /**
   * Renderiza os itens recentes no card e atualiza a tabela completa.
   * @param {Array<Object>} transactions
   */
  render(transactions = []) {
    // 1. Renderiza no card compacto de "Transações Recentes" (Top 4)
    if (this.recentContainer) {
      if (transactions.length === 0) {
        this.recentContainer.innerHTML = `
          <div style="font-size: 0.78rem; color: var(--color-text-muted); text-align: center; padding: 1.5rem 0;">
            Nenhuma transação recente encontrada.
          </div>
        `;
      } else {
        const topRecent = transactions.slice(0, 4);
        this.recentContainer.innerHTML = topRecent
          .map((tx) => {
            const isIncome = tx.type === 'income';
            const sign = isIncome ? '+ ' : '- ';
            return `
              <div class="recent-tx-item">
                <div class="recent-tx-left">
                  <div class="recent-tx-icon-box" aria-hidden="true">
                    ${this.getCategoryIcon(tx.category)}
                  </div>
                  <div>
                    <div class="recent-tx-title">${this.escapeHtml(tx.description)}</div>
                    <div class="recent-tx-category">${this.escapeHtml(tx.category)}</div>
                  </div>
                </div>
                <div class="recent-tx-right">
                  <div class="recent-tx-amount ${isIncome ? 'income' : 'expense'}">
                    ${sign}${formatCurrency(tx.amount)}
                  </div>
                  <div class="recent-tx-date">${formatDate(tx.date)}</div>
                </div>
              </div>
            `;
          })
          .join('');
      }
    }

    // 2. Renderiza na tabela completa (se o elemento existir)
    if (this.fullTableBody) {
      if (this.recordsCounter) {
        this.recordsCounter.textContent = `${transactions.length} registros`;
      }

      if (transactions.length === 0) {
        this.fullTableBody.innerHTML = `
          <tr>
            <td colspan="5" style="text-align: center; padding: 2rem; color: var(--color-text-muted);">
              Nenhum registro encontrado para os filtros atuais.
            </td>
          </tr>
        `;
        return;
      }

      this.fullTableBody.innerHTML = transactions
        .map((tx) => {
          const isIncome = tx.type === 'income';
          const sign = isIncome ? '+ ' : '- ';
          return `
            <tr>
              <td>
                <div style="font-weight: 600; color: var(--color-text-main);">${this.escapeHtml(tx.description)}</div>
                <div style="font-size: 0.72rem; color: var(--color-text-muted);">${formatDate(tx.date)}</div>
              </td>
              <td><span class="badge" style="background: rgba(255,255,255,0.06);">${this.escapeHtml(tx.category)}</span></td>
              <td>
                <span class="badge ${isIncome ? 'trend-badge positive' : 'trend-badge negative'}">
                  ${isIncome ? 'Receita' : 'Despesa'}
                </span>
              </td>
              <td>
                <span style="font-weight: 700; color: ${isIncome ? 'var(--color-income-light)' : 'var(--color-expense-light)'};">
                  ${sign}${formatCurrency(tx.amount)}
                </span>
              </td>
              <td style="text-align: right;">
                <button type="button" class="btn-icon" data-action="delete" data-id="${tx.id}" title="Excluir" style="color: var(--color-expense-light);">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                </button>
              </td>
            </tr>
          `;
        })
        .join('');
    }
  }

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
