# Especificação de Requisitos — Track Balance

Este documento define os requisitos funcionais, não funcionais e os critérios de aceitação da aplicação **Track Balance**.

---

## 1. Visão do Produto
O **Track Balance** é uma aplicação web para controle financeiro pessoal, focada em fornecer uma visão clara e objetiva sobre receitas, despesas, saldo acumulado e distribuição de gastos por categoria, sem dependência de servidores externos ou bibliotecas de interface proprietárias.

---

## 2. Requisitos Funcionais (RF)

| ID | Nome | Descrição |
|---|---|---|
| **RF01** | Cadastrar transação | O sistema deve permitir o cadastro de receitas e despesas com descrição, valor, data, categoria e tipo. |
| **RF02** | Editar transação | O usuário deve conseguir alterar os dados de uma transação previamente cadastrada. |
| **RF03** | Excluir transação | O sistema deve permitir a exclusão de uma transação mediante confirmação visual do usuário. |
| **RF04** | Resumo financeiro consolidado | O sistema deve calcular e exibir automaticamente: Saldo Atual, Total de Receitas, Total de Despesas e Taxa de Poupança/Balanço do período. |
| **RF05** | Filtro dinâmico e busca | O sistema deve permitir filtrar transações por período (mês/ano ou todos), categoria e tipo (receita/despesa), além de busca por texto na descrição. |
| **RF06** | Persistência local | Os dados devem ser preservados no navegador através da API `localStorage`. |
| **RF07** | Visualização gráfica | O sistema deve renderizar gráficos interativos atualizados dinamicamente: distribuição de gastos por categoria e fluxo comparativo de receitas vs despesas. |
| **RF08** | Carga de dados de demonstração | O sistema deve disponibilizar um botão para injetar um conjunto de dados simulados (seed data) para demonstração imediata do dashboard. |
| **RF09** | Exportação para CSV | O usuário deve poder baixar uma planilha em formato `.csv` com o histórico de transações filtradas. |
| **RF10** | Feedback de validação | Erros de preenchimento (ex: campos vazios, valores negativos ou nulos) devem ser apresentados de forma clara antes do envio. |

---

## 3. Requisitos Não Funcionais (RNF)

| ID | Nome | Descrição |
|---|---|---|
| **RNF01** | Responsividade | O layout deve adaptar-se perfeitamente a dispositivos móveis (a partir de 360px), tablets e desktops. |
| **RNF02** | Acessibilidade (a11y) | Formulários com rótulos (`<label>`), navegação por teclado (`Tab`, `Esc` para fechar modais), foco visível e contraste de cores adequado (WCAG AA). |
| **RNF03** | Localização e Formatação | Valores monetários formatados no padrão brasileiro (`R$ 1.250,50` via `Intl.NumberFormat`) e datas em `DD/MM/AAAA`. |
| **RNF04** | Segurança no DOM | Toda renderização dinâmica de dados do usuário deve ser sanitizada contra injeções de script (evitar `innerHTML` com dados não tratados). |
| **RNF05** | Separação de Responsabilidades | Código modularizado em ES Modules nativos, dividindo modelos, serviços, componentes de interface e utilitários. |
| **RNF06** | Zero Build Step | A aplicação deve rodar nativamente em qualquer navegador moderno sem necessidade de transpilação ou bundlers obrigatórios. |

---

## 4. Histórias de Usuário e Critérios de Aceitação

### História 1: Cadastro de Despesa
> **Como** usuário,  
> **quero** registrar uma nova despesa informando categoria e valor,  
> **para** manter meu saldo atualizado e entender para onde vai o meu dinheiro.

**Critérios de Aceitação:**
- O formulário deve exigir: descrição (mínimo 3 caracteres), valor (> 0), data válida e categoria selecionada.
- Ao salvar com sucesso, a janela modal fecha e a transação é inserida na listagem.
- Os cards de saldo e despesas do período são recalculados imediatamente.
- O gráfico de distribuição por categoria é atualizado com o novo montante.
- Um alerta toast de confirmação é exibido.

### História 2: Filtro por Período
> **Como** usuário,  
> **quero** filtrar as transações por mês,  
> **para** analisar a saúde financeira de um período específico.

**Critérios de Aceitação:**
- Ao alterar o filtro de mês ou categoria, a lista exibe apenas os registros correspondentes.
- Os cards de resumo refletem estritamente as transações resultantes do filtro ativo.
- Caso não haja registros no período, exibe-se uma mensagem de estado vazio amigável (*Empty State*).

### História 3: Avaliação Rápida (Recrutador / Avaliador)
> **Como** recrutador avaliando o portfólio,  
> **quero** carregar dados fictícios com 1 clique,  
> **para** visualizar imediatamente a riqueza do dashboard sem ter que cadastrar dezenas de itens.

**Critérios de Aceitação:**
- Botão "Carregar Dados de Demonstração" preenche o estado com transações diversificadas de receitas e despesas.
- Saldo, gráficos e tabela refletem os dados instantaneamente.
