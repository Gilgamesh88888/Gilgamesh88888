#!/usr/bin/env node
/**
 * build.mjs — regenerate assets/stats.svg from REAL GitHub data.
 * No fake numbers: if a metric fails to fetch, it stays as "—".
 *
 * Inputs (env):
 *   GITHUB_TOKEN — provided automatically by GitHub Actions.
 *   USERNAME     — default: repository owner.
 */
import { writeFileSync } from "node:fs";

const USER = process.env.USERNAME || process.env.GITHUB_REPOSITORY?.split("/")[0];
const TOKEN = process.env.GITHUB_TOKEN;
const FILE = "assets/stats.svg";
const dash = "—";

const ghHeaders = {
  Accept: "application/vnd.github+json",
  "User-Agent": "profile-stats-builder",
  ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
};

async function j(url, opt = {}) {
  const res = await fetch(url, { ...opt, headers: { ...ghHeaders, ...(opt.headers || {}) } });
  if (!res.ok) throw new Error(`${url} -> ${res.status}`);
  return res.json();
}

let repos = null, user = null, commits = dash;
try {
  user = await j(`https://api.github.com/users/${USER}`);
  repos = [];
  for (let page = 1; page <= 10; page++) {
    const chunk = await j(`https://api.github.com/users/${USER}/repos?per_page=100&page=${page}`);
    repos.push(...chunk);
    if (chunk.length < 100) break;
  }
} catch (e) {
  console.error("REST fetch failed:", e.message);
}

// Contributions in the last year via GraphQL (public data).
if (TOKEN && USER) {
  try {
    const q = `query { user(login: "${USER}") { contributionsCollection { contributionCalendar { totalContributions } } } }`;
    const r = await j("https://api.github.com/graphql", {
      method: "POST",
      body: JSON.stringify({ query: q }),
      headers: { "Content-Type": "application/json" },
    });
    commits = r?.data?.user?.contributionsCollection?.contributionCalendar?.totalContributions ?? dash;
  } catch (e) {
    console.error("GraphQL fetch failed:", e.message);
  }
}

const stars = repos ? repos.reduce((s, r) => s + (r.stargazers_count || 0), 0) : dash;
const pub = user ? user.public_repos : dash;
const followers = user ? user.followers : dash;

const cell = (x, label, value) => `
    <text x="${x}" y="88" font-size="12" fill="#64748B" letter-spacing="2">${label}</text>
    <text x="${x}" y="124" font-size="26" fill="#E2E8F0">${value}</text>`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="190" viewBox="0 0 900 190">
  <defs>
    <linearGradient id="statg" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#0B1220"/><stop offset="1" stop-color="#101C3A"/>
    </linearGradient>
  </defs>
  <rect width="900" height="190" rx="14" fill="url(#statg)" stroke="#1E3A8A" stroke-width="1.5"/>
  <rect width="900" height="40" rx="14" fill="#0F172A"/><rect y="26" width="900" height="14" fill="#0F172A"/>
  <circle cx="26" cy="20" r="5" fill="#EF4444"/><circle cx="46" cy="20" r="5" fill="#F59E0B"/><circle cx="66" cy="20" r="5" fill="#22C55E"/>
  <text x="90" y="24" font-family="ui-monospace, Menlo, Consolas, monospace" font-size="11" fill="#64748B" letter-spacing="2">watch -n 86400 ./stats</text>
  <g font-family="ui-monospace, Menlo, Consolas, monospace" text-anchor="middle">${cell(130, "COMMITS / YR", commits)}${cell(340, "PUBLIC REPOS", pub)}${cell(550, "STARS", stars)}${cell(760, "FOLLOWERS", followers)}
  </g>
  <text x="450" y="164" text-anchor="middle" font-family="ui-monospace, Menlo, Consolas, monospace" font-size="11" fill="#4ADE80">&#10003; live data &#183; refresh harian oleh .github/workflows/terminal.yml</text>
</svg>
`;

writeFileSync(FILE, svg);
console.log(`OK -> ${FILE} (commits=${commits}, repos=${pub}, stars=${stars}, followers=${followers})`);
