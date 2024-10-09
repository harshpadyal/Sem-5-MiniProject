import React, { useState, useEffect, useRef } from 'react';
import './Outlets.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = 'pk.eyJ1Ijoidml2ZWtndXB0YTEwMzMiLCJhIjoiY20yMDJzbXdrMGJhdDJrcjJlYzN0YTNhdiJ9.9IfHEEBsauzfeLV5-wR60g';

const Outlets = () => {
  const [viewport, setViewport] = useState({
    latitude: 19.076,
    longitude: 72.8777,
    zoom: 14,
    width: '100%',
    height: '600px',
  });

  const [currentLocation, setCurrentLocation] = useState(null);
  const [garages, setGarages] = useState([]);
  const [selectedGarage, setSelectedGarage] = useState(null);
  const garageRefs = useRef([]); // To hold references to the garage cards

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
          setViewport((prev) => ({ ...prev, latitude, longitude }));
          fetchNearbyGarages(latitude, longitude);
        },
        (error) => {
          console.error('Error fetching location:', error.message);
        }
      );
    }
  }, []);

  // Fetch nearby garages using Mapbox Places API
  const fetchNearbyGarages = (lat, lng) => {
    const placesUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/car%20repair.json?proximity=${lng},${lat}&access_token=${MAPBOX_TOKEN}&types=poi&limit=10`;

    fetch(placesUrl)
      .then((response) => response.json())
      .then((data) => {
        const garagesData = data.features.map((place) => ({
          id: place.id,
          name: place.text,
          address: place.place_name,
          lat: place.geometry.coordinates[1],
          lng: place.geometry.coordinates[0],
        }));
        setGarages(garagesData);
      })
      .catch((error) => {
        console.error('Error fetching nearby garages:', error);
      });
  };

  // Scroll to garage card when marker is clicked
  const handleMarkerClick = (garage) => {
    setSelectedGarage(garage);

    // Scroll to the selected garage card
    const selectedGarageIndex = garages.findIndex((g) => g.id === garage.id);
    if (selectedGarageIndex !== -1 && garageRefs.current[selectedGarageIndex]) {
      garageRefs.current[selectedGarageIndex].scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Move map to marker when a garage card is clicked
  const handleCardClick = (garage) => {
    setViewport((prev) => ({
      ...prev,
      latitude: garage.lat,
      longitude: garage.lng,
      zoom: 15, // Zoom in when a garage is selected
    }));
    setSelectedGarage(garage); // Highlight the garage marker
  };

  return (
    <main>
      <Navbar />
      <h1>Nearby Garages</h1>

      <div className="outlet-container">
        {/* 1/3 List of Garages */}
        <div className="garage-list">
          <h2>Garage List</h2>
          <div className="stores-list">
            {garages.map((garage, index) => (
              <div
                className={`store-card ${selectedGarage && selectedGarage.id === garage.id ? 'highlight' : ''}`}
                key={garage.id}
                ref={(el) => (garageRefs.current[index] = el)} // Assign refs to each card
                onClick={() => handleCardClick(garage)} // Handle card click to focus map
              >
                <div className="store-header">
                  <h3>{garage.name}</h3>
                </div>
                <div className="store-info">
                  <h4>Address:</h4>
                  <p>{garage.address}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2/3 Map Section */}
        <div className="outletmap">
          <ReactMapGL
            {...viewport}
            mapboxAccessToken={MAPBOX_TOKEN}
            onMove={(evt) => setViewport(evt.viewState)}
            mapStyle="mapbox://styles/mapbox/streets-v11"
            scrollZoom={true}
            doubleClickZoom={true}
            dragPan={true}
          >
            {/* Current location marker with red marker */}
            {currentLocation && (
              <Marker latitude={currentLocation.lat} longitude={currentLocation.lng}>
                <img
                  src=".\images\redMarker.jpg" // Path to your red marker image
                  alt="Current Location"
                  style={{ height: '30px', width: '30px' }}
                />
              </Marker>
            )}

            {/* Garage markers */}
            {garages.map((garage) => (
              <Marker key={garage.id} latitude={garage.lat} longitude={garage.lng}>
                <img
                  src="https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png"
                  alt={garage.name}
                  style={{ height: '30px', width: '30px', cursor: 'pointer' }}
                  onClick={() => handleMarkerClick(garage)} // Handle marker click to show corresponding garage card
                />
              </Marker>
            ))}

            {/* Popup for selected garage */}
            {selectedGarage && (
              <Popup
                latitude={selectedGarage.lat}
                longitude={selectedGarage.lng}
                onClose={() => setSelectedGarage(null)}
              >
                <div>
                  <h3>{selectedGarage.name}</h3>
                  <p>{selectedGarage.address}</p>
                </div>
              </Popup>
            )}
          </ReactMapGL>
        </div>
      </div>

      <Footer />
    </main>
  );
};

export default Outlets;
