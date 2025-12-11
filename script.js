/* ============================================
   YOUTUBE SETTINGS
============================================ */
const YOUTUBE_API_KEY = 'AIzaSyBbfuKGFUNbBKof6M_xrcqIH5ZESN7lumA';
const CHANNEL_ID = 'UCjEQh8twAgk0G1S8Z9OY_sQ';
const MAX_VIDEOS = 16;

/* ============================================
   LOAD YOUTUBE VIDEOS
============================================ */
async function loadYouTubeVideos() {
  const videoGrid = document.getElementById('videoGrid');
  if (!videoGrid) return;

  videoGrid.innerHTML =
    '<p style="text-align:center;color:#666;font-size:1.2rem;">Caricamento video...</p>';

  try {
    const apiURL = `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=${MAX_VIDEOS}`;

    const response = await fetch(apiURL);
    const data = await response.json();

    videoGrid.innerHTML = '';

    if (!data.items || data.items.length === 0) {
      videoGrid.innerHTML =
        `<p style="text-align:center;color:#666;">Nessun video trovato</p>`;
      return;
    }

    data.items.forEach((item, index) => {
      if (!item.id.videoId) return;

      const videoId = item.id.videoId;

      const container = document.createElement('div');
      container.className = 'video-container fade-in';
      container.style.animationDelay = `${index * 0.1}s`;

      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube.com/embed/${videoId}`;
      iframe.title = item.snippet.title;
      iframe.allow =
        'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      iframe.allowFullscreen = true;
      iframe.loading = 'lazy';

      container.appendChild(iframe);
      videoGrid.appendChild(container);
    });

  } catch (error) {
    console.error('Errore YouTube API:', error);
    videoGrid.innerHTML = `
      <div style="text-align:center;color:#7B1E22;padding:40px;">
        <p>Errore nel caricamento dei video.</p>
      </div>
    `;
  }
}

/* ============================================
   DOM READY
============================================ */
document.addEventListener('DOMContentLoaded', loadYouTubeVideos);

/* ============================================
   NAVBAR HAMBURGER
============================================ */
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('open');
  });

  document.querySelectorAll('.nav-links a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      hamburger.classList.remove('open');
    });
  });
}

/* ============================================
   NAVBAR SCROLL EFFECT
============================================ */
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  if (window.scrollY > 50) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');
});
