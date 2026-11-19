// Saved progress: trophy names ticked off, kept in localStorage, with JSON
// export to a file and import back from one. Nothing leaves the browser.
export const STORAGE_KEY = 'gta6-platinum-progress-v1';
export const SPOILER_KEY = 'gta6-platinum-spoilers-v1';

export function loadEarned() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const list = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(list) ? list.filter((n) => typeof n === 'string') : []);
  } catch {
    return new Set();
  }
}

export function saveEarned(earned) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...earned].sort()));
}

export function loadSpoilersHidden() {
  return localStorage.getItem(SPOILER_KEY) !== 'off';
}

export function saveSpoilersHidden(hidden) {
  localStorage.setItem(SPOILER_KEY, hidden ? 'on' : 'off');
}

export function exportProgress(earned) {
  const blob = new Blob([JSON.stringify({ game: 'Grand Theft Auto VI', earned: [...earned].sort() }, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'gta6-trophy-progress.json';
  a.click();
  URL.revokeObjectURL(url);
}

export async function readImportedProgress(file) {
  const data = JSON.parse(await file.text());
  const names = Array.isArray(data) ? data : data.earned;
  if (!Array.isArray(names)) throw new Error('not a progress file');
  return new Set(names.filter((n) => typeof n === 'string'));
}
