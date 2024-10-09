import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './AppointmentForm.css';

const AppointmentForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    date: '',
    location: '',
    notes: '',
    service: '',
  });

  const [useCurrentLocation, setUseCurrentLocation] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const loggedInEmail = localStorage.getItem('loggedInEmail');
    if (loggedInEmail) {
      setFormData((prevData) => ({ ...prevData, email: loggedInEmail }));
    }

    const stateService = location.state?.selectedService;
    const queryParams = new URLSearchParams(location.search);
    const queryService = queryParams.get('service');
    const selectedService = stateService || queryService;

    if (selectedService) {
      setFormData((prevData) => ({ ...prevData, service: selectedService }));
    }
  }, [location]);

  const autoFillLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=pk.eyJ1Ijoidml2ZWtndXB0YTEwMzMiLCJhIjoiY20yMDJzbXdrMGJhdDJrcjJlYzN0YTNhdiJ9.9IfHEEBsauzfeLV5-wR60g`
          );
          const data = await response.json();
          if (data.features && data.features.length > 0) {
            const address = data.features[0].place_name;
            setFormData((prevData) => ({ ...prevData, location: address }));
          } else {
            toast.error('Unable to fetch address.');
          }
        } catch (error) {
          toast.error('Failed to fetch location.');
        }
      }, (error) => {
        toast.error(`Geolocation permission denied: ${error.message}`);
      });
    } else {
      toast.error('Geolocation is not supported by this browser.');
    }
  };

  useEffect(() => {
    if (useCurrentLocation) {
      autoFillLocation();
    }
  }, [useCurrentLocation]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.date || !formData.service) {
      return toast.error('Please fill in all required fields!');
    }

    try {
      const localEmail = localStorage.getItem('loggedInEmail');
      if (!localEmail) {
        return toast.error('Local email not found. Please Login or Signup.');
      }

      const response = await fetch('http://localhost:3000/appointments/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          a_name: formData.name,
          a_email: formData.email,
          a_date: formData.date,
          a_outlet: formData.location,
          a_specialrequest: formData.notes,
          service: formData.service,
          local_email: localEmail,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong!');
      }

      toast.success('Appointment booked successfully!');
      setFormData({
        name: '',
        email: localEmail,
        date: '',
        location: '',
        notes: '',
        service: '',
      });
    } catch (error) {
      toast.error(error.message || 'Failed to book appointment');
    }
  };

  return (
    <>
      <Navbar />
      <div className="appointment-page-wrapper">
        <div className="appointment-form-container">
          <h2 className="appointment-form-heading">Fill your details</h2>
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
                  placeholder="Enter or Auto-fill Location"
                  className="appointment-form-input"
                  required
                />
              </div>
              <div className="appointment-form-group">
                <label htmlFor="date" className="appointment-form-label">Appointment Date*</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="appointment-form-input"
                  min={new Date().toISOString().split('T')[0]} // Restrict past dates
                  required
                />
              </div>
            </div>

            <div className="appointment-form-row">
              <div className="appointment-form-group">
                <label htmlFor="service" className="appointment-form-label">Select Service*</label>
                <select
                  id="service"
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  className="appointment-form-select"
                  required
                >
                  <option value="">Choose service</option>
                  <option value="Basic Car Service">Basic Car Service</option>
                  <option value="Car Inspection">Car Inspection</option>
                  <option value="Used Car Inspection">Used Car Inspection</option>
                  <option value="Car Wash">Car Wash</option>
                  <option value="AC Repair">AC Repair</option>
                  <option value="Windshields & Lights">Windshields & Lights</option>
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

            <div className="appointment-form-row">
              <div className="appointment-form-group">
                <label htmlFor="useCurrentLocation" className="appointment-form-label">Use Current Location?</label>
                <input
                  type="checkbox"
                  id="useCurrentLocation"
                  name="useCurrentLocation"
                  checked={useCurrentLocation}
                  onChange={(e) => setUseCurrentLocation(e.target.checked)}
                />
              </div>
            </div>

            <button type="submit" className="appointment-submit-button">Book Appointment</button>
          </form>
        </div>
      </div>
      <Footer />
      <ToastContainer style={{ zIndex: 99999 }} />
    </>
  );
};

export default AppointmentForm;
