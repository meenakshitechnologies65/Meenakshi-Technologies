const fs = require('fs');
const path = require('path');

function saveSvg(filePath, content) {
  const fullPath = path.join(__dirname, '..', filePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim(), 'utf8');
  console.log(`Generated: ${filePath}`);
}

// 1. eSSL K30 Pro
saveSvg('public/images/products/essl-k30-pro.svg', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 320" width="100%" height="100%">
  <defs>
    <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e293b"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
    <linearGradient id="screenGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0284c7"/>
      <stop offset="100%" stop-color="#0369a1"/>
    </linearGradient>
    <linearGradient id="sensorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f766e"/>
      <stop offset="100%" stop-color="#14b8a6"/>
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000" flood-opacity="0.35"/>
    </filter>
  </defs>
  <!-- Background Glow -->
  <rect width="400" height="320" fill="#f8fafc" rx="16"/>
  <!-- Device Chassis -->
  <rect x="50" y="30" width="300" height="260" rx="18" fill="url(#bodyGrad)" filter="url(#shadow)" stroke="#334155" stroke-width="2"/>
  <!-- Accent Silver Trim -->
  <rect x="62" y="42" width="276" height="236" rx="12" fill="none" stroke="#475569" stroke-width="1.5" stroke-dasharray="4 2"/>
  
  <!-- Screen Section -->
  <rect x="75" y="55" width="160" height="100" rx="8" fill="#000" stroke="#1e293b" stroke-width="2"/>
  <rect x="80" y="60" width="150" height="90" rx="6" fill="url(#screenGrad)"/>
  <text x="155" y="85" font-family="system-ui, sans-serif" font-size="11" font-weight="bold" fill="#fff" text-anchor="middle">eSSL K30 Pro</text>
  <text x="155" y="112" font-family="system-ui, sans-serif" font-size="22" font-weight="900" fill="#ffffff" text-anchor="middle">09:42:18</text>
  <text x="155" y="134" font-family="system-ui, sans-serif" font-size="10" fill="#bae6fd" text-anchor="middle">FRIDAY, NOV 06 2026</text>
  
  <!-- Optical Fingerprint Sensor -->
  <rect x="250" y="55" width="75" height="100" rx="10" fill="#020617" stroke="#334155" stroke-width="2"/>
  <rect x="257" y="65" width="61" height="80" rx="8" fill="url(#sensorGrad)"/>
  <path d="M287 78 C278 78 271 85 271 94 C271 106 287 114 287 130" fill="none" stroke="#ccfbf1" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M287 84 C281 84 276 89 276 96 C276 104 287 112 287 125" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
  <path d="M294 92 C294 88 290 85 287 85" fill="none" stroke="#5eead4" stroke-width="2" stroke-linecap="round"/>
  
  <!-- Keypad Area -->
  <g fill="#334155">
    <rect x="75" y="170" width="34" height="24" rx="4"/><text x="92" y="186" font-family="sans-serif" font-size="12" fill="#fff" text-anchor="middle">1</text>
    <rect x="117" y="170" width="34" height="24" rx="4"/><text x="134" y="186" font-family="sans-serif" font-size="12" fill="#fff" text-anchor="middle">2</text>
    <rect x="159" y="170" width="34" height="24" rx="4"/><text x="176" y="186" font-family="sans-serif" font-size="12" fill="#fff" text-anchor="middle">3</text>
    <rect x="201" y="170" width="34" height="24" rx="4"/><text x="218" y="186" font-family="sans-serif" font-size="12" fill="#38bdf8" text-anchor="middle">ESC</text>
    
    <rect x="75" y="202" width="34" height="24" rx="4"/><text x="92" y="218" font-family="sans-serif" font-size="12" fill="#fff" text-anchor="middle">4</text>
    <rect x="117" y="202" width="34" height="24" rx="4"/><text x="134" y="218" font-family="sans-serif" font-size="12" fill="#fff" text-anchor="middle">5</text>
    <rect x="159" y="202" width="34" height="24" rx="4"/><text x="176" y="218" font-family="sans-serif" font-size="12" fill="#fff" text-anchor="middle">6</text>
    <rect x="201" y="202" width="34" height="24" rx="4"/><text x="218" y="218" font-family="sans-serif" font-size="12" fill="#38bdf8" text-anchor="middle">▲</text>

    <rect x="75" y="234" width="34" height="24" rx="4"/><text x="92" y="250" font-family="sans-serif" font-size="12" fill="#fff" text-anchor="middle">7</text>
    <rect x="117" y="234" width="34" height="24" rx="4"/><text x="134" y="250" font-family="sans-serif" font-size="12" fill="#fff" text-anchor="middle">8</text>
    <rect x="159" y="234" width="34" height="24" rx="4"/><text x="176" y="250" font-family="sans-serif" font-size="12" fill="#fff" text-anchor="middle">9</text>
    <rect x="201" y="234" width="34" height="24" rx="4"/><text x="218" y="250" font-family="sans-serif" font-size="12" fill="#22c55e" text-anchor="middle">OK</text>
  </g>
  <!-- Card Badge / Battery Indicator -->
  <rect x="250" y="170" width="75" height="88" rx="8" fill="#1e293b" stroke="#334155" stroke-width="1.5"/>
  <circle cx="287" cy="195" r="14" fill="#0369a1" opacity="0.3"/>
  <circle cx="287" cy="195" r="8" fill="#38bdf8"/>
  <text x="287" y="222" font-family="sans-serif" font-size="9" fill="#94a3b8" text-anchor="middle">RFID CARD</text>
  <text x="287" y="244" font-family="sans-serif" font-size="8" font-weight="bold" fill="#22c55e" text-anchor="middle">BATTERY READY</text>
</svg>
`);

// 2. eSSL SilkBio-100TC
saveSvg('public/images/products/essl-silkbio-100tc.svg', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 320" width="100%" height="100%">
  <defs>
    <linearGradient id="sbChassis" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#334155"/>
      <stop offset="50%" stop-color="#1e293b"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
    <linearGradient id="cameraBar" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#090d16"/>
      <stop offset="100%" stop-color="#111827"/>
    </linearGradient>
    <filter id="sbShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="10" stdDeviation="14" flood-color="#000" flood-opacity="0.35"/>
    </filter>
  </defs>
  <rect width="400" height="320" fill="#f8fafc" rx="16"/>
  <!-- Device Chassis -->
  <rect x="60" y="25" width="280" height="270" rx="20" fill="url(#sbChassis)" filter="url(#sbShadow)" stroke="#475569" stroke-width="2"/>
  
  <!-- Dual Camera Top Module -->
  <rect x="80" y="42" width="240" height="55" rx="10" fill="url(#cameraBar)" stroke="#1e293b" stroke-width="2"/>
  <!-- Left IR LED Array -->
  <circle cx="110" cy="70" r="10" fill="#7f1d1d" opacity="0.8"/>
  <circle cx="110" cy="70" r="5" fill="#ef4444"/>
  <!-- Central Cameras -->
  <circle cx="180" cy="70" r="12" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>
  <circle cx="180" cy="70" r="6" fill="#0284c7"/>
  <circle cx="220" cy="70" r="12" fill="#0f172a" stroke="#818cf8" stroke-width="2"/>
  <circle cx="220" cy="70" r="6" fill="#4f46e5"/>
  <!-- Right IR LED Array -->
  <circle cx="290" cy="70" r="10" fill="#7f1d1d" opacity="0.8"/>
  <circle cx="290" cy="70" r="5" fill="#ef4444"/>

  <!-- Screen Section -->
  <rect x="80" y="110" width="145" height="110" rx="8" fill="#020617" stroke="#334155" stroke-width="1.5"/>
  <rect x="86" y="116" width="133" height="98" rx="6" fill="#0f172a"/>
  <!-- Screen Face Frame -->
  <path d="M110 140 L120 140 M110 140 L110 150" stroke="#38bdf8" stroke-width="2" fill="none"/>
  <path d="M195 140 L185 140 M195 140 L195 150" stroke="#38bdf8" stroke-width="2" fill="none"/>
  <path d="M110 190 L120 190 M110 190 L110 180" stroke="#38bdf8" stroke-width="2" fill="none"/>
  <path d="M195 190 L185 190 M195 190 L195 180" stroke="#38bdf8" stroke-width="2" fill="none"/>
  <circle cx="152" cy="165" r="18" fill="none" stroke="#22c55e" stroke-width="2" stroke-dasharray="3 3"/>
  <text x="152" y="198" font-family="sans-serif" font-size="9" fill="#22c55e" font-weight="bold" text-anchor="middle">VERIFIED</text>

  <!-- SilkID Fingerprint Sensor -->
  <rect x="240" y="110" width="80" height="110" rx="10" fill="#020617" stroke="#38bdf8" stroke-width="2"/>
  <rect x="248" y="120" width="64" height="90" rx="8" fill="#0284c7" opacity="0.85"/>
  <path d="M280 135 C270 135 264 142 264 152 C264 167 280 175 280 195" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M280 142 C273 142 269 148 269 156 C269 166 280 172 280 187" fill="none" stroke="#bae6fd" stroke-width="2" stroke-linecap="round"/>
  <text x="280" y="206" font-family="sans-serif" font-size="8" font-weight="bold" fill="#fff" text-anchor="middle">SILK ID</text>

  <!-- Bottom Brand & Access Badges -->
  <rect x="80" y="235" width="240" height="42" rx="8" fill="#0f172a" stroke="#334155" stroke-width="1"/>
  <text x="135" y="260" font-family="system-ui, sans-serif" font-size="12" font-weight="900" fill="#f8fafc">eSSL SilkBio</text>
  <text x="255" y="260" font-family="system-ui, sans-serif" font-size="10" fill="#38bdf8" font-weight="bold">ACCESS RELAY</text>
</svg>
`);

