# Design System & UI Specs — Track Balance

Este documento define os princípios visuais, paleta de cores, tipografia, tokens de espaçamento e diretrizes de acessibilidade do **Track Balance**.

---

## 1. Identidade Visual e Filosofia

O visual do **Track Balance** adota a estética **Dark Emerald FinTech** (inspirada em interfaces de alta produtividade como Linear, Raycast e bancos digitais modernos):
- Fundo escuro profundo (`#060908`) reduzindo fadiga visual.
- Painéis foscos com bordas ultra-sutis (`#0e1411` e `rgba(255, 255, 255, 0.05)`).
- Acentos em **Verde Esmeralda Neon / Menta** (`#10b981`, `#34d399`) para simbolizar saúde financeira, crescimento e foco.
- Layout profissional em 3 colunas (Menu lateral, Dashboard central e Formulário rápido embutido à direita).

---

## 2. Paleta de Cores (Design Tokens)

### 2.1. Cores de Superfície e Fundo
- **Background Principal:** `#060908` — Escuro fosco profundo
- **Surface Primária (Cards / Painéis):** `#0e1411`
- **Surface Secundária (Inputs / Elementos):** `#121815`
- **Borda Padrão:** `rgba(255, 255, 255, 0.05)`
- **Borda Ativa / Foco:** `rgba(16, 185, 129, 0.45)`

### 2.2. Cores Semânticas
- **Cor Primária (Marca / Ações):** `#10b981` (Verde Esmeralda)
- **Primária Hover:** `#059669`
- **Primária Light:** `#34d399`
- **Receita (Income):** `#10b981`
- **Despesa (Expense):** `#ef4444` (Vermelho carmesim)
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
