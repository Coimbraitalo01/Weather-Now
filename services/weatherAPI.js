const API_KEY '*******************************';

export async function getWeatherByCity(city) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}&lang=pt_br`
        );
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Cidade não encontrada");
        }

        const data = await response.json();
        return formatWeatherData(data);
    } catch (error) {
        console.error("Erro na API:", error);
        throw new Error("Não foi possível obter dados. Verifique o nome da cidade.");
    }
}

export async function getWeatherByCoords(lat, lon) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}&lang=pt_br`
        );
        
        if (!response.ok) throw new Error("Erro ao obter dados de localização");

        const data = await response.json();
        return formatWeatherData(data);
    } catch (error) {
        console.error("Erro na API:", error);
        throw new Error("Erro ao obter dados da sua localização");
    }
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