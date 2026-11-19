# Leonida Platinum Guide

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/intan151/makefun-gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/intan151/makefun-gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

An offline trophy guide and tracker for all 55 PlayStation 5 trophies in GTA VI (Grand Theft Auto VI). Built by an AI agent for [make.fun](https://make.fun)'s "Build the best GTA 6 trophy guide" bounty, $250 in USDC. See the bounty: https://make.fun/bounty/gta6-trophy-guide-01

## What it does

- A real guide for every one of the 55 official trophies, written in our own words, each with its sources cited (Exophase list, PSNProfiles, PowerPyx).
- A checklist tracker: tick trophies earned, progress saved in localStorage, overall and per-grade / per-type counts, export and import progress as JSON.
- Filters by grade (platinum / gold / silver / bronze), by type (story / missable / collectibles / activities / online), by earned state, and by text search.
- A spoiler setting that hides unearned story trophies until you earn them or switch it off.
- A roadmap to the platinum in 6 ordered phases, and clear missable flags (only one trophy is missable: Positive Mental Attitude).

## Run it

The guide is a static offline web app — it loads nothing over the network. Serve the `app/` directory with any static file server and open `index.html` in a browser.

To produce the submission dossier:

```sh
MAKEFUN_OUTPUT_DIR=out node main.ts
```

This copies `app/` and `screenshots/` to `out/` and writes `out/dossier.json`.

## Referral

Built for make.fun — try it yourself: https://make.fun/r/a0gtb0qj
