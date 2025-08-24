import React from "react";
import { Link } from "react-router-dom";
import { 
  FaTwitter, 
  FaLinkedin, 
  FaFacebook, 
  FaInstagram, 
  FaYoutube,
  FaMicrophone,
  FaUsers,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer-modern">
      {/* Main Footer Content */}
      <div className="footer-main">
        <div className="container">
          <div className="row g-4">
            {/* Company Info */}
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="footer-brand">
                <div className="brand-logo mb-3">
                  <FaMicrophone className="brand-icon" />
                  <span className="brand-text">Podcast Experts</span>
                </div>
                <p className="company-description">
                  Connecting passionate podcasters with industry experts to create 
                  extraordinary content that inspires, educates, and entertains audiences worldwide.
                </p>
                <div className="social-links">
                  <a href="https://twitter.com" className="social-link twitter" target="_blank" rel="noopener noreferrer">
                    <FaTwitter />
                  </a>
                  <a href="https://linkedin.com" className="social-link linkedin" target="_blank" rel="noopener noreferrer">
                    <FaLinkedin />
                  </a>
                  <a href="https://facebook.com" className="social-link facebook" target="_blank" rel="noopener noreferrer">
                    <FaFacebook />
                  </a>
                  <a href="https://instagram.com" className="social-link instagram" target="_blank" rel="noopener noreferrer">
                    <FaInstagram />
                  </a>
                  <a href="https://youtube.com" className="social-link youtube" target="_blank" rel="noopener noreferrer">
                    <FaYoutube />
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="col-lg-2 col-md-6 mb-4">
              <div className="footer-section">
                <h5 className="section-title">Quick Links</h5>
                <ul className="footer-links">
                  <li>
                    <Link to="/experts" className="footer-link">
                      <FaUsers className="link-icon" />
                      Find Experts
                    </Link>
                  </li>
                  <li>
                    <Link to="/podcasts" className="footer-link">
                      <FaMicrophone className="link-icon" />
                      Discover Podcasts
                    </Link>
                  </li>
                  <li>
                    <Link to="/about" className="footer-link">
                      <FaUsers className="link-icon" />
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link to="/contact" className="footer-link">
                      <FaEnvelope className="link-icon" />
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Services */}
            <div className="col-lg-2 col-md-6 mb-4">
              <div className="footer-section">
                <h5 className="section-title">Services</h5>
                <ul className="footer-links">
                  <li>
                    <Link to="/expert-creation" className="footer-link">
                      Expert Profiles
                    </Link>
                  </li>
                  <li>
                    <Link to="/podcast-creation" className="footer-link">
                      Podcast Creation
                    </Link>
                  </li>
                  <li>
                    <Link to="/messaging" className="footer-link">
                      Direct Messaging
                    </Link>
                  </li>
                  <li>
                    <Link to="/featured" className="footer-link">
                      Featured Content
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Contact Info */}
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="footer-section">
                <h5 className="section-title">Get In Touch</h5>
                <div className="contact-info">
                  <div className="contact-item">
                    <FaEnvelope className="contact-icon" />
                    <span>hello@podcastexperts.com</span>
                  </div>
                  <div className="contact-item">
                    <FaPhone className="contact-icon" />
                    <span>+1 (555) 123-4567</span>
                  </div>
                  <div className="contact-item">
                    <FaMapMarkerAlt className="contact-icon" />
                    <span>San Francisco, CA 94105</span>
                  </div>
                </div>
                <div className="newsletter-signup mt-3">
                  <h6 className="newsletter-title">Stay Updated</h6>
                  <p className="newsletter-text">Get the latest podcast industry insights</p>
                  <div className="input-group">
                    <input 
                      type="email" 
                      className="form-control newsletter-input" 
                      placeholder="Enter your email"
                    />
                    <button className="btn btn-primary newsletter-btn">
                      Subscribe
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <p className="copyright-text">
                © {new Date().getFullYear()} <strong>Podcast Experts</strong>. All rights reserved.
              </p>
            </div>
            <div className="col-md-6 text-md-end">
              <div className="footer-legal">
                <Link to="/privacy" className="legal-link">Privacy Policy</Link>
                <Link to="/terms" className="legal-link">Terms of Service</Link>
                <Link to="/cookies" className="legal-link">Cookie Policy</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS Styles */}
      <style jsx>{`
        .footer-modern {
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
          color: #ffffff;
          position: relative;
          overflow: hidden;
        }

        .footer-modern::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="rgba(255,255,255,0.03)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
          pointer-events: none;
        }

        .footer-main {
          padding: 4rem 0 2rem;
          position: relative;
          z-index: 1;
        }

        .footer-brand .brand-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .brand-icon {
          font-size: 2rem;
          color: #00d4ff;
          filter: drop-shadow(0 0 10px rgba(0, 212, 255, 0.5));
        }

        .brand-text {
          font-size: 1.75rem;
          font-weight: 700;
          background: linear-gradient(45deg, #00d4ff, #ff6b6b);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .company-description {
          color: #b8c5d6;
          line-height: 1.7;
          margin-bottom: 1.5rem;
          font-size: 0.95rem;
        }

        .social-links {
          display: flex;
          gap: 1rem;
        }

        .social-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          color: #ffffff;
          text-decoration: none;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .social-link::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(45deg, var(--social-color), var(--social-color-light));
          transform: scale(0);
          transition: transform 0.3s ease;
          border-radius: 50%;
        }

        .social-link:hover::before {
          transform: scale(1);
        }

        .social-link svg {
          position: relative;
          z-index: 1;
          transition: transform 0.3s ease;
        }

        .social-link:hover svg {
          transform: scale(1.2);
        }

        .social-link.twitter {
          --social-color: #1da1f2;
          --social-color-light: #64b5f6;
        }

        .social-link.linkedin {
          --social-color: #0077b5;
          --social-color-light: #42a5f5;
        }

        .social-link.facebook {
          --social-color: #1877f2;
          --social-color-light: #5c9ce6;
        }

        .social-link.instagram {
          --social-color: #e4405f;
          --social-color-light: #f06292;
        }

        .social-link.youtube {
          --social-color: #ff0000;
          --social-color-light: #ff6b6b;
        }

        .footer-section .section-title {
          color: #00d4ff;
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 1.25rem;
          position: relative;
          padding-bottom: 0.5rem;
        }

        .section-title::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 30px;
          height: 2px;
          background: linear-gradient(90deg, #00d4ff, #ff6b6b);
          border-radius: 1px;
        }

        .footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .footer-links li {
          margin-bottom: 0.75rem;
        }

        .footer-link {
          color: #b8c5d6;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
          font-size: 0.9rem;
        }

        .footer-link:hover {
          color: #00d4ff;
          transform: translateX(5px);
        }

        .link-icon {
          font-size: 0.8rem;
          color: #00d4ff;
          opacity: 0.8;
        }

        .contact-info .contact-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
          color: #b8c5d6;
          font-size: 0.9rem;
        }

        .contact-icon {
          color: #00d4ff;
          font-size: 1rem;
          min-width: 16px;
        }

        .newsletter-signup {
          background: rgba(255, 255, 255, 0.05);
          padding: 1.5rem;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
        }

        .newsletter-title {
          color: #00d4ff;
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .newsletter-text {
          color: #b8c5d6;
          font-size: 0.85rem;
          margin-bottom: 1rem;
        }

        .newsletter-input {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #ffffff;
          border-radius: 8px 0 0 8px;
          padding: 0.75rem 1rem;
        }

        .newsletter-input::placeholder {
          color: rgba(255, 255, 255, 0.6);
        }

        .newsletter-input:focus {
          background: rgba(255, 255, 255, 0.15);
          border-color: #00d4ff;
          box-shadow: 0 0 0 0.2rem rgba(0, 212, 255, 0.25);
          color: #ffffff;
        }

        .newsletter-btn {
          background: linear-gradient(45deg, #00d4ff, #ff6b6b);
          border: none;
          border-radius: 0 8px 8px 0;
          padding: 0.75rem 1.5rem;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .newsletter-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 212, 255, 0.3);
        }

        .footer-bottom {
          background: rgba(0, 0, 0, 0.3);
          padding: 1.5rem 0;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          position: relative;
          z-index: 1;
        }

        .copyright-text {
          color: #b8c5d6;
          margin: 0;
          font-size: 0.9rem;
        }

        .copyright-text strong {
          color: #00d4ff;
        }

        .footer-legal {
          display: flex;
          gap: 1.5rem;
          justify-content: flex-end;
        }

        .legal-link {
          color: #b8c5d6;
          text-decoration: none;
          font-size: 0.85rem;
          transition: color 0.3s ease;
        }

        .legal-link:hover {
          color: #00d4ff;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .footer-main {
            padding: 3rem 0 1.5rem;
          }
          
          .footer-legal {
            justify-content: center;
            margin-top: 1rem;
          }
          
          .social-links {
            justify-content: center;
          }
          
          .brand-logo {
            justify-content: center;
          }
        }

        @media (max-width: 576px) {
          .newsletter-signup {
            padding: 1rem;
          }
          
          .footer-legal {
            flex-direction: column;
            align-items: center;
            gap: 0.75rem;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
