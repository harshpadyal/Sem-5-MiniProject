import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Button, Grid, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { format } from 'date-fns';
import { NavLink, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { handleError, handleSuccess } from '../utils';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './MyAppointments.css';

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [displayedAppointments, setDisplayedAppointments] = useState([]);
  const [appointmentType, setAppointmentType] = useState('upcoming');

  useEffect(() => {
    const loggedInEmail = localStorage.getItem('loggedInEmail');

    // Fetching appointments from MongoDB
    axios
      .get(`http://localhost:3000/appointments?email=${loggedInEmail}`) // Adjusted URL
      .then((response) => {
        const fetchedAppointments = response.data;
        setAppointments(fetchedAppointments); // Store all appointments
        filterAppointments(fetchedAppointments, appointmentType); // Set displayed appointments based on the default type
      })
      .catch((error) => {
        console.error('Error fetching appointments:', error);
      });
  }, []);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('loggedInEmail');
    handleSuccess('User Logged out');
    setTimeout(() => {
      navigate('/home');
    }, 2000);
  };

  const handleToggle = (event, newType) => {
    setAppointmentType(newType);
    filterAppointments(appointments, newType);
  };

  const filterAppointments = (appointments, type) => {
    const currentDateTime = new Date();
    const filteredAppointments = type === 'upcoming'
      ? appointments.filter((appointment) => new Date(appointment.a_date) > currentDateTime)
      : appointments.filter((appointment) => new Date(appointment.a_date) <= currentDateTime);

    setDisplayedAppointments(filteredAppointments);
  };

  const handleCancelAppointment = (id) => {
    // Handle appointment cancellation here (add the API call)
  };

  const handleRescheduleAppointment = (id) => {
    // Handle appointment rescheduling here (add the API call)
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Confirmed':
        return '✔️';
      case 'Pending':
        return '⏳';
      case 'Cancelled':
        return '❌';
      default:
        return '';
    }
  };

  return (
    <>
      <Navbar handleLogout={handleLogout} />
      <div className="my-appointments" style={{ padding: '20px', backgroundColor: '#fce4ec' }}>
        <div className="markogin">
          <Typography variant="h4" align="center" gutterBottom style={{ color: '#57111B' }}>
            My Appointments
          </Typography>

          <ToggleButtonGroup
            value={appointmentType}
            exclusive
            onChange={handleToggle}
            aria-label="appointment type"
            style={{ marginBottom: '20px' }}
          >
            <ToggleButton value="upcoming" style={{ color: '#e91e63', borderColor: '#e91e63' }}>
              Upcoming
            </ToggleButton>
            <ToggleButton value="previous" style={{ color: '#e91e63', borderColor: '#e91e63' }}>
              Previous
            </ToggleButton>
          </ToggleButtonGroup>

          {displayedAppointments.length === 0 ? (
            <Typography
              variant="h6"
              align="center"
              style={{ color: '#57111B', marginBottom: '20px' }}
            >
              You don't have any appointments yet!
              <br />
              <Button
                variant="contained"
                color="secondary"
                component={NavLink}
                to="/appointment"
                startIcon={<span style={{ fontSize: '1.5rem' }}>💇‍♀️</span>}
                style={{
                  backgroundColor: '#e91e63',
                  color: '#fff',
                  padding: '10px 20px',
                  borderRadius: '25px',
                  fontSize: '16px',
                  marginTop: '10px',
                  boxShadow: '0px 4px 10px rgba(233, 30, 99, 0.5)',
                  textTransform: 'none',
                }}
              >
                Book Your First Appointment
              </Button>
            </Typography>
          ) : (
            <Grid container spacing={3}>
              {displayedAppointments.map((appointment) => (
                <Grid item xs={12} md={6} key={appointment._id}>
                  <Card style={{ border: '2px solid #e91e63', margin: '10px', backgroundColor: '#fff' }}>
                    <CardContent>
                      <Typography variant="h5" gutterBottom style={{ color: '#57111B' }}>
                        💈 {appointment.a_service}
                      </Typography>
                      <Typography variant="body1" color="textSecondary" style={{ color: '#57111B' }}>
                        Outlet Location: {appointment.a_outlet}
                      </Typography>
                      <Typography variant="body2" gutterBottom style={{ color: '#57111B' }}>
                        📞 {appointment.a_phone || '18001234567'}
                      </Typography>
                      <Typography variant="body2" gutterBottom style={{ color: '#57111B' }}>
                        📅 {format(new Date(appointment.a_date), 'yyyy-MM-dd')} at {appointment.a_timeslot}
                      </Typography>
                      <Typography variant="body2" gutterBottom style={{ color: '#57111B' }}>
                        ✨ Special Request: {appointment.a_specialrequest || 'None'}
                      </Typography>
                    </CardContent>
                    <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between' }}>
                      <Button
                        variant="contained"
                        style={{ backgroundColor: '#e91e63', color: '#fff' }}
                        onClick={() => handleCancelAppointment(appointment._id)}
                        disabled={appointment.status === 'Cancelled'}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="contained"
                        style={{ backgroundColor: '#57111B', color: '#fff' }}
                        onClick={() => handleRescheduleAppointment(appointment._id)}
                      >
                        Reschedule
                      </Button>
                    </div>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MyAppointments;