// 3. Biomax SpeedFace 5
saveSvg('public/images/products/biomax-speedface-5.svg', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 320" width="100%" height="100%">
  <defs>
    <linearGradient id="speedChassis" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#1e293b"/>
    </linearGradient>
    <linearGradient id="ipsDisplay" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1e1b4b"/>
      <stop offset="50%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#020617"/>
    </linearGradient>
  </defs>
  <rect width="400" height="320" fill="#f8fafc" rx="16"/>
  <!-- Tall Modern AI Terminal Chassis -->
  <rect x="115" y="15" width="170" height="290" rx="22" fill="url(#speedChassis)" stroke="#38bdf8" stroke-width="2" filter="drop-shadow(0 12px 18px rgba(0,0,0,0.3))"/>
  
  <!-- Dual Cameras & Light Sensors -->
  <circle cx="160" cy="45" r="9" fill="#020617" stroke="#64748b" stroke-width="1.5"/>
  <circle cx="160" cy="45" r="4" fill="#38bdf8"/>
  <circle cx="205" cy="45" r="9" fill="#020617" stroke="#64748b" stroke-width="1.5"/>
  <circle cx="205" cy="45" r="4" fill="#818cf8"/>
  <rect x="180" y="42" width="6" height="6" rx="2" fill="#22c55e"/>

  <!-- 5-Inch IPS Touch Screen -->
  <rect x="130" y="68" width="140" height="195" rx="12" fill="url(#ipsDisplay)" stroke="#1e293b" stroke-width="1.5"/>
  
  <!-- AI Recognition HUD -->
  <ellipse cx="200" cy="135" rx="36" ry="46" fill="none" stroke="#38bdf8" stroke-width="2" stroke-dasharray="6 3"/>
  <circle cx="200" cy="135" r="4" fill="#22c55e"/>
  
  <!-- Recognition Stats on Screen -->
  <text x="200" y="196" font-family="sans-serif" font-size="11" font-weight="bold" fill="#ffffff" text-anchor="middle">Access Granted</text>
  <text x="200" y="210" font-family="sans-serif" font-size="9" fill="#4ade80" text-anchor="middle">TEMP: 36.5°C | MASK OK</text>
  <text x="200" y="226" font-family="sans-serif" font-size="8" fill="#94a3b8" text-anchor="middle">TIME: 09:14:02 AM</text>
  
  <!-- Brand Footer -->
  <text x="200" y="285" font-family="system-ui, sans-serif" font-size="11" font-weight="900" fill="#f8fafc" letter-spacing="1" text-anchor="middle">BIOMAX AI</text>
</svg>
`);

// 4. Electromagnetic Lock 600 lbs
saveSvg('public/images/products/em-lock-600lbs.svg', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 320" width="100%" height="100%">
  <defs>
    <linearGradient id="silverBody" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#f8fafc"/>
      <stop offset="50%" stop-color="#cbd5e1"/>
      <stop offset="100%" stop-color="#94a3b8"/>
    </linearGradient>
    <linearGradient id="armaturePlate" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#64748b"/>
      <stop offset="100%" stop-color="#334155"/>
    </linearGradient>
  </defs>
  <rect width="400" height="320" fill="#f8fafc" rx="16"/>
  <!-- Mounting Bracket -->
  <rect x="40" y="60" width="320" height="25" rx="4" fill="#475569" stroke="#334155" stroke-width="1"/>
  <!-- Main Magnetic Block (Aluminium housing) -->
  <rect x="50" y="85" width="300" height="85" rx="6" fill="url(#silverBody)" stroke="#475569" stroke-width="2" filter="drop-shadow(0 8px 12px rgba(0,0,0,0.2))"/>
  
  <!-- Magnetic Core Faces -->
  <rect x="90" y="105" width="100" height="45" rx="3" fill="#1e293b" stroke="#0f172a" stroke-width="1.5"/>
  <rect x="210" y="105" width="100" height="45" rx="3" fill="#1e293b" stroke="#0f172a" stroke-width="1.5"/>
  
  <!-- LED Status Light -->
  <circle cx="70" cy="127" r="7" fill="#15803d" stroke="#22c55e" stroke-width="2"/>
  <text x="70" y="150" font-family="sans-serif" font-size="7" font-weight="bold" fill="#1e293b" text-anchor="middle">SECURE</text>

  <!-- Armature Plate -->
  <rect x="75" y="200" width="250" height="45" rx="4" fill="url(#armaturePlate)" stroke="#1e293b" stroke-width="1.5" filter="drop-shadow(0 6px 10px rgba(0,0,0,0.25))"/>
  <circle cx="200" cy="222" r="8" fill="#1e293b" stroke="#94a3b8" stroke-width="2"/>
  <circle cx="100" cy="222" r="5" fill="#0f172a"/>
  <circle cx="300" cy="222" r="5" fill="#0f172a"/>
  <text x="200" y="275" font-family="sans-serif" font-size="12" font-weight="bold" fill="#0f172a" text-anchor="middle">600 LBS (280 KG) HOLDING FORCE</text>
  <text x="200" y="295" font-family="sans-serif" font-size="10" fill="#64748b" text-anchor="middle">Fail-Safe 12V/24V DC Electromagnetic Lock</text>
</svg>
`);

