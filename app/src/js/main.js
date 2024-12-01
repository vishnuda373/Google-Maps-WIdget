import config from "./config.js";

// Function to initialize the map
function initMap() {
    const mapElement = document.getElementById("map");

    // Validate map container
    if (!mapElement) {
        console.error("Map container not found!");
        return;
    }

    // Initialize the map
    const map = new google.maps.Map(mapElement, {
        center: config.defaultLocation,
        zoom: config.defaultZoom,
    });

    // Add a marker to the map
    new google.maps.Marker({
        position: config.defaultLocation,
        map: map,
        title: "Default Location",
    });
}

// Dynamically load the Google Maps script with the API key
function loadGoogleMapsScript() {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${config.googleMapsApiKey}&callback=initMap`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
}

// Load the Google Maps script when the page loads
window.onload = loadGoogleMapsScript;
