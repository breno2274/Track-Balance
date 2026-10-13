/**
 * Componente de Visualização de Gráficos com Chart.js (Charts).
 * Gerencia o ciclo de vida dos gráficos evitando memory leaks via destroy().
 */

import { calculateCategoryTotals, calculateMonthlyEvolution } from '../services/finance-service.js';
import { CATEGORY_COLORS } from '../config.js';
import { formatCurrency } from '../utils/currency.js';

export class ChartsManager {
  /**
   * @param {HTMLCanvasElement} categoryCanvas
   * @param {HTMLCanvasElement} evolutionCanvas
   */
  constructor(categoryCanvas, evolutionCanvas) {
    this.categoryCanvas = categoryCanvas;
    this.evolutionCanvas = evolutionCanvas;
    this.categoryChart = null;
    this.evolutionChart = null;
  }

  /**
   * Atualiza ambos os gráficos com base nos dados mais recentes.
   * @param {Array<Object>} filteredTransactions - Transações do período atual
   * @param {Array<Object>} allTransactions - Histórico completo para a evolução
   */
  update(filteredTransactions = [], allTransactions = []) {
    this.renderCategoryChart(filteredTransactions);
    this.renderEvolutionChart(allTransactions);
  }

  /**
   * Renderiza o gráfico de rosca (Donut) de gastos por categoria.
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

    const ctx = this.categoryCanvas.getContext('2d');

    // Estado vazio caso não haja despesas no período
    if (categories.length === 0 || values.every((v) => v === 0)) {
      this.categoryChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Sem despesas'],
          datasets: [
            {
              data: [1],
              backgroundColor: ['rgba(255, 255, 255, 0.08)'],
              borderWidth: 0
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: { enabled: false }
          },
          cutout: '75%'
        }
      });
      return;
    }

    const backgroundColors = categories.map(
      (cat) => CATEGORY_COLORS[cat] || '#8b5cf6'
    );

    this.categoryChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: categories,
        datasets: [
          {
            data: values,
            backgroundColor: backgroundColors,
            borderColor: '#151522',
            borderWidth: 3,
            hoverOffset: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              boxWidth: 12,
              padding: 14,
              color: '#94a3b8',
              font: {
                family: "'Plus Jakarta Sans', sans-serif",
                size: 12
              }
            }
          },
          tooltip: {
            backgroundColor: '#1c1c2e',
            titleColor: '#f8fafc',
            bodyColor: '#cbd5e1',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1,
            padding: 12,
            boxPadding: 6,
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.parsed || 0;
                return ` ${label}: ${formatCurrency(value)}`;
              }
            }
          }
        },
        cutout: '68%'
      }
    });
  }

  /**
   * Renderiza o gráfico de área/linhas comparando receitas e despesas por mês.
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

    // Cria gradientes suaves sob as linhas
    const incomeGradient = ctx.createLinearGradient(0, 0, 0, 260);
    incomeGradient.addColorStop(0, 'rgba(16, 185, 129, 0.35)');
    incomeGradient.addColorStop(1, 'rgba(16, 185, 129, 0.0)');

    const expenseGradient = ctx.createLinearGradient(0, 0, 0, 260);
    expenseGradient.addColorStop(0, 'rgba(244, 63, 94, 0.3)');
    expenseGradient.addColorStop(1, 'rgba(244, 63, 94, 0.0)');

    this.evolutionChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels.length ? labels : ['Atual'],
        datasets: [
          {
            label: 'Receitas',
            data: incomeData.length ? incomeData : [0],
            borderColor: '#10b981',
            backgroundColor: incomeGradient,
            borderWidth: 2.5,
            tension: 0.35,
            fill: true,
            pointBackgroundColor: '#10b981',
            pointRadius: 4,
            pointHoverRadius: 6
          },
          {
            label: 'Despesas',
            data: expenseData.length ? expenseData : [0],
            borderColor: '#f43f5e',
            backgroundColor: expenseGradient,
            borderWidth: 2.5,
            tension: 0.35,
            fill: true,
            pointBackgroundColor: '#f43f5e',
            pointRadius: 4,
            pointHoverRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false
        },
        scales: {
          x: {
            grid: {
              color: 'rgba(255, 255, 255, 0.04)',
              drawBorder: false
            },
            ticks: {
              color: '#64748b',
              font: { family: "'Plus Jakarta Sans', sans-serif", size: 12 }
            }
          },
          y: {
            grid: {
              color: 'rgba(255, 255, 255, 0.05)',
              drawBorder: false
            },
            ticks: {
              color: '#64748b',
              font: { family: "'Plus Jakarta Sans', sans-serif", size: 11 },
              callback: (val) => `R$ ${val}`
            }
          }
        },
        plugins: {
          legend: {
            position: 'top',
            align: 'end',
            labels: {
              boxWidth: 12,
              color: '#94a3b8',
              font: { family: "'Plus Jakarta Sans', sans-serif", size: 12 }
            }
          },
          tooltip: {
            backgroundColor: '#1c1c2e',
            titleColor: '#f8fafc',
            bodyColor: '#cbd5e1',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1,
            padding: 12,
            callbacks: {
              label: (context) => {
                const label = context.dataset.label || '';
                const val = context.parsed.y || 0;
                return ` ${label}: ${formatCurrency(val)}`;
              }
            }
          }
        }
      }
    });
  }
}