// 5. eSSL F22
saveSvg('public/images/products/essl-f22.svg', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 320" width="100%" height="100%">
  <rect width="400" height="320" fill="#f8fafc" rx="16"/>
  <!-- Ultra-Slim Door Access Terminal -->
  <rect x="135" y="20" width="130" height="280" rx="16" fill="#0a0f1d" stroke="#38bdf8" stroke-width="2" filter="drop-shadow(0 10px 16px rgba(0,0,0,0.3))"/>
  
  <!-- Screen Section -->
  <rect x="148" y="36" width="104" height="65" rx="6" fill="#0284c7"/>
  <text x="200" y="58" font-family="sans-serif" font-size="9" font-weight="bold" fill="#fff" text-anchor="middle">eSSL F22 Ultra-Thin</text>
  <text x="200" y="78" font-family="sans-serif" font-size="14" font-weight="900" fill="#ffffff" text-anchor="middle">10:30 AM</text>
  <text x="200" y="92" font-family="sans-serif" font-size="8" fill="#e0f2fe" text-anchor="middle">Wi-Fi Connected</text>

  <!-- Slim BioID Sensor -->
  <rect x="155" y="115" width="90" height="65" rx="8" fill="#1e293b" stroke="#38bdf8" stroke-width="1.5"/>
  <rect x="163" y="122" width="74" height="51" rx="6" fill="#0f766e"/>
  <path d="M200 132 C192 132 188 138 188 147 C188 158 200 163 200 170" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>

  <!-- Touch Keypad -->
  <g fill="#1e293b">
    <rect x="152" y="195" width="26" height="18" rx="3"/><text x="165" y="208" font-family="sans-serif" font-size="10" fill="#fff" text-anchor="middle">1</text>
    <rect x="187" y="195" width="26" height="18" rx="3"/><text x="200" y="208" font-family="sans-serif" font-size="10" fill="#fff" text-anchor="middle">2</text>
    <rect x="222" y="195" width="26" height="18" rx="3"/><text x="235" y="208" font-family="sans-serif" font-size="10" fill="#fff" text-anchor="middle">3</text>

    <rect x="152" y="220" width="26" height="18" rx="3"/><text x="165" y="233" font-family="sans-serif" font-size="10" fill="#fff" text-anchor="middle">4</text>
    <rect x="187" y="220" width="26" height="18" rx="3"/><text x="200" y="233" font-family="sans-serif" font-size="10" fill="#fff" text-anchor="middle">5</text>
    <rect x="222" y="220" width="26" height="18" rx="3"/><text x="235" y="233" font-family="sans-serif" font-size="10" fill="#fff" text-anchor="middle">6</text>

    <rect x="152" y="245" width="26" height="18" rx="3"/><text x="165" y="258" font-family="sans-serif" font-size="10" fill="#fff" text-anchor="middle">7</text>
    <rect x="187" y="245" width="26" height="18" rx="3"/><text x="200" y="258" font-family="sans-serif" font-size="10" fill="#fff" text-anchor="middle">8</text>
    <rect x="222" y="245" width="26" height="18" rx="3"/><text x="235" y="258" font-family="sans-serif" font-size="10" fill="#22c55e" text-anchor="middle">OK</text>
  </g>
  <text x="200" y="284" font-family="sans-serif" font-size="8" fill="#94a3b8" text-anchor="middle">DOOR CONTROLLER</text>
</svg>
`);

// 6. Generic Multi-Product SVG copies
const productIcons = [
  'essl-uface-202.svg',
  'essl-identix-k21.svg',
  'biomax-bio-finger-100.svg',
  'biomax-n-bm60.svg',
  'drop-bolt-lock.svg',
  'essl-inbio-260.svg',
  'rfid-cards.svg'
];

saveSvg('public/images/products/essl-uface-202.svg', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 320" width="100%" height="100%">
  <rect width="400" height="320" fill="#f8fafc" rx="16"/>
  <rect x="50" y="25" width="300" height="270" rx="18" fill="#0f172a" stroke="#2563eb" stroke-width="2" filter="drop-shadow(0 10px 14px rgba(0,0,0,0.3))"/>
  <!-- 4.3 inch Touch Display -->
  <rect x="70" y="45" width="180" height="140" rx="10" fill="#1e293b" stroke="#334155" stroke-width="2"/>
  <rect x="76" y="51" width="168" height="128" rx="8" fill="#0369a1"/>
  <text x="160" y="80" font-family="sans-serif" font-size="12" font-weight="bold" fill="#fff" text-anchor="middle">eSSL uFace 202</text>
  <circle cx="160" cy="115" r="24" fill="none" stroke="#fff" stroke-width="2"/>
  <text x="160" y="155" font-family="sans-serif" font-size="10" fill="#bae6fd" text-anchor="middle">Face &amp; Fingerprint</text>
  <!-- Infrared Cameras -->
  <rect x="270" y="45" width="60" height="140" rx="10" fill="#020617" stroke="#475569" stroke-width="1.5"/>
  <circle cx="300" cy="75" r="10" fill="#38bdf8"/>
  <circle cx="300" cy="115" r="10" fill="#ef4444"/>
  <circle cx="300" cy="155" r="10" fill="#38bdf8"/>
  <!-- Keypad & Sensor -->
  <rect x="70" y="200" width="260" height="75" rx="10" fill="#1e293b"/>
  <rect x="90" y="210" width="60" height="55" rx="6" fill="#0f766e"/>
  <text x="210" y="235" font-family="sans-serif" font-size="12" font-weight="bold" fill="#fff">Enterprise Multi-Biometric</text>
  <text x="210" y="255" font-family="sans-serif" font-size="10" fill="#94a3b8">Internal Backup Battery (4 Hrs)</text>
</svg>
`);

