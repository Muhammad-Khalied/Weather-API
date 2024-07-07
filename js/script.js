const links = document.querySelectorAll('.my-nav-link');
const apiKey = '12c2b1d926d14500b42145151240607';
const forecastDays = 3;
var forecastLocation = '';
const searchField = document.querySelector('.search input');
const findBtn = document.querySelector('.find-button');
const forecastContainer = document.querySelector('.forecast-container');


const days = new Map(
    [
        [0, 'Sunday'],
        [1, 'Monday'],
        [2, 'Tuesday'],
        [3, 'Wednesday'],
        [4, 'Thursday'],
        [5, 'Friday'],
        [6, 'Saturday']
    ]
)

const months = new Map(
    [
        [0, 'January'],
        [1, 'February'],
        [2, 'March'],
        [3, 'April'],
        [4, 'May'],
        [5, 'June'],
        [6, 'July'],
        [7, 'August'],
        [8, 'September'],
        [9, 'October'],
        [10, 'November'],
        [11, 'December']
    ]
)

async function getWeather() {
    const api = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${forecastLocation}&days=${forecastDays}`;
    try {
        const result = await fetch(api)
        if (result.ok) {
            const response = await result.json();
            displayForecast(response);
        }
        else {
            throw new Error('Error');
        }
    } catch (error) {
        console.log(error);
    }
}


function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        console.log("Geolocation is not supported by this browser.");;
    }
}


function showPosition(position) {
    forecastLocation = `${position.coords.latitude},${position.coords.longitude}`;
    getWeather();
}



for (let link of links) {
    link.addEventListener('click', function () {
        for (let link of links) {
            if (link.classList.contains('active'))
                link.classList.remove('active')
        }
        link.classList.add('active')
    })
}

findBtn.addEventListener('click', function (e) {
    forecastLocation = searchField.value;
    getWeather();
})

searchField.addEventListener('input', function (e) {
    forecastLocation = e.target.value;
    getWeather();
}
)



function displayForecast(response) {
    let forecast = response.forecast.forecastday;
    let day1States = forecast[0];
    // let day2States = forecast[1];
    // let day3States = forecast[2];
    let currentHour = new Date().getHours();
    let currentDay = days.get(parseInt(new Date(day1States.date).getDay()));
    let currentMonth = months.get(parseInt(new Date(day1States.date).getMonth()));
    let today = new Date(day1States.date).getDate() + '' + currentMonth;
    let locationName = response.location.name;
    let temperature = day1States.hour[currentHour].temp_c;
    let state = day1States.hour[currentHour].condition.text;
    let icon = day1States.hour[currentHour].condition.icon;
    console.log(day1States);
    
    let bBox = `
        <div class="col-lg-4">
            <div class="semi-dark-bg-color rounded-start-3">
            <div
                class="day second-color d-flex justify-content-between p-2 small-font top-card"
            >
                <span>${currentDay}</span>
                <span>${today}</span>
            </div>
            <div class="weather second-color pt-3 px-3">
                <p class="location fs-5">${locationName}</p>
                <h1 class="temp text-white big-font fw-bolder">${temperature}°C</h1>
                <div class="icon"><img src="${icon}" alt="" /></div>
                <p class="state blue-color">${state}</p>
            </div>
            <div class="footer second-color p-3 py-4">
                <div class="d-flex gap-2">
                    <div><img src="images/icon-umbrella.png" class="pe-1" alt="">20%</div>
                    <div><img src="images/icon-wind.png" class="pe-1" alt="">18km/h</div>
                    <div><img src="images/icon-compass.png" class="pe-1" alt="">East</div>
                </div>
            </div>
            </div>
        </div>
    `;
    
    for(let i = 1 ; i < forecastDays; i++)
    {
        let dayStates = forecast[i];
        let day = days.get(parseInt(new Date(dayStates.date).getDay()));
        let minTemperature = dayStates.day.mintemp_c;
        let maxTemperature = dayStates.day.maxtemp_c;
        let state = dayStates.day.condition.text;
        let icon = dayStates.day.condition.icon;
        let bgColor = i % 2 != 0 ? 'dark-bg-color' : 'semi-dark-bg-color';
        let rounded = i % 2 != 0 ? '' : 'rounded-end-3';
        bBox += `
            <div class="col-lg-4 ${bgColor} ${rounded}">
                <div class="">
                <div class="day second-color text-center p-2 small-font top-card">
                    <span>${day}</span>
                </div>
                <div class="weather second-color pt-3 px-3 d-flex flex-column align-items-center">
                    <div class="icon"><img src="${icon}" alt="" /></div>
                    <p class="temp text-white fs-4 m-0 fw-bolder">${maxTemperature}°C</p>
                    <p class="temp second-color m-t fs-6 fw-bolder">${minTemperature}°C</p>
                    <p class="state blue-color">${state}</p>
                </div>
                </div>
            </div>
            `
    }


    forecastContainer.innerHTML = bBox;
}





getLocation();




