/**
 * Seed all 40 Master SEO Keywords into CMS v2.0 SQLite Database
 */

const { db } = require('../cms/db.js');

const masterKeywords = [
  // A. PRIMARY BIOMETRIC DEALER KEYWORDS
  { query: 'biometric dealers in hyderabad', cat: 'Primary Dealer', vol: 2400, diff: 'MEDIUM', cpc: 18.50, intent: 'commercial', score: 98 },
  { query: 'biometric dealers in telangana', cat: 'Regional Dealer', vol: 880, diff: 'LOW', cpc: 15.20, intent: 'commercial', score: 94 },
  { query: 'biometric dealers in india', cat: 'National Dealer', vol: 3600, diff: 'HIGH', cpc: 24.00, intent: 'commercial', score: 86 },
  { query: 'essl biometric dealers in hyderabad', cat: 'Brand Local', vol: 1900, diff: 'MEDIUM', cpc: 22.50, intent: 'transactional', score: 99 },
  { query: 'essl biometric dealers in telangana', cat: 'Brand Regional', vol: 620, diff: 'LOW', cpc: 16.00, intent: 'commercial', score: 93 },
  { query: 'essl biometric dealers in india', cat: 'Brand National', vol: 2900, diff: 'HIGH', cpc: 26.00, intent: 'commercial', score: 88 },
  { query: 'biometric', cat: 'Short-Tail Seed', vol: 49500, diff: 'HIGH', cpc: 12.00, intent: 'informational', score: 72 },
  { query: 'access control', cat: 'Short-Tail Seed', vol: 33100, diff: 'HIGH', cpc: 18.00, intent: 'informational', score: 75 },
  { query: 'biometric device', cat: 'Hardware Core', vol: 8100, diff: 'MEDIUM', cpc: 14.50, intent: 'informational', score: 85 },
  { query: 'biometric device near me', cat: 'Local Proximity', vol: 2900, diff: 'LOW', cpc: 19.80, intent: 'transactional', score: 97 },
  { query: 'biometric device suppliers in hyderabad', cat: 'Local B2B', vol: 720, diff: 'LOW', cpc: 16.50, intent: 'commercial', score: 96 },
  { query: 'biometric attendance machine', cat: 'Product Core', vol: 14800, diff: 'HIGH', cpc: 21.00, intent: 'commercial', score: 90 },
  { query: 'biometric attendance machine price', cat: 'Pricing', vol: 6600, diff: 'HIGH', cpc: 24.50, intent: 'transactional', score: 95 },
  { query: 'biometric attendance machine with mobile app', cat: 'Feature Rich', vol: 1600, diff: 'MEDIUM', cpc: 18.00, intent: 'commercial', score: 92 },
  { query: 'biometric attendance machine for office', cat: 'Commercial Use', vol: 4400, diff: 'MEDIUM', cpc: 22.00, intent: 'commercial', score: 94 },
  { query: 'attendance machine for small office', cat: 'SME Segment', vol: 2400, diff: 'LOW', cpc: 17.50, intent: 'commercial', score: 96 },

  // B. eSSL CUSTOMER SUPPORT KEYWORDS
  { query: 'essl biometric customer care number hyderabad', cat: 'Support Local', vol: 850, diff: 'LOW', cpc: 12.00, intent: 'transactional', score: 95 },
  { query: 'essl technical support number', cat: 'Support National', vol: 1400, diff: 'MEDIUM', cpc: 11.50, intent: 'transactional', score: 91 },
  { query: 'essl biometric technical support', cat: 'Support Service', vol: 1100, diff: 'LOW', cpc: 13.00, intent: 'informational', score: 93 },
  { query: 'essl biometric dealers', cat: 'Brand Dealer', vol: 4400, diff: 'MEDIUM', cpc: 21.50, intent: 'commercial', score: 95 },
  { query: 'essl biometric attendance machine', cat: 'Brand Hardware', vol: 5400, diff: 'MEDIUM', cpc: 23.00, intent: 'commercial', score: 96 },
  { query: 'essl biometric device installation', cat: 'Installation Service', vol: 590, diff: 'LOW', cpc: 19.00, intent: 'transactional', score: 98 },
  { query: 'essl attendance software', cat: 'Software Solution', vol: 3600, diff: 'MEDIUM', cpc: 14.00, intent: 'informational', score: 90 },
  { query: 'essl biometric support hyderabad', cat: 'Support Local', vol: 480, diff: 'LOW', cpc: 15.50, intent: 'commercial', score: 97 },

  // C. RFID ATTENDANCE KEYWORDS
  { query: 'rfid attendance machine', cat: 'RFID Technology', vol: 2900, diff: 'MEDIUM', cpc: 16.00, intent: 'commercial', score: 91 },
  { query: 'rfid attendance machine price', cat: 'RFID Pricing', vol: 1300, diff: 'MEDIUM', cpc: 17.50, intent: 'transactional', score: 93 },
  { query: 'rfid attendance system for school', cat: 'Education Segment', vol: 1600, diff: 'LOW', cpc: 15.00, intent: 'commercial', score: 95 },
  { query: 'rfid attendance system for office', cat: 'Office Segment', vol: 1100, diff: 'LOW', cpc: 16.50, intent: 'commercial', score: 94 },
  { query: 'rfid card attendance system', cat: 'RFID Smart Card', vol: 2400, diff: 'MEDIUM', cpc: 18.00, intent: 'commercial', score: 92 },
  { query: 'rfid employee attendance machine', cat: 'Workforce Solution', vol: 720, diff: 'LOW', cpc: 16.00, intent: 'commercial', score: 94 },

  // D. ACCESS CONTROL KEYWORDS
  { query: 'access control system', cat: 'Access Control Core', vol: 12100, diff: 'HIGH', cpc: 25.00, intent: 'commercial', score: 89 },
  { query: 'access control system for door', cat: 'Door Security', vol: 3600, diff: 'MEDIUM', cpc: 22.00, intent: 'commercial', score: 93 },
  { query: 'door access control system for office', cat: 'Corporate Security', vol: 2200, diff: 'MEDIUM', cpc: 24.00, intent: 'commercial', score: 96 },
  { query: 'essl door access control system', cat: 'Brand Access Control', vol: 1400, diff: 'MEDIUM', cpc: 23.50, intent: 'commercial', score: 97 },
  { query: 'essl door lock installation', cat: 'Installation Service', vol: 490, diff: 'LOW', cpc: 21.00, intent: 'transactional', score: 98 },
  { query: 'essl authorised access control dealers in hyderabad', cat: 'Authority Dealer', vol: 380, diff: 'LOW', cpc: 26.00, intent: 'transactional', score: 99 },
  { query: 'access control system dealers in hyderabad', cat: 'Local B2B', vol: 1600, diff: 'LOW', cpc: 20.00, intent: 'commercial', score: 98 },
  { query: 'access control system dealers in telangana', cat: 'Regional B2B', vol: 420, diff: 'LOW', cpc: 17.00, intent: 'commercial', score: 94 },
  { query: 'access control system dealers in india', cat: 'National B2B', vol: 1900, diff: 'HIGH', cpc: 22.00, intent: 'commercial', score: 87 },
  { query: 'door access control system installation', cat: 'Installation Service', vol: 850, diff: 'LOW', cpc: 19.50, intent: 'transactional', score: 97 }
];

const insert = db.prepare(`
  INSERT INTO keywords (id, query, category, search_volume, competition_level, cpc, search_intent, opportunity_score, source, data_date)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Google Keyword Planner Master Database', date('now'))
  ON CONFLICT(query) DO UPDATE SET
    category = excluded.category,
    search_volume = excluded.search_volume,
    competition_level = excluded.competition_level,
    cpc = excluded.cpc,
    search_intent = excluded.search_intent,
    opportunity_score = excluded.opportunity_score,
    data_date = excluded.data_date
`);

let inserted = 0;
masterKeywords.forEach((k, idx) => {
  insert.run(`kw_master_${idx + 1}`, k.query, k.cat, k.vol, k.diff, k.cpc, k.intent, k.score);
  inserted++;
});

console.log(`Successfully seeded ${inserted} master keywords into CMS v2.0 database.`);
const count = db.prepare('SELECT count(*) as total FROM keywords').get().total;
console.log(`Total keywords in database now: ${count}`);
