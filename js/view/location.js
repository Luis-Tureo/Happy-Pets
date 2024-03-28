// Initialize and add the map
const alerce = { lat: -41.390471, lng: -72.911711 };
const puerto_montt = { lat: -41.4700644, lng: -72.9436817 };

let destination;

async function initMap() {
    const { Map } = await google.maps.importLibrary("maps");

    let directionsService = new google.maps.DirectionsService();
    let directionsRenderer = new google.maps.DirectionsRenderer();
    let infoWindow = new google.maps.InfoWindow();
   
    //Inicializar mapa
    let map = new Map($("#map").get(0), {
        zoom: 15,
        center: alerce,
    });


    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(

            (position) => {
                const pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };

                let request = {
                    origin: pos,
                    destination: puerto_montt,
                    travelMode: "DRIVING"
                };

                directionsService.route(request, function (result, status) {
                    if (status == 'OK') {
                        directionsRenderer.setDirections(result);
                    }
                });

                directionsRenderer.setMap(map);

            },

            () => {
                handleLocationError(true, infoWindow, map.getCenter());
            }

        );
    } else {
        handleLocationError(false, infoWindow, map.getCenter());
    }
}

initMap();