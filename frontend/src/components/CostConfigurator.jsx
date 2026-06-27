import React, { useState, useEffect } from 'react';
import { Cpu, Database, ShieldAlert, Award, FileText, Check } from 'lucide-react';
import './CostConfigurator.css';

const CostConfigurator = ({ onApplyBlueprint }) => {
  const [nodes, setNodes] = useState(5);
  const [storage, setStorage] = useState(500); // in GB
  const [securityTier, setSecurityTier] = useState('pro'); // standard, pro, fortress
  const [supportTier, setSupportTier] = useState('ops'); // basic, ops, dedicated
  const [totalCost, setTotalCost] = useState(0);
  const [blueprintText, setBlueprintText] = useState('');
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    // Math formulas for monthly cost
    const nodeCost = nodes * 45;
    const storageCost = Math.round(storage * 0.08);
    
    let securityCost = 0;
    if (securityTier === 'pro') securityCost = 150;
    if (securityTier === 'fortress') securityCost = 350;

    let supportCost = 0;
    if (supportTier === 'ops') supportCost = 200;
    if (supportTier === 'dedicated') supportCost = 500;

    const baseCost = 99;
    const calculatedTotal = baseCost + nodeCost + storageCost + securityCost + supportCost;
    setTotalCost(calculatedTotal);

    // Generate Architectural blueprint spec details
    const blueprint = `--- AZURE CLOUD ARCHITECTURE BLUEPRINT SPEC ---
Deployment Standard: ISO 27001 / Zero-Trust Perimeter
Provisioned Resources:
  - Container Node Pods: ${nodes} cores [Auto-scaling Enabled]
  - Dedicated SAN Storage: ${storage >= 1000 ? `${(storage / 1000).toFixed(1)} TB` : `${storage} GB`} SSD
Security Integration:
  - Level: ${securityTier === 'standard' ? 'Standard Border Shield' : securityTier === 'pro' ? 'Pro SIEM Threat Analysis' : 'Zero-Trust Cyber Fortress'}
Support Operations:
  - Plan: ${supportTier === 'basic' ? 'Business Hours SLA' : supportTier === 'ops' ? '24/7 Operations Desk' : 'Dedicated Systems Architect'}
Estimated Infrastructure Budget: $${calculatedTotal}/mo
--------------------------------------------`;
    setBlueprintText(blueprint);
  }, [nodes, storage, securityTier, supportTier]);

  const handleApply = () => {
    if (onApplyBlueprint) {
      onApplyBlueprint(blueprintText);
      setApplied(true);
      setTimeout(() => setApplied(false), 3000);
    }
  };

  return (
    <div className="cost-configurator-card fluent-glass">
      <div className="config-header">
        <Cpu className="text-teal" size={20} />
        <h3>Zero-Trust Cloud Cost Configurator</h3>
      </div>
      <p className="config-desc">
        Configure your parameters dynamically to estimate monthly Azure resource fees and compile a deployment blueprint.
      </p>

      <div className="config-body">
        {/* Controls Column */}
        <div className="config-inputs">
          {/* Node count slider */}
          <div className="config-row">
            <div className="config-label-row">
              <span className="input-title">Virtual Node Clusters</span>
              <span className="badge badge-brand font-mono">{nodes} Node{nodes > 1 ? 's' : ''}</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="50" 
              value={nodes} 
              onChange={(e) => setNodes(parseInt(e.target.value))}
              className="config-range-slider"
            />
            <div className="slider-limits font-mono">
              <span>1 Node</span>
              <span>50 Nodes Max</span>
            </div>
          </div>

          {/* Storage slider */}
          <div className="config-row">
            <div className="config-label-row">
              <span className="input-title">High-Speed SSD Storage</span>
              <span className="badge badge-teal font-mono">
                {storage >= 1000 ? `${(storage / 1000).toFixed(1)} TB` : `${storage} GB`}
              </span>
            </div>
            <input 
              type="range" 
              min="100" 
              max="10000" 
              step="100"
              value={storage} 
              onChange={(e) => setStorage(parseInt(e.target.value))}
              className="config-range-slider"
            />
            <div className="slider-limits font-mono">
              <span>100 GB</span>
              <span>10 TB Max</span>
            </div>
          </div>

          {/* Security Tier */}
          <div className="config-row">
            <span className="input-title">Security & Perimeter Shield</span>
            <div className="tier-selector">
              <button 
                type="button"
                className={`tier-btn ${securityTier === 'standard' ? 'active' : ''}`}
                onClick={() => setSecurityTier('standard')}
              >
                <span>Standard</span>
              </button>
              <button 
                type="button"
                className={`tier-btn ${securityTier === 'pro' ? 'active' : ''}`}
                onClick={() => setSecurityTier('pro')}
              >
                <span>Pro SIEM</span>
              </button>
              <button 
                type="button"
                className={`tier-btn ${securityTier === 'fortress' ? 'active' : ''}`}
                onClick={() => setSecurityTier('fortress')}
              >
                <span>Fortress</span>
              </button>
            </div>
          </div>

          {/* Support tier */}
          <div className="config-row">
            <span className="input-title">Support Operational SLA</span>
            <div className="tier-selector">
              <button 
                type="button"
                className={`tier-btn ${supportTier === 'basic' ? 'active' : ''}`}
                onClick={() => setSupportTier('basic')}
              >
                <span>Basic</span>
              </button>
              <button 
                type="button"
                className={`tier-btn ${supportTier === 'ops' ? 'active' : ''}`}
                onClick={() => setSupportTier('ops')}
              >
                <span>24/7 Ops</span>
              </button>
              <button 
                type="button"
                className={`tier-btn ${supportTier === 'dedicated' ? 'active' : ''}`}
                onClick={() => setSupportTier('dedicated')}
              >
                <span>Dedicated</span>
              </button>
            </div>
          </div>
        </div>

        {/* Pricing & Blueprint output column */}
        <div className="config-outputs fluent-glass">
          <div className="cost-total-box">
            <span className="cost-total-label">Estimated Monthly Fee</span>
            <div className="cost-total-value font-mono">
              <span className="currency">$</span>
              <span className="amount">{totalCost}</span>
              <span className="frequency">/mo</span>
            </div>
            <p className="pricing-disclaimer">Subject to licensing and Azure region selections.</p>
          </div>

          <div className="blueprint-preview-box">
            <div className="blueprint-header font-mono">
              <FileText size={12} />
              <span>spec-blueprint.txt</span>
            </div>
            <pre className="blueprint-pre font-mono">{blueprintText}</pre>
          </div>

          <button 
            type="button"
            className={`btn w-full btn-apply-blueprint ${applied ? 'btn-applied' : 'btn-primary'}`}
            onClick={handleApply}
          >
            {applied ? <Check size={16} /> : <FileText size={16} />}
            <span>{applied ? 'Blueprint Applied' : 'Apply Blueprint to Form'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CostConfigurator;
