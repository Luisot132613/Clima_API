document. querySelector("#search").addEventListener('submit', async (event) => {
    event.preventDefault();

    const cityName = document.querySelector("#city").value;

    if (!cityName) {
        document.querySelector("#weather").classList.remove('show');
        showAlert("Você precisa digitar uma cidade");
        return
    }

    const apiKey = "aeafd859a594cca098c575dbbedbecca";
    const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&appid=${apiKey}&units=metric&lang=pt_br`;

    console.log("Usando chave segura:", apiKey);
    const result = await fetch(apiURL);
    const json = await result.json();

    if (json.cod === 200) {
        showinfo({
            city: json.name,
            country: json.sys.country,
            temp: json.main.temp,
            temp_max: json.main.temp_max,
            temp_min: json.main.temp_min,
            temp_description: json.weather[0].description,
            icon: json.weather[0].icon,
            wind_speed: json.wind.speed,
            humidity: json.main.humidity,
            timezone: json.timezone
        })
    }
    else {
        document.querySelector("#weather").classList.remove('show');
    showAlert(`
        Error 404 - Cidade não encontrada
        <img src="./images/404.svg"/>
        `);
    }
});
function showinfo(json) {
    showAlert("");

    document.querySelector("#weather").classList.add('show');

    document.querySelector("#Tittle").innerHTML = `${json.city}, ${json.country}`;
    document.querySelector("#temp_value").innerHTML = `${Math.round(json.temp)} <sup>°C</sup>`;
    document.querySelector("#temp_max").innerHTML = `${Math.round(json.temp_max)} <sup>°C</sup>`;
    document.querySelector("#temp_min").innerHTML = `${Math.round(json.temp_min)} <sup>°C</sup>`;
    document.querySelector("#temp_description").innerHTML = `${json.temp_description}`;
    document.querySelector("#temp_img").setAttribute('src', `https://openweathermap.org/img/wn/${json.icon}.png`);
    document.querySelector("#humidity").innerHTML = `${json.humidity}%`;
    document.querySelector("#wind").innerHTML = `${Math.round(json.wind_speed * 3.6)} km/h`;

    const nowUTC = new Date();
    const localTime = new Date(nowUTC.getTime() + json.timezone * 1000);

    const timeDiv = document.querySelector("#time");
    timeDiv.textContent = `${localTime.toLocaleString("pt-BR", { timeZone: "UTC" })}`;

    const hour = localTime.getUTCHours();
    const body = document.body;

    if (hour >= 6 && hour < 18) {
        body.classList.remove("nighttime");
        body.classList.add("daytime");
    } else {
        body.classList.remove("daytime");
        body.classList.add("nighttime");
    }
}

function showAlert(msg) {
    document.querySelector('#alert').innerHTML = msg;
}