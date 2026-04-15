// ─── State & UT Data ───────────────────────────────────────────
// Sources: Census of India 1971 & 2011, Election Commission of India,
// National Commission on Population Projections (2020 report)
const STATES = [
  { id:"AP", state:"Andhra Pradesh", pop1971:27800586, pop2011:49386799, pop2024:53900000, seats:25, region:"South" },
  { id:"TG", state:"Telangana", pop1971:15602122, pop2011:35193978, pop2024:39400000, seats:17, region:"South" },
  { id:"AR", state:"Arunachal Pradesh", pop1971:467511, pop2011:1383727, pop2024:1711000, seats:2, region:"Northeast" },
  { id:"AS", state:"Assam", pop1971:14625152, pop2011:31205576, pop2024:35607000, seats:14, region:"Northeast" },
  { id:"BR", state:"Bihar", pop1971:42126236, pop2011:104099452, pop2024:128500000, seats:40, region:"North" },
  { id:"CT", state:"Chhattisgarh", pop1971:11637494, pop2011:25545198, pop2024:29700000, seats:11, region:"East" },
  { id:"GA", state:"Goa", pop1971:795120, pop2011:1458545, pop2024:1600000, seats:2, region:"West" },
  { id:"GJ", state:"Gujarat", pop1971:26697475, pop2011:60439692, pop2024:71500000, seats:26, region:"West" },
  { id:"HR", state:"Haryana", pop1971:10036808, pop2011:25351462, pop2024:30000000, seats:10, region:"North" },
  { id:"HP", state:"Himachal Pradesh", pop1971:3460434, pop2011:6864602, pop2024:7500000, seats:4, region:"North" },
  { id:"JH", state:"Jharkhand", pop1971:14227133, pop2011:32988134, pop2024:39100000, seats:14, region:"East" },
  { id:"KA", state:"Karnataka", pop1971:29299014, pop2011:61095297, pop2024:68900000, seats:28, region:"South" },
  { id:"KL", state:"Kerala", pop1971:21347375, pop2011:33406061, pop2024:35600000, seats:20, region:"South" },
  { id:"MP", state:"Madhya Pradesh", pop1971:30016625, pop2011:72626809, pop2024:85400000, seats:29, region:"North" },
  { id:"MH", state:"Maharashtra", pop1971:50412235, pop2011:112374333, pop2024:126900000, seats:48, region:"West" },
  { id:"MN", state:"Manipur", pop1971:1072753, pop2011:2855794, pop2024:3300000, seats:2, region:"Northeast" },
  { id:"ML", state:"Meghalaya", pop1971:1011699, pop2011:2966889, pop2024:3650000, seats:2, region:"Northeast" },
  { id:"MZ", state:"Mizoram", pop1971:332390, pop2011:1097206, pop2024:1280000, seats:1, region:"Northeast" },
  { id:"NL", state:"Nagaland", pop1971:516449, pop2011:1978502, pop2024:2150000, seats:1, region:"Northeast" },
  { id:"OD", state:"Odisha", pop1971:21944615, pop2011:41974218, pop2024:47100000, seats:21, region:"East" },
  { id:"PB", state:"Punjab", pop1971:13551060, pop2011:27743338, pop2024:30600000, seats:13, region:"North" },
  { id:"RJ", state:"Rajasthan", pop1971:25765806, pop2011:68548437, pop2024:81000000, seats:25, region:"North" },
  { id:"SK", state:"Sikkim", pop1971:209843, pop2011:610577, pop2024:690000, seats:1, region:"Northeast" },
  { id:"TN", state:"Tamil Nadu", pop1971:41199168, pop2011:72147030, pop2024:77800000, seats:39, region:"South" },
  { id:"TR", state:"Tripura", pop1971:1556342, pop2011:3673917, pop2024:4100000, seats:2, region:"Northeast" },
  { id:"UP", state:"Uttar Pradesh", pop1971:83849905, pop2011:199812341, pop2024:235000000, seats:80, region:"North" },
  { id:"UT", state:"Uttarakhand", pop1971:4493555, pop2011:10086292, pop2024:11700000, seats:5, region:"North" },
  { id:"WB", state:"West Bengal", pop1971:44312011, pop2011:91276115, pop2024:100400000, seats:42, region:"East" },
  { id:"AN", state:"Andaman & Nicobar", pop1971:115133, pop2011:380581, pop2024:420000, seats:1, region:"UT" },
  { id:"CH", state:"Chandigarh", pop1971:257251, pop2011:1055450, pop2024:1200000, seats:1, region:"UT" },
  { id:"DN", state:"Dadra & Nagar Haveli and Daman & Diu", pop1971:170677, pop2011:586956, pop2024:750000, seats:2, region:"UT" },
  { id:"DL", state:"Delhi", pop1971:4065698, pop2011:16787941, pop2024:20600000, seats:7, region:"UT" },
  { id:"JK", state:"Jammu & Kashmir", pop1971:4616632, pop2011:12267032, pop2024:14200000, seats:5, region:"UT" },
  { id:"LA", state:"Ladakh", pop1971:89474, pop2011:274289, pop2024:320000, seats:1, region:"UT" },
  { id:"LD", state:"Lakshadweep", pop1971:31810, pop2011:64473, pop2024:68000, seats:1, region:"UT" },
  { id:"PY", state:"Puducherry", pop1971:471707, pop2011:1247953, pop2024:1400000, seats:1, region:"UT" }
];

