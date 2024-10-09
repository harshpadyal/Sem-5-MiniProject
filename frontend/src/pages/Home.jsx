import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../utils';
import { ToastContainer } from 'react-toastify';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import "./Home.css"
import { NavLink } from "react-router-dom";
import img from '../assets/icon.png';
import tyreForCard from '../assets/tyreForCard.jpg'
import Battery from '../assets/Battery.jpg'
import brake from '../assets/brake.jpg'



import mechanic from '../assets/mechanic.jpg';
import carCrash from '../assets/carCrash.png';

const ImageCarousel = () => {
    const slides = [
      {
        image: carCrash,
        title: 'Technix',
        subtitle: 'Welcome to',
        description:
           "Welcome to Technix! We provide fast, reliable roadside car repair services by connecting you with skilled mechanics, anytime and anywhere. Get back on the road with ease, no matter where you are!",
        buttonText: 'Book Appointment',
        link: '/appointment',  // Navigation link for this slide
      },
      {
        image: mechanic,
        title: 'Technix',
        subtitle: 'Welcome to',
        description:
          'Welcome to Technix! We provide fast, reliable roadside car repair services by connecting you with skilled mechanics, anytime and anywhere. Get back on the road with ease, no matter where you are!',
        buttonText: 'Book Appointment',
        link: '/store',  // Navigation link for this slide
      },
    ];
  
    const [currentSlide, setCurrentSlide] = useState(0);
  
    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
      }, 5000); // Automatically switch slides every 5 seconds
  
      return () => clearInterval(interval); // Clean up on unmount
    }, [slides.length]);
  
    const handlePrevClick = () => {
      setCurrentSlide((prevSlide) => (prevSlide === 0 ? slides.length - 1 : prevSlide - 1));
    };
  
    const handleNextClick = () => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    };
  
    return (
      <div className="home-carousel">
        <div className="home-carousel-slide" style={{ backgroundImage: `url(${slides[currentSlide].image})` }}>
          <div className="home-carousel-content">
            <h3>{slides[currentSlide].subtitle}</h3>
            <h1>{slides[currentSlide].title}</h1>
            <p>{slides[currentSlide].description}</p>
            <NavLink to={slides[currentSlide].link} className="home-carousel-btn">
              {slides[currentSlide].buttonText}
            </NavLink>
          </div>
        </div>
  
        <button className="home-carousel-control prev" onClick={handlePrevClick}>
          &#10094;
        </button>
        <button className="home-carousel-control next" onClick={handleNextClick}>
          &#10095;
        </button>
      </div>
    );
  };




  const Services = () => {
    const services = [
      { name: "Tyre", image: tyreForCard },
      { name: "Battery", image: Battery },
      { name: "Brake", image: brake },
    ];
  
    return (
      <section id="services" className="services-section">
        <h2>Try Our Best Products</h2>
        <div className="services-container">
          {services.map((service, index) => (
            <div key={index} className="service-card">
              <img src={service.image} alt={service.name} />
              <h3>{service.name}</h3>
              <button id="btn">Buy</button>
            </div>
          ))}
        </div>
      </section>
    );
  };
  // VideoSection component
const VideoSection = () => {
    return (
      <section className="video-section">
        <div className="video-content">
          <h2 className="video-title">Experience the Best in Car Servicing</h2>
          <div className="video-container">
            <iframe
              width="100%"
              height="auto"
              src="https://www.youtube.com/embed/PUkAIAIzA0I?si=z0iU6D8zpK0a9JQg"
              title="Makeup Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="video-iframe"
            ></iframe>
          </div>
        </div>
      </section>
    );
  };



function Home() {
    const [loggedInUser, setLoggedInUser] = useState('');

  
    useEffect(() => {
        setLoggedInUser(localStorage.getItem('loggedInUser'))
    }, [])

    const navigate = useNavigate();

    const handleLogout = (e) => {
      localStorage.removeItem('token');
      localStorage.removeItem('loggedInUser');
      localStorage.removeItem('loggedInEmail');
      handleSuccess('User Logged out');
      setTimeout(() => {
        navigate('/home');
      }, 2000);
    }

    const fetchProducts = async () => {
        try {
            const url = "http://localhost:3000/products";
            const headers = {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            }
            const response = await fetch(url, headers);
            const result = await response.json();
            console.log(result);
            setProducts(result);
        } catch (err) {
            handleError(err);
        }
    }
    useEffect(() => {
        fetchProducts()
    }, [])

    return (
        <div>
            <Navbar handleLogout={handleLogout} />
            {/* <h1>Welcome {loggedInUser}</h1> */}
            {/* <button className='logoutbtn' onClick={handleLogout}>Logout</button> */}

            <ImageCarousel />
            <Services />
            <VideoSection />
            {/* <Testimonials /> */}

        

            <Footer></Footer>

            <ToastContainer />
        </div>
    )
}

export default Home