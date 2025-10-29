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

        // Устанавливаем CSS переменные для свечения
        document.documentElement.style.setProperty('--glow-color', character.color);

        // Применяем фон
        body.style.background = character.color;
        body.style.animation = 'none';

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
                <div class="keywords-container">
                    ${character.analysis.keywords.map(keyword => `<span class="keyword-tag">${keyword}</span>`).join('')}
                </div>
            </section>
            <section class="summary">
                <h2>Карта психического состояния ${character.name}</h2>
                <div class="radar-chart-container">
                    <canvas id="radarChart"></canvas>
                </div>
            </section>
            <section class="diagnosis-section">
                <h2>ДИАГНОЗ</h2>
                <p>${character.diagnosis.text}</p>
                <h3>ВИДЕОПОДТВЕРЖДЕНИЕ</h3>
                <div class="video-evidence">
                    ${character.diagnosis.videos.map(video => `
                        <div class="video-item">
                            <h4>${video.title}</h4>
                            <p class="scene-description">- ${video.description}</p>
                            <video controls src="${video.video_src}" width="100%" poster="assets/end-of-evangelion.jpg"></video>
                        </div>
                    `).join('')}
                </div>
            </section>
        `;

        // Запускаем анимации появления
        const animatedElements = contentContainer.querySelectorAll('.profile, .analysis-card, .video-item, .summary, .diagnosis-section');
        animatedElements.forEach((el, index) => {
            el.style.animationDelay = `${index * 100}ms`;
            el.classList.add('fade-in-up');
        });

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
            data: {
                labels: character.summaryData.labels,
                datasets: character.summaryData.datasets
            },
            options: {
                scales: {
                    r: {
                        angleLines: { color: 'rgba(255, 255, 255, 0.3)' },
                        grid: { color: 'rgba(255, 255, 255, 0.3)' },
                        pointLabels: { 
                            color: '#fff', 
                            font: { 
                                size: 14,
                                lineHeight: 1.2
                            },
                            // Добавляем перенос текста
                            callback: function(value) {
                                // Разбиваем длинные фразы на несколько строк
                                const words = value.split(' ');
                                const lines = [];
                                let currentLine = '';
                                
                                for (const word of words) {
                                    if ((currentLine + word).length <= 15) {
                                        currentLine += (currentLine ? ' ' : '') + word;
                                    } else {
                                        if (currentLine) lines.push(currentLine);
                                        currentLine = word;
                                    }
                                }
                                if (currentLine) lines.push(currentLine);
                                
                                return lines;
                            }
                        },
                        ticks: { 
                            display: false,
                        },
                        min: 0,
                        max: 100,
                        beginAtZero: true
                    }
                },
                plugins: {
                    legend: { 
                        display: false
                    }
                },
                elements: {
                    line: {
                        tension: 0,
                        borderJoinStyle: 'miter'
                    },
                    point: {
                        radius: 4,
                        hoverRadius: 6
                    }
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