/* SmarTone B2B portal – vanilla JS SPA (hash routing, no build step) */
(function () {
'use strict';
const D = window.DATA;
const $ = (s, r = document) => r.querySelector(s);
const app = $('#app');
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* ---------- icons ---------- */
const P = {
  home: '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/>',
  file: '<path d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9z"/><path d="M14 3v6h6M8 13h8M8 17h5"/>',
  list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z"/>',
  building: '<path d="M4 21V4a1 1 0 011-1h9a1 1 0 011 1v17M15 9h4a1 1 0 011 1v11M3 21h18M8 7h3M8 11h3M8 15h3"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>',
  lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/>',
  eye: '<path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
  chev: '<path d="M9 6l6 6-6 6"/>', chevd: '<path d="M6 9l6 6 6-6"/>', back: '<path d="M15 6l-6 6 6 6"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>', check: '<path d="M4 12l5 5L20 6"/>',
  phone: '<path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 012.1 4.2 2 2 0 014.1 2h3a2 2 0 012 1.7c.1 1 .4 1.9.7 2.8a2 2 0 01-.5 2.1L8.1 9.9a16 16 0 006 6l1.3-1.3a2 2 0 012.1-.4c.9.3 1.8.6 2.8.7a2 2 0 011.7 2z"/>',
  data: '<path d="M12 3v14M6 11l6 6 6-6M4 21h16"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18"/>',
  sim: '<path d="M6 2h8l5 5v13a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2z"/><rect x="8" y="12" width="8" height="7" rx="1"/>',
  plug: '<path d="M9 2v6M15 2v6M6 8h12v3a6 6 0 01-12 0zM12 17v5"/>',
  bell: '<path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9M10 21a2 2 0 004 0"/>',
  alert: '<circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16.5v.01"/>',
  out: '<path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>',
  upload: '<path d="M12 16V4M6 10l6-6 6 6M4 20h16"/>', pin: '<path d="M12 22s7-6 7-12a7 7 0 10-14 0c0 6 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/>',
  cal: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>'
};
const ic = n => `<svg class="i" viewBox="0 0 24 24" aria-hidden="true">${P[n] || ''}</svg>`;

/* ---------- state ---------- */
let S = { user: null, key: null, company: null, account: 'all' };
try { S = Object.assign(S, JSON.parse(sessionStorage.getItem('ecsp') || '{}')); } catch (e) {}
const save = () => { try { sessionStorage.setItem('ecsp', JSON.stringify(S)); } catch (e) {} };
const isAdmin = () => S.user && S.user.role === 'admin';
const company = () => D.companies.find(c => c.id === S.company) || D.companies[1];
const account = () => company().accounts.find(a => a.id === S.account);
const visibleLines = () => {
  if (!S.user) return [];
  if (!isAdmin()) return D.lines.filter(l => l.num === S.user.line);
  return D.lines.filter(l => l.company === S.company && (S.account === 'all' || l.account === S.account));
};
const fmtMoney = n => 'HKD ' + n.toLocaleString('en-HK', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const go = h => { location.hash = h; };
const toast = m => { const t = $('#toast'); t.textContent = m; t.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('show'), 2600); };

/* ---------- modal ---------- */
let lastFocus = null;
function modal(html, cls = '') {
  lastFocus = document.activeElement;
  const o = $('#overlay');
  o.innerHTML = `<div class="modal ${cls}" role="dialog" aria-modal="true">${html}</div>`;
  o.hidden = false;
  const f = o.querySelector('[autofocus],input,button'); f && f.focus();
}
function closeModal() { const o = $('#overlay'); o.hidden = true; o.innerHTML = ''; lastFocus && lastFocus.focus && lastFocus.focus(); }
$('#overlay').addEventListener('mousedown', e => { if (e.target.id === 'overlay') closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !$('#overlay').hidden) closeModal(); });
const mHead = t => `<header><span>${t}</span><button class="icon-btn" data-act="close" aria-label="Close">${ic('x')}</button></header>`;

/* ---------- router ---------- */
function route() {
  closeModal();
  const h = location.hash.replace(/^#\/?/, '');
  const parts = h.split('/');
  if (!S.user) { if (parts[0] === 'otp' && L.pending) return viewOtp(); return viewLogin(); }
  window.scrollTo(0, 0);
  switch (parts[0]) {
    case 'contracts': return parts[1] ? viewLine(decodeURIComponent(parts[1])) : viewContracts();
    case 'requests': return parts[1] ? viewWizard(parts[1]) : viewRequests();
    case 'settings': return viewSettings();
    default: return viewHome();
  }
}
window.addEventListener('hashchange', route);

/* ---------- login ---------- */
const L = { pending: null, fails: 0, err: '', otpErr: false, timer: 0, tmr: null, u: '', p: '', touched: false };

function heroPane() {
  return `<section class="login-hero"><div class="logo">SmarTone<b>BUSINESS</b></div>
    <div><h1>Your corporate lines, in one place.</h1><p>Manage contracts, usage and service requests for every company and line you oversee — anywhere, any time.</p></div>
    <p class="sm" style="opacity:.75">&copy; SmarTone Business Portal</p></section>`;
}
function viewLogin() {
  const uErr = L.touched && !L.u, pErr = L.touched && !L.p;
  app.innerHTML = `<div class="login">${heroPane()}<div class="login-main"><form class="login-box stack" id="lf" novalidate>
    <div><h2>Sign in</h2><p class="muted">Welcome back. Please sign in to continue.</p></div>
    <label class="field"><span>User name</span><div class="input-wrap">${ic('user')}<input class="input ${uErr ? 'err' : ''}" id="lu" autocomplete="username" value="${esc(L.u)}" placeholder="User name">
    </div>${uErr ? '<div class="err-msg">Please enter user name</div>' : ''}</label>
    <label class="field"><span>Password</span><div class="input-wrap">${ic('lock')}<input class="input ${pErr || L.err ? 'err' : ''}" id="lp" type="password" autocomplete="current-password" value="${esc(L.p)}" placeholder="Password">
    <button type="button" class="icon-btn end" data-act="showpw" aria-label="Show password">${ic('eye')}</button></div>${pErr ? '<div class="err-msg">Please enter password</div>' : ''}</label>
    ${L.err ? `<div class="banner bad" role="alert">${ic('alert')}<span>${esc(L.err)}</span></div>` : ''}
    <div class="row between"><button type="button" class="link sm" data-act="forgot">Forgot user name / password?</button></div>
    <button class="btn block" type="submit">Login</button>
    <div class="demo"><b>Demo accounts</b><br>Corp Admin: <code>admin</code> / <code>Admin@123</code><br>Line User: <code>mary</code> / <code>Line@123</code><br>OTP: <code>123456</code></div>
  </form></div></div>`;
  $('#lu').addEventListener('input', e => { L.u = e.target.value; });
  $('#lp').addEventListener('input', e => { L.p = e.target.value; });
  $('#lf').addEventListener('submit', e => {
    e.preventDefault(); L.touched = true; L.u = $('#lu').value.trim(); L.p = $('#lp').value;
    if (!L.u || !L.p) { L.err = ''; return viewLogin(); }
    const u = D.users[L.u.toLowerCase()];
    if (!u || u.password !== L.p) {
      L.fails++; L.err = 'The user name and/or password you have entered are incorrect. Please try again.';
      viewLogin();
      if (L.fails >= 3) { L.fails = 0; modal(`<div class="warnic">${ic('alert')}</div><h3>Login Failed</h3><p class="muted sm" style="margin:6px 0 18px">Please contact Customer Service for assistance.</p><button class="btn block" data-act="close">OK</button>`, 'alert'); }
      return;
    }
    L.err = ''; L.fails = 0; L.pending = { key: L.u.toLowerCase(), u }; L.otpErr = false; startTimer(); go('/otp');
  });
}
function startTimer() { clearInterval(L.tmr); L.timer = 30; L.tmr = setInterval(() => { L.timer--; const b = $('#resend'); if (b) { b.disabled = L.timer > 0; b.textContent = L.timer > 0 ? `Resend in ${L.timer}s` : 'Resend'; } if (L.timer <= 0) clearInterval(L.tmr); }, 1000); }
function viewOtp() {
  const u = L.pending.u;
  app.innerHTML = `<div class="login">${heroPane()}<div class="login-main"><div class="login-box">
    <button class="crumb link" data-act="otpback">${ic('back')} Back</button>
    <h2>Enter OTP</h2><p class="muted">We have sent a 6-digit code to<br><b style="color:var(--text)">${esc(u.dest)}</b> ${u.channel === 'sms' ? '(SMS)' : '(email)'}</p>
    <div class="otp ${L.otpErr ? 'bad' : ''}" id="otp">${[0, 1, 2, 3, 4, 5].map(i => `<input inputmode="numeric" maxlength="1" autocomplete="${i ? 'off' : 'one-time-code'}" aria-label="Digit ${i + 1}">`).join('')}</div>
    ${L.otpErr ? '<div class="err-msg" role="alert">Incorrect OTP. Please try again.</div>' : ''}
    <p class="sm muted" style="margin-top:22px">Didn’t get a code? <button id="resend" class="link" data-act="resend" ${L.timer > 0 ? 'disabled' : ''}>${L.timer > 0 ? `Resend in ${L.timer}s` : 'Resend'}</button></p>
  </div></div></div>`;
  const ins = [...document.querySelectorAll('#otp input')];
  const submit = () => {
    const v = ins.map(i => i.value).join('');
    if (v.length < 6) return;
    if (v === D.otp) {
      S.user = L.pending.u; S.key = L.pending.key;
      if (S.user.role === 'line') { const l = D.lines.find(x => x.num === S.user.line); S.company = l.company; S.account = 'all'; }
      else { S.company = 'able'; S.account = 'all'; }
      L.pending = null; clearInterval(L.tmr); save(); go('/home');
    } else { L.otpErr = true; viewOtp(); }
  };
  ins.forEach((el, i) => {
    el.addEventListener('input', () => { el.value = el.value.replace(/\D/g, ''); if (el.value && ins[i + 1]) ins[i + 1].focus(); submit(); });
    el.addEventListener('keydown', e => { if (e.key === 'Backspace' && !el.value && ins[i - 1]) ins[i - 1].focus(); });
    el.addEventListener('paste', e => { const t = (e.clipboardData.getData('text') || '').replace(/\D/g, '').slice(0, 6); if (!t) return; e.preventDefault(); t.split('').forEach((c, k) => ins[k].value = c); submit(); });
  });
  ins[0].focus();
}

/* ---------- shell ---------- */
const NAV = [['home', 'Home', 'home'], ['contracts', 'Contracts', 'file'], ['requests', 'Requests', 'list'], ['settings', 'Settings', 'gear']];
function shell(title, body, active) {
  const u = S.user, ini = esc(u.name[0]);
  app.innerHTML = `<div class="shell">
  <aside class="side"><div class="logo">SmarTone<b>BUSINESS</b></div>
    <nav class="nav" aria-label="Main">${NAV.map(n => `<a href="#/${n[0] === 'home' ? 'home' : n[0]}" class="${active === n[0] ? 'on' : ''}">${ic(n[2])}${n[1]}</a>`).join('')}</nav>
    <div class="side-foot row"><div class="avatar">${ini}</div><div class="grow"><b class="sm">${esc(u.name)}</b><div class="xs muted">${esc(u.title)}</div></div><button class="icon-btn" data-act="logout" aria-label="Log out">${ic('out')}</button></div></aside>
  <header class="top"><h1 class="grow">${title}</h1><span class="hide-m muted sm">${isAdmin() ? 'Corp Admin' : 'Line User'}</span><button class="icon-btn" aria-label="Notifications" data-act="notif">${ic('bell')}</button><div class="avatar show-m">${ini}</div></header>
  <main id="main">${body}</main>
  <nav class="tabbar" aria-label="Main">${NAV.map(n => `<a href="#/${n[0]}" class="${active === n[0] ? 'on' : ''}">${ic(n[2])}${n[1]}</a>`).join('')}</nav></div>`;
}
function switcher() {
  if (!isAdmin()) return `<div class="switcher" style="cursor:default"><span class="ico">${ic('building')}</span><span class="grow"><small>${esc(company().name)}</small><strong>${esc(S.user.name)} · ${esc(S.user.line)}</strong></span></div>`;
  const a = account();
  return `<button class="switcher" data-act="switch"><span class="ico">${ic('building')}</span><span class="grow"><small>${a ? esc(a.name) + ' · ' + a.no : 'All Account(s)'}</small><strong>${esc(company().name)}</strong></span>${ic('chevd')}</button>`;
}

/* company / account switcher (two-step modal) */
function openSwitcher(step = 'company', pending = S.company) {
  if (step === 'company') {
    modal(mHead('Select Company') + `<div class="body"><div class="input-wrap" style="margin-bottom:6px">${ic('search')}<input class="input" id="cq" placeholder="Search company name"></div>
      <div id="clist">${companyList(pending, '')}</div></div><footer><button class="btn block" data-act="cnext">Confirm</button></footer>`);
    $('#cq').addEventListener('input', e => { $('#clist').innerHTML = companyList(pending, e.target.value); });
    openSwitcher.pending = pending;
  } else {
    const c = D.companies.find(x => x.id === pending);
    modal(mHead('Select Account') + `<div class="body"><div class="input-wrap" style="margin-bottom:6px">${ic('search')}<input class="input" id="aq" placeholder="Search account name / number"></div>
      <div id="alist">${accountList(c, 'all', '')}</div></div><footer><button class="btn block" data-act="aconfirm">Confirm</button></footer>`);
    $('#aq').addEventListener('input', e => { $('#alist').innerHTML = accountList(c, openSwitcher.acc, e.target.value); });
    openSwitcher.acc = c.id === S.company ? S.account : 'all'; openSwitcher.co = c.id;
    $('#alist').innerHTML = accountList(c, openSwitcher.acc, '');
  }
}
const companyList = (sel, q) => D.companies.filter(c => c.name.toLowerCase().includes(q.toLowerCase())).map(c => `<button class="pick ${c.id === sel ? 'on' : ''}" data-act="pickco" data-id="${c.id}">${esc(c.name)}${c.id === sel ? ic('check') : ''}</button>`).join('') || '<p class="muted sm" style="padding:16px 0">No company found.</p>';
const accountList = (c, sel, q) => [{ id: 'all', name: 'All Account(s)', no: '' }, ...c.accounts].filter(a => (a.name + a.no).toLowerCase().includes(q.toLowerCase())).map(a => `<button class="pick ${a.id === sel ? 'on' : ''}" data-act="pickacc" data-id="${a.id}"><span>${esc(a.name)}${a.no ? `<br><small class="muted">${a.no}</small>` : ''}</span>${a.id === sel ? ic('check') : ''}</button>`).join('');

/* ---------- home ---------- */
function usageTotals() {
  const ls = visibleLines();
  const sum = k => ls.reduce((a, l) => a + (l[k] || 0), 0);
  return { voice: sum('voice'), data: sum('data'), rVoice: sum('rVoice'), rData: sum('rData'), n: ls.length };
}
function viewHome() {
  const t = usageTotals(), ls = visibleLines();
  const alerts = ls.filter(l => l.expired || l.status !== 'Active').length;
  const bill = isAdmin() ? D.bills[S.company] : 198;
  const kpi = (icon, label, n, u) => `<div class="card kpi"><div class="row between"><span class="muted sm">${label}</span><span class="ico">${ic(icon)}</span></div><div class="n">${n}<small>${u}</small></div></div>`;
  shell('Home', `<div class="stack">
    <p class="muted">Good ${new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, <b style="color:var(--text)">${esc(S.user.name.split(' ')[0])}</b></p>
    ${switcher()}
    <div class="grid g-main" style="margin-top:16px">
      <div class="card bill"><div class="row between wrap"><div><div class="muted sm">Latest Bill</div><div class="amt"><small class="muted" style="font-size:15px;font-weight:500">HKD</small> ${bill.toLocaleString('en-HK', { minimumFractionDigits: 2 })}</div><div class="xs muted">Due 15-Feb-2025</div></div><button class="btn" data-act="pay">Pay</button></div></div>
      <div class="grid g2"><a href="#/contracts" class="card kpi" style="text-decoration:none;color:inherit"><div class="muted sm">${isAdmin() ? 'Line Users' : 'My Line'}</div><div class="n">${t.n}</div></a>
        <a href="#/contracts" class="card kpi" style="text-decoration:none;color:inherit"><div class="muted sm">Contract Alert</div><div class="n" style="color:${alerts ? 'var(--brand)' : 'inherit'}">${alerts}</div></a></div>
    </div>
    <div class="sec-h"><h2>Usage</h2><span class="xs muted">As of 15-Jan-2025 · Reset 21-Jan-2025</span></div>
    <div class="row" style="margin-bottom:8px"><span class="tag">LOCAL</span></div>
    <div class="grid g2">${kpi('phone', 'Voice', t.voice.toLocaleString(), ' mins')}${kpi('data', 'Data', +t.data.toFixed(1), ' GB')}</div>
    <div class="row" style="margin:14px 0 8px"><span class="tag">ROAMING</span></div>
    <div class="grid g2">${kpi('globe', 'Voice', t.rVoice.toLocaleString(), ' mins')}${kpi('globe', 'Data', t.rData, ' days')}</div>
    <div class="sec-h"><h2>Quick requests</h2><a href="#/requests" class="link sm" style="text-decoration:none">View all</a></div>
    <div class="grid g4">${D.requestTypes.map(reqCard).join('')}</div></div>`, 'home');
}
const reqCard = r => `<a class="card req" href="#/requests/${r.id}"><span class="ico">${ic(r.icon)}</span><div><b>${r.title}</b><div class="sm muted" style="margin-top:2px">${r.desc}</div></div><span class="badge warn" style="align-self:flex-start">${r.tag}</span></a>`;

/* ---------- contracts ---------- */
let cq = '';
function viewContracts() {
  const ls = visibleLines().filter(l => (l.num + l.name).toLowerCase().includes(cq.toLowerCase()));
  shell('Contract', `<div class="stack">${switcher()}
    <div class="toolbar" style="margin-top:6px"><div class="input-wrap">${ic('search')}<input class="input" id="lq" value="${esc(cq)}" placeholder="Search Mobile Number or User Name"></div></div>
    <div class="xs muted" style="letter-spacing:.5px;font-weight:700">LINE USERS (${ls.length})</div>
    <div class="list" id="ll">${lineRows(ls)}</div></div>`, 'contracts');
  const q = $('#lq'); q.addEventListener('input', e => { cq = e.target.value; const r = visibleLines().filter(l => (l.num + l.name).toLowerCase().includes(cq.toLowerCase())); $('#ll').innerHTML = lineRows(r); });
}
const stBadge = l => `<span class="badge ${l.status === 'Active' ? 'ok' : 'bad'}">${l.status}</span>`;
const lineRows = ls => ls.map(l => `<a class="li" href="#/contracts/${encodeURIComponent(l.num)}"><span class="avatar">${esc(l.name[0])}</span><span class="grow"><div class="t">${l.num}</div><div class="sm muted">${esc(l.name)}</div></span>${stBadge(l)}${ic('chev')}</a>`).join('') || '<p class="muted" style="padding:24px;text-align:center">No line users found.</p>';

function viewLine(num) {
  const l = D.lines.find(x => x.num === num);
  if (!l || !visibleLines().includes(l)) return go('/contracts');
  const co = D.companies.find(c => c.id === l.company);
  const u = (icon, label, v, unit, note) => `<div class="card kpi"><div class="row"><span class="ico">${ic(icon)}</span><span class="muted sm">${label}</span></div><div class="n" style="margin-top:8px">${v}<small>${unit}</small></div><div class="xs muted" style="margin-top:4px">${note || '&nbsp;'}</div></div>`;
  shell('Contract', `<a class="crumb" href="#/contracts">${ic('back')} All lines</a>
    <div class="card" style="background:var(--brand-grad);color:#fff"><div class="row between wrap"><div><div class="xs" style="opacity:.85">${esc(co.name)}</div><div style="font-size:26px;font-weight:700">${l.num}</div><div>${esc(l.name)}</div></div><span class="badge" style="background:rgba(255,255,255,.95);color:${l.status === 'Active' ? 'var(--ok)' : 'var(--brand)'}">${l.status}</span></div></div>
    <div class="sec-h"><h2>Usage</h2><span class="xs muted">Reset ${l.reset}</span></div>
    <div class="grid g4">${u('phone', 'Local Voice', l.voice, ' mins', l.voiceNote)}${u('data', 'Local Data', l.data, ' GB', l.dataNote)}${u('globe', 'Roaming Voice', l.rVoice, ' mins', '')}${u('globe', 'Roaming Data', l.rData, ' days', '')}</div>
    <div class="sec-h"><h2>Service Plan</h2></div>
    <div class="list"><button class="li" data-act="plan" data-num="${l.num}"><span class="ico">${ic('file')}</span><span class="grow t">Service Plan<div class="sm muted" style="font-weight:400">${l.plan.desc} · ${l.plan.monthly}/month</div></span>${ic('chev')}</button>
    <button class="li" data-act="sim" data-num="${l.num}"><span class="ico">${ic('sim')}</span><span class="grow t">SIM Contract</span>${l.expired ? '<span class="badge bad">Expired</span>' : ''}${ic('chev')}</button></div>
    <div class="actions" style="justify-content:flex-start"><a class="btn ghost" href="#/requests" style="text-decoration:none">Submit a request</a></div>`, 'contracts');
}
const dlRow = (k, v) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`;
function planModal(l) {
  const p = l.plan;
  modal(mHead('Service Plan') + `<div class="body"><div class="sect-title">Service Plan</div><dl class="dl one" style="margin:0">
    ${dlRow('Monthly Charges', p.monthly)}${dlRow('Plan Description', p.desc)}${dlRow('Free Local Voice Basic Mins', p.freeVoice)}${dlRow('Free Local Voice Intra Mins', p.freeIntra)}
    ${dlRow('Thereafter Local Voice Basic Mins', p.thereBasic)}${dlRow('Thereafter Local Voice Intra Mins', p.thereIntra)}${dlRow('Free Local Data', p.freeData)}${dlRow('Thereafter Local Data', p.thereData)}${dlRow('Additional Service', p.extra)}</dl>
    <div class="sect-title">Additional Entitlement</div><dl class="dl one" style="margin:0">${dlRow('Handset Rebate', p.handset)}${dlRow('Service Fee Rebate', p.svcRebate)}${dlRow('Other Service Rebate', p.otherRebate)}${dlRow('Free IDD Mins', p.idd)}${dlRow('Additional Free Local Voice Mins', p.addVoice)}${dlRow('Additional Free Local Data', p.addData)}</dl></div>`, 'wide');
}
function simModal(l) {
  modal(`<header><span>SIM Contract</span><span class="row">${l.expired ? '<span class="badge bad">Expired</span>' : ''}<button class="icon-btn" data-act="close" aria-label="Close">${ic('x')}</button></span></header><div class="body"><dl class="dl one" style="margin:0">
    ${dlRow('Contract Expiry Date', l.contractEnd)}${dlRow('Remaining Months', l.expired ? '18' : l.months)}${dlRow('Liquidation Damage', 'HK $25 multiplied by the number of months in the remaining Terms.')}</dl></div>`);
}

/* ---------- settings ---------- */
function viewSettings() {
  const u = S.user;
  shell('Settings', `<div class="wiz stack"><div class="card"><div class="row"><div class="avatar" style="width:56px;height:56px;font-size:22px">${esc(u.name[0])}</div><div><b style="font-size:18px">${esc(u.name)}</b><div class="muted sm">${esc(u.title)} · ${esc(S.key)}</div></div></div></div>
    <div class="card stack"><h3>Access</h3><dl class="dl one" style="margin:0">${dlRow('Role', isAdmin() ? 'Corp Admin – multiple companies & line users' : 'Line User – own records only')}${dlRow('Companies in scope', isAdmin() ? D.companies.length + ' companies' : company().name)}${dlRow('OTP delivery', u.channel === 'sms' ? 'SMS ' + u.dest : 'Email ' + u.dest)}</dl></div>
    <div class="card stack"><h3>Preferences</h3><label class="row between"><span>Email notifications for requests</span><span class="switch"><input type="checkbox" checked><i></i></span></label></div>
    <button class="btn ghost block" data-act="logout">${ic('out')} Log out</button></div>`, 'settings');
}

/* ---------- requests hub ---------- */
function viewRequests() {
  shell('Requests', `<div class="stack"><p class="muted">Choose a self-service request. ${isAdmin() ? 'You can submit on behalf of any line in the selected company.' : 'Requests apply to your own line.'}</p>
    ${switcher()}<div class="grid g4" style="margin-top:6px">${D.requestTypes.map(reqCard).join('')}</div></div>`, 'requests');
}

/* ---------- request wizard ---------- */
let W = null;
const FLOWS = { roaming: ['line', 'setting', 'notify', 'confirm'], idd: ['line', 'setting', 'notify', 'confirm'], sim: ['line', 'method', 'details', 'when', 'notify', 'confirm'], reconnect: ['line', 'payment', 'notify', 'confirm'] };
function viewWizard(type) {
  const rt = D.requestTypes.find(r => r.id === type);
  if (!rt) return go('/requests');
  if (!W || W.type !== type) {
    const steps = FLOWS[type].filter(s => s !== 'line' || (isAdmin() && visibleLines().length > 1));
    const ls = visibleLines();
    W = { type, steps, i: 0, d: { line: ls.length === 1 ? ls[0].num : '', enable: true, method: 'delivery', pay: 'yes', notifyOn: true, emails: [S.user.role === 'line' ? 'mary.wong@ablemark.com' : 'admin@ablemark.com'], slot: '', area: '', district: '', store: '' }, e: {}, done: false };
  }
  paintWizard();
}
function stepBody(s) {
  const d = W.d, e = W.e, err = k => e[k] ? `<div class="err-msg">${e[k]}</div>` : '';
  const inp = (k, label, ph = '', type = 'text') => `<label class="field"><span>${label}</span><input class="input ${e[k] ? 'err' : ''}" data-bind="${k}" type="${type}" value="${esc(d[k] || '')}" placeholder="${ph}">${err(k)}</label>`;
  const rt = D.requestTypes.find(r => r.id === W.type);
  switch (s) {
    case 'line': return `<h2>Select line</h2><p class="muted sm" style="margin-bottom:12px">Which line is this request for?</p><div class="stack">${visibleLines().map(l => `<button class="opt ${d.line === l.num ? 'on' : ''}" data-act="setline" data-v="${l.num}"><span class="dot"></span><span class="grow"><b>${l.num}</b><div class="sm muted">${esc(l.name)}</div></span>${stBadge(l)}</button>`).join('')}${err('line')}</div>`;
    case 'setting': { const nm = W.type === 'roaming' ? 'Roaming' : 'IDD'; return `<h2>${nm} service</h2><p class="muted sm" style="margin-bottom:14px">Line ${d.line}</p>
      <div class="card" style="box-shadow:none;border:1px solid var(--line)"><label class="row between"><span><b>${nm} ${d.enable ? 'ON' : 'OFF'}</b><div class="sm muted">${d.enable ? 'Line will be able to use ' + nm.toLowerCase() + ' services.' : nm + ' services will be blocked.'}</div></span><span class="switch"><input type="checkbox" data-bind-chk="enable" ${d.enable ? 'checked' : ''}><i></i></span></label></div>
      <div class="stack" style="margin-top:16px">${inp('date', 'Effective date', '', 'date')}${W.type === 'roaming' && d.enable ? '<div class="banner">' + ic('alert') + '<span>Roaming charges apply per SmarTone tariff. Consider a roaming data pass before travel.</span></div>' : ''}</div>`; }
    case 'method': return `<h2>Choose pick up method</h2><div class="seg" style="margin:14px 0"><button class="${d.method === 'delivery' ? 'on' : ''}" data-act="method" data-v="delivery">Delivery</button><button class="${d.method === 'pickup' ? 'on' : ''}" data-act="method" data-v="pickup">Pick Up at Store</button></div>
      <div class="banner">${ic('alert')}<span>${d.method === 'delivery' ? 'Delivery charge HK$20 applies. Delivery is available in Hong Kong only.' : 'Please bring your HKID and this reference number to collect your SIM.'}</span></div>`;
    case 'details': if (d.method === 'delivery') return `<h2>Delivery Details</h2><div class="stack" style="margin-top:14px">${inp('contact', 'Contact person', 'e.g. Peter Chan')}${inp('phone', 'Contact number', '8 digits', 'tel')}${inp('addr', 'Delivery address', 'Flat, Block, Building')}
        <label class="field"><span>Delivery area</span><select class="input ${e.area ? 'err' : ''}" data-bind="area"><option value="">Select</option>${Object.keys(D.districts).map(a => `<option ${d.area === a ? 'selected' : ''}>${a}</option>`).join('')}</select>${err('area')}</label>
        <label class="field"><span>Delivery district</span><select class="input ${e.district ? 'err' : ''}" data-bind="district"><option value="">Select</option>${(D.districts[d.area] || []).map(a => `<option ${d.district === a ? 'selected' : ''}>${a}</option>`).join('')}</select>${err('district')}</label></div>`;
      return `<h2>Select store</h2><div class="list" style="margin-top:14px;box-shadow:none;border:1px solid var(--line)">${D.stores.map(s => `<button class="li ${d.store === s.id ? 'sel' : ''}" data-act="store" data-v="${s.id}"><span class="ico">${ic('pin')}</span><span class="grow"><div class="t">${s.name}</div><div class="xs muted">${s.addr}<br>${s.hours}</div></span>${d.store === s.id ? ic('check') : ''}</button>`).join('')}</div>${err('store')}`;
    case 'when': { const slots = ['AM', 'PM', 'Evening']; return `<h2>Date and Time</h2><div class="stack" style="margin-top:14px">${inp('date', d.method === 'pickup' ? 'Pick up date' : 'Delivery date', '', 'date')}<div><span class="sm muted">Time slot</span><div class="slots" style="margin-top:6px">${slots.map(t => `<button data-act="slot" data-v="${t}" class="${d.slot === t ? 'on' : ''}">${t}</button>`).join('')}</div>${err('slot')}</div></div>`; }
    case 'payment': return `<h2>Reconnection</h2><p class="muted sm">Line ${d.line}</p><p style="margin:14px 0 8px"><b>Have you settled the outstanding payment?</b></p>
      <div class="seg"><button class="${d.pay === 'yes' ? 'on' : ''}" data-act="paid" data-v="yes">Yes, Paid</button><button class="${d.pay === 'no' ? 'on' : ''}" data-act="paid" data-v="no">Not yet</button></div>
      ${d.pay === 'no' ? `<div class="banner" style="margin-top:14px">${ic('alert')}<span>Please settle the outstanding amount first. Reconnection is processed after payment is verified.</span></div>` : `<div class="stack" style="margin-top:14px">${inp('payDate', 'Settlement date', '', 'date')}
        <label class="field"><span>Payment method</span><select class="input ${e.payMethod ? 'err' : ''}" data-bind="payMethod"><option value="">Select</option>${['FPS', 'Bank transfer', 'Cheque', 'Credit card', 'Convenience store'].map(a => `<option ${d.payMethod === a ? 'selected' : ''}>${a}</option>`).join('')}</select>${err('payMethod')}</label>
        ${inp('amount', 'Amount (HKD)', '0.00', 'number')}
        <div><span class="sm muted">Payment receipt</span><label class="drop" style="margin-top:6px">${ic('upload')}<div>${d.file ? '<b style="color:var(--text)">' + esc(d.file) + '</b>' : 'Tap to upload receipt (JPG, PNG, PDF)'}</div><input type="file" accept="image/*,.pdf" data-file hidden></label>${err('file')}</div></div>`}`;
    case 'notify': return `<h2>Notification</h2><div class="card" style="box-shadow:none;border:1px solid var(--line);margin-top:14px"><label class="row between"><span><b>Email notification</b><div class="sm muted">Send updates to the provided email(s).</div></span><span class="switch"><input type="checkbox" data-bind-chk="notifyOn" ${d.notifyOn ? 'checked' : ''}><i></i></span></label>
      ${d.notifyOn ? `<div class="stack" style="margin-top:14px">${d.emails.map((m, i) => `<div class="row"><input class="input grow" data-email="${i}" type="email" value="${esc(m)}" placeholder="name@company.com">${d.emails.length > 1 ? `<button class="icon-btn" data-act="rmemail" data-v="${i}" aria-label="Remove email">${ic('x')}</button>` : ''}</div>`).join('')}${err('emails')}${d.emails.length < 3 ? '<button class="link sm" data-act="addemail">+ Add email</button>' : ''}</div>` : ''}</div>`;
    case 'confirm': return `<h2>Confirmation</h2><div class="banner" style="margin:14px 0">${ic('alert')}<span>Please confirm the information provided below is correct before submitting.</span></div>
      <dl class="dl one" style="margin:0">${summary().map(([k, v]) => dlRow(k, v)).join('')}</dl>`;
  }
}
function summary() {
  const d = W.d, l = D.lines.find(x => x.num === d.line), rt = D.requestTypes.find(r => r.id === W.type);
  const rows = [['Request', rt.title], ['Company', company().name], ['Line', `${d.line} · ${l ? l.name : ''}`]];
  if (W.type === 'roaming' || W.type === 'idd') rows.push(['Action', d.enable ? 'Turn ON' : 'Turn OFF'], ['Effective date', d.date]);
  if (W.type === 'sim') {
    rows.push(['Method', d.method === 'delivery' ? 'Delivery (HK$20)' : 'Pick up at store']);
    if (d.method === 'delivery') rows.push(['Contact', `${d.contact} · ${d.phone}`], ['Address', `${d.addr}, ${d.district}, ${d.area}`]); else { const s = D.stores.find(x => x.id === d.store); rows.push(['Store', s ? s.name : ''], ['Store address', s ? s.addr : '']); }
    rows.push(['Date / time', `${d.date} · ${d.slot}`]);
  }
  if (W.type === 'reconnect') rows.push(['Payment', d.pay === 'yes' ? `HKD ${d.amount} via ${d.payMethod} on ${d.payDate}` : 'Not yet paid'], ['Receipt', d.file || '–']);
  rows.push(['Notification', d.notifyOn ? d.emails.filter(Boolean).join(', ') : 'Off']);
  return rows;
}
function validate(s) {
  const d = W.d, e = {}, req = (k, m) => { if (!String(d[k] || '').trim()) e[k] = m; };
  const today = new Date().toISOString().slice(0, 10);
  if (s === 'line') req('line', 'Please select a line');
  if (s === 'setting') { req('date', 'Please select a date'); if (d.date && d.date < today) e.date = 'Date cannot be in the past'; }
  if (s === 'details') {
    if (d.method === 'delivery') { req('contact', 'Required'); req('addr', 'Required'); req('area', 'Required'); req('district', 'Required'); if (!/^\d{8}$/.test((d.phone || '').replace(/\s/g, ''))) e.phone = 'Enter an 8-digit number'; }
    else req('store', 'Please select a store');
  }
  if (s === 'when') { req('date', 'Please select a date'); if (d.date && d.date < today) e.date = 'Date cannot be in the past'; req('slot', 'Please select a time slot'); }
  if (s === 'payment') { if (d.pay === 'no') e.pay = 1; else { req('payDate', 'Required'); req('payMethod', 'Required'); req('amount', 'Required'); req('file', 'Please upload the receipt'); } }
  if (s === 'notify' && d.notifyOn) { const ok = d.emails.filter(m => m.trim()); if (!ok.length || ok.some(m => !/^\S+@\S+\.\S+$/.test(m))) e.emails = 'Enter valid email address(es)'; }
  return e;
}
function paintWizard() {
  const rt = D.requestTypes.find(r => r.id === W.type);
  if (W.done) {
    shell(rt.title, `<div class="wiz card success"><div class="tick">${ic('check')}</div><h2>Submission Successful</h2><p class="muted" style="margin-top:6px">Your request has been received.</p><div class="ref">REF ${W.ref}</div>
      <dl class="dl one" style="text-align:left;margin:22px 0 0">${summary().map(([k, v]) => dlRow(k, v)).join('')}</dl>
      <div class="actions" style="justify-content:center"><button class="btn ghost" data-act="again">New request</button><a class="btn" href="#/home" style="text-decoration:none">Back to Home</a></div></div>`, 'requests'); return;
  }
  const s = W.steps[W.i], last = W.steps.length - 1;
  const blocked = s === 'payment' && W.d.pay === 'no';
  shell(rt.title, `<div class="wiz"><a class="crumb" href="#/requests">${ic('back')} Requests</a><div class="steps" aria-label="Step ${W.i + 1} of ${W.steps.length}">${W.steps.map((_, i) => `<i class="${i <= W.i ? 'on' : ''}"></i>`).join('')}</div>
    <div class="card">${stepBody(s)}</div>
    <div class="actions">${W.i > 0 ? '<button class="btn plain" data-act="prev">Back</button>' : '<a class="btn plain" href="#/requests" style="text-decoration:none">Cancel</a>'}<button class="btn" data-act="next" ${blocked ? 'disabled' : ''}>${W.i === last ? 'Submit' : 'Next'}</button></div></div>`, 'requests');
}
function next() {
  const s = W.steps[W.i]; W.e = validate(s);
  if (Object.keys(W.e).length) { paintWizard(); const f = $('.err'); f && f.focus && f.focus(); return; }
  if (W.i === W.steps.length - 1) { W.done = true; W.ref = 'SR' + Date.now().toString().slice(-8); toast('Request submitted'); } else W.i++;
  paintWizard(); window.scrollTo(0, 0);
}

/* ---------- events ---------- */
document.addEventListener('click', e => {
  const t = e.target.closest('[data-act]'); if (!t) return;
  const a = t.dataset.act, v = t.dataset.v;
  const D_ = W && W.d;
  switch (a) {
    case 'close': return closeModal();
    case 'showpw': { const p = $('#lp'); p.type = p.type === 'password' ? 'text' : 'password'; return; }
    case 'forgot': return modal(`<div class="warnic">${ic('alert')}</div><h3>Need help?</h3><p class="muted sm" style="margin:6px 0 18px">Please contact your SmarTone Customer Service representative to reset your credentials.</p><button class="btn block" data-act="close">OK</button>`, 'alert');
    case 'otpback': L.pending = null; clearInterval(L.tmr); return go('/login');
    case 'resend': L.timer = 30; startTimer(); L.otpErr = false; toast('A new code has been sent'); return viewOtp();
    case 'logout': S = { user: null, key: null, company: null, account: 'all' }; W = null; save(); return go('/login');
    case 'notif': return modal(mHead('Notifications') + `<div class="body"><div class="list" style="box-shadow:none"><div class="li"><span class="ico">${ic('alert')}</span><span class="grow"><div class="t">Contract expired</div><div class="sm muted">6123 4567 SIM contract has expired.</div></span></div><div class="li"><span class="ico">${ic('file')}</span><span class="grow"><div class="t">New bill available</div><div class="sm muted">Latest bill is ready to view and pay.</div></span></div></div></div>`);
    case 'pay': return modal(`<div class="warnic" style="background:var(--brand-soft);color:var(--brand)">${ic('file')}</div><h3>Pay bill</h3><p class="muted sm" style="margin:6px 0 18px">Online payment is not part of this prototype.</p><button class="btn block" data-act="close">OK</button>`, 'alert');
    case 'switch': return openSwitcher('company');
    case 'pickco': openSwitcher.pending = t.dataset.id; $('#clist').innerHTML = companyList(t.dataset.id, $('#cq').value); return;
    case 'cnext': return openSwitcher('account', openSwitcher.pending);
    case 'pickacc': openSwitcher.acc = t.dataset.id; $('#alist').innerHTML = accountList(D.companies.find(c => c.id === openSwitcher.co), t.dataset.id, $('#aq').value); return;
    case 'aconfirm': S.company = openSwitcher.co; S.account = openSwitcher.acc; save(); cq = ''; W = null; closeModal(); return route();
    case 'plan': return planModal(D.lines.find(l => l.num === t.dataset.num));
    case 'sim': return simModal(D.lines.find(l => l.num === t.dataset.num));
    case 'setline': D_.line = v; W.e = {}; return paintWizard();
    case 'method': D_.method = v; return paintWizard();
    case 'store': D_.store = v; return paintWizard();
    case 'slot': D_.slot = v; return paintWizard();
    case 'paid': D_.pay = v; return paintWizard();
    case 'addemail': D_.emails.push(''); return paintWizard();
    case 'rmemail': D_.emails.splice(+v, 1); return paintWizard();
    case 'prev': W.e = {}; W.i--; return paintWizard();
    case 'next': return next();
    case 'again': { const ty = W.type; W = null; return viewWizard(ty); }
  }
});
document.addEventListener('input', e => {
  if (!W) return; const t = e.target, d = W.d;
  if (t.dataset.bind) { d[t.dataset.bind] = t.value; if (t.dataset.bind === 'area') { d.district = ''; paintWizard(); } }
  if (t.dataset.email !== undefined) d.emails[+t.dataset.email] = t.value;
});
document.addEventListener('change', e => {
  if (!W) return; const t = e.target, d = W.d;
  if (t.dataset.bindChk) { d[t.dataset.bindChk] = t.checked; paintWizard(); }
  if (t.dataset.file !== undefined && t.files[0]) { d.file = t.files[0].name; paintWizard(); }
});

route();
})();