saveSvg('public/images/products/essl-identix-k21.svg', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 320" width="100%" height="100%">
  <rect width="400" height="320" fill="#f8fafc" rx="16"/>
  <rect x="60" y="35" width="280" height="250" rx="16" fill="#1e293b" stroke="#64748b" stroke-width="2" filter="drop-shadow(0 8px 12px rgba(0,0,0,0.25))"/>
  <rect x="80" y="55" width="140" height="90" rx="8" fill="#0284c7"/>
  <text x="150" y="90" font-family="sans-serif" font-size="12" font-weight="bold" fill="#fff" text-anchor="middle">Identix K21</text>
  <text x="150" y="115" font-family="sans-serif" font-size="16" font-weight="900" fill="#fff" text-anchor="middle">09:00 AM</text>
  <!-- Optical Sensor -->
  <rect x="240" y="55" width="80" height="90" rx="8" fill="#0f766e" stroke="#2dd4bf" stroke-width="1.5"/>
  <circle cx="280" cy="100" r="18" fill="none" stroke="#fff" stroke-width="2"/>
  <!-- Keypad Area -->
  <rect x="80" y="165" width="240" height="100" rx="8" fill="#0f172a"/>
  <text x="200" y="210" font-family="sans-serif" font-size="13" font-weight="bold" fill="#38bdf8" text-anchor="middle">Plug &amp; Play Small Office Attendance</text>
  <text x="200" y="235" font-family="sans-serif" font-size="10" fill="#94a3b8" text-anchor="middle">Direct USB Excel Reports • Zero Cloud License Fee</text>
</svg>
`);

saveSvg('public/images/products/biomax-bio-finger-100.svg', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 320" width="100%" height="100%">
  <rect width="400" height="320" fill="#f8fafc" rx="16"/>
  <rect x="55" y="30" width="290" height="260" rx="16" fill="#0f172a" stroke="#f59e0b" stroke-width="2" filter="drop-shadow(0 10px 16px rgba(0,0,0,0.3))"/>
  <rect x="75" y="50" width="150" height="100" rx="8" fill="#b45309"/>
  <text x="150" y="85" font-family="sans-serif" font-size="11" font-weight="bold" fill="#fff" text-anchor="middle">Biomax Bio-Finger 100</text>
  <text x="150" y="115" font-family="sans-serif" font-size="18" font-weight="900" fill="#fff" text-anchor="middle">SHIFT 1: IN</text>
  <!-- Scratch-Proof Sensor -->
  <rect x="245" y="50" width="80" height="100" rx="8" fill="#1e293b" stroke="#f59e0b" stroke-width="1.5"/>
  <rect x="253" y="60" width="64" height="80" rx="6" fill="#047857"/>
  <!-- Keypad & Network -->
  <rect x="75" y="170" width="250" height="100" rx="8" fill="#1e293b"/>
  <text x="200" y="210" font-family="sans-serif" font-size="13" font-weight="bold" fill="#fbbf24" text-anchor="middle">High-Capacity Industrial Terminal</text>
  <text x="200" y="235" font-family="sans-serif" font-size="10" fill="#cbd5e1" text-anchor="middle">5,000 Fingerprints • 150,000 Transactions • TCP/IP</text>
</svg>
`);

