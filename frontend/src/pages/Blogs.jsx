import React, { useEffect, useState } from 'react';
import FluentCard from '../components/FluentCard';
import { API_BASE } from '../context/AuthContext';
import { ArrowLeft, User, Calendar, Clock, Tag } from 'lucide-react';
import './Pages.css';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch(`${API_BASE}/blogs`);
        if (res.ok) {
          const data = await res.json();
          // Show published posts
          setBlogs(data.filter(b => b.status === 'published'));
        }
      } catch (err) {
        console.error('Error fetching blogs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div className="page-blogs section container animate-fade-in" style={{ paddingTop: '100px' }}>
      <div className="section-header">
        <span className="section-badge">Insights Hub</span>
        <h1 className="section-title">Technical Publications</h1>
        <p className="section-desc">
          Deep-dive architecture breakdowns, security reports, and strategy analyses written directly by our lead system developers.
        </p>
      </div>

      {loading ? (
        <div className="loading-spinner">Loading article caches...</div>
      ) : (
        <div className="blog-grid">
          {blogs.map(post => (
            <FluentCard 
              key={post.id} 
              className="blog-card" 
              style={{ padding: 0 }}
              onClick={() => setSelectedPost(post)}
            >
              <img src={post.image} alt={post.title} className="blog-img" />
              <div className="blog-body">
                <div className="blog-meta-row">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Tag size={12} className="text-teal" />
                    <span>{post.category}</span>
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Clock size={12} />
                    <span>{post.readTime}</span>
                  </span>
                </div>
                
                <h3 className="blog-title">{post.title}</h3>
                <p className="blog-excerpt">{post.excerpt}</p>
                
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 'auto', borderTop: '1px solid var(--glass-border)', paddingTop: '0.75rem' }}>
                  <span>By {post.author}</span>
                  <span>&bull;</span>
                  <span>{post.date}</span>
                </div>
              </div>
            </FluentCard>
          ))}
        </div>
      )}

      {/* Full Page Article Viewer Overlay */}
      {selectedPost && (
        <div className="blog-overlay animate-fade-in">
          <div className="blog-overlay-container">
            <button className="blog-back-btn" onClick={() => setSelectedPost(null)}>
              <ArrowLeft size={16} />
              <span>Back to Hub</span>
            </button>
            
            <img src={selectedPost.image} alt={selectedPost.title} className="blog-detail-img" />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <span className="badge badge-brand" style={{ width: 'max-content' }}>{selectedPost.category}</span>
              <h2 className="blog-detail-title">{selectedPost.title}</h2>
              
              <div className="blog-detail-meta">
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <User size={14} className="text-brand" />
                  <span>{selectedPost.author}</span>
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Calendar size={14} className="text-teal" />
                  <span>{selectedPost.date}</span>
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Clock size={14} className="text-purple" />
                  <span>{selectedPost.readTime}</span>
                </span>
              </div>
            </div>

            <div className="blog-detail-content">
              {selectedPost.content}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blogs;
