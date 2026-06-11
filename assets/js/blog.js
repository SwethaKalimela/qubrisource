(function () {
  function postUrl(slug) {
    return 'blog.html?slug=' + encodeURIComponent(slug);
  }

  function getPost(slug) {
    return BLOG_POSTS.find(function (p) { return p.slug === slug; });
  }

  function renderBlogCard(post) {
    return (
      '<div class="blog-card">' +
        '<div class="blog-thumb">' +
          responsiveImg(post.imageId, post.imageAlt, {
            widths: [400, 600, 800],
            defaultWidth: 800,
            sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
          }) +
        '</div>' +
        '<div class="blog-body">' +
          '<div class="blog-meta"><span class="blog-cat">' + post.category + '</span><span class="blog-date">' + post.date + '</span></div>' +
          '<h3><a href="' + postUrl(post.slug) + '">' + post.title + '</a></h3>' +
          '<p>' + post.excerpt + '</p>' +
          '<a href="' + postUrl(post.slug) + '" class="blog-link">Read the article →</a>' +
        '</div>' +
      '</div>'
    );
  }

  function renderBlogGrid(container, excludeSlug) {
    if (!container) return;
    var posts = excludeSlug
      ? BLOG_POSTS.filter(function (p) { return p.slug !== excludeSlug; })
      : BLOG_POSTS;
    container.innerHTML = posts.map(renderBlogCard).join('');
  }

  function renderArticlePage() {
    var params = new URLSearchParams(window.location.search);
    var slug = params.get('slug');
    var post = getPost(slug);
    var app = document.getElementById('article-app');
    var notFound = document.getElementById('article-not-found');

    if (!app) return;

    if (!post) {
      app.hidden = true;
      if (notFound) notFound.hidden = false;
      document.title = 'Article Not Found — Qubrisource Blog';
      return;
    }

    document.title = post.title + ' — Qubrisource Blog';

    app.innerHTML =
      '<header class="article-hero">' +
        '<div class="article-hero-inner">' +
          '<a href="index.html#blog" class="article-back">← Back to Blog</a>' +
          '<div class="article-meta">' +
            '<span class="article-cat">' + post.category + '</span>' +
            '<span class="article-meta-dot">·</span>' +
            '<span class="article-date">' + post.date + '</span>' +
            '<span class="article-meta-dot">·</span>' +
            '<span class="article-read">' + post.readTime + '</span>' +
          '</div>' +
          '<h1 class="article-title">' + post.titleHtml + '</h1>' +
          '<p class="article-lead">' + post.excerpt + '</p>' +
        '</div>' +
      '</header>' +
      '<div class="article-featured">' +
        responsiveImg(post.imageId, post.imageAlt, {
          defaultWidth: 1200,
          sizes: '(max-width: 1200px) 100vw, 1200px',
          loading: 'eager',
        }) +
      '</div>' +
      '<article class="article-body-wrap">' +
        '<div class="article-body">' + post.content +
          '<div class="article-cta">' +
            '<h3>' + post.cta.title + '</h3>' +
            '<p>' + post.cta.text + '</p>' +
            '<button type="button" class="btn-primary" data-bs-toggle="modal" data-bs-target="#quoteModal">Get a Free Quote →</button>' +
          '</div>' +
        '</div>' +
      '</article>' +
      '<section class="article-related">' +
        '<h2 class="article-related-hd">More from the Blog</h2>' +
        '<div class="blog-grid" id="article-related-grid" style="max-width:960px;margin:0 auto"></div>' +
      '</section>';

    renderBlogGrid(document.getElementById('article-related-grid'), post.slug);
  }

  document.addEventListener('DOMContentLoaded', function () {
    renderBlogGrid(document.getElementById('blog-grid'));
    renderArticlePage();
  });
})();
