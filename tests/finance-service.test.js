import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateBalance,
  calculateSummary,
  calculateCategoryTotals,
  calculateMonthlyEvolution
} from '../src/js/services/finance-service.js';

describe('FinanceService — Regras de Negócio e Cálculos', () => {
  const sampleTransactions = [
    { id: '1', description: 'Salário', amount: 5000, type: 'income', category: 'Salário', date: '2026-10-05' },
    { id: '2', description: 'Aluguel', amount: 1500, type: 'expense', category: 'Moradia', date: '2026-10-06' },
    { id: '3', description: 'Supermercado', amount: 500, type: 'expense', category: 'Alimentação', date: '2026-10-07' },
    { id: '4', description: 'Restaurante', amount: 200, type: 'expense', category: 'Alimentação', date: '2026-10-08' },
    { id: '5', description: 'Freelance', amount: 800, type: 'income', category: 'Freelance', date: '2026-10-09' }
  ];

  test('calculateBalance deve retornar 0 para coleções vazias ou nulas', () => {
    assert.equal(calculateBalance([]), 0);
    assert.equal(calculateBalance(null), 0);
    assert.equal(calculateBalance(undefined), 0);
  });

  test('calculateBalance deve calcular o saldo líquido corretamente (Receitas - Despesas)', () => {
    // Receitas: 5000 + 800 = 5800. Despesas: 1500 + 500 + 200 = 2200. Saldo = 3600
    const balance = calculateBalance(sampleTransactions);
    assert.equal(balance, 3600);
  });

  test('calculateBalance deve lidar corretamente com saldo negativo', () => {
    const expensesOnly = [
      { amount: 100, type: 'expense' },
      { amount: 250, type: 'expense' }
    ];
    assert.equal(calculateBalance(expensesOnly), -350);
  });

  test('calculateBalance deve evitar anomalias de arredondamento em float (0.1 + 0.2)', () => {
    const floatTransactions = [
      { amount: 0.1, type: 'income' },
      { amount: 0.2, type: 'income' }
    ];
    assert.equal(calculateBalance(floatTransactions), 0.3);
  });

  test('calculateSummary deve retornar métricas consolidadas e taxas percentuais', () => {
    const summary = calculateSummary(sampleTransactions);
    assert.equal(summary.income, 5800);
    assert.equal(summary.expenses, 2200);
    assert.equal(summary.balance, 3600);
    // savingsRate = (3600 / 5800) * 100 = 62.07%
    assert.equal(summary.savingsRate, 62.07);
    // expenseRatio = (2200 / 5800) * 100 = 37.93%
    assert.equal(summary.expenseRatio, 37.93);
  });

  test('calculateCategoryTotals deve agrupar valores de despesas por categoria em ordem decrescente', () => {
    const categoryTotals = calculateCategoryTotals(sampleTransactions, 'expense');
    assert.deepEqual(categoryTotals, {
      Moradia: 1500,
      Alimentação: 700 // 500 + 200
    });
  });

  test('calculateMonthlyEvolution deve agrupar totais por mês cronologicamente', () => {
    const multiMonth = [
      { amount: 1000, type: 'income', date: '2026-09-10' },
      { amount: 400, type: 'expense', date: '2026-09-15' },
      { amount: 2000, type: 'income', date: '2026-10-01' },
      { amount: 900, type: 'expense', date: '2026-10-05' }
    ];

    const evolution = calculateMonthlyEvolution(multiMonth);
    assert.equal(evolution.labels.length, 2);
    assert.equal(evolution.labels[0], 'Set/26');
    assert.equal(evolution.labels[1], 'Out/26');
    assert.deepEqual(evolution.incomeData, [1000, 2000]);
    assert.deepEqual(evolution.expenseData, [400, 900]);
  });
});
