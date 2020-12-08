/*
 * Copyright 2019 Google LLC. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// This example creates circles on the map, representing populations in North
// America.

// First, create an object containing LatLng and population for each city.

/*interface City {
  center: google.maps.LatLngLiteral;
  population: number;
}

const citymap: Record<string, City> = {
  chicago: {
    center: { lat: 41.878, lng: -87.629 },
    population: 2714856,
  },
  newyork: {
    center: { lat: 40.714, lng: -74.005 },
    population: 8405837,
  },
  losangeles: {
    center: { lat: 34.052, lng: -118.243 },
    population: 3857799,
  },
  vancouver: {
    center: { lat: 49.25, lng: -123.1 },
    population: 603502,
  },
};*/

function initMap(): void {
    // Create the map.
    const map = new google.maps.Map(
	document.getElementById("map") as HTMLElement,
	{
	    zoom: 15,
	    center: { lat: 45.7986377, lng: 4.9778579 },
	    mapTypeId: "terrain",
	}
    );
    
    // Construct the circle for each value in citymap.
    // Note: We scale the area of the circle based on the population.
/*    for (const city in citymap) {
	// Add the circle for this city to the map.
	const cityCircle = new google.maps.Circle({
	    strokeColor: "#FF0000",
	    strokeOpacity: 0.8,
	    strokeWeight: 2,
	    fillColor: "#FF0000",
	    fillOpacity: 0.35,
	    map,
	    center: citymap[city].center,
	    radius: Math.sqrt(citymap[city].population) * 100,
	});
    }*/
    
    google.maps.event.addListener(map, "click", (event) => {
	addCircle(event.latLng, map);
    });
}

let geographyCircle: google.maps.Circle | null = null;
let geoFenceCircle: google.maps.Circle | null = null;
let hardFenceCircle: google.maps.Circle | null = null;
let groundRiskBufferCircle: google.maps.Circle | null = null;
function addCircle(location: google.maps.LatLngLiteral, map: google.maps.Map) {
    let wind : number
    let height : number
    let geographyVolume : number
    let groundRiskBufferRadius : number

    wind = Number($("#inputMaxWind").val())
    height = Number($("#inputMaxHeight").val())
    geographyVolume = Number($("#inputGeographyVolume").val())

    let vm = 12 + wind

    groundRiskBufferRadius = 3 * vm + vm * Math.sqrt((2 * height) / 9.89) 

    if (geographyCircle !== null) geographyCircle.setMap(null)
    if (geoFenceCircle !== null) geoFenceCircle.setMap(null)
    if (hardFenceCircle !== null) hardFenceCircle.setMap(null)
    if (groundRiskBufferCircle !== null) groundRiskBufferCircle.setMap(null)
    
    groundRiskBufferCircle = new google.maps.Circle({
	strokeColor: "#FF2C2C",
	strokeOpacity: 0.8,
	strokeWeight: 2,
	fillColor: "#FF2C2C",
	fillOpacity: 0.35,
	map,
	center: location,
	radius: geographyVolume / 2 + 5 + 5 + groundRiskBufferRadius,
    });
    google.maps.event.addListener(groundRiskBufferCircle, "click", (event) => {
	addCircle(event.latLng, map);
    });
    hardFenceCircle = new google.maps.Circle({
	strokeColor: "#FABC6C",
	strokeOpacity: 0.8,
	strokeWeight: 2,
	fillColor: "#FABC6C",
	fillOpacity: 0.35,
	map,
	center: location,
	radius: geographyVolume / 2 + 5 + 5,
    });
    google.maps.event.addListener(hardFenceCircle, "click", (event) => {
	addCircle(event.latLng, map);
    });
    geoFenceCircle = new google.maps.Circle({
	strokeColor: "#FAF36C",
	strokeOpacity: 0.8,
	strokeWeight: 2,
	fillColor: "#FAF36C",
	fillOpacity: 0.35,
	map,
	center: location,
	radius: geographyVolume / 2 + 5,
    });
    google.maps.event.addListener(geoFenceCircle, "click", (event) => {
	addCircle(event.latLng, map);
    });
    geographyCircle = new google.maps.Circle({
	strokeColor: "#72DF61",
	strokeOpacity: 0.8,
	strokeWeight: 2,
	fillColor: "#72DF61",
	fillOpacity: 0.35,
	map,
	center: location,
	radius: geographyVolume / 2,
    });
    google.maps.event.addListener(geographyCircle, "click", (event) => {
	addCircle(event.latLng, map);
    });

}

export { initMap };

import "./style.css"; // required for webpack
