/**
 * exportReport.ts
 * ─────────────────────────────────────────────────────────────────────────
 * Professional PDF report generator — 100% Expo, zero backend.
 *
 * INSTALL (once):
 *   npx expo install expo-print expo-sharing
 *
 * USAGE in SettingsScreen.tsx:
 *   import { exportReport } from '../../utils/exportReport';
 *   onPress={() => exportReport(state)}
 * ─────────────────────────────────────────────────────────────────────────
 */

import * as Print   from 'expo-print';
import * as Sharing from 'expo-sharing';
import { File }     from 'expo-file-system';
import { Alert }    from 'react-native';

// ── Types ──────────────────────────────────────────────────────────────────
interface FrequencySettings {
  wirdPerDay:   1 | 2;
  wazifaPerDay: 1 | 2;
  hadraPerDay:  1;
}

interface AppState {
  wird:   { istighfar: number; salatFatih: number; tahlil: number };
  wazifa: { istighfar: number; salatFatih1: number; tahlil: number; jawhara: number };
  hadra:  { tahlil: number; ismuLlah: number };
  hadraTargets:      { tahlil: number; ismuLlah: number };
  wazifaSettings:    { useJawhara: boolean; jawharaCount: 11 | 12 };
  wirdSettings:      { salawatFormula: string };
  frequencySettings: FrequencySettings;
  completedWirds:    string[];
  completedWazifas:  string[];
  completedHadras:   string[];
  streak: number;
  settings: {
    audioEnabled: boolean;
    notificationsEnabled: boolean;
    darkMode: boolean;
    language: string;
    fontSize: string;
    reminderTimes: { morning: string; evening: string; friday: string };
  };
}

// ── Helpers ────────────────────────────────────────────────────────────────
const pct = (v: number, t: number) => Math.min(Math.round((v / t) * 100), 100);

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

const getTodayStr = () => new Date().toISOString().split('T')[0];

/** Count entries for a specific date */
const countForDate = (entries: string[], date: string) =>
  entries.filter(d => d === date).length;

/** Days where completions >= required frequency */
const countFullyCompletedDays = (dates: string[], required: number): number => {
  const tally = new Map<string, number>();
  for (const d of dates) tally.set(d, (tally.get(d) ?? 0) + 1);
  let count = 0;
  tally.forEach(v => { if (v >= required) count++; });
  return count;
};

/** Fully-completed days in last N days */
const countFullyCompletedLastNDays = (dates: string[], required: number, n: number): number => {
  const cutoff = new Date(Date.now() - n * 86400000).toISOString().split('T')[0];
  const recent = dates.filter(d => d >= cutoff);
  const tally  = new Map<string, number>();
  for (const d of recent) tally.set(d, (tally.get(d) ?? 0) + 1);
  let count = 0;
  tally.forEach(v => { if (v >= required) count++; });
  return count;
};

const progressBar = (value: number, target: number, color: string) => {
  const p = pct(value, target);
  return `
    <div class="bar-wrap">
      <div class="bar-track">
        <div class="bar-fill" style="width:${p}%;background:${color};"></div>
      </div>
      <span class="bar-count">${value}<span class="bar-target">/${target}</span></span>
    </div>`;
};

const statusBadge = (value: number, target: number) => {
  const done = value >= target;
  return `<span class="badge ${done ? 'badge-done' : 'badge-progress'}">${done ? '✓ Done' : `${pct(value, target)}%`}</span>`;
};

const freqBadge = (done: number, target: number, color: string) => {
  const full = done >= target;
  return `
    <div class="freq-badge" style="border-color:${color}30;background:${color}0D">
      ${Array.from({ length: target }).map((_, i) =>
        `<span class="freq-dot" style="background:${i < done ? color : '#E2E8F0'}"></span>`
      ).join('')}
      <span class="freq-txt" style="color:${full ? color : '#94A3B8'}">${Math.min(done, target)}/${target}</span>
    </div>`;
};

const circleGauge = (label: string, percent: number, color: string, sub: string) => {
  const r = 34, circ = 2 * Math.PI * r;
  const dash = (percent / 100) * circ;
  return `
    <div class="gauge-card">
      <svg width="86" height="86" viewBox="0 0 86 86">
        <circle cx="43" cy="43" r="${r}" fill="none" stroke="#E2E8F0" stroke-width="7"/>
        <circle cx="43" cy="43" r="${r}" fill="none" stroke="${color}" stroke-width="7"
          stroke-dasharray="${dash.toFixed(1)} ${circ.toFixed(1)}"
          stroke-dashoffset="${(circ / 4).toFixed(1)}"
          stroke-linecap="round"/>
        <text x="43" y="47" text-anchor="middle" font-size="13" font-weight="700"
          fill="${color}" font-family="Arial">${percent}%</text>
      </svg>
      <div class="gauge-label">${label}</div>
      <div class="gauge-sub">${sub}</div>
    </div>`;
};

// ── HTML Builder ───────────────────────────────────────────────────────────
const buildHTML = (state: AppState): string => {
  const now        = new Date();
  const exportDate = now.toLocaleDateString('en-US', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
  const exportTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const today      = getTodayStr();
  const friday     = now.getDay() === 5;

  const { frequencySettings } = state;
  const jawharaTarget = state.wazifaSettings.useJawhara ? state.wazifaSettings.jawharaCount : 20;
  const jawharaLabel  = state.wazifaSettings.useJawhara ? 'Jawhara' : 'Ṣalāt al-Fātiḥ';

  // ── Today's session counts ──
  const wirdToday   = countForDate(state.completedWirds,   today);
  const wazifaToday = countForDate(state.completedWazifas, today);
  const hadraToday  = countForDate(state.completedHadras,  today);

  // ── Fully-completed days ──
  const totalWirdDays   = countFullyCompletedDays(state.completedWirds,   frequencySettings.wirdPerDay);
  const totalWazifaDays = countFullyCompletedDays(state.completedWazifas, frequencySettings.wazifaPerDay);
  const totalHadraDays  = countFullyCompletedDays(state.completedHadras,  frequencySettings.hadraPerDay);

  // ── This week (7 days) ──
  const wirdWeek   = countFullyCompletedLastNDays(state.completedWirds,   frequencySettings.wirdPerDay,   7);
  const wazifaWeek = countFullyCompletedLastNDays(state.completedWazifas, frequencySettings.wazifaPerDay, 7);
  const hadraWeek  = countFullyCompletedLastNDays(state.completedHadras,  frequencySettings.hadraPerDay,  7);

  const lastWird   = state.completedWirds.length   > 0
    ? fmtDate(state.completedWirds[state.completedWirds.length - 1])   : '—';
  const lastWazifa = state.completedWazifas.length > 0
    ? fmtDate(state.completedWazifas[state.completedWazifas.length - 1]) : '—';

  const wirdPct   = Math.round((pct(state.wird.istighfar, 100) + pct(state.wird.salatFatih, 100) + pct(state.wird.tahlil, 100)) / 3);
  const wazifaPct = Math.round((pct(state.wazifa.istighfar, 30) + pct(state.wazifa.salatFatih1, 50) + pct(state.wazifa.tahlil, 100) + pct(state.wazifa.jawhara, jawharaTarget)) / 4);
  const hadraPct  = Math.round((pct(state.hadra.tahlil, state.hadraTargets.tahlil) + pct(state.hadra.ismuLlah, state.hadraTargets.ismuLlah)) / 2);

  // ── Total sessions ──
  const totalWirdSessions   = state.completedWirds.length;
  const totalWazifaSessions = state.completedWazifas.length;
  const totalHadraSessions  = state.completedHadras.length;

  // ── Cumulative dhikr ──
  const totalIstighfar = totalWirdSessions * 100 + totalWazifaSessions * 30;
  const totalSalawat   = totalWirdSessions * 100 + totalWazifaSessions * 50;
  const totalTahlil    = totalWirdSessions * 100 + totalWazifaSessions * 100 + totalHadraSessions * state.hadraTargets.tahlil;
  const totalIsmuLlah  = totalHadraSessions * state.hadraTargets.ismuLlah;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<style>
  :root {
    --green:    #059669; --green-dk: #047857; --green-lt: #D1FAE5;
    --teal:     #0D9488; --gold:     #D97706; --gold-lt:  #FEF3C7;
    --ruby:     #DC2626; --violet:   #7C3AED;
    --slate:    #1E293B; --slate-md: #475569; --slate-lt: #94A3B8;
    --border:   #E2E8F0; --bg:       #F8FAFC; --white:    #FFFFFF;
  }
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family:Arial,Helvetica,sans-serif; background:var(--bg); color:var(--slate); font-size:13px; line-height:1.5; }

  /* HEADER */
  .header { background:linear-gradient(135deg,var(--green-dk) 0%,var(--green) 55%,var(--teal) 100%); padding:28px 32px 22px; position:relative; overflow:hidden; }
  .hc1 { position:absolute; top:-50px; right:-60px; width:200px; height:200px; border-radius:50%; background:rgba(255,255,255,0.06); }
  .hc2 { position:absolute; top:20px; right:40px; width:100px; height:100px; border-radius:50%; background:rgba(255,255,255,0.04); }
  .hi  { position:relative; z-index:1; }
  .app-name { font-size:24px; font-weight:900; color:#fff; letter-spacing:-0.5px; }
  .app-sub  { font-size:12px; color:rgba(255,255,255,0.75); margin-top:3px; font-weight:300; }
  .hrow { display:flex; justify-content:space-between; align-items:center; margin-top:16px; }
  .exp-info { font-size:11px; color:rgba(255,255,255,0.7); }
  .exp-info strong { color:#fff; }
  .vpill { background:rgba(255,255,255,0.15); border:1px solid rgba(255,255,255,0.25); color:#fff; font-size:10px; font-weight:700; padding:3px 10px; border-radius:20px; letter-spacing:0.5px; }
  .gold-stripe { height:3px; background:linear-gradient(90deg,var(--gold),#F59E0B,var(--gold)); }

  /* PAGE */
  .page { padding:20px 28px 24px; }

  /* STAT CARDS */
  .stats-row { display:flex; gap:10px; margin-bottom:18px; }
  .stat-card { flex:1; background:var(--white); border:1px solid var(--border); border-radius:12px; padding:12px 10px; text-align:center; position:relative; overflow:hidden; }
  .stat-card::before { content:''; position:absolute; top:0; left:0; right:0; height:4px; border-radius:12px 12px 0 0; }
  .c1::before { background:var(--green); } .c2::before { background:var(--teal); }
  .c3::before { background:var(--gold);  } .c4::before { background:var(--ruby); }
  .c5::before { background:var(--violet); }
  .stat-val { font-size:24px; font-weight:900; line-height:1; margin-bottom:3px; }
  .c1 .stat-val{color:var(--green);} .c2 .stat-val{color:var(--teal);}
  .c3 .stat-val{color:var(--gold);}  .c4 .stat-val{color:var(--ruby);}
  .c5 .stat-val{color:var(--violet);}
  .stat-lbl { font-size:8.5px; color:var(--slate-md); font-weight:700; text-transform:uppercase; letter-spacing:0.5px; }
  .stat-sub { font-size:8.5px; color:var(--slate-lt); margin-top:3px; }

  /* GAUGES */
  .gauges-row { display:flex; justify-content:space-around; background:var(--white); border:1px solid var(--border); border-radius:14px; padding:14px 20px 10px; margin-bottom:18px; }
  .gauge-card  { text-align:center; }
  .gauge-label { font-size:10px; font-weight:700; color:var(--slate); margin-top:4px; text-transform:uppercase; letter-spacing:0.5px; }
  .gauge-sub   { font-size:9px; color:var(--slate-lt); margin-top:2px; }

  /* FREQUENCY OVERVIEW */
  .freq-overview { background:var(--white); border:1px solid var(--border); border-radius:12px; overflow:hidden; margin-bottom:18px; }
  .freq-header   { background:linear-gradient(90deg,var(--slate),var(--slate-md)); color:#fff; font-size:9.5px; font-weight:700; text-transform:uppercase; letter-spacing:0.8px; padding:7px 14px; }
  .freq-grid     { display:flex; }
  .freq-col      { flex:1; padding:12px 14px; border-right:1px solid var(--border); }
  .freq-col:last-child { border-right:none; }
  .fc-name  { font-size:11px; font-weight:700; color:var(--slate); margin-bottom:2px; }
  .fc-freq  { font-size:9px; color:var(--slate-lt); margin-bottom:8px; }
  .fc-stats { display:flex; gap:10px; }
  .fc-stat  { text-align:center; }
  .fc-val   { font-size:16px; font-weight:900; line-height:1; }
  .fc-lbl   { font-size:8px; color:var(--slate-lt); font-weight:600; text-transform:uppercase; letter-spacing:0.4px; margin-top:2px; }

  /* TODAY FREQUENCY BADGES */
  .freq-badge { display:inline-flex; align-items:center; gap:4px; border:1px solid; border-radius:8px; padding:3px 7px; }
  .freq-dot   { width:7px; height:7px; border-radius:50%; display:inline-block; }
  .freq-txt   { font-size:9px; font-weight:700; }

  /* SECTION TITLE */
  .sec-title { display:flex; align-items:center; gap:7px; font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:var(--green-dk); margin-bottom:8px; padding-bottom:5px; border-bottom:2px solid var(--green-lt); }
  .sec-dot   { width:7px; height:7px; border-radius:50%; background:var(--green); flex-shrink:0; }

  /* CARD */
  .card { background:var(--white); border:1px solid var(--border); border-radius:12px; overflow:hidden; margin-bottom:16px; }

  /* DHIKR TABLE */
  .dhikr-table { width:100%; border-collapse:collapse; }
  .dhikr-table tr { border-bottom:1px solid var(--border); }
  .dhikr-table tr:last-child { border-bottom:none; }
  .dhikr-table tr:nth-child(even) td { background:#FAFBFC; }
  .dhikr-table td { padding:8px; vertical-align:middle; }
  .td-name  { width:28%; } .td-bar { width:48%; } .td-badge { width:14%; text-align:right; white-space:nowrap; }
  .d-name { font-weight:700; font-size:11.5px; color:var(--slate); }
  .d-ar   { font-size:9.5px; color:var(--slate-lt); margin-top:1px; }

  /* PROGRESS BAR */
  .bar-wrap  { display:flex; align-items:center; gap:7px; }
  .bar-track { flex:1; height:8px; background:var(--border); border-radius:99px; overflow:hidden; }
  .bar-fill  { height:100%; border-radius:99px; }
  .bar-count { font-size:10px; font-weight:700; color:var(--slate); white-space:nowrap; }
  .bar-target{ font-weight:400; color:var(--slate-lt); }

  /* BADGE */
  .badge { display:inline-block; font-size:9px; font-weight:700; padding:2px 7px; border-radius:20px; text-transform:uppercase; letter-spacing:0.4px; white-space:nowrap; }
  .badge-done     { background:var(--green-lt); color:var(--green-dk); }
  .badge-progress { background:var(--gold-lt);  color:var(--gold); }

  /* CUMULATIVE TABLE */
  .cum-table { width:100%; border-collapse:collapse; }
  .cum-table tr { border-bottom:1px solid var(--border); }
  .cum-table tr:last-child { border-bottom:none; }
  .cum-table tr:nth-child(even) td { background:#FAFBFC; }
  .cum-table td { padding:8px 12px; font-size:12px; vertical-align:middle; }
  .cum-label { color:var(--slate-md); flex:1; }
  .cum-value { font-weight:800; color:var(--slate); text-align:right; white-space:nowrap; }

  /* SETTINGS */
  .settings-grid { display:flex; gap:12px; margin-bottom:14px; }
  .settings-block { flex:1; background:var(--white); border:1px solid var(--border); border-radius:12px; overflow:hidden; }
  .sb-title { background:var(--green); color:#fff; font-size:9.5px; font-weight:700; text-transform:uppercase; letter-spacing:0.8px; padding:7px 12px; }
  .sb-row   { display:flex; justify-content:space-between; align-items:center; padding:7px 12px; border-bottom:1px solid var(--border); font-size:11px; }
  .sb-row:last-child { border-bottom:none; }
  .sb-row:nth-child(even) { background:#FAFAFA; }
  .sk { color:var(--slate-md); } .sv { font-weight:700; color:var(--slate); }
  .s-on { color:var(--green); }  .s-off { color:var(--ruby); }

  /* REMINDERS */
  .reminders { background:var(--white); border:1px solid var(--border); border-radius:12px; overflow:hidden; margin-bottom:18px; }
  .rem-grid  { display:flex; }
  .rem-item  { flex:1; padding:12px 16px; border-right:1px solid var(--border); }
  .rem-item:last-child { border-right:none; }
  .rem-label { font-size:9.5px; color:var(--slate-lt); text-transform:uppercase; letter-spacing:0.5px; margin-bottom:4px; }
  .rem-time  { font-size:22px; font-weight:900; }

  /* CLOSING */
  .closing { background:linear-gradient(135deg,var(--green-dk),var(--teal)); border-radius:14px; padding:22px 28px; text-align:center; margin-top:4px; }
  .cl-arabic { font-size:18px; color:rgba(255,255,255,0.85); margin-bottom:6px; }
  .cl-title  { font-size:16px; font-weight:900; color:#fff; letter-spacing:-0.3px; margin-bottom:8px; }
  .cl-text   { font-size:11px; color:rgba(255,255,255,0.8); line-height:1.8; }
  .cl-ver    { margin-top:14px; font-size:10px; color:rgba(255,255,255,0.45); letter-spacing:1px; }

  /* FOOTER */
  .footer { display:flex; justify-content:space-between; padding:10px 28px 16px; border-top:1px solid var(--border); font-size:9px; color:var(--slate-lt); }

  .page-break { page-break-before:always; }
</style>
</head>
<body>

<!-- HEADER -->
<div class="header">
  <div class="hc1"></div><div class="hc2"></div>
  <div class="hi">
    <div class="app-name">Wird &amp; Wazīfa Tijāniyya</div>
    <div class="app-sub">Personal Spiritual Practice Report</div>
    <div class="hrow">
      <div class="exp-info"><strong>${exportDate}</strong>&nbsp;·&nbsp;${exportTime}</div>
      <div class="vpill">v1.0</div>
    </div>
  </div>
</div>
<div class="gold-stripe"></div>

<!-- ── PAGE 1 ── -->
<div class="page">

  <!-- STAT CARDS -->
  <div class="stats-row">
    <div class="stat-card c1">
      <div class="stat-val">${totalWirdDays}</div>
      <div class="stat-lbl">Wird Days</div>
      <div class="stat-sub">${totalWirdSessions} sessions · last ${lastWird}</div>
    </div>
    <div class="stat-card c2">
      <div class="stat-val">${totalWazifaDays}</div>
      <div class="stat-lbl">Wazifa Days</div>
      <div class="stat-sub">${totalWazifaSessions} sessions · last ${lastWazifa}</div>
    </div>
    <div class="stat-card c3">
      <div class="stat-val">${totalHadraDays}</div>
      <div class="stat-lbl">Hadra Days</div>
      <div class="stat-sub">${totalHadraSessions} sessions total</div>
    </div>
    <div class="stat-card c4">
      <div class="stat-val">${state.streak}</div>
      <div class="stat-lbl">Day Streak</div>
      <div class="stat-sub">days in a row</div>
    </div>
  </div>

  <!-- GAUGES -->
  <div class="gauges-row">
    ${circleGauge('Wird',  wirdPct,  '#059669', 'this session')}
    ${circleGauge('Wazifa', wazifaPct,'#0D9488', 'this session')}
    ${circleGauge('Hadra', hadraPct, '#D97706', 'this session')}
  </div>

  <!-- FREQUENCY OVERVIEW -->
  <div class="freq-overview">
    <div class="freq-header">Daily Frequency &amp; Today's Progress</div>
    <div class="freq-grid">

      <!-- Wird -->
      <div class="freq-col">
        <div class="fc-name">Wird Tijāni</div>
        <div class="fc-freq">${frequencySettings.wirdPerDay}× per day required</div>
        ${freqBadge(wirdToday, frequencySettings.wirdPerDay, '#DC2626')}
        <div class="fc-stats" style="margin-top:10px">
          <div class="fc-stat">
            <div class="fc-val" style="color:#059669">${wirdWeek}</div>
            <div class="fc-lbl">This week</div>
          </div>
          <div class="fc-stat">
            <div class="fc-val" style="color:#059669">${totalWirdDays}</div>
            <div class="fc-lbl">Total days</div>
          </div>
        </div>
      </div>

      <!-- Wazifa -->
      <div class="freq-col">
        <div class="fc-name">Wazīfa Tijāniyya</div>
        <div class="fc-freq">${frequencySettings.wazifaPerDay}× per day required</div>
        ${freqBadge(wazifaToday, frequencySettings.wazifaPerDay, '#D97706')}
        <div class="fc-stats" style="margin-top:10px">
          <div class="fc-stat">
            <div class="fc-val" style="color:#0D9488">${wazifaWeek}</div>
            <div class="fc-lbl">This week</div>
          </div>
          <div class="fc-stat">
            <div class="fc-val" style="color:#0D9488">${totalWazifaDays}</div>
            <div class="fc-lbl">Total days</div>
          </div>
        </div>
      </div>

      <!-- Hadra -->
      <div class="freq-col">
        <div class="fc-name">Ḥaḍratu-l-Jumūʿa</div>
        <div class="fc-freq">${frequencySettings.hadraPerDay}× per Friday required</div>
        ${friday
          ? freqBadge(hadraToday, frequencySettings.hadraPerDay, '#7C3AED')
          : `<span class="badge badge-progress" style="font-size:8px">Not Friday</span>`
        }
        <div class="fc-stats" style="margin-top:10px">
          <div class="fc-stat">
            <div class="fc-val" style="color:#7C3AED">${hadraWeek}</div>
            <div class="fc-lbl">This week</div>
          </div>
          <div class="fc-stat">
            <div class="fc-val" style="color:#7C3AED">${totalHadraDays}</div>
            <div class="fc-lbl">Total days</div>
          </div>
        </div>
      </div>

    </div>
  </div>

  <!-- WIRD -->
  <div class="sec-title"><span class="sec-dot"></span>Daily Wird — Current Session</div>
  <div class="card">
    <table class="dhikr-table">
      <tr>
        <td class="td-name"><div class="d-name">Istighfār</div><div class="d-ar">Astaghfiru-llāh</div></td>
        <td class="td-bar">${progressBar(state.wird.istighfar, 100, '#059669')}</td>
        <td class="td-badge">${statusBadge(state.wird.istighfar, 100)}</td>
      </tr>
      <tr>
        <td class="td-name"><div class="d-name">Ṣalāt al-Fātiḥ</div><div class="d-ar">${state.wirdSettings.salawatFormula}</div></td>
        <td class="td-bar">${progressBar(state.wird.salatFatih, 100, '#0D9488')}</td>
        <td class="td-badge">${statusBadge(state.wird.salatFatih, 100)}</td>
      </tr>
      <tr>
        <td class="td-name"><div class="d-name">Tahlīl</div><div class="d-ar">Lā ilāha illa-llāh</div></td>
        <td class="td-bar">${progressBar(state.wird.tahlil, 100, '#D97706')}</td>
        <td class="td-badge">${statusBadge(state.wird.tahlil, 100)}</td>
      </tr>
    </table>
  </div>

  <!-- WAZIFA -->
  <div class="sec-title"><span class="sec-dot" style="background:var(--teal)"></span>Wazīfa — Current Session</div>
  <div class="card">
    <table class="dhikr-table">
      <tr>
        <td class="td-name"><div class="d-name">Istighfār</div><div class="d-ar">Astaghfiru-llāh</div></td>
        <td class="td-bar">${progressBar(state.wazifa.istighfar, 30, '#059669')}</td>
        <td class="td-badge">${statusBadge(state.wazifa.istighfar, 30)}</td>
      </tr>
      <tr>
        <td class="td-name"><div class="d-name">Ṣalāt al-Fātiḥ</div><div class="d-ar">Al-Fātiḥu limā ughliq</div></td>
        <td class="td-bar">${progressBar(state.wazifa.salatFatih1, 50, '#0D9488')}</td>
        <td class="td-badge">${statusBadge(state.wazifa.salatFatih1, 50)}</td>
      </tr>
      <tr>
        <td class="td-name"><div class="d-name">Tahlīl</div><div class="d-ar">Lā ilāha illa-llāh</div></td>
        <td class="td-bar">${progressBar(state.wazifa.tahlil, 100, '#D97706')}</td>
        <td class="td-badge">${statusBadge(state.wazifa.tahlil, 100)}</td>
      </tr>
      <tr>
        <td class="td-name"><div class="d-name">${jawharaLabel}</div><div class="d-ar">Jawhara al-Kamāl</div></td>
        <td class="td-bar">${progressBar(state.wazifa.jawhara, jawharaTarget, '#DC2626')}</td>
        <td class="td-badge">${statusBadge(state.wazifa.jawhara, jawharaTarget)}</td>
      </tr>
    </table>
  </div>

  <!-- HADRA -->
  <div class="sec-title"><span class="sec-dot" style="background:var(--gold)"></span>Ḥaḍra — Current Session</div>
  <div class="card">
    <table class="dhikr-table">
      <tr>
        <td class="td-name"><div class="d-name">Tahlīl</div><div class="d-ar">Lā ilāha illa-llāh</div></td>
        <td class="td-bar">${progressBar(state.hadra.tahlil, state.hadraTargets.tahlil, '#059669')}</td>
        <td class="td-badge">${statusBadge(state.hadra.tahlil, state.hadraTargets.tahlil)}</td>
      </tr>
      <tr>
        <td class="td-name"><div class="d-name">Ism al-Llāh</div><div class="d-ar">Allāh</div></td>
        <td class="td-bar">${progressBar(state.hadra.ismuLlah, state.hadraTargets.ismuLlah, '#0D9488')}</td>
        <td class="td-badge">${statusBadge(state.hadra.ismuLlah, state.hadraTargets.ismuLlah)}</td>
      </tr>
    </table>
  </div>

</div>

<!-- ── PAGE 2 ── -->
<div class="page-break"></div>
<div class="gold-stripe"></div>
<div class="page">

  <!-- CUMULATIVE TOTALS -->
  <div class="sec-title" style="margin-bottom:10px">
    <span class="sec-dot" style="background:var(--gold)"></span>Cumulative Dhikr Totals
  </div>
  <div class="card" style="margin-bottom:18px">
    <table class="cum-table">
      <tr><td class="cum-label">Total Istighfār recited</td>   <td class="cum-value" style="color:var(--green)">${(totalIstighfar + state.wird.istighfar + state.wazifa.istighfar).toLocaleString('en-US')}</td></tr>
      <tr><td class="cum-label">Total Ṣalawāt recited</td>     <td class="cum-value" style="color:var(--teal)">${(totalSalawat + state.wird.salatFatih + state.wazifa.salatFatih1).toLocaleString('en-US')}</td></tr>
      <tr><td class="cum-label">Total Tahlīl recited</td>       <td class="cum-value" style="color:var(--gold)">${(totalTahlil + state.wird.tahlil + state.wazifa.tahlil + state.hadra.tahlil).toLocaleString('en-US')}</td></tr>
      <tr><td class="cum-label">Total Ism al-Llāh recited</td>  <td class="cum-value" style="color:var(--violet)">${(totalIsmuLlah + state.hadra.ismuLlah).toLocaleString('en-US')}</td></tr>
      <tr><td class="cum-label">Total ${jawharaLabel} recited</td><td class="cum-value" style="color:var(--ruby)">${(totalWazifaSessions * jawharaTarget + state.wazifa.jawhara).toLocaleString('en-US')}</td></tr>
    </table>
  </div>

  <!-- SETTINGS -->
  <div class="sec-title" style="margin-bottom:12px">
    <span class="sec-dot" style="background:var(--slate-md)"></span>App Settings &amp; Configuration
  </div>
  <div class="settings-grid">
    <div class="settings-block">
      <div class="sb-title">Preferences</div>
      <div class="sb-row"><span class="sk">Language</span>      <span class="sv">${state.settings.language.toUpperCase()}</span></div>
      <div class="sb-row"><span class="sk">Dark Mode</span>     <span class="sv ${state.settings.darkMode ? 's-on' : 's-off'}">${state.settings.darkMode ? '● On' : '● Off'}</span></div>
      <div class="sb-row"><span class="sk">Audio</span>         <span class="sv ${state.settings.audioEnabled ? 's-on' : 's-off'}">${state.settings.audioEnabled ? '● On' : '● Off'}</span></div>
      <div class="sb-row"><span class="sk">Notifications</span> <span class="sv ${state.settings.notificationsEnabled ? 's-on' : 's-off'}">${state.settings.notificationsEnabled ? '● On' : '● Off'}</span></div>
      <div class="sb-row"><span class="sk">Font Size</span>     <span class="sv">${state.settings.fontSize}</span></div>
    </div>
    <div class="settings-block">
      <div class="sb-title">Formulas &amp; Frequency</div>
      <div class="sb-row"><span class="sk">Salawāt Formula</span>    <span class="sv">${state.wirdSettings.salawatFormula}</span></div>
      <div class="sb-row"><span class="sk">Wazīfa Formula</span>     <span class="sv">${state.wazifaSettings.useJawhara ? `Jawhara ×${state.wazifaSettings.jawharaCount}` : 'Ṣalāt al-Fātiḥ ×20'}</span></div>
      <div class="sb-row"><span class="sk">Wird / day</span>         <span class="sv" style="color:var(--ruby)">${frequencySettings.wirdPerDay}×</span></div>
      <div class="sb-row"><span class="sk">Wazīfa / day</span>       <span class="sv" style="color:var(--gold)">${frequencySettings.wazifaPerDay}×</span></div>
      <div class="sb-row"><span class="sk">Ḥaḍra / Friday</span>    <span class="sv" style="color:var(--violet)">${frequencySettings.hadraPerDay}×</span></div>
      <div class="sb-row"><span class="sk">Hadra Tahlīl Target</span><span class="sv">${state.hadraTargets.tahlil}</span></div>
      <div class="sb-row"><span class="sk">Hadra Ism Target</span>   <span class="sv">${state.hadraTargets.ismuLlah}</span></div>
    </div>
  </div>

  <!-- REMINDERS -->
  <div class="reminders">
    <div class="sb-title">Reminder Times</div>
    <div class="rem-grid">
      <div class="rem-item">
        <div class="rem-label">Morning Wird</div>
        <div class="rem-time" style="color:var(--green)">${state.settings.reminderTimes.morning}</div>
      </div>
      <div class="rem-item">
        <div class="rem-label">Evening Wird</div>
        <div class="rem-time" style="color:var(--teal)">${state.settings.reminderTimes.evening}</div>
      </div>
      <div class="rem-item">
        <div class="rem-label">Friday Wazīfa</div>
        <div class="rem-time" style="color:var(--gold)">${state.settings.reminderTimes.friday}</div>
      </div>
    </div>
  </div>

  <!-- CLOSING -->
  <div class="closing">
    <div class="cl-arabic">بِإِذْنِ مِنَ اللّٰهِ الْعَلِيّ</div>
    <div class="cl-title">Barakā wa Tawfīq</div>
    <div class="cl-text">
      May Allāh accept your Wird, your Wazīfa and your Ḥaḍra.<br/>
      May He grant you proximity, love and spiritual elevation.<br/>
      May He keep you steadfast on the Tijāni path.
    </div>
    <div class="cl-ver">WIRD &amp; WAZĪFA TIJĀNIYYA · V1.0</div>
  </div>

</div>

<!-- FOOTER -->
<div class="footer">
  <span>Wird &amp; Wazīfa Tijāniyya · v1.0</span>
  <span>May Allāh accept our efforts · Ameen</span>
  <span>Exported ${exportDate}</span>
</div>

</body>
</html>`;
};

// ── Public function ────────────────────────────────────────────────────────
export const exportReport = async (state: AppState): Promise<void> => {
  try {
    const html = buildHTML(state);
    const { uri } = await Print.printToFileAsync({ html, base64: false });

    const dateStr  = new Date().toISOString().split('T')[0];
    const destUri  = uri.replace(/[^/]+\.pdf$/i, `WirdWazifa_Report_${dateStr}.pdf`);
    const srcFile  = new File(uri);
    const destFile = new File(destUri);
    if (destFile.exists) await destFile.delete();
    await srcFile.move(destFile);

    const canShare = await Sharing.isAvailableAsync();
    if (canShare) {
      await Sharing.shareAsync(destUri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Share your Spiritual Report',
        UTI: 'com.adobe.pdf',
      });
    } else {
      Alert.alert('PDF Generated', `Your report has been saved to:\n${destUri}`, [{ text: 'OK' }]);
    }
  } catch (error) {
    console.error('[exportReport]', error);
    Alert.alert('Export Failed', 'Could not generate the PDF. Please try again.', [{ text: 'OK' }]);
  }
};