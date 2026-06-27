import React, { useState } from 'react';
import FluentCard from '../components/FluentCard';
import CostConfigurator from '../components/CostConfigurator';
import { API_BASE } from '../context/AuthContext';
import { Mail, Phone, MapPin, Send, HelpCircle } from 'lucide-react';
import './Pages.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: 'General Inquiry',
    message: ''
  });

  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', 'sending'
  const [statusMessage, setStatusMessage] = useState('');

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleApplyBlueprint = (blueprint) => {
    setFormData(prev => ({
      ...prev,
      subject: 'Migration Service',
      message: blueprint
    }));
    // Scroll smoothly to form inputs
    const nameInput = document.getElementById('name');
    if (nameInput) {
      nameInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      nameInput.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setSubmitStatus('error');
      setStatusMessage('Name, Email and Message content are required.');
      return;
    }

    setSubmitStatus('sending');

    try {
      const res = await fetch(`${API_BASE}/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        setSubmitStatus('success');
        setStatusMessage('Your inquiry has been successfully transmitted. Our consulting team will contact you.');
        setFormData({
          name: '',
          email: '',
          company: '',
          subject: 'General Inquiry',
          message: ''
        });
      } else {
        setSubmitStatus('error');
        setStatusMessage(data.message || 'Failed to submit inquiry.');
      }
    } catch (err) {
      setSubmitStatus('error');
      setStatusMessage('Network connection error. Please try again.');
    }
  };

  return (
    <div className="page-contact section container animate-fade-in" style={{ paddingTop: '100px' }}>
      <div className="section-header">
        <span className="section-badge">Engage Consulting</span>
        <h1 className="section-title">Initiate Collaboration</h1>
        <p className="section-desc">
          Reach out to our global technical consulting offices. Detail your migration project or custom application requirement.
        </p>
      </div>

      {/* Dynamic Cloud Budget & Blueprint Calculator */}
      <CostConfigurator onApplyBlueprint={handleApplyBlueprint} />

      <div className="form-grid">
        {/* Form panel */}
        <FluentCard className="contact-card">
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1.5rem' }}>Send Secure Inbound Request</h2>
          
          <form onSubmit={handleSubmit}>
            {submitStatus === 'success' && (
              <div className="status-alert success">{statusMessage}</div>
            )}
            {submitStatus === 'error' && (
              <div className="status-alert error">{statusMessage}</div>
            )}

            <div className="form-group-row">
              <div className="form-group">
                <label htmlFor="name">Contact Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="form-control"
                  placeholder="e.g. John Doe"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="form-control"
                  placeholder="e.g. j.doe@company.com"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-group-row">
              <div className="form-group">
                <label htmlFor="company">Company Entity</label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  className="form-control"
                  placeholder="e.g. Acme Corp"
                  value={formData.company}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject *</label>
                <select
                  id="subject"
                  name="subject"
                  className="form-control"
                  value={formData.subject}
                  onChange={handleInputChange}
                >
                  <option value="General Inquiry">General Inbound Inquiry</option>
                  <option value="Migration Service">Cloud Migration Blueprint</option>
                  <option value="AI Integration">Cognitive / AI Engineering</option>
                  <option value="Security Consultation">Zero-Trust Network pen-test</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="message">Message specifications *</label>
              <textarea
                id="message"
                name="message"
                required
                className="form-control"
                placeholder="Detail your architecture request or inquiry specifics..."
                value={formData.message}
                onChange={handleInputChange}
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary accent-glow-brand"
              disabled={submitStatus === 'sending'}
              style={{ display: 'flex', gap: '0.5rem', width: 'max-content' }}
            >
              <Send size={16} />
              <span>{submitStatus === 'sending' ? 'Transmitting...' : 'Send Message'}</span>
            </button>
          </form>
        </FluentCard>

        {/* Info panel */}
        <div className="form-info-panel" style={{ padding: '1rem 0' }}>
          <div className="info-item">
            <div className="info-icon-wrapper">
              <MapPin size={20} />
            </div>
            <div className="info-details">
              <h4>Global Headquarters</h4>
              <p>One Microsoft Way, Redmond, WA 98052, USA</p>
            </div>
          </div>

          <div className="info-item">
            <div className="info-icon-wrapper">
              <Mail size={20} />
            </div>
            <div className="info-details">
              <h4>Electronic Inbound Routing</h4>
              <p>inquiries@neural-it-platform.local<br />support@neural-it-platform.local</p>
            </div>
          </div>

          <div className="info-item">
            <div className="info-icon-wrapper">
              <Phone size={20} />
            </div>
            <div className="info-details">
              <h4>Telemetry Ops Helpdesk</h4>
              <p>+1 (425) 555-0100 (Mon-Fri 8AM - 6PM PST)</p>
            </div>
          </div>

          <div className="info-item" style={{ marginTop: '1rem' }}>
            <div className="info-icon-wrapper" style={{ background: 'rgba(0, 183, 195, 0.1)', color: 'var(--color-accent-teal)' }}>
              <HelpCircle size={20} />
            </div>
            <div className="info-details">
              <h4>Response Guidelines</h4>
              <p>Standard enterprise SLA guarantees contact replies within 24 hours.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
