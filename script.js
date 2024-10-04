var inputval = document.querySelector('#cityinput');
var btn = document.querySelector('#add');
var removeBtn = document.querySelector('#remove');
var city = document.querySelector('#cityoutput');
var descrip = document.querySelector('#description');
var temp = document.querySelector('#temp');
var wind = document.querySelector('#wind');
var forecast = document.querySelector('#forecast');
var apiKey = "3045dd712ffe6e702e3245525ac7fa38";

function convertion(val) {
    return (val - 273).toFixed(2);
}

btn.addEventListener('click', function() {
    fetch('https://api.openweathermap.org/data/2.5/weather?q=' + inputval.value + '&appid=' + apiKey)
        .then(res => res.json())
        .then(data => {
            var nameval = data['name'];
            var descripVal = data['weather'][0]['description'];
            var tempature = data['main']['temp'];
            var wndspd = data['wind']['speed'];

            city.innerHTML = `Weather of <span>${nameval}</span>`;
            temp.innerHTML = `Temperature: <span>${convertion(tempature)} °C</span>`;
            descrip.innerHTML = `Sky Conditions: <span>${descripVal}</span>`;
            wind.innerHTML = `Wind Speed: <span>${wndspd} km/h</span>`;

            // Clear previous forecast
            forecast.innerHTML = "";

            // Fetch 3-day forecast
            return fetch('https://api.openweathermap.org/data/2.5/forecast?q=' + inputval.value + '&appid=' + apiKey);
        })
        .then(res => res.json())
        .then(data => {
            // Process and display 3-day weather forecast
            for (let i = 0; i < 3; i++) {
                var dayData = data.list[i * 8]; // Get data for every 8 hours for the next 3 days
                var date = new Date(dayData.dt * 1000).toLocaleDateString();
                var tempature = dayData.main.temp;
                var descripVal = dayData.weather[0].description;

                var forecastItem = document.createElement('div');
                forecastItem.classList.add('forecast-item');
                forecastItem.innerHTML = `<strong>${date}</strong>: Temp: ${convertion(tempature)} °C, Conditions: ${descripVal}`;
                forecast.appendChild(forecastItem);
            }
        })
        .catch(err => alert('You entered an incorrect city name'));
});

// Remove current search
removeBtn.addEventListener('click', function() {
    inputval.value = '';
    city.innerHTML = '';
    descrip.innerHTML = '';
    temp.innerHTML = '';
    wind.innerHTML = '';
    forecast.innerHTML = '';
});
 document.addEventListener('mousemove', (e) => {
    const starCount = 3; // Number of stars
    const colors = ['blue', 'yellow', 'white', 'purple']; // Star colors

    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'cursor-star';

        // Randomly select a color from the colors array
        star.style.borderColor = colors[Math.floor(Math.random() * colors.length)];
        
        document.body.appendChild(star);
        
        // Position the star at the cursor location with a slight random offset
        star.style.left = `${e.pageX + (Math.random() * 10 - 5)}px`;
        star.style.top = `${e.pageY + (Math.random() * 10 - 5)}px`;
        
        // Remove the star after the animation ends
        setTimeout(() => {
            star.remove();
        }, 1500); // Time should match the animation duration
    }
});

