
// Global variable for the map
let map;

// Arrays for booked taxis and completed trips (initially declared)
let taxis = [];
let trips = [];

// Function to initialize the map
function initMap() {
    const mapOptions = {
        center: { lat: 40.7128, lng: -74.0060 }, // Example coordinates (New York City)
        zoom: 12
    };

    // Creating the map in the div with id "map"
    map = new google.maps.Map(document.getElementById("map"), mapOptions);
}

// Function to display the list of booked taxis on the page
function displayTaxis() {
    const taxiList = document.getElementById('booked-taxi-list');
    taxiList.innerHTML = '';
    const bookedTaxis = taxis.filter(taxi => taxi.status === 'booked');
    bookedTaxis.forEach(taxi => {
        const li = document.createElement('li');
        li.textContent = `Model: ${taxi.model} | Pickup: ${taxi.pickup} | Destination: ${taxi.destination} | Wait Time: ${taxi.waitTime} | Estimated Price: ${taxi.estimatedPrice}`;
        taxiList.appendChild(li);
    });
}

// Function to display the list of completed trips on the page
function displayTrips() {
    const tripHistory = document.getElementById('completed-trip-list');
    tripHistory.innerHTML = '';
    trips.forEach(trip => {
        const li = document.createElement('li');
        li.textContent = `From ${trip.pickup} to ${trip.destination} | Driver: ${trip.driver} | Rating: ${trip.rating}`;
        tripHistory.appendChild(li);
    });
}

// Function to initialize the display when the page loads
document.addEventListener('DOMContentLoaded', function() {
    loadDataFromLocalStorage(); // Load data from localStorage
    displayTaxis(); // Display the list of booked taxis
    displayTrips(); // Display the list of completed trips
    initMap(); // Initialize the map on the page (if necessary)
});

// Event listener for the taxi booking form submission
document.getElementById('booking-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const pickupLocation = document.getElementById('pickup').value;
    const destination = document.getElementById('destination').value;
    
    // Simple alert to show the booking submission
    alert(`Taxi booked from ${pickupLocation} to ${destination}`);
    
    // Create a new driver for the new trip
    const newDriver = `Driver ${trips.length + 1}`;
    
    // Create a new trip object to add to the trips array
    const newTrip = {
        id: trips.length + 1,
        pickup: pickupLocation,
        destination: destination,
        driver: newDriver,
        rating: 0 // Initialize rating as 0 (not rated yet)
    };
    
    // Add the new trip to the trips array
    trips.push(newTrip);
    
    // Create a new booked taxi to add to the taxis array
    const newTaxi = {
        id: taxis.length + 1,
        model: 'New Taxi Model',
        waitTime: '5 minutes',
        estimatedPrice: '$15',
        pickup: pickupLocation,
        destination: destination,
        status: 'booked'
    };
    
    // Add the new booked taxi to the taxis array
    taxis.push(newTaxi);
    
    // Update the list of booked taxis and completed trips on the page
    displayTaxis();
    displayTrips();
    saveDataToLocalStorage(); // Save data to localStorage
});


// Event listener for the driver rating form submission
document.getElementById('driver-rating-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const driverName = document.getElementById('driver-name').value;
    const ratingInput = document.getElementById('driver-rating').value;

    // Check and convert the rating value to an integer
    const rating = parseFloat(ratingInput); // Use parseFloat instead of parseInt

    // Debugging messages to check input values
    console.log('Driver Name:', driverName);
    console.log('Rating Input:', ratingInput);
    console.log('Parsed Rating:', rating);

    // Check if the rating is valid (between 1 and 5)
    if (isNaN(rating) || rating < 1 || rating > 5) {
        alert('Please enter a valid rating between 1 and 5.');
        return;
    }
    
    // Find the trip for the given driver and update the rating if found
    const trip = trips.find(trip => trip.driver === driverName);
    if (trip) {
        trip.rating = rating;
        displayTrips(); // Update the list of completed trips on the page
        alert(`Rating ${rating} submitted for driver ${driverName}`);
        saveDataToLocalStorage(); // Save data to localStorage
    } else {
        alert(`No trip found for driver ${driverName}`);
    }
    
    // Clear the input fields after submission (optional)
    document.getElementById('driver-name').value = '';
    document.getElementById('driver-rating').value = '';
});

// Function to save data to localStorage
function saveDataToLocalStorage() {
    localStorage.setItem('taxis', JSON.stringify(taxis));
    localStorage.setItem('trips', JSON.stringify(trips));
}

// Function to load data from localStorage
function loadDataFromLocalStorage() {
    const storedTaxis = localStorage.getItem('taxis');
    if (storedTaxis) {
        taxis = JSON.parse(storedTaxis);
    }

    const storedTrips = localStorage.getItem('trips');
    if (storedTrips) {
        trips = JSON.parse(storedTrips);
    }
}

// Function to filter taxis based on the user's location and desired destination
function filterTaxis() {
    const userLocation = document.getElementById('user-location').value;
    const destination = document.getElementById('destination').value;

    // Filter taxis based on the user's location and desired destination
    const filteredTaxis = taxis.filter(taxi =>
        taxi.pickup === userLocation &&
        taxi.destination.toLowerCase().includes(destination.toLowerCase())
    );

    displayFilteredTaxis(filteredTaxis);
}

// Function to display the filtered taxis on the page
function displayFilteredTaxis(taxis) {
    const taxiList = document.getElementById('available-taxi-list');
    taxiList.innerHTML = '';

    taxis.forEach(taxi => {
        const li = document.createElement('li');
        li.textContent = `Model: ${taxi.model} | Waiting Time: ${taxi.waitTime} | Estimated Price: ${taxi.estimatedPrice}`;
        taxiList.appendChild(li);
    });
}