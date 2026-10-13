# ADR-001: Adoção de LocalStorage para Persistência no Navegador

- **Status:** Aceito
- **Data:** 2026-10-12
- **Autor:** Breno dos Santos Santana

---

## 1. Contexto
A aplicação **Track Balance** tem como objetivo fornecer um controle financeiro pessoal completo funcionando 100% no lado do cliente (Client-Side), sem a exigência de um servidor back-end ou autenticação em nuvem para esta primeira versão.

O usuário precisa cadastrar receitas e despesas e ter a garantia de que, ao fechar a aba ou recarregar a página, suas informações não serão perdidas.

---

## 2. Decisão
Adotou-se a Web Storage API (`localStorage`) nativa do navegador, encapsulada por um serviço dedicado (`StorageService`).

---

## 3. Alternativas Consideradas

### Alternativa 1: Manter dados apenas em memória (State volátil)
- *Vantagens:* Extremamente simples de implementar.
- *Desvantagens:* Inaceitável para uma aplicação financeira; qualquer refresh (F5) apagaria todo o histórico do usuário.

### Alternativa 2: IndexedDB
- *Vantagens:* Suporta grandes volumes de dados e consultas indexadas assíncronas.
- *Desvantagens:* API consideravelmente mais complexa e verbosa para uma primeira versão de portfólio. O volume de transações de um controle financeiro pessoal típico (dezenas a centenas de registros) é plenamente comportado em poucos kilobytes de texto.

---

## 4. Justificativa
O `localStorage` é suportado universalmente por todos os navegadores, possui API síncrona simples e direta (`getItem`, `setItem`) e oferece até 5MB de armazenamento por origem — capacidade mais do que suficiente para armazenar milhares de transações em formato JSON serializado.

Para mitigar os riscos de dados corrompidos ou erros de cota, o acesso é isolado no `StorageService`:
- Tratamento de exceções com blocos `try/catch`.
- Validação se o JSON parseado é de fato um array.
- Fallback gracioso para array vazio `[]` caso os dados estejam inválidos.

---

## 5. Consequências e Limitações Conhecidas
- **Escopo por Navegador/Dispositivo:** Os dados não sincronizam automaticamente entre celulares e computadores diferentes.
- **Segurança:** O `localStorage` pode ser inspecionado via DevTools pelo usuário e não deve armazenar credenciais ou dados bancários sensíveis reais.
- **Evolução Futura:** Caso seja necessária autenticação de usuários e sincronização em múltiplos aparelhos, a interface de `StorageService` poderá ser adaptada para se comunicar com uma API REST sem que os componentes visuais precisem ser reescritos.
