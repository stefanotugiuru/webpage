// ============================
// YOUTUBE
// ============================

// SECURITY: Restrict this key in Google Cloud Console to HTTP referrers
// matching https://stefanotugiuru.space/* to prevent abuse.
const YOUTUBE_API_KEY = 'AIzaSyBbfuKGFUNbBKof6M_xrcqIH5ZESN7lumA';
const CHANNEL_ID = 'UCjEQh8twAgk0G1S8Z9OY_sQ';
const MAX_VIDEOS = 16;

const YOUTUBE_API_URL =
  `https://www.googleapis.com/youtube/v3/search` +
  `?key=${YOUTUBE_API_KEY}` +
  `&channelId=${CHANNEL_ID}` +
  `&part=id` +
  `&order=date` +
  `&type=video` +
  `&maxResults=${MAX_VIDEOS}` +
  `&fields=items(id/videoId)`;

async function loadYouTubeVideos() {
  const videoGrid = document.getElementById('videoGrid');
  if (!videoGrid) return;

  try {
    const response = await fetch(YOUTUBE_API_URL);
    if (!response.ok) throw new Error('YouTube API error');

    const data = await response.json();
    if (!data.items || !data.items.length) return;

    videoGrid.innerHTML = '';

    data.items.forEach(item => {
      const videoId = item.id.videoId;
      if (!videoId) return;

      const videoBox = document.createElement('div');
      videoBox.className = 'video-box';

      videoBox.innerHTML = `
        <div class="video-thumb" data-id="${videoId}" role="button" tabindex="0" aria-label="Play video">
          <img
            src="https://i.ytimg.com/vi/${videoId}/hqdefault.jpg"
            alt="YouTube video thumbnail"
            loading="lazy"
            decoding="async">
        </div>
      `;

      videoGrid.appendChild(videoBox);
    });

  } catch (error) {
    videoGrid.style.display = 'none';
  }
}

// CLICK / KEYBOARD THUMB → IFRAME
function activateVideoThumb(thumb) {
  const id = thumb.dataset.id;
  thumb.outerHTML = `
    <iframe
      src="https://www.youtube.com/embed/${id}?autoplay=1"
      title="YouTube video player"
      loading="lazy"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen>
    </iframe>
  `;
}

document.addEventListener('click', e => {
  const thumb = e.target.closest('.video-thumb');
  if (thumb) activateVideoThumb(thumb);
});

document.addEventListener('keydown', e => {
  if (e.key !== 'Enter' && e.key !== ' ') return;
  const thumb = e.target.closest('.video-thumb');
  if (thumb) { e.preventDefault(); activateVideoThumb(thumb); }
});

// ============================
// BLOG (pagina /blog)
// ============================

function initBlog() {
  const grid = document.getElementById("blog-grid");
  const filterButtons = document.querySelectorAll(".filter-btn");
  if (!grid) return;

  fetch("data/posts.json")
    .then(res => res.json())
    .then(posts => {

      posts.sort((a, b) => new Date(b.date) - new Date(a.date));
      render(posts, "all");

      filterButtons.forEach(btn => {
        btn.addEventListener("click", () => {
          filterButtons.forEach(b => b.classList.remove("active"));
          btn.classList.add("active");
          render(posts, btn.dataset.category);
        });
      });
    })
    .catch(() => {});

  function render(posts, category) {
    grid.innerHTML = "";

    posts
      .filter(p => {
        const selected = category.toLowerCase();
        const postCategory = (p.category || "").toLowerCase();

        if (selected === "all") return true;
        return postCategory === selected;
      })
      .forEach(post => {
        const card = document.createElement("a");

        const categoryPaths = {
          recipes: "recipes",
          guides: "guides",
          travel: "travel",
          reviews: "reviews",
          ai: "ai",
          marketing: "marketing",
          "agentic-workflow": "agentic-workflow"
        };
        card.href = categoryPaths[post.category]
          ? `/blog/${categoryPaths[post.category]}/${post.url}`
          : `/blog/${post.url}`;

        card.className = "blog-card";

        card.innerHTML = `
          <div class="blog-card-image">
            <img src="${post.image}" alt="${post.title}" loading="lazy">
            <span class="blog-category">${post.category}</span>
          </div>
          <div class="blog-card-content">
            <h3>${post.title}</h3>
          </div>
        `;

        grid.appendChild(card);
      });
  }
}

// ============================
// MORE RECIPES (FEATURED STYLE)
// ============================

