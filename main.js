document.addEventListener('DOMContentLoaded', () => {
    const carouselContainer = document.getElementById('character-carousel-container');
    const contentContainer = document.getElementById('character-content');
    const body = document.body;
    let chartInstance = null;
    let activeSlideInterval = null;

    // Helper function to determine color based on stat value
    function getStatColor(value) {
        if (value >= 75) {
            return '#4CAF50'; // Green for high values
        } else if (value >= 40) {
            return '#FFEB3B'; // Yellow for medium values
        } else {
            return '#F44336'; // Red for low values
        }
    }

    function renderCharacter(charId, characters) {
        const character = characters[charId];
        body.style.backgroundColor = character.color;

        if (chartInstance) {
            chartInstance.destroy();
        }
        if (activeSlideInterval) {
            clearInterval(activeSlideInterval);
        }

        contentContainer.innerHTML = `
            <section class="profile">
                <div class="profile-details">
                    <h2>${character.name}</h2>
                    <p>${character.role}</p>
                    <div class="psych-bars">
                        ${character.profile.stats.map(stat => `
                            <div class="bar">
                                <span>${stat.label}</span>
                                <div class="progress" style="--progress: ${stat.value}%; --color: ${getStatColor(stat.value)};"></div>
                                <span>${stat.value}%</span>
                            </div>
                        `).join('')}
                    </div>
                    <p>${character.profile.summary}</p>
                </div>
                <div class="profile-image">
                    <!-- Gallery will be injected here -->
                </div>
            </section>
            <section class="analysis">
                <h2>Психологический анализ</h2>
                <div class="analysis-grid">
                    ${character.analysis.cards.map(card => `
                        <div class="analysis-card">
                            <h3>${card.title}</h3>
                            <p>${card.text}</p>
                        </div>
                    `).join('')}
                </div>
                <div class="keywords">
                    ${character.analysis.keywords.map(keyword => `<span>${keyword}</span>`).join(' &rarr; ')}
                </div>
            </section>
            <section class="summary">
                <h2>Карта психического состояния ${character.name}</h2>
                <div class="radar-chart-container">
                    <canvas id="radarChart"></canvas>
                </div>
            </section>
        `;

        const profileImageContainer = contentContainer.querySelector('.profile-image');
        if (profileImageContainer && character.gallery && character.gallery.length > 0) {
            const galleryTemplate = document.getElementById('gallery-template').content.cloneNode(true);
            const galleryContainer = galleryTemplate.querySelector('.gallery-container');
            const slidesContainer = galleryContainer.querySelector('.gallery-slides');
            const dotsContainer = galleryContainer.querySelector('.gallery-dots');

            character.gallery.forEach((imgSrc, index) => {
                const slide = document.createElement('div');
                slide.className = 'slide';
                slide.innerHTML = `<img src="${imgSrc}" alt="${character.name} gallery image ${index + 1}">`;
                slidesContainer.appendChild(slide);

                const dot = document.createElement('span');
                dot.className = 'dot';
                dotsContainer.appendChild(dot);
            });

            profileImageContainer.appendChild(galleryContainer);

            let slideIndex = 0;
            const slides = galleryContainer.getElementsByClassName("slide");
            const dots = galleryContainer.getElementsByClassName("dot");

            function showSlides() {
                for (let i = 0; i < slides.length; i++) {
                    slides[i].classList.remove("active-slide");
                    dots[i].classList.remove("active");
                }

                if (slideIndex >= slides.length) { slideIndex = 0; }
                if (slideIndex < 0) { slideIndex = slides.length - 1; }

                slides[slideIndex].classList.add("active-slide");
                dots[slideIndex].classList.add("active");
            }

            galleryContainer.querySelector('.prev').addEventListener('click', () => {
                slideIndex--;
                showSlides();
            });

            galleryContainer.querySelector('.next').addEventListener('click', () => {
                slideIndex++;
                showSlides();
            });
            
            Array.from(dots).forEach((dot, index) => {
                dot.addEventListener('click', () => {
                    slideIndex = index;
                    showSlides();
                });
            });

            showSlides();

            activeSlideInterval = setInterval(() => {
                slideIndex++;
                showSlides();
            }, 5000);
        }

        const ctx = document.getElementById('radarChart').getContext('2d');
        chartInstance = new Chart(ctx, {
            type: 'radar',
            data: character.summaryData,
            options: {
                scales: {
                    r: {
                        angleLines: { color: 'rgba(255, 255, 255, 0.3)' },
                        grid: { color: 'rgba(255, 255, 255, 0.3)' },
                        pointLabels: { color: '#fff', font: { size: 14 } },
                        ticks: { display: false }
                    }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }

    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            const characters = data.characters;

            for (const charId in characters) {
                const character = characters[charId];
                const button = document.createElement('button');
                button.dataset.charId = charId;
                button.innerHTML = `<img src="${character.icon}" alt="${character.name}">`;
                button.addEventListener('click', () => renderCharacter(charId, characters));
                carouselContainer.appendChild(button);
            }

            renderCharacter('shinji', characters);
        })
        .catch(e => {
            console.error("Failed to load data.json:", e);
            contentContainer.innerHTML = `<p style="color: red; text-align: center;">Ошибка: не удалось загрузить данные. Проверьте консоль.</p>`;
        });
});
