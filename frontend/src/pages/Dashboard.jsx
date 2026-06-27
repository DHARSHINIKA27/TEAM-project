import React, { useEffect, useState } from 'react';
import FluentCard from '../components/FluentCard';
import { useAuth, API_BASE } from '../context/AuthContext';
import { 
  Users, Mail, Shield, CheckSquare, Plus, Trash2, Eye, 
  Settings, CheckCircle, Clock, FileText, ChevronRight, X, Edit, EyeOff
} from 'lucide-react';
import './Dashboard.css';

const Dashboard = ({ setActivePage }) => {
  const { token, isAuthenticated, logout } = useAuth();
  
  // State variables for DB Collections
  const [contacts, setContacts] = useState([]);
  const [applications, setApplications] = useState([]);
  const [services, setServices] = useState([]);
  const [projects, setProjects] = useState([]);
  const [careers, setCareers] = useState([]);
  const [blogs, setBlogs] = useState([]);
  
  // Dashboard state
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [statusAlert, setStatusAlert] = useState(null); // { type: 'success'|'error', text: '' }

  // Modal Control States
  const [showEditorModal, setShowEditorModal] = useState(false);
  const [editorType, setEditorType] = useState(''); // 'service', 'project', 'career', 'blog'
  const [editorMode, setEditorMode] = useState('add'); // 'add' or 'edit'
  const [currentEditId, setCurrentEditId] = useState(null);
  
  // Editor form values
  const [serviceForm, setServiceForm] = useState({ name: '', description: '', icon: 'Settings', details: '', status: 'active' });
  const [projectForm, setProjectForm] = useState({ title: '', description: '', category: 'Cloud Architecture', client: '', completionDate: '', status: 'completed', image: '' });
  const [careerForm, setCareerForm] = useState({ title: '', department: '', location: '', type: 'Full-time', description: '', requirements: '', status: 'active' });
  const [blogForm, setBlogForm] = useState({ title: '', excerpt: '', content: '', author: '', readTime: '', category: '', image: '', status: 'published' });

  // View Modal for details
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated) {
      setActivePage('login');
    }
  }, [isAuthenticated, setActivePage]);

  // Fetch all databases on load
  const fetchAllData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const headers = { 'Authorization': `Bearer ${token}` };
      
      const [resContacts, resApps, resSrvs, resProjs, resJobs, resBlogs] = await Promise.all([
        fetch(`${API_BASE}/contacts`, { headers }),
        fetch(`${API_BASE}/careers/applications`, { headers }),
        fetch(`${API_BASE}/services`),
        fetch(`${API_BASE}/projects`),
        fetch(`${API_BASE}/careers`),
        fetch(`${API_BASE}/blogs`)
      ]);

      if (resContacts.ok) setContacts(await resContacts.json());
      if (resApps.ok) setApplications(await resApps.json());
      if (resSrvs.ok) setServices(await resSrvs.json());
      if (resProjs.ok) setProjects(await resProjs.json());
      if (resJobs.ok) setCareers(await resJobs.json());
      if (resBlogs.ok) setBlogs(await resBlogs.json());
      
    } catch (err) {
      console.error('Error fetching dashboard statistics:', err);
      showAlert('error', 'Failed to retrieve database statistics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAllData();
    }
  }, [token]);

  const showAlert = (type, text) => {
    setStatusAlert({ type, text });
    setTimeout(() => setStatusAlert(null), 4000);
  };

  // ==================== CRUD API HANDLERS ====================

  // Delete Handler
  const handleDelete = async (collection, id) => {
    if (!window.confirm(`Confirm delete operation for item in ${collection}?`)) return;
    
    try {
      let url = `${API_BASE}/${collection}/${id}`;
      // Override for applications endpoint
      if (collection === 'applications') {
        url = `${API_BASE}/careers/applications/${id}`;
      }

      const res = await fetch(url, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        showAlert('success', 'Database entry successfully removed.');
        fetchAllData();
      } else {
        const errorData = await res.json();
        showAlert('error', errorData.message || 'Deletion failed.');
      }
    } catch (err) {
      showAlert('error', 'Server connection failure.');
    }
  };

  // Toggle Read Inquiry status
  const handleToggleRead = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'read' ? 'unread' : 'read';
    try {
      const res = await fetch(`${API_BASE}/contacts/${id}/read`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: nextStatus })
      });
      if (res.ok) {
        fetchAllData();
      }
    } catch (err) {
      console.error('Error toggling contact status:', err);
    }
  };

  // Open Edit Modals
  const openEditor = (type, mode, item = null) => {
    setEditorType(type);
    setEditorMode(mode);
    setCurrentEditId(item ? item.id : null);
    setShowEditorModal(true);

    if (type === 'service') {
      if (mode === 'edit' && item) {
        setServiceForm({ name: item.name, description: item.description, icon: item.icon, details: item.details, status: item.status });
      } else {
        setServiceForm({ name: '', description: '', icon: 'Settings', details: '', status: 'active' });
      }
    } else if (type === 'project') {
      if (mode === 'edit' && item) {
        setProjectForm({ title: item.title, description: item.description, category: item.category, client: item.client, completionDate: item.completionDate, status: item.status, image: item.image });
      } else {
        setProjectForm({ title: '', description: '', category: 'Cloud Architecture', client: '', completionDate: '', status: 'completed', image: '' });
      }
    } else if (type === 'career') {
      if (mode === 'edit' && item) {
        setCareerForm({ title: item.title, department: item.department, location: item.location, type: item.type, description: item.description, requirements: item.requirements, status: item.status });
      } else {
        setCareerForm({ title: '', department: '', location: '', type: 'Full-time', description: '', requirements: '', status: 'active' });
      }
    } else if (type === 'blog') {
      if (mode === 'edit' && item) {
        setBlogForm({ title: item.title, excerpt: item.excerpt, content: item.content, author: item.author, readTime: item.readTime, category: item.category, image: item.image, status: item.status });
      } else {
        setBlogForm({ title: '', excerpt: '', content: '', author: '', readTime: '', category: '', image: '', status: 'published' });
      }
    }
  };

  // Submit CRUD (Create & Update) forms
  const handleEditorSubmit = async (e) => {
    e.preventDefault();
    let body = {};
    let url = '';

    if (editorType === 'service') {
      body = serviceForm;
      url = `${API_BASE}/services`;
    } else if (editorType === 'project') {
      body = projectForm;
      url = `${API_BASE}/projects`;
    } else if (editorType === 'career') {
      body = careerForm;
      url = `${API_BASE}/careers`;
    } else if (editorType === 'blog') {
      body = blogForm;
      url = `${API_BASE}/blogs`;
    }

    const method = editorMode === 'add' ? 'POST' : 'PUT';
    if (editorMode === 'edit') {
      url = `${url}/${currentEditId}`;
    }

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        showAlert('success', `Record successfully ${editorMode === 'add' ? 'created' : 'updated'}.`);
        setShowEditorModal(false);
        fetchAllData();
      } else {
        const err = await res.json();
        showAlert('error', err.message || 'Operation failed.');
      }
    } catch (err) {
      showAlert('error', 'Server sync error.');
    }
  };

  return (
    <div className="page-dashboard container animate-fade-in" style={{ paddingTop: '100px', minHeight: '85vh' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Telemetry Console</h1>
          <p style={{ color: 'var(--text-secondary)' }}>System status and administrative database logs.</p>
        </div>
        <button className="btn btn-outline" style={{ border: '1px solid var(--color-accent-orange)', color: 'var(--color-accent-orange)' }} onClick={logout}>
          <span>Log out portal</span>
        </button>
      </div>

      {statusAlert && (
        <div className={`status-alert ${statusAlert.type}`} style={{ marginBottom: '1.5rem' }}>
          {statusAlert.text}
        </div>
      )}

      {loading ? (
        <div className="loading-spinner">Querying server telemetries...</div>
      ) : (
        <div className="dashboard-layout">
          
          {/* Side Menu */}
          <div className="dash-sidebar fluent-glass">
            <button className={`sidebar-tab ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
              <Shield size={16} />
              <span>Azure Overview</span>
            </button>
            <button className={`sidebar-tab ${activeTab === 'contacts' ? 'active' : ''}`} onClick={() => setActiveTab('contacts')}>
              <Mail size={16} />
              <span>Inquiries ({contacts.filter(c => c.status === 'unread').length})</span>
            </button>
            <button className={`sidebar-tab ${activeTab === 'applications' ? 'active' : ''}`} onClick={() => setActiveTab('applications')}>
              <Users size={16} />
              <span>Applicants ({applications.length})</span>
            </button>
            <div className="sidebar-divider" />
            <button className={`sidebar-tab ${activeTab === 'services' ? 'active' : ''}`} onClick={() => setActiveTab('services')}>
              <Settings size={16} />
              <span>Manage Services</span>
            </button>
            <button className={`sidebar-tab ${activeTab === 'projects' ? 'active' : ''}`} onClick={() => setActiveTab('projects')}>
              <CheckSquare size={16} />
              <span>Manage Projects</span>
            </button>
            <button className={`sidebar-tab ${activeTab === 'careers' ? 'active' : ''}`} onClick={() => setActiveTab('careers')}>
              <ChevronRight size={16} />
              <span>Manage Careers</span>
            </button>
            <button className={`sidebar-tab ${activeTab === 'blogs' ? 'active' : ''}`} onClick={() => setActiveTab('blogs')}>
              <FileText size={16} />
              <span>Manage Insights</span>
            </button>
          </div>

          {/* Main workspace */}
          <div className="dash-workspace">

            {/* TAB: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="tab-pane animate-fade-in">
                
                {/* Stats Cards Grid */}
                <div className="stats-grid">
                  <FluentCard className="stat-card" glowColor="rgba(0, 183, 195, 0.2)">
                    <Mail className="stat-icon text-brand" />
                    <div>
                      <h3>{contacts.length}</h3>
                      <p>Total Contact Inquiries</p>
                    </div>
                  </FluentCard>
                  
                  <FluentCard className="stat-card" glowColor="rgba(134, 96, 169, 0.2)">
                    <Users className="stat-icon text-purple" />
                    <div>
                      <h3>{applications.length}</h3>
                      <p>Submitted Job Resumes</p>
                    </div>
                  </FluentCard>

                  <FluentCard className="stat-card" glowColor="rgba(16, 124, 65, 0.2)">
                    <CheckSquare className="stat-icon text-teal" />
                    <div>
                      <h3>{projects.length}</h3>
                      <p>Corporate Case Studies</p>
                    </div>
                  </FluentCard>
                </div>

                {/* Premium Telemetry Plot (SVG) */}
                <div className="telemetry-chart-card fluent-glass">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                    <h4>Operational Traffic Telemetry</h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-accent-teal)', fontWeight: 600 }}>SYSTEMS ONLINE</span>
                  </div>
                  
                  {/* Custom SVG Line Chart */}
                  <svg viewBox="0 0 500 120" className="telemetry-svg">
                    <defs>
                      <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--color-brand)" stopOpacity="0.4"/>
                        <stop offset="100%" stopColor="var(--color-brand)" stopOpacity="0.0"/>
                      </linearGradient>
                    </defs>
                    {/* Grid Lines */}
                    <line x1="0" y1="30" x2="500" y2="30" stroke="var(--glass-border)" strokeWidth="0.5" />
                    <line x1="0" y1="60" x2="500" y2="60" stroke="var(--glass-border)" strokeWidth="0.5" />
                    <line x1="0" y1="90" x2="500" y2="90" stroke="var(--glass-border)" strokeWidth="0.5" />
                    {/* Shadow Area under Curve */}
                    <path d="M 0 120 L 0 80 Q 75 50 150 90 T 300 35 T 450 60 L 500 40 L 500 120 Z" fill="url(#chartGlow)" />
                    {/* Telemetry Line */}
                    <path d="M 0 80 Q 75 50 150 90 T 300 35 T 450 60 L 500 40" fill="none" stroke="var(--color-brand)" strokeWidth="2" />
                    {/* Data Points */}
                    <circle cx="150" cy="90" r="3" fill="var(--color-accent-teal)" />
                    <circle cx="300" cy="35" r="3" fill="var(--color-accent-teal)" />
                    <circle cx="450" cy="60" r="3" fill="var(--color-accent-teal)" />
                  </svg>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', fontSize: '0.75rem', color: 'var(--text-muted)', paddingTop: '1rem' }}>
                    <span>08:00 UTC</span>
                    <span>12:00 UTC</span>
                    <span>16:00 UTC</span>
                    <span>20:00 UTC</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: CONTACTS */}
            {activeTab === 'contacts' && (
              <div className="tab-pane animate-fade-in">
                <div className="pane-header">
                  <h2>Customer Leads & Contact Inquiries</h2>
                </div>
                
                {contacts.length === 0 ? (
                  <div className="empty-logs">No contact logs registered.</div>
                ) : (
                  <div className="log-list">
                    {contacts.map(cnt => (
                      <div key={cnt.id} className={`log-row fluent-glass ${cnt.status === 'unread' ? 'unread-bg' : ''}`}>
                        <div className="row-meta">
                          <strong>{cnt.name}</strong>
                          <span className="text-muted">{cnt.company || 'Private User'}</span>
                        </div>
                        <div className="row-subject">{cnt.subject}</div>
                        <div className="row-actions">
                          <button className="row-btn read-btn" onClick={() => handleToggleRead(cnt.id, cnt.status)} title="Mark Read/Unread">
                            {cnt.status === 'unread' ? <Eye size={14} /> : <EyeOff size={14} />}
                          </button>
                          <button className="row-btn view-btn" onClick={() => setSelectedInquiry(cnt)} title="Review Message Body">
                            <FileText size={14} />
                          </button>
                          <button className="row-btn delete-btn" onClick={() => handleDelete('contacts', cnt.id)}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB: APPLICATIONS */}
            {activeTab === 'applications' && (
              <div className="tab-pane animate-fade-in">
                <div className="pane-header">
                  <h2>Received Resumes / Candidate Profiles</h2>
                </div>
                
                {applications.length === 0 ? (
                  <div className="empty-logs">No application profiles registered.</div>
                ) : (
                  <div className="log-list">
                    {applications.map(app => (
                      <div key={app.id} className="log-row fluent-glass" style={{ flexDirection: 'column', gap: '0.75rem', alignItems: 'stretch' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                          <div>
                            <strong>{app.applicantName}</strong> &bull; <span className="text-muted">{app.email}</span>
                          </div>
                          <span className="badge badge-teal">{app.jobTitle}</span>
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                          <strong>Resume:</strong> <a href={app.resumeLink} target="_blank" rel="noreferrer" style={{ color: 'var(--color-brand)', textDecoration: 'underline' }}>{app.resumeLink}</a>
                        </div>
                        {app.coverLetter && (
                          <div style={{ fontSize: '0.85rem', background: 'var(--bg-primary)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)' }}>
                            <strong>Pitch:</strong> {app.coverLetter}
                          </div>
                        )}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          <span>Applied on: {app.appliedDate.split('T')[0]}</span>
                          <button className="row-btn delete-btn" onClick={() => handleDelete('applications', app.id)} style={{ padding: '0.25rem 0.5rem', display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                            <Trash2 size={12} />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB: SERVICES */}
            {activeTab === 'services' && (
              <div className="tab-pane animate-fade-in">
                <div className="pane-header">
                  <h2>Service Managers</h2>
                  <button className="btn btn-primary" onClick={() => openEditor('service', 'add')}>
                    <Plus size={16} />
                    <span>Add Service</span>
                  </button>
                </div>

                <div className="log-list">
                  {services.map(srv => (
                    <div key={srv.id} className="log-row fluent-glass">
                      <div className="row-meta">
                        <strong>{srv.name}</strong>
                        <span className="text-muted">Icon: {srv.icon} &bull; Status: {srv.status}</span>
                      </div>
                      <div className="row-actions">
                        <button className="row-btn edit-btn" onClick={() => openEditor('service', 'edit', srv)}>
                          <Edit size={14} />
                        </button>
                        <button className="row-btn delete-btn" onClick={() => handleDelete('services', srv.id)}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: PROJECTS */}
            {activeTab === 'projects' && (
              <div className="tab-pane animate-fade-in">
                <div className="pane-header">
                  <h2>Case Study Deliverables</h2>
                  <button className="btn btn-primary" onClick={() => openEditor('project', 'add')}>
                    <Plus size={16} />
                    <span>Add Case Study</span>
                  </button>
                </div>

                <div className="log-list">
                  {projects.map(proj => (
                    <div key={proj.id} className="log-row fluent-glass">
                      <div className="row-meta">
                        <strong>{proj.title}</strong>
                        <span className="text-muted">{proj.category} &bull; Client: {proj.client}</span>
                      </div>
                      <div className="row-actions">
                        <button className="row-btn edit-btn" onClick={() => openEditor('project', 'edit', proj)}>
                          <Edit size={14} />
                        </button>
                        <button className="row-btn delete-btn" onClick={() => handleDelete('projects', proj.id)}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: CAREERS */}
            {activeTab === 'careers' && (
              <div className="tab-pane animate-fade-in">
                <div className="pane-header">
                  <h2>Career Openings Listings</h2>
                  <button className="btn btn-primary" onClick={() => openEditor('career', 'add')}>
                    <Plus size={16} />
                    <span>Add Role</span>
                  </button>
                </div>

                <div className="log-list">
                  {careers.map(job => (
                    <div key={job.id} className="log-row fluent-glass">
                      <div className="row-meta">
                        <strong>{job.title}</strong>
                        <span className="text-muted">{job.department} &bull; {job.location} ({job.type})</span>
                      </div>
                      <div className="row-actions">
                        <button className="row-btn edit-btn" onClick={() => openEditor('career', 'edit', job)}>
                          <Edit size={14} />
                        </button>
                        <button className="row-btn delete-btn" onClick={() => handleDelete('careers', job.id)}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: BLOGS */}
            {activeTab === 'blogs' && (
              <div className="tab-pane animate-fade-in">
                <div className="pane-header">
                  <h2>Technical Insights Blogs</h2>
                  <button className="btn btn-primary" onClick={() => openEditor('blog', 'add')}>
                    <Plus size={16} />
                    <span>Add Post</span>
                  </button>
                </div>

                <div className="log-list">
                  {blogs.map(post => (
                    <div key={post.id} className="log-row fluent-glass">
                      <div className="row-meta">
                        <strong>{post.title}</strong>
                        <span className="text-muted">By {post.author} &bull; Status: {post.status}</span>
                      </div>
                      <div className="row-actions">
                        <button className="row-btn edit-btn" onClick={() => openEditor('blog', 'edit', post)}>
                          <Edit size={14} />
                        </button>
                        <button className="row-btn delete-btn" onClick={() => handleDelete('blogs', post.id)}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* VIEW MODAL: INQUIRY */}
      {selectedInquiry && (
        <div className="modal-overlay" onClick={() => setSelectedInquiry(null)}>
          <div className="modal-content fluent-glass" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedInquiry(null)}><X size={18} /></button>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.75rem' }}>
                <span className="badge badge-brand">{selectedInquiry.subject}</span>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '0.5rem' }}>Inquiry Details</h3>
              </div>
              <div>
                <strong>From:</strong> {selectedInquiry.name} ({selectedInquiry.email}) <br />
                <strong>Company:</strong> {selectedInquiry.company || 'Not Provided'}
              </div>
              <div style={{ background: 'var(--bg-primary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                {selectedInquiry.message}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Received on: {selectedInquiry.createdAt}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CRUD EDITOR MODAL */}
      {showEditorModal && (
        <div className="modal-overlay" onClick={() => setShowEditorModal(false)}>
          <div className="modal-content fluent-glass" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <button className="modal-close" onClick={() => setShowEditorModal(false)}><X size={18} /></button>
            
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.75rem', textTransform: 'capitalize' }}>
              {editorMode} {editorType}
            </h2>

            <form onSubmit={handleEditorSubmit}>
              
              {/* Form elements for SERVICES */}
              {editorType === 'service' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="form-group">
                    <label>Service Name</label>
                    <input type="text" className="form-control" required value={serviceForm.name} onChange={e => setServiceForm({ ...serviceForm, name: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Brief Description</label>
                    <input type="text" className="form-control" required value={serviceForm.description} onChange={e => setServiceForm({ ...serviceForm, description: e.target.value })} />
                  </div>
                  <div className="form-group-row">
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label>Icon Identifier</label>
                      <select className="form-control" value={serviceForm.icon} onChange={e => setServiceForm({ ...serviceForm, icon: e.target.value })}>
                        <option value="Cloud">Cloud (Infrastructure)</option>
                        <option value="Cpu">Cpu (AI / Tech)</option>
                        <option value="Shield">Shield (Security)</option>
                        <option value="Globe">Globe (Consulting)</option>
                      </select>
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label>Status</label>
                      <select className="form-control" value={serviceForm.status} onChange={e => setServiceForm({ ...serviceForm, status: e.target.value })}>
                        <option value="active">Active / Public</option>
                        <option value="inactive">Draft / Hidden</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Deployment Specification details</label>
                    <textarea className="form-control" style={{ minHeight: '120px' }} value={serviceForm.details} onChange={e => setServiceForm({ ...serviceForm, details: e.target.value })} />
                  </div>
                </div>
              )}

              {/* Form elements for PROJECTS */}
              {editorType === 'project' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="form-group">
                    <label>Case Study Title</label>
                    <input type="text" className="form-control" required value={projectForm.title} onChange={e => setProjectForm({ ...projectForm, title: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Description summary</label>
                    <input type="text" className="form-control" required value={projectForm.description} onChange={e => setProjectForm({ ...projectForm, description: e.target.value })} />
                  </div>
                  <div className="form-group-row">
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label>Category Group</label>
                      <select className="form-control" value={projectForm.category} onChange={e => setProjectForm({ ...projectForm, category: e.target.value })}>
                        <option value="Cloud Architecture">Cloud Architecture</option>
                        <option value="AI & Machine Learning">AI & Machine Learning</option>
                        <option value="Cybersecurity">Cybersecurity</option>
                      </select>
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label>Status</label>
                      <select className="form-control" value={projectForm.status} onChange={e => setProjectForm({ ...projectForm, status: e.target.value })}>
                        <option value="completed">Completed</option>
                        <option value="ongoing">Ongoing</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group-row">
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label>Client Entity Name</label>
                      <input type="text" className="form-control" required value={projectForm.client} onChange={e => setProjectForm({ ...projectForm, client: e.target.value })} />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label>Completion Date</label>
                      <input type="date" className="form-control" value={projectForm.completionDate} onChange={e => setProjectForm({ ...projectForm, completionDate: e.target.value })} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Cover Photo URL</label>
                    <input type="text" className="form-control" placeholder="https://images.unsplash.com/..." value={projectForm.image} onChange={e => setProjectForm({ ...projectForm, image: e.target.value })} />
                  </div>
                </div>
              )}

              {/* Form elements for CAREERS */}
              {editorType === 'career' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="form-group">
                    <label>Position Title</label>
                    <input type="text" className="form-control" required value={careerForm.title} onChange={e => setCareerForm({ ...careerForm, title: e.target.value })} />
                  </div>
                  <div className="form-group-row">
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label>Department</label>
                      <input type="text" className="form-control" required value={careerForm.department} onChange={e => setCareerForm({ ...careerForm, department: e.target.value })} />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label>Office Location</label>
                      <input type="text" className="form-control" required value={careerForm.location} onChange={e => setCareerForm({ ...careerForm, location: e.target.value })} />
                    </div>
                  </div>
                  <div className="form-group-row">
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label>Contract Type</label>
                      <select className="form-control" value={careerForm.type} onChange={e => setCareerForm({ ...careerForm, type: e.target.value })}>
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Remote">Remote</option>
                      </select>
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label>Public Visibility</label>
                      <select className="form-control" value={careerForm.status} onChange={e => setCareerForm({ ...careerForm, status: e.target.value })}>
                        <option value="active">Active Opening</option>
                        <option value="inactive">Hidden / Filled</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Role Description summary</label>
                    <textarea className="form-control" style={{ minHeight: '80px' }} value={careerForm.description} onChange={e => setCareerForm({ ...careerForm, description: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Position Requirements (comma-separated)</label>
                    <textarea className="form-control" style={{ minHeight: '80px' }} placeholder="B.S. Computer Science, 5+ years Azure..." value={careerForm.requirements} onChange={e => setCareerForm({ ...careerForm, requirements: e.target.value })} />
                  </div>
                </div>
              )}

              {/* Form elements for BLOGS */}
              {editorType === 'blog' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="form-group">
                    <label>Article Headline</label>
                    <input type="text" className="form-control" required value={blogForm.title} onChange={e => setBlogForm({ ...blogForm, title: e.target.value })} />
                  </div>
                  <div className="form-group-row">
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label>Category Label</label>
                      <input type="text" className="form-control" required value={blogForm.category} onChange={e => setBlogForm({ ...blogForm, category: e.target.value })} />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label>Visibility</label>
                      <select className="form-control" value={blogForm.status} onChange={e => setBlogForm({ ...blogForm, status: e.target.value })}>
                        <option value="published">Published</option>
                        <option value="draft">Draft / Private</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group-row">
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label>Author / Speaker</label>
                      <input type="text" className="form-control" required value={blogForm.author} onChange={e => setBlogForm({ ...blogForm, author: e.target.value })} />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label>Read Time Estimate</label>
                      <input type="text" className="form-control" placeholder="5 min read" value={blogForm.readTime} onChange={e => setBlogForm({ ...blogForm, readTime: e.target.value })} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Summary Excerpt</label>
                    <input type="text" className="form-control" value={blogForm.excerpt} onChange={e => setBlogForm({ ...blogForm, excerpt: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Cover Graphic URL</label>
                    <input type="text" className="form-control" placeholder="https://images.unsplash.com/..." value={blogForm.image} onChange={e => setBlogForm({ ...blogForm, image: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Article Content body</label>
                    <textarea className="form-control" required style={{ minHeight: '180px' }} value={blogForm.content} onChange={e => setBlogForm({ ...blogForm, content: e.target.value })} />
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowEditorModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;
