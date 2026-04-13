# 🧪 Automação de Testes — Blog do Agi

Projeto de automação de testes end-to-end para o Blog do Agi, desenvolvido com Playwright e JavaScript como parte do Teste Técnico.

---

## 📋 Cenários Automatizados

O foco dos testes é a funcionalidade de **pesquisa de artigos** do blog (lupa no canto superior direito).

### Cenário 1 — Busca via botão lupa
Valida o fluxo principal do usuário: clicar na lupa, digitar um termo e verificar os resultados.

> ⚠️ **Bug identificado:** o elemento interno do botão de busca (`<a>` com `display:none`) do tema Astra WordPress apresenta comportamento inconsistente entre Chromium e Firefox, causando falha intermitente no clique. O bug foi documentado e o Cenário 2 cobre o mesmo fluxo de forma estável.

### Cenário 2 — Busca via URL (fluxo alternativo estável)
Valida os resultados da busca navegando diretamente para a URL de pesquisa — equivalente ao que o formulário executa internamente. Cobre:

| Teste | Descrição |
|---|---|
| Busca válida | Retorna artigos e URL com `?s=` |
| Busca inválida | Exibe mensagem de sem resultados |
| Busca numérica | Exibe mensagem de sem resultados (edge case) |
| Abrir primeiro resultado | Navega para o artigo e valida o conteúdo |

---

## 🛠️ Tecnologias

- [Node.js](https://nodejs.org/) v18+
- [Playwright](https://playwright.dev/) v1.40+
- JavaScript (CommonJS)

---

## 📁 Estrutura do Projeto
agi-blog-tests/
├── .github/
│   └── workflows/
│       └── tests.yml            # Pipeline GitHub Actions
├── fixtures/
│   └── searchData.js            # Dados de teste
├── pages/
│   ├── HomePage.js              # Page Object — home e busca
│   └── ArticlePage.js           # Page Object — página do artigo
├── tests/
│   └── search.spec.js           # Specs dos cenários
├── playwright.config.js         # Configuração do Playwright
├── package.json
└── README.md

---

## ⚙️ Pré-requisitos

- [Node.js](https://nodejs.org/) v18 ou superior
- npm v9 ou superior

Verifique sua versão:
```bash
node --version
npm --version
```

---

## 🚀 Instalação e Configuração

### 1. Clone o repositório

```bash
git clone https://github.com/RichardSoaresPoltrononieri/agi-blog.git
cd agi-blog-tests
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Instale os browsers do Playwright

```bash
npx playwright install --with-deps
```

---

## ▶️ Executando os Testes

### Todos os testes (headless)
```bash
npx playwright test
```

### Com interface do browser (headed)
```bash
npx playwright test --headed
```

### Somente no Chromium
```bash
npx playwright test --project=chromium
```

### Somente no Firefox
```bash
npx playwright test --project=firefox
```

### Um teste específico
```bash
npx playwright test -g "Deve retornar artigos para busca válida"
```

---

## 📊 Relatório de Testes

Após a execução, abra o relatório HTML:

```bash
npx playwright show-report
```

---

## 🔄 Pipeline CI/CD

O projeto possui integração com **GitHub Actions**. A cada push ou pull request na branch `main`, os testes são executados automaticamente em Chromium e Firefox.

Acesse os resultados em: `Actions` → `Playwright Tests`

---

## 🐛 Bug Documentado

| ID | Descrição | Severidade | Status |
|---|---|---|---|
| BUG-001 | Botão da lupa (`Search icon link`) falha no Chromium devido ao elemento interno `<a display:none>` do tema Astra | Médio | Aberto |

**Comportamento esperado:** clicar na lupa abre o campo de busca em todos os browsers.  
**Comportamento atual:** foi observado que na maioria das vezes o elemento de lupa não aparecia no navegador e o clique navega `<a href="#">` interno em vez de abrir o overlay, destruindo o contexto da página.  
**Workaround:** utilizar busca direta via URL (`/?s=termo`).