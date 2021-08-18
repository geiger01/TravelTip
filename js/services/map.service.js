export const mapService = {
    initMap,
    addMarker,
    panTo,

}

let gMap, infoWindow;

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
            // Close the current InfoWindow.
            infoWindow.close();
            // Create a new InfoWindow.
            infoWindow = new google.maps.InfoWindow({
                position: mapsMouseEvent.latLng,
            });
            infoWindow.setContent(
                JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2)
            );
            let lat = JSON.stringify(mapsMouseEvent.latLng.toJSON().lat);
            let long = JSON.stringify(mapsMouseEvent.latLng.toJSON().lng);
            console.log(lat);
            infoWindow.open(gMap);
        });
    });
}

function addMarker(loc) {
    var marker = new google.maps.Marker({
        position: loc,
        map: gMap,
        title: 'Hello World!',
    });
    return marker;
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
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}
