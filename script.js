const maxProjectsToCheck = 15; // أقصى عدد من المجلدات التي سيتم فحصها (project1 .. project15)
const maxSlidesPerProject = 15;
const maxMockupsCount = 10;
const imageExtensions = ['png', 'jpg', 'jpeg', 'webp'];

document.addEventListener('DOMContentLoaded', () => {
    autoDiscoverAndInitMarquee();
    loadMockups();
    setupGlobalImageClick();
});

// خوارزمية الخلط العشوائي للعناصر
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// الكشف التلقائي واختيار مشروعين عشوائياً
async function autoDiscoverAndInitMarquee() {
    const mainContainer = document.getElementById('projectsMarqueeContainer');
    if (!mainContainer) return;

    const availableProjects = [];

    // 1. فحص مجلدات المشاريع الموجودة التي تحتوي على صور بالفعل
    for (let p = 1; p <= maxProjectsToCheck; p++) {
        const folderName = `project${p}`;
        // التأكد من وجود أول صورة في المجلد لمعرفة هل المشروع متوفر أم لا
        const firstSlideExists = await findValidImagePath(folderName, 1);
        if (firstSlideExists) {
            availableProjects.push(folderName);
        }
    }

    if (availableProjects.length === 0) return;

    // 2. تخليط المشاريع المتاحة واختيار 2 منها فقط عشوائياً
    const selectedProjects = shuffleArray([...availableProjects]).slice(0, 2);

    // 3. إنشاء شريط الـ Marquee للمشروعين المختارين
    for (const folder of selectedProjects) {
        const projectCards = [];

        for (let i = 1; i <= maxSlidesPerProject; i++) {
            const foundPath = await findValidImagePath(folder, i);
            if (foundPath) {
                const card = document.createElement('div');
                card.className = 'slide-card';

                const img = document.createElement('img');
                img.src = foundPath;
                img.alt = `${folder} - Slide ${i}`;

                card.appendChild(img);
                projectCards.push(card);
            }
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

// اكتشاف وتحميل صور الـ Mockup تلقائياً
async function loadMockups() {
    const mockupsGrid = document.getElementById('mockupsGrid');
    if (!mockupsGrid) return;

    for (let i = 1; i <= maxMockupsCount; i++) {
        let foundPath = await findValidMockupPath(i);
        if (foundPath) {
            const mockupCard = document.createElement('div');
            mockupCard.className = 'mockup-card slide-card';

            const img = document.createElement('img');
            img.src = foundPath;
            img.alt = `Mockup ${i}`;

            mockupCard.appendChild(img);
            mockupsGrid.appendChild(mockupCard);
        }
    }
}

async function findValidMockupPath(index) {
    const nameFormats = [`Slide${index}`, `mockup${index}`, `Mockup${index}`, `${index}`];
    for (const name of nameFormats) {
        for (const ext of imageExtensions) {
            const path = `./mockup/${name}.${ext}`;
            const exists = await checkImageExists(path);
            if (exists) return path;
        }
    }
    return null;
}

// تفويض حدث النقر لجميع الصور (الشريط المتحرك والموك أب)
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

function checkImageExists(path) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = path;
    });
}

async function findValidImagePath(folder, index) {
    for (const ext of imageExtensions) {
        const path = `./projects/${folder}/Slide${index}.${ext}`;
        const exists = await checkImageExists(path);
        if (exists) {
            return path;
        }
    }
    return null;
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
