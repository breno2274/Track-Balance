# Design System & UI Specs — Track Balance

Este documento define os princípios visuais, paleta de cores, tipografia, tokens de espaçamento e diretrizes de acessibilidade do **Track Balance**.

---

## 1. Identidade Visual e Filosofia

O visual do **Track Balance** é inspirado em interfaces financeiras modernas de alto padrão (SaaS FinTech). Ele utiliza uma estética **Dark Glassmorphism**:
- Fundo escuro profundo para reduzir a fadiga visual.
- Painéis elevados com transparência sutil e desfoque de fundo (`backdrop-filter: blur(12px)`).
- Bordas translúcidas finas para delimitar os cartões sem poluição visual.
- Cores de destaque vibrantes (violeta, esmeralda e rosa) para destacar os fluxos de dinheiro.

---

## 2. Paleta de Cores (Design Tokens)

### 2.1. Cores de Superfície e Fundo
- **Background Principal:** `#0c0c11` — Escuro profundo
- **Surface Primária (Cards / Painéis):** `#14141e`
- **Surface Secundária (Inputs / Elementos):** `#1c1c2a`
- **Borda Padrão:** `rgba(255, 255, 255, 0.08)`
- **Borda Ativa / Hover:** `rgba(139, 92, 246, 0.4)`

### 2.2. Cores Semânticas
- **Cor Primária (Marca / Ações):** `#8b5cf6` (Violeta)
- **Primária Hover:** `#7c3aed`
- **Sucesso / Receita (Income):** `#10b981` (Esmeralda)
- **Perigo / Despesa (Expense):** `#f43f5e` (Rosa/Vermelho)
- **Alerta / Neutro:** `#f59e0b` (Âmbar)

### 2.3. Tipografia e Cores de Texto
- **Texto Principal:** `#f8fafc` (Branco gelo, alto contraste)
- **Texto Secundário / Muted:** `#94a3b8` (Cinza ardósia claro)
- **Texto Terciário / Labels:** `#64748b`

---

## 3. Escala de Espaçamento e Bordas

```css
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */

--radius-sm: 0.5rem;   /* 8px */
--radius-md: 0.75rem;  /* 12px */
--radius-lg: 1rem;     /* 16px */
--radius-full: 9999px; /* Pílula */
```

---

## 4. Tipografia
- **Família da Fonte:** `'Plus Jakarta Sans'`, `'Inter'`, system-ui, sans-serif.
- **Títulos:**
  - `h1`: 1.75rem (28px), peso 700.
  - `h2`: 1.25rem (20px), peso 600.
  - `h3`: 1.00rem (16px), peso 600.
- **Valores Monetários:** `tabular-nums` ativo para alinhamento numérico impecável.

---

## 5. Diretrizes de Acessibilidade (a11y)

1. **Informação Não Dependente de Cor:**
   - Receitas possuem a cor verde **mais** o sinal de positivo `+` e o badge "Receita".
   - Despesas possuem a cor vermelha **mais** o sinal de negativo `-` e o badge "Despesa".
2. **Navegação por Teclado:**
   - Todo botão e link possui `:focus-visible` com anel de foco visível (`outline: 2px solid #8b5cf6`).
   - Modais podem ser fechados pressionando a tecla `Esc`.
3. **Semântica HTML:**
   - Uso de `<header>`, `<main>`, `<section>`, `<aside>`, `<table role="table">`, e `<dialog>` ou modal com `role="dialog"` e `aria-modal="true"`.
4. **Alvos de Toque (Touch Targets):**
   - Todos os botões e áreas clicáveis possuem altura mínima de 44px em telas sensíveis ao toque.
