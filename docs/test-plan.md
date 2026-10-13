# Plano de Testes — Track Balance

Este documento especifica a estratégia de testes do projeto, contendo a matriz de cenários manuais e os testes unitários automatizados para as regras financeiras.

---

## 1. Estratégia de Testes

1. **Testes Unitários Automatizados (`tests/finance-service.test.js`):**  
   Cobrem os cálculos matemáticos críticos (saldo, resumo, balanço, agrupamentos por categoria) utilizando o test runner nativo do Node.js (`node:test` e `node:assert/strict`). Sem dependências externas.
2. **Testes de Integração de UI / Manuais:**  
   Cobrem o fluxo do usuário no navegador (criação, edição, exclusão, filtros, persistência e estados vazios).

---

## 2. Matriz de Cenários de Teste

| ID | Cenário | Ação | Resultado Esperado | Status |
|---|---|---|---|---|
| **TC01** | Cadastro de receita | Preencher "Freelance", R$ 1.500,00, tipo Receita e salvar | Transação surge na lista; Saldo e Receitas aumentam em R$ 1.500,00. | ✅ Aprovado |
| **TC02** | Cadastro de despesa | Preencher "Aluguel", R$ 800,00, tipo Despesa e salvar | Transação surge na lista; Saldo diminui em R$ 800,00; Despesas aumentam. | ✅ Aprovado |
| **TC03** | Validação de valor zero | Tentar cadastrar transação com valor R$ 0,00 | Formulário bloqueia envio e exibe alerta de valor inválido. | ✅ Aprovado |
| **TC04** | Validação de campos vazios | Deixar campo de descrição em branco e submeter | Alerta de validação exigindo descrição mínima de 2 caracteres. | ✅ Aprovado |
| **TC05** | Edição de transação | Clicar em "Editar" no item, alterar valor e salvar | O valor é atualizado na lista e o saldo consolidado é recalculado. | ✅ Aprovado |
| **TC06** | Exclusão com confirmação | Clicar no ícone de lixeira e confirmar no prompt | Transação é removida; cards e gráficos são recalculados imediatamente. | ✅ Aprovado |
| **TC07** | Filtro por categoria | Selecionar categoria "Alimentação" | Apenas gastos de alimentação são exibidos na lista e somados. | ✅ Aprovado |
| **TC08** | Filtro por tipo | Selecionar filtro "Apenas Despesas" | Receitas são ocultadas da listagem. | ✅ Aprovado |
| **TC09** | Busca textual | Digitar "Internet" na barra de busca | Apenas transações que contêm "Internet" na descrição permanecem visíveis. | ✅ Aprovado |
| **TC10** | Persistência local | Cadastrar itens, dar F5 (recarregar) no navegador | Todos os dados permanecem intactos carregados do `localStorage`. | ✅ Aprovado |
| **TC11** | Estado vazio (Empty State) | Limpar todos os registros | Exibição de mensagem informativa e ilustração de estado vazio sem quebrar o layout. | ✅ Aprovado |
| **TC12** | Carga de Seed Data | Clicar em "Carregar Dados Demonstração" | Injeção imediata de 6+ transações completas com gráficos povoados. | ✅ Aprovado |
| **TC13** | Exportação CSV | Clicar em "Exportar CSV" | Download automático de arquivo `track-balance-transacoes.csv` formatado. | ✅ Aprovado |

---

## 3. Como Executar os Testes Automatizados

No terminal, execute:

```bash
npm test
```

Ou diretamente pelo binário nativo do Node.js:

```bash
node --test tests/**/*.test.js
```
