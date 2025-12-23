// ============================
// YOUTUBE
// ============================
const YOUTUBE_API_KEY = 'AIzaSyBbfuKGFUNbBKof6M_xrcqIH5ZESN7lumA';
const CHANNEL_ID = 'UCjEQh8twAgk0G1S8Z9OY_sQ';
const MAX_VIDEOS = 16;

async function loadYouTubeVideos() {
  const videoGrid = document.getElementById('videoGrid');
  if (!videoGrid) return;

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&type=video&maxResults=${MAX_VIDEOS}`
    );

    const data = await response.json();
    videoGrid.innerHTML = '';

    data.items.forEach((item) => {
      // 🔑 WRAPPER
      const container = document.createElement('div');
      container.className = 'video-container';

      // 🔑 IFRAME
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube.com/embed/${item.id.videoId}`;
      iframe.allowFullscreen = true;
      iframe.setAttribute('loading', 'lazy');

      container.appendChild(iframe);
      videoGrid.appendChild(container);
    });
  } catch (e) {
    console.error(e);
  }
}
// ============================
// BLOG AUTO
// ============================
function initBlog() {
  const grid = document.getElementById("blog-grid");
  if (!grid) return;

  const filterButtons = document.querySelectorAll(".filter-btn");
  let allPosts = [];

  fetch("data/posts.json")
    .then(res => res.json())
    .then(posts => {
      allPosts = posts;
      render("all");
    });

  function render(category) {
    grid.innerHTML = "";
    allPosts
      .filter(p => category === "all" || p.category === category)
      .forEach(post => {
        grid.innerHTML += `
          <a href="${post.url}" class="blog-card">
            <div class="blog-card-image">
              <img src="${post.image}" alt="${post.title}">
              <span class="blog-category">${post.category}</span>
            </div>
            <div class="blog-card-content">
              <h3>${post.title}</h3>
            </div>
          </a>
        `;
      });
  }

  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      filterButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      render(btn.dataset.category);
    });
  });
}
// ============================
// Aggiornamento blog automatico
// ============================
document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("blog-grid");
  if (!grid) return;

  fetch("data/posts.json")
    .then(res => res.json())
    .then(posts => {
      grid.innerHTML = "";

      posts.forEach(post => {
        grid.innerHTML += `
          <a href="${post.url}" class="blog-card">
            <div class="blog-card-image">
              <img src="${post.image}" alt="${post.title}">
              <span class="blog-category">${post.category}</span>
            </div>
            <div class="blog-card-content">
              <h3>${post.title}</h3>
            </div>
          </a>
        `;
      });
    })
    .catch(err => console.error("Errore blog:", err));
});

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
      const recipes = posts
        .filter(p =>
          p.category === "recipes" &&
          !p.url.includes(currentFile)
        )
        .slice(0, 5);

      container.innerHTML = "";

      recipes.forEach(recipe => {
        container.innerHTML += `
          <a href="../../${recipe.url}" class="recipe-card">
            <div class="recipe-card-image">
              <img src="../../${recipe.image}" alt="${recipe.title}">
            </div>
            <div class="recipe-card-content">
              <h3>${recipe.title}</h3>
            </div>
          </a>
        `;
      });
    })
    .catch(err => console.error("More recipes error:", err));
}

// ============================
// NAVBAR
// ============================
function initNavbar() {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('open');
  });
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

