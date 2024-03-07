// Initialize and add the map
const   alerce          = { lat: -41.390471, lng: -72.911711 };
const   puerto_montt    = { lat: -41.4700644, lng: -72.9436817};

async function initMap() {
    const { Map }               = await google.maps.importLibrary("maps");

    let   directionsService     = new google.maps.DirectionsService();
    let   directionsRenderer    = new google.maps.DirectionsRenderer(); 
    let   infoWindow            = new google.maps.InfoWindow();
    let   input                 = $("#destinationAddress").get(0);
    let   searchBox             = new google.maps.places.SearchBox(input);

    //Inicializar mapa
    let map = new Map($("#map").get(0), {
        zoom: 15, 
        center: alerce, 
    });

    //Lógica para encontrar la veterinaria mas cerca  
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const pos = {
                    lat: position.coords.lat,
                    lng: position.coords.lng,
                };
                

                let request = {
                    origin: pos,
                    destination: puerto_montt,
                    travelMode: "DRIVING"//$("#transportMeans").val()
                };
                
                $("#clearButton").click(function () {
                    directionsRenderer.setMap();
                    map.setCenter(pos);
                    map.setZoom(15);
                });
            
                directionsService.route(request, function(result, status) {
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
    //Fin Lógica
   
    searchBox.addListener('places_changed', function() {
        const places        = searchBox.getPlaces();
        const lat           = places[0].geometry.location.lat();
        const lng           = places[0].geometry.location.lng();
        const destination   = { lat, lng};

        $("#locationButton").click(function () {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
        
                (position) => {
                    const pos = {
                        lat: position.coords.lat,
                        lng: position.coords.lng,
                    };
                    
                    let request = {
                        origin: pos,
                        destination: destination,
                        travelMode: $("#transportMeans").val()
                    };
    
                    $("#clearButton").click(function () {
                        directionsRenderer.setMap();
                        map.setCenter(pos);
                        map.setZoom(15);
                    });
                
                    directionsService.route(request, function(result, status) {
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
        });
     
    });

    $("#transportMeans").click(function () {
        if ($('#transportMeans').val() !== "") {
            $("#showButtons").show();
            $("#showDiv").show();
        }
        else {
            $("#showButtons").hide();
            $("#showDiv").hide();
        }
    });

    function minLocation(pos) {
        //Obtener el listado de coordenadas 
        const coordinatesList = [
            // Puerto Montt
            {
                lat: -33.595586,
                lng: -70.708398,
                name: "Clínica Veterinaria Los Lagos"
            },
            {
                lat: -33.595995,
                lng: -70.709145,
                name: "Clínica Veterinaria Petrohue"
            },
            {
                lat: -33.593636,
                lng: -70.709295,
                name:"CLINICA VETERINARIA ANTIHUAL"
            },
            {
                lat: -33.592774,
                lng: -70.708398,
                name:"VETERINARIA CRISTO REY"
            },
            {
                lat: -33.593636,
                lng: -70.707096,
                name:"VETERINARIA LAS PALMAS"
            },
            {
                lat: -33.597297,
                lng: -70.709295,
                name:"VETERINARIA REY DAVID"
            },
            {
                lat: -33.596586,
                lng: -70.707096,
                name:"VETERINARIA SAN MARCOS"
            },
            {
                lat: -33.592774,
                lng: -70.706334,
                name:"VETERINARIA SAN PEDRO"
            },
            // Alerce
            {
                lat: -33.595995,
                lng: -70.709145,
                name:"Posta Veterinaria Los Alerces"
            },
            {
                lat: -33.593636,
                lng: -70.709295,
                name:"Clínica Veterinaria Alerce"
            },
            {
                lat: -33.595361,
                lng: -70.706334,
                name:"Mascota Planet"
            },
        ];
            
        // Recorremos el listado de coordenadas
        for (let index = 0; index < coordinatesList.length; index++) {

            a_vet_location = distanceBetweenCoordinates(pos, coordinatesList[index])
        }

        let min_location = [Math.min(a_vet_location[1]), a_vet_location[2]]; 
        
        const destination  = {
            lat:   min_location[1].lat,
            lng:   min_location[1].lng,
        };
        return destination;
    }


    // Definimos la función para calcular la distancia entre dos coordenadas
    function distanceBetweenCoordinates(coordinate1, coordinate2) {
        // Convertir las coordenadas a radianes
        const lat1InRadians         = coordinate1.lat  * Math.PI / 180;
        const lng1InRadians         = coordinate1.lng  * Math.PI / 180;

        const lat2InRadians         = coordinate2.lat  * Math.PI / 180;
        const lng2InRadians         = coordinate2.lng  * Math.PI / 180;
        
        // Aplicar la fórmula de Haversine
        const deltalat              = lat2InRadians - lat1InRadians;
        const deltalng              = lng2InRadians - lng1InRadians;
        const a                     = Math.pow(Math.sin(deltalat / 2), 2) + Math.cos(lat1InRadians) * Math.cos(lat2InRadians) * Math.pow(Math.sin(deltalng / 2), 2);
        const c                     = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distanceInKilometers  = 6371 * c;

        let a_vet_location          = [coordinate2.name, distanceInKilometers, {lat: coordinate2.lat, lng: coordinate2.lng}]

        return a_vet_location;
    }

    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(
            browserHasGeolocation
            ? "Error: The Geolocation service failed."
            : "Error: Your browser doesn't support geolocation."
        );
        infoWindow.open(map);
    }
}

initMap();