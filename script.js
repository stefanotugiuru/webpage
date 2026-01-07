// ============================
// YOUTUBE
// ============================

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
        <div class="video-thumb" data-id="${videoId}">
          <img
            src="https://i.ytimg.com/vi/${videoId}/hqdefault.jpg"
            alt="YouTube video"
            loading="lazy"
            decoding="async">
        </div>
      `;

      videoGrid.appendChild(videoBox);
    });

  } catch (error) {
    console.warn('YouTube videos not available:', error.message);
    videoGrid.style.display = 'none';
  }
}

// CLICK THUMB → IFRAME
document.addEventListener('click', e => {
  const thumb = e.target.closest('.video-thumb');
  if (!thumb) return;

  const id = thumb.dataset.id;

  thumb.outerHTML = `
    <iframe
      src="https://www.youtube.com/embed/${id}?autoplay=1"
      loading="lazy"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen>
    </iframe>
  `;
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
    .catch(err => console.error("Blog error:", err));

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

        card.href =
          post.category === "recipes"
            ? `/blog/recipes/${post.url}`
            : post.category === "guides"
              ? `/blog/guides/${post.url}`
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
    .catch(err => console.error("More recipes error:", err));
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
    .catch(err => console.error("More articles error:", err));
}

// ============================
// NAVBAR
// ============================

function initNavbar() {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  const navbar = document.querySelector('.navbar');
  if (!hamburger || !navLinks || !navbar) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('active');
    hamburger.setAttribute(
      'aria-expanded',
      hamburger.classList.contains('open')
    );
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
});