// ─── Region Colors ─────────────────────────────────────────────
const REGION_COLORS = {
  North: "#c0392b",
  South: "#2980b9",
  East: "#27ae60",
  West: "#e67e22",
  Northeast: "#8e44ad",
  UT: "#7f8c8d"
};

// ─── Bill Clauses ──────────────────────────────────────────────
const CLAUSES = [
  {
    clause: 2, article: "55",
    title: "Presidential Election Vote Weighting",
    before: '"population" means the population as ascertained at the last preceding census\u2026 construed as a reference to the 1971 census.',
    after: '"population" means the population as ascertained at such census, as Parliament may by law determine under article 82 or article 170.',
    risk: "Parliament picks which census determines presidential election vote weights. No constitutional anchor.",
    pdf: { img: "pdf-highlights/clause2_art55.png", page: 2, label: "Bill page 2 \u2014 Clause 2" }
  },
  {
    clause: 3, article: "81",
    title: "Lok Sabha Composition",
    before: "Not more than 530 members from States + 20 from Union Territories.",
    after: "Not more than 815 members from States + 35 from Union Territories. (Total: up to 850)",
    risk: "The cap is 850, but the actual number is left to a future Delimitation Commission. Could be 600, 700, or 816.",
    pdf: { img: "pdf-highlights/clause3_art81.png", page: 2, label: "Bill page 2 \u2014 Clause 3" }
  },
  {
    clause: 4, article: "82",
    title: "Delimitation Trigger",
    before: '"Upon the completion of each census, the allocation of seats\u2026 shall be readjusted." Third proviso freezes this until post-2026 census.',
    after: '"The allocation of seats\u2026 shall be readjusted\u2026 on the basis of such census, by the Delimitation Commission." Third proviso DELETED.',
    risk: "Removes the automatic census trigger AND the 2026 freeze. Parliament decides which census to use via ordinary law.",
    pdf: { img: "pdf-highlights/clause4_art82.png", page: 2, label: "Bill page 2 \u2014 Clause 4" }
  },
  {
    clause: 5, article: "170",
    title: "State Assembly Composition",
    before: "Same freeze as Art. 82: total assembly seats locked to 1971 census until post-2026.",
    after: "Same change: freeze deleted, census choice delegated to Parliament by ordinary law.",
    risk: "State assemblies also get redrawn. Same power shift applies at the state level.",
    pdf: { img: "pdf-highlights/clause5_art170.png", page: 2, label: "Bill page 2 \u2014 Clause 5" }
  },
  {
    clause: 6, article: "330",
    title: "SC/ST Reservation in Lok Sabha",
    before: '"population" for SC/ST seats = 2001 census, frozen until post-2026.',
    after: '"population" = such census as Parliament may by law determine.',
    risk: "SC/ST reserved seat allocation also becomes a parliamentary discretion matter.",
    pdf: { img: "pdf-highlights/clause6_art330.png", page: "2-3", label: "Bill pages 2\u20133 \u2014 Clause 6 (spans two pages)" }
  },
  {
    clause: 8, article: "334A",
    title: "Women\u2019s Reservation Activation",
    before: "Reservation kicks in after delimitation based on first census AFTER the 106th Amendment (2023). Expires 15 years from 2023.",
    after: "Reservation kicks in after ANY delimitation exercise. Expires 15 years from 2023 unless Parliament extends by law.",
    risk: "The original 106th Amendment required a new census. This bill removes that requirement\u2014enabling immediate delimitation using old data.",
    pdf: { img: "pdf-highlights/clause8_art334a.png", page: 3, label: "Bill page 3 \u2014 Clause 8" }
  }
];

