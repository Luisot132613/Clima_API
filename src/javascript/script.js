// Seelciona o formulário com o id="search" e adiciona um ouvinte de evento para o envio (submit) 
document. querySelector("#search").addEventListener('submit', async (event) => {

    // Impede que o formulário recarregue a página ao ser enviado
    event.preventDefault();

    // Pega o valor enviado no campo de entrada com o id="city"
    const cityName = document.querySelector("#city").value;

    // Verifica se o usuário não digitou nada e dispara um alerta "Você precisa digitar uma cidade"
    if (!cityName) {
        document.querySelector("#weather").classList.remove('show');
        showAlert("Você precisa digitar uma cidade");
        return
    }

    // Pega o valor da API Key indidual gerada no site para fins educativos
    const apiKey = "aeafd859a594cca098c575dbbedbecca";

    // Pega a URL do site para acessar a API individual do usuário
    const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&appid=${apiKey}&units=metric&lang=pt_br`;

    // Exibe no console a mensagem junto com a chave de API usada
    console.log("Usando chave segura:", apiKey);

    // Faz a requisição HTTP para a URL da API (apiURL) /  "await" -> garante que o código espere a resposta antes de continuar
    const result = await fetch(apiURL);

    // Converte a resposta da requisição para o formato JSON / Para acessar os dados retornados via API no JavaScript
    const json = await result.json();

    // Verifica se a resposta da API retornou o código 200 (sucesso) 
    if (json.cod === 200) {

        // Chama a função showinfo passando um objeto para obter as informações do clima
        showinfo({
            city: json.name,                                    //Nome da cidade
            country: json.sys.country,                          //Nome do pais
            temp: json.main.temp,                               //Temperatura atual
            temp_max: json.main.temp_max,                       //Temperatura máxima
            temp_min: json.main.temp_min,                       //Temperatura mínima
            temp_description: json.weather[0].description,      //Descrição do clima
            icon: json.weather[0].icon,                         //Icone do clima
            wind_speed: json.wind.speed,                        //Velocidade do vento
            humidity: json.main.humidity,                       //Humidade do clima
            timezone: json.timezone                             //Valor (timezone) do local
        })
    }

    // Se o código for != 200 (erro)
    else {
        // Remove a classe "show" da seleção do clima, escondendo-a
        document.querySelector("#weather").classList.remove('show');

        // Dispara alerta "erro 404" e uma imagem ilustrativa informando o erro
    showAlert(`
        Error 404 - Cidade não encontrada
        <img src="./images/404.svg"/>
        `);
    }
});

// Função responsável por exibir as informações do clima na tela
function showinfo(json) {
    //Limpa qualquer alerta anterior
    showAlert("");

    // Mostra a seção de clima adicionando a classe "show"
    document.querySelector("#weather").classList.add('show');

    //Exibe o título com a cidade e o pais
    document.querySelector("#Tittle").innerHTML = `${json.city}, ${json.country}`;

    //Exibe a temperatura atual arredondada
    document.querySelector("#temp_value").innerHTML = `${Math.round(json.temp)} <sup>°C</sup>`;

    // Exibe a temperatura máxima arredondada
    document.querySelector("#temp_max").innerHTML = `${Math.round(json.temp_max)} <sup>°C</sup>`;

    // Exibe a temperatura mínima arredondada
    document.querySelector("#temp_min").innerHTML = `${Math.round(json.temp_min)} <sup>°C</sup>`;

    // Exibe a descrição do clima da cidade
    document.querySelector("#temp_description").innerHTML = `${json.temp_description}`;

    // Exibe a imagem correspondente ao clima da cidade
    document.querySelector("#temp_img").setAttribute('src', `https://openweathermap.org/img/wn/${json.icon}.png`);

    // Exibe a humidade correspondente em porcentagem
    document.querySelector("#humidity").innerHTML = `${json.humidity}%`;

    // Exibe a velocidade do vento correspondente, convertido em km/h
    document.querySelector("#wind").innerHTML = `${Math.round(json.wind_speed * 3.6)} km/h`;

    // Calcula o horario local com base no fuso horário retornado pela API
    const nowUTC = new Date();
    const localTime = new Date(nowUTC.getTime() + json.timezone * 1000);

    // Exibe o horário formatado em portugues no Brasil
    const timeDiv = document.querySelector("#time");
    timeDiv.textContent = `${localTime.toLocaleString("pt-BR", { timeZone: "UTC" })}`;

    // Obtem a hora local em UTC
    const hour = localTime.getUTCHours();
    const body = document.body;

    // Se o horario da cidade for entre 06HRS a 18HRS -> mostra um background claro, se não mostra um background escuro
    if (hour >= 6 && hour < 18) {
        body.classList.remove("nighttime");
        body.classList.add("daytime");
    } else {
        body.classList.remove("daytime");
        body.classList.add("nighttime");
    }
}

// Função responsável por enviar uma mensagem de alerta na página
function showAlert(msg) {

    // Seleciona o elemento com o id"alert" e insere ele o texto da mensagem recebida 
    document.querySelector('#alert').innerHTML = msg;
}