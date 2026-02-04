/* ==============================================
   🔧 CONFIGURATION (PERSONNALISE ICI)
   ============================================== */
const CONFIG = {
    prenom: "Mon Amour",
    motDePasse: "2024", // Le code pour entrer
    tonNumeroWhatsApp: "33600000000", // Ton numéro sans le + (ex: 336...)
    
    // Ton Juke-box (Assure-toi que les fichiers sont dans le dossier)
    playlist: [
        { name: "✨ Ton Délire", file: "musique1.mp3" },
        { name: "🌙 Douceur Nocturne", file: "musique2.mp3" },
        { name: "🌹 Ambiance Romantique", file: "musique3.mp3" }
    ],

    // Contenu des rubriques
    histoire: "<p>Tout a commencé par un simple regard... <br><br>Depuis ce jour, ma vie a changé. Chaque moment passé à tes côtés est un trésor que je garde précieusement.</p>",
    cadeaux: "<ul><li>🎫 Un massage de 30 minutes</li><li>🎫 Une soirée resto de ton choix</li><li>🎫 Un joker 'Grâce matinée'</li></ul>",
    motsDoux: "<p>Tu es la plus belle chose qui me soit arrivée. <br><br>Je t'aime plus que les mots ne peuvent l'exprimer. ❤️</p>",
    questionQuiz: "Si on partait en voyage demain, quelle serait notre destination de rêve ? Dis-moi tout !"
};

/* ==============================================
   🚀 LOGIQUE GLOBALE
   ============================================== */

let failedAttempts = 0;
let isPlaying = false;
let currentTrackIndex = -1;
let currDeg = 0;

const audioPlayer = document.getElementById('audio-player');

// --- 1. ANIMATION GALAXIE (INTRO) ---
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function initParticles() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particles = [];
    for (let i = 0; i < 150; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 + 0.5,
            speedX: Math.random() * 2 - 1,
            speedY: Math.random() * 2 - 1,
            color: `hsl(${Math.random() * 360}, 80%, 80%)`
        });
    }
}

function animateParticles() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
        if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
        ctx.fillStyle = p.color;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
    });
    requestAnimationFrame(animateParticles);
}

// --- 2. GESTION DES ÉCRANS ---
function switchScreen(fromId, toId) {
    const from = document.getElementById(fromId);
    const to = document.getElementById(toId);
    
    from.classList.remove('active');
    from.classList.add('hidden');
    
    setTimeout(() => {
        from.style.display = 'none';
        to.style.display = 'flex';
        if(toId === 'login-screen') document.querySelector('.bg-gradient').style.opacity = '1';
        void to.offsetWidth;
        to.classList.add('active');
    }, 800);
}

// --- 3. LOGIQUE SÉCURITÉ (LOGIN) ---
function checkPass() {
    const input = document.getElementById('pass-input');
    const errDiv = document.getElementById('error-msg');
    const panel = document.querySelector('.glass-panel');

    if (input.value === CONFIG.motDePasse) {
        errDiv.style.color = "#2ecc71";
        errDiv.innerText = "Accès autorisé... ❤️";
        setTimeout(() => switchScreen('login-screen', 'menu-screen'), 1000);
    } else {
        failedAttempts++;
        panel.classList.remove('shake');
        void panel.offsetWidth;
        panel.classList.add('shake');
        input.value = "";
        
        if (failedAttempts < 5) {
            const hints = ["Mauvais code... 🤭", "Réessaie encore ! ✨", "Petit indice : Notre date ?", "C'est presque ça !"];
            errDiv.innerText = hints[Math.floor(Math.random() * hints.length)];
        } else {
            errDiv.innerText = "Sérieusement ? 😭 Tu as oublié ? Je boude !";
        }
    }
}

// --- 4. CAROUSEL 3D (5 CARTES) ---
function rotateCarousel(dir) {
    const carousel = document.getElementById('carousel');
    currDeg -= dir * 72; // 360 / 5 cartes = 72 degrés
    carousel.style.transform = `rotateY(${currDeg}deg)`;
}