// ─── Timeline Events ───────────────────────────────────────────
const TIMELINE = [
  { year: 1952, title: "1st Delimitation Commission", desc: "489 Lok Sabha seats drawn using 1951 census.", type: "neutral" },
  { year: 1963, title: "2nd Delimitation Commission", desc: "Seats increased to 522 using 1961 census.", type: "neutral" },
  { year: 1971, title: "Census & 3rd Delimitation", desc: "Lok Sabha reaches 543 seats. This is the last census used for seat allocation.", type: "major" },
  { year: 1976, title: "42nd Amendment (Emergency)", desc: "Indira Gandhi freezes seat allocation at 1971 levels until the first census after 2000. Rationale: states doing family planning shouldn\u2019t lose seats.", type: "major" },
  { year: 2001, title: "84th Amendment", desc: "Freeze extended to first census AFTER 2026. Southern states successfully argued the population penalty still exists.", type: "major" },
  { year: 2003, title: "87th Amendment", desc: "Partial unlock: internal constituency boundaries redrawn using 2001 census. Total seats per state unchanged.", type: "neutral" },
  { year: 2008, title: "4th Delimitation Commission", desc: "Redrew boundaries within states. Did NOT change inter-state seat allocation. Chaired by Justice Kuldip Singh.", type: "neutral" },
  { year: 2020, title: "COVID delays census", desc: "The 2021 decennial census is postponed due to COVID-19. It finally begins on April 1, 2026, but results are not expected until 2027 at the earliest. India has no published population data newer than the 2011 census.", type: "warning" },
  { year: 2023, title: "106th Amendment (Nari Shakti)", desc: "Women\u2019s 33% reservation passed\u2014but tied to next delimitation after a new census. A constitutional Catch-22.", type: "major" },
  { year: 2026, title: "131st Amendment Bill", desc: "Bill circulated to MPs on April 11. Scheduled for introduction in Lok Sabha on April 16 during a special session. Raises Lok Sabha cap to 850, deletes the freeze, lets Parliament pick which census to use.", type: "danger" }
];

// ─── Allocation Engine ─────────────────────────────────────────
function allocateSeats(totalSeats, popKey, formula, devWeight) {
  const w = devWeight || 0.3;

  // Proportionate formula: scale each state's current seats by the same ratio
  if (formula === 'proportionate') {
    const currentTotal = STATES.reduce((s, d) => s + d.seats, 0);
    const ratio = totalSeats / currentTotal;
    // Use largest remainder on scaled values
    let raw = STATES.map(d => {
      const exact = d.seats * ratio;
      return { ...d, rawSeats: exact, floor: Math.max(1, Math.floor(exact)) };
    });
    let assigned = raw.reduce((s, d) => s + d.floor, 0);
    let remainder = raw.map((d, i) => ({ i, r: d.rawSeats - d.floor })).sort((a, b) => b.r - a.r);
    let left = totalSeats - assigned;
    for (let k = 0; k < left && k < remainder.length; k++) {
      raw[remainder[k].i].floor++;
    }
    return raw.map(d => ({ ...d, newSeats: d.floor }));
  }

  const states = STATES.filter(s => s.region !== "UT");
  const uts = STATES.filter(s => s.region === "UT");

  // Split seats between states and UTs proportionally to bill's 815:35
  const stateSeats = Math.round(totalSeats * (815 / 850));
  const utSeats = totalSeats - stateSeats;

  function distribute(list, pool) {
    const n = list.length;
    // Reserve 1 seat per entity, distribute the rest
    const distributable = pool - n;
    if (distributable <= 0) {
      return list.map(d => ({ ...d, newSeats: 1 }));
    }
    const totalPop = list.reduce((s, d) => s + d[popKey], 0);

    // Compute shares
    let growthRates, maxGrowth, totalDevScore;
    if (formula === "weighted") {
      growthRates = list.map(d => d[popKey] / (d.pop1971 || 1));
      maxGrowth = Math.max(...growthRates);
      totalDevScore = growthRates.reduce((s, gr) => s + (1 - gr / maxGrowth), 0);
    }

    let raw = list.map((d, i) => {
      let share;
      if (formula === "weighted" && totalDevScore > 0) {
        const popShare = d[popKey] / totalPop;
        const devScore = (1 - growthRates[i] / maxGrowth) / totalDevScore;
        share = (1 - w) * popShare + w * devScore;
      } else {
        share = d[popKey] / totalPop;
      }
      const rawSeats = share * distributable;
      return { ...d, rawSeats, floor: Math.floor(rawSeats) };
    });

    // Hamilton largest-remainder
    let assigned = raw.reduce((s, d) => s + d.floor, 0);
    let remainder = raw.map((d, i) => ({ i, r: d.rawSeats - d.floor }))
      .sort((a, b) => b.r - a.r);
    let left = distributable - assigned;
    for (let k = 0; k < left && k < remainder.length; k++) {
      raw[remainder[k].i].floor++;
    }

    // Add back the 1 reserved seat
    return raw.map(d => ({ ...d, newSeats: d.floor + 1 }));
  }

  const stateResults = distribute(states, stateSeats);
  const utResults = distribute(uts, utSeats);
  return [...stateResults, ...utResults];
}

// ─── Exports for modules ───────────────────────────────────────
window.DATA = { STATES, REGION_COLORS, CLAUSES, TIMELINE, allocateSeats };
