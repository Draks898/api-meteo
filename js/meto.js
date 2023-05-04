
var map = L.map('map');
let cash = [];
let h = new Date();
h.setHours(2, 0, 0);



map.setView([-21.422331, 166.057860], 9);
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);


var control = L.Routing.control(L.extend(window.lrmConfig, {
    geocoder: L.Control.Geocoder.nominatim(),
    routeWhileDragging: true,
    reverseWaypoints: true,
    showAlternatives: true,
    altLineOptions: {
        styles: [
            { color: 'black', opacity: 0.15, weight: 9 },
            { color: 'white', opacity: 0.8, weight: 6 },
            { color: 'blue', opacity: 0.5, weight: 2 }
        ]
    }
})).on('waypointschanged', function (data) {
    // if (d > d.setHours(2, 0, 0)) {
    console.log(h);
    for (let i = 0; i < data.waypoints.length; i++) {
        if (data.waypoints[i].latLng != null) {
            lat = data.waypoints[i].latLng.lat;
            long = data.waypoints[i].latLng.lng;
            const token = '4c5741e7c36fed84dd068f45f8c809df';
            //récupération de l'icon
            $.get('https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + long + '&units=metric&lang=fr&appid=' + token, function (meteo) {
                myIcon = meteo.weather[0].icon;
                var icon = L.icon({
                    iconUrl: 'http://openweathermap.org/img/wn/' + myIcon + '@2x.png',
                    iconSize: [40, 40],
                });

                //mouse over pour chauque point diférent, avec leur paramettre respective.
                var marker = L.marker([lat, long], { icon: icon })
                    .on('mouseover', function (data) {
                        $.get('https://api.openweathermap.org/data/2.5/weather?lat=' + data.latlng.lat + '&lon=' + data.latlng.lng + '&units=metric&lang=fr&appid=' + token, function (meteo) {
                            vent = meteo.wind;
                            params = meteo.main;
                            temps = meteo.weather[0].description;
                            marker.bindPopup(

                                "<strong>Temps</strong> : " + temps +
                                "<br><strong>Vent</strong> : " + vent.speed + "km/h" +
                                "<br><strong>Température</strong> : " + params.temp + " °" +
                                "<br><strong>Température minimale</strong> : " + params.temp_min + " °" +
                                "<br><strong>Température maximale</strong> : " + params.temp_max + " °" +
                                "<br><strong>Pression</strong> : " + params.pressure + " Pa").openPopup();
                        });


                    }).addTo(map);
                cash.push(meteo);
                console.log(cash);
            });

        }

    }
    // } else {
    //     cash.forEach(meteo);
    // }


}).addTo(map);

L.Routing.errorControl(control).addTo(map);


function rebour() {
    var deadline = new Date(h).getTime();
    var x = setInterval(function () {
        var now = new Date().getTime();
        var t = deadline - now;
        var days = Math.floor(t / (1000 * 60 * 60 * 24));
        var hours = Math.floor((t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((t % (1000 * 60)) / 1000);
        document.getElementById("demo").innerHTML = days + "d "
            + hours + "h " + minutes + "m " + seconds + "s ";
        if (t < 0) {
            clearInterval(x);
            document.getElementById("demo").innerHTML = "EXPIRED";
        }
    }, 1000);
}
console.log("demo")