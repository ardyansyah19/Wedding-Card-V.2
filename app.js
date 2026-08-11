/* ==========================================================================
   DIGITAL WEDDING INVITATION - INTERACTIVE SCRIPT (APP.JS)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initGuestName();
    initCountdownTimer();
    initPetalsCanvas();
    initScrollReveal();
    initRSVPForm();
    initAudioPlayer();
});

/* --- 1. GUEST NAME URL PARAMETER PARSER --- */
function initGuestName() {
    const urlParams = new URLSearchParams(window.location.search);
    const guestNameParam = urlParams.get('to') || urlParams.get('n') || urlParams.get('u');
    const guestDisplayEl = document.getElementById('guestNameDisplay');

    if (guestNameParam && guestDisplayEl) {
        // Clean and capitalize parameter value
        const formattedName = decodeURIComponent(guestNameParam)
            .replace(/\+/g, ' ')
            .trim();
        guestDisplayEl.textContent = formattedName;
    }
}

/* --- 2. OPEN COVER INVITATION & MUSIC AUTOPLAY --- */
const openInvitationBtn = document.getElementById('openInvitationBtn');
const coverOverlay = document.getElementById('coverOverlay');
const mainContent = document.getElementById('mainContent');
const bgMusic = document.getElementById('bgMusic');
const audioControlBtn = document.getElementById('audioControlBtn');

if (openInvitationBtn) {
    openInvitationBtn.addEventListener('click', () => {
        // Smoothly open cover
        coverOverlay.classList.add('opened');
        document.body.classList.remove('no-scroll');
        mainContent.classList.remove('hidden');

        // Play audio music
        playMusic();

        // Trigger initial scroll reveal check
        setTimeout(() => {
            window.dispatchEvent(new Event('scroll'));
        }, 300);
    });
}

/* --- 3. AUDIO PLAYER CONTROL --- */
function initAudioPlayer() {
    if (!audioControlBtn || !bgMusic) return;

    audioControlBtn.addEventListener('click', () => {
        if (bgMusic.paused) {
            playMusic();
        } else {
            pauseMusic();
        }
    });
}

function playMusic() {
    if (!bgMusic) return;
    bgMusic.play().then(() => {
        audioControlBtn.classList.remove('paused');
    }).catch(err => {
        console.log("Autoplay blocked or audio failed:", err);
    });
}

function pauseMusic() {
    if (!bgMusic) return;
    bgMusic.pause();
    audioControlBtn.classList.add('paused');
}

/* --- 4. COUNTDOWN TIMER --- */
function initCountdownTimer() {
    // Target wedding date: December 20, 2026 08:00:00 WIB
    const targetDate = new Date('2026-12-20T08:00:00+07:00').getTime();

    const daysEl = document.getElementById('cdDays');
    const hoursEl = document.getElementById('cdHours');
    const minutesEl = document.getElementById('cdMinutes');
    const secondsEl = document.getElementById('cdSeconds');

    function updateCountdown() {
        const now = new Date().getTime();
        const difference = targetDate - now;

        if (difference < 0) {
            if (daysEl) daysEl.textContent = '00';
            if (hoursEl) hoursEl.textContent = '00';
            if (minutesEl) minutesEl.textContent = '00';
            if (secondsEl) secondsEl.textContent = '00';
            return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        if (daysEl) daysEl.textContent = days < 10 ? '0' + days : days;
        if (hoursEl) hoursEl.textContent = hours < 10 ? '0' + hours : hours;
        if (minutesEl) minutesEl.textContent = minutes < 10 ? '0' + minutes : minutes;
        if (secondsEl) secondsEl.textContent = seconds < 10 ? '0' + seconds : seconds;
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
}

/* --- 5. FALLING FLOWER PETALS CANVAS ANIMATION --- */
function initPetalsCanvas() {
    const canvas = document.getElementById('petalsCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const numPetals = 35;
    const petals = [];

    // Colors for petals (Gold, White, Soft Rose)
    const petalColors = [
        'rgba(243, 229, 171, 0.7)',
        'rgba(212, 175, 55, 0.6)',
        'rgba(255, 255, 255, 0.8)',
        'rgba(250, 247, 242, 0.7)'
    ];

    class Petal {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * -height;
            this.size = Math.random() * 8 + 6;
            this.speedY = Math.random() * 1.5 + 0.8;
            this.speedX = Math.random() * 1 - 0.5;
            this.angle = Math.random() * Math.PI * 2;
            this.spin = (Math.random() - 0.5) * 0.03;
            this.color = petalColors[Math.floor(Math.random() * petalColors.length)];
            this.opacity = Math.random() * 0.7 + 0.3;
        }

        update() {
            this.y += this.speedY;
            this.x += Math.sin(this.angle) * 0.8 + this.speedX;
            this.angle += this.spin;

            if (this.y > height + 20) {
                this.reset();
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);
            ctx.beginPath();
            // Draw a realistic petal shape
            ctx.moveTo(0, 0);
            ctx.bezierCurveTo(-this.size, -this.size / 2, -this.size, this.size, 0, this.size * 1.5);
            ctx.bezierCurveTo(this.size, this.size, this.size, -this.size / 2, 0, 0);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.restore();
        }
    }

    for (let i = 0; i < numPetals; i++) {
        petals.push(new Petal());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        petals.forEach(petal => {
            petal.update();
            petal.draw();
        });
        requestAnimationFrame(animate);
    }

    animate();
}

/* --- 6. SCROLL REVEAL OBSERVER --- */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.scroll-reveal');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, {
        threshold: 0.15
    });

    revealElements.forEach(el => observer.observe(el));
}

