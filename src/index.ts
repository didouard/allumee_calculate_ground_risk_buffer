//


var balistic_map : {height : number, balistic : number}[] = [
{'height':  120 , 'balistic':  54.0563 }
, {'height':  115 , 'balistic':  52.9629 }
, {'height':  110 , 'balistic':  51.7958 }
, {'height':  105 , 'balistic':  50.6206 }
, {'height':  100 , 'balistic':  49.4006 }
, {'height':  95 , 'balistic':  48.1321 }
, {'height':  90 , 'balistic':  46.7703 }
, {'height':  85 , 'balistic':  45.3905 }
, {'height':  80 , 'balistic':  43.9484 }
, {'height':  75 , 'balistic':  42.4381 }
, {'height':  70 , 'balistic':  40.9021 }
, {'height':  65 , 'balistic':  39.2366 }
, {'height':  60 , 'balistic':  37.5342 }
, {'height':  55 , 'balistic':  35.7358 }
, {'height':  50 , 'balistic':  33.8915 }
, {'height':  45 , 'balistic':  31.9991 }
, {'height':  40 , 'balistic':  29.9875 }
, {'height':  35 , 'balistic':  27.8406 }
, {'height':  30 , 'balistic':  25.6976 }
, {'height':  25 , 'balistic':  23.4004 }
, {'height':  20 , 'balistic':  20.9251 }
, {'height':  15 , 'balistic':  18.2417 }
, {'height':  10 , 'balistic':  15.092 }
    , {'height':  5 , 'balistic':  10.9759 }
]

    
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
        
    google.maps.event.addListener(map, "click", (event) => {
	addCircle(event.latLng, map);
    });

    // Create the search box and link it to the UI element.
    const input = document.getElementById("pac-input") as HTMLInputElement;
    const searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener("bounds_changed", () => {
	searchBox.setBounds(map.getBounds() as google.maps.LatLngBounds);
    });

    let markers: google.maps.Marker[] = [];
  // [START maps_places_searchbox_getplaces]
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
    searchBox.addListener("places_changed", () => {
	const places = searchBox.getPlaces();
	
	if (places.length == 0) {
	    return;
	}
	
	// Clear out the old markers.
	markers.forEach((marker) => {
	    marker.setMap(null);
	});
	markers = [];

	    // For each place, get the icon, name and location.
	const bounds = new google.maps.LatLngBounds();
	places.forEach((place) => {
	    if (!place.geometry) {
		console.log("Returned place contains no geometry");
		return;
	    }
	    const icon = {
		url: place.icon as string,
		size: new google.maps.Size(71, 71),
		origin: new google.maps.Point(0, 0),
		anchor: new google.maps.Point(17, 34),
		scaledSize: new google.maps.Size(25, 25),
	    };
	    
	    // Create a marker for each place.
	    markers.push(
		new google.maps.Marker({
		    map,
		    icon,
		    title: place.name,
		    position: place.geometry.location,
		})
	    );

	    if (place.geometry.viewport) {
		// Only geocodes have viewport.
		bounds.union(place.geometry.viewport);
	    } else {
		bounds.extend(place.geometry.location);
	    }
	});
	map.fitBounds(bounds);
    });
    // [END maps_places_searchbox_getplaces]
}

function calculate_balistic(height: number) {
    let i : number
    let previous_balistic : number = balistic_map[0]['balistic']

    for (let balistic of balistic_map) {
	if (balistic["height"] <= height) return balistic["balistic"]
    }
    return 0;
}

let geographyCircle: google.maps.Circle | null = null;
let hardFenceCircle: google.maps.Circle | null = null;
let groundRiskBufferCircle: google.maps.Circle | null = null;
function addCircle(location: google.maps.LatLngLiteral, map: google.maps.Map) {
    let wind : number
    let height : number
    let geographyVolume : number

    wind = Number($("#inputMaxWind").val())
    height = Number($("#inputMaxHeight").val())
    geographyVolume = Number($("#inputGeographyVolume").val())

    let vm = 17.7 + wind / 3.6

    let geographyVolumeRadius : number = geographyVolume / 2
    let hardFenceRadius : number = 5
    let balistic = calculate_balistic(height)
    let groundRiskBufferRadius = 3 * vm + balistic 

    console.log("----");
    console.log("Vitesse max: ", vm)
    console.log("Geography volume radius : ", geographyVolumeRadius)
    console.log("HardFence radius : ", hardFenceRadius)
    console.log("balistic :", balistic)
    console.log("Ground Risk Buffer radius : ", groundRiskBufferRadius)
    console.log("Total radius : ", geographyVolumeRadius
		+ hardFenceRadius
		+ groundRiskBufferRadius)
    
    if (geographyCircle !== null) geographyCircle.setMap(null)
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
