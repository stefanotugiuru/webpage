/* ============================================
   CONFIG YOUTUBE
============================================ */
const YOUTUBE_API_KEY = 'AIzaSyBbfuKGFUNbBKof6M_xrcqIH5ZESN7lumA';
const CHANNEL_ID = 'UCjEQh8twAgk0G1S8Z9OY_sQ';
const MAX_VIDEOS = 16;

/* ============================================
   FUNZIONE PRINCIPALE: CARICA I VIDEO
============================================ */
async function loadYouTubeVideos() {
  const videoGrid = document.getElementById('videoGrid');

  console.log('[YouTube] Avvio loadYouTubeVideos');

  if (!videoGrid) {
    console.error('[YouTube] ERRORE: elemento #videoGrid non trovato');
    return;
  }

  videoGrid.innerHTML =
    '<p style="text-align:center;color:#666;font-size:1.2rem;">Caricamento video...</p>';

  try {
    const apiURL = `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=${MAX_VIDEOS}`;

    console.log('[YouTube] Chiamata API URL:', apiURL);

    const response = await fetch(apiURL);

    console.log('[YouTube] Status risposta:', response.status);

    if (!response.ok) {
      const text = await response.text();
      console.error('[YouTube] Risposta non OK:', text);
      videoGrid.innerHTML = `
        <div style="text-align:center;color:#7B1E22;padding:40px;">
          <p>Errore YouTube API (HTTP ${response.status}).</p>
          <p style="font-size:0.9rem;color:#555;">Dettagli: ${text}</p>
        </div>
      `;
      return;
    }

    const data = await response.json();
    console.log('[YouTube] Dati ricevuti:', data);

    videoGrid.innerHTML = '';

    if (!data.items || data.items.length === 0) {
      console.warn('[YouTube] Nessun video trovato');
      videoGrid.innerHTML =
        `<p style="text-align:center;color:#666;">Nessun video trovato</p>`;
      return;
    }

    data.items.forEach((item, index) => {
      if (!item.id || !item.id.videoId) {
        console.warn('[YouTube] Item senza videoId, saltato:', item);
        return;
      }

      const videoId = item.id.videoId;

      const container = document.createElement('div');
      container.className = 'video-container fade-in';
      container.style.animationDelay = `${index * 0.1}s`;

      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube.com/embed/${videoId}`;
      iframe.title = item.snippet?.title || 'YouTube video';
      iframe.allow =
        'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      iframe.allowFullscreen = true;
      iframe.loading = 'lazy';

      container.appendChild(iframe);
      videoGrid.appendChild(container);
    });

    console.log('[YouTube] Video creati nella griglia');

  } catch (error) {
    console.error('[YouTube] Errore nella fetch:', error);
    const videoGrid = document.getElementById('videoGrid');
    if (videoGrid) {
      videoGrid.innerHTML = `
        <div style="text-align:center;color:#7B1E22;padding:40px;">
          <p>Errore nel caricamento dei video.</p>
          <p style="font-size:0.9rem;color:#555;">${error}</p>
        </div>
      `;
    }
  }
}

/* ============================================
   DOM READY: TEST + CARICAMENTO VIDEO
============================================ */
document.addEventListener('DOMContentLoaded', () => {
  console.log('[Init] DOMContentLoaded – script.js sta funzionando');

  const videoGrid = document.getElementById('videoGrid');
  if (!videoGrid) {
    console.error('[Init] ERRORE: #videoGrid non esiste nel DOM');
  } else {
    // test visivo per capire che JS è attivo
    videoGrid.insertAdjacentHTML(
      'beforeend',
      '<p style="text-align:center;color:#aaa;">Test JS OK – ora carico i video...</p>'
    );
  }

  loadYouTubeVideos();
});

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
