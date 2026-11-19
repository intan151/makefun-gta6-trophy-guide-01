// The roadmap to the platinum: six ordered phases, each naming the trophies
// it covers and why they belong together. Phase order follows the official
// descriptions — story first, then character strands, activities, collectibles,
// robberies and money, and finally the one-off moments and 100% cleanup.
export const PHASES = [
  {
    id: 1,
    title: 'Phase 1 — Story: Chapters 1–4 and the finale',
    meta: '12 trophies · just play the story in order',
    text: 'Every chapter and named-mission trophy pops automatically as you finish it. Nothing here is missable: finish the mission and the trophy is yours. One warning only — meditate at Jason’s house before Chapter 1 ends (see Missables).',
    ids: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
  },
  {
    id: 2,
    title: 'Phase 2 — Character finales and strangers',
    meta: '6 trophies · side-character strands',
    text: 'Finish each named character’s strand to its final mission — Andy, Kenton, Billy, Randy and Tyrone — and complete 8 stranger mission strands across Leonida. These unlock alongside the story and in free-roam afterwards.',
    ids: [22, 23, 24, 25, 26, 27],
  },
  {
    id: 3,
    title: 'Phase 3 — Activities, skills and challenges',
    meta: '11 trophies · the long grind starts here',
    text: 'Shooting Range golds (42 challenges), 250 stunts, drone races at all 14 Top Fun spots, 20 different race wins, fishing against Cal, one arcade game, meditation at all 18 spots, Bret’s unique-animal hunt and 50 of the 80 challenges. Start the stunts and challenges early — they fill in while you play.',
    ids: [15, 16, 17, 18, 19, 20, 21, 28, 29, 32, 36],
  },
  {
    id: 4,
    title: 'Phase 4 — Collectibles and exploring Leonida',
    meta: '5 trophies · map completion',
    text: 'Complete 3 collectible card sets, WAiNK It at 100 locations, discover 100 vehicles, explore all 52 areas of Leonida and rob an illegal operation for each of the 9 gangs. Sweep the map region by region so nothing is left for a second pass.',
    ids: [30, 31, 35, 42, 43],
  },
  {
    id: 5,
    title: 'Phase 5 — Robberies, money and property',
    meta: '9 trophies · partner crime and cash',
    text: 'Bank vaults (5), the armored truck, the jewelry store — done quietly — plus the partner robberies: lose a 4-star wanted level together and rob 3 shops back-to-back. Then the money loop: launder $250,000 in marked bills, spend $100,000 across shops, buy all 8 garages and register 10 vehicles in the Scooter Bros app.',
    ids: [33, 34, 39, 40, 41, 52, 53, 54, 55],
  },
  {
    id: 6,
    title: 'Phase 6 — One-off moments and 100% cleanup',
    meta: '11 trophies · then the gold and the platinum',
    text: 'The odd one-offs — the VCIA departure, the Rhinos, the Ocean Beach cocktail, the showroom smash, bowling at Kolt & Associates, the partnership moment, the choice counter, the second-try moment, the strange sighting and the melee drive-by — then finish the 100% Completion checklist for the gold A Long Road. The platinum, Vice Got a Price!, pops with the last trophy you earn.',
    ids: [37, 38, 44, 45, 46, 47, 48, 49, 50, 51, 14],
  },
];

export function trophiesForPhase(trophies, phase) {
  const byId = new Map(trophies.map((t) => [t.id, t]));
  return phase.ids.map((id) => byId.get(id)).filter(Boolean);
}
