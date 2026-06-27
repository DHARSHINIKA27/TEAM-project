import React, { useEffect, useState } from 'react';
import FluentCard from '../components/FluentCard';
import { API_BASE } from '../context/AuthContext';
import { Briefcase, MapPin, Clock, X, Paperclip, Send } from 'lucide-react';
import './Pages.css';

const Careers = () => {
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  
  // Application Form state
  const [formData, setFormData] = useState({
    applicantName: '',
    email: '',
    phone: '',
    coverLetter: '',
    resumeLink: ''
  });
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', 'submitting'
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    const fetchCareers = async () => {
      try {
        const res = await fetch(`${API_BASE}/careers`);
        if (res.ok) {
          const data = await res.json();
          setCareers(data.filter(c => c.status === 'active'));
        }
      } catch (err) {
        console.error('Error fetching careers:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCareers();
  }, []);

  const handleApplyClick = (job) => {
    setSelectedJob(job);
    setSubmitStatus(null);
    setStatusMessage('');
    setFormData({
      applicantName: '',
      email: '',
      phone: '',
      coverLetter: '',
      resumeLink: ''
    });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.applicantName || !formData.email) {
      setSubmitStatus('error');
      setStatusMessage('Name and Email are required.');
      return;
    }

    setSubmitStatus('submitting');

    try {
      const res = await fetch(`${API_BASE}/careers/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          jobId: selectedJob.id,
          ...formData
        })
      });

      const data = await res.json();

      if (res.ok) {
        setSubmitStatus('success');
        setStatusMessage('Your application has been received. Our HR team will reach out shortly.');
      } else {
        setSubmitStatus('error');
        setStatusMessage(data.message || 'Failed to submit application.');
      }
    } catch (err) {
      setSubmitStatus('error');
      setStatusMessage('Network error. Please try again.');
    }
  };

  return (
    <div className="page-careers section container animate-fade-in" style={{ paddingTop: '100px' }}>
      <div className="section-header">
        <span className="section-badge">Join the Engineers</span>
        <h1 className="section-title">Open Opportunities</h1>
        <p className="section-desc">
          We are recruiting leading infrastructure architects, ML scientists, and cybersecurity analysts to build the future of cognitive systems.
        </p>
      </div>

      {loading ? (
        <div className="loading-spinner">Loading job opportunities...</div>
      ) : (
        <div className="careers-list" style={{ maxWidth: '900px', margin: '0 auto' }}>
          {careers.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              No current openings are active. Please check back later.
            </div>
          ) : (
            careers.map(job => (
              <FluentCard key={job.id} className="career-item">
                <div className="career-meta">
                  <h3>{job.title}</h3>
                  <div className="career-tags">
                    <span className="career-tag" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Briefcase size={12} className="text-brand" />
                      <span>{job.department}</span>
                    </span>
                    <span className="career-tag" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <MapPin size={12} className="text-teal" />
                      <span>{job.location}</span>
                    </span>
                    <span className="career-tag" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Clock size={12} className="text-purple" />
                      <span>{job.type}</span>
                    </span>
                  </div>
                </div>
                
                <button className="btn btn-primary" onClick={() => handleApplyClick(job)}>
                  Apply Now
                </button>
              </FluentCard>
            ))
          )}
        </div>
      )}

      {/* Application Modal */}
      {selectedJob && (
        <div className="modal-overlay" onClick={() => setSelectedJob(null)}>
          <div className="modal-content fluent-glass" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedJob(null)}>
              <X size={20} />
            </button>

            <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
              <span className="badge badge-purple">{selectedJob.department}</span>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '0.25rem' }}>Apply: {selectedJob.title}</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                {selectedJob.location} &bull; {selectedJob.type}
              </p>
            </div>

            {submitStatus === 'success' ? (
              <div className="status-alert success" style={{ margin: '2rem 0' }}>
                {statusMessage}
                <button 
                  className="btn btn-outline" 
                  onClick={() => setSelectedJob(null)}
                  style={{ width: '100%', marginTop: '1.5rem' }}
                >
                  Close Window
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {submitStatus === 'error' && (
                  <div className="status-alert error">{statusMessage}</div>
                )}

                <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                  <strong>Description:</strong> {selectedJob.description} <br /><br />
                  <strong>Requirements:</strong> {selectedJob.requirements}
                </div>

                <div className="form-group">
                  <label htmlFor="applicantName">Full Name *</label>
                  <input
                    type="text"
                    id="applicantName"
                    name="applicantName"
                    required
                    className="form-control"
                    placeholder="Enter your name"
                    value={formData.applicantName}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group-row">
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label htmlFor="email">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="form-control"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label htmlFor="phone">Phone Number</label>
                    <input
                      type="text"
                      id="phone"
                      name="phone"
                      className="form-control"
                      placeholder="+1 (555) 0123"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="resumeLink">Resume / CV Link *</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="url"
                      id="resumeLink"
                      name="resumeLink"
                      required
                      className="form-control"
                      placeholder="https://example.com/resume.pdf"
                      style={{ paddingLeft: '2.5rem' }}
                      value={formData.resumeLink}
                      onChange={handleInputChange}
                    />
                    <Paperclip size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="coverLetter">Cover Letter / Pitch</label>
                  <textarea
                    id="coverLetter"
                    name="coverLetter"
                    className="form-control"
                    placeholder="Briefly pitch why you fit this role..."
                    style={{ minHeight: '100px' }}
                    value={formData.coverLetter}
                    onChange={handleInputChange}
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  disabled={submitStatus === 'submitting'}
                  style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', width: '100%', marginTop: '1rem' }}
                >
                  <Send size={16} />
                  <span>{submitStatus === 'submitting' ? 'Submitting...' : 'Send Application'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Careers;