saveSvg('public/images/products/biomax-n-bm60.svg', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 320" width="100%" height="100%">
  <rect width="400" height="320" fill="#f8fafc" rx="16"/>
  <rect x="65" y="25" width="270" height="270" rx="18" fill="#1e293b" stroke="#38bdf8" stroke-width="2" filter="drop-shadow(0 8px 14px rgba(0,0,0,0.3))"/>
  <rect x="85" y="45" width="230" height="120" rx="10" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>
  <circle cx="120" cy="75" r="8" fill="#ef4444"/>
  <circle cx="280" cy="75" r="8" fill="#ef4444"/>
  <circle cx="200" cy="75" r="10" fill="#38bdf8"/>
  <text x="200" y="115" font-family="sans-serif" font-size="12" font-weight="bold" fill="#fff" text-anchor="middle">Biomax N-BM60 Cloud</text>
  <text x="200" y="138" font-family="sans-serif" font-size="10" fill="#38bdf8" text-anchor="middle">Wi-Fi Multi-Biometric (Face + Finger)</text>
  <!-- Bottom Specs -->
  <rect x="85" y="180" width="230" height="95" rx="8" fill="#020617"/>
  <text x="200" y="215" font-family="sans-serif" font-size="12" font-weight="bold" fill="#4ade80" text-anchor="middle">Cloud Push Protocol Ready</text>
  <text x="200" y="240" font-family="sans-serif" font-size="10" fill="#94a3b8" text-anchor="middle">Connect Multiple Hyderabad Branches Seamlessly</text>
</svg>
`);

saveSvg('public/images/products/drop-bolt-lock.svg', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 320" width="100%" height="100%">
  <rect width="400" height="320" fill="#f8fafc" rx="16"/>
  <rect x="50" y="80" width="300" height="90" rx="8" fill="#334155" stroke="#475569" stroke-width="2" filter="drop-shadow(0 8px 12px rgba(0,0,0,0.2))"/>
  <!-- Stainless Solid Throw Bolt -->
  <rect x="180" y="170" width="40" height="65" rx="6" fill="#94a3b8" stroke="#cbd5e1" stroke-width="2"/>
  <circle cx="200" cy="125" r="16" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>
  <text x="200" y="130" font-family="sans-serif" font-size="10" font-weight="bold" fill="#38bdf8" text-anchor="middle">12V</text>
  <text x="200" y="265" font-family="sans-serif" font-size="12" font-weight="bold" fill="#0f172a" text-anchor="middle">Heavy-Duty Electric Drop Bolt Lock</text>
  <text x="200" y="285" font-family="sans-serif" font-size="10" fill="#64748b" text-anchor="middle">Fail-Safe Motorized Solid Stainless Bolt with Auto-Relock Timer</text>
</svg>
`);

saveSvg('public/images/products/essl-inbio-260.svg', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 320" width="100%" height="100%">
  <rect width="400" height="320" fill="#f8fafc" rx="16"/>
  <!-- Metal Enclosure Cabinet -->
  <rect x="70" y="30" width="260" height="260" rx="8" fill="#cbd5e1" stroke="#475569" stroke-width="3" filter="drop-shadow(0 10px 14px rgba(0,0,0,0.25))"/>
  <rect x="90" y="50" width="220" height="220" rx="4" fill="#047857" stroke="#065f46" stroke-width="2"/>
  <!-- PCB Circuit Pattern & Relays -->
  <rect x="110" y="70" width="45" height="30" rx="2" fill="#1e293b"/>
  <rect x="165" y="70" width="45" height="30" rx="2" fill="#1e293b"/>
  <rect x="220" y="70" width="45" height="30" rx="2" fill="#1e293b"/>
  <rect x="110" y="120" width="155" height="70" rx="4" fill="#0f172a" stroke="#22c55e" stroke-width="1.5"/>
  <text x="187" y="150" font-family="sans-serif" font-size="11" font-weight="bold" fill="#fff" text-anchor="middle">eSSL InBio 260</text>
  <text x="187" y="170" font-family="sans-serif" font-size="9" fill="#86efac" text-anchor="middle">2-Door / 4-Reader Controller</text>
  <text x="187" y="235" font-family="sans-serif" font-size="9" font-weight="bold" fill="#fff" text-anchor="middle">RS485 &amp; Wiegand Industrial Access</text>
</svg>
`);

saveSvg('public/images/products/rfid-cards.svg', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 320" width="100%" height="100%">
  <rect width="400" height="320" fill="#f8fafc" rx="16"/>
  <!-- RFID Card Graphic -->
  <rect x="70" y="60" width="260" height="160" rx="12" fill="#ffffff" stroke="#cbd5e1" stroke-width="2" filter="drop-shadow(0 10px 16px rgba(0,0,0,0.15))"/>
  <!-- Card Header Strip -->
  <rect x="70" y="60" width="260" height="40" rx="12 12 0 0" fill="#0f2b5c"/>
  <text x="90" y="85" font-family="sans-serif" font-size="12" font-weight="900" fill="#fff">MEENAKSHI TECHNOLOGIES</text>
  <!-- RFID Chip & Wireless Waves -->
  <rect x="95" y="120" width="36" height="30" rx="4" fill="#f59e0b"/>
  <path d="M145 130 C155 125 155 145 145 140" fill="none" stroke="#2563eb" stroke-width="2"/>
  <path d="M152 125 C165 120 165 150 152 145" fill="none" stroke="#2563eb" stroke-width="2"/>
  <text x="200" y="140" font-family="monospace" font-size="12" font-weight="bold" fill="#334155">ID: 0008472910</text>
  <text x="200" y="195" font-family="sans-serif" font-size="10" fill="#64748b">125kHz Proximity / 13.56MHz Mifare 1K</text>
  <text x="200" y="270" font-family="sans-serif" font-size="12" font-weight="bold" fill="#0f172a" text-anchor="middle">RFID Proximity Cards &amp; Mifare Smart Badges</text>
</svg>
`);

