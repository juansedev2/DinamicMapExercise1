"use scrict";

import {decoratePositions} from "./functions/Functions.js";

// Latitude and longitude
const programmer_position_alt = [33.18976, 44.00723];
// Positions of the countries 
const Saudi_Arabia_position = [24.711454873635766, 46.67438218019588];
const Uzbekistan_position = [39.65467179595615, 66.97572083948319];
const Italy_position = [40.78689100382049, 14.368456432286543];

let programmer_position = turf.points([
    [...Saudi_Arabia_position].reverse(),
    [...Uzbekistan_position].reverse(),
    [...Italy_position].reverse()
]);

programmer_position = turf.center(programmer_position);
programmer_position = programmer_position.geometry.coordinates;
programmer_position = [...programmer_position].reverse();

// Create a new map
const map = L.map('map').setView(programmer_position_alt, 4);

// Add a tittle an
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">Where is the programmer?</a>'
}).addTo(map);


/**
 * Add the markers of the countries
*/
// Add a marker point for each
const programmer_marker = L.marker(programmer_position, {
    title: "HELP, I'm in Zawbaa<br/><b>Irak</b>",
    position: decoratePositions(programmer_position)
}).addTo(map);
const programmer_marker_alt = L.marker(programmer_position_alt, {
    title: "HELP, I'm in Zawbaa<br/><b>Irak</b>",
    position: decoratePositions(programmer_position_alt)
}).addTo(map);
const Saudi_Arabia_marker = L.marker(Saudi_Arabia_position, {
    title: "Riad<br/><b>Arabia Saudita</b>",
    position: decoratePositions(Saudi_Arabia_position)
}).addTo(map);
const Uzbekistan_marker = L.marker(Uzbekistan_position, {
    title: "Uzbekistan<br/><b>Samarcanda</b>",
    position: decoratePositions(Uzbekistan_position)
}).addTo(map);
const Italy_marker = L.marker(Italy_position, {
    title: "Nápoles<br/><b>Italia</b>",
    position: decoratePositions(Italy_position)
}).addTo(map);

/**
 * Add the circles of the countries
*/

// Saudi Arabia, City: Riad

const Saudi_Arabia_cirlcle = L.circle(Saudi_Arabia_position, {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 977690
}).addTo(map);

// uzbekistan, City: Samarcanda

const Uzbekistan_circle = L.circle(Uzbekistan_position, {
    color: 'blue',
    fillColor: 'blue',
    fillOpacity: 0.5,
    radius: 2169860
}).addTo(map);

// Italy, City: Nápoles

const Italy_circle = L.circle(Italy_position, {
    color: 'yellow',
    fillColor: 'yellow',
    fillOpacity: 0.5,
    radius: 2749400
}).addTo(map);

// Circle of the point of the programmer
/* const programmer_circle = L.circle(programmer_position, {
    color: 'green',
    fillColor: 'green',
    fillOpacity: 0.5,
    radius: 900
}).addTo(map); */

// Add a popup for each layer
map.eachLayer(function(layer){
    layer.bindPopup("<center>" + layer.options.title + "</br>" + layer.options.position + "</center>");
});
