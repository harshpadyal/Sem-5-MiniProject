import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../utils';
import { ToastContainer } from 'react-toastify';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import "./Home.css"
import { NavLink } from "react-router-dom";
import wax from '../assets/wax.png';
import hair from '../assets/hair.png';
import spa from '../assets/spa.png';
import img from '../assets/icon.png';



import productImage from '../assets/product.png';
import ladyImage from '../assets/lady.png';

const ImageCarousel = () => {
    const slides = [
      {
        image: ladyImage,
        title: 'X SALON',
        subtitle: 'Welcome to',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        buttonText: 'Book Appointment',
        link: '/appointment',  // Navigation link for this slide
      },
      {
        image: productImage,
        title: 'X SALON',
        subtitle: 'Welcome to',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        buttonText: 'Buy Products',
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
      { name: "Waxing", image: wax },
      { name: "Hair Care", image: hair },
      { name: "Hair Spa", image: spa },
    ];
  
    return (
      <section id="services" className="services-section">
        <h2>Try Our Best Services</h2>
        <div className="services-container">
          {services.map((service, index) => (
            <div key={index} className="service-card">
              <img src={service.image} alt={service.name} />
              <h3>{service.name}</h3>
              <button id="btn">Book Now</button>
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
          <h2 className="video-title">Experience the Best in Makeup Artistry</h2>
          <div className="video-container">
            <iframe
              width="100%"
              height="auto"
              src="https://www.youtube.com/embed/-FnrCZJw6TE?si=7rucvFboiGjbatNq"
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
  // Testimonials component
const Testimonials = () => {
    const testimonials = [
      { name: "Arya", 
        text: "The staff is friendly, warm, and cooperative. They greet me with happy faces all the time. No matter which eyebrow threader I choose, I get the same shape every time with the utmost perfection. Love this place and its atmosphere.", image: img },
      { name: "Sharvari", text: "Amy did my lash extensions with utter accuracy and perfection. She even gives a guarantee that if you don’t like your lashes, she’ll refund your money. Her skill level matches her confidence level!",  image: img },
      { name: "Artha", text: "I had a facial treatment with Riya, and it was beyond amazing. She took the time to explain every step and tailored the treatment to my skin's needs. I left feeling rejuvenated and with glowing skin. ",  image: img },
    ];
  
    return (
      <section id="testimonials" className="testimonials-section">
        <h2>Testimonials</h2>
        <div className="testimonials-container">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card">
              <img src={testimonial.image} alt={testimonial.name} />
              <p>{testimonial.text}</p>
              <h3>{testimonial.name}</h3>
            </div>
          ))}
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
            <Testimonials />

        

            <Footer></Footer>

            <ToastContainer />
        </div>
    )
}

export default Home