// --- 5. JUKE-BOX ---
function selectTrack(index) {
    if (currentTrackIndex === index) {
        if (audioPlayer.paused) { audioPlayer.play(); isPlaying = true; }
        else { audioPlayer.pause(); isPlaying = false; }
    } else {
        currentTrackIndex = index;
        audioPlayer.src = CONFIG.playlist[index].file;
        audioPlayer.play();
        isPlaying = true;
    }
    openModal(3); // Rafraîchir l'interface
}

// --- 6. MODAL & WHATSAPP ---
function openModal(index) {
    const body = document.getElementById('modal-body');
    const overlay = document.getElementById('modal-overlay');
    
    let content = "";
    switch(parseInt(index)) {
        case 0: content = `<h2>Notre Histoire 📖</h2>${CONFIG.histoire}`; break;
        case 1: content = `<h2>Tes Cadeaux 🎁</h2>${CONFIG.cadeaux}`; break;
        case 2: content = `<h2>Mots Doux 💌</h2>${CONFIG.motsDoux}`; break;
        case 3: // Juke-box
            content = `<h2>Juke-box 📻</h2><div class="playlist-container">`;
            CONFIG.playlist.forEach((t, i) => {
                const active = (currentTrackIndex === i) ? 'active' : '';
                const icon = (currentTrackIndex === i && !audioPlayer.paused) ? '⏸️' : '▶️';
                content += `<div class="music-track ${active}" onclick="selectTrack(${i})">
                    <span>${t.name}</span><button class="btn-3d" style="padding:10px;">${icon}</button>
                </div>`;
            });
            content += `</div>`;
            break;
        case 4: // Feedback
            content = `<h2>Réponds-moi 📝</h2><p>${CONFIG.questionQuiz}</p>
                       <textarea id="user-reply" placeholder="Écris ici..."></textarea>
                       <button class="btn-3d send-btn" onclick="sendToWhatsApp()">Envoyer par WhatsApp 🚀</button>`;
            break;
    }
    
    body.innerHTML = content;
    overlay.classList.add('open');
}

function closeModal() { document.getElementById('modal-overlay').classList.remove('open'); }

function sendToWhatsApp() {
    const reply = document.getElementById('user-reply').value;
    if (!reply) return alert("Dis-moi au moins un petit mot ! 😘");
    const text = `Coucou ! Voici ma réponse : ${reply}`;
    window.open(`https://wa.me/${CONFIG.tonNumeroWhatsApp}?text=${encodeURIComponent(text)}`, '_blank');
}

// --- INITIALISATION ---
window.onload = () => {
    document.getElementById('u-name').innerText = CONFIG.prenom;
    initParticles();
    animateParticles();

    // Event listeners
    document.getElementById('login-btn').onclick = checkPass;
    document.querySelector('.nav-btn.prev').onclick = () => rotateCarousel(-1);
    document.querySelector('.nav-btn.next').onclick = () => rotateCarousel(1);
    document.querySelector('.close-modal').onclick = closeModal;
    
    document.querySelectorAll('.menu-card').forEach(card => {
        card.onclick = () => openModal(card.getAttribute('data-index'));
    });

    // Pétales de fond
    const bg = document.getElementById('bg-container');
    for(let i=0; i<15; i++) {
        let p = document.createElement('div');
        p.className = 'petal';
        p.style.left = Math.random()*100+'%';
        p.style.width = p.style.height = (Math.random()*10+5)+'px';
        p.style.animationDuration = (Math.random()*5+5)+'s';
        p.style.animationDelay = Math.random()*5+'s';
        bg.appendChild(p);
    }

    // Fin de l'intro après 4.5s
    setTimeout(() => {
        switchScreen('intro-screen', 'login-screen');
    }, 4500);
};
