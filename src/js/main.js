$(document).ready(function () {
  console.log("working");
  let map;
  let autocomplete;
  let geocoder;
  const markers = []; // Array to store all markers

  function initMap() {
    // Initialize the map
    const location = { lat: 37.7749, lng: -122.4194 }; // Example: San Francisco
    map = new google.maps.Map(document.getElementById("map"), {
      zoom: 12,
      center: location,
    });

    // Initialize geocoder
    geocoder = new google.maps.Geocoder();

    // Initialize autocomplete for the input field
    const input = document.getElementById("input-address");
    autocomplete = new google.maps.places.Autocomplete(input, {
      types: ["geocode"], // Suggest only geocoded addresses
    });

    // When an address is selected, auto-populate the form
    autocomplete.addListener("place_changed", handlePlaceSelect);

    // Add a click listener to the map
    map.addListener("click", (e) => {
      handleMapClick(e.latLng);
    });
  }

  // Handle place selection from autocomplete
  function handlePlaceSelect() {
    const place = autocomplete.getPlace();

    if (!place.geometry || !place.address_components) {
      showPopup("No details available for the selected location.");
      return;
    }

    populateForm(place.address_components, place.formatted_address);
  }

  // Handle map click event
  function handleMapClick(latLng) {
    geocoder.geocode({ location: latLng }, (results, status) => {
      if (status === "OK" && results[0]) {
        // Populate the form with the clicked location's address
        populateForm(
          results[0].address_components,
          results[0].formatted_address
        );

        // Center the map on the clicked location
        map.setCenter(latLng);

        // Show the form
        document.getElementById("address-form").style.display = "block";
      } else {
        showPopup("No address found for the selected location.");
      }
    });
  }

  // Populate the form fields with address components
  function populateForm(components, formattedAddress) {
    let addressLine1 = "";
    let addressLine2 = "";
    let city = "";
    let state = "";
    let country = "";
    let postalCode = "";

    components.forEach((component) => {
      if (component.types.includes("street_number")) {
        addressLine1 += component.long_name + " ";
      }
      if (component.types.includes("route")) {
        addressLine1 += component.long_name;
      }
      if (
        component.types.includes("sublocality") ||
        component.types.includes("neighborhood")
      ) {
        addressLine2 = component.long_name;
      }
      if (component.types.includes("locality")) {
        city = component.long_name;
      }
      if (component.types.includes("administrative_area_level_1")) {
        state = component.long_name;
      }
      if (component.types.includes("country")) {
        country = component.long_name;
      }
      if (component.types.includes("postal_code")) {
        postalCode = component.long_name;
      }
    });

    document.getElementById("input-address").value = formattedAddress;
    document.getElementById("line1").value = addressLine1;
    document.getElementById("line2").value = addressLine2;
    document.getElementById("city").value = city;
    document.getElementById("state").value = state;
    document.getElementById("country").value = country;
    document.getElementById("pincode").value = postalCode;
  }

  // Clear the form fields
  function clearForm() {
    document.getElementById("input-address").value = "";
    document.getElementById("line1").value = "";
    document.getElementById("line2").value = "";
    document.getElementById("city").value = "";
    document.getElementById("state").value = "";
    document.getElementById("country").value = "";
    document.getElementById("pincode").value = "";
  }

  // Add a marker to the map
  function addMarker(latLng, title) {
    const marker = new google.maps.Marker({
      position: latLng,
      map: map,
      title: title,
    });
    markers.push(marker); // Store marker in the array
  }

  // Show a pop-up notification
  function showPopup(message) {
    const popup = document.getElementById("popup");
    popup.textContent = message;
    popup.style.display = "block";
    setTimeout(() => {
      popup.style.display = "none";
    }, 3000); // Hide after 3 seconds
  }

  // Handle "Add Location" Button
  document
    .getElementById("add-location-btn")
    .addEventListener("click", function () {
      clearForm();
      document.getElementById("address-form").style.display = "block";
    });

  // Handle Close Button
  document.getElementById("close-btn").addEventListener("click", function () {
    clearForm();
    document.getElementById("address-form").style.display = "none";
  });

  // Handle Submit Button
  document
    .getElementById("submit-form-btn")
    .addEventListener("click", function () {
      const address = document.getElementById("input-address").value;
      if (!address) {
        showPopup("Please enter or select an address.");
        return;
      }

      // Geocode the address to get coordinates
      geocoder.geocode({ address: address }, (results, status) => {
        if (status === "OK") {
          const location = results[0].geometry.location;

          // Add marker for the submitted location
          addMarker(location, "New Location");

          // Center the map on the submitted location
          map.setCenter(location);

          showPopup("Location added successfully!");
          clearForm();
          document.getElementById("address-form").style.display = "none";
        } else {
          showPopup("Failed to add location: " + status);
        }
      });
    });

  // alert("main.js running...")
  ZOHO.CREATOR.init().then(function () {
    var queryParams = ZOHO.CREATOR.UTIL.getQueryParams();
    console.log(queryParams);

    var config = {
      reportName: "All_Guest_Profiles",
      criteria: '(Email == "' + queryParams.loginUser + '")',
      page: 1,
      pageSize: 10,
    };

    ZOHO.CREATOR.API.getAllRecords(config).then(function (response) {
      var recordArr = response.data;
      console.log(recordArr);
      for (var index in recordArr) {
        console.log(recordArr[index]);
      }
    });
  });
});
