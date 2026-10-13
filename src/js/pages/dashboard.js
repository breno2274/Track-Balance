/**
 * Controlador Principal da Dashboard (DashboardPage).
 * Orquestra o ciclo de vida dos componentes, filtros reativos e persistência.
 */

import { transactionService } from '../services/transaction-service.js';
import { SummaryCards } from '../components/summary-cards.js';
import { ChartsManager } from '../components/charts.js';
import { TransactionList } from '../components/transaction-list.js';
import { TransactionForm } from '../components/transaction-form.js';
import { formatMonthYear } from '../utils/dates.js';
import { CATEGORIES } from '../config.js';

export class DashboardPage {
  constructor() {
    this.filters = {
      period: 'all',
      category: 'all',
      type: 'all',
      search: ''
    };

    // Referências do DOM
    this.summaryContainer = document.querySelector('#summary-grid');
    this.categoryCanvas = document.querySelector('#category-chart');
    this.evolutionCanvas = document.querySelector('#evolution-chart');
    this.tableBody = document.querySelector('#transactions-tbody');
    this.recordsCounter = document.querySelector('#records-count');
    this.searchInput = document.querySelector('#search-input');
    this.periodSelect = document.querySelector('#filter-period');
    this.categorySelect = document.querySelector('#filter-category');
    this.typeFilterGroup = document.querySelector('#type-filter-group');
    this.toastContainer = document.querySelector('#toast-container');

    this.btnNewTransaction = document.querySelector('#btn-new-transaction');
    this.btnSeedData = document.querySelector('#btn-seed-data');
    this.btnExportCsv = document.querySelector('#btn-export-csv');

    // Inicialização dos componentes
    this.summaryCards = new SummaryCards(this.summaryContainer);
    this.charts = new ChartsManager(this.categoryCanvas, this.evolutionCanvas);

    this.transactionList = new TransactionList(this.tableBody, this.recordsCounter, {
      onEdit: (id) => this.handleEdit(id),
      onDelete: (id) => this.handleDelete(id)
    });

    this.transactionForm = new TransactionForm({
      modalElement: document.querySelector('#transaction-modal'),
      formElement: document.querySelector('#transaction-form'),
      onSubmit: (data, mode, id) => this.handleFormSubmit(data, mode, id)
    });

    this.init();
  }

  /**
   * Inicializa ouvintes e dispara a primeira renderização.
   */
  init() {
    this.populateCategoryFilter();
    this.updatePeriodSelectOptions();
    this.bindEvents();

    // Inscreve a página para ser notificada sobre alterações no TransactionService
    this.unsubscribe = transactionService.subscribe(() => {
      this.updatePeriodSelectOptions();
      this.refresh();
    });

    // Render inicial
    this.refresh();
  }

