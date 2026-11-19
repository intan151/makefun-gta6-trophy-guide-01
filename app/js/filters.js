// Filtering and the spoiler rule: which trophies a view shows, and which
// story trophies stay hidden until earned or until spoilers are switched off.
export function isStoryTrophy(trophy) {
  return trophy.type === 'story';
}

export function isSpoilerHidden(trophy, earned, spoilersHidden) {
  return spoilersHidden && isStoryTrophy(trophy) && !earned.has(trophy.name);
}

export function applyFilters(trophies, filters, earned) {
  const query = filters.search.trim().toLowerCase();
  return trophies.filter((t) => {
    if (filters.grade !== 'all' && t.grade !== filters.grade) return false;
    if (filters.type === 'missable' && !t.missable) return false;
    if (filters.type === 'online') return false; // this list has no online trophies
    if (filters.type !== 'all' && filters.type !== 'missable' && t.type !== filters.type) return false;
    if (filters.status === 'earned' && !earned.has(t.name)) return false;
    if (filters.status === 'unearned' && earned.has(t.name)) return false;
    if (query) {
      const haystack = [t.name, t.description, t.guide, t.type, t.grade, t.mission || ''].join(' ').toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    return true;
  });
}

export function countByGrade(trophies, earned) {
  const out = { platinum: [0, 0], gold: [0, 0], silver: [0, 0], bronze: [0, 0] };
  for (const t of trophies) {
    out[t.grade][1] += 1;
    if (earned.has(t.name)) out[t.grade][0] += 1;
  }
  return out;
}

export function countByType(trophies, earned) {
  const out = {};
  for (const t of trophies) {
    out[t.type] = out[t.type] || [0, 0];
    out[t.type][1] += 1;
    if (earned.has(t.name)) out[t.type][0] += 1;
  }
  return out;
}
