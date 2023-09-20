"use strict";

// Get the input file from the form
const file_input = document.getElementById("cities_file");

// Create the map
const map = L.map('map').setView([4.7109886, -74.072092], 6);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Array to save the cities in JSON and use it
let cities_matrix = [];

// Get the file and recover the data to show to the map (principal event of the program)
file_input.addEventListener("change", (event) => {
    // Save the file
    let file = event.target.files[0];

    if(file){ // If the file was read then
        
        let reader = new FileReader(); // API to read files in the web: https://developer.mozilla.org/es/docs/Web/API/FileReader
        // When the read of the file is complete (event onload)
        reader.onload = function (event_2) {
            
            let content = event_2.target.result;
            let rows = content.split('\n');
            // Get the table to show to the client the data that he upload
            const table = document.getElementById("table");
            // Creat a header to the table
            const headerRow = document.createElement('tr');
            const headers = rows[0].split(','); // Get the header of the file

            // For each row of the headers, create one an add to the table header
            for (let i = 0; i < headers.length; i++) {
                let th = document.createElement('th');
                th.textContent = headers[i];
                headerRow.appendChild(th);
            }

            const table_header = document.createElement("thead");
            table_header.appendChild(headerRow);
            const th_buttons = document.createElement('th');
            th_buttons.textContent = "Position";
            headerRow.appendChild(th_buttons);
            table_header.appendChild(headerRow);
            table.appendChild(table_header);

            // Create the data for the table
            const table_body = document.createElement("tbody");
            
            // Read since the data row and add it
            for (let j = 1; j < rows.length; j++) {
                
                let city_data = [];
                let dataRow = document.createElement('tr');
                let data = rows[j].split(',');

                for (let k = 0; k < data.length; k++) {
                    let td = document.createElement('td');
                    city_data.push(data[k]);
                    td.textContent = data[k];
                    dataRow.appendChild(td);
                }

                city_data = castToNumber(city_data, 4);
                city_data = castToNumber(city_data, 2);
                city_data = castToNumber(city_data, 3);
                //console.log(city_data);
                cities_matrix.push(city_data);
                // Create a button for each file of the data row in the table that contains his position of the matrix and send it for show it
                let button = document.createElement('button');
                button.className = "position_button";
                button.textContent = "Look position";
                button.type = "button";
                button.value = j - 1;
                dataRow.appendChild(button);
                table_body.appendChild(dataRow);
            }

            table.appendChild(table_body);
            addMarkers(cities_matrix);
            addButtonSubmission();
            showMarkers();
            showPaths();
        }

        reader.readAsText(file);
    }

});

//Function to cast the number values for the CSV reading
function castToNumber(array, position = 0) {

    if(position != 0){

        for (let index = 0; index < array.length; index++) {
            array[position] = Number(array[position]);
        }
        
        return array;

    }else{
        return array.forEach(element => {
            Number(element);
        });
    }
}

// Function to add the points of the map according a the cities
function addMarkers(countries) {

    // Add each countrie to show in the map (how markers/points)
    countries.forEach(countrie => {
        const country_marker = L.marker([countrie[2], countrie[3]], {
            title: countrie[0],
            city_name: countrie[0],
            airport_name: countrie[1],
            latitude: countrie[2],
            longitude: countrie[3],
            delay: countrie[4]
        }).addTo(map);
    });

    map.setView([countries.at(-1)[2], countries.at(-1)[3]]);
}

// Function to show the popups of the city points on the map
function showMarkers() {
    // Add a popup for each layer
    map.eachLayer((layer) => {
        layer.bindPopup(
        "<center>" + "<b>" + layer.options.city_name + "</b>" +
        "<br/>" + "Airport: " + layer.options.airport_name + "</b>" +
        "<br/>" + "Latitude: " + layer.options.latitude + ", Longitude: " +  + layer.options.longitude + "</b>" +
        "<br/>" + "Delay: " + layer.options.delay + "</b>" +
        "</center>"
        );
    });
}

// Function to show an specific point of the map according a position
function goToPoint(latitude, longitude) {
    map.setView([latitude, longitude]);
}

// Function to add the button to send the value to the position in the matrix, consult it and show it
function addButtonSubmission() {
    const cities_buttons = document.querySelectorAll("button.position_button");
    cities_buttons.forEach(button => {
        button.addEventListener("click", (event) => {
            goToPoint(cities_matrix[event.target.value][2] , cities_matrix[event.target.value][3]);
        })
    });
}

// Function to show the polygons that represent the path betweent the points
function showPaths(){

    const colors = ["yellowgreen", "red", "green", "orange", "brown", "palevioletred", "purple", "grey", "black"];

    for(let i = 0; i < cities_matrix.length - 1; i++){
        const first_point = cities_matrix[i];
        const second_point = cities_matrix[i + 1];
        const start_point = L.latLng(first_point[2], first_point[3]);
        const end_point = L.latLng(second_point[2], second_point[3]);
        // Create a straight (polygon) that connect those points and show it
        const polyline = L.polyline([start_point, end_point], {color: colors[i], weight: 7});
        const distance = calculateDistance([first_point[3], first_point[2]], [second_point[3], second_point[2]]);
        const travel_time_hours = calculateTravelTime(distance, first_point[4]);
        const travel_time_minutes = hourToMinutes(travel_time_hours);
        polyline.bindPopup(
            "<b>From " + first_point[0] + " to " + second_point[0] + "</b>" + "<br/>" +
            "<b>Distance: </b>" + distance + " KM" + "<br/>" +
            "<b>Travel Time: </b>" + travel_time_hours + " hours." + "<br/>" +
            "<b>Minutes: </b>" + travel_time_minutes 
        ).addTo(map);
    }

    // Create the last point to link with the firs point
    const last_point = cities_matrix.at(-1);
    const first_point = cities_matrix.at(0);
    const start_point = L.latLng(last_point[2], last_point[3]);
    const end_point = L.latLng(first_point[2], first_point[3]);
    const polyline = L.polyline([start_point, end_point], {color: 'blue', weight: 7}).addTo(map);
    const distance = calculateDistance([last_point[3], last_point[2]], [first_point[3], first_point[2]]);
    const travel_time_hours = calculateTravelTime(distance, last_point[4]);
    const travel_time_minutes = hourToMinutes(travel_time_hours);
    polyline.bindPopup(
        "<b>" + "From " + last_point[0] + " to " + first_point[0] + "</b>" + "<br/>" +
        "<b>Distance: </b>" + distance + " KM" + "<br/>" +
        "<b>Travel Time: </b>" + travel_time_hours + " hours." + "<br/>" +
        "<b>Minutes: </b>" + travel_time_minutes 
    ).addTo(map);
}

// TODO: HACER LOS CÁLCULOS DE TIEMPO DE DEMORA CON AYUDA DEL CHAT QUE TUVE CON GPT Y MOSTRARLO EN EL BINDPOPUP

function calculateDistance(from, to, units = "kilometers") {
    from = turf.point(from);
    to = turf.point(to);
    return turf.distance(from, to, {units});
}

function calculateTravelTime(distance, delay = 0, average_velocity = 860) {
    return (distance / average_velocity) + delay;
}

function hourToMinutes(hour) {
    return Math.round(hour * 60);
}