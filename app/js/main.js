// Boot and render: loads app/data/trophies.json, draws the checklist, the
// roadmap and the missables views, and wires the filters, the spoiler setting
// and progress export/import. Everything runs from local files; no network.
import { loadEarned, saveEarned, loadSpoilersHidden, saveSpoilersHidden, exportProgress, readImportedProgress } from './store.js';
import { applyFilters, isSpoilerHidden, countByGrade, countByType } from './filters.js';
import { PHASES, trophiesForPhase } from './roadmap.js';

const doc = await (await fetch('data/trophies.json')).json();
const trophies = doc.trophies;
const byId = new Map(trophies.map((t) => [t.id, t]));
let earned = loadEarned();
let spoilersHidden = loadSpoilersHidden();
let openGuide = null;

const $ = (id) => document.getElementById(id);
const listEl = $('trophyList');
const gradeMedal = { platinum: 'P', gold: 'G', silver: 'S', bronze: 'B' };

function gradeLabel(grade) {
  return grade[0].toUpperCase() + grade.slice(1);
}

function saveAndRender() {
  saveEarned(earned);
  renderProgress();
  renderChecklist();
  renderRoadmap();
  renderMissables();
}

function renderProgress() {
  const total = trophies.length;
  const pct = Math.round((earned.size / total) * 100);
  $('earnedCount').textContent = earned.size;
  $('earnedPct').textContent = `${pct}%`;
  $('barFill').style.width = `${pct}%`;
  const byGrade = countByGrade(trophies, earned);
  $('gradeCounts').textContent = ['platinum', 'gold', 'silver', 'bronze']
    .map((g) => `${gradeLabel(g)} ${byGrade[g][0]}/${byGrade[g][1]}`).join(' · ');
  const byType = countByType(trophies, earned);
  $('typeCounts').textContent = ['story', 'collectibles', 'activities', 'platinum']
    .filter((t) => byType[t])
    .map((t) => `${t[0].toUpperCase() + t.slice(1)} ${byType[t][0]}/${byType[t][1]}`).join(' · ')
    + ' · Online 0/0 · Missable ' + trophies.filter((t) => t.missable && earned.has(t.name)).length + '/' + trophies.filter((t) => t.missable).length;
  $('missableCount').textContent = trophies.filter((t) => t.missable).length;
}

function trophyCard(t, { compact = false } = {}) {
  const li = document.createElement('li');
  li.className = 'trophy' + (earned.has(t.name) ? ' earned' : '');
  const hidden = isSpoilerHidden(t, earned, spoilersHidden);
  if (hidden) li.classList.add('spoiler-hidden');
  const row = document.createElement('div');
  row.className = 'trophy-row';

  const box = document.createElement('input');
  box.type = 'checkbox';
  box.checked = earned.has(t.name);
  box.setAttribute('aria-label', `Mark ${hidden ? 'hidden story trophy' : t.name} as earned`);
  box.addEventListener('change', () => {
    if (box.checked) earned.add(t.name);
    else earned.delete(t.name);
    saveAndRender();
  });

  const medal = document.createElement('span');
  medal.className = `medal ${t.grade}`;
  medal.textContent = gradeMedal[t.grade];
  medal.title = gradeLabel(t.grade);

  const main = document.createElement('div');
  main.className = 'trophy-main';
  const name = document.createElement('div');
  name.className = 'trophy-name';
  name.textContent = hidden ? '??? — Hidden story trophy' : t.name;
  const desc = document.createElement('div');
  desc.className = 'trophy-desc';
  desc.textContent = hidden ? 'Earn this trophy (or switch spoilers off) to reveal its name and description.' : t.description;
  main.append(name, desc);

  const tags = document.createElement('div');
  tags.className = 'tags';
  const gradeTag = document.createElement('span');
  gradeTag.className = `tag grade-${t.grade}`;
  gradeTag.textContent = gradeLabel(t.grade);
  tags.append(gradeTag);
  const typeTag = document.createElement('span');
  typeTag.className = 'tag';
  typeTag.textContent = t.type;
  tags.append(typeTag);
  if (t.missable) {
    const m = document.createElement('span');
    m.className = 'tag missable';
    m.textContent = '⚠ Missable';
    tags.append(m);
  }
  if (t.count) {
    const c = document.createElement('span');
    c.className = 'tag count';
    c.textContent = `Target: ${t.countLabel || t.count}`;
    tags.append(c);
  }
  if (t.hidden) {
    const h = document.createElement('span');
    h.className = 'tag';
    h.textContent = 'Hidden on PSN';
    tags.append(h);
  }
  main.append(tags);

  if (!compact && !hidden) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'guide-btn';
    btn.textContent = openGuide === t.id ? 'Hide guide' : 'Guide';
    btn.addEventListener('click', () => {
      openGuide = openGuide === t.id ? null : t.id;
      renderChecklist();
      if (openGuide === t.id) {
        const open = listEl.querySelector(`[data-trophy="${t.id}"] .guide`);
        if (open) open.scrollIntoView({ block: 'nearest' });
      }
    });
    row.append(box, medal, main, btn);
  } else {
    row.append(box, medal, main);
  }
  li.append(row);
  li.dataset.trophy = String(t.id);

  if (!compact && !hidden && openGuide === t.id) {
    const guide = document.createElement('div');
    guide.className = 'guide';
    const p = document.createElement('p');
    p.textContent = t.guide;
    guide.append(p);
    if (t.missableNote) {
      const note = document.createElement('p');
      note.innerHTML = '<strong>Missable:</strong> ';
      note.append(document.createTextNode(t.missableNote));
      guide.append(note);
    }
    const sources = document.createElement('p');
    sources.className = 'sources';
    sources.textContent = 'Sources: ';
    (t.sources || []).forEach((s, i) => {
      if (i > 0) sources.append(document.createTextNode(' · '));
      const a = document.createElement('a');
      a.href = s.url;
      a.target = '_blank';
      a.rel = 'noopener';
      a.textContent = s.name;
      sources.append(a);
    });
    guide.append(sources);
    li.append(guide);
  }
  return li;
}