// 7. Infographics & Diagrams
saveSvg('public/images/diagrams/biometric-workflow.svg', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 320" width="100%" height="100%">
  <rect width="900" height="320" fill="#091e3a" rx="16"/>
  <text x="450" y="45" font-family="system-ui, sans-serif" font-size="18" font-weight="bold" fill="#ffffff" text-anchor="middle">HOW A BIOMETRIC ATTENDANCE SYSTEM WORKS</text>
  <text x="450" y="70" font-family="system-ui, sans-serif" font-size="12" fill="#93c5fd" text-anchor="middle">From Biological Trait Capture to Automated Payroll Processing</text>
  
  <!-- Step 1 -->
  <g transform="translate(40, 100)">
    <rect width="180" height="170" rx="12" fill="#134074" stroke="#38bdf8" stroke-width="1.5"/>
    <circle cx="90" cy="50" r="26" fill="#0b2545" stroke="#38bdf8" stroke-width="2"/>
    <text x="90" y="55" font-family="sans-serif" font-size="16" fill="#38bdf8" text-anchor="middle">01</text>
    <text x="90" y="100" font-family="sans-serif" font-size="13" font-weight="bold" fill="#ffffff" text-anchor="middle">Biological Capture</text>
    <text x="90" y="125" font-family="sans-serif" font-size="10" fill="#cbd5e1" text-anchor="middle">Fingerprint or 3D Face</text>
    <text x="90" y="142" font-family="sans-serif" font-size="10" fill="#cbd5e1" text-anchor="middle">scanned in &lt; 0.5s</text>
  </g>
  <!-- Arrow 1 -->
  <path d="M225 185 L255 185" stroke="#38bdf8" stroke-width="3" stroke-linecap="round"/>
  <polygon points="255,180 265,185 255,190" fill="#38bdf8"/>

  <!-- Step 2 -->
  <g transform="translate(265, 100)">
    <rect width="180" height="170" rx="12" fill="#134074" stroke="#38bdf8" stroke-width="1.5"/>
    <circle cx="90" cy="50" r="26" fill="#0b2545" stroke="#38bdf8" stroke-width="2"/>
    <text x="90" y="55" font-family="sans-serif" font-size="16" fill="#38bdf8" text-anchor="middle">02</text>
    <text x="90" y="100" font-family="sans-serif" font-size="13" font-weight="bold" fill="#ffffff" text-anchor="middle">Encrypted Match</text>
    <text x="90" y="125" font-family="sans-serif" font-size="10" fill="#cbd5e1" text-anchor="middle">Mathematical template</text>
    <text x="90" y="142" font-family="sans-serif" font-size="10" fill="#cbd5e1" text-anchor="middle">verified in device RAM</text>
  </g>
  <!-- Arrow 2 -->
  <path d="M450 185 L480 185" stroke="#38bdf8" stroke-width="3" stroke-linecap="round"/>
  <polygon points="480,180 490,185 480,190" fill="#38bdf8"/>

  <!-- Step 3 -->
  <g transform="translate(490, 100)">
    <rect width="180" height="170" rx="12" fill="#134074" stroke="#38bdf8" stroke-width="1.5"/>
    <circle cx="90" cy="50" r="26" fill="#0b2545" stroke="#38bdf8" stroke-width="2"/>
    <text x="90" y="55" font-family="sans-serif" font-size="16" fill="#38bdf8" text-anchor="middle">03</text>
    <text x="90" y="100" font-family="sans-serif" font-size="13" font-weight="bold" fill="#ffffff" text-anchor="middle">Network Sync</text>
    <text x="90" y="125" font-family="sans-serif" font-size="10" fill="#cbd5e1" text-anchor="middle">TCP/IP or Cloud push to</text>
    <text x="90" y="142" font-family="sans-serif" font-size="10" fill="#cbd5e1" text-anchor="middle">centralized SQL server</text>
  </g>
  <!-- Arrow 3 -->
  <path d="M675 185 L705 185" stroke="#38bdf8" stroke-width="3" stroke-linecap="round"/>
  <polygon points="705,180 715,185 705,190" fill="#38bdf8"/>

  <!-- Step 4 -->
  <g transform="translate(715, 100)">
    <rect width="150" height="170" rx="12" fill="#134074" stroke="#22c55e" stroke-width="1.5"/>
    <circle cx="75" cy="50" r="26" fill="#0b2545" stroke="#22c55e" stroke-width="2"/>
    <text x="75" y="55" font-family="sans-serif" font-size="16" fill="#22c55e" text-anchor="middle">04</text>
    <text x="75" y="100" font-family="sans-serif" font-size="13" font-weight="bold" fill="#ffffff" text-anchor="middle">Payroll &amp; Access</text>
    <text x="75" y="125" font-family="sans-serif" font-size="10" fill="#cbd5e1" text-anchor="middle">Overtime &amp; salary</text>
    <text x="75" y="142" font-family="sans-serif" font-size="10" fill="#cbd5e1" text-anchor="middle">slips auto-generated</text>
  </g>
</svg>
`);

saveSvg('public/images/diagrams/access-control-architecture.svg', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 320" width="100%" height="100%">
  <rect width="900" height="320" fill="#031926" rx="16"/>
  <text x="450" y="45" font-family="system-ui, sans-serif" font-size="18" font-weight="bold" fill="#ffffff" text-anchor="middle">COMPLETE DOOR ACCESS CONTROL ARCHITECTURE</text>
  <text x="450" y="70" font-family="system-ui, sans-serif" font-size="12" fill="#94a3b8" text-anchor="middle">Integrated Fail-Safe Electromagnetic Lock, Controller, Power Supply &amp; Fire Release</text>

  <!-- Outside: Biometric Terminal -->
  <g transform="translate(50, 95)">
    <rect width="180" height="180" rx="10" fill="#0b2545" stroke="#38bdf8" stroke-width="1.5"/>
    <text x="90" y="35" font-family="sans-serif" font-size="12" font-weight="bold" fill="#38bdf8" text-anchor="middle">OUTSIDE PREMISES</text>
    <circle cx="90" cy="80" r="24" fill="#134074" stroke="#38bdf8" stroke-width="1.5"/>
    <text x="90" y="130" font-family="sans-serif" font-size="12" font-weight="bold" fill="#ffffff" text-anchor="middle">Biometric Scanner</text>
    <text x="90" y="150" font-family="sans-serif" font-size="10" fill="#94a3b8" text-anchor="middle">Face / Fingerprint / Card</text>
  </g>
  
  <!-- Central Door with EM Lock -->
  <g transform="translate(290, 95)">
    <rect width="320" height="180" rx="10" fill="#0f172a" stroke="#cbd5e1" stroke-width="1.5"/>
    <text x="160" y="30" font-family="sans-serif" font-size="12" font-weight="bold" fill="#f8fafc" text-anchor="middle">SECURE GLASS / WOODEN DOOR</text>
    <!-- EM Lock on top header -->
    <rect x="60" y="45" width="200" height="30" rx="4" fill="#cbd5e1" stroke="#475569" stroke-width="1.5"/>
    <text x="160" y="65" font-family="sans-serif" font-size="10" font-weight="bold" fill="#0f172a" text-anchor="middle">600 LBS ELECTROMAGNETIC LOCK</text>
    <!-- Armature on door leaf -->
    <rect x="75" y="85" width="170" height="20" rx="3" fill="#64748b"/>
    <text x="160" y="135" font-family="sans-serif" font-size="11" fill="#4ade80" text-anchor="middle">FAIL-SAFE POWER-TO-LOCK</text>
    <text x="160" y="155" font-family="sans-serif" font-size="9" fill="#94a3b8" text-anchor="middle">Unlocks automatically during fire alarm / power failure</text>
  </g>

  <!-- Inside: Exit Push Button & Power Supply -->
  <g transform="translate(670, 95)">
    <rect width="180" height="180" rx="10" fill="#0b2545" stroke="#22c55e" stroke-width="1.5"/>
    <text x="90" y="35" font-family="sans-serif" font-size="12" font-weight="bold" fill="#22c55e" text-anchor="middle">INSIDE SECURE ZONE</text>
    <rect x="60" y="55" width="60" height="40" rx="4" fill="#134074" stroke="#22c55e" stroke-width="1.5"/>
    <text x="90" y="80" font-family="sans-serif" font-size="10" font-weight="bold" fill="#ffffff" text-anchor="middle">EXIT</text>
    <text x="90" y="125" font-family="sans-serif" font-size="11" font-weight="bold" fill="#ffffff" text-anchor="middle">Push to Exit Switch</text>
    <text x="90" y="145" font-family="sans-serif" font-size="10" fill="#94a3b8" text-anchor="middle">12V 5A Backup Battery</text>
    <text x="90" y="162" font-family="sans-serif" font-size="10" fill="#94a3b8" text-anchor="middle">Emergency Break-Glass</text>
  </g>
</svg>
`);

