// Elementos do DOM
const elements = {
    input: document.getElementById('city-input'),
    btn: document.getElementById('search-btn'),
    locateBtn: document.getElementById('locate-btn'),
    manualCard: document.getElementById('weather-card'),
    gpsCard: document.getElementById('gps-card'),
    loading: document.getElementById('loading'),
    error: document.getElementById('error-msg'),
    locationStatus: document.getElementById('location-status'),
    
    // Elementos da busca manual
    manual: {
        city: document.getElementById('city-name'),
        temp: document.getElementById('temperature'),
        desc: document.getElementById('weather-desc'),
        humidity: document.getElementById('humidity'),
        wind: document.getElementById('wind'),
        feelsLike: document.getElementById('feels-like'),
        icon: document.getElementById('weather-icon')
    },
    
    // Elementos do GPS
    gps: {
        city: document.getElementById('gps-city-name'),
        temp: document.getElementById('gps-temperature'),
        desc: document.getElementById('gps-weather-desc'),
        humidity: document.getElementById('gps-humidity'),
        wind: document.getElementById('gps-wind'),
        feelsLike: document.getElementById('gps-feels-like'),
        icon: document.getElementById('gps-weather-icon')
    }
};

// Configuração da API
const API_CONFIG = {
    baseUrl: 'https://api.openweathermap.org/data/2.5/weather',
    apiKey: '096ecd778ba85cbb0e790dca2b7768ec',
    lang: 'pt_br',
    units: 'metric'
};

// Event Listeners
elements.btn.addEventListener('click', fetchManualWeather);
elements.locateBtn.addEventListener('click', getLocation);
elements.input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') fetchManualWeather();
});

// Função para buscar clima manualmente
async function fetchManualWeather() {
    const city = elements.input.value.trim();
    
    if (!city) {
        showError("Por favor, digite uma cidade");
        return;
    }

    try {
        showLoading(true);
        hideError();
        hideLocationStatus();
        
        const weather = await getWeatherData(city);
        updateUI(elements.manual, weather);
        elements.manualCard.classList.remove('hidden');
    } catch (error) {
        showError(error.message || "Erro ao buscar dados da cidade");
        elements.manualCard.classList.add('hidden');
    } finally {
        showLoading(false);
    }
}

// Função de geolocalização
async function getLocation() {
    hideError();
    showLocationStatus("Obtendo localização...", false);
    showLoading(true);

    try {
        const coords = await getCurrentPosition();
        const weather = await getWeatherByCoords(coords.latitude, coords.longitude);
        
        updateUI(elements.gps, {
            ...weather,
            city: weather.city || "Sua localização"
        });
        elements.gpsCard.classList.remove('hidden');
        showLocationStatus("Localização obtida com sucesso!", false);
    } catch (error) {
        showLocationStatus(error.message, true);
        elements.gpsCard.classList.add('hidden');
    } finally {
        showLoading(false);
    }
}

// Helper para geolocalização
function getCurrentPosition() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error("Geolocalização não suportada pelo navegador"));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            pos => resolve(pos.coords),
            err => {
                let message = "Erro na geolocalização";
                switch(err.code) {
                    case 1: message = "Permissão negada. Ative nas configurações."; break;
                    case 2: message = "Localização indisponível no momento"; break;
                    case 3: message = "Tempo de espera esgotado"; break;
                }
                reject(new Error(message));
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    });
}

// Funções da API
async function getWeatherData(city) {
    const url = `${API_CONFIG.baseUrl}?q=${encodeURIComponent(city)}&units=${API_CONFIG.units}&appid=${API_CONFIG.apiKey}&lang=${API_CONFIG.lang}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Cidade não encontrada");
    }

    return formatWeatherData(await response.json());
}

async function getWeatherByCoords(lat, lon) {
    const url = `${API_CONFIG.baseUrl}?lat=${lat}&lon=${lon}&units=${API_CONFIG.units}&appid=${API_CONFIG.apiKey}&lang=${API_CONFIG.lang}`;
    
    const response = await fetch(url);
    
    if (!response.ok) throw new Error("Erro ao obter dados de localização");

    return formatWeatherData(await response.json());
}

function formatWeatherData(data) {
    return {
        city: data.name,
        temp: Math.round(data.main.temp),
        humidity: data.main.humidity,
        wind: (data.wind.speed * 3.6).toFixed(1),
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        feelsLike: Math.round(data.main.feels_like)
    };
}

// Atualizar a interface
function updateUI(elementsGroup, weather) {
    elementsGroup.city.textContent = weather.city;
    elementsGroup.temp.textContent = `${weather.temp}°C`;
    elementsGroup.desc.textContent = weather.description;
    elementsGroup.humidity.textContent = weather.humidity;
    elementsGroup.wind.textContent = weather.wind;
    elementsGroup.feelsLike.textContent = `${weather.feelsLike}°C`;
    elementsGroup.icon.innerHTML = `<img src="https://openweathermap.org/img/wn/${weather.icon}@2x.png" alt="${weather.description}">`;
}

// Funções auxiliares
function showLoading(show) {
    elements.loading.classList.toggle('hidden', !show);
}

function showError(message) {
    elements.error.textContent = message;
    elements.error.classList.remove('hidden');
}

function hideError() {
    elements.error.classList.add('hidden');
}

function showLocationStatus(message, isError = true) {
    elements.locationStatus.textContent = message;
    elements.locationStatus.className = isError ? 'error' : 'success';
    elements.locationStatus.classList.remove('hidden');
}

function hideLocationStatus() {
    elements.locationStatus.classList.add('hidden');
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    elements.input.focus();
});