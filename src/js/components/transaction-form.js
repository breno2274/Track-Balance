/**
 * Componente do Formulário Rápido de Adição de Transações (TransactionForm).
 * Gerencia a inserção direta no painel lateral direito.
 */

import { CATEGORIES } from '../config.js';
import { getTodayISODate } from '../utils/dates.js';
import { validateTransaction } from '../utils/validators.js';
import { parseCurrencyInput } from '../utils/currency.js';

export class TransactionForm {
  /**
   * @param {Object} options
   * @param {HTMLFormElement} options.formElement
   * @param {(data: Object) => void} options.onSubmit
   */
  constructor({ formElement, onSubmit }) {
    this.form = formElement;
    this.onSubmit = onSubmit;
    this.currentType = 'income'; // Padrão da imagem: Receita ativo

    // Elementos
    this.btnTypeIncome = this.form.querySelector('#btn-toggle-income');
    this.btnTypeExpense = this.form.querySelector('#btn-toggle-expense');
    this.descInput = this.form.querySelector('#form-desc');
    this.categorySelect = this.form.querySelector('#form-category');
    this.amountInput = this.form.querySelector('#form-amount');
    this.dateInput = this.form.querySelector('#form-date');

    this.bindEvents();
    this.initDefaults();
  }

  initDefaults() {
    this.setType('income');
    if (this.dateInput) {
      this.dateInput.value = getTodayISODate();
    }
  }

  bindEvents() {
    // Alternância Receita vs Despesa
    if (this.btnTypeIncome) {
      this.btnTypeIncome.addEventListener('click', () => this.setType('income'));
    }
    if (this.btnTypeExpense) {
      this.btnTypeExpense.addEventListener('click', () => this.setType('expense'));
    }

    // Submissão do formulário
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit();
    });
  }

  /**
   * Define o tipo selecionado e popula as categorias correspondentes.
   * @param {'income' | 'expense'} type
   */
  setType(type) {
    this.currentType = type;
    if (type === 'income') {
      this.btnTypeIncome.classList.add('active-income');
      this.btnTypeExpense.classList.remove('active-expense');
    } else {
      this.btnTypeExpense.classList.add('active-expense');
      this.btnTypeIncome.classList.remove('active-income');
    }

    this.populateCategories(type);
  }

  populateCategories(type) {
    if (!this.categorySelect) return;
    const list = CATEGORIES[type] || [];
    this.categorySelect.innerHTML = `
      <option value="" disabled selected>Selecione uma categoria</option>
      ${list.map((c) => `<option value="${c}">${c}</option>`).join('')}
    `;
  }

  handleSubmit() {
    const rawData = {
      description: this.descInput.value,
      amount: parseCurrencyInput(this.amountInput.value),
      type: this.currentType,
      category: this.categorySelect.value,
      date: this.dateInput.value
    };

    const { isValid, errors } = validateTransaction(rawData);

    if (!isValid) {
      const firstErrorMessage = Object.values(errors)[0] || 'Verifique os dados preenchidos.';
      alert(firstErrorMessage);
      return;
    }

    if (this.onSubmit) {
      this.onSubmit(rawData);
    }

    // Limpa os campos
    this.descInput.value = '';
    this.amountInput.value = '';
    this.categorySelect.selectedIndex = 0;
    this.dateInput.value = getTodayISODate();
  }
}
