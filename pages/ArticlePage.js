class ArticlePage {
  constructor(page) {
    this.page = page;

    this.titulo   = page.locator('h1.entry-title, h1.page-title').first();
    this.conteudo = page.locator('.entry-content, .post-content').first();
  }

  async obterTitulo() {
    return await this.titulo.textContent();
  }
}

module.exports = ArticlePage;