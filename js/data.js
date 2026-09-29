/* Mock data for the SmarTone B2B portal prototype */
window.DATA = {
  users: {
    admin: { password: 'Admin@123', role: 'admin', name: 'Queenie', title: 'Corporate Admin', channel: 'sms', dest: '+852 6723 ****' },
    mary:  { password: 'Line@123',  role: 'line',  name: 'Mary Wong', title: 'Line User', line: '6123 4567', company: 'ABLE MARK LTD', channel: 'email', dest: 'ma****ng@email.com' }
  },
  otp: '123456',
  companies: [
    { id: 'abc',  name: 'ABC COMPANY', accounts: [{ id: 'a1', name: 'Head Office', no: '00112233' }] },
    { id: 'able', name: 'ABLE MARK LTD', accounts: [
      { id: 'b1', name: 'Human Resources', no: '01234567' },
      { id: 'b2', name: 'IT Department', no: '12345678' } ] },
    { id: 'bcd',  name: 'BCD Company', accounts: [{ id: 'c1', name: 'Sales', no: '22334455' }] },
    { id: 'star', name: 'The Star Ferry Co LTD', accounts: [{ id: 'd1', name: 'Operations', no: '33445566' }] },
    { id: 'hkcmt', name: 'The Hong Kong Children’s Musical Theatre Limited', accounts: [{ id: 'e1', name: 'Human Resources', no: '01234567' }] }
  ],
  lines: [
    { num: '6123 4567', name: 'Mary Wong', company: 'able', account: 'b1', status: 'Active',
      voice: 40, voiceNote: 'HK & Macau 1,050 mins (Pool)', data: 10, dataNote: 'HK: $1/10MB, capped $168 ceiling. Macau: Unlimited',
      rVoice: 40, rData: 30, reset: '21-Jan-2025', contractEnd: '31-May-2024', months: 18, expired: true,
      plan: { monthly: '$ 198.0', desc: 'Special Corporate Plan', freeVoice: 'Unlimited mins (Pool)', freeIntra: '1000 mins',
              thereBasic: '$ 0.90/mins', thereIntra: '$ 0.90/mins', freeData: '5GB FUP (Unlimited)', thereData: '2 Mbps',
              extra: 'CALL Guard - $25/month', handset: '–', svcRebate: '$220', otherRebate: '–', idd: '–', addVoice: '–', addData: '15GB' } },
    { num: '9876 1234', name: 'Chan Chau', company: 'able', account: 'b2', status: 'Suspended',
      voice: 12, voiceNote: 'HK & Macau 1,050 mins (Pool)', data: 3.5, dataNote: 'HK: $1/10MB, capped $168 ceiling',
      rVoice: 0, rData: 0, reset: '21-Jan-2025', contractEnd: '30-Nov-2025', months: 14, expired: false,
      plan: { monthly: '$ 168.0', desc: 'Corporate Value Plan', freeVoice: '2000 mins (Pool)', freeIntra: '500 mins',
              thereBasic: '$ 0.90/mins', thereIntra: '$ 0.90/mins', freeData: '20GB FUP', thereData: '1 Mbps',
              extra: '–', handset: '$100', svcRebate: '–', otherRebate: '–', idd: '30 mins', addVoice: '–', addData: '–' } },
    { num: '6543 1234', name: 'Peter Chan', company: 'hkcmt', account: 'e1', status: 'Active',
      voice: 210, voiceNote: 'HK & Macau 500 mins', data: 22, dataNote: 'HK: capped $168 ceiling',
      rVoice: 15, rData: 7, reset: '21-Jan-2025', contractEnd: '28-Feb-2026', months: 17, expired: false,
      plan: { monthly: '$ 258.0', desc: 'Special Corporate Plan', freeVoice: 'Unlimited mins', freeIntra: '1000 mins',
              thereBasic: '$ 0.90/mins', thereIntra: '$ 0.90/mins', freeData: '30GB FUP', thereData: '2 Mbps',
              extra: 'CALL Guard - $25/month', handset: '–', svcRebate: '$120', otherRebate: '–', idd: '–', addVoice: '–', addData: '–' } },
    { num: '5234 8890', name: 'Sam Lee', company: 'abc', account: 'a1', status: 'Active',
      voice: 90, voiceNote: 'HK 300 mins', data: 8, dataNote: 'HK: capped $168 ceiling',
      rVoice: 0, rData: 0, reset: '21-Jan-2025', contractEnd: '31-Dec-2025', months: 15, expired: false,
      plan: { monthly: '$ 128.0', desc: 'Basic Corporate Plan', freeVoice: '300 mins', freeIntra: '–',
              thereBasic: '$ 0.90/mins', thereIntra: '$ 0.90/mins', freeData: '8GB', thereData: '128 kbps',
              extra: '–', handset: '–', svcRebate: '–', otherRebate: '–', idd: '–', addVoice: '–', addData: '–' } }
  ],
  bills: { 'able': 43279.00, 'abc': 12480.50, 'bcd': 8890.00, 'star': 21350.75, 'hkcmt': 5620.00 },
  stores: [
    { id: 's1', name: 'Aberdeen Store', area: 'Hong Kong Island', addr: 'Shop G16-17, G/F, Fuk Centre, 38 Cheung Yuen St, Aberdeen', hours: '11:00 – 20:00' },
    { id: 's2', name: 'IFC Store', area: 'Hong Kong Island', addr: 'Shop 2021, Podium Level 2, 8 Finance Street, Central', hours: '10:00 – 21:00' },
    { id: 's3', name: 'Kennedy Town Store', area: 'Hong Kong Island', addr: 'Shop 5, G/F, Kwan Yick Building, Kennedy Town', hours: '11:00 – 20:00' },
    { id: 's4', name: 'New Jade Shopping Arcade Store', area: 'Hong Kong Island', addr: 'Shop 19, 2/F, New Jade Shopping Arcade, Chai Wan', hours: '11:00 – 20:00' },
    { id: 's5', name: 'Mong Kok Store', area: 'Kowloon', addr: 'Shop 4, G/F, 688 Nathan Road, Mong Kok', hours: '10:00 – 22:00' },
    { id: 's6', name: 'Tsim Sha Tsui Store', area: 'Kowloon', addr: 'Shop 12, G/F, Mira Place, 132 Nathan Road', hours: '10:00 – 22:00' },
    { id: 's7', name: 'Sha Tin Store', area: 'New Territories', addr: 'Shop 217, New Town Plaza Phase 1, Sha Tin', hours: '10:00 – 21:00' },
    { id: 's8', name: 'Tuen Mun Store', area: 'New Territories', addr: 'Shop 88, Tuen Mun Town Plaza, Tuen Mun', hours: '11:00 – 21:00' }
  ],
  districts: { 'Hong Kong': ['Central & Western', 'Wan Chai', 'Eastern', 'Southern'], 'Kowloon': ['Yau Tsim Mong', 'Sham Shui Po', 'Kowloon City', 'Kwun Tong'], 'New Territories': ['Tsuen Wan', 'Sha Tin', 'Tai Po', 'Tuen Mun'] },
  requestTypes: [
    { id: 'roaming', title: 'Roaming Service', desc: 'Turn data & voice roaming on or off for a line.', icon: 'globe', tag: 'Instant' },
    { id: 'idd', title: 'IDD Service', desc: 'Enable or disable International Direct Dial.', icon: 'phone', tag: 'Instant' },
    { id: 'sim', title: 'SIM Replacement', desc: 'Request a replacement SIM by delivery or store pick-up.', icon: 'sim', tag: '1–2 days' },
    { id: 'reconnect', title: 'Service Reconnection', desc: 'Reconnect a suspended line after settling payment.', icon: 'plug', tag: 'After payment' }
  ]
};
