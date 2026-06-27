import React, { useEffect, useState } from 'react';
import FluentCard from '../components/FluentCard';
import { API_BASE } from '../context/AuthContext';
import { Briefcase, Calendar, CheckCircle2, RefreshCw } from 'lucide-react';
import './Pages.css';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch(`${API_BASE}/projects`);
        if (res.ok) {
          const data = await res.json();
          setProjects(data);
        }
      } catch (err) {
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const categories = ['All', 'Cloud Architecture', 'AI & Machine Learning', 'Cybersecurity'];

  const filteredProjects = filter === 'All' 
    ? projects 
    : projects.filter(p => p.category.toLowerCase() === filter.toLowerCase());

  return (
    <div className="page-projects section container animate-fade-in" style={{ paddingTop: '100px' }}>
      <div className="section-header">
        <span className="section-badge">Case Studies</span>
        <h1 className="section-title">Enterprise Engagements</h1>
        <p className="section-desc">
          Explore our real-world execution milestones delivering cloud resilience, neural systems integration, and cybersecurity perimeters.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="project-filters" style={{ display: 'flex', gap: '0.75rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`btn btn-outline`}
            style={{
              padding: '0.5rem 1.25rem',
              fontSize: '0.85rem',
              background: filter === cat ? 'var(--color-brand)' : 'var(--glass-bg)',
              borderColor: filter === cat ? 'var(--color-brand)' : 'var(--glass-border)',
              color: filter === cat ? '#fff' : 'var(--text-primary)',
              borderRadius: 'var(--radius-xl)'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading-spinner">Loading case studies...</div>
      ) : (
        <div className="blog-grid">
          {filteredProjects.map(proj => (
            <FluentCard key={proj.id} className="blog-card" style={{ padding: 0 }}>
              <img src={proj.image} alt={proj.title} className="blog-img" />
              <div className="blog-body">
                <div className="blog-meta-row">
                  <span className="badge badge-teal" style={{ fontSize: '0.7rem' }}>{proj.category}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    {proj.status === 'completed' 
                      ? <CheckCircle2 size={12} className="text-teal" /> 
                      : <RefreshCw size={12} className="text-purple" style={{ animation: 'spin 4s linear infinite' }} />
                    }
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'capitalize' }}>{proj.status}</span>
                  </div>
                </div>
                
                <h3 className="blog-title">{proj.title}</h3>
                <p className="blog-excerpt">{proj.description}</p>
                
                <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '1rem', marginTop: 'auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Briefcase size={12} className="text-brand" />
                    <span>Client: {proj.client}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Calendar size={12} className="text-brand" />
                    <span>Date: {proj.completionDate}</span>
                  </div>
                </div>
              </div>
            </FluentCard>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;
