// ===== DATE & TIME UPDATE =====
function updateDateTime() {
    const now = new Date();
    
    // Format date: "Monday, November 16, 2025"
    const dateOptions = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
    const dateStr = now.toLocaleDateString('en-US', dateOptions);
    
    // Format time: "14:30:45"
    const timeStr = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit',
        hour12: false 
    });
    
    const dateElement = document.getElementById('current-date');
    const timeElement = document.getElementById('current-time');
    
    if (dateElement) dateElement.textContent = dateStr;
    if (timeElement) timeElement.textContent = timeStr;
}

// ===== CHART.JS CONFIGURATION =====
Chart.defaults.color = 'rgba(255, 255, 255, 0.8)';
Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.1)';
Chart.defaults.font.family = 'Poppins, sans-serif';

// Create Temperature Forecast Chart
function createTempChart() {
    const ctx = document.getElementById('tempChart');
    if (!ctx || !weatherData || !weatherData.hourly) return;
    
    const labels = weatherData.hourly.map(h => h.time);
    const temps = weatherData.hourly.map(h => h.temp);
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Temperature (°C)',
                data: temps,
                borderColor: 'rgba(102, 126, 234, 1)',
                backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                    gradient.addColorStop(0, 'rgba(102, 126, 234, 0.4)');
                    gradient.addColorStop(1, 'rgba(102, 126, 234, 0.0)');
                    return gradient;
                },
                fill: true,
                tension: 0.4,
                pointRadius: 5,
                pointBackgroundColor: 'rgba(102, 126, 234, 1)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointHoverRadius: 7,
                pointHoverBackgroundColor: 'rgba(102, 126, 234, 1)',
                pointHoverBorderColor: '#fff',
                pointHoverBorderWidth: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    titleColor: '#1e3c72',
                    bodyColor: '#1e3c72',
                    borderColor: 'rgba(102, 126, 234, 0.5)',
                    borderWidth: 2,
                    padding: 12,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            return context.parsed.y + '°C';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)',
                        drawBorder: false
                    },
                    ticks: {
                        callback: function(value) {
                            return value + '°';
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
}

// Create Weather Conditions Chart
function createConditionsChart() {
    const ctx = document.getElementById('conditionsChart');
    if (!ctx || !weatherData || !weatherData.current) return;
    
    // Mock data for demonstration - in real app, you'd get this from hourly data
    const labels = weatherData.hourly ? weatherData.hourly.map(h => h.time) : [];
    const humidity = new Array(labels.length).fill(weatherData.current.humidity).map((val, i) => 
        val + (Math.random() * 10 - 5)
    );
    const windSpeed = new Array(labels.length).fill(weatherData.current.wind).map((val, i) => 
        val + (Math.random() * 5 - 2.5)
    );
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Humidity (%)',
                    data: humidity,
                    borderColor: 'rgba(240, 147, 251, 1)',
                    backgroundColor: 'rgba(240, 147, 251, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                    pointBackgroundColor: 'rgba(240, 147, 251, 1)',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2
                },
                {
                    label: 'Wind Speed (km/h)',
                    data: windSpeed,
                    borderColor: 'rgba(79, 172, 254, 1)',
                    backgroundColor: 'rgba(79, 172, 254, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                    pointBackgroundColor: 'rgba(79, 172, 254, 1)',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    titleColor: '#1e3c72',
                    bodyColor: '#1e3c72',
                    borderColor: 'rgba(240, 147, 251, 0.5)',
                    borderWidth: 2,
                    padding: 12
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)',
                        drawBorder: false
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
}

// ===== ANIMATIONS & INTERACTIONS =====
document.addEventListener("DOMContentLoaded", () => {
    // Update date/time immediately and every second
    updateDateTime();
    setInterval(updateDateTime, 1000);
    
    // Initialize charts
    setTimeout(() => {
        createTempChart();
        createConditionsChart();
    }, 500);
    
    // Animate cards on load
    const allCards = document.querySelectorAll('.glass-effect, .hour-item, .week-item, .city-item-3d');
    allCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100 * index);
    });
    
    // 3D tilt effect for city cards
    const cityCards = document.querySelectorAll('.city-item-3d');
    cityCards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });
        
        card.addEventListener('mouseleave', function() {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
    
    // Parallax effect for particles
    document.addEventListener('mousemove', function(e) {
        const particles = document.querySelectorAll('.particle');
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        particles.forEach((particle, index) => {
            const speed = (index + 1) * 20;
            const x = mouseX * speed;
            const y = mouseY * speed;
            
            particle.style.transform = `translate(${x}px, ${y}px)`;
        });
    });
    
    // Smooth scroll for hourly items
    const hourlyContainer = document.querySelector('.hourly-container');
    if (hourlyContainer) {
        hourlyContainer.style.scrollBehavior = 'smooth';
    }
    
    // Settings icon rotation
    const settingsIcon = document.querySelector('.settings-icon');
    if (settingsIcon) {
        settingsIcon.addEventListener('click', function() {
            this.style.transition = 'transform 0.5s ease';
            this.style.transform = 'rotate(180deg)';
            setTimeout(() => {
                this.style.transform = 'rotate(0deg)';
            }, 500);
        });
    }
    
    // Add pulse animation to search button
    const searchBtn = document.querySelector('.search-btn');
    if (searchBtn) {
        setInterval(() => {
            searchBtn.style.animation = 'pulse 1s ease';
            setTimeout(() => {
                searchBtn.style.animation = '';
            }, 1000);
        }, 5000);
    }
    
    // Weather icon floating animation enhancement
    const weatherIcon = document.querySelector('.weather-3d-icon');
    if (weatherIcon) {
        let rotation = 0;
        setInterval(() => {
            rotation += 0.5;
            weatherIcon.style.transform = `rotate(${Math.sin(rotation / 10) * 5}deg)`;
        }, 50);
    }
});

// Add pulse animation to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0%, 100% {
            transform: scale(1);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }
        50% {
            transform: scale(1.1);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.8);
        }
    }
`;
document.head.appendChild(style);