function initMoreRecipes() {
  const container = document.getElementById("more-recipes-list");
  if (!container) return;

  const currentFile = decodeURIComponent(
    window.location.pathname.split("/").pop()
  );

  fetch("/data/posts.json")
    .then(res => res.json())
    .then(posts => {

      posts
        .filter(p =>
          (p.category || "").toLowerCase() === "recipes" &&
          p.url !== currentFile
        )
        .slice(0, 9)
        .forEach(recipe => {
          const card = document.createElement("a");

          card.href = `/blog/recipes/${recipe.url}`;
          card.className = "content-card";

          card.innerHTML = `
            <div class="content-card-image">
              <img
                src="../../${recipe.image}"
                alt="${recipe.title}"
                loading="lazy"
                decoding="async">
            </div>
            <div class="content-card-content">
              <span class="content-card-category">${recipe.category}</span>
              <h3>${recipe.title}</h3>
            </div>
          `;

          container.appendChild(card);
        });
    })
    .catch(() => {});
}

// ============================
// MORE ARTICLES (STESSO DESIGN)
// ============================

function initMoreArticles() {
  const container = document.getElementById("more-articles-list");
  if (!container) return;

  const currentFile = decodeURIComponent(
    window.location.pathname.split("/").pop()
  );

  fetch("/data/posts.json")
    .then(res => res.json())
    .then(posts => {

      posts
        .filter(p =>
          (p.category || "").toLowerCase() !== "recipes" &&
          p.url !== currentFile
        )
        .slice(0, 9)
        .forEach(article => {
          const category = (article.category || "").toLowerCase();

          const card = document.createElement("a");
          card.href =
            category === "guides"
              ? `/blog/guides/${article.url}`
              : `/blog/${article.url}`;

          card.className = "content-card";

          card.innerHTML = `
            <div class="content-card-image">
              <img
                src="../../${article.image}"
                alt="${article.title}"
                loading="lazy"
                decoding="async">
            </div>
            <div class="content-card-content">
              <span class="content-card-category">${article.category}</span>
              <h3>${article.title}</h3>
            </div>
          `;

          container.appendChild(card);
        });
    })
    .catch(() => {});
}

// ============================
// READING PROGRESS BAR
// ============================

function initProgressBar() {
  if (!document.querySelector('.article-container')) return;

  const bar = document.createElement('div');
  bar.className = 'reading-progress';
  bar.setAttribute('role', 'progressbar');
  bar.setAttribute('aria-label', 'Reading progress');
  bar.setAttribute('aria-valuemin', '0');
  bar.setAttribute('aria-valuemax', '100');
  document.body.prepend(bar);

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? Math.round(scrollTop / docHeight * 100) : 0;
    bar.style.width = pct + '%';
    bar.setAttribute('aria-valuenow', pct);
  }, { passive: true });
}

// ============================
// BACK TO TOP FLOATING BUTTON
// ============================

function initBackToTop() {
  if (!document.querySelector('.article-container')) return;

  const btn = document.createElement('button');
  btn.className = 'back-to-top-btn';
  btn.setAttribute('aria-label', 'Back to top');
  btn.innerHTML = '<i class="fas fa-chevron-up"></i>';
  document.body.appendChild(btn);

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 300);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ============================
// SHARE BUTTONS
// ============================

function initShareButtons() {
  const article = document.querySelector('.article-container');
  if (!article) return;

  const url = encodeURIComponent(window.location.href);
  const title = encodeURIComponent(document.title);

  const section = document.createElement('div');
  section.className = 'share-section';
  section.innerHTML = `
    <span class="share-label">Share</span>
    <a class="share-btn share-btn--twitter"
       href="https://twitter.com/intent/tweet?url=${url}&text=${title}"
       target="_blank" rel="noopener noreferrer" aria-label="Share on X">
      <i class="fab fa-x-twitter"></i> X
    </a>
    <a class="share-btn share-btn--whatsapp"
       href="https://wa.me/?text=${title}%20${url}"
       target="_blank" rel="noopener noreferrer" aria-label="Share on WhatsApp">
      <i class="fab fa-whatsapp"></i> WhatsApp
    </a>
    <a class="share-btn share-btn--facebook"
       href="https://www.facebook.com/sharer/sharer.php?u=${url}"
       target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook">
      <i class="fab fa-facebook"></i> Facebook
    </a>
    <a class="share-btn share-btn--linkedin"
       href="https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}"
       target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn">
      <i class="fab fa-linkedin"></i> LinkedIn
    </a>
    <a class="share-btn share-btn--pinterest"
       href="https://pinterest.com/pin/create/button/?url=${url}&description=${title}"
       target="_blank" rel="noopener noreferrer" aria-label="Share on Pinterest">
      <i class="fab fa-pinterest"></i> Pinterest
    </a>
    <a class="share-btn share-btn--telegram"
       href="https://t.me/share/url?url=${url}&text=${title}"
       target="_blank" rel="noopener noreferrer" aria-label="Share on Telegram">
      <i class="fab fa-telegram"></i> Telegram
    </a>
    <a class="share-btn share-btn--reddit"
       href="https://www.reddit.com/submit?url=${url}&title=${title}"
       target="_blank" rel="noopener noreferrer" aria-label="Share on Reddit">
      <i class="fab fa-reddit"></i> Reddit
    </a>
    <a class="share-btn share-btn--email"
       href="mailto:?subject=${title}&body=${url}"
       aria-label="Share via Email">
      <i class="fas fa-envelope"></i> Email
    </a>
    <button class="share-btn share-btn--copy" aria-label="Copy link">
      <i class="fas fa-link"></i> Copy link
    </button>
  `;

  article.after(section);

  section.querySelector('.share-btn--copy').addEventListener('click', function () {
    navigator.clipboard.writeText(window.location.href).then(() => {
      this.innerHTML = '<i class="fas fa-check"></i> Copied!';
      this.classList.add('copied');
      setTimeout(() => {
        this.innerHTML = '<i class="fas fa-link"></i> Copy link';
        this.classList.remove('copied');
      }, 2000);
    }).catch(() => {});
  });
}