/* --- 7. COPY TO CLIPBOARD & TOAST NOTIFICATION --- */
function copyAccount(accNum, bankName) {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(accNum).then(() => {
            showToast(`Nomor Rekening ${bankName} (${accNum}) Berhasil Disalin!`);
        }).catch(err => {
            fallbackCopyTextToClipboard(accNum, bankName);
        });
    } else {
        fallbackCopyTextToClipboard(accNum, bankName);
    }
}

function fallbackCopyTextToClipboard(text, bankName) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        document.execCommand('copy');
        showToast(`Nomor Rekening ${bankName} (${text}) Berhasil Disalin!`);
    } catch (err) {
        showToast(`Gagal menyalin nomor rekening.`);
    }

    document.body.removeChild(textArea);
}

function showToast(message) {
    const toast = document.getElementById('toastNotification');
    const toastMessage = document.getElementById('toastMessage');

    if (toast && toastMessage) {
        toastMessage.textContent = message;
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3500);
    }
}

/* --- 8. RSVP FORM SUBMISSION & LOCALSTORAGE WISHES WALL --- */
function initRSVPForm() {
    const rsvpForm = document.getElementById('rsvpForm');
    const wishesList = document.getElementById('wishesList');
    const wishesCount = document.getElementById('wishesCount');

    // Load persisted local wishes
    const savedWishes = JSON.parse(localStorage.getItem('wedding_wishes') || '[]');
    renderSavedWishes(savedWishes);

    if (rsvpForm) {
        rsvpForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('rsvpName').value.trim();
            const guests = document.getElementById('rsvpGuests').value;
            const status = document.getElementById('rsvpStatus').value;
            const message = document.getElementById('rsvpMessage').value.trim();

            if (!name || !message) {
                showToast('Mohon isi nama dan pesan Anda.');
                return;
            }

            // Create wish item object
            const newWish = {
                name: name,
                status: status,
                message: message,
                time: 'Baru saja',
                avatar: name.charAt(0).toUpperCase()
            };

            // Save to localStorage
            const currentWishes = JSON.parse(localStorage.getItem('wedding_wishes') || '[]');
            currentWishes.unshift(newWish);
            localStorage.setItem('wedding_wishes', JSON.stringify(currentWishes));

            // Render to DOM
            prependWishDOM(newWish);
            updateWishesCount();

            // Reset form & show toast confirmation
            rsvpForm.reset();
            showToast(`Terima kasih ${name}, konfirmasi & ucapan Anda telah terkirim!`);
        });
    }
}

function renderSavedWishes(wishes) {
    wishes.forEach(wish => {
        prependWishDOM(wish);
    });
    updateWishesCount();
}

function prependWishDOM(wish) {
    const wishesList = document.getElementById('wishesList');
    if (!wishesList) return;

    let badgeClass = 'badge-hadir';
    let badgeIcon = 'fa-circle-check';
    if (wish.status === 'Masih Ragu') {
        badgeClass = 'badge-ragu';
        badgeIcon = 'fa-clock';
    } else if (wish.status === 'Tidak Hadir') {
        badgeClass = 'badge-tidak';
        badgeIcon = 'fa-circle-xmark';
    }

    const wishItemHTML = `
        <div class="wish-item">
            <div class="wish-avatar">${wish.avatar || wish.name.charAt(0).toUpperCase()}</div>
            <div class="wish-content">
                <div class="wish-header">
                    <strong>${escapeHTML(wish.name)}</strong>
                    <span class="${badgeClass}"><i class="fa-solid ${badgeIcon}"></i> ${escapeHTML(wish.status)}</span>
                </div>
                <p class="wish-text">${escapeHTML(wish.message)}</p>
                <span class="wish-time"><i class="fa-regular fa-clock"></i> ${wish.time}</span>
            </div>
        </div>
    `;

    wishesList.insertAdjacentHTML('afterbegin', wishItemHTML);
}

function updateWishesCount() {
    const wishesList = document.getElementById('wishesList');
    const wishesCount = document.getElementById('wishesCount');
    if (wishesList && wishesCount) {
        const count = wishesList.querySelectorAll('.wish-item').length;
        wishesCount.textContent = count;
    }
}

function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}

/* --- 9. LIGHTBOX MODAL --- */
function openLightbox(src, caption) {
    const modal = document.getElementById('lightboxModal');
    const img = document.getElementById('lightboxImg');
    const captionText = document.getElementById('lightboxCaption');

    if (modal && img) {
        modal.style.display = 'flex';
        img.src = src;
        if (captionText) captionText.textContent = caption || '';
    }
}

function closeLightbox() {
    const modal = document.getElementById('lightboxModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

/* --- 10. GOOGLE MAPS LINK --- */
function openMapModal(venueName, mapUrl) {
    if (mapUrl) {
        window.open(mapUrl, '_blank');
    } else {
        window.open(`https://maps.google.com/?q=${encodeURIComponent(venueName)}`, '_blank');
    }
}
