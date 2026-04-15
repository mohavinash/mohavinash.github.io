# State-wise Population Data and Current Seat Allocation

## Data Sources

- **1971 Census:** Census of India, 1971 — state-wise population tables
- **2011 Census:** Census of India, 2011 — state-wise population (official: 1,210,854,977 total)
- **2024 Projections:** National Commission on Population, Technical Group on Population Projections, July 2020 report
- **Current Lok Sabha seats:** Election Commission of India
- **TFR data:** National Family Health Survey (NFHS-5), 2019–21

## Data Caveats

1. **Bifurcated states (1971 data):** Bihar/Jharkhand, MP/Chhattisgarh, UP/Uttarakhand, and AP/Telangana did not exist as separate entities in 1971. 1971 figures are split using district-level census proportions.
2. **J&K and Ladakh:** Bifurcated in 2019. 1971 undivided J&K population (~4,706,106) split ~98%/2% based on Leh+Kargil district shares. 6 total seats (5 J&K + 1 Ladakh).
3. **Dadra & Nagar Haveli and Daman & Diu:** Merged in 2020. 1971 figures combined. 2 seats retained.
4. **2024 projections** rely on the Technical Group report (2020) since the 2021 Census was never conducted due to COVID-19. Census finally began April 1, 2026; results expected 2027 at earliest.

## Total Fertility Rates (NFHS-5, 2019–21)

| State | TFR |
|-------|-----|
| Tamil Nadu | 1.8 |
| Kerala | 1.8 |
| Karnataka | 1.7 |
| Andhra Pradesh | 1.7 |
| Telangana | 1.8 |
| West Bengal | 1.6 |
| Uttar Pradesh | 2.4 |
| Bihar | 3.0 |
| Madhya Pradesh | 2.0 |
| Rajasthan | 2.0 |
| India (overall) | 2.0 |

**Source:** [NFHS-5 State Factsheets](http://rchiips.org/nfhs/factsheet_NFHS-5.shtml)

## Population Growth (1971–2024 est.)

| State | 1971 | 2024 Est. | Growth |
|-------|------|-----------|--------|
| Uttar Pradesh | 83.8M | 235.0M | 180% |
| Bihar | 42.1M | 128.5M | 205% |
| Rajasthan | 25.8M | 81.0M | 214% |
| Tamil Nadu | 41.2M | 77.8M | 89% |
| Kerala | 21.3M | 35.6M | 67% |
| Karnataka | 29.3M | 68.9M | 135% |

## Full Dataset

See `js/data.js` for the complete JSON array with all 36 states/UTs including:
- `pop1971`, `pop2011`, `pop2024` (estimated)
- `seats` (current Lok Sabha allocation)
- `region` (North, South, East, West, Northeast, UT)

**Source:** Census of India 1971 & 2011; NCP Population Projections 2020; Election Commission of India
