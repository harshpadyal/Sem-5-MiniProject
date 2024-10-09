import React, { useState } from 'react';
import "./Services.css"
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Services = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const navigate = useNavigate();

    const carouselItems = [
        {
            src: '/images/profile4.png',
            name: 'Abhay Gupta',
            feedback: 'Very useful'
        },
        {
            src: '/images/profile4.png',
            name: 'Harsh Padyal',
            feedback: 'Trusted app...'
        },
        {
            src: '/images/profile4.png',
            name: 'Vivek Gupta',
            feedback: 'Used this app in my vactions due to emergency and it was very benificial app'
        }
    ];

    // Updated handleCardClick to accept a service name
    const handleCardClick = (service) => {
        navigate('/appointment', { state: { selectedService: service } });
    };

    return (
        <>
            <Navbar />
            <div>
                <div className="svgimg">
                    <img src='/images/tyre.png' alt="tyre" />
                    <button onClick={() => handleCardClick('Basic Car Service')}>BOOK</button>
                </div>

                <div className="ourservices">
                    <div className="border"></div>
                    OUR SERVICES
                    <div className="border"></div>
                </div>

                <div className="box">
                    {/* Passing the specific service names to handleCardClick */}
                    <div className="card-container" onClick={() => handleCardClick('Basic Car Service')}>
                        <div className="card">
                            <img className="img" src="/images/car_service.png" alt="Basic Car Service" />
                            <div className="card-title"><b>Basic Car Service</b></div>
                        </div>
                    </div>
                    <div className="card-container" onClick={() => handleCardClick('Car Inspection')}>
                        <div className="card">
                            <img className="img" src="/images/Car-Inspection.png" alt="Car Inspection" />
                            <div className="card-title"><b>Car Inspection</b></div>
                        </div>
                    </div>
                    <div className="card-container" onClick={() => handleCardClick('Used Car Inspection')}>
                        <div className="card">
                            <img className="img" src="/images/used_car_inspection.jpg" alt="Used Car Inspection" />
                            <div className="card-title"><b>Used Car Inspection</b></div>
                        </div>
                    </div>
                    <div className="card-container" onClick={() => handleCardClick('Car Wash')}>
                        <div className="card">
                            <img className="img" src="/images/car_wash.png" alt="Car Wash" />
                            <div className="card-title"><b>Car Wash</b></div>
                        </div>
                    </div>
                    <div className="card-container" onClick={() => handleCardClick('AC Repair')}>
                        <div className="card">
                            <img className="img" src="/images/ac_repair.png" alt="AC Repair" />
                            <div className="card-title"><b>AC Repair</b></div>
                        </div>
                    </div>
                    <div className="card-container" onClick={() => handleCardClick('Windshields & Lights')}>
                        <div className="card">
                            <img className="img1" src="/images/windshields.png" alt="Windshields & Lights" />
                            <div className="card-title"><b>Windshields & Lights</b></div>
                        </div>
                    </div>
                </div>

                <div className="feedbacks">
                    <div className="border"></div>
                    FEEDBACKS
                    <div className="border"></div>
                </div>

                <div className="carousel">
                    <div className="carousel-slide">
                        {carouselItems.map((item, index) => (
                            <div className="carousel-item" key={index}>
                                <img src={item.src} alt={`Image ${index + 1}`} />
                                <div className="carousel-text">
                                    <h2>{item.name}</h2>
                                    <p>{item.feedback}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="prev">❮</button>
                    <button className="next">❯</button>
                </div>

                <Footer />
            </div>
        </>
    );
};

export default Services;
