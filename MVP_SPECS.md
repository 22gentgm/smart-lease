# Smart Lease - MVP Feature Specifications

**Prepared for:** Grayson (Founder, Smart Lease)
**Date:** February 14, 2026
**Target Launch:** August 2026

---

## MVP Overview

The MVP (Minimum Viable Product) launches with 3 features:
1. **Smart Match** - Preference quiz that returns top apartment matches
2. **Roommate Finder** - Tinder-style matching for compatible roommates
3. **Verified Reviews** - Honest reviews from confirmed tenants

---

## Feature 1: Smart Match (Home)

**What it does:** Students answer a short preference quiz and get matched with their top 2-3 apartment options from the ~15 properties in the UT area.

**User Flow:**
1. Student taps "Find My Apartment" on home screen
2. Quiz appears (one question per screen, progress bar at top):
   - "How many bedrooms?" -> Studio / 1 / 2 / 3 / 4+
   - "What's your monthly budget?" -> Slider ($500 - $1,500)
   - "Must-have amenities?" -> Multi-select (Pool, Gym, Study Room, In-Unit Laundry, Parking, Pet Friendly, Furnished)
   - "How far from campus?" -> Walking distance / Short drive / Don't care
   - "What matters most?" -> Rank: Price / Amenities / Location / Reviews
3. App runs matching algorithm against apartment database
4. Results screen shows 2-3 cards with: apartment name, photo, monthly price, match percentage, top 3 amenities, star rating, "View Details" button, alert toggle

**Matching Algorithm (v1):**
- Budget fit: 40% weight
- Amenity match: 30% weight
- Location: 15% weight
- Review score: 15% weight
- Return top 3 by score

**Data Required:**
- Apartment listings (manually entered for ~15 properties)
- Floor plans with prices, amenities, photos

**Technical Notes:**
- Data in Supabase apartments and floor_plans tables
- Quiz responses in user_preferences table
- Matching runs client-side or via Edge Function
- Results cached for return visits

---

## Feature 2: Roommate Finder

**What it does:** Tinder-style matching for compatible roommates.

**User Flow:**
1. Create roommate profile (one-time):
   - Photo (optional), bio, major, year
   - Living preferences: Sleep schedule (Early bird/Night owl/Flexible), Cleanliness (Very tidy/Moderate/Relaxed), Noise level (Quiet/Moderate/Social), Guests (Rarely/Sometimes/Frequently), Study habits (At home/Library/Mix), Budget range, Move-in timeframe, Gender preference
2. Browse profiles (card stack):
   - See photo, name, major, year, bio, compatibility %
   - Swipe right = Interested, Swipe left = Pass
3. Mutual match -> notification + in-app chat unlocked
4. Matches screen: list of matches with chat

**Compatibility Algorithm:**
- Same sleep schedule: +20 points
- Same cleanliness: +20 points
- Compatible noise: +15 points
- Overlapping budget: +20 points
- Same move-in timeframe: +15 points
- Guest compatibility: +10 points
- Show highest compatibility first

**Technical Notes:**
- Profiles in roommate_profiles table
- Swipes in roommate_swipes table
- Match = mutual likes
- Chat via Supabase Realtime (free)
- Photos in Supabase Storage

---

## Feature 3: Verified Reviews

**What it does:** Honest apartment reviews from verified tenants. Key differentiator.

**User Flow:**
1. Tap "Write a Review"
2. Verification: Select apartment, upload lease photo (redact sensitive info), pending review
3. Once verified, write review: Overall rating (1-5), Category ratings (Maintenance, Management, Noise, Value, Amenities, Safety), Written review, Pros/Cons tags, Would recommend?, Move-in year
4. Browse reviews: By apartment, sort/filter, aggregate scores, verified badges

**Verification Process (v1 - Manual):**
1. Student uploads lease photo
2. Grayson reviews within 24-48 hours
3. Check apartment name and date range
4. Approve or reject
5. Student notified, review goes live

**Verification Process (v2 - Semi-Automated):**
1. AI reads lease photo (OCR)
2. Extracts apartment name and dates
3. Cross-references database
4. Auto-approves if confident, flags if not

**Incentives:**
- v1: Social proof ("Be the first to review!")
- v2: Badge system ("Top Reviewer")
- v3: Gift card raffle for reviewers

---

## App Navigation

Bottom tab bar with 5 tabs:
1. Home (Smart Match)
2. Roommates (Finder)
3. Reviews (Verified)
4. Alerts (Price notifications)
5. Profile (Settings)

---

## Onboarding Flow

First-time users:
1. Welcome screen with app overview
2. Sign up: First name, last name, email, phone
3. Account created via Supabase Auth
4. Directed to Smart Match quiz

---

*Part of the Smart Lease Project Plan.*