  /**
   * Vincula interações de botões e filtros.
   */
  bindEvents() {
    // Abertura do modal de cadastro
    if (this.btnNewTransaction) {
      this.btnNewTransaction.addEventListener('click', () => {
        this.transactionForm.openCreate();
      });
    }

    // Carregar dados de demonstração
    if (this.btnSeedData) {
      this.btnSeedData.addEventListener('click', () => {
        transactionService.loadSeedData();
        this.showToast('Dados de demonstração carregados!', 'success');
      });
    }

    // Exportar CSV
    if (this.btnExportCsv) {
      this.btnExportCsv.addEventListener('click', () => {
        try {
          const currentFiltered = transactionService.filter(this.filters);
          transactionService.exportToCSV(currentFiltered);
          this.showToast('Relatório CSV exportado com sucesso.', 'info');
        } catch (err) {
          this.showToast(err.message, 'error');
        }
      });
    }

    // Campo de busca com atualização dinâmica
    if (this.searchInput) {
      this.searchInput.addEventListener('input', (e) => {
        this.filters.search = e.target.value;
        this.refresh();
      });
    }

    // Filtro de período (mês)
    if (this.periodSelect) {
      this.periodSelect.addEventListener('change', (e) => {
        this.filters.period = e.target.value;
        this.refresh();
      });
    }

    // Filtro de categoria
    if (this.categorySelect) {
      this.categorySelect.addEventListener('change', (e) => {
        this.filters.category = e.target.value;
        this.refresh();
      });
    }

    // Filtro de tipo (Todos / Receitas / Despesas)
    if (this.typeFilterGroup) {
      this.typeFilterGroup.addEventListener('click', (e) => {
        const btn = e.target.closest('.type-filter-btn');
        if (!btn) return;

        this.typeFilterGroup.querySelectorAll('.type-filter-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        this.filters.type = btn.getAttribute('data-type') || 'all';
        this.refresh();
      });
    }
  }

  /**
   * Preenche o select de categorias dos filtros com todas as categorias do sistema.
   */
  populateCategoryFilter() {
    if (!this.categorySelect) return;
    const allCategories = Array.from(new Set([...CATEGORIES.income, ...CATEGORIES.expense])).sort();

    const options = [
      '<option value="all">Todas as categorias</option>',
      ...allCategories.map((cat) => `<option value="${cat}">${cat}</option>`)
    ];
    this.categorySelect.innerHTML = options.join('');
  }

  /**
   * Atualiza as opções do select de períodos conforme as transações existentes.
   */
  updatePeriodSelectOptions() {
    if (!this.periodSelect) return;
    const months = transactionService.getAvailableMonths();
    const currentVal = this.periodSelect.value;

    const options = [
      '<option value="all">Todos os períodos</option>',
      ...months.map((m) => `<option value="${m}">${formatMonthYear(m)}</option>`)
    ];

    this.periodSelect.innerHTML = options.join('');
    if (months.includes(currentVal) || currentVal === 'all') {
      this.periodSelect.value = currentVal;
    } else {
      this.periodSelect.value = 'all';
      this.filters.period = 'all';
    }
  }

  /**
   * Atualiza os componentes com os dados mais recentes.
   */
  refresh() {
    const allTransactions = transactionService.getAll();
    const filteredTransactions = transactionService.filter(this.filters);

    // 1. Renderiza os cards de resumo com base nos dados do filtro atual
    this.summaryCards.render(filteredTransactions);

    // 2. Renderiza a tabela de transações
    this.transactionList.render(filteredTransactions);

    // 3. Atualiza os gráficos (rosca usa dados filtrados; linha usa histórico geral)
    this.charts.update(filteredTransactions, allTransactions);
  }

  /**
   * Lida com a submissão do formulário (Criação ou Edição).
   * @param {Object} data
   * @param {'create' | 'edit'} mode
   * @param {string} [id]
   */
  handleFormSubmit(data, mode, id) {
    if (mode === 'edit' && id) {
      transactionService.update(id, data);
      this.showToast('Transação atualizada com sucesso!', 'success');
    } else {
      transactionService.add(data);
      this.showToast('Transação cadastrada com sucesso!', 'success');
    }
  }

  /**
   * Prepara e abre o modal para edição.
   * @param {string} id
   */
  handleEdit(id) {
    const tx = transactionService.getById(id);
    if (tx) {
      this.transactionForm.openEdit(tx);
    }
  }

  /**
   * Confirma e exclui uma transação.
   * @param {string} id
   */
  handleDelete(id) {
    const tx = transactionService.getById(id);
    if (!tx) return;

    const confirmed = window.confirm(`Deseja realmente excluir "${tx.description}"?`);
    if (confirmed) {
      transactionService.remove(id);
      this.showToast('Transação excluída.', 'info');
    }
  }

  /**
   * Exibe notificação toast elegante.
   * @param {string} message
   * @param {'success' | 'error' | 'info'} type
   */
  showToast(message, type = 'info') {
    if (!this.toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
      <span>${message}</span>
    `;

    this.toastContainer.appendChild(toast);

    // Gatilho de animação CSS
    requestAnimationFrame(() => toast.classList.add('show'));

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }
}
