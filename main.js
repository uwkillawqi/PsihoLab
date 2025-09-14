document.addEventListener('DOMContentLoaded', () => {
    const carouselContainer = document.getElementById('character-carousel-container');
    const contentContainer = document.getElementById('character-content');
    const body = document.body;
    let chartInstance = null;

    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            const characters = data.characters;

            function renderCharacter(charId) {
                const character = characters[charId];
                body.style.backgroundColor = character.color;

                if (chartInstance) {
                    chartInstance.destroy();
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
                                        <div class="progress" style="--progress: ${stat.value}%; --color: ${stat.color};"></div>
                                        <span>${stat.value}%</span>
                                    </div>
                                `).join('')}
                            </div>
                            <p>${character.profile.summary}</p>
                        </div>
                        <div class="profile-image">
                            <img src="${character.image}" alt="${character.name}">
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

            // Create carousel
            for (const charId in characters) {
                const character = characters[charId];
                const button = document.createElement('button');
                button.dataset.charId = charId;
                button.innerHTML = `<img src="${character.icon}" alt="${character.name}">`;
                button.addEventListener('click', () => renderCharacter(charId));
                carouselContainer.appendChild(button);
            }

            // Initial render
            renderCharacter('shinji');
        });
});
