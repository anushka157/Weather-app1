var inputval = document.querySelector('#cityinput');
var btn = document.querySelector('#add');
var removeBtn = document.querySelector('#remove');
var city = document.querySelector('#cityoutput');
var descrip = document.querySelector('#description');
var temp = document.querySelector('#temp');
var wind = document.querySelector('#wind');
var forecast = document.querySelector('#forecast');
var hourlyForecast = document.querySelector('#hourlyForecast');
var hourlyTitle = document.querySelector('#hourlyTitle'); // Hourly Forecast title
var apiKey = "3045dd712ffe6e702e3245525ac7fa38";

function convertion(val) {
    return (val - 273.15).toFixed(2); // Adjusted for accuracy
}

btn.addEventListener('click', function () {
    const cityName = inputval.value.trim();
    if (!cityName) {
        alert("Please enter a city name");
        return;
    }

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`)
        .then(res => res.json())
        .then(data => {
            var nameval = data.name;
            var descripVal = data.weather[0].description;
            var tempature = data.main.temp;
            var wndspd = data.wind.speed;

            city.innerHTML = `Weather of <span>${nameval}</span>`;
            temp.innerHTML = `Temperature: <span>${convertion(tempature)} °C</span>`;
            descrip.innerHTML = `Sky Conditions: <span>${descripVal}</span>`;
            wind.innerHTML = `Wind Speed: <span>${wndspd} km/h</span>`;

            forecast.innerHTML = "";
            hourlyForecast.innerHTML = "";
            hourlyTitle.style.display = 'none';

            return fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}`);
        })
        .then(res => res.json())
        .then(data => {
            // 3-Day Forecast
            for (let i = 0; i < 3; i++) {
                var dayData = data.list[i * 8]; // 24-hour interval
                var date = new Date(dayData.dt * 1000).toLocaleDateString();
                var tempature = dayData.main.temp;
                var descripVal = dayData.weather[0].description;

                var forecastItem = document.createElement('div');
                forecastItem.classList.add('forecast-item');
                forecastItem.innerHTML = `<strong>${date}</strong>: Temp: ${convertion(tempature)} °C, Conditions: ${descripVal}`;
                forecast.appendChild(forecastItem);
            }

            // Show "Hourly Forecast" title
            hourlyTitle.style.display = 'block';

            // Hourly Forecast (next 5 entries = next 15 hours approx)
            for (let i = 0; i < 5; i++) {
                var hourData = data.list[i];
                var time = new Date(hourData.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                var tempature = hourData.main.temp;
                var descripVal = hourData.weather[0].description;

                var hourlyItem = document.createElement('div');
                hourlyItem.classList.add('forecast-item');
                hourlyItem.innerHTML = `<strong>${time}</strong>: Temp: ${convertion(tempature)} °C, Conditions: ${descripVal}`;
                hourlyForecast.appendChild(hourlyItem);
            }
        })
        .catch(err => {
            alert('You entered an incorrect city name');
        });
});

// Remove current search
removeBtn.addEventListener('click', function () {
    inputval.value = '';
    city.innerHTML = '';
    descrip.innerHTML = '';
    temp.innerHTML = '';
    wind.innerHTML = '';
    forecast.innerHTML = '';
    hourlyForecast.innerHTML = '';
    hourlyTitle.style.display = 'none';
});

// Star cursor animation
document.addEventListener('mousemove', (e) => {
    const starCount = 3;
    const colors = ['blue', 'yellow', 'white', 'purple'];

    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'cursor-star';
        star.style.borderColor = colors[Math.floor(Math.random() * colors.length)];
        star.style.left = `${e.pageX + (Math.random() * 10 - 5)}px`;
        star.style.top = `${e.pageY + (Math.random() * 10 - 5)}px`;
        document.body.appendChild(star);

        setTimeout(() => {
            star.remove();
        }, 1500);
    }
});
