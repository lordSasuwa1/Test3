/* ==============================================
   🔧 CONFIGURATION (MODIFIE ICI !)
   ============================================== */

const CONFIG = {
    prenom: "Mon Amour",       // Son prénom
    motDePasse: "2024",        // Le code secret
    messagesErreur: [          // Les messages si le code est faux
        "Raté ! Petit indice : c'est notre année... 😘",
        "Nop ! Même mon code est plus romantique. ✨",
        "Erreur : Trop de charme, mais mauvais code. ⛔",
        "Presque... mais non. Concentre-toi ! 🧠❤️"
    ],
    contenuCartes: [           // Le contenu des 4 cartes
        {
            title: "Notre Histoire 📖",
            body: "<p>Il était une fois... <strong>nous</strong>.<br><br>Chaque instant avec toi est une page que j'adore écrire. Tu te souviens de notre première rencontre ?<br><br>Moi je ne l'oublierai jamais.</p>"
        },
        {
            title: "Tes Bons Cadeaux 🎁",
            body: "<ul><li>🎫 Bon pour un massage de 30min</li><br><li>🎫 Bon pour un resto de ton choix</li><br><li>🎫 Bon pour un 'Joker Dispute' (à utiliser avec sagesse 😅)</li></ul>"
        },
        {
            title: "Le Mur des Mots 💌",
            body: "<p>Juste pour te dire que tu es la personne la plus incroyable que je connaisse. Merci d'être toi.<br><br>Je t'aime plus qu'hier, moins que demain. ❤️</p>"
        },
        {
            title: "Notre Playlist 🎧",
            body: "<p>Ferme les yeux et imagine notre chanson.<br><br>C'est ce que je ressens quand je te regarde. <br><br><em>(Ajoute ton lien ici)</em></p>"
        }
    ]
};

/* ==============================================
   🚀 LOGIQUE DU SITE (NE PAS TOUCHER SI POSSIBLE)
   ============================================== */

// 1. Initialisation
document.addEventListener('DOMContentLoaded', () => {
    // Mettre le prénom
    document.getElementById('u-name').innerText = CONFIG.prenom;
    
    // Lancer les pétales
    createPetals();

    // Timer pour passer de l'arbre au login (4.5 secondes)
    setTimeout(() => {
        switchScreen('intro-screen', 'login-screen');
    }, 4500);

    // Écouteur sur le bouton login
    document.getElementById('login-btn').addEventListener('click', checkPass);
    
    // Écouteur sur les cartes du menu
    document.querySelectorAll('.menu-card').forEach(card => {
        card.addEventListener('click', () => {
            const index = card.getAttribute('data-index');
            openModal(index);
        });
    });

    // Écouteurs pour la navigation carousel
    document.querySelector('.nav-btn.prev').addEventListener('click', () => rotateCarousel(-1));
    document.querySelector('.nav-btn.next').addEventListener('click', () => rotateCarousel(1));

    // Écouteur pour fermer la modal
    document.querySelector('.close-modal').addEventListener('click', closeModal);
});

// 2. Gestion des écrans
function switchScreen(fromId, toId) {
    const fromScreen = document.getElementById(fromId);
    const toScreen = document.getElementById(toId);

    fromScreen.classList.remove('active');
    fromScreen.classList.add('hidden');

    setTimeout(() => {
        fromScreen.style.display = 'none';
        toScreen.style.display = 'flex';
        void toScreen.offsetWidth; // Force reflow
        toScreen.classList.add('active');
    }, 500);
}

// 3. Vérification mot de passe
function checkPass() {
    const input = document.getElementById('pass-input');
    const val = input.value;
    const errDiv = document.getElementById('error-msg');
    const panel = document.querySelector('.glass-panel');

    if(val === CONFIG.motDePasse) {
        // Succès
        input.style.borderColor = "#4CAF50";
        errDiv.style.color = "#4CAF50";
        errDiv.innerText = "Accès autorisé... Bienvenue ❤️";
        setTimeout(() => {
            switchScreen('login-screen', 'menu-screen');
        }, 1000);
    } else {
        // Échec
        panel.classList.remove('shake');
        void panel.offsetWidth;
        panel.classList.add('shake');
        input.value = "";
        input.focus();
        
        const randomMsg = CONFIG.messagesErreur[Math.floor(Math.random() * CONFIG.messagesErreur.length)];
        errDiv.innerText = randomMsg;
        errDiv.style.color = "#d32f2f";
    }
}

// 4. Carousel 3D
let currDeg = 0;
const carousel = document.getElementById('carousel');

function rotateCarousel(direction) {
    currDeg -= direction * 90;
    carousel.style.transform = `rotateY(${currDeg}deg)`;
}

// 5. Modal
function openModal(index) {
    const content = CONFIG.contenuCartes[index];
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = `<h2>${content.title}</h2>${content.body}`;
    document.getElementById('modal-overlay').classList.add('open');
}

function closeModal() {
    document.getElementById('modal-overlay').classList.remove('open');
}

// 6. Animation Pétales
function createPetals() {
    const container = document.getElementById('bg-container');
    for(let i=0; i<15; i++) {
        let petal = document.createElement('div');
        petal.className = 'petal';
        petal.style.left = Math.random() * 100 + '%';
        petal.style.width = (Math.random() * 10 + 5) + 'px';
        petal.style.height = petal.style.width;
        petal.style.animationDuration = (Math.random() * 5 + 5) + 's';
        petal.style.animationDelay = (Math.random() * 5) + 's';
        container.appendChild(petal);
    }
}
