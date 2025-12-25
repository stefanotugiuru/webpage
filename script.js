// ============================
// YOUTUBE
// ============================
const YOUTUBE_API_KEY = 'YOUR_API_KEY';
const CHANNEL_ID = 'UCjEQh8twAgk0G1S8Z9OY_sQ';
const MAX_VIDEOS = 16;

async function loadYouTubeVideos() {
  const videoGrid = document.getElementById('videoGrid');
  if (!videoGrid) return;

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&type=video&maxResults=${MAX_VIDEOS}`
    );

    if (!response.ok) throw new Error('YouTube API error');

    const data = await response.json();
    const fragment = document.createDocumentFragment();

    data.items.forEach(item => {
      const container = document.createElement('div');
      container.className = 'video-container';

      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube.com/embed/${item.id.videoId}`;
      iframe.allowFullscreen = true;
      iframe.loading = 'lazy';

      container.appendChild(iframe);
      fragment.appendChild(container);
    });

    videoGrid.innerHTML = '';
    videoGrid.appendChild(fragment);

  } catch (err) {
    console.error('YouTube error:', err);
  }
}

// ============================
// BLOG
// ============================
function initBlog() {
  const grid = document.getElementById("blog-grid");
  const filterButtons = document.querySelectorAll(".filter-btn");
  if (!grid) return;

  fetch("data/posts.json")
    .then(res => res.json())
    .then(posts => {
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
    const fragment = document.createDocumentFragment();
    grid.innerHTML = "";

    posts
      .filter(p => category === "all" || p.category === category)
      .forEach(post => {
        const card = document.createElement("a");
        card.href = post.url;
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

        fragment.appendChild(card);
      });

    grid.appendChild(fragment);
  }
}

// ============================
// MORE RECIPES
// ============================
function initMoreRecipes() {
  const container = document.getElementById("more-recipes-list");
  if (!container) return;

  const currentFile = window.location.pathname.split("/").pop();

  fetch("../../data/posts.json")
    .then(res => res.json())
    .then(posts => {
      const fragment = document.createDocumentFragment();

      posts
        .filter(p => p.category === "recipes" && !p.url.includes(currentFile))
        .slice(0, 5)
        .forEach(recipe => {
          const card = document.createElement("a");
          card.href = `../../${recipe.url}`;
          card.className = "recipe-card";

          card.innerHTML = `
            <div class="recipe-card-image">
              <img src="../../${recipe.image}" alt="${recipe.title}" loading="lazy">
            </div>
            <div class="recipe-card-content">
              <h3>${recipe.title}</h3>
            </div>
          `;

          fragment.appendChild(card);
        });

      container.innerHTML = "";
      container.appendChild(fragment);
    })
    .catch(err => console.error("More recipes error:", err));
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
  initNavbar();
});
