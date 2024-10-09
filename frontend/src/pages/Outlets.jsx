import React, { useState, useEffect, useRef } from 'react';
import './Outlets.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = 'pk.eyJ1Ijoidml2ZWtndXB0YTEwMzMiLCJhIjoiY20yMDJzbXdrMGJhdDJrcjJlYzN0YTNhdiJ9.9IfHEEBsauzfeLV5-wR60g';
const RAZORPAY_KEY = 'rzp_test_SinyVSRmoadKZ3'; // Your RazorpayX key

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
  const garageRefs = useRef([]);
  const [paymentSuccess, setPaymentSuccess] = useState(false); // State to manage payment success message

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

  // Handle emergency assistance request
  const handleEmergencyAssistance = async () => {
    const options = {
      key: RAZORPAY_KEY, // Your Razorpay Key
      amount: 50000, // Amount in paise (50000 paise = ₹500)
      currency: 'INR',
      name: 'Emergency Car Assistance',
      description: 'Requesting emergency car assistance.',
      handler: (response) => {
        console.log(response); // Log the response for debugging
        if (response.razorpay_payment_id) {
          alert('Payment successful! Mechanic has been assigned.');
          setPaymentSuccess(true); // Update state for successful payment
        } else {
          alert('Payment failed or was not completed.');
        }
      },
      prefill: {
        name: 'Customer Name',
        email: 'customer@example.com',
        contact: '9999999999',
      },
      theme: {
        color: '#F37254',
      },
    };

    const paymentObject = new window.Razorpay(options);
    
    paymentObject.on('error', (error) => {
      console.error('Payment error:', error);
      alert('An error occurred during payment processing.');
    });

    paymentObject.open();
  };

  // Scroll to garage card when marker is clicked
  const handleMarkerClick = (garage) => {
    setSelectedGarage(garage);
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
      zoom: 15,
    }));
    setSelectedGarage(garage);
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
                ref={(el) => (garageRefs.current[index] = el)}
                onClick={() => handleCardClick(garage)}
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
            {currentLocation && (
              <Marker latitude={currentLocation.lat} longitude={currentLocation.lng}>
                <img
                  src=".\images\red marker 2.png"
                  alt="Current Location"
                  style={{ height: '30px', width: '30px' }}
                />
              </Marker>
            )}

            {garages.map((garage) => (
              <Marker key={garage.id} latitude={garage.lat} longitude={garage.lng}>
                <img
                  src="https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png"
                  alt={garage.name}
                  style={{ height: '30px', width: '30px', cursor: 'pointer' }}
                  onClick={() => handleMarkerClick(garage)}
                />
              </Marker>
            ))}

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

      {/* Emergency Car Assistance Button */}
      <div className="emergency-button-container">
        <button className="emergency-button" onClick={handleEmergencyAssistance}>
          Emergency Car Assistance
        </button>
      </div>

      {/* Payment Success Message */}
      {paymentSuccess && <div className="payment-success-message">Payment confirmed! Mechanic has been assigned.</div>}

      <Footer />
    </main>
  );
};

export default Outlets;