// ============================
// AUTO TABLE OF CONTENTS
// ============================

function initTOC() {
  const content = document.querySelector('.article-content');
  if (!content) return;

  const headings = Array.from(content.querySelectorAll('h2')).filter(
    h => !h.closest('.toc') && h.textContent.trim() !== 'References'
  );
  if (headings.length < 3) return;

  headings.forEach(h => {
    if (!h.id) {
      h.id = h.textContent.toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .substring(0, 50);
    }
  });

  const items = headings.map(h =>
    `<li><a href="#${h.id}">${h.textContent.trim()}</a></li>`
  ).join('');

  const toc = document.createElement('nav');
  toc.className = 'toc';
  toc.setAttribute('aria-label', 'Table of contents');
  toc.innerHTML = `
    <p class="toc-title"><i class="fas fa-list-ul"></i> In this article</p>
    <ul class="toc-list">${items}</ul>
  `;

  headings[0].before(toc);
}

// ============================
// BREADCRUMB
// ============================

function initBreadcrumb() {
  const hero = document.querySelector('.blog-hero');
  if (!hero) return;

  const path = window.location.pathname;
  let categoryLabel, categoryHref;

  if (path.includes('/blog/recipes/')) {
    categoryLabel = 'Recipes';
    categoryHref = '/blog.html';
  } else if (path.includes('/blog/guides/')) {
    categoryLabel = 'Guides';
    categoryHref = '/blog.html';
  } else {
    return;
  }

  const h1 = hero.querySelector('h1');
  const pageTitle = h1 ? h1.textContent.trim() : '';

  const nav = document.createElement('nav');
  nav.className = 'breadcrumb';
  nav.setAttribute('aria-label', 'Breadcrumb');
  nav.innerHTML = `
    <ol class="breadcrumb-list">
      <li><a href="/">Home</a></li>
      <li><a href="/blog.html">Blog</a></li>
      <li><a href="${categoryHref}">${categoryLabel}</a></li>
      <li><span>${pageTitle}</span></li>
    </ol>
  `;
  hero.before(nav);

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://stefanotugiuru.space/" },
      { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://stefanotugiuru.space/blog.html" },
      { "@type": "ListItem", "position": 3, "name": categoryLabel, "item": "https://stefanotugiuru.space" + categoryHref },
      { "@type": "ListItem", "position": 4, "name": pageTitle }
    ]
  };
  const schemaEl = document.createElement('script');
  schemaEl.type = 'application/ld+json';
  schemaEl.textContent = JSON.stringify(schema);
  document.head.appendChild(schemaEl);
}

// ============================
// NAVBAR
// ============================

function initNavbar() {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  const navbar = document.querySelector('.navbar');
  if (!hamburger || !navLinks || !navbar) return;

  function toggleNav() {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', hamburger.classList.contains('open'));
  }

  hamburger.addEventListener('click', toggleNav);

  hamburger.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleNav(); }
    if (e.key === 'Escape') {
      hamburger.classList.remove('open');
      navLinks.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && navLinks.classList.contains('active')) {
      hamburger.classList.remove('open');
      navLinks.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });
}

// ============================
// INIT
// ============================

document.addEventListener("DOMContentLoaded", () => {
  loadYouTubeVideos();
  initBlog();
  initMoreRecipes();
  initMoreArticles();
  initNavbar();
  initProgressBar();
  initBackToTop();
  initShareButtons();
  initTOC();
  initBreadcrumb();
});
