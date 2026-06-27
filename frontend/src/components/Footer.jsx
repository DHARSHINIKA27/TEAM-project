import React from 'react';
import { Terminal, Shield, Cpu, Cloud, Globe } from 'lucide-react';
import './Footer.css';

const Footer = ({ setActivePage }) => {
  return (
    <footer className="footer fluent-glass">
      <div className="footer-container container">
        <div className="footer-brand">
          <div className="footer-logo" onClick={() => setActivePage('home')}>
            <Terminal className="logo-icon" />
            <span className="logo-text">NEURAL<span className="logo-sub">IT</span></span>
          </div>
          <p className="brand-description">
            Next-generation Microsoft-inspired IT enterprise solutions, orchestrating secure cognitive environments, resilient hybrid multi-cloud systems, and AI telemetry automation.
          </p>
          <div className="brand-badges">
            <span className="footer-badge"><Cloud size={12} /> Hybrid Cloud</span>
            <span className="footer-badge"><Cpu size={12} /> AI Engineering</span>
            <span className="footer-badge"><Shield size={12} /> Zero-Trust</span>
          </div>
        </div>

        <div className="footer-links-grid">
          <div className="links-col">
            <h3>Enterprise Services</h3>
            <ul>
              <li><button onClick={() => setActivePage('services')}>Cloud Infrastructure</button></li>
              <li><button onClick={() => setActivePage('services')}>Cognitive AI Systems</button></li>
              <li><button onClick={() => setActivePage('services')}>Zero-Trust Networks</button></li>
              <li><button onClick={() => setActivePage('services')}>Strategic IT Consulting</button></li>
            </ul>
          </div>

          <div className="links-col">
            <h3>Corporate</h3>
            <ul>
              <li><button onClick={() => setActivePage('projects')}>Case Studies</button></li>
              <li><button onClick={() => setActivePage('careers')}>Careers Portal</button></li>
              <li><button onClick={() => setActivePage('blogs')}>Technical Insights</button></li>
              <li><button onClick={() => setActivePage('contact')}>Contact Inquiry</button></li>
            </ul>
          </div>

          <div className="links-col">
            <h3>Contact Headquarters</h3>
            <p className="contact-info">
              Neural IT Global Corp<br />
              Microsoft Way, Redmond, WA<br />
              info@neural-it-platform.local<br />
              +1 (425) 555-0100
            </p>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container bottom-content">
          <p>&copy; {new Date().getFullYear()} Neural IT Platforms. All rights reserved. Microsoft and Fluent Design are inspiration properties.</p>
          <div className="bottom-links">
            <a href="#privacy">Privacy Directive</a>
            <a href="#terms">Service Agreements</a>
            <a href="#compliance">ISO Compliance</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
