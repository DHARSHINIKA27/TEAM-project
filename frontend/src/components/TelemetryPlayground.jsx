import React, { useState, useEffect, useRef } from 'react';
import { Play, ShieldAlert, Cpu, Server, Radio, Database, RefreshCw, Terminal, CheckCircle2 } from 'lucide-react';
import './TelemetryPlayground.css';

const TelemetryPlayground = () => {
  const [nodes, setNodes] = useState([
    { id: 'node-us-east-1', name: 'US-East Core', status: 'online', load: 28, type: 'database' },
    { id: 'node-us-west-2', name: 'US-West CDN', status: 'online', load: 14, type: 'gateway' },
    { id: 'node-eu-central', name: 'EU-Central Edge', status: 'online', load: 45, type: 'compute' },
  ]);

  const [logs, setLogs] = useState([
    { id: 1, time: '13:46:12', msg: 'System initialized. Connection established with Azure-US-West.', type: 'info' },
    { id: 2, time: '13:47:05', msg: 'All active node telemetry links operational.', type: 'success' },
  ]);

  const [systemLoad, setSystemLoad] = useState(29);
  const [firewallStatus, setFirewallStatus] = useState('active'); // active, auditing, warning
  const [ddosActive, setDdosActive] = useState(false);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditProgress, setAuditProgress] = useState(0);

  const logsEndRef = useRef(null);

  // Auto-scroll logs
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  // Periodic random load changes
  useEffect(() => {
    if (ddosActive) return;
    const interval = setInterval(() => {
      setNodes(prev => prev.map(node => {
        if (node.status === 'offline') return node;
        const diff = Math.floor(Math.random() * 11) - 5; // -5 to +5
        const newLoad = Math.max(5, Math.min(95, node.load + diff));
        return { ...node, load: newLoad };
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, [ddosActive]);

  // Calculate global average load
  useEffect(() => {
    const activeNodes = nodes.filter(n => n.status !== 'offline');
    if (activeNodes.length === 0) {
      setSystemLoad(0);
      return;
    }
    const total = activeNodes.reduce((acc, curr) => acc + curr.load, 0);
    setSystemLoad(Math.round(total / activeNodes.length));
  }, [nodes]);

  const addLog = (msg, type = 'info') => {
    const time = new Date().toTimeString().split(' ')[0];
    setLogs(prev => [...prev, { id: Date.now() + Math.random(), time, msg, type }]);
  };

  const handleDeployNode = () => {
    const regions = ['APAC-Tokyo', 'US-South', 'EU-West', 'LATAM-Brazil'];
    const selectedRegion = regions[Math.floor(Math.random() * regions.length)];
    const types = ['compute', 'database', 'gateway'];
    const selectedType = types[Math.floor(Math.random() * types.length)];
    const id = `node-${selectedRegion.toLowerCase()}-${Date.now().toString().slice(-4)}`;

    addLog(`Initiating provisioning pipeline for container cluster on [${selectedRegion}]`, 'info');
    
    // Provisioning state
    const newNode = { id, name: `${selectedRegion} Stack`, status: 'scaling', load: 10, type: selectedType };
    setNodes(prev => [...prev, newNode]);

    setTimeout(() => {
      setNodes(prev => prev.map(n => n.id === id ? { ...n, status: 'online', load: 25 } : n));
      addLog(`Container cluster deployment completed successfully on [${selectedRegion}]`, 'success');
    }, 2500);
  };

  const handleShutdownNode = (id, name) => {
    addLog(`Graceful shutdown command sent to node node group [${name}]`, 'warning');
    setNodes(prev => prev.map(n => n.id === id ? { ...n, status: 'offline', load: 0 } : n));

    setTimeout(() => {
      setNodes(prev => prev.filter(n => n.id !== id));
      addLog(`De-provisioned node resources for [${name}] successfully.`, 'info');
    }, 2000);
  };

  const handleRunAudit = () => {
    if (isAuditing) return;
    setIsAuditing(true);
    setAuditProgress(0);
    setFirewallStatus('auditing');
    addLog('Starting zero-trust perimeter vulnerability security scan...', 'warning');

    const interval = setInterval(() => {
      setAuditProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsAuditing(false);
          setFirewallStatus('active');
          addLog('Zero-trust threat audit: 0 active vulnerabilities. Firewall signatures updated.', 'success');
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleSimulateDDoS = () => {
    if (ddosActive) return;
    setDdosActive(true);
    setFirewallStatus('warning');
    addLog('CRITICAL: Massive concurrent requests spike detected on US-West CDN Gateway!', 'error');
    addLog('ATTACK TYPE: Distributed Denial of Service (DDoS) - Vector: UDP Amplification', 'error');

    // Spike all node loads
    setNodes(prev => prev.map(n => ({ ...n, load: n.status === 'online' ? 98 : n.load })));

    // Phase 2: System warning alerts & scaling action
    setTimeout(() => {
      addLog('COGNITIVE ALERT: Global load threshold exceeded (>90%). Initiating automated auto-scale backup protocol.', 'warning');
      
      // Auto-deploy scaling nodes
      const scalingNodes = [
        { id: 'scale-1', name: 'Auto-Scale East (Burst)', status: 'scaling', load: 10, type: 'compute' },
        { id: 'scale-2', name: 'Auto-Scale West (Burst)', status: 'scaling', load: 10, type: 'gateway' }
      ];
      setNodes(prev => [...prev, ...scalingNodes]);

      // Phase 3: Scaling nodes go online, distribute load
      setTimeout(() => {
        setNodes(prev => prev.map(n => {
          if (n.id.startsWith('scale-')) {
            return { ...n, status: 'online', load: 42 };
          }
          if (n.status === 'online') {
            return { ...n, load: 38 }; // Load mitigates
          }
          return n;
        }));
        setFirewallStatus('active');
        setDdosActive(false);
        addLog('MITIGATION SUCCESS: Network scrubbers deployed. Multi-tenant load distributed successfully.', 'success');
        
        // Remove scaling nodes after 6 seconds to optimize cost
        setTimeout(() => {
          addLog('De-scaling temporary burst clusters to optimize budget.', 'info');
          setNodes(prev => prev.filter(n => !n.id.startsWith('scale-')));
        }, 6000);

      }, 4000);

    }, 3000);
  };

  const getNodeIcon = (type) => {
    switch (type) {
      case 'database': return <Database size={16} />;
      case 'gateway': return <Radio size={16} />;
      default: return <Cpu size={16} />;
    }
  };

  return (
    <section className={`telemetry-section ${ddosActive ? 'ddos-alert-active' : ''} fluent-glass`}>
      <div className="telemetry-header">
        <div className="telemetry-title-block">
          <Terminal className="text-brand pulse" size={20} />
          <h2>Azure Cognitive Network Sandbox</h2>
          <span className="telemetry-live-badge">LIVE SIMULATOR</span>
        </div>
        <p className="telemetry-subtitle">
          Observe zero-trust load balancing and auto-scaling defenses in real-time. Execute commands below to interact with the cluster.
        </p>
      </div>

      <div className="telemetry-grid">
        {/* Left Side: System Metrics & Nodes Visual Grid */}
        <div className="telemetry-visualizer">
          {/* Main Gauges Row */}
          <div className="telemetry-gauges">
            <div className="gauge-card fluent-glass">
              <span className="gauge-label">Cluster Status</span>
              <div className="gauge-value">
                <span className={`status-orb ${ddosActive ? 'status-critical' : 'status-healthy'}`} />
                <span>{ddosActive ? 'MITIGATING' : 'HEALTHY'}</span>
              </div>
            </div>

            <div className="gauge-card fluent-glass">
              <span className="gauge-label">Avg System Load</span>
              <div className="gauge-value font-mono">
                <span className={systemLoad > 80 ? 'text-error' : systemLoad > 50 ? 'text-warning' : 'text-teal'}>
                  {systemLoad}%
                </span>
              </div>
              <div className="gauge-bar-bg">
                <div className="gauge-bar" style={{ width: `${systemLoad}%`, background: systemLoad > 80 ? 'var(--color-error)' : 'var(--color-brand)' }} />
              </div>
            </div>

            <div className="gauge-card fluent-glass">
              <span className="gauge-label">Active Endpoints</span>
              <div className="gauge-value font-mono">
                {nodes.filter(n => n.status === 'online').length} / {nodes.length}
              </div>
            </div>
          </div>

          {/* Node Infrastructure Clusters Visual Map */}
          <div className="nodes-network-visual">
            <div className="grid-overlay" />
            <div className="network-connections-layer">
              {/* Decorative connection lines */}
              <svg className="svg-lines">
                <line x1="15%" y1="50%" x2="50%" y2="50%" className={`net-line ${ddosActive ? 'line-alert' : ''}`} />
                <line x1="50%" y1="50%" x2="85%" y2="50%" className={`net-line ${ddosActive ? 'line-alert' : ''}`} />
              </svg>
            </div>

            <div className="nodes-flex-container">
              {nodes.map(node => (
                <div 
                  key={node.id} 
                  className={`node-pod fluent-glass node-${node.status} ${node.load > 80 ? 'node-overloaded' : ''}`}
                >
                  <div className="node-icon-wrapper">
                    {getNodeIcon(node.type)}
                  </div>
                  <div className="node-info">
                    <span className="node-name">{node.name}</span>
                    <span className="node-id font-mono">{node.id}</span>
                  </div>
                  
                  <div className="node-load-row">
                    <div className="node-mini-progress">
                      <div className="node-mini-bar" style={{ width: `${node.load}%`, background: node.load > 85 ? 'var(--color-error)' : 'var(--color-accent-teal)' }} />
                    </div>
                    <span className="node-load-text font-mono">{node.load}%</span>
                  </div>

                  {node.status === 'online' && (
                    <button 
                      onClick={() => handleShutdownNode(node.id, node.name)} 
                      className="node-action-btn font-mono"
                      title="Shut down node"
                    >
                      SHUTDOWN
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Command Sandbox Control Deck */}
          <div className="telemetry-controls-deck">
            <button className="btn btn-primary" onClick={handleDeployNode} disabled={ddosActive}>
              <PlusIcon />
              <span>Deploy Node Cluster</span>
            </button>
            
            <button className="btn btn-outline border-purple text-purple" onClick={handleRunAudit} disabled={isAuditing || ddosActive}>
              {isAuditing ? <RefreshCw size={14} className="spin" /> : <CheckCircle2 size={14} />}
              <span>{isAuditing ? `Auditing (${auditProgress}%)` : 'Run Zero-Trust Audit'}</span>
            </button>
            
            <button className="btn btn-outline border-red text-red btn-ddos" onClick={handleSimulateDDoS} disabled={ddosActive}>
              <ShieldAlert size={14} className={ddosActive ? 'pulse' : ''} />
              <span>Simulate DDoS Attack</span>
            </button>
          </div>
        </div>

        {/* Right Side: Log Console Terminal */}
        <div className="telemetry-terminal fluent-glass">
          <div className="terminal-header-bar">
            <div className="terminal-dot" />
            <div className="terminal-dot" />
            <div className="terminal-dot" />
            <span className="terminal-title font-mono">azure-firewall-stream@neural-it-shell</span>
          </div>

          <div className="terminal-body font-mono">
            {logs.map(log => (
              <div key={log.id} className={`terminal-log-line log-${log.type}`}>
                <span className="log-time">[{log.time}]</span>
                <span className="log-msg">{log.msg}</span>
              </div>
            ))}
            <div ref={logsEndRef} />
          </div>
        </div>
      </div>
    </section>
  );
};

// SVG Icon helpers
const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

export default TelemetryPlayground;
