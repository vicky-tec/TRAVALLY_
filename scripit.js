document.addEventListener('DOMContentLoaded', function() {
    const apiKey = '997a76beb7744a90bcc101504251005';
    const searchBtn = document.getElementById('searchBtn');
    const locationInput = document.getElementById('locationInput');
    const weatherCard = document.getElementById('weatherCard');
    const errorMessage = document.getElementById('errorMessage');
    
    // Elements to update
    const locationElement = document.getElementById('location');
    const dateElement = document.getElementById('date');
    const temperatureElement = document.getElementById('temperature');
    const feelsLikeElement = document.getElementById('feelsLike');
    const humidityElement = document.getElementById('humidity');
    const windElement = document.getElementById('wind');
    const conditionElement = document.getElementById('condition');
    const weatherIcon = document.getElementById('weatherIcon');
    
    // Default to London if no input
    fetchWeather('Patna');
    
    // Search button click event
    searchBtn.addEventListener('click', function() {
        const location = locationInput.value.trim();
        if (location) {
            fetchWeather(location);
        } else {
            showError('Please enter a location');
        }
    });
    
    // Enter key press event
    locationInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const location = locationInput.value.trim();
            if (location) {
                fetchWeather(location);
            } else {
                showError('Please enter a location');
            }
        }
    });
    
    function fetchWeather(location) {
        const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}&aqi=no`;
        
        // Show loading state
        weatherCard.style.opacity = '0.5';
        
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Location not found');
                }
                return response.json();
            })
            .then(data => {
                updateWeatherData(data);
                hideError();
            })
            .catch(error => {
                showError(error.message);
            })
            .finally(() => {
                weatherCard.style.opacity = '1';
            });
    }
    
    function updateWeatherData(data) {
        // Update location
        locationElement.textContent = `${data.location.name}, ${data.location.country}`;
        
        // Update date
        const date = new Date(data.location.localtime);
        dateElement.textContent = date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        
        // Update temperature
        temperatureElement.textContent = Math.round(data.current.temp_c);
        
        // Update other details
        feelsLikeElement.textContent = `Feels like: ${Math.round(data.current.feelslike_c)}°C`;
        humidityElement.textContent = `Humidity: ${data.current.humidity}%`;
        windElement.textContent = `Wind: ${data.current.wind_kph} km/h`;
        conditionElement.textContent = `Condition: ${data.current.condition.text}`;
        
        // Update weather icon
        updateWeatherIcon(data.current.condition.code, data.current.is_day);
    }
    
    function updateWeatherIcon(code, isDay) {
        // Map weather codes to Font Awesome icons
        const iconMap = {
            // Clear
            1000: isDay ? 'fa-sun' : 'fa-moon',
            // Cloudy
            1003: isDay ? 'fa-cloud-sun' : 'fa-cloud-moon',
            1006: 'fa-cloud',
            1009: 'fa-cloud',
            // Rain
            1030: 'fa-cloud-rain',
            1063: 'fa-cloud-rain',
            1066: 'fa-snowflake',
            1069: 'fa-cloud-meatball',
            1072: 'fa-cloud-rain',
            1087: 'fa-bolt',
            1114: 'fa-snowflake',
            1117: 'fa-snowflake',
            1135: 'fa-smog',
            1147: 'fa-smog',
            1150: 'fa-cloud-rain',
            1153: 'fa-cloud-rain',
            1168: 'fa-cloud-rain',
            1171: 'fa-cloud-rain',
            1180: 'fa-cloud-rain',
            1183: 'fa-cloud-rain',
            1186: 'fa-cloud-rain',
            1189: 'fa-cloud-rain',
            1192: 'fa-cloud-rain',
            1195: 'fa-cloud-rain',
            1198: 'fa-cloud-rain',
            1201: 'fa-cloud-rain',
            1204: 'fa-cloud-meatball',
            1207: 'fa-cloud-meatball',
            1210: 'fa-snowflake',
            1213: 'fa-snowflake',
            1216: 'fa-snowflake',
            1219: 'fa-snowflake',
            1222: 'fa-snowflake',
            1225: 'fa-snowflake',
            1237: 'fa-cloud-meatball',
            1240: 'fa-cloud-rain',
            1243: 'fa-cloud-rain',
            1246: 'fa-cloud-rain',
            1249: 'fa-cloud-meatball',
            1252: 'fa-cloud-meatball',
            1255: 'fa-snowflake',
            1258: 'fa-snowflake',
            1261: 'fa-cloud-meatball',
            1264: 'fa-cloud-meatball',
            1273: 'fa-bolt',
            1276: 'fa-bolt',
            1279: 'fa-snowflake',
            1282: 'fa-snowflake'
        };
        
        const iconClass = iconMap[code] || 'fa-cloud';
        weatherIcon.innerHTML = `<i class="fas ${iconClass}"></i>`;
    }
    
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }
    
    function hideError() {
        errorMessage.style.display = 'none';
    }
});