/* =========================================
   CONFIGURAZIONE YOUTUBE API
========================================= */

const YOUTUBE_API_KEY = "AIzaSyBbfuKGFUNbBKof6M_xrcqIH5ZESN7lumA";
const CHANNEL_ID = "UCjEQh8twAgk0G1S8Z9OY_sQ";
const MAX_VIDEOS = 16;

/* =========================================
   FUNZIONE PRINCIPALE — CARICA VIDEO
========================================= */

async function loadYouTubeVideos() {
    const videoGrid = document.getElementById("videoGrid");
    if (!videoGrid) return;

    videoGrid.innerHTML = `
        <div class="loading-indicator">
            <i class="fas fa-circle-notch"></i>
            <p>Caricamento video...</p>
        </div>
    `;

    try {
        const apiURL = `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=${MAX_VIDEOS}`;

        console.log("[YouTube] API Request:", apiURL);

        const response = await fetch(apiURL);
        console.log("[YouTube] Stato risposta:", response.status);

        const data = await response.json();
        console.log("[YouTube] Risposta API:", data);

        // Controllo validità risposta
        if (!data.items || data.items.length === 0) {
            videoGrid.innerHTML = `<p>Nessun video disponibile.</p>`;
            return;
        }

        // Reset contenuto
        videoGrid.innerHTML = "";

        let index = 0;

        data.items.forEach(item => {
            const videoId = item.id.videoId;
            if (!videoId) return;

            // Creazione container video
            const container = document.createElement("div");
            container.className = "video-container fade-in";
            container.style.animationDelay = `${index * 0.1}s`;

            // Creazione iframe
            const iframe = document.createElement("iframe");
            iframe.src = `https://www.youtube.com/embed/${videoId}`;
            iframe.loading = "lazy";
            iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
            iframe.allowFullscreen = true;

            container.appendChild(iframe);
            videoGrid.appendChild(container);

            index++;
        });

        console.log("[YouTube] Video caricati nella griglia:", index);

        // Attiva animazioni fade-in
        setTimeout(() => {
            document.querySelectorAll(".video-container").forEach(el => {
                el.classList.add("show");
            });
        }, 80);

    } catch (error) {
        console.error("[YouTube] Errore API:", error);
        videoGrid.innerHTML = `
            <div style="text-align:center; padding:40px; color:#7B1E22;">
                <p>Errore durante il caricamento dei video.</p>
            </div>
        `;
    }
}

/* =========================================
   NAV MOBILE (Hamburger)
========================================= */

document.addEventListener("DOMContentLoaded", () => {
    console.log("[Init] DOM Loaded – script.js attivo");

    loadYouTubeVideos();

    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");

    if (hamburger && navLinks) {
        hamburger.addEventListener("click", () => {
            hamburger.classList.toggle("open");
            navLinks.classList.toggle("active");
        });

        document.querySelectorAll(".nav-links a").forEach(link => {
            link.addEventListener("click", () => {
                navLinks.classList.remove("active");
                hamburger.classList.remove("open");
            });
        });
    }
});

/* =========================================
   NAVBAR SHADOW SCROLL
========================================= */

window.addEventListener("scroll", () => {
    const navbar = document.querySelector(".navbar");
    if (!navbar) return;

    if (window.scrollY > 50) navbar.classList.add("scrolled");
    else navbar.classList.remove("scrolled");
});
