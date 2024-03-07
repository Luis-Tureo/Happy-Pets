
// class Accidents {
//     constructor(name, date, type, location, photo, description) {
//       this.name         = name;
//       this.date         = date;
//       this.type         = type;
//       this.location     = location;
//       this.photo        = photo;
//       this.description  = description;
//     }
// }


// async function initMap() {
//     await google.maps.importLibrary("maps");

//     let   infoWindow            = new google.maps.InfoWindow();

//     $("#accidentButton").click(function () {
//         if (navigator.geolocation) {
//             navigator.geolocation.getCurrentPosition(

//             (position) => {
//                 const pos = {
//                     lat: position.coords.latitude,
//                     lng: position.coords.longitude,
//                 };
//             },

//             () => {
//                 handleLocationError(true, infoWindow, map.getCenter());
//             }
            
//             );
//         } else {
//             handleLocationError(false, infoWindow, map.getCenter());
//         }
//     });

//     function handleLocationError(browserHasGeolocation, infoWindow, pos) {
//         infoWindow.setPosition(pos);
//         infoWindow.setContent(
//             browserHasGeolocation
//             ? "Error: The Geolocation service failed."
//             : "Error: Your browser doesn't support geolocation."
//         );
//         infoWindow.open(map);
//     }
// }

// initMap();