// 8. Blog Featured Hero
saveSvg('public/images/blog/pillar-guide-hero.svg', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="100%" height="100%">
  <defs>
    <linearGradient id="bgPillar" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0b2545"/>
      <stop offset="50%" stop-color="#134074"/>
      <stop offset="100%" stop-color="#031926"/>
    </linearGradient>
  </defs>
  <rect width="800" height="450" fill="url(#bgPillar)" rx="16"/>
  <!-- Decorative Grid & Circles -->
  <circle cx="680" cy="120" r="140" fill="#38bdf8" opacity="0.08"/>
  <circle cx="120" cy="350" r="180" fill="#2563eb" opacity="0.08"/>
  
  <rect x="60" y="60" width="200" height="30" rx="15" fill="#38bdf8" opacity="0.2"/>
  <text x="160" y="80" font-family="sans-serif" font-size="12" font-weight="bold" fill="#38bdf8" text-anchor="middle">HYDERABAD 2026 DEFINITIVE GUIDE</text>
  
  <text x="60" y="145" font-family="system-ui, sans-serif" font-size="32" font-weight="900" fill="#ffffff">Best Biometric Dealers</text>
  <text x="60" y="185" font-family="system-ui, sans-serif" font-size="32" font-weight="900" fill="#38bdf8">in Hyderabad</text>
  <text x="60" y="235" font-family="sans-serif" font-size="16" fill="#cbd5e1">Complete Guide to eSSL, Biomax Attendance Machines,</text>
  <text x="60" y="260" font-family="sans-serif" font-size="16" fill="#cbd5e1">Access Control Systems &amp; Payroll Software Integration</text>
  
  <!-- Badges -->
  <g transform="translate(60, 310)">
    <rect width="180" height="45" rx="8" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>
    <text x="90" y="38" font-family="sans-serif" font-size="11" font-weight="bold" fill="#f8fafc" text-anchor="middle">eSSL &amp; Biomax Certified</text>
  </g>
  <g transform="translate(260, 310)">
    <rect width="180" height="45" rx="8" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>
    <text x="90" y="38" font-family="sans-serif" font-size="11" font-weight="bold" fill="#4ade80" text-anchor="middle">Dual Hyderabad Locations</text>
  </g>
  <g transform="translate(460, 310)">
    <rect width="180" height="45" rx="8" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>
    <text x="90" y="38" font-family="sans-serif" font-size="11" font-weight="bold" fill="#f59e0b" text-anchor="middle">3,000+ Word Authority Guide</text>
  </g>
  <text x="60" y="405" font-family="sans-serif" font-size="12" fill="#94a3b8">By Tingirikar Teja, Founder of Meenakshi Technologies</text>
</svg>
`);

saveSvg('public/images/blog/essl-vs-biomax.svg', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="100%" height="100%">
  <rect width="800" height="450" fill="#0f172a" rx="16"/>
  <text x="400" y="100" font-family="system-ui, sans-serif" font-size="28" font-weight="900" fill="#ffffff" text-anchor="middle">eSSL vs BIOMAX</text>
  <text x="400" y="140" font-family="sans-serif" font-size="16" fill="#94a3b8" text-anchor="middle">Biometric Attendance Head-to-Head Comparison</text>
  <rect x="100" y="180" width="280" height="180" rx="12" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
  <text x="240" y="225" font-family="sans-serif" font-size="20" font-weight="bold" fill="#38bdf8" text-anchor="middle">eSSL</text>
  <text x="240" y="260" font-family="sans-serif" font-size="12" fill="#cbd5e1" text-anchor="middle">Tough Optical Sensors • eTimeTrackLite</text>
  <text x="240" y="285" font-family="sans-serif" font-size="12" fill="#cbd5e1" text-anchor="middle">Industrial Workhorse Across India</text>
  
  <rect x="420" y="180" width="280" height="180" rx="12" fill="#1e293b" stroke="#f59e0b" stroke-width="2"/>
  <text x="560" y="225" font-family="sans-serif" font-size="20" font-weight="bold" fill="#f59e0b" text-anchor="middle">BIOMAX</text>
  <text x="560" y="260" font-family="sans-serif" font-size="12" fill="#cbd5e1" text-anchor="middle">AI Visible Light Face • Cloud Push</text>
  <text x="560" y="285" font-family="sans-serif" font-size="12" fill="#cbd5e1" text-anchor="middle">Rapid Multi-Branch Scalability</text>
</svg>
`);

saveSvg('public/images/blog/payroll-integration.svg', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="100%" height="100%">
  <rect width="800" height="450" fill="#0b2545" rx="16"/>
  <text x="400" y="110" font-family="system-ui, sans-serif" font-size="26" font-weight="900" fill="#ffffff" text-anchor="middle">Biometric to Payroll Automation</text>
  <text x="400" y="150" font-family="sans-serif" font-size="16" fill="#93c5fd" text-anchor="middle">Seamless Tally Prime, SAP &amp; Excel Integration</text>
  <rect x="150" y="200" width="500" height="160" rx="12" fill="#134074" stroke="#38bdf8" stroke-width="2"/>
  <text x="400" y="250" font-family="sans-serif" font-size="14" font-weight="bold" fill="#ffffff" text-anchor="middle">Zero Manual Excel Math • Automated PF / ESI / TDS</text>
  <text x="400" y="285" font-family="sans-serif" font-size="12" fill="#bae6fd" text-anchor="middle">Punch Log &rarr; Attendance Rule Check &rarr; Net Salary Slips</text>
</svg>
`);

saveSvg('public/images/blog/em-locks-guide.svg', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="100%" height="100%">
  <rect width="800" height="450" fill="#031926" rx="16"/>
  <text x="400" y="110" font-family="system-ui, sans-serif" font-size="26" font-weight="900" fill="#ffffff" text-anchor="middle">Office Glass Door EM Locks Guide</text>
  <text x="400" y="150" font-family="sans-serif" font-size="16" fill="#94a3b8" text-anchor="middle">600 Lbs Holding Force, U-Brackets &amp; Fire Safety</text>
  <rect x="150" y="200" width="500" height="160" rx="12" fill="#0f172a" stroke="#cbd5e1" stroke-width="2"/>
  <text x="400" y="255" font-family="sans-serif" font-size="14" font-weight="bold" fill="#f8fafc" text-anchor="middle">Fail-Safe Magnetic Securing Without Drilling Glass</text>
  <text x="400" y="290" font-family="sans-serif" font-size="12" fill="#94a3b8" text-anchor="middle">ZL Brackets for Wood • U Brackets for Frameless Glass</text>
</svg>
`);

console.log('All image assets and diagrams generated successfully!');
