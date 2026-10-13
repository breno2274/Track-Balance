# Track Balance — Controle Financeiro Pessoal

> Aplicação web de gestão financeira desenvolvida com foco em **engenharia front-end de alto nível**, arquitetura modular desacoplada e interface refinada, construída exclusivamente com **HTML5, CSS3 e JavaScript puro (ES6+)**.

[![Vanilla JS](https://img.shields.io/badge/JavaScript-Vanilla%20ES6%2B-F7DF1E?logo=javascript&logoColor=black)](#)
[![CSS3](https://img.shields.io/badge/CSS3-Modern%20Tokens-1572B6?logo=css3&logoColor=white)](#)
[![Chart.js](https://img.shields.io/badge/Chart.js-Data%20Viz-FF6384?logo=chartdotjs&logoColor=white)](#)
[![Tests](https://img.shields.io/badge/Tests-node%3Atest%20native-339933?logo=nodedotjs&logoColor=white)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-8b5cf6.svg)](LICENSE)

🔗 **Demonstração Online:** [https://breno2274.github.io/Track-Balance/](https://breno2274.github.io/Track-Balance/)

---

## Visão e Propósito do Projeto

O **Track Balance** foi planejado e executado para demonstrar domínio prático dos fundamentos da Web e princípios reais de engenharia de software antes do uso de frameworks.

Ao avaliar este repositório, observa-se:
1. **Domínio dos fundamentos:** Sem React, Vue ou Bootstrap — todo o gerenciamento de estado, renderização do DOM e estilização foram desenvolvidos artesanalmente.
2. **Mentalidade de Engenharia:** Separação estrita de responsabilidades entre regras de negócio, serviços, modelos e componentes de interface.
3. **Padrão Visual FinTech:** Estética Dark Glassmorphism com atenção a microinterações, contraste de cores e tipografia profissional.
4. **Resolução de Problemas Reais:** Cálculo de saldo consolidado, agrupamento para gráficos, filtros dinâmicos cruzados, validação de dados e persistência no navegador.

---

## Funcionalidades

- **Resumo Financeiro em Tempo Real:** Cards com Saldo Atual, Total de Entradas, Total de Saídas e Balanço/Economia do período.
- **Gerenciamento Completo de Transações (CRUD):** Cadastro com modal acessível, edição rápida e exclusão com diálogo de confirmação.
- **Visualização de Dados com Chart.js:**
  - Gráfico de Rosca interativo: Distribuição de despesas por categoria.
  - Gráfico de Linha/Área: Evolução e comparação entre receitas e despesas.
- **Filtros e Busca Dinâmica:**
  - Filtro por mês/ano.
  - Filtro por tipo (Todas, Receitas, Despesas).
  - Filtro por categoria.
  - Campo de busca textual por descrição.
- **Carga de Dados de Demonstração (Seed):** Permite ao avaliador popular o dashboard com 1 clique.
- **Exportação para CSV:** Download de relatório das transações filtradas para planilhas.
- **Persistência Confiável:** Armazenamento automático via `localStorage` com tratamento de integridade.
- **Notificações Toast:** Feedback visual imediato para ações do usuário.

---

## Arquitetura e Decisões de Engenharia

O projeto adota uma arquitetura em camadas com fluxo unidirecional de dados:

```text
trackBalance/
├── index.html                 # Ponto de montagem semântico e acessível
├── README.md                  # Apresentação do projeto e guia técnico
├── LICENSE                    # Licença MIT
├── package.json               # Configurações de módulos ES e testes
├── docs/                      # Documentação completa de engenharia
│   ├── requirements.md        # Requisitos funcionais, não funcionais e user stories
│   ├── architecture.md        # Diagramas, camadas e responsabilidades
│   ├── data-model.md          # Especificação de entidades, tipos e fórmulas
│   ├── design-system.md       # Paleta de cores, tokens, espaçamentos e a11y
│   ├── test-plan.md           # Matriz de cenários manuais e automação
│   └── decisions/             # Architectural Decision Records (ADRs)
│       └── ADR-001-local-storage.md
├── src/
│   ├── css/                   # Folhas de estilo modulares
│   │   ├── reset.css          # Reset moderno e acessível
│   │   ├── variables.css      # Design Tokens (cores, sombras, espaçamentos)
│   │   ├── layout.css         # Grid principal e estruturas
│   │   ├── components.css     # Estilos de cards, tabelas, modais e badges
│   │   └── responsive.css     # Media queries para mobile e tablets
│   ├── js/                    # Lógica modularizada (ES Modules)
│   │   ├── app.js             # Ponto de entrada (Entry point)
│   │   ├── config.js          # Constantes de categorias e tipos
│   │   ├── models/            # Definição e validação de entidades
│   │   │   └── transaction.js
│   │   ├── services/          # Regras de negócio e persistência
│   │   │   ├── finance-service.js
│   │   │   ├── transaction-service.js
│   │   │   └── storage-service.js
│   │   ├── components/        # Componentes de interface puros
│   │   │   ├── summary-cards.js
│   │   │   ├── transaction-list.js
│   │   │   ├── transaction-form.js
│   │   │   └── charts.js
│   │   ├── pages/             # Orquestrador da página
│   │   │   └── dashboard.js
│   │   └── utils/             # Funções utilitárias puras
│   │       ├── currency.js    # Formatação BRL (Intl.NumberFormat)
│   │       ├── dates.js       # Tratamento de datas
│   │       └── validators.js  # Validações de entrada
│   └── assets/                # Ícones vetoriais
└── tests/                     # Testes automatizados com node:test
    └── finance-service.test.js
```

Para mais detalhes sobre as decisões e fronteiras do sistema, consulte:
- [Especificação de Requisitos](docs/requirements.md)
- [Documento de Arquitetura](docs/architecture.md)
- [Modelo de Dados](docs/data-model.md)
- [Design System](docs/design-system.md)
- [Decisão Arquitetural (ADR-001)](docs/decisions/ADR-001-local-storage.md)

---

## Testes Automatizados

As regras financeiras críticas (cálculo de saldo consolidado, totalizadores e agrupamentos para gráficos) possuem cobertura de testes automatizados executados pelo runner nativo do Node.js:

```bash
# Executar suíte de testes
npm test
```

---

## Como Executar o Projeto Localmente

Por utilizar **ES Modules** nativos do JavaScript (`import` e `export`), a aplicação deve ser servida através de um servidor HTTP local:

1. Clone o repositório:
   ```bash
   git clone https://github.com/breno2274/Track-Balance.git
   cd Track-Balance
   ```

2. Execute através do **Live Server** no VS Code:
   - Abra a pasta no VS Code.
   - Clique com o botão direito no arquivo `index.html` e selecione **"Open with Live Server"**.

3. Ou através do **npx serve** / **Python**:
   ```bash
   # Com Node:
   npx serve .
   
   # Ou com Python:
   python -m http.server 3000
   ```

4. Acesse no seu navegador em `http://localhost:3000` ou no endereço indicado pelo servidor.

---

## Acessibilidade e Boas Práticas

- **Semântica HTML5:** Utilização de tags como `<header>`, `<main>`, `<section>`, `<aside>`, `<table role="table">` e formulários com `<label for="...">`.
- **Navegação por Teclado:** Controle de foco em modais, fechamento via tecla `Esc` e anéis de foco visíveis (`:focus-visible`).
- **Comunicação Não-Visual:** Ícones possuem textos alternativos ou atributos `aria-hidden` combinados com labels textuais acessíveis.

---

## Autor

**Breno dos Santos Santana**  
GitHub: [@breno2274](https://github.com/breno2274)  
Estudante de Análise e Desenvolvimento de Sistemas  
*Foco em Engenharia Front-end e Desenvolvimento Web Moderno.*

---

## Licença

Distribuído sob a licença **MIT**. Consulte o arquivo [LICENSE](LICENSE) para obter mais informações.
