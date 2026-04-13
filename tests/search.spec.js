const { test, expect } = require('@playwright/test');
const HomePage    = require('../pages/HomePage');
const ArticlePage = require('../pages/ArticlePage');
const data        = require('../fixtures/searchData');

test.describe('Busca no Blog do Agi', () => {

  // ═══════════════════════════════════════════════════════════════════════════
  // CENÁRIO 1 — Busca via botão lupa (canto superior direito)
  // BUG CONHECIDO: comportamento inconsistente entre Chromium e Firefox
  // na maioria das vezes o elemento de lupa não aparece nos navegadores, ficando inacessível para os testes. Fluxo alternativo utilizado recomendado.
  // ═══════════════════════════════════════════════════════════════════════════
  test.describe('Via botão lupa', () => {

    test('Deve abrir o campo de busca ao clicar na lupa e retornar resultados', async ({ page }) => {
      test.fail(); // BUG-001 — falha esperada e documentada

      const home = new HomePage(page);
      await home.acessarHome();
      await home.abrirBuscaPelaLupa();
      await expect(home.searchInput).toBeVisible();
      await home.searchInput.fill(data.busca.valida);
      await page.keyboard.press('Enter');
      await page.waitForLoadState('domcontentloaded');
      await expect(page.locator('article')).not.toHaveCount(0);
      await expect(page).toHaveURL(/[?&]s=/);
    });

  });

  // ═══════════════════════════════════════════════════════════════════════════
  // CENÁRIO 2 — Busca via URL direta (fluxo alternativo estável)
  // Fluxo equivalente ao formulário, cross-browser confiável
  // ═══════════════════════════════════════════════════════════════════════════
  test.describe('Via URL de busca', () => {

    test('Deve retornar artigos para busca válida', async ({ page }) => {
      const home = new HomePage(page);

      await home.buscarViaUrl(data.busca.valida);

      await expect(page.locator('article')).not.toHaveCount(0);
      await expect(page).toHaveURL(/[?&]s=/);
    });

    test('Deve exibir mensagem de sem resultados para termo inválido', async ({ page }) => {
      const home = new HomePage(page);

      await home.buscarViaUrl(data.busca.invalida);

      await expect(page.locator('article')).toHaveCount(0);
      await expect(page.locator('.no-results, .ast-no-search-results, [class*="no-results"]')).toBeVisible();
    });

    test('Deve exibir mensagem de sem resultados para busca numérica', async ({ page }) => {
      const home = new HomePage(page);

      await home.buscarViaUrl(data.busca.numerica);

      await expect(page.locator('article')).toHaveCount(0);
      await expect(page.locator('.no-results, .ast-no-search-results, [class*="no-results"]')).toBeVisible();
    });

    test('Deve abrir o primeiro resultado da busca corretamente', async ({ page }) => {
      const home    = new HomePage(page);
      const article = new ArticlePage(page);

      await home.buscarViaUrl(data.busca.valida);
      await page.waitForLoadState('networkidle');

      const primeiroResultado = page.locator('article h2 a, article h3 a').first();
      const urlEsperada       = await primeiroResultado.getAttribute('href');

      await primeiroResultado.click();
      await page.waitForLoadState('domcontentloaded');

      await expect(page).toHaveURL(urlEsperada);
      await expect(article.titulo).toBeVisible();
      await expect(article.conteudo).toBeVisible();
    });

  });

});