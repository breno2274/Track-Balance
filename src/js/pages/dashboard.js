/**
 * Orquestrador da Página Principal (DashboardPage).
 */

import { transactionService } from '../services/transaction-service.js';
import { SummaryCards } from '../components/summary-cards.js';
import { ChartsManager } from '../components/charts.js';
import { TransactionList } from '../components/transaction-list.js';
import { TransactionForm } from '../components/transaction-form.js';

export class DashboardPage {
  constructor() {
    this.initDateIndicator();
    this.initComponents();
    this.bindGlobalEvents();

    // Inscreve no serviço de transações para re-renderização reativa
    this.unsubscribe = transactionService.subscribe(() => {
      this.refresh();
    });

    this.refresh();
  }

  /**
   * Atualiza a data atual no cabeçalho.
   */
  initDateIndicator() {
    const todayEl = document.querySelector('#date-today-text');
    const monthEl = document.querySelector('#date-month-text');
    const now = new Date();

    const monthName = now.toLocaleDateString('pt-BR', { month: 'long' });
    const year = now.getFullYear();
    const day = now.getDate();

    if (monthEl) {
      monthEl.innerHTML = `${monthName.toUpperCase()} <span>${year}</span>`;
    }
    if (todayEl) {
      todayEl.textContent = `Hoje é ${day} de ${monthName}`;
    }
  }

  /**
   * Inicializa instâncias de componentes com as novas referências do DOM.
   */
  initComponents() {
    // 1. Cards de Resumo
    this.summaryCards = new SummaryCards(document.querySelector('#metrics-row'), 1500);

    // 2. Gráficos
    this.charts = new ChartsManager({
      categoryCanvas: document.querySelector('#category-chart'),
      evolutionCanvas: document.querySelector('#evolution-chart'),
      breakdownContainer: document.querySelector('#category-breakdown-list'),
      donutCenterValue: document.querySelector('#donut-center-value')
    });

    // 3. Listagem de Transações
    this.transactionList = new TransactionList(
      {
        recentContainer: document.querySelector('#recent-transactions-list'),
        fullTableBody: document.querySelector('#full-table-tbody'),
        recordsCounter: document.querySelector('#modal-records-counter')
      },
      {
        onEdit: (id) => this.handleEdit(id),
        onDelete: (id) => this.handleDelete(id)
      }
    );

    // 4. Formulário Rápido da Barra Lateral
    this.transactionForm = new TransactionForm({
      formElement: document.querySelector('#sidebar-transaction-form'),
      onSubmit: (data) => this.handleQuickAdd(data)
    });
  }

  bindGlobalEvents() {
    // Modal "Ver Todas as Transações"
    const viewAllBtn = document.querySelector('#btn-view-all-tx');
    const modalAll = document.querySelector('#all-transactions-modal');
    const closeModalBtn = document.querySelector('#btn-close-all-modal');

    if (viewAllBtn && modalAll) {
      viewAllBtn.addEventListener('click', () => {
        modalAll.classList.add('open');
      });
    }

    if (closeModalBtn && modalAll) {
      closeModalBtn.addEventListener('click', () => {
        modalAll.classList.remove('open');
      });
      modalAll.addEventListener('click', (e) => {
        if (e.target === modalAll) modalAll.classList.remove('open');
      });
    }

    // Botão de Exportar CSV no modal
    const btnExport = document.querySelector('#btn-modal-export-csv');
    if (btnExport) {
      btnExport.addEventListener('click', () => {
        try {
          transactionService.exportToCSV();
          this.showToast('Relatório CSV baixado com sucesso!');
        } catch (e) {
          this.showToast(e.message, 'error');
        }
      });
    }

    // Botão de Seed Data no modal
    const btnSeed = document.querySelector('#btn-modal-seed');
    if (btnSeed) {
      btnSeed.addEventListener('click', () => {
        transactionService.loadSeedData();
        this.showToast('Dados de demonstração recarregados!');
      });
    }
  }

  handleQuickAdd(data) {
    transactionService.add(data);
    this.showToast('Transação adicionada com sucesso!');
  }

  handleDelete(id) {
    const tx = transactionService.getById(id);
    if (!tx) return;
    if (confirm(`Deseja excluir "${tx.description}"?`)) {
      transactionService.remove(id);
      this.showToast('Transação removida.');
    }
  }

  handleEdit(id) {
    // Para edição detalhada se necessário
    const tx = transactionService.getById(id);
    if (tx) {
      const newDesc = prompt('Nova descrição:', tx.description);
      if (newDesc && newDesc.trim()) {
        transactionService.update(id, { description: newDesc.trim() });
        this.showToast('Transação atualizada.');
      }
    }
  }

  refresh() {
    const all = transactionService.getAll();
    this.summaryCards.render(all);
    this.transactionList.render(all);
    this.charts.update(all, all);
  }

  showToast(msg, type = 'success') {
    const container = document.querySelector('#toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type === 'error' ? 'toast-error' : ''}`;
    toast.textContent = msg;
    container.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 250);
    }, 3000);
  }
}
