/**
 * Componente de Gráficos (ChartsManager).
 * Renderiza o Fluxo de Caixa (Linha + Barras) e o Donut de Despesas por Categoria
 * com centro de dados e listagem detalhada de percentuais.
 */

import { calculateCategoryTotals, calculateMonthlyEvolution } from '../services/finance-service.js';
import { CATEGORY_COLORS } from '../config.js';
import { formatCurrency } from '../utils/currency.js';

export class ChartsManager {
  /**
   * @param {Object} options
   * @param {HTMLCanvasElement} options.categoryCanvas
   * @param {HTMLCanvasElement} options.evolutionCanvas
   * @param {HTMLElement} [options.breakdownContainer]
   * @param {HTMLElement} [options.donutCenterValue]
   */
  constructor({ categoryCanvas, evolutionCanvas, breakdownContainer, donutCenterValue }) {
    this.categoryCanvas = categoryCanvas;
    this.evolutionCanvas = evolutionCanvas;
    this.breakdownContainer = breakdownContainer;
    this.donutCenterValue = donutCenterValue;
    this.categoryChart = null;
    this.evolutionChart = null;
  }

  /**
   * Atualiza ambos os gráficos.
   * @param {Array<Object>} filteredTransactions
   * @param {Array<Object>} allTransactions
   */
  update(filteredTransactions = [], allTransactions = []) {
    this.renderCategoryChart(filteredTransactions);
    this.renderEvolutionChart(allTransactions);
  }

  /**
   * Renderiza o gráfico Donut e a lista lateral de percentuais.
   * @param {Array<Object>} transactions
   */
  renderCategoryChart(transactions) {
    if (!this.categoryCanvas || typeof Chart === 'undefined') return;

    if (this.categoryChart) {
      this.categoryChart.destroy();
      this.categoryChart = null;
    }

    const categoryData = calculateCategoryTotals(transactions, 'expense');
    const categories = Object.keys(categoryData);
    const values = Object.values(categoryData);
    const totalExpenses = values.reduce((a, b) => a + b, 0);

    // Atualiza texto central do Donut
    if (this.donutCenterValue) {
      this.donutCenterValue.textContent = formatCurrency(totalExpenses);
    }

    // Atualiza a listagem lateral com pontos coloridos, valores e %
    if (this.breakdownContainer) {
      if (categories.length === 0 || totalExpenses === 0) {
        this.breakdownContainer.innerHTML = `
          <div style="font-size: 0.75rem; color: var(--color-text-muted); text-align: center; padding: 1rem 0;">
            Nenhuma despesa no período.
          </div>
        `;
      } else {
        this.breakdownContainer.innerHTML = categories
          .slice(0, 5) // Exibe as 5 principais categorias
          .map((cat, idx) => {
            const amount = values[idx];
            const pct = totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0;
            const color = CATEGORY_COLORS[cat] || '#10b981';
            return `
              <div class="category-breakdown-item">
                <div class="cat-item-left">
                  <span class="cat-dot" style="background-color: ${color};"></span>
                  <span>${cat}</span>
                </div>
                <div class="cat-item-right">
                  <span class="cat-amount">${formatCurrency(amount)}</span>
                  <span class="cat-pct">${pct}%</span>
                </div>
              </div>
            `;
          })
          .join('');
      }
    }

    const ctx = this.categoryCanvas.getContext('2d');

    if (categories.length === 0 || totalExpenses === 0) {
      this.categoryChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Sem despesas'],
          datasets: [{ data: [1], backgroundColor: ['rgba(255, 255, 255, 0.05)'], borderWidth: 0 }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false }, tooltip: { enabled: false } },
          cutout: '76%'
        }
      });
      return;
    }

    const backgroundColors = categories.map((cat) => CATEGORY_COLORS[cat] || '#10b981');

    this.categoryChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: categories,
        datasets: [
          {
            data: values,
            backgroundColor: backgroundColors,
            borderColor: '#0e1411',
            borderWidth: 2,
            hoverOffset: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }, // Legenda é a lista HTML personalizada ao lado
          tooltip: {
            backgroundColor: '#121815',
            titleColor: '#f8fafc',
            bodyColor: '#cbd5e1',
            borderColor: 'rgba(255, 255, 255, 0.08)',
            borderWidth: 1,
            padding: 8,
            callbacks: {
              label: (context) => ` ${context.label}: ${formatCurrency(context.parsed)}`
            }
          }
        },
        cutout: '74%'
      }
    });
  }

  /**
   * Renderiza o gráfico de Fluxo de Caixa (Curva suave de Receitas + Barras de Despesas).
   * @param {Array<Object>} transactions
   */
  renderEvolutionChart(transactions) {
    if (!this.evolutionCanvas || typeof Chart === 'undefined') return;

    if (this.evolutionChart) {
      this.evolutionChart.destroy();
      this.evolutionChart = null;
    }

    const { labels, incomeData, expenseData } = calculateMonthlyEvolution(transactions);
    const ctx = this.evolutionCanvas.getContext('2d');

    // Gradiente sutil sob a curva de receitas
    const greenGradient = ctx.createLinearGradient(0, 0, 0, 200);
    greenGradient.addColorStop(0, 'rgba(16, 185, 129, 0.25)');
    greenGradient.addColorStop(1, 'rgba(16, 185, 129, 0.0)');

    this.evolutionChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels.length ? labels : ['01/10', '05/10', '10/10', '15/10', '20/10', '25/10', '31/10'],
        datasets: [
          {
            type: 'line',
            label: 'Receitas',
            data: incomeData.length ? incomeData : [1200, 2400, 3100, 2800, 4200, 3900, 5200],
            borderColor: '#10b981',
            backgroundColor: greenGradient,
            borderWidth: 2.2,
            tension: 0.45,
            fill: true,
            pointBackgroundColor: '#10b981',
            pointBorderColor: '#0e1411',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
            order: 1
          },
          {
            type: 'bar',
            label: 'Despesas',
            data: expenseData.length ? expenseData : [600, 1100, 1400, 950, 1800, 1200, 2350],
            backgroundColor: 'rgba(30, 41, 59, 0.75)',
            hoverBackgroundColor: 'rgba(51, 65, 85, 0.9)',
            borderRadius: 4,
            barThickness: 12,
            order: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: {
              display: true,
              color: 'rgba(255, 255, 255, 0.03)'
            },
            ticks: {
              color: '#64748b',
              font: { family: "'Plus Jakarta Sans', sans-serif", size: 11 }
            }
          },
          y: {
            grid: {
              color: 'rgba(255, 255, 255, 0.04)'
            },
            ticks: {
              color: '#64748b',
              font: { family: "'Plus Jakarta Sans', sans-serif", size: 10 },
              callback: (val) => `R$ ${val}`
            }
          }
        },
        plugins: {
          legend: { display: false }, // Legenda é o cabeçalho estilizado
          tooltip: {
            backgroundColor: '#0e1411',
            titleColor: '#f8fafc',
            bodyColor: '#cbd5e1',
            borderColor: 'rgba(255, 255, 255, 0.08)',
            borderWidth: 1,
            padding: 10,
            callbacks: {
              label: (context) => ` ${context.dataset.label}: ${formatCurrency(context.parsed.y)}`
            }
          }
        }
      }
    });
  }
}
