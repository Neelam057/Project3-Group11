
// Color of the marker based on Enhanced Fujita Scale (EF Scale)
function chooseColor(mag) {
  let color = "";

  // Map EF scale to colors
  if (mag === 5) {
    color = "darkpurple";  // EF5 (Violently Strong)
  } else if (mag === 4) {
    color = "darkred";      // EF4 (Violent)
  } else if (mag === 3) {
    color = "red";          // EF3 (Strong)
  } else if (mag === 2) {
    color = "orange";       // EF2 (Significant)
  } else if (mag === 1) {
    color = "yellow";       // EF1 (Moderate)
  } else if (mag === 0) {
    color = "green";   // EF0 (Weak)
  } else {
    color = "gray";         // Default for missing EF scale value
  }

  return color;
}

// Trigger initial data load on page load
window.onload = function() {
  handleMapUpdate();  // Initialize the map with the current data
};

// Event listener for the filter button
d3.select("#filter-btn").on("click", handleMapUpdate);  // Apply filter and update map when clicked

// Function to handle data fetching, filtering, and updating the map
function handleMapUpdate() {
  const yearInput = d3.select("#year-filter").property("value");
  const yearInputNumber = yearInput ? Number(yearInput) : null; // Default to null if no year selected// Default year if empty
  const magnitudeInput = d3.select("#magnitude-filter").property("value") || "";  // Default state if empty

  // Fetch and process map data
  d3.json("/api/v1.0/map").then(function (data) {
      // Filter data based on the year and magnitude input
      const filteredData = filterDataForMap(data, yearInputNumber, magnitudeInput);

      // Create the map with the filtered data
      createMap(filteredData);
  }).catch(function (error) {
      console.error("Error fetching data:", error);
  });
}

// Centralized filter function to handle both year and magnitude filters
function filterDataForMap(data, yearInputNumber, magnitudeInput = "") {
  return data.filter(row => {
      const yearMatch = yearInputNumber ? row.year === yearInputNumber : true; // Show all data if no year filter
      const magnitudeMatch = magnitudeInput ? row.tornado_magnitude == magnitudeInput : true; // Filter by magnitude if specified
      return yearMatch && magnitudeMatch;
  });
}

// Modified createMap function to accept filtered data
// Declare map globally to track it
let myMap;

function createMap(filteredData) {
  // Step 1: REMOVE OLD MAP INSTANCE
  if (myMap) {
    myMap.remove();  // Clears the old map
  }

  // Step 2: RECREATE THE MAP CONTAINER
  let map_container = d3.select("#map_container");
  map_container.html("");  // Clears previous map data
  map_container.append("div").attr("id", "map");  // Recreates the div for the new map

  // Step 3: CREATE BASE LAYERS
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  // Initialize the Cluster Group & Heatmap Data
  let heatArray = [];
  let markers = L.markerClusterGroup();

  // Loop and create marker for each tornado data entry
  filteredData.forEach(row => {
      let popupContent = `<div style="font-size:12px; line-height:1.2em; padding:5px;">
                            <strong>Lat:</strong> ${row.start_latitude}<br>
                            <strong>Lng:</strong> ${row.start_longitude}<br>
                            <strong>Year:</strong> ${row.year}<br>
                            <strong>Magnitude:</strong> ${row.tornado_magnitude}<br>
                            <strong>State:</strong> ${row.state}
                          </div>`;

      let marker_style = L.ExtraMarkers.icon({
        icon: "ion-android-sync",
        iconColor: "white",
        markerColor: chooseColor(row.tornado_magnitude),
        shape: "circle"
      });

      let marker = L.marker([row.start_latitude, row.start_longitude], { icon: marker_style })
        .bindPopup(popupContent, { maxWidth: 200, minWidth: 100 });

      markers.addLayer(marker);
      heatArray.push([row.start_latitude, row.start_longitude]);
  });

  // Create Heatmap Layer
  let heatLayer = L.heatLayer(heatArray, {
      radius: 25,
      blur: 10
  });

  // Step 4: CREATE THE LAYER CONTROL
  let baseMaps = {
    "Street": street,
    "Topography": topo
  };

  let overlayMaps = {
    "HeatMap": heatLayer,
    "Markers": markers
  };

  // Step 5: INITIALIZE THE MAP
  myMap = L.map("map", {
      center: [37.964, -91.832],  // Centering on the US
      zoom: 4,
      layers: [street, markers]  // Default layers
  });

  // Step 6: Add Layer Control
  L.control.layers(baseMaps, overlayMaps).addTo(myMap);
}
