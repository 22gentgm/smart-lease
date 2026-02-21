# Smart Lease - Full Project & Infrastructure Plan

**Prepared for:** Grayson (Founder, Smart Lease)
**Prepared by:** AI Development Advisor
**Date:** February 14, 2026
**Version:** 1.0

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Recommended Tech Stack](#2-recommended-tech-stack)
3. [App Architecture](#3-app-architecture)
4. [MVP Feature Specifications](#4-mvp-feature-specifications)
5. [Data Model](#5-data-model)
6. [Development Phases & Timeline](#6-development-phases--timeline)
7. [Budget Breakdown](#7-budget-breakdown)
8. [Infrastructure & Hosting](#8-infrastructure--hosting)
9. [Build Approach for Non-Technical Founder](#9-build-approach-for-non-technical-founder)
10. [Marketing & Launch Strategy](#10-marketing--launch-strategy)
11. [Risk Assessment & Mitigation](#11-risk-assessment--mitigation)
12. [Phase 2 Roadmap](#12-phase-2-roadmap)
13. [Metrics to Track](#13-metrics-to-track)
14. [Next Steps](#14-next-steps)

---

## 1. Executive Summary

Smart Lease is a mobile-first student housing platform for UT Knoxville. This plan outlines how to build and launch an MVP by August 2026 with a $3,000 budget and a non-technical solo founder.

**The recommended approach:** Build a cross-platform mobile app using **React Native with Expo** and a **Supabase** backend. This combination allows one codebase to run on both iOS and Android, provides a generous free tier that keeps costs near zero during early growth, and has the largest ecosystem of AI-assisted development tools available.

**Why not a no-code tool?** Tools like Bubble or Adalo seem tempting, but they hit walls fast. You can't do custom roommate matching algorithms, you'll pay $50-100/month in platform fees, and you'll eventually need to rebuild everything when you outgrow them. Starting with real code (with AI assistance) gives you a product you own and can scale.

---

## 2. Recommended Tech Stack

### Frontend (What Users See)

| Technology | Purpose | Why This Choice |
|---|---|---|
| **React Native + Expo** | Cross-platform mobile app (iOS + Android) | One codebase, both platforms. Expo simplifies building and deploying. Instagram, Discord, and Shopify use React Native. |
| **Expo Router** | Navigation (bottom tabs, screens) | File-based routing, easy to understand. Built for the bottom-tab-bar pattern you described. |
| **NativeWind (Tailwind CSS)** | Styling | Utility-first CSS that's fast to write and looks great. Huge community of pre-built components. |

### Backend (The Engine)

| Technology | Purpose | Why This Choice |
|---|---|---|
| **Supabase** | Database, authentication, storage, real-time | Free tier handles 50,000 monthly active users. Built-in auth (email, Google, Apple sign-in). PostgreSQL database. File storage for lease verification photos and apartment images. |
| **Supabase Edge Functions** | Server logic (matching algorithm, notifications) | Runs custom code without managing servers. Free tier included. |
| **Twilio** (or **Supabase + Expo Notifications**) | SMS/Push notifications for price alerts | Twilio is $0.0079/SMS. Push notifications are free. Start with push, add SMS later. |

### AI Integration

| Technology | Purpose | Why This Choice |
|---|---|---|
| **OpenAI API** (Phase 2) | AI Lease Assistant chatbot | Pay-per-use pricing. ~$0.002 per lease question. Only needed in Phase 2. |

### Development Tools

| Tool | Purpose | Why This Choice |
|---|---|---|
| **Cursor IDE** | AI-assisted code editor | This is what Wesley and I use. It can generate, explain, and debug code with AI. A non-technical founder can build real features with this. |
| **GitHub** | Code storage and version control | Free. Industry standard. Backs up your code. |
| **Expo EAS** | App building and deployment | Builds your app for the App Store and Google Play. Free tier available. |

### Why This Stack Works for You

1. **Cost:** Nearly everything has a free tier. You won't pay meaningful infrastructure costs until you have thousands of users.
2. **Speed:** AI tools (Cursor) can generate 80% of the boilerplate code. You focus on the logic and design.
3. **Scalability:** This stack can handle 100 users or 100,000 users. No rebuilding needed.
4. **Community:** React Native and Supabase have massive communities. Every problem you hit, someone has solved before.
5. **Ownership:** You own the code. No platform lock-in. No monthly fees to a no-code tool.

---

## 3. App Architecture

### High-Level System Diagram

```
┌─────────────────────────────────────────────────────┐
│                    SMART LEASE APP                    │
│              (React Native + Expo)                    │
│                                                       │
│  ┌──────┐ ┌──────────┐ ┌─────────┐ ┌──────────────┐ │
│  │ Home │ │ Roommate │ │ Reviews │ │   Profile    │ │
│  │Match │ │  Finder  │ │         │ │              │ │
│  └──┬───┘ └────┬─────┘ └────┬────┘ └──────┬───────┘ │
│     │          │             │              │         │
└─────┼──────────┼─────────────┼──────────────┼─────────┘
      │          │             │              │
      ▼          ▼             ▼              ▼
┌─────────────────────────────────────────────────────┐
│                   SUPABASE BACKEND                    │
│                                                       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌─────────┐ │
│  │   Auth   │ │ Database │ │ Storage  │ │  Edge   │ │
│  │ (Login)  │ │(Postgres)│ │ (Files)  │ │Functions│ │
│  └──────────┘ └──────────┘ └──────────┘ └─────────┘ │
│                                                       │
│  Users, Apartments, Reviews, Matches, Preferences     │
└─────────────────────────────────────────────────────┘
      │
      ▼
┌─────────────────────┐
│  External Services   │
│  - Push Notifications│
│  - SMS (Twilio)      │
│  - OpenAI (Phase 2)  │
└─────────────────────┘
```

### Screen Flow

```
App Open
  │
  ▼
Onboarding (First Time Only)
  │ Collect: First Name, Last Name, Email, Phone
  │ Create account (Supabase Auth)
  │
  ▼
Home Screen (Bottom Tab Bar)
  │
  ├── Tab 1: 🏠 Smart Match (Home)
  │     │
  │     ├── Preference Quiz Flow (5-7 questions)
  │     │     └── Results: Top 2-3 Apartments
  │     │           ├── Listing Card (price, photos, link)
  │     │           └── 🔔 Set Price Alert
  │     │
  │     └── Saved Results (previously matched)
  │
  ├── Tab 2: 👥 Roommate Finder
  │     │
  │     ├── Create Roommate Profile
  │     │     └── Preferences (cleanliness, sleep schedule,
  │     │         noise level, guests, budget range, etc.)
  │     │
  │     ├── Browse Profiles (swipe/card UI)
  │     │     ├── Like → Match if mutual
  │     │     └── Pass → Next profile
  │     │
  │     └── Matches (chat with matched roommates)
  │
  ├── Tab 3: ⭐ Reviews
  │     │
  │     ├── Browse by Apartment
  │     │     └── Each apartment shows:
  │     │           ├── Overall rating
  │     │           ├── Category ratings (maintenance,
  │     │           │   management, noise, value, etc.)
  │     │           └── Individual reviews (verified badge)
  │     │
  │     └── Write a Review
  │           ├── Select apartment
  │           ├── Upload lease verification
  │           └── Submit ratings + written review
  │
  ├── Tab 4: 🔔 Alerts
  │     │
  │     └── Price alerts and special notifications
  │         from apartments you're watching
  │
  └── Tab 5: 👤 Profile
        │
        ├── Edit personal info
        ├── My saved apartments
        ├── My roommate matches
        ├── My reviews
        └── Settings / Logout
```

---

## 4. MVP Feature Specifications

### Feature 1: Smart Match (Home)

**What it does:** Students answer a short preference quiz and get matched with their top 2-3 apartment options from the ~15 properties in the UT area.

**User Flow:**
1. Student taps "Find My Apartment" on home screen
2. Quiz appears (one question per screen, progress bar at top):
   - "How many bedrooms?" → 1 / 2 / 3 / 4+
   - "What's your monthly budget?" → Slider ($500 - $1,500)
   - "Must-have amenities?" → Multi-select checkboxes (Pool, Gym, Study Room, In-Unit Laundry, Parking, Pet Friendly, Furnished)
   - "How far from campus?" → Walking distance / Short drive / Don't care
   - "What matters most?" → Rank: Price / Amenities / Location / Reviews
3. App runs matching algorithm against apartment database
4. Results screen shows 2-3 cards, each with:
   - Apartment name and photo
   - Monthly price for selected floor plan
   - Match percentage (e.g., "94% match")
   - Top 3 matching amenities (icons)
   - Star rating from verified reviews
   - "View Details" button → expanded view with more photos, all amenities, link to apartment website
   - 🔔 "Alert me on specials" toggle

**Matching Algorithm (Simple v1):**
- Score each apartment based on weighted criteria:
  - Budget fit (40% weight): Is the price within range?
  - Amenity match (30% weight): How many must-haves does it have?
  - Location (15% weight): Distance from campus
  - Review score (15% weight): Average verified rating
- Return top 3 by score

**Data Required:**
- Apartment listings (name, address, floor plans, prices, amenities, photos, website URL)
- This data will be manually entered initially for the ~15 properties

**Technical Notes:**
- Apartment data stored in Supabase `apartments` and `floor_plans` tables
- Quiz responses stored in `user_preferences` table
- Matching runs client-side (simple enough for v1) or via Edge Function
- Results cached so user can return to them

---

### Feature 2: Roommate Finder

**What it does:** Tinder-style matching for compatible roommates. Students create a profile with their living preferences and swipe through potential matches.

**User Flow:**
1. Student creates roommate profile (one-time setup):
   - Upload a photo (optional but encouraged)
   - Bio (short text: major, year, interests)
   - Living preferences quiz:
     - Sleep schedule: Early bird / Night owl / Flexible
     - Cleanliness: Very tidy / Moderate / Relaxed
     - Noise level: Quiet / Moderate / Social
     - Guests: Rarely / Sometimes / Frequently
     - Study habits: At home / Library / Mix
     - Budget range: Slider
     - Move-in timeframe: Select semester
     - Gender preference for roommate: Male / Female / No preference
2. Browse potential roommates (card stack UI):
   - See photo, name, major, year, bio
   - Compatibility percentage based on preference overlap
   - Tap card to see full profile with detailed preferences
   - Swipe right (or tap ✓) = Interested
   - Swipe left (or tap ✗) = Pass
3. If both students swipe right → It's a Match!
   - Notification sent to both
   - In-app chat unlocked between them
4. Matches screen:
   - List of all mutual matches
   - Chat with each match
   - Option to "unmatch"

**Matching Algorithm:**
- Compatibility score based on preference alignment:
  - Same sleep schedule: +20 points
  - Same cleanliness level: +20 points
  - Compatible noise levels: +15 points
  - Overlapping budget range: +20 points
  - Same move-in timeframe: +15 points
  - Guest frequency compatibility: +10 points
- Show highest compatibility profiles first

**Technical Notes:**
- Profiles stored in `roommate_profiles` table
- Swipes stored in `roommate_swipes` table (user_id, target_id, direction)
- Match = both users swiped right (query for mutual likes)
- Chat via Supabase Realtime (built-in, free)
- Photos stored in Supabase Storage

---

### Feature 3: Verified Reviews

**What it does:** Honest apartment reviews from verified current/past tenants. The key differentiator from Google and Yelp reviews.

**User Flow:**
1. Student taps "Write a Review"
2. Verification step:
   - Select apartment from dropdown
   - Upload photo of lease (instructions to redact SSN/sensitive info)
   - System flags as "pending verification"
   - Manual review initially (Grayson reviews submissions)
   - Later: AI-assisted verification (check apartment name + date range on lease)
3. Once verified, student writes review:
   - Overall rating (1-5 stars)
   - Category ratings:
     - Maintenance responsiveness (1-5)
     - Management quality (1-5)
     - Noise level (1-5)
     - Value for money (1-5)
     - Amenity quality (1-5)
     - Safety/security (1-5)
   - Written review (text)
   - Pros (tags: "Great pool", "Quiet", "Close to campus", etc.)
   - Cons (tags: "Slow maintenance", "Thin walls", "Parking issues", etc.)
   - "Would you recommend?" Yes / No
   - Move-in year (to show recency)
4. Browse reviews:
   - Select apartment → see all verified reviews
   - Sort by: Most recent, Highest rated, Lowest rated
   - Filter by: Year, Floor plan type
   - Aggregate scores shown at top
   - Each review shows ✓ Verified badge

**Verification Process (v1 - Manual):**
1. Student uploads lease photo
2. Grayson (or team) reviews within 24-48 hours
3. Check: Does the lease show the apartment name? Is it a real lease?
4. Approve or reject
5. Student gets notified and review goes live

**Verification Process (v2 - Semi-Automated):**
1. AI reads lease photo (OCR)
2. Extracts apartment name and date range
3. Cross-references with apartment database
4. Auto-approves if confident, flags for manual review if not

**Incentives for Leaving Reviews:**
- v1: Social proof ("Be the first to review [Apartment]!")
- v2: Badge system ("Top Reviewer", "Trusted Voice")
- v3: Small rewards (gift card raffle for reviewers each month)

**Technical Notes:**
- Reviews stored in `reviews` table with `verified` boolean
- Lease photos stored in Supabase Storage (private bucket)
- Aggregate ratings calculated and cached per apartment
- Reviews linked to `apartments` table via foreign key

---

## 5. Data Model

### Core Tables

```
┌─────────────────────────────────────────┐
│                 users                    │
├─────────────────────────────────────────┤
│ id (UUID, primary key)                  │
│ email (text, unique)                    │
│ first_name (text)                       │
│ last_name (text)                        │
│ phone (text)                            │
│ university (text, default: "UTK")       │
│ graduation_year (integer)               │
│ created_at (timestamp)                  │
│ updated_at (timestamp)                  │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│              apartments                  │
├─────────────────────────────────────────┤
│ id (UUID, primary key)                  │
│ name (text)                             │
│ address (text)                          │
│ latitude (float)                        │
│ longitude (float)                       │
│ website_url (text)                      │
│ phone (text)                            │
│ description (text)                      │
│ photos (text array - storage URLs)      │
│ amenities (text array)                  │
│ distance_from_campus (float, miles)     │
│ pet_friendly (boolean)                  │
│ parking_available (boolean)             │
│ avg_rating (float, computed)            │
│ review_count (integer, computed)        │
│ created_at (timestamp)                  │
│ updated_at (timestamp)                  │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│              floor_plans                 │
├─────────────────────────────────────────┤
│ id (UUID, primary key)                  │
│ apartment_id (UUID, foreign key)        │
│ name (text, e.g. "2BR/2BA Standard")   │
│ bedrooms (integer)                      │
│ bathrooms (integer)                     │
│ sqft (integer)                          │
│ price_min (decimal)                     │
│ price_max (decimal)                     │
│ furnished (boolean)                     │
│ in_unit_laundry (boolean)              │
│ photos (text array)                     │
│ available (boolean)                     │
│ created_at (timestamp)                  │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│           user_preferences               │
├─────────────────────────────────────────┤
│ id (UUID, primary key)                  │
│ user_id (UUID, foreign key)             │
│ bedrooms (integer)                      │
│ budget_min (decimal)                    │
│ budget_max (decimal)                    │
│ must_have_amenities (text array)        │
│ max_distance (float, miles)             │
│ priority (text: price/amenities/        │
│          location/reviews)              │
│ created_at (timestamp)                  │
│ updated_at (timestamp)                  │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│           match_results                  │
├─────────────────────────────────────────┤
│ id (UUID, primary key)                  │
│ user_id (UUID, foreign key)             │
│ apartment_id (UUID, foreign key)        │
│ match_score (float, 0-100)              │
│ saved (boolean)                         │
│ alert_enabled (boolean)                 │
│ created_at (timestamp)                  │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│          roommate_profiles               │
├─────────────────────────────────────────┤
│ id (UUID, primary key)                  │
│ user_id (UUID, foreign key)             │
│ photo_url (text)                        │
│ bio (text)                              │
│ major (text)                            │
│ year (text)                             │
│ sleep_schedule (text)                   │
│ cleanliness (text)                      │
│ noise_level (text)                      │
│ guest_frequency (text)                  │
│ study_habits (text)                     │
│ budget_min (decimal)                    │
│ budget_max (decimal)                    │
│ move_in_semester (text)                 │
│ gender_preference (text)                │
│ active (boolean)                        │
│ created_at (timestamp)                  │
│ updated_at (timestamp)                  │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│          roommate_swipes                 │
├─────────────────────────────────────────┤
│ id (UUID, primary key)                  │
│ user_id (UUID, foreign key)             │
│ target_user_id (UUID, foreign key)      │
│ direction (text: "like" or "pass")      │
│ created_at (timestamp)                  │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│          roommate_matches                │
├─────────────────────────────────────────┤
│ id (UUID, primary key)                  │
│ user_1_id (UUID, foreign key)           │
│ user_2_id (UUID, foreign key)           │
│ matched_at (timestamp)                  │
│ active (boolean)                        │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│              messages                    │
├─────────────────────────────────────────┤
│ id (UUID, primary key)                  │
│ match_id (UUID, foreign key)            │
│ sender_id (UUID, foreign key)           │
│ content (text)                          │
│ read (boolean)                          │
│ created_at (timestamp)                  │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│              reviews                     │
├─────────────────────────────────────────┤
│ id (UUID, primary key)                  │
│ user_id (UUID, foreign key)             │
│ apartment_id (UUID, foreign key)        │
│ overall_rating (integer, 1-5)           │
│ maintenance_rating (integer, 1-5)       │
│ management_rating (integer, 1-5)        │
│ noise_rating (integer, 1-5)             │
│ value_rating (integer, 1-5)             │
│ amenity_rating (integer, 1-5)           │
│ safety_rating (integer, 1-5)            │
│ review_text (text)                      │
│ pros (text array)                       │
│ cons (text array)                       │
│ would_recommend (boolean)               │
│ move_in_year (integer)                  │
│ verified (boolean, default false)       │
│ lease_photo_url (text, private)         │
│ verification_status (text:              │
│   pending/approved/rejected)            │
│ created_at (timestamp)                  │
│ updated_at (timestamp)                  │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│           price_alerts                   │
├─────────────────────────────────────────┤
│ id (UUID, primary key)                  │
│ user_id (UUID, foreign key)             │
│ apartment_id (UUID, foreign key)        │
│ floor_plan_id (UUID, foreign key, opt)  │
│ active (boolean)                        │
│ created_at (timestamp)                  │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│              specials                    │
├─────────────────────────────────────────┤
│ id (UUID, primary key)                  │
│ apartment_id (UUID, foreign key)        │
│ title (text)                            │
│ description (text)                      │
│ discount_amount (text)                  │
│ valid_from (date)                       │
│ valid_until (date)                      │
│ active (boolean)                        │
│ created_at (timestamp)                  │
└─────────────────────────────────────────┘
```

---

## 6. Development Phases & Timeline

### Overview: February 2026 → August 2026 (6 Months)

```
Feb         Mar         Apr         May         Jun         Jul         Aug
 │           │           │           │           │           │           │
 ▼           ▼           ▼           ▼           ▼           ▼           ▼
┌───────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌─────┐
│PHASE 0│ │  PHASE 1  │ │  PHASE 2  │ │  PHASE 3  │ │  PHASE 4  │ │LIVE!│
│ Learn │ │   Core    │ │ Features  │ │  Polish   │ │  Launch   │ │ 🚀  │
│ Setup │ │   Build   │ │  Build    │ │  & Test   │ │   Prep    │ │     │
└───────┘ └───────────┘ └───────────┘ └───────────┘ └───────────┘ └─────┘
 2 weeks    6 weeks      6 weeks       4 weeks       4 weeks      Launch
```

---

### Phase 0: Foundation (Feb 14 - Feb 28) — 2 Weeks

**Goal:** Get your development environment set up and learn the basics.

| Task | Time | Details |
|---|---|---|
| Install development tools | Day 1-2 | Install Node.js, VS Code or Cursor IDE, Git, Expo CLI |
| Create accounts | Day 1 | GitHub (free), Supabase (free), Expo (free), Apple Developer ($99/yr) |
| Complete React Native tutorial | Week 1-2 | Follow Expo's official tutorial (builds a real app step by step) |
| Build a "Hello World" app | Week 1 | Get a basic app running on your phone via Expo Go |
| Set up Supabase project | Week 2 | Create database, enable auth, test basic data operations |
| Create the Smart Lease GitHub repo | Week 2 | Initialize project, push first code |

**Milestone:** You can run a basic app on your phone and connect it to a database.

**Resources:**
- Expo Tutorial: https://docs.expo.dev/tutorial/introduction/
- Supabase Quick Start: https://supabase.com/docs/guides/getting-started
- Cursor IDE: https://cursor.com (AI-assisted coding)

---

### Phase 1: Core Build (Mar 1 - Apr 11) — 6 Weeks

**Goal:** Build the app skeleton, authentication, and the Smart Match feature.

#### Week 1-2: App Shell & Auth
| Task | Details |
|---|---|
| Set up bottom tab navigation | 5 tabs: Home, Roommate, Reviews, Alerts, Profile |
| Build onboarding screens | Welcome screen, sign-up form (name, email, phone) |
| Implement authentication | Supabase Auth with email/password. Add Google Sign-In. |
| Build profile screen | View/edit personal info, settings |
| Create database tables | Users, apartments, floor_plans tables in Supabase |

#### Week 3-4: Smart Match Feature
| Task | Details |
|---|---|
| Build preference quiz UI | One question per screen, progress bar, animations |
| Manually enter apartment data | All ~15 UT apartments with floor plans, prices, amenities, photos |
| Build matching algorithm | Weighted scoring system (budget 40%, amenities 30%, location 15%, reviews 15%) |
| Build results screen | Card-based layout showing top 2-3 matches with photos, price, match % |
| Build apartment detail screen | Full info page with all photos, amenities, floor plans, link to website |

#### Week 5-6: Data & Polish
| Task | Details |
|---|---|
| Research and enter all apartment data | Prices, floor plans, amenities for all 15 properties |
| Add "Save" functionality | Users can save/bookmark apartments |
| Add price alert toggle | Enable notifications for specific apartments |
| Test Smart Match end-to-end | Run through the full flow, fix bugs |
| Get feedback from 3-5 friends | Have real students test the quiz and results |

**Milestone:** Smart Match is fully functional. A student can take the quiz and get real apartment recommendations.

---

### Phase 2: Features Build (Apr 12 - May 23) — 6 Weeks

**Goal:** Build Roommate Finder and Verified Reviews.

#### Week 7-8: Roommate Finder
| Task | Details |
|---|---|
| Build roommate profile creation | Photo upload, bio, living preferences quiz |
| Build card stack UI | Swipeable cards showing roommate profiles |
| Implement compatibility algorithm | Score based on preference alignment |
| Build matching system | Detect mutual likes, create matches |
| Build matches list screen | Show all matches with last message preview |

#### Week 9-10: Roommate Chat + Reviews
| Task | Details |
|---|---|
| Build in-app chat | Real-time messaging between matched roommates (Supabase Realtime) |
| Build review browsing UI | Browse reviews by apartment, sort/filter options |
| Build review submission flow | Select apartment, rate categories, write review |
| Build lease verification upload | Photo upload with instructions for redacting sensitive info |
| Build manual verification queue | Admin view for Grayson to approve/reject verifications |

#### Week 11-12: Integration & Testing
| Task | Details |
|---|---|
| Connect reviews to Smart Match | Show review scores on apartment cards |
| Build notification system | Push notifications for roommate matches and price alerts |
| End-to-end testing of all features | Test every flow on both iOS and Android |
| Fix bugs from testing | Address issues found |
| Second round of friend testing | 5-10 students test all three features |

**Milestone:** All three MVP features are functional and tested.

---

### Phase 3: Polish & Test (May 24 - Jun 20) — 4 Weeks

**Goal:** Make it look and feel professional. Fix everything.

| Task | Time | Details |
|---|---|---|
| UI/UX polish | Week 13-14 | Animations, transitions, loading states, empty states, error handling |
| Design system | Week 13 | Consistent colors, fonts, spacing, button styles across the app |
| App icon and splash screen | Week 13 | Professional branding (logo, colors, app store graphics) |
| Performance optimization | Week 14 | Fast load times, smooth scrolling, image optimization |
| Beta testing | Week 15-16 | Release to 20-30 students via TestFlight (iOS) and internal testing (Android) |
| Bug fixes from beta | Week 15-16 | Fix everything beta testers find |
| Accessibility check | Week 16 | Ensure app works for all users |

**Milestone:** App is polished, tested, and ready for submission to app stores.

---

### Phase 4: Launch Prep (Jun 21 - Jul 31) — 6 Weeks

**Goal:** Get into app stores and prepare marketing for August launch.

| Task | Time | Details |
|---|---|---|
| Apple App Store submission | Week 17 | App Store listing, screenshots, description, review process (can take 1-2 weeks) |
| Google Play Store submission | Week 17 | Play Store listing, screenshots, description (usually faster than Apple) |
| Build landing page website | Week 17-18 | Simple website: smartlease.app with app store links, feature overview |
| Create social media accounts | Week 18 | Instagram, TikTok for Smart Lease |
| Content creation | Week 19-20 | Launch video, feature demos, testimonials from beta testers |
| Campus marketing plan | Week 20-22 | Flyers, QR codes, partnerships with student orgs, move-in day presence |
| Apartment partner outreach | Week 20-22 | Pitch to all 15 properties for ad partnerships |
| Soft launch | Week 21 | Release to a small group, monitor for issues |
| **FULL LAUNCH** | **August 1** | **Go live for all UT students** |

**Milestone:** App is live on both app stores. Marketing is running. Students are downloading.

---

## 7. Budget Breakdown

### Total Budget: $3,000

| Category | Item | Cost | Notes |
|---|---|---|---|
| **Development** | Cursor IDE Pro | $20/mo x 6 = $120 | AI-assisted coding (optional, free tier exists) |
| **Development** | GitHub | $0 | Free for public/private repos |
| **Hosting** | Supabase (Free Tier) | $0 | 50K monthly active users, 500MB database, 1GB storage |
| **Hosting** | Expo EAS (Free Tier) | $0 | Limited builds per month (enough for development) |
| **App Stores** | Apple Developer Account | $99/year | Required to publish on App Store |
| **App Stores** | Google Play Developer | $25 (one-time) | Required to publish on Play Store |
| **Domain** | smartlease.app (or .com) | ~$12/year | Website domain |
| **Design** | Canva Pro | $13/mo x 6 = $78 | Marketing materials, social media graphics |
| **Design** | App icon/logo (Fiverr) | $50-150 | Professional logo design |
| **Marketing** | Flyers/print materials | $200 | Campus flyers, QR code stickers |
| **Marketing** | Social media ads (optional) | $200-500 | Instagram/TikTok ads targeting UT students |
| **Legal** | LLC formation (Tennessee) | $300 | Secretary of State filing fee |
| **Contingency** | Buffer | ~$1,500 | Unexpected costs, upgraded tiers if needed |
| | | | |
| **TOTAL** | | **~$1,500 - $3,000** | Leaves buffer for pitch competition prep, etc. |

### What's Free (and Why This Stack Rocks for Startups)

| Service | Free Tier Includes |
|---|---|
| **Supabase** | 50,000 monthly active users, 500MB database, 1GB file storage, unlimited API requests |
| **Expo** | Unlimited development builds, Expo Go for testing |
| **GitHub** | Unlimited repos, unlimited collaborators |
| **Vercel** (for website) | Free hosting for landing page |
| **Push Notifications** | Free through Expo |

**Bottom line:** Your actual hard costs to launch are about $500-800. The rest is marketing and buffer.

---

## 8. Infrastructure & Hosting

### Production Architecture

```
Students' Phones (iOS + Android)
        │
        ▼
┌─────────────────────┐
│   Expo/React Native │  ← App downloaded from App Store / Play Store
│   (Frontend App)    │
└────────┬────────────┘
         │ HTTPS API calls
         ▼
┌─────────────────────┐
│     Supabase        │  ← Hosted cloud service (supabase.com)
│  ┌───────────────┐  │
│  │ Auth Service   │  │  ← Handles login, signup, sessions
│  │ PostgreSQL DB  │  │  ← All your data
│  │ Storage        │  │  ← Photos, lease documents
│  │ Realtime       │  │  ← Chat messages, live updates
│  │ Edge Functions │  │  ← Custom logic (matching, notifications)
│  └───────────────┘  │
└─────────────────────┘
         │
         ▼
┌─────────────────────┐
│  External Services   │
│  - Expo Push (free)  │  ← Push notifications
│  - Twilio (Phase 2)  │  ← SMS alerts
│  - OpenAI (Phase 2)  │  ← AI Lease Assistant
└─────────────────────┘
```

### Scaling Path

| Users | Infrastructure | Monthly Cost |
|---|---|---|
| 0 - 1,000 | Supabase Free Tier | $0 |
| 1,000 - 10,000 | Supabase Pro ($25/mo) | $25 |
| 10,000 - 50,000 | Supabase Pro + increased limits | $25-75 |
| 50,000+ | Supabase Team or custom | $100+ |

**You won't pay anything for infrastructure until you have real traction.** That's the beauty of this stack.

---

## 9. Build Approach for Non-Technical Founder

This is the most important section. Here's how you, with zero coding experience, actually build this.

### The AI-Assisted Development Approach

**The old way (2020):** Hire a developer for $15,000-50,000 or spend 2 years learning to code.

**The new way (2026):** Use AI coding tools that let you describe what you want in plain English, and they generate the code. You learn by doing, and the AI handles the heavy lifting.

### Your Development Toolkit

1. **Cursor IDE** (your code editor)
   - This is a code editor with AI built in
   - You can literally type: "Create a screen with a quiz that asks about apartment preferences and shows results as cards"
   - The AI generates the code, you review it, tweak it, and run it
   - It's like having a junior developer sitting next to you 24/7

2. **Expo Go** (your testing tool)
   - Install this app on your phone
   - As you write code on your computer, the app updates live on your phone
   - You see changes instantly. No waiting for builds.

3. **YouTube + Documentation** (your learning)
   - React Native has thousands of tutorials
   - Supabase has excellent docs and video guides
   - You don't need to learn everything. Just enough to understand what the AI is generating.

### Realistic Expectations

- **Week 1-2:** You'll feel lost. This is normal. Push through.
- **Week 3-4:** Things start clicking. You understand the structure.
- **Month 2:** You're building features and fixing bugs with AI help.
- **Month 3-4:** You're moving fast. Most of your time is design decisions, not code struggles.
- **Month 5-6:** You're polishing and testing. You understand your own codebase.

### Alternative: Find a Technical Co-Founder

If after Phase 0 you feel like coding isn't for you (even with AI), your best move is to bring on a technical co-founder. Here's what to offer:

- **Equity split:** 60/40 or 70/30 (you/them) since you have the idea, market knowledge, and property relationships
- **Where to find them:** UT Computer Science department, hackathons, Anderson Center network
- **What to look for:** Someone who has built a mobile app before, even a simple one

### Hybrid Approach (Recommended)

Even if you find a co-founder, YOU should still go through Phase 0. Understanding the basics means:
- You can evaluate if a technical co-founder is actually good
- You can make informed decisions about the product
- You're not 100% dependent on someone else
- You can make small changes yourself

---

## 10. Marketing & Launch Strategy

### Pre-Launch (April - July)

| Channel | Action | Cost |
|---|---|---|
| **Instagram** | Create @smartlease account. Post apartment tips, housing memes, "coming soon" content | Free |
| **TikTok** | Short videos about apartment hunting pain points, "what if there was an app..." | Free |
| **Word of mouth** | Tell every friend. Ask beta testers to tell their friends. | Free |
| **Student orgs** | Partner with SGA, Greek life, housing-related organizations | Free |
| **Flyers** | QR code flyers in dorms, student center, libraries | $100-200 |
| **Beta program** | "Be one of the first 100 users" exclusivity campaign | Free |

### Launch Week (August)

| Action | Details |
|---|---|
| **Move-in day presence** | Be at the dorms. Hand out flyers. QR codes everywhere. |
| **Social media blitz** | Launch announcement across all channels |
| **Student org partnerships** | Have orgs share with their members |
| **Apartment partner promotion** | Ask your 2-3 partner apartments to mention Smart Lease to new tenants |
| **Referral program** | "Invite 3 friends, get featured in roommate finder" or similar |

### Growth Levers

1. **Roommate Finder is inherently viral.** If one student uses it, they need to get their potential roommates on the app too.
2. **Reviews are a content moat.** Once you have 50+ verified reviews, students will come to read them even if they're not apartment hunting yet.
3. **Seasonal demand.** Housing search peaks in January-March for the following fall. Time your marketing pushes accordingly.

---

## 11. Risk Assessment & Mitigation

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| **Can't learn to code fast enough** | Medium | High | Start Phase 0 immediately. If struggling after 2 weeks, pivot to finding a technical co-founder. |
| **Not enough apartment data** | Low | High | You only need 15 properties. Manual data entry is feasible. Start with your 2-3 relationships. |
| **Not enough reviews at launch** | Medium | Medium | Seed with your personal network. Offer incentives. Even 2-3 reviews per apartment is valuable. |
| **Low adoption** | Medium | High | Focus marketing on the roommate finder (viral) and reviews (useful even when not apartment hunting). |
| **Apartment complexes don't want to partner** | Low | Medium | They get free tenants. The value prop is clear. Start with your existing relationships as proof of concept. |
| **App store rejection** | Low | Medium | Follow Apple/Google guidelines from day one. Submit early to allow time for revisions. |
| **Technical co-founder leaves** | Medium | High | Ensure you understand the codebase (Phase 0). Use GitHub so code is always backed up and accessible. |
| **Budget overrun** | Low | Medium | Stack is almost entirely free tier. Biggest costs are fixed (App Store fees, domain). |
| **Competitor enters market** | Low | Medium | First-mover advantage at UT. Build the review moat fast. Expand to other universities before competitors can. |

---

## 12. Phase 2 Roadmap (Post-Launch)

Once the MVP is live and you have users, here's what comes next:

### Phase 2A: Sublease Marketplace (September - October 2026)
- Forum-style board for sublease listings
- Students can post their apartment with details and price
- Search and filter subleases
- In-app messaging between poster and interested students

### Phase 2B: Map View (October - November 2026)
- Interactive map with all 15+ apartment pins
- Tap a pin for quick summary (price range, rating, distance)
- Filter map by budget, amenities, rating
- Integrates with Smart Match results

### Phase 2C: AI Lease Assistant (November - December 2026)
- Upload or paste lease text
- AI explains each section in plain English
- Highlights red flags or unusual clauses
- FAQ chatbot for common lease questions
- Powered by OpenAI API (~$0.002 per question)

### Phase 3: Expansion (2027)
- **Other universities:** Start with other Tennessee schools (Vanderbilt, Memphis, MTSU)
- **Lead gen revenue model:** Approach property managers with data on how many tenants Smart Lease delivered
- **Premium features:** Priority placement in roommate finder, advanced filters
- **Partnerships:** Student loan companies, moving services, furniture rental (affiliate revenue)

---

## 13. Metrics to Track

### User Metrics
| Metric | Target (Month 1) | Target (Month 6) |
|---|---|---|
| Total downloads | 500 | 5,000 |
| Monthly active users | 200 | 2,000 |
| Quiz completions | 150 | 1,500 |
| Roommate profiles created | 100 | 1,000 |
| Roommate matches made | 30 | 500 |
| Reviews submitted | 20 | 200 |

### Engagement Metrics
| Metric | Target |
|---|---|
| Average session length | > 3 minutes |
| Return rate (weekly) | > 40% |
| Quiz completion rate | > 70% |
| Roommate swipe-to-match rate | > 15% |

### Business Metrics
| Metric | Target (Year 1) |
|---|---|
| Apartment ad partners | 5-8 of 15 |
| Monthly ad revenue | $500-2,000 |
| Leases influenced | 50-200 |
| Cost per acquisition | < $2 |

---

## 14. Next Steps (What to Do This Week)

### Today (February 14)
- [ ] Read through this entire plan
- [ ] Ask questions about anything that's unclear

### This Weekend
- [ ] Register the domain: smartlease.app (or .com)
- [ ] Create accounts: GitHub, Supabase, Expo
- [ ] Download and install: Node.js, Cursor IDE, Expo Go (on your phone)

### Next Week (Feb 17-21)
- [ ] Start the Expo tutorial (https://docs.expo.dev/tutorial/introduction/)
- [ ] Get "Hello World" running on your phone
- [ ] Watch 2-3 React Native beginner YouTube videos
- [ ] Start collecting apartment data (spreadsheet with all 15 properties)

### Week 3 (Feb 24-28)
- [ ] Complete Expo tutorial
- [ ] Set up Supabase project and create first database tables
- [ ] Build the app shell with bottom tab navigation
- [ ] Start the onboarding/signup screens

### Ongoing
- [ ] Talk to your potential co-founder about joining
- [ ] Register for pitch competitions
- [ ] Start the Instagram/TikTok accounts (even before the app is ready)

---

## Appendix: Useful Links

| Resource | URL |
|---|---|
| Expo Documentation | https://docs.expo.dev/ |
| React Native Docs | https://reactnative.dev/ |
| Supabase Docs | https://supabase.com/docs |
| Cursor IDE | https://cursor.com |
| NativeWind (Tailwind for RN) | https://www.nativewind.dev/ |
| Apple Developer Program | https://developer.apple.com/programs/ |
| Google Play Console | https://play.google.com/console/ |
| Figma (free design tool) | https://figma.com |
| Fiverr (logo design) | https://fiverr.com |

---

*This plan was generated on February 14, 2026.*
*Last updated: February 14, 2026.*
*For questions or updates, work with Wesley and the AI development advisor.*
