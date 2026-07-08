// ===========================
// 未瑠 / Miru - main.js
// ===========================

// --- Hero: スクロール中にアドレスバーが伸縮しても高さが変わらないようにする ---
function setStableVh() {
    document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
}
setStableVh();
window.addEventListener('resize', setStableVh);
window.addEventListener('orientationchange', setStableVh);

// --- Hero: 画像フェードイン → カーソル移動でオーバーレイ＋テキスト出現 ---
const heroSection = document.querySelector('.hero');
let heroActivated = false;
function activateHero() {
    if (!heroActivated) {
        heroActivated = true;
        heroSection.classList.add('hero-active');
    }
}
document.addEventListener('mousemove', activateHero);
document.addEventListener('touchstart', activateHero, { passive: true });
window.addEventListener('scroll', activateHero, { passive: true });

// --- Navigation: スクロールで背景追加 ---
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
});

// --- Scroll Reveal: ふわっと浮き出るアニメーション ---
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, i * 80);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// --- Skill Bar: スクロールで伸びるアニメーション ---
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const fill = entry.target;
            const target = fill.style.width;
            fill.style.width = '0';
            requestAnimationFrame(() => {
                setTimeout(() => { fill.style.width = target; }, 100);
            });
            skillObserver.unobserve(fill);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.skill-fill').forEach(el => skillObserver.observe(el));

// --- Category Filter ---
const filterBtns = document.querySelectorAll('.filter-btn[data-filter]');
const workCards = document.querySelectorAll('.work-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;
        workCards.forEach(card => {
            const match = filter === 'all' || card.dataset.category === filter;
            card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            if (match) {
                card.style.display = 'block';
                setTimeout(() => { card.style.opacity = '1'; card.style.transform = ''; }, 10);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.96)';
                setTimeout(() => { card.style.display = 'none'; }, 300);
            }
        });
    });
});

// --- Smooth Scroll ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (href === '#') return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            const offset = 80;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});

// --- Mobile Nav Toggle ---
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle?.addEventListener('click', () => {
    navLinks.classList.toggle('open');
});
navLinks?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navLinks.classList.remove('open'));
});

// --- Lightbox ---
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');

function openLightbox(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

document.querySelectorAll('.work-card').forEach(card => {
    card.addEventListener('click', () => {
        const img = card.querySelector('img');
        openLightbox(img.src, img.alt);
    });
});

lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
});
lightboxClose?.addEventListener('click', closeLightbox);

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
});

// --- Contact Form ---
const form = document.getElementById('contactForm');
form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('.btn-primary');
    const originalText = btn.textContent;
    btn.textContent = '送信中...';

    try {
        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: { 'Accept': 'application/json' },
            body: new FormData(form)
        });
        const result = await response.json();

        if (result.success) {
            btn.textContent = '送信しました！';
            btn.style.background = 'var(--accent-dark)';
            form.reset();
            window.location.href = 'thanks.html';
        } else {
            throw new Error(result.message || 'submit failed');
        }
    } catch (err) {
        btn.textContent = '送信に失敗しました';
        setTimeout(() => {
            btn.textContent = originalText;
        }, 3000);
    }
});
