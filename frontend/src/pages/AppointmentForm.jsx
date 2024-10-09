import React, { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { handleError, handleSuccess } from '../utils';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './AppointmentForm.css';

const AppointmentForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    vehicle: '',
    location: '',
    notes: '',
  });
  
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Fetch email from local storage when the component mounts
  useEffect(() => {
    const loggedInEmail = localStorage.getItem('loggedInEmail');
    if (loggedInEmail) {
      setFormData((prevData) => ({ ...prevData, email: loggedInEmail }));
    }
  }, []);

  // Function to handle geolocation and autofill location input using Mapbox API
  const autoFillLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Reverse Geocode the latitude and longitude to get an address using Mapbox API
          const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=pk.eyJ1Ijoidml2ZWtndXB0YTEwMzMiLCJhIjoiY20yMDJzbXdrMGJhdDJrcjJlYzN0YTNhdiJ9.9IfHEEBsauzfeLV5-wR60g`);
          const data = await response.json();

          if (data.features && data.features.length > 0) {
            const address = data.features[0].place_name;
            setFormData((prevData) => ({ ...prevData, location: address }));
          } else {
            handleError('Unable to fetch address.');
          }
        } catch (error) {
          handleError('Failed to fetch location.');
        }
      }, () => {
        handleError('Geolocation permission denied.');
      });
    } else {
      handleError('Geolocation is not supported by this browser.');
    }
  };

  useEffect(() => {
    autoFillLocation(); // Auto-fill location on component mount
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.vehicle) {
      return handleError('Name, Email, and vehicle are required!');
    }

    try {
      const localEmail = localStorage.getItem('loggedInEmail');
      if (!localEmail) {
        return handleError('Local email not found. Please Login or Signup.');
      }

      const url = `http://localhost:3000/appointments/book`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          a_name: formData.name,
          a_email: formData.email,
          a_vehicle: formData.vehicle,
          a_outlet: formData.location,
          a_specialrequest: formData.notes,
          local_email: localEmail,
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong!');
      }

      handleSuccess('Appointment booked successfully!');
      setFormData({
        name: '',
        email: localEmail,
        vehicle: '',
        location: '',
        notes: '',
      });
    } catch (error) {
      console.error('Error booking appointment:', error.message);
      handleError(error.message || 'Failed to book appointment');
    }
  };

  return (
    <>
      <Navbar />
      <div className="appointment-page-wrapper">
        <div className="appointment-form-container">
          <h2 className="appointment-form-heading">Urgent Appointment</h2>
          <form className="appointment-appointment-form" onSubmit={handleSubmit}>
            <div className="appointment-form-row">
              <div className="appointment-form-group">
                <label htmlFor="name" className="appointment-form-label">Full Name*</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="appointment-form-input"
                  required
                />
              </div>
              <div className="appointment-form-group">
                <label htmlFor="email" className="appointment-form-label">Email Address*</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your email address"
                  className="appointment-form-input"
                  readOnly
                  required
                />
              </div>
            </div>

            <div className="appointment-form-row">
              <div className="appointment-form-group">
                <label htmlFor="location" className="appointment-form-label">Location*</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Location will be auto-filled"
                  className="appointment-form-input"
                  required
                />
              </div>
              <div className="appointment-form-group">
                <label htmlFor="vehicle" className="appointment-form-label">Select Vehicle*</label>
                <select
                  id="vehicle"
                  name="vehicle"
                  value={formData.vehicle}
                  onChange={handleChange}
                  className="appointment-form-select"
                  required
                >
                  <option value="">Choose type</option>
                  <option value="Two Wheeler">Two Wheeler</option>
                  <option value="Three Wheeler">Three Wheeler</option>
                  <option value="Four Wheeler">Four Wheeler</option>
                </select>
              </div>
            </div>

            <div className="appointment-form-row">
              <div className="appointment-form-group">
                <label htmlFor="notes" className="appointment-form-label">Describe here*</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Query"
                  className="appointment-form-textarea"
                />
              </div>
            </div>

            <button type="submit" className="appointment-submit-button">Book Appointment</button>
            {message && <p className="appointment-success-message">{message}</p>}
          </form>
        </div>
      </div>
      <Footer />
      <ToastContainer style={{ zIndex: 99999 }} />
    </>
  );
};

export default AppointmentForm;
