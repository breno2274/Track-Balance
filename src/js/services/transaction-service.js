/**
 * Gerenciador de Coleção e Estado de Transações (TransactionService).
 * Atua como Single Source of Truth para as transações na aplicação.
 */

import { storageService } from './storage-service.js';
import { createTransaction } from '../models/transaction.js';
import { SEED_TRANSACTIONS } from '../config.js';

export class TransactionService {
  constructor() {
    this.transactions = [];
    this.listeners = new Set();
    this.init();
  }

  /**
   * Inicializa o serviço carregando os dados do storage.
   * Se for a primeira visita do usuário, inicializa com dados demonstrativos para encantar o recrutador.
   */
  init() {
    const loaded = storageService.load();
    if (loaded && loaded.length > 0) {
      this.transactions = loaded;
    } else {
      this.transactions = [...SEED_TRANSACTIONS];
      storageService.save(this.transactions);
    }
  }

  /**
   * Inscreve um callback para ser executado quando o estado mudar.
   * @param {() => void} callback
   * @returns {() => void} Função para cancelar a inscrição
   */
  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  /**
   * Notifica todos os observadores inscritos.
   */
  notify() {
    for (const listener of this.listeners) {
      try {
        listener();
      } catch (err) {
        console.error('[TransactionService] Erro ao notificar ouvinte:', err);
      }
    }
  }

  /**
   * Retorna todas as transações cadastradas.
   * @returns {Array<Object>}
   */
  getAll() {
    return [...this.transactions];
  }

  /**
   * Busca uma transação por ID.
   * @param {string} id
   * @returns {Object | null}
   */
  getById(id) {
    return this.transactions.find((tx) => tx.id === id) || null;
  }

  /**
   * Adiciona uma nova transação.
   * @param {Object} data
   * @returns {Object} Transação criada
   */
  add(data) {
    const newTx = createTransaction(data);
    // Insere no início da lista (mais recentes primeiro)
    this.transactions.unshift(newTx);
    storageService.save(this.transactions);
    this.notify();
    return newTx;
  }

  /**
   * Atualiza uma transação existente.
   * @param {string} id
   * @param {Object} data
   * @returns {Object | null}
   */
  update(id, data) {
    const index = this.transactions.findIndex((tx) => tx.id === id);
    if (index === -1) return null;

    const existing = this.transactions[index];
    const updated = createTransaction({
      ...existing,
      ...data,
      id: existing.id,
      createdAt: existing.createdAt
    });

    this.transactions[index] = updated;
    storageService.save(this.transactions);
    this.notify();
    return updated;
  }

  /**
   * Remove uma transação pelo ID.
   * @param {string} id
   * @returns {boolean}
   */
  remove(id) {
    const previousLength = this.transactions.length;
    this.transactions = this.transactions.filter((tx) => tx.id !== id);

    if (this.transactions.length !== previousLength) {
      storageService.save(this.transactions);
      this.notify();
      return true;
    }
    return false;
  }

  /**
   * Filtra as transações com base nos critérios selecionados pelo usuário.
   * @param {Object} filters
   * @param {string} [filters.period] - 'all' ou 'YYYY-MM'
   * @param {string} [filters.category] - 'all' ou nome da categoria
   * @param {string} [filters.type] - 'all', 'income' ou 'expense'
   * @param {string} [filters.search] - termo de busca
   * @returns {Array<Object>}
   */
  filter({ period = 'all', category = 'all', type = 'all', search = '' }) {
    const term = search.trim().toLowerCase();

    return this.transactions.filter((tx) => {
      // Filtro de Período (Mês)
      if (period !== 'all') {
        const txMonth = tx.date ? tx.date.slice(0, 7) : '';
        if (txMonth !== period) return false;
      }

      // Filtro de Tipo
      if (type !== 'all' && tx.type !== type) {
        return false;
      }

      // Filtro de Categoria
      if (category !== 'all' && tx.category !== category) {
        return false;
      }

      // Busca por descrição
      if (term && !tx.description.toLowerCase().includes(term)) {
        return false;
      }

      return true;
    });
  }

  /**
   * Retorna os meses distintos presentes nas transações (para preencher o select).
   * @returns {string[]} Lista de chaves 'YYYY-MM' ordenadas decrescente
   */
  getAvailableMonths() {
    const monthsSet = new Set();
    for (const tx of this.transactions) {
      if (tx.date) {
        monthsSet.add(tx.date.slice(0, 7));
      }
    }
    return Array.from(monthsSet).sort().reverse();
  }

  /**
   * Recarrega os dados de demonstração (Seed Data).
   */
  loadSeedData() {
    this.transactions = [...SEED_TRANSACTIONS];
    storageService.save(this.transactions);
    this.notify();
  }

  /**
   * Limpa todas as transações.
   */
  clearAll() {
    this.transactions = [];
    storageService.save(this.transactions);
    this.notify();
  }

  /**
   * Exporta a lista de transações para formato CSV.
   * @param {Array<Object>} transactions
   */
  exportToCSV(transactions = this.transactions) {
    if (!transactions || transactions.length === 0) {
      throw new Error('Nenhuma transação disponível para exportar.');
    }

    const headers = ['ID', 'Descrição', 'Valor (R$)', 'Tipo', 'Categoria', 'Data'];
    const rows = transactions.map((t) => [
      `"${t.id}"`,
      `"${t.description.replace(/"/g, '""')}"`,
      t.amount.toFixed(2),
      t.type === 'income' ? 'Receita' : 'Despesa',
      `"${t.category}"`,
      t.date
    ]);

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `track-balance-transacoes-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

export const transactionService = new TransactionService();
