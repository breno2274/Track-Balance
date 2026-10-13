/**
 * Camada de Persistência Local (LocalStorage Service).
 * Encapsula o acesso aos dados com validação defensiva e tratamento de exceções.
 */

import { STORAGE_KEY } from '../config.js';

export class StorageService {
  /**
   * @param {string} key
   */
  constructor(key = STORAGE_KEY) {
    this.key = key;
  }

  /**
   * Recupera a lista de transações do armazenamento local.
   * @returns {Array<Object>}
   */
  load() {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return [];
      }
      const data = window.localStorage.getItem(this.key);
      if (!data) {
        return [];
      }
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.warn('[StorageService] Falha ao recuperar dados do localStorage:', error);
      return [];
    }
  }

  /**
   * Salva a coleção de transações no localStorage.
   * @param {Array<Object>} transactions
   * @returns {boolean} Retorna true se a gravação foi bem-sucedida.
   */
  save(transactions) {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return false;
      }
      const serialized = JSON.stringify(transactions);
      window.localStorage.setItem(this.key, serialized);
      return true;
    } catch (error) {
      console.error('[StorageService] Erro ao gravar no localStorage (possível limite de cota):', error);
      return false;
    }
  }

  /**
   * Limpa o armazenamento local da aplicação.
   */
  clear() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(this.key);
      }
    } catch (error) {
      console.warn('[StorageService] Erro ao limpar o localStorage:', error);
    }
  }
}

// Instância singleton padrão
export const storageService = new StorageService();
