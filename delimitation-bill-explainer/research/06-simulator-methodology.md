# Simulator Methodology

## Seat Allocation Engine

### Method: Hamilton / Largest Remainder

The standard method used by India's Delimitation Commission.

**Steps:**
1. Split total seats into two pools: states and UTs, proportional to the bill's 815:35 ratio
2. Reserve 1 seat per entity (constitutional minimum)
3. Distribute remaining seats proportionally to population using the selected census
4. Assign floor values, then distribute remainders to entities with largest fractional parts

### Formula: Pure Population

```
share_i = population_i / total_population
seats_i = 1 + floor(share_i × distributable_pool) + remainder_bonus
```

Where `distributable_pool = total_pool - number_of_entities`

### Formula: Weighted (Population + Development)

```
dev_score_i = 1 - (growth_rate_i / max_growth_rate)
weighted_share_i = (1 - w) × pop_share_i + w × (dev_score_i / total_dev_score)
seats_i = 1 + floor(weighted_share_i × distributable_pool) + remainder_bonus
```

Where:
- `growth_rate_i = population_i / population_1971_i`
- `w` = development weight (default 0.3, adjustable 0.1–0.5)
- States with lower population growth since 1971 get a higher development score

### Gain/Loss Metric

```
gain_loss_i = new_seats_i - round(current_seats_i × total_new / 543)
```

Measures whether a state does better or worse than a proportional scale-up of its existing share. This is the psephologist's standard metric.

### Share Delta

```
share_delta_i = (new_seats_i / total_new) × 100 - (current_seats_i / 543) × 100
```

Measures the change in percentage share of Parliament. Used for map coloring.

## Map Coloring

The choropleth colors by **share delta** (percentage point change in share of Parliament):

| Share Delta | Color | Meaning |
|-------------|-------|---------|
| > +1.0% | Dark green (#1a6b3c) | Strong share gain |
| +0.3% to +1.0% | Medium green (#40916c) | Moderate share gain |
| +0.05% to +0.3% | Light green (#95d5b2) | Slight share gain |
| -0.05% to +0.05% | Neutral (#e0ddd5) | No meaningful change |
| -0.3% to -0.05% | Light salmon (#e8a598) | Slight share loss |
| -1.0% to -0.3% | Salmon (#e07a5f) | Moderate share loss |
| < -1.0% | Dark red (#9b2226) | Strong share loss |

## Validation

### Math Verification

At all tested seat counts (543, 600, 700, 816, 850), the total allocated seats exactly matches the target:

| Total Seats | States Pool | UTs Pool | Verified |
|-------------|-------------|----------|----------|
| 543 | 521 | 22 | ✅ 543 |
| 600 | 575 | 25 | ✅ 600 |
| 700 | 671 | 29 | ✅ 700 |
| 816 | 782 | 34 | ✅ 816 |
| 850 | 815 | 35 | ✅ 850 |

### Cross-Validation vs Psephologist Data

At 850 seats, 2011 census, pure population:

| State | Our Result | Psephologist | Difference |
|-------|------------|-------------|------------|
| Kerala | 23 | 23 | 0 |
| Andhra Pradesh | 34 | 34 | 0 |
| Rajasthan | 47 | 47 | 0 |
| Madhya Pradesh | 50 | 50 | 0 |
| Tamil Nadu | 49 | 50 | -1 |
| UP | 134 | 138 | -4 |
| Maharashtra | 76 | 78 | -2 |

UP discrepancy (4 seats) is due to our two-pool split (states vs UTs) vs their likely single-pool allocation. Both are defensible — the bill text specifies "815 from states, 35 from UTs."

## Map Data

- **Shapefile source:** [AnujTiwari/India-State-and-Country-Shapefile-Updated-Jan-2020](https://github.com/AnujTiwari/India-State-and-Country-Shapefile-Updated-Jan-2020)
- **Post-2019 boundaries:** Includes Ladakh, J&K as separate UTs, merged DNH+DD
- **Conversion:** mapshaper, 8% simplification, WGS84 projection → TopoJSON (631KB, 37 features)
- **Rendering:** D3.js v7 + topojson-client v3
