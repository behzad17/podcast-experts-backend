import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-light py-4 mt-5">
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-3">
            <h5 className="text-primary mb-3">Podcast Experts</h5>
            <p className="text-muted small">
              Connecting podcasters with industry experts to create amazing
              content together.
            </p>
          </div>
          <div className="col-md-4 mb-3">
            <h5 className="text-primary mb-3">Quick Links</h5>
            <ul className="list-unstyled">
              <li>
                <Link to="/experts" className="text-muted text-decoration-none">
                  Find Experts
                </Link>
              </li>
              <li>
                <Link
                  to="/podcasts"
                  className="text-muted text-decoration-none"
                >
                  Discover Podcasts
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted text-decoration-none">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted text-decoration-none">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div className="col-md-4 mb-3">
            <h5 className="text-primary mb-3">Connect With Us</h5>
            <ul className="list-unstyled">
              <li>
                <a
                  href="https://twitter.com"
                  className="text-muted text-decoration-none"
                >
                  Twitter
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com"
                  className="text-muted text-decoration-none"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="https://facebook.com"
                  className="text-muted text-decoration-none"
                >
                  Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>
        <hr className="my-4" />
        <div className="row">
          <div className="col-12 text-center">
            <p className="text-muted small mb-0">
              © {new Date().getFullYear()} Podcast Experts. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
