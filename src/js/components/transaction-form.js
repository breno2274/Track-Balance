/**
 * Componente do Formulário e Modal de Transação (TransactionForm).
 * Gerencia validação, estados de criação/edição e acessibilidade (a11y).
 */

import { CATEGORIES } from '../config.js';
import { getTodayISODate } from '../utils/dates.js';
import { validateTransaction } from '../utils/validators.js';
import { parseCurrencyInput } from '../utils/currency.js';

export class TransactionForm {
  /**
   * @param {Object} options
   * @param {HTMLElement} options.modalElement
   * @param {HTMLFormElement} options.formElement
   * @param {(data: Object, mode: 'create' | 'edit', id?: string) => void} options.onSubmit
   */
  constructor({ modalElement, formElement, onSubmit }) {
    this.modal = modalElement;
    this.form = formElement;
    this.onSubmit = onSubmit;
    this.mode = 'create'; // 'create' | 'edit'
    this.editingId = null;

    // Cache de elementos do formulário
    this.descInput = this.form.querySelector('#tx-description');
    this.amountInput = this.form.querySelector('#tx-amount');
    this.dateInput = this.form.querySelector('#tx-date');
    this.categorySelect = this.form.querySelector('#tx-category');
    this.modalTitle = this.modal.querySelector('#modal-title');
    this.submitBtn = this.form.querySelector('#form-submit-btn');

    this.typeIncomeRadio = this.form.querySelector('#type-income');
    this.typeExpenseRadio = this.form.querySelector('#type-expense');
    this.typeIncomeLabel = this.form.querySelector('#label-type-income');
    this.typeExpenseLabel = this.form.querySelector('#label-type-expense');

    this.bindEvents();
  }

  /**
   * Vincula ouvintes de eventos de interação e teclado.
   */
  bindEvents() {
    // Submissão do formulário
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit();
    });

    // Alternância do tipo (Receita vs Despesa)
    this.typeIncomeRadio.addEventListener('change', () => this.handleTypeChange('income'));
    this.typeExpenseRadio.addEventListener('change', () => this.handleTypeChange('expense'));

    // Fechar ao clicar no botão de fechar ou backdrop
    this.modal.addEventListener('click', (e) => {
      if (e.target.matches('[data-action="close-modal"]') || e.target === this.modal) {
        this.close();
      }
    });

    // Acessibilidade: fechar com tecla Esc
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen()) {
        this.close();
      }
    });
  }

  /**
   * Atualiza a lista de opções de categoria conforme o tipo selecionado.
   * @param {'income' | 'expense'} type
   * @param {string} [selectedCategory]
   */
  updateCategories(type, selectedCategory = '') {
    const list = CATEGORIES[type] || [];
    this.categorySelect.innerHTML = list
      .map(
        (cat) =>
          `<option value="${cat}" ${cat === selectedCategory ? 'selected' : ''}>${cat}</option>`
      )
      .join('');
  }

  /**
   * Lida com a mudança de tipo visual e de opções de categoria.
   * @param {'income' | 'expense'} type
   */
  handleTypeChange(type) {
    if (type === 'income') {
      this.typeIncomeRadio.checked = true;
      this.typeIncomeLabel.classList.add('selected-income');
      this.typeExpenseLabel.classList.remove('selected-expense');
      this.updateCategories('income');
    } else {
      this.typeExpenseRadio.checked = true;
      this.typeExpenseLabel.classList.add('selected-expense');
      this.typeIncomeLabel.classList.remove('selected-income');
      this.updateCategories('expense');
    }
  }

  /**
   * Abre o modal no modo de criação.
   */
  openCreate() {
    this.mode = 'create';
    this.editingId = null;
    this.modalTitle.textContent = 'Nova Transação';
    this.submitBtn.textContent = 'Adicionar Transação';

    this.clearErrors();
    this.form.reset();
    this.handleTypeChange('expense');
    this.dateInput.value = getTodayISODate();

    this.showModal();
  }

  /**
   * Abre o modal no modo de edição de uma transação existente.
   * @param {Object} transaction
   */
  openEdit(transaction) {
    if (!transaction) return;

    this.mode = 'edit';
    this.editingId = transaction.id;
    this.modalTitle.textContent = 'Editar Transação';
    this.submitBtn.textContent = 'Salvar Alterações';

    this.clearErrors();
    this.descInput.value = transaction.description;
    this.amountInput.value = transaction.amount;
    this.dateInput.value = transaction.date;

    this.handleTypeChange(transaction.type);
    this.updateCategories(transaction.type, transaction.category);

    this.showModal();
  }

  showModal() {
    this.modal.classList.add('open');
    this.modal.setAttribute('aria-hidden', 'false');
    // Acessibilidade: foca o primeiro input
    setTimeout(() => this.descInput.focus(), 100);
  }

  close() {
    this.modal.classList.remove('open');
    this.modal.setAttribute('aria-hidden', 'true');
    this.clearErrors();
  }

  isOpen() {
    return this.modal.classList.contains('open');
  }

  /**
   * Trata a submissão com validação detalhada.
   */
  handleSubmit() {
    const rawData = {
      description: this.descInput.value,
      amount: parseCurrencyInput(this.amountInput.value),
      type: this.typeIncomeRadio.checked ? 'income' : 'expense',
      category: this.categorySelect.value,
      date: this.dateInput.value
    };

    const { isValid, errors } = validateTransaction(rawData);

    if (!isValid) {
      this.displayErrors(errors);
      return;
    }

    this.clearErrors();

    if (this.onSubmit) {
      this.onSubmit(rawData, this.mode, this.editingId);
    }

    this.close();
  }

  /**
   * Exibe mensagens de validação associadas a cada campo.
   * @param {Record<string, string>} errors
   */
  displayErrors(errors) {
    this.clearErrors();

    for (const [field, message] of Object.entries(errors)) {
      const input = this.form.querySelector(`[name="${field}"]`) || this.form.querySelector(`#tx-${field}`);
      const errorMsg = this.form.querySelector(`#error-${field}`);

      if (input) input.classList.add('error');
      if (errorMsg) {
        errorMsg.textContent = message;
        errorMsg.classList.add('visible');
      }
    }
  }

  /**
   * Remove todas as marcações de erro visíveis.
   */
  clearErrors() {
    this.form.querySelectorAll('.error').forEach((el) => el.classList.remove('error'));
    this.form.querySelectorAll('.form-error').forEach((el) => {
      el.textContent = '';
      el.classList.remove('visible');
    });
  }
}
