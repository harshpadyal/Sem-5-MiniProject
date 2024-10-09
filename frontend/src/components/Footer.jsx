import React from 'react'
import "./Footer.css";



const Footer = () => {
  return (
    <div className="footerimg">
    {/* <img src="/images/cup.png" alt="Cup" /> */}
    <img src='./images/cup.png' alt='Cup' />
    <footer>
        <div className="social">
            <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer"><img src="/images/facebook.svg" alt="Facebook" /></a>
            <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer"><img src="/images/insta.svg" alt="Instagram" /></a>
            <a href="https://x.com/home" target="_blank" rel="noopener noreferrer"><img src="/images/twitter.svg" alt="Twitter" /></a>
            <a href="https://in.pinterest.com/" target="_blank" rel="noopener noreferrer"><img src="/images/pinterest.svg" alt="Pinterest" /></a>
        </div>

        <div className="contact">
            CONTACT US
        </div>

        <div className="coninfo">
            <div className="phone">
                <div>Phone Number</div>
                <div>9988776655</div>
            </div>
            <div className="email">
                <div>Email</div>
                <div>technix.service@gmail.com</div>
            </div>
        </div>

        <div className="info">
        Your trusted roadside assistance solution. At Technix, we specialize in on-the-spot car repairs, connecting you with expert mechanics wherever and whenever you need them. Whether it's a flat tire, battery issue, or any other roadside emergency, Technix ensures quick and reliable assistance so you can get back on the road in no time.
        Fast. Reliable. Always there for you.
        </div>

        <div className="copyright">
            <p>&copy; <span id="current-year">{new Date().getFullYear()}</span> Technix. All rights reserved.</p>
        </div>
    </footer>
</div>
  )
}

export default Footer
