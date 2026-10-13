/**
 * Componente dos Cards de Resumo Financeiro (SummaryCards).
 * Renderiza os 4 blocos de métricas com suporte à Meta do Mês e barra de progresso.
 */

import { formatCurrency } from '../utils/currency.js';
import { calculateSummary } from '../services/finance-service.js';

export class SummaryCards {
  /**
   * @param {HTMLElement} container
   * @param {number} [monthlyGoal=1500] - Meta de economia do mês em reais
   */
  constructor(container, monthlyGoal = 1500) {
    this.container = container;
    this.monthlyGoal = monthlyGoal;
  }

  /**
   * Renderiza os 4 cards de métricas baseados na lista de transações filtradas.
   * @param {Array<Object>} transactions
   */
  render(transactions = []) {
    if (!this.container) return;

    const summary = calculateSummary(transactions);

    // Cálculo da Meta do Mês: % do saldo acumulado em relação à meta
    const goalTarget = this.monthlyGoal;
    const goalProgress = goalTarget > 0 ? Math.min(Math.max(Math.round((summary.balance / goalTarget) * 100), 0), 100) : 0;

    this.container.innerHTML = `
      <!-- 1. Receitas -->
      <article class="metric-box" aria-label="Receitas do período">
        <div class="metric-top">
          <div class="metric-icon-mini">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="m5 12 7-7 7 7"/>
              <path d="M12 19V5"/>
            </svg>
          </div>
          <span>Receitas</span>
        </div>
        <div class="metric-number income">
          ${formatCurrency(summary.income)}
        </div>
        <div class="metric-sub-info">
          <span class="trend-badge positive">+12%</span>
          <span>vs. mês anterior</span>
        </div>
      </article>

      <!-- 2. Despesas -->
      <article class="metric-box" aria-label="Despesas do período">
        <div class="metric-top">
          <div class="metric-icon-mini">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="m19 12-7 7-7-7"/>
              <path d="M12 5v14"/>
            </svg>
          </div>
          <span>Despesas</span>
        </div>
        <div class="metric-number expense">
          ${formatCurrency(summary.expenses)}
        </div>
        <div class="metric-sub-info">
          <span class="trend-badge negative">-8%</span>
          <span>vs. mês anterior</span>
        </div>
      </article>

      <!-- 3. Saldo -->
      <article class="metric-box" aria-label="Saldo atual">
        <div class="metric-top">
          <div class="metric-icon-mini">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/>
              <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/>
              <path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/>
            </svg>
          </div>
          <span>Saldo</span>
        </div>
        <div class="metric-number neutral">
          ${formatCurrency(summary.balance)}
        </div>
        <div class="metric-sub-info">
          <span>total no mês</span>
        </div>
      </article>

      <!-- 4. Meta do Mês -->
      <article class="metric-box" aria-label="Meta de economia do mês">
        <div class="metric-top">
          <div class="metric-icon-mini">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <circle cx="12" cy="12" r="6"/>
              <circle cx="12" cy="12" r="2"/>
            </svg>
          </div>
          <span>Meta do Mês</span>
        </div>
        <div class="metric-number neutral">
          ${formatCurrency(goalTarget)}
        </div>
        <div class="progress-bar-container">
          <div class="progress-track" role="progressbar" aria-valuenow="${goalProgress}" aria-valuemin="0" aria-valuemax="100">
            <div class="progress-fill" style="width: ${goalProgress}%;"></div>
          </div>
          <span class="progress-percent-label">${goalProgress}%</span>
        </div>
      </article>
    `;
  }
}
