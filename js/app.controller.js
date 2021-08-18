import { weatherService } from './services/weather.service.js';
import { locService } from './services/loc.service.js';
import { mapService } from './services/map.service.js';

export const appController = {
    renderLocation,
};

window.onload = onInit;
window.onAddMarker = onAddMarker;
window.onPanTo = onPanTo;
window.onGetUserPos = onGetUserPos;
window.onAddLocation = onAddLocation;
window.onGoToLoc = onGoToLoc;
window.onDeleteLoc = onDeleteLoc;
document.querySelector('#map').addEventListener('click', ()=>{
    onAddMarker(mapService.getLastLoc()[0]);
});


function onInit() {
  renderSavedLocs()
    mapService
        .initMap()
        .then(() => {
            console.log('Map is ready');
            weatherService.getWeatherByLocation({lat: 32.0749831, lng: 34.9120554}, renderWeather);
        })
        .catch(() => console.log('Error: cannot init map'));
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    console.log('Getting Pos');
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });
}

function onAddMarker(loc) {
    weatherService.getWeatherByLocation(loc, renderWeather);
}

function onGetUserPos() {
    getPosition()
        .then((pos) => {
            console.log('User position is:', pos.coords);
            document.querySelector(
                '.user-pos'
            ).innerText = `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`;
            mapService.panTo(pos.coords.latitude, pos.coords.longitude);
            const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
            mapService.addMarker(loc);
            mapService.getAddressByLatLng(loc, renderLocation)
        })
        .catch((err) => {
            console.log('err!!!', err);
        });
}

function onPanTo() {
    const searchLocation = document.querySelector('.location-input').value;
    console.log('Panning the Map');
    mapService.codeAddress(searchLocation, mapService.panTo, renderLocation);
}

function renderLocation(location) {
    document.querySelector('.location').innerText = location;
}

function onAddLocation() {
  const lastPos = mapService.getLastLoc();
  const name = document.querySelector('.location').innerText;

  lastPos[0].name = name;
  locService.saveLocation(lastPos)
  renderSavedLocs()
}

function renderWeather(weatherData){
    const elWeatherData = document.querySelector('.weather-container');

    const weatherStr = `
    <img src="http://openweathermap.org/img/wn/${weatherData.icon}@2x.png" alt="icon">
    <div class="weather-data">
        <div class="top-row weather-row">
            <p>${weatherData.temp}°</p>
            <p>${weatherData.weather}</p>
            <p>${weatherData.description}</p>
        </div>
        <div class="bottom-row weather-row">
            <p class="light-gray">min<br><span>${weatherData.temp_min}°</span></p>
            <p class="light-gray">max<br><span>${weatherData.temp_max}°</span></p>
            <p class="light-gray">humidity<br><span>${weatherData.humidity}%</span></p>
        </div>
    </div>`

    elWeatherData.innerHTML = weatherStr;
}

function renderSavedLocs(){

    let strHtml = ''
     const locs= locService.getLocsForDisplay()
    //  console.log(loc);

    locs.map(loc => {
      strHtml += `
      <h4>${loc[0].name}</h4>
      <div class="actions">
      <div onclick="onGoToLoc(${loc[0].lat},${loc[0].lng})" class="loc-actions">Go</div>
      <div onclick="onDeleteLoc(${loc[0].id})" class="loc-actions">Delete</div>
      </div>
      `
    })

    document.querySelector('.locs').innerHTML=strHtml;
}

function onGoToLoc(lat,lng){
  weatherService.getWeatherByLocation({lat, lng}, renderWeather);
  mapService.panTo(lat,lng)
}

function onDeleteLoc(id){

  locService.deleteLoc(id)
  renderSavedLocs()
}