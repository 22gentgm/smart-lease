# Smart Lease - Development Timeline

**Prepared for:** Grayson (Founder, Smart Lease)
**Date:** February 14, 2026
**Target Launch:** August 1, 2026

---

## Overview: 6-Month Roadmap

```
Feb         Mar         Apr         May         Jun         Jul         Aug
 |           |           |           |           |           |           |
 v           v           v           v           v           v           v
PHASE 0    PHASE 1     PHASE 2     PHASE 3     PHASE 4     LAUNCH
 Learn      Core        Features    Polish      Launch      GO LIVE
 Setup      Build       Build       & Test      Prep
 2 weeks    6 weeks     6 weeks     4 weeks     4 weeks
```

---

## Phase 0: Foundation (Feb 14 - Feb 28) - 2 Weeks

**Goal:** Get your development environment set up and learn the basics.

| Task | Time | Details |
|---|---|---|
| Install development tools | Day 1-2 | Install Node.js, VS Code or Cursor IDE, Git, Expo CLI |
| Create accounts | Day 1 | GitHub (free), Supabase (free), Expo (free), Apple Developer ($99/yr) |
| Complete React Native tutorial | Week 1-2 | Follow Expo's official tutorial |
| Build a "Hello World" app | Week 1 | Get a basic app running on your phone via Expo Go |
| Set up Supabase project | Week 2 | Create database, enable auth, test basic data operations |
| Create the Smart Lease GitHub repo | Week 2 | Initialize project, push first code |

**Milestone:** You can run a basic app on your phone and connect it to a database.

**Resources:**
- Expo Tutorial: https://docs.expo.dev/tutorial/introduction/
- Supabase Quick Start: https://supabase.com/docs/guides/getting-started
- Cursor IDE: https://cursor.com

---

## Phase 1: Core Build (Mar 1 - Apr 11) - 6 Weeks

**Goal:** Build the app skeleton, authentication, and the Smart Match feature.

### Week 1-2: App Shell & Auth
| Task | Details |
|---|---|
| Set up bottom tab navigation | 5 tabs: Home, Roommate, Reviews, Alerts, Profile |
| Build onboarding screens | Welcome screen, sign-up form (name, email, phone) |
| Implement authentication | Supabase Auth with email/password + Google Sign-In |
| Build profile screen | View/edit personal info, settings |
| Create database tables | Users, apartments, floor_plans tables in Supabase |

### Week 3-4: Smart Match Feature
| Task | Details |
|---|---|
| Build preference quiz UI | One question per screen, progress bar, animations |
| Manually enter apartment data | All ~15 UT apartments with floor plans, prices, amenities, photos |
| Build matching algorithm | Weighted scoring (budget 40%, amenities 30%, location 15%, reviews 15%) |
| Build results screen | Card-based layout showing top 2-3 matches |
| Build apartment detail screen | Full info page with photos, amenities, floor plans, website link |

### Week 5-6: Data & Polish
| Task | Details |
|---|---|
| Research and enter all apartment data | Prices, floor plans, amenities for all 15 properties |
| Add "Save" functionality | Users can save/bookmark apartments |
| Add price alert toggle | Enable notifications for specific apartments |
| Test Smart Match end-to-end | Run through the full flow, fix bugs |
| Get feedback from 3-5 friends | Have real students test the quiz and results |

**Milestone:** Smart Match is fully functional.

---

## Phase 2: Features Build (Apr 12 - May 23) - 6 Weeks

**Goal:** Build Roommate Finder and Verified Reviews.

### Week 7-8: Roommate Finder
| Task | Details |
|---|---|
| Build roommate profile creation | Photo upload, bio, living preferences quiz |
| Build card stack UI | Swipeable cards showing roommate profiles |
| Implement compatibility algorithm | Score based on preference alignment |
| Build matching system | Detect mutual likes, create matches |
| Build matches list screen | Show all matches with last message preview |

### Week 9-10: Roommate Chat + Reviews
| Task | Details |
|---|---|
| Build in-app chat | Real-time messaging (Supabase Realtime) |
| Build review browsing UI | Browse reviews by apartment, sort/filter |
| Build review submission flow | Select apartment, rate categories, write review |
| Build lease verification upload | Photo upload with redaction instructions |
| Build manual verification queue | Admin view for approving/rejecting |

### Week 11-12: Integration & Testing
| Task | Details |
|---|---|
| Connect reviews to Smart Match | Show review scores on apartment cards |
| Build notification system | Push notifications for matches and price alerts |
| End-to-end testing | Test every flow on both iOS and Android |
| Fix bugs | Address issues found |
| Second round of testing | 5-10 students test all three features |

**Milestone:** All three MVP features are functional and tested.

---

## Phase 3: Polish & Test (May 24 - Jun 20) - 4 Weeks

**Goal:** Make it look and feel professional.

| Task | Time | Details |
|---|---|---|
| UI/UX polish | Week 13-14 | Animations, transitions, loading states, error handling |
| Design system | Week 13 | Consistent colors, fonts, spacing, button styles |
| App icon and splash screen | Week 13 | Professional branding |
| Performance optimization | Week 14 | Fast load times, smooth scrolling, image optimization |
| Beta testing | Week 15-16 | Release to 20-30 students via TestFlight (iOS) |
| Bug fixes from beta | Week 15-16 | Fix everything beta testers find |
| Accessibility check | Week 16 | Ensure app works for all users |

**Milestone:** App is polished, tested, and ready for app stores.

---

## Phase 4: Launch Prep (Jun 21 - Jul 31) - 6 Weeks

**Goal:** Get into app stores and prepare marketing.

| Task | Time | Details |
|---|---|---|
| Apple App Store submission | Week 17 | Listing, screenshots, review process (1-2 weeks) |
| Google Play Store submission | Week 17 | Listing, screenshots (usually faster) |
| Build landing page website | Week 17-18 | smartlease.app with app store links |
| Create social media accounts | Week 18 | Instagram, TikTok |
| Content creation | Week 19-20 | Launch video, feature demos, testimonials |
| Campus marketing plan | Week 20-22 | Flyers, QR codes, student org partnerships |
| Apartment partner outreach | Week 20-22 | Pitch to all 15 properties |
| Soft launch | Week 21 | Release to small group, monitor |
| **FULL LAUNCH** | **August 1** | **Go live for all UT students** |

**Milestone:** App is live. Marketing is running. Students are downloading.

---

## Immediate Next Steps

### Today (February 14)
- [ ] Read through the full project plan
- [ ] Ask questions about anything unclear

### This Weekend
- [ ] Register domain: smartlease.app (or .com)
- [ ] Create accounts: GitHub, Supabase, Expo
- [ ] Download: Node.js, Cursor IDE, Expo Go (on phone)

### Next Week (Feb 17-21)
- [ ] Start the Expo tutorial
- [ ] Get "Hello World" running on your phone
- [ ] Watch 2-3 React Native beginner videos
- [ ] Start collecting apartment data (spreadsheet)

### Week 3 (Feb 24-28)
- [ ] Complete Expo tutorial
- [ ] Set up Supabase project
- [ ] Build the app shell with bottom tab navigation
- [ ] Start onboarding/signup screens

### Ongoing
- [ ] Talk to potential co-founder
- [ ] Register for pitch competitions
- [ ] Start Instagram/TikTok accounts

---

*Part of the Smart Lease Project Plan.*
