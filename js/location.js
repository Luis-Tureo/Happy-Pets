// Initialize and add the map
const   alerce          = { lat: -41.390471, lng: -72.911711 };
const   puerto_montt    = { lat: -41.4700644, lng: -72.9436817};
let     destination;

//Obtener el listado de coordenadas 
const coordinatesList = [
    // Puerto Montt
    {
        lat: -41.462812701401496,
        lng: -72.93426491835176,
        name: "Clínica Veterinaria Los Lagos"
    },
    {
        lat: -41.46873337458262,
        lng: -72.94426810520723,
        name: "Clínica Veterinaria Petrohue"
    },
    {
        lat: -41.461452818350956,
        lng: -72.93928581899107,
        name:"CLINICA VETERINARIA ANTIHUAL"
    },
    {
        lat: -41.470428432361565,
        lng: -72.91476396751793,
        name:"VETERINARIA CRISTO REY"
    },
    // Alerce
    {
        lat: -41.39457923586366,
        lng: -72.89791090990187,
        name:"Posta Veterinaria Los Alerces"
    },
    {
        lat: -41.39757587986365,
        lng: -72.9043873901622,
        name:"Clínica Veterinaria Alerce"
    },
    {
        lat: -41.404927916771264,
        lng: -72.91660952284715,
        name:"Mascota Planet"
    },
];

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
   
    searchBox.addListener('places_changed', function() {     
        const places                = searchBox.getPlaces();
        const lat                   = places[0].geometry.location.lat();
        const lng                   = places[0].geometry.location.lng();
        destination                 = { lat, lng };

        $("#locationPersButton").click(function () {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
        
                (position) => {
                    const pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
    
                    let request = {
                        origin: pos,
                        destination: destination,
                        travelMode: $("#transportMeans").val()
                    };
    
                    $("#clearButton").click(function () {
                        $("#selectVet")[0].selectedIndex = 0;
                        $('#nameVetAlert').html('');
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

    $("#locationButton").click(function () {

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
    
            (position) => {
                const pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };

                let request = {
                    origin: pos,
                    destination: destination,
                    travelMode: $("#transportMeans").val()
                };

                $("#clearButton").click(function () {
                    $("#selectVet")[0].selectedIndex = 0;
                    $('#nameVetAlert').html('');
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

    $("#closestRoute").click(function () {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
    
            (position) => {
                const pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
    
                let objMinLocation      = minLocation(coordinatesList, pos);           
                const name              =  objMinLocation.name;
    
                $('#nameVetAlert').html("Se ha seleccionado " + name + " como la veterinaria mas cerca de su localización");
                    destination  = {
                        lat:   objMinLocation.coords.lat,
                        lng:   objMinLocation.coords.lng,
                };
    
                let request = {
                    origin: pos,
                    destination: destination,
                    travelMode: "DRIVING"
                };
    
                $("#clearButton").click(function () {
                    $("#selectVet").val([0]);
                    $('#nameVetAlert').html('');
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

    function minLocation(coordinatesList, pos) {
            
        // Recorremos el listado de coordenadas
        for (let index = 0; index < coordinatesList.length; index++) {

            a_vet_location = distanceBetweenCoordinates(pos, coordinatesList[index])
        }

        const objMinLocation = {
            name: a_vet_location[0],
            minDistance:   Math.min(a_vet_location[1]),
            coords: { lat: a_vet_location[2].lat, lng: a_vet_location[2].lng }
        }
    
        return objMinLocation;
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



$("#selectVet").click(function () {
    if ($('#optionVet').val() !== '') {
        $('#nameVetAlert').html("Se ha seleccionado " + $('select[id="selectVet"] option:selected')[0].label + " como la veterinaria de destino");
        destination = JSON.parse($('#optionVet').val());
    } 
});

function setMenuVet(coordinatesList) {
    if (coordinatesList && coordinatesList.length > 0) {
        coordinatesList.forEach(coordinatesElement => {
            const VetName           = coordinatesElement.name;
            const lat               = coordinatesElement.lat;  
            const lng               = coordinatesElement.lng; 
            const stringCoords      = `{ "lat": ${lat}, "lng": ${lng} }`;
            const VetNameRow        = document.createElement('option');
            VetNameRow.setAttribute("label", VetName);
            VetNameRow.setAttribute("value", stringCoords);
            VetNameRow.setAttribute("id", "optionVet");
            $("#selectVet").append(VetNameRow);
        });
    }
}
setMenuVet(coordinatesList);
initMap();