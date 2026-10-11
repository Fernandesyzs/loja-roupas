# 📋 Relatório do Projeto `loja-roupas` (Loja GuetoSL)

> Relatório para reuso com outra IA. **Nenhuma alteração foi feita no código** — apenas análise.

---

## 1. Visão Geral
- **O que é:** Loja virtual (e-commerce) fictícia de roupas da marca **GuetoSL**, aparentemente um TCC/projeto acadêmico.
- **Stack:** React 19 + Vite 8, React Router DOM 7, Bootstrap 5 + Bootstrap Icons, oxlint (linter), JavaScript puro (JSX), CSS simples.
- **Estado atual:** Commit único `a0f8252` — "catalogo, carrinho e contato com Bootstrap". Projeto funcional e enxuto.
- **Como rodar:** `npm run dev` (desenvolvimento) · `npm run build` (build) · `npm run lint` (oxlint) · `npm run preview`.

---

## 2. Estrutura de Pastas

```
loja-roupas/
├── index.html                 # HTML raiz (título "GuetoSL — Loja de Roupas")
├── vite.config.js             # Config mínima do Vite + plugin React
├── package.json
├── public/                    # Servido na raiz "/"
│   ├── favicon.svg            # ⚠️ Ícone padrão do Vite (roxo), não é da marca
│   ├── icons.svg              # ⚠️ Ícones do template Vite (bluesky, discord, github...)
│   └── Imagem/
│       ├── logo.png
│       ├── placeholder.svg    # Fallback de imagem
│       ├── LEIA-ME.txt        # Instruções sobre fotos de produtos
│       ├── Branca/1.png · Preta/5.png · Cinza/9.png
└── src/
    ├── main.jsx               # Entry point: Bootstrap + Router + App
    ├── App.jsx                # Rotas + CartProvider + Header/Footer
    ├── index.css              # Variáveis CSS globais + fonte Poppins
    ├── components/
    │   ├── Header.jsx         # 2 navbars (topo com cupom + menu)
    │   └── Footer.jsx         # Rodapé
    ├── context/
    │   └── CartContext.jsx    # Estado global do carrinho
    ├── data/
    │   └── products.js        # Produtos estáticos + parsePrice/formatPrice
    └── pages/
        ├── Home.jsx           # Vitrine/produtos
        ├── Cart.jsx + Cart.css# Página do carrinho
        └── Contact.jsx        # Contato + FAQ + formulário
```

---

## 3. Rotas (`App.jsx`)
| Rota | Componente |
|------|-----------|
| `/` | `Home` (coleção/produtos) |
| `/carrinho` | `Cart` |
| `/contato` | `Contact` |

Envoltório: `<CartProvider>` → `<Header>` + `<Routes>` + `<Footer>`.

---

## 4. Arquitetura e Lógica Principal

### `CartContext.jsx` — Estado do Carrinho
- Usa Context API + `useState` e `useMemo`.
- Itens no formato `{ id, qty }`.
- Funções: `addItem(product)` (incrementa se existe), `removeItem(id)`, `setQty(id, qty)` (mínimo 1), e `totalCount` (soma das quantidades).
- Hook `useCart()` com proteção de erro se usado fora do provider.
- ⚠️ **Não persiste dados** (sem `localStorage`) — o carrinho zera ao recarregar a página.

### `products.js` — Dados
- `staticProducts`: array com 3 produtos (id, name, image, price, pricePix, installment).
- ⚠️ **Preços são strings** no formato BR (`"119,90"`), não números.
- `parsePrice("119,90")` → `119.9` (converte string → número).
- `formatPrice(119.9)` → `"R$ 119,90"` (formata via `toLocaleString pt-BR`).

### Páginas
- **Home:** Banner de benefícios (frete grátis, cupom, parcelamento) + grid de produtos com botão "Comprar" (adiciona ao carrinho) e toast/notificação temporária. Usa `onError` para mostrar `placeholder.svg`.
- **Cart:** Lista itens, calcula subtotal, frete (grátis acima de R$238,90, senão R$19,90) e total. Botão "Finalizar compra" é **apenas visual** (sem ação).
- **Contact:** 3 cards de contato (WhatsApp/e-mail/Instagram), formulário controlado (`nome, email, assunto, mensagem`) que **apenas mostra mensagem de sucesso local** (não envia de verdade), e um accordion de FAQ (usa JS do Bootstrap via `data-bs-*`).

---

## 5. Estilização
- **Bootstrap 5** (importado em `main.jsx`) para layout/componentes.
- **Variáveis CSS** definidas em `index.css`: `--primary-color`, `--secondary-color`, `--accent-color`, `--badge-color`.
- `Cart.css` é o único CSS com escopo de página (BEM: `.cart`, `.cart__line`, `.cart__summary`...).
- Fonte: **Poppins** (Google Fonts).
- ⚠️ **Inconsistência detectada:** `Cart.css` usa muitas variáveis **não definidas em lugar nenhum**: `--font-display`, `--font-mono`, `--gold`, `--rust`, `--paper`, `--grey`, `--line`, `--line-strong`, `--bg`. Como não existem, esses estilos **não surtem efeito** (ficam com valor padrão do navegador).

---

## 6. Pontos de Atenção / Oportunidades de Melhoria
1. **Variáveis CSS órfãs no `Cart.css`** (listadas acima) — cores e fontes do carrinho provavelmente não aparecem como o esperado. **Definir no `:root`** ou substituir por valores fixos.
2. **Carrinho não persiste** — adicionar `localStorage` para não perder itens ao recarregar.
3. **Preços como string** — funciona, mas é frágil; ideal usar `number` no dado e formatar só na exibição.
4. **Ações sem back-end:** "Finalizar compra", formulário de contato, login e cupom são apenas visuais/simulados.
5. **Ícones do template Vite** (`icons.svg`, `favicon.svg` roxo) ainda presentes e não usados pela marca — `icons.svg` parece nem ser referenciado.
6. **Sem testes** e **sem TypeScript** (README sugere TS para produção).
7. **Falta um `catch-all`** (rota 404) no React Router.

---

## 7. Convenções do Código
- Componentes funcionais React com hooks.
- Imports com extensão `.jsx`.
- Nomes de componentes em PascalCase; CSS com padrão BEM no carrinho.
- Comentários em português.
- Lint via `oxlint` com plugins `react` e `oxc`.
- Textos/idioma da interface em português (mas `index.html` tem `lang="en"` — ⚠️ poderia ser `pt-BR`).

---

### ✅ Resumo em uma frase
Projeto **React + Vite + Bootstrap** de e-commerce estático (GuetoSL), com **catálogo, carrinho (Context API) e página de contato**, bem organizado e enxuto, mas com **variáveis CSS do carrinho não definidas**, **carrinho não persistente** e **ações de compra/contato apenas visuais** — ótima base para evoluir.
