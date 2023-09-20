"use strict";
// Function to decorate to return a decorate string to show a position
export function decoratePositions (positions) {
    return "[LAT:" + positions[0] + " LONG:" + positions[1] + "]";
}
export function castToNumber(array, position = 0) {

    if(position != 0){

        console.log("Casteado con posición");

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