function currentFilters() {
  return {
    search: $('search').value,
    grade: $('gradeFilter').value,
    type: $('typeFilter').value,
    status: $('statusFilter').value,
  };
}

function renderChecklist() {
  $('spoilerHint').textContent = spoilersHidden
    ? 'Spoilers on: story trophies you have not earned show as “Hidden story trophy” until you tick them or switch spoilers off. The platinum, gold and silver counts above still count them.'
    : 'Spoilers off: every story trophy name and description is shown. Tick “Hide story spoilers” to hide the ones you have not earned yet.';
  const shown = applyFilters(trophies, currentFilters(), earned);
  listEl.replaceChildren(...shown.map((t) => trophyCard(t)));
  $('emptyState').hidden = shown.length > 0;
  $('resultLine').textContent = `Showing ${shown.length} of ${trophies.length} trophies · ${earned.size} earned`;
}

function renderRoadmap() {
  const phaseList = $('phaseList');
  phaseList.replaceChildren();
  for (const phase of PHASES) {
    const items = trophiesForPhase(trophies, phase);
    const done = items.filter((t) => earned.has(t.name)).length;
    const li = document.createElement('li');
    li.className = 'phase';
    const h3 = document.createElement('h3');
    h3.textContent = phase.title;
    const meta = document.createElement('p');
    meta.className = 'phase-meta';
    meta.textContent = `${phase.meta} — ${done}/${items.length} earned in this phase`;
    const text = document.createElement('p');
    text.textContent = phase.text;
    const ul = document.createElement('ul');
    for (const t of items) {
      const item = document.createElement('li');
      if (earned.has(t.name)) item.className = 'done';
      item.textContent = `${earned.has(t.name) ? '✓ ' : ''}${isSpoilerHidden(t, earned, spoilersHidden) ? '??? — Hidden story trophy' : t.name} (${gradeLabel(t.grade)})${t.missable ? ' — ⚠ Missable' : ''}`;
      ul.append(item);
    }
    li.append(h3, meta, text, ul);
    phaseList.append(li);
  }
  const plat = document.createElement('li');
  plat.className = 'phase';
  const h3 = document.createElement('h3');
  h3.textContent = 'Platinum — Vice Got a Price!';
  const p = document.createElement('p');
  p.textContent = 'Earn the other 54 trophies. The platinum pops automatically with the last one — there is no separate task. Finish Phase 6 and it is yours.';
  plat.append(h3, p);
  phaseList.append(plat);
}

function renderMissables() {
  const missable = trophies.filter((t) => t.missable);
  const box = $('missableList');
  box.replaceChildren();
  for (const t of missable) {
    const card = document.createElement('div');
    card.className = 'missable-card';
    const h3 = document.createElement('h3');
    h3.textContent = `⚠ Missable — ${t.name} (${gradeLabel(t.grade)})`;
    const desc = document.createElement('p');
    desc.textContent = t.description;
    const guide = document.createElement('p');
    guide.textContent = t.guide;
    const note = document.createElement('p');
    note.innerHTML = '<strong>Why it can be missed:</strong> ';
    note.append(document.createTextNode(t.missableNote || ''));
    const sources = document.createElement('p');
    sources.className = 'sources';
    sources.textContent = 'Sources: ';
    (t.sources || []).forEach((s, i) => {
      if (i > 0) sources.append(document.createTextNode(' · '));
      const a = document.createElement('a');
      a.href = s.url;
      a.target = '_blank';
      a.rel = 'noopener';
      a.textContent = s.name;
      sources.append(a);
    });
    card.append(h3, desc, guide, note, sources);
    box.append(card);
  }
  const story = trophies.filter((t) => t.type === 'story');
  $('storyList').replaceChildren(...story.map((t) => trophyCard(t, { compact: true })));
}

function showTab(tab) {
  for (const name of ['checklist', 'roadmap', 'missables']) {
    $(`view-${name}`).hidden = name !== tab;
    $(`tab-${name}`).classList.toggle('active', name === tab);
  }
}

for (const tab of document.querySelectorAll('.tab')) {
  tab.addEventListener('click', () => showTab(tab.dataset.tab));
}
$('missableLink').addEventListener('click', (e) => {
  e.preventDefault();
  showTab('missables');
});
for (const id of ['search', 'gradeFilter', 'typeFilter', 'statusFilter']) {
  $(id).addEventListener('input', renderChecklist);
  $(id).addEventListener('change', renderChecklist);
}
$('spoilerToggle').checked = spoilersHidden;
$('spoilerToggle').addEventListener('change', () => {
  spoilersHidden = $('spoilerToggle').checked;
  saveSpoilersHidden(spoilersHidden);
  renderChecklist();
  renderRoadmap();
  renderMissables();
});
$('exportBtn').addEventListener('click', () => exportProgress(earned));
$('importFile').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const imported = await readImportedProgress(file);
    earned = new Set([...imported].filter((n) => trophies.some((t) => t.name === n)));
    saveAndRender();
  } catch {
    alert('That file is not a trophy-progress export from this guide.');
  }
  e.target.value = '';
});

renderProgress();
renderChecklist();
renderRoadmap();
renderMissables();
