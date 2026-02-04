/* ==============================================
   🔧 CONFIGURATION (C'EST ICI QUE TU MODIFIES)
   ============================================== */

const CONFIG = {
    prenom: "Mon Cœur",         // Son prénom
    motDePasse: "2024",         // Code secret
    tonNumeroWhatsApp: "33612345678", // ⚠️ METS TON NUMÉRO ICI (ex: 336... sans le +)
    
    // Tes questions pour elle (dans la partie Quiz)
    questionPourElle: "Si on devait partir demain, tu voudrais aller où ? Et quel est ton meilleur souvenir avec moi ?",

    // Contenu des cartes
    cartes: [
        {
            title: "Notre Histoire 📖",
            body: "<p>C'est l'histoire d'un garçon et d'une fille...<br><br>Tout a commencé le [DATE]. Depuis, chaque jour est une aventure. <br><br>Tu te souviens de [SOUVENIR] ?</p>"
        },
        {
            title: "Tes Cadeaux 🎁",
            body: "<ul><li>🎫 Un massage crânien (par moi)</li><br><li>🎫 Un dîner fait maison</li><br><li>🎫 Une soirée film sans râler sur le choix</li></ul>"
        },
        {
            title: "Mots Doux 💌",
            body: "<p>Je ne te le dis peut-être pas assez, mais tu es incroyable. <br><br>J'aime ta façon de rire, j'aime [DÉTAIL].<br><br>Je t'aime. ❤️</p>"
        },
        { 
            // Carte Musique (ne pas modifier le titre, c'est automatique)
            title: "Notre Musique 🎧", 
            body: "<p>Cette musique, c'est nous. <br>Ferme les yeux et écoute.</p><button class='btn-3d' style='margin-top:20px; background:#6c5ce7; box-shadow: 0 5px 0 #4834d4;' onclick='toggleMusic()'>⏯️ Play / Pause</button>" 
        },
        {
            // Carte Réponses (Formulaire)
            title: "À ton tour... 📝",
            isQuiz: true // Active le mode formulaire
        }
    ]
};

/* ==============================================
   🚀 LOGIQUE DU SITE
   ============================================== */

let failedAttempts = 0;
let isPlaying = false;
const audioPlayer = document.getElementById('audio-player');

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('u-name').innerText = CONFIG.prenom;
    createPetals();

    // Transition Intro -> Login
    setTimeout(() => {
        switchScreen('intro-screen', 'login-screen');
    }, 4500);

    // Login
    document.getElementById('login-btn').addEventListener('click', checkPass);

    // Carousel
    document.querySelectorAll('.menu-card').forEach(card => {
        card.addEventListener('click', () => {
            const index = card.getAttribute('data-index');
            openModal(index);
        });
    });
    
    // Navigation Flèches
    document.querySelector('.nav-btn.prev').addEventListener('click', () => rotateCarousel(-1));
    document.querySelector('.nav-btn.next').addEventListener('click', () => rotateCarousel(1));

    // Fermeture Modal
    document.querySelector('.close-modal').addEventListener('click', closeModal);
});

// --- NAVIGATION ÉCRANS ---
function switchScreen(from, to) {
    const f = document.getElementById(from);
    const t = document.getElementById(to);
    f.classList.remove('active'); f.classList.add('hidden');
    setTimeout(() => { f.style.display = 'none'; t.style.display = 'flex'; void t.offsetWidth; t.classList.add('active'); }, 500);
}

// --- LOGIQUE MOT DE PASSE (AVEC GESTION 5 ERREURS) ---
function checkPass() {
    const input = document.getElementById('pass-input');
    const errDiv = document.getElementById('error-msg');
    const panel = document.querySelector('.glass-panel');

    if(input.value === CONFIG.motDePasse) {
        input.style.borderColor = "#4CAF50";
        errDiv.style.color = "#4CAF50";
        errDiv.innerText = "Accès autorisé... ❤️";
        playSound(); // Lance la musique à l'ouverture si le navigateur l'autorise
        setTimeout(() => switchScreen('login-screen', 'menu-screen'), 1000);
    } else {
        failedAttempts++;
        panel.classList.remove('shake'); void panel.offsetWidth; panel.classList.add('shake');
        input.value = ""; input.focus();

        // Messages d'erreur
        if(failedAttempts < 5) {
            const msgs = ["Non...", "Toujours pas", "Essaie encore", "Indice : C'est nous"];
            errDiv.innerText = msgs[Math.floor(Math.random() * msgs.length)];
        } else {
            // Message SPÉCIAL après 5 erreurs
            errDiv.innerText = "Tu m'as oublié ? 😭 Je vais pleurer !";
            errDiv.style.fontSize = "1.1rem";
        }
    }
}

// --- CAROUSEL 3D (5 CARTES) ---
let currDeg = 0;
const carousel = document.getElementById('carousel');
function rotateCarousel(dir) {
    currDeg -= dir * 72; // 360 / 5 = 72 degrés
    carousel.style.transform = `rotateY(${currDeg}deg)`;
}

// --- AUDIO ---
function toggleMusic() {
    if(isPlaying) { audioPlayer.pause(); } else { audioPlayer.play(); }
    isPlaying = !isPlaying;
}
function playSound() { 
    // Tentative de lecture auto (bloqué parfois par Chrome)
    audioPlayer.volume = 0.5;
    audioPlayer.play().catch(e => console.log("Audio bloqué en attente d'interaction"));
    isPlaying = true;
}

// --- MODAL & FEEDBACK WHATSAPP ---
function openModal(index) {
    const data = CONFIG.cartes[index];
    const body = document.getElementById('modal-body');
    
    if(data.isQuiz) {
        // Génère le formulaire de réponse
        body.innerHTML = `
            <h2>${data.title}</h2>
            <p>${CONFIG.questionPourElle}</p>
            <textarea id="user-reply" placeholder="Écris ta réponse ici..."></textarea>
            <button class="btn-3d send-btn" onclick="sendToWhatsApp()">Envoyer la réponse 🚀</button>
            <p style="font-size:0.8rem; margin-top:10px; color:#888;">(Ça ouvrira WhatsApp)</p>
        `;
    } else {
        // Affiche le contenu normal
        body.innerHTML = `<h2>${data.title}</h2>${data.body}`;
    }
    document.getElementById('modal-overlay').classList.add('open');
}

function closeModal() { document.getElementById('modal-overlay').classList.remove('open'); }

function sendToWhatsApp() {
    const reply = document.getElementById('user-reply').value;
    if(!reply) return alert("Écris un petit mot avant ! 😘");
    
    // Création du lien WhatsApp
    const text = `Coucou ! J'ai vu ta surprise. Voici ma réponse à ta question : ${reply} ❤️`;
    const url = `https://wa.me/${CONFIG.tonNumeroWhatsApp}?text=${encodeURIComponent(text)}`;
    
    window.open(url, '_blank');
}

// --- DECORATION ---
function createPetals() {
    const c = document.getElementById('bg-container');
    for(let i=0; i<15; i++) {
        let p = document.createElement('div');
        p.className = 'petal';
        p.style.left = Math.random()*100+'%';
        p.style.width = p.style.height = (Math.random()*10+5)+'px';
        p.style.animationDuration = (Math.random()*5+5)+'s';
        p.style.animationDelay = Math.random()*5+'s';
        c.appendChild(p);
    }
           }
