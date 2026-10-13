# Modelo de Dados — Track Balance

Este documento especifica a modelagem dos dados, tipos, regras de integridade e cálculos da aplicação **Track Balance**.

---

## 1. Entidade: Transação (`Transaction`)

Cada registro financeiro possui a seguinte estrutura JSON:

```json
{
  "id": "f81d4fae-7dec-11d0-a765-00a0c91e6bf6",
  "description": "Salário Mensal",
  "amount": 4200.00,
  "type": "income",
  "category": "Trabalho",
  "date": "2026-10-05",
  "createdAt": "2026-10-05T14:30:00.000Z"
}
```

### Especificação dos Campos

| Campo | Tipo | Obrigatório | Descrição / Regras |
|---|---|---|---|
| `id` | `string` | Sim | Identificador único (UUIDv4 gerado nativamente via `crypto.randomUUID()`). |
| `description` | `string` | Sim | Texto descritivo da transação. Mínimo 2 caracteres, máximo 100 caracteres. |
| `amount` | `number` | Sim | Valor monetário em reais. **Sempre positivo e maior que zero** (ex: `120.50`). |
| `type` | `'income' \| 'expense'` | Sim | Define a natureza da transação: `'income'` (receita) ou `'expense'` (despesa). |
| `category` | `string` | Sim | Categoria pertencente (ex: `'Alimentação'`, `'Moradia'`, `'Salário'`). |
| `date` | `string` | Sim | Data financeira no padrão ISO `AAAA-MM-DD`. |
| `createdAt` | `string` | Sim | Timestamp ISO da criação do registro no sistema. |

---

## 2. Regras de Integridade e Validação

1. **Princípio do Valor Positivo:**  
   Valores de despesa nunca são armazenados como números negativos (ex: `-120.00`). Eles são salvos como `120.00` e a propriedade `type: 'expense'` determina a subtração nos cálculos. Isso previne o erro comum de subtrair um número que já é negativo.

2. **Precisão de Arredondamento:**  
   Para evitar erros clássicos de arredondamento IEEE 754 (ex: `0.1 + 0.2 = 0.30000000000000004`), os cálculos acumulam com `Math.round(val * 100) / 100` nas operações de totalização.

3. **Categorias Padrão do Sistema:**
   - **Receitas:** `Salário`, `Investimentos`, `Freelance`, `Outros`
   - **Despesas:** `Moradia`, `Alimentação`, `Transporte`, `Lazer`, `Saúde`, `Educação`, `Outros`

---

## 3. Fórmulas de Cálculos Financeiros

### 3.1. Saldo Consolidado
$$\text{Saldo} = \sum \text{Receitas} - \sum \text{Despesas}$$

### 3.2. Taxa de Economia / Balanço Mensal
$$\text{Taxa de Economia (\%)} = \begin{cases} \left(\frac{\text{Saldo}}{\text{Receitas}}\right) \times 100, & \text{se Receitas} > 0 \\ 0, & \text{se Receitas} = 0 \end{cases}$$

### 3.3. Percentual do Orçamento Gasto
$$\text{Uso das Receitas (\%)} = \begin{cases} \left(\frac{\text{Despesas}}{\text{Receitas}}\right) \times 100, & \text{se Receitas} > 0 \\ 100\%, & \text{se Despesas} > 0 \text{ e Receitas} = 0 \end{cases}$$

---

## 4. Agrupamentos para Visualização

Para alimentar os gráficos do Chart.js:
- **Gastos por Categoria:** Agrupamento das transações do tipo `'expense'`, somando os montantes por chave de categoria.
- **Histórico Mensal:** Agrupamento por mês/ano (`AAAA-MM`), gerando duas séries de dados: Total de Receitas e Total de Despesas.
