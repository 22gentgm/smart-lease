# Smart Lease

**Student housing, simplified. Find your perfect apartment in days, not weeks.**

Smart Lease is a mobile-first student housing platform designed for University of Tennessee Knoxville students. It centralizes apartment discovery, roommate matching, and verified tenant reviews into one app.

---

## What's In This Repo

### Documents

| File | Description |
|---|---|
| `BUSINESS_CONTEXT.md` | Full business context: problem, market, revenue model, features, competitive landscape, founder profile |
| `PROJECT_PLAN.md` | Comprehensive project plan: tech stack, architecture, data model, 6-month timeline, budget breakdown, MVP specs, marketing strategy, risk assessment |

### Interactive Prototypes

Four distinct design directions for the Smart Match quiz feature. **Open any HTML file in a browser to interact with it.**

| File | Design Direction | Description |
|---|---|---|
| `prototypes/v1-editorial-magazine.html` | Editorial Magazine | Scroll-driven luxury editorial experience. Serif typography, asymmetric layouts, full-width photography. Think Vogue meets real estate. |
| `prototypes/v2-neon-cyberpunk.html` | Neon Cyberpunk Terminal | Dark hacker terminal aesthetic. Monospace fonts, neon glow effects, boot sequence animation, classified dossier-style results. Think Blade Runner. |
| `prototypes/v3-playful-genz.html` | Playful Gen-Z Social | Chat-based interaction with a friendly mascot. The quiz is a conversation. Swipeable Tinder-style result cards. Bouncy, bubbly, fun. Think Duolingo meets Hinge. |
| `prototypes/v4-3d-dashboard.html` | Immersive 3D Dashboard | Single-screen power dashboard with real-time filtering. 3D card tilt effects, comparison charts, SVG gauges. Think Bloomberg terminal meets Apple Vision Pro. |

---

## The Problem

When a UT student wants to find off-campus housing today:
1. Google "apartments in Knoxville"
2. Click through individual apartment websites one by one
3. Manually compare prices and floor plans
4. Start an application only to discover it's out of budget
5. No way to find honest, verified reviews
6. Finding subleases requires Facebook groups
7. Roommate matching is essentially random

**Smart Lease fixes all of this.**

---

## MVP Features (August 2026 Launch)

1. **Smart Match** - Preference quiz that returns your top 2-3 apartment matches
2. **Roommate Finder** - Tinder-style matching for compatible roommates
3. **Verified Reviews** - Honest reviews from confirmed tenants (lease verification)

## Phase 2 Features (Post-Launch)

4. Sublease Marketplace
5. Interactive Map View
6. AI Lease Assistant (TurboTax for leases)

---

## Market

- **40,421** total UT students (Fall 2025)
- **7,143** freshmen per year (recurring demand)
- **~33,000+** students needing off-campus housing
- **~15** apartment complexes in the UT market
- **No direct competitor** in the student housing niche

---

## Tech Stack (Recommended)

| Layer | Technology | Why |
|---|---|---|
| Frontend | React Native + Expo | One codebase, iOS + Android |
| Backend | Supabase | Free tier handles 50K users. Auth, DB, storage, realtime. |
| Notifications | Expo Push + Twilio | Push is free, SMS for price alerts |
| AI (Phase 2) | OpenAI API | Lease assistant chatbot |
| Development | Cursor IDE | AI-assisted coding for non-technical founder |

**Estimated hard costs to launch: $500-800** (nearly everything has a free tier)

---

## Timeline

| Phase | Dates | Goal |
|---|---|---|
| Phase 0: Foundation | Feb 14 - Feb 28 | Setup tools, learn basics |
| Phase 1: Core Build | Mar 1 - Apr 11 | App shell, auth, Smart Match |
| Phase 2: Features | Apr 12 - May 23 | Roommate Finder, Reviews |
| Phase 3: Polish | May 24 - Jun 20 | UI polish, beta testing |
| Phase 4: Launch Prep | Jun 21 - Jul 31 | App stores, marketing |
| **LAUNCH** | **August 1, 2026** | **Go live for UT students** |

---

## How to View the Prototypes

1. Download or clone this repo
2. Open any file in the `prototypes/` folder in your web browser
3. Click through the interactive screens
4. Each prototype is a fully self-contained HTML file (no dependencies to install)

---

## About

**Founder:** Grayson
**Advisor:** Wesley, Anderson Center for Entrepreneurship, UT Knoxville
**Status:** Pre-revenue, Planning Stage
**Created:** February 14, 2026

---

*"Putting the power back in the student's hands."*
