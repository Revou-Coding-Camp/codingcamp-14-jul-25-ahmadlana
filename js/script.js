// Input nama, coba tes dulu
window.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('name-modal');
    const form = document.getElementById('name-form');
    const input = document.getElementById('modal-username');
    const usernamePlaceholder = document.getElementById('username-placeholder');
    if (modal && form && input && usernamePlaceholder) {
        modal.classList.add('active');
        setTimeout(() => { input.focus(); }, 200);
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            let username = input.value.trim();
            if (!username) username = 'Tamu';
            usernamePlaceholder.textContent = username;
            modal.classList.remove('active');
        });
    }
});

// Animasi Bg
(function() {
    const canvas = document.getElementById('star-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w = window.innerWidth;
    let h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;

    const STAR_COUNT = 180;
    const SHOOTING_STAR_CHANCE = 0.012;
    let stars = [];
    const shootingStars = [];

    function randomBetween(a, b) {
        return a + Math.random() * (b - a);
    }

    function createStar() {
        return {
            x: Math.random() * w,
            y: Math.random() * h,
            radius: randomBetween(0.5, 1.5),
            alpha: randomBetween(0.3, 0.8),
            speed: randomBetween(0.02, 0.08),
            glow: randomBetween(4, 16)
        };
    }

    function resetStars() {
        stars = [];
        for (let i = 0; i < STAR_COUNT; i++) {
            stars.push(createStar());
        }
    }

    resetStars();

    window.addEventListener('resize', () => {
        w = window.innerWidth;
        h = window.innerHeight;
        canvas.width = w;
        canvas.height = h;
        resetStars();
    });

    function createShootingStar() {
        const angle = Math.PI / 4; 
        const speed = randomBetween(8, 16);
        return {
            x: randomBetween(0, w),
            y: randomBetween(-40, 0),
            len: randomBetween(120, 220),
            speed: speed,
            angle: angle,
            alpha: 1,
            trail: []
        };
    }

    for (let i = 0; i < STAR_COUNT; i++) {
        stars.push(createStar());
    }

    function drawStars() {
        for (const s of stars) {
            ctx.save();
            ctx.globalAlpha = s.alpha;
            ctx.shadowColor = '#00e0ff';
            ctx.shadowBlur = s.glow;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.radius, 0, 2 * Math.PI);
            ctx.fillStyle = '#00e0ff';
            ctx.fill();
            ctx.restore();

            s.x += s.speed * (Math.random() - 0.5);
            s.y += s.speed * (Math.random() - 0.5);
            if (s.x < 0) s.x = w; if (s.x > w) s.x = 0;
            if (s.y < 0) s.y = h; if (s.y > h) s.y = 0;
        }
    }

    function drawShootingStars() {
        for (let i = shootingStars.length - 1; i >= 0; i--) {
            const s = shootingStars[i];

            s.trail.unshift({x: s.x, y: s.y, alpha: s.alpha});
            if (s.trail.length > 30) s.trail.pop();
            for (let t = 1; t < s.trail.length; t++) {
                ctx.save();
                ctx.globalAlpha = s.trail[t].alpha * 0.25;
                ctx.strokeStyle = '#00e0ff';
                ctx.lineWidth = 6;
                ctx.beginPath();
                ctx.moveTo(s.trail[t-1].x, s.trail[t-1].y);
                ctx.lineTo(s.trail[t].x, s.trail[t].y);
                ctx.shadowColor = '#00e0ff';
                ctx.shadowBlur = 18;
                ctx.stroke();
                ctx.restore();
            }
            ctx.save();
            ctx.globalAlpha = s.alpha;
            ctx.beginPath();
            ctx.arc(s.x, s.y, 4, 0, 2 * Math.PI);
            ctx.fillStyle = '#fff';
            ctx.shadowColor = '#00e0ff';
            ctx.shadowBlur = 40;
            ctx.fill();
            ctx.restore();
            s.x += Math.cos(s.angle) * s.speed;
            s.y += Math.sin(s.angle) * s.speed;
            s.alpha *= 0.985;

            if (s.x > w+100 || s.y > h+100 || s.alpha < 0.05) {
                shootingStars.splice(i, 1);
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, w, h);
        drawStars();
        drawShootingStars();
        if (Math.random() < SHOOTING_STAR_CHANCE) {
            shootingStars.push(createShootingStar());
        }
        requestAnimationFrame(animate);
    }
    animate();
})();

const menuToggle = document.querySelector('.menu-toggle');
const navbar = document.getElementById('navbar');
if (menuToggle && navbar) {
    menuToggle.addEventListener('click', function() {
        navbar.classList.toggle('show');
    });
    navbar.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navbar.classList.remove('show');
        });
    });
}

navbar.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', function(e) {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            navbar.classList.remove('show');
        }
    });
});

const navLinks = Array.from(document.querySelectorAll('.navbar a'));
const sectionIds = navLinks.map(link => link.getAttribute('href')).filter(href => href && href.startsWith('#'));
const sections = sectionIds.map(id => document.querySelector(id)).filter(Boolean);

function setActiveNav() {
    let index = 0;
    for (let i = 0; i < sections.length; i++) {
        const rect = sections[i].getBoundingClientRect();
        if (rect.top <= 120) index = i;
    }
    navLinks.forEach((link, i) => {
        if (i === index) link.classList.add('active');
        else link.classList.remove('active');
    });
}

if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === '#' + entry.target.id) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, { threshold: 0.4, rootMargin: '-120px 0px 0px 0px' });
    sections.forEach(section => observer.observe(section));
} else {
    window.addEventListener('scroll', setActiveNav);
    window.addEventListener('resize', setActiveNav);
    setActiveNav();
}

const contactForm = document.getElementById('contact-form');
const contactResult = document.getElementById('contact-result');
if (contactForm && contactResult) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = contactForm.name.value.trim();
        const date = contactForm.date.value;
        const genderInput = contactForm.querySelector('input[name="gender"]:checked');
        const gender = genderInput ? genderInput.value : '';
        const message = contactForm.message.value.trim();
        let valid = true;
        if (!name) { valid = false; contactForm.name.style.borderColor = 'red'; } else { contactForm.name.style.borderColor = ''; }
        if (!date) { valid = false; contactForm.date.style.borderColor = 'red'; } else { contactForm.date.style.borderColor = ''; }
        if (!gender) { valid = false; }
        if (!message) { valid = false; contactForm.message.style.borderColor = 'red'; } else { contactForm.message.style.borderColor = ''; }
        if (!valid) return;
        const now = new Date();
        contactResult.innerHTML = `
            <div><b>Current time</b> : ${now.toString()}</div>
            <div><b>Nama</b> : ${name}</div>
            <div><b>Tanggal Lahir</b> : ${date}</div>
            <div><b>Jenis Kelamin</b> : ${gender}</div>
            <div><b>Pesan</b> : ${message}</div>
        `;
        contactForm.reset();
    });
}

const dateGroup = document.querySelector('.input-date-group');
if (dateGroup) {
    const dateInput = dateGroup.querySelector('input[type="date"]');
    const icon = dateGroup.querySelector('.input-icon');
    if (dateInput && icon) {
        icon.addEventListener('click', () => {
            dateInput.focus();
            dateInput.click();
        });
    }
}

const dateInputContact = document.getElementById('contact-date');
const dateDisplayContact = document.getElementById('date-display');
const calendarBtnContact = document.querySelector('.calendar-btn');
if (dateInputContact && dateDisplayContact && calendarBtnContact) {

    calendarBtnContact.addEventListener('click', () => {
        if (dateInputContact.showPicker) {
            dateInputContact.showPicker();
        } else {
            dateInputContact.focus();
            dateInputContact.click();
        }
    });

    dateInputContact.addEventListener('input', () => {
        dateDisplayContact.value = dateInputContact.value;
    });

    dateDisplayContact.addEventListener('input', () => {
        dateInputContact.value = dateDisplayContact.value;
    });
}
