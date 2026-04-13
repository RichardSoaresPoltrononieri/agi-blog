class HomePage {
  constructor(page) {
    this.page = page;

    this.searchButton = page.getByRole('button', { name: 'Search icon link' });
    this.searchInput  = page.locator('input.search-field, input[name="s"]').first();
    this.articles     = page.locator('article');
    this.noResults    = page.locator('.no-results, .ast-no-search-results');
  }

  async acessarHome() {
    await this.page.goto('/');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async abrirBuscaPelaLupa() {
    await this.searchButton.click({ force: true });
    await this.searchInput.waitFor({ state: 'visible' });
  }

  async buscarViaUrl(termo) {
    await this.page.goto(`/?s=${encodeURIComponent(termo)}`);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async obterQuantidadeResultados() {
    return await this.articles.count();
  }
}

module.exports = HomePage;