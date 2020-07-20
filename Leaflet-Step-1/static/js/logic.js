const KEY = "pk.eyJ1IjoibWdhbzIwMDciLCJhIjoiY2tjdGtnYWI1MWx6dTJzbGU3Mml2czdwaCJ9.bv7EDKy_BhX8laya9R3C_w";
let geo_json = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

function selectColor(div){
    return div > 5 ? "red":
    div > 4 ? "orangered":
    div > 3 ? "orange":
    div > 2 ? "yellow":
    div > 1 ? "yellowgreen":
    "green";
}

function createMap(eq) {
    
    let lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/light-v10',
        accessToken: KEY
    });

    let base = {
        "LightMap": lightmap
    };

    let overlay = {
        "Earthquakes": eq
    };

    var myMap = L.map("map", {
        center: [30, -10],
        zoom: 3,
        layers: [lightmap, eq]
      });
    
    L.control.layers(base, overlay, {
        collapsed: false
    }).addTo(myMap);

    let legend = L.control({position: "bottomright"});

    legend.onAdd = (map) => {
        let div = L.DomUtil.create('div', 'info legend'),
        grades=[0, 1, 2, 3, 4, 5];

        div.innerHTML = div.innerHTML + "Magnitude"

        for(let i = 0; i < grades.length; i++){
            div.innerHTML = div.innerHTML + 
            '<i style="background: ' + selectColor(grades[i] + 1) + '"></i> ' + 
            grades[i] + (grades[i+1] ? '&ndash;' + grades[i+1] + '<br>' : '+')
        }

        return div;
    };

    legend.addTo(myMap);
}

function createMarkers(eq) {
    let earthquakes = [];
    let features = eq.features;

    for(let i = 0; i < features.length; i++){
        let quake = features[i];
        
        let earthquake = L.circleMarker([quake.geometry.coordinates[1], quake.geometry.coordinates[0]],{
          fillColor: selectColor(quake.properties.mag), 
            radius: 4 * quake.properties.mag,
            color: "black", 
            weight: 1, 
            fillOpacity: 0.75
        });

        earthquake.bindPopup("<h3>" + quake.properties.place + "<h3><h3>Time: " + Date(quake.properties.time) +"<h3><h3>Magnitude: " + quake.properties.mag + "</h3>");

        earthquakes.push(earthquake);
        }

        createMap(L.layerGroup(earthquakes));
    }


d3.json(geo_json, createMarkers);