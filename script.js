const amounts = [20000, 50000, 50000, 100000, 100000, 100000, 200000, 500000];
const wishes = {
    career: [
      "Công việc hanh thông, dự án nào cũng về đích rực rỡ!",
      "Thăng tiến vù vù, sếp tin tưởng, đồng nghiệp yêu quý!",
      "Ý tưởng sáng tạo tuôn trào, làm đâu thắng đó!",
      "Sự nghiệp vững vàng, bước nào chắc bước đó!",
      "Khó khăn hóa nhẹ tênh, thử thách thành cơ hội!",
      "Danh tiếng tăng cao, thành tựu nối tiếp thành tựu!",
      "Năm nay bứt phá mạnh mẽ, sự nghiệp lên tầm cao mới!"
    ],
    love: [
      "Tình yêu ngọt ngào, mỗi ngày đều là ngày hạnh phúc!",
      "Hiểu nhau từ ánh mắt, thương nhau từ những điều nhỏ nhất!",
      "Tình duyên rực rỡ, trái tim luôn đầy ắp yêu thương!",
      "Xa mấy cũng nhớ, giận mấy cũng thương!",
      "Yêu thương chân thành, hạnh phúc bền lâu!",
      "Năm mới tình cảm thăng hoa, hạnh phúc viên mãn!"
    ],
    life: [
      "Sức khỏe dồi dào, tinh thần luôn rạng rỡ!",
      "Mọi điều suôn sẻ, việc gì cũng thuận lợi!",
      "May mắn theo chân, đi đâu cũng gặp điều tốt!",
      "Gia đình bình an, lòng luôn nhẹ nhàng!",
      "Thử thách nào cũng vượt qua thật bản lĩnh!",
      "Luôn luôn tươi cười, may mắn ngập tràn!",
      "Năm mới bùng nổ, rực rỡ thành công!",
      "Tiền vào như nước, tài lộc đầy nhà!"
    ]
};

const sliderWrapper = document.querySelector('.slider-wrapper');
const slider = document.getElementById('lixi-slider');
const overlay = document.getElementById('overlay');
const stepWish = document.getElementById('step-wish');
const stepReveal = document.getElementById('step-reveal');
const wishText = document.getElementById('wish-text');
const btnContinue = document.getElementById('btn-continue');
const moneyAmount = document.getElementById('money-amount');
const btnRestart = document.getElementById('btn-restart');
const modal = document.querySelector('.modal');
const blossomContainer = document.getElementById('blossom-container');

let shuffledAmounts = [];
let selectedAmount = 0;
let isDragging = false;
let startX, scrollLeft;
let animationId;
let currentPos = 0;

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

// Tạo hiệu ứng hoa đào - Sử dụng hoadao.png
function createBlossoms() {
    blossomContainer.innerHTML = '';
    for (let i = 0; i < 25; i++) {
        const blossom = document.createElement('div');
        blossom.className = 'blossom';
        blossom.style.left = Math.random() * 100 + 'vw';
        blossom.style.top = '-30px';
        blossom.style.animationDuration = (Math.random() * 4 + 3) + 's';
        blossom.style.animationDelay = (Math.random() * 5) + 's';
        blossom.style.width = (Math.random() * 10 + 20) + 'px';
        blossom.style.height = blossom.style.width;
        blossomContainer.appendChild(blossom);
    }
}

function init() {
    slider.innerHTML = '';
    shuffledAmounts = shuffle([...amounts]);
    
    // Tạo card gốc
    const cards = [];
    for (let i = 0; i < 8; i++) {
        const item = document.createElement('div');
        item.className = 'lixi-item';
        item.dataset.amount = shuffledAmounts[i];
        item.addEventListener('mousedown', () => item.dataset.clicked = "true");
        item.addEventListener('mouseup', () => {
            if(item.dataset.clicked === "true" && !isDragging) {
                startOpening(shuffledAmounts[i], item);
            }
            item.dataset.clicked = "false";
        });
        cards.push(item);
    }

    // Nhân bản để tạo vòng lặp vô tận (cloning)
    const cloneCount = 4;
    for(let i = 0; i < cloneCount; i++) {
        slider.appendChild(cards[8 - cloneCount + i].cloneNode(true));
    }
    cards.forEach(card => slider.appendChild(card));
    for(let i = 0; i < cloneCount; i++) {
        slider.appendChild(cards[i].cloneNode(true));
    }

    // Xử lý sự kiện click cho các thẻ clone
    slider.querySelectorAll('.lixi-item').forEach(item => {
        item.addEventListener('mousedown', () => item.dataset.clicked = "true");
        item.addEventListener('mouseup', (e) => {
            if(item.dataset.clicked === "true" && !isDragging) {
                const amount = item.dataset.amount || shuffledAmounts[0];
                startOpening(parseInt(amount), item);
            }
            item.dataset.clicked = "false";
        });
    });

    // Infinity Scroll Logic
    setupInfinityScroll();
    createBlossoms();
}

function setupInfinityScroll() {
    let x = 0;
    const itemWidth = 180 + 24; // width + gap
    const totalWidth = 8 * itemWidth;
    let dragStartX = 0;
    let initialX = 0;

    function update() {
        if (!isDragging) {
            x -= 0.5; // Tự động trượt chậm
            if (x <= -totalWidth) x = 0;
            if (x > 0) x = -totalWidth;
            slider.style.transform = `translateX(${x}px)`;
        }
        animationId = requestAnimationFrame(update);
    }
    
    // Mouse Events
    sliderWrapper.addEventListener('mousedown', (e) => {
        dragStartX = e.pageX;
        initialX = x;
        isDragging = false; // Reset về false khi vừa nhấn xuống
        sliderWrapper.style.cursor = 'grabbing';
        cancelAnimationFrame(animationId);
        
        const onMouseMove = (moveEvent) => {
            const deltaX = moveEvent.pageX - dragStartX;
            if (Math.abs(deltaX) > 5) { // Chỉ coi là kéo nếu di chuyển > 5px
                isDragging = true;
                x = initialX + deltaX;
                
                // Infinity loop check
                if (x > 0) x -= totalWidth;
                if (x < -totalWidth) x += totalWidth;
                
                slider.style.transform = `translateX(${x}px)`;
            }
        };

        const onMouseUp = () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
            sliderWrapper.style.cursor = 'grab';
            isDragging = false;
            update();
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
    });

    // Touch Events
    sliderWrapper.addEventListener('touchstart', (e) => {
        dragStartX = e.touches[0].pageX;
        initialX = x;
        isDragging = false;
        cancelAnimationFrame(animationId);

        const onTouchMove = (moveEvent) => {
            const deltaX = moveEvent.touches[0].pageX - dragStartX;
            if (Math.abs(deltaX) > 5) {
                isDragging = true;
                x = initialX + deltaX;
                
                if (x > 0) x -= totalWidth;
                if (x < -totalWidth) x += totalWidth;
                
                slider.style.transform = `translateX(${x}px)`;
            }
        };

        const onTouchEnd = () => {
            window.removeEventListener('touchmove', onTouchMove);
            window.removeEventListener('touchend', onTouchEnd);
            isDragging = false;
            update();
        };

        window.addEventListener('touchmove', onTouchMove, {passive: false});
        window.addEventListener('touchend', onTouchEnd);
    }, {passive: true});

    update();
}



function startOpening(amount, element) {
    selectedAmount = amount;
    element.classList.add('subtle-shake');
    setTimeout(() => {
        showWish();
    }, 500);
}

function showWish() {
    const categories = Object.keys(wishes);
    const category = categories[Math.floor(Math.random() * categories.length)];
    const wish = wishes[category][Math.floor(Math.random() * wishes[category].length)];
    
    wishText.innerText = wish;
    overlay.classList.remove('hidden');
    stepWish.classList.remove('hidden');
    stepReveal.classList.add('hidden');

    btnContinue.classList.remove('hidden');
    btnContinue.disabled = true;
    let timeLeft = 1;
    btnContinue.innerText = `TIẾP TỤC`;

    const timer = setInterval(() => {
        timeLeft--;
        if (timeLeft <= 0) {
            clearInterval(timer);
            btnContinue.innerText = "TIẾP TỤC";
            btnContinue.disabled = false;
        } else {
            btnContinue.innerText = `TIẾP TỤC`;
        }
    }, 1000);
}

btnContinue.addEventListener('click', () => {
    stepWish.classList.add('hidden');
    stepReveal.classList.remove('hidden');
    const moneyCard = document.getElementById('money-card');
    
    moneyAmount.innerText = "???";
    moneyCard.style.animation = 'none';
    modal.classList.add('heavy-shake-5s');
    
    setTimeout(() => {
        modal.classList.remove('heavy-shake-5s');
        moneyCard.style.animation = '';
        initFireworks(); // Bắt đầu pháo hoa khi bắt đầu đếm số tiền
        animateValue(moneyAmount, 0, selectedAmount, 5000);
    }, 5000);
});

function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerText = Math.floor(progress * (end - start) + start).toLocaleString('vi-VN');
        if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
}




// Fix 100vh trên mobile
function setVH() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}
window.addEventListener('resize', setVH);
setVH();

// Xử lý Nhạc nền
const bgMusic = document.getElementById('bg-music');
const musicToggle = document.getElementById('music-toggle');
let isMusicPlaying = false;

function toggleMusic() {
    if (isMusicPlaying) {
        bgMusic.pause();
        musicToggle.classList.remove('playing');
    } else {
        bgMusic.play().catch(e => console.log("Audio play failed:", e));
        musicToggle.classList.add('playing');
    }
    isMusicPlaying = !isMusicPlaying;
}

musicToggle.addEventListener('click', toggleMusic);

// Tự động phát nhạc khi người dùng tương tác lần đầu
window.addEventListener('click', () => {
    if (bgMusic.muted) {
        bgMusic.muted = false;
        bgMusic.play().then(() => {
            isMusicPlaying = true;
            musicToggle.classList.add('playing');
        }).catch(e => console.log("Unmute play failed:", e));
    }
}, { once: true });

// Hiệu ứng Pháo hoa Canvas
function initFireworks() {
    const canvas = document.getElementById('fireworks-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationFrame;

    function resize() {
        // Lấy kích thước của overlay (parent)
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor(x, y, color) {
            this.x = x;
            this.y = y;
            this.color = color;
            this.size = Math.random() * 4 + 2; // Tăng kích thước hạt
            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * 8 + 4; // Tăng tốc độ
            this.velocityX = Math.cos(angle) * velocity;
            this.velocityY = Math.sin(angle) * velocity;
            this.gravity = 0.2;
            this.opacity = 1;
            this.friction = 0.95;
        }

        update() {
            this.velocityX *= this.friction;
            this.velocityY *= this.friction;
            this.velocityY += this.gravity;
            this.x += this.velocityX;
            this.y += this.velocityY;
            this.opacity -= 0.01; // Giảm chậm hơn
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            // Thêm hiệu ứng phát sáng cho hạt
            ctx.shadowBlur = 10;
            ctx.shadowColor = this.color;
            ctx.fill();
            ctx.restore();
        }
    }

    function createFirework(x, y) {
        const colors = ['#fcd34d', '#ff3e3e', '#22c55e', '#ffffff', '#3b82f6', '#ec4899', '#a855f7'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        for (let i = 0; i < 50; i++) {
            particles.push(new Particle(x, y, color));
        }
    }

    function animate() {
        // Tạo hiệu ứng đuôi pháo hoa nhẹ
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Tăng tỷ lệ xuất hiện pháo hoa
        if (Math.random() < 0.15) {
            createFirework(
                Math.random() * canvas.width, 
                Math.random() * canvas.height * 0.6 // Spawn ở phần trên màn hình
            );
        }

        for (let i = particles.length - 1; i >= 0; i--) {
            particles[i].update();
            particles[i].draw();
            if (particles[i].opacity <= 0) {
                particles.splice(i, 1);
            }
        }

        animationFrame = requestAnimationFrame(animate);
    }

    animate();

    // Dừng pháo hoa sau 10 giây
    setTimeout(() => {
        cancelAnimationFrame(animationFrame);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }, 10000);
}

init();




