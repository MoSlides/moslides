// تحديد المشاريع المتاحة وصيغها بدقة لمنع طلبات 404 والتحميل البطائ
const projectsConfig = [
    { folder: 'project1', slides: 15, ext: 'png' },
    { folder: 'project2', slides: 15, ext: 'png' },
    { folder: 'project3', slides: 15, ext: 'png' },
    { folder: 'project4', slides: 15, ext: 'png' },
    { folder: 'project5', slides: 15, ext: 'png' },
    { folder: 'project6', slides: 15, ext: 'png' }
];

// عدد صور الموك أب وامتدادها كما هو في المجلد لديك (PNG)
const mockupsCount = 5;
const mockupExt = 'PNG'; // بحروف كبيرة لأنها مرفوعة PNG على GitHub

document.addEventListener('DOMContentLoaded', () => {
    initMarquee();
    loadMockups();
    setupGlobalImageClick();
});

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// عرض مشروعين عشوائياً فوراً وبشكل لحظي
function initMarquee() {
    const mainContainer = document.getElementById('projectsMarqueeContainer');
    if (!mainContainer || projectsConfig.length === 0) return;

    // اختيار مشروعين عشوائياً
    const selectedProjects = shuffleArray([...projectsConfig]).slice(0, 2);

    for (const project of selectedProjects) {
        const projectCards = [];

        for (let i = 1; i <= project.slides; i++) {
            const card = document.createElement('div');
            card.className = 'slide-card';

            const img = document.createElement('img');
            img.src = `projects/${project.folder}/Slide${i}.${project.ext}`;
            img.alt = `${project.folder} - Slide ${i}`;

            card.appendChild(img);
            projectCards.push(card);
        }

        if (projectCards.length > 0) {
            const marqueeContainer = document.createElement('div');
            marqueeContainer.className = 'marquee-container';

            const track = document.createElement('div');
            track.className = 'marquee-track';

            const appendGroup = () => {
                projectCards.forEach(card => {
                    track.appendChild(card.cloneNode(true));
                });
            };

            appendGroup();
            appendGroup();
            if (projectCards.length < 8) {
                appendGroup();
                appendGroup();
            }

            marqueeContainer.appendChild(track);
            mainContainer.appendChild(marqueeContainer);
        }
    }
}

// تحميل صور الموك أب فوراً
function loadMockups() {
    const mockupsGrid = document.getElementById('mockupsGrid');
    if (!mockupsGrid) return;

    for (let i = 1; i <= mockupsCount; i++) {
        const mockupCard = document.createElement('div');
        mockupCard.className = 'mockup-card slide-card';

        const img = document.createElement('img');
        img.src = `mockup/Slide${i}.${mockupExt}`;
        img.alt = `Mockup ${i}`;

        mockupCard.appendChild(img);
        mockupsGrid.appendChild(mockupCard);
    }
}

function setupGlobalImageClick() {
    document.addEventListener('click', (e) => {
        const card = e.target.closest('.slide-card');
        if (card) {
            const img = card.querySelector('img');
            if (img && img.src) {
                openModal(img.src);
            }
        }
    });
}

function openModal(imgSrc) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImg');
    if (modal && modalImg) {
        modal.classList.add('active');
        modalImg.src = imgSrc;
    }
}

function closeModal() {
    const modal = document.getElementById('imageModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});
