const fs = require('fs');
const path = require('path');

const industries = [
  { name: 'pharma.svg', title: 'Pharmaceutical Cleanroom', iconColor: '#0284c7', sub: '21 CFR Part 11 & Touchless Airlocks' },
  { name: 'manufacturing.svg', title: 'Heavy Manufacturing', iconColor: '#d97706', sub: 'Rugged Sensors & Shift Rosters' },
  { name: 'msme.svg', title: 'MSME & Small Business', iconColor: '#2563eb', sub: 'Cost-Effective Plug & Play USB' },
  { name: 'enterprise.svg', title: 'Large Scale Campuses', iconColor: '#4f46e5', sub: 'Turnstiles & Central ERP Sync' },
  { name: 'corporate.svg', title: 'Corporate Offices & IT', iconColor: '#0284c7', sub: 'Glass Door EM Locks & Aesthetics' },
  { name: 'education.svg', title: 'Schools & Colleges', iconColor: '#059669', sub: 'RFID Badges & Parent SMS Alerts' },
  { name: 'healthcare.svg', title: 'Hospitals & Healthcare', iconColor: '#dc2626', sub: 'Hygienic Face & ICU Restricted Zones' },
  { name: 'gym.svg', title: 'Gyms & Fitness Centres', iconColor: '#f59e0b', sub: 'Expiry Lockout & Turnstile Gates' },
  { name: 'logistics.svg', title: 'Warehouses & Logistics', iconColor: '#ea580c', sub: 'Multi-Dock Shifts & Cargo Security' },
  { name: 'retail.svg', title: 'Retail Stores & Showrooms', iconColor: '#0284c7', sub: 'Wi-Fi Cloud Sync Across Hyderabad' }
];

industries.forEach(ind => {
  const content = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240" width="100%" height="100%">
  <rect width="400" height="240" fill="#0b2545" rx="12"/>
  <rect x="20" y="20" width="360" height="200" rx="10" fill="#134074" opacity="0.6"/>
  <circle cx="200" cy="90" r="45" fill="#0b2545" stroke="${ind.iconColor}" stroke-width="3"/>
  <circle cx="200" cy="90" r="22" fill="${ind.iconColor}" opacity="0.85"/>
  <text x="200" y="165" font-family="system-ui, sans-serif" font-size="16" font-weight="bold" fill="#ffffff" text-anchor="middle">${ind.title}</text>
  <text x="200" y="190" font-family="system-ui, sans-serif" font-size="11" fill="#93c5fd" text-anchor="middle">${ind.sub}</text>
</svg>
`;
  const p = path.join(__dirname, '..', 'public', 'images', 'industries', ind.name);
  fs.writeFileSync(p, content.trim(), 'utf8');
});

console.log('Generated 10 industry SVGs!');

