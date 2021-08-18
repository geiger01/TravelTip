export const mapService = {
    initMap,
    addMarker,
    panTo,
    codeAddress,
};

import { appController } from '../app.controller.js';

let gMap, infoWindow;
let gMarkers = [];

function initMap(lat = 32.0749831, lng = 34.9120554) {
    console.log('InitMap');
    return _connectGoogleApi().then(() => {
        console.log('google available');
        gMap = new google.maps.Map(document.querySelector('#map'), {
            center: { lat, lng },
            zoom: 15,
        });
        console.log('Map!', gMap);

        infoWindow = new google.maps.InfoWindow();
        const locationButton = document.querySelector('button');
        gMap.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
        gMap.addListener('click', (mapsMouseEvent) => {
            removeMarker();
            let lat = JSON.stringify(mapsMouseEvent.latLng.toJSON().lat);
            let lng = JSON.stringify(mapsMouseEvent.latLng.toJSON().lng);
            addMarker({ lat: +lat, lng: +lng });
            getAddressByLatLng({ lat, lng }, appController.renderLocation)
        });
    });
}

function removeMarker() {
    for (var i = 0; i < gMarkers.length; i++) {
        gMarkers[i].setMap(null);
    }
}

function addMarker(loc) {
    var marker = new google.maps.Marker({
        position: loc,
        map: gMap,
        title: 'Hello World!',
    });
    gMarkers.push(marker);
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng);
    gMap.panTo(laLatLng);
}

function _connectGoogleApi() {
    if (window.google) return Promise.resolve();
    const API_KEY = 'AIzaSyB86uZViFdxJ6bdlAHwUMF1jG762ZBDIAg';
    var elGoogleApi = document.createElement('script');
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
    elGoogleApi.async = true;
    document.body.append(elGoogleApi);

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve;
        elGoogleApi.onerror = () => reject('Google script failed to load');
    });
}

function codeAddress(location, onSuccess) {
    console.log(location);
    const prm = axios
        .get('https://maps.googleapis.com/maps/api/geocode/json', {
            params: {
                address: location,
                key: 'AIzaSyDHb1ruR77Ht3GhRL8lw55udbpxVpCYKXQ',
            },
        })
        .then((response) => {
            const lat = response.data.results[0].geometry.location.lat;
            const lng = response.data.results[0].geometry.location.lng;
            addMarker({ lat, lng })
            onSuccess(lat, lng);
            return { lat, lng };
        })
        .then((pos) => {
            getAddressByLatLng(pos, renderLocation)
        })
        .catch((error) => {
            console.log(error);
        });
}


function getAddressByLatLng(pos, onSuccess) {
    const prm = axios
        .get('https://maps.googleapis.com/maps/api/geocode/json', {
            params: {
                latlng: pos.lat + ',' + pos.lng,
                key: 'AIzaSyDHb1ruR77Ht3GhRL8lw55udbpxVpCYKXQ',
            },
        })
        .then((response) => {
            onSuccess(response.data.results[0]['formatted_address']);
        });
}