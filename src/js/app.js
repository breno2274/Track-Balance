/**
 * Ponto de Entrada da Aplicação (Entry Point).
 * Inicializa a dashboard após o carregamento da DOM.
 */

import { DashboardPage } from './pages/dashboard.js';

document.addEventListener('DOMContentLoaded', () => {
  try {
    new DashboardPage();
    console.info('🚀 [Track Balance] Aplicação inicializada com sucesso em modo ES Modules.');
  } catch (error) {
    console.error('❌ [Track Balance] Falha crítica ao inicializar a aplicação:', error);
  }
});
