/**
 * Componente dos Cards de Resumo Financeiro (SummaryCards).
 */

import { formatCurrency } from '../utils/currency.js';
import { calculateSummary } from '../services/finance-service.js';

export class SummaryCards {
  /**
   * @param {HTMLElement} container
   */
  constructor(container) {
    this.container = container;
  }

  /**
   * Renderiza os 4 cards de métricas baseados na lista de transações filtradas.
   * @param {Array<Object>} transactions
   */
  render(transactions = []) {
    if (!this.container) return;

    const summary = calculateSummary(transactions);

    const isPositiveBalance = summary.balance >= 0;
    const balanceSign = summary.balance > 0 ? '+' : '';

    this.container.innerHTML = `
      <!-- Card 1: Saldo Consolidado -->
      <article class="metric-card balance" aria-label="Saldo atual">
        <header class="metric-header">
          <span class="metric-label">Saldo Atual</span>
          <div class="metric-icon-box" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/>
              <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/>
              <path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/>
            </svg>
          </div>
        </header>
        <div class="metric-value" style="color: ${isPositiveBalance ? 'var(--color-text-main)' : 'var(--color-expense)'}">
          ${balanceSign}${formatCurrency(summary.balance)}
        </div>
        <footer class="metric-footer">
          <span>${transactions.length} transações no período</span>
        </footer>
      </article>

      <!-- Card 2: Receitas do Período -->
      <article class="metric-card income" aria-label="Total de receitas">
        <header class="metric-header">
          <span class="metric-label">Receitas</span>
          <div class="metric-icon-box" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m5 12 7-7 7 7"/>
              <path d="M12 19V5"/>
            </svg>
          </div>
        </header>
        <div class="metric-value">
          +${formatCurrency(summary.income)}
        </div>
        <footer class="metric-footer">
          <span>Entradas registradas</span>
        </footer>
      </article>

      <!-- Card 3: Despesas do Período -->
      <article class="metric-card expense" aria-label="Total de despesas">
        <header class="metric-header">
          <span class="metric-label">Despesas</span>
          <div class="metric-icon-box" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m19 12-7 7-7-7"/>
              <path d="M12 5v14"/>
            </svg>
          </div>
        </header>
        <div class="metric-value">
          -${formatCurrency(summary.expenses)}
        </div>
        <footer class="metric-footer">
          <span>Saídas e custos</span>
        </footer>
      </article>

      <!-- Card 4: Taxa de Economia / Balanço -->
      <article class="metric-card savings" aria-label="Taxa de economia">
        <header class="metric-header">
          <span class="metric-label">Taxa de Poupança</span>
          <div class="metric-icon-box" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
            </svg>
          </div>
        </header>
        <div class="metric-value">
          ${summary.savingsRate.toFixed(1)}%
        </div>
        <footer class="metric-footer">
          <span>${summary.expenseRatio.toFixed(0)}% do orçamento gasto</span>
        </footer>
      </article>
    `;
  }
}
