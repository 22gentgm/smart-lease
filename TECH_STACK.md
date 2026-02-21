# Smart Lease - Technology Stack

**Prepared for:** Grayson (Founder, Smart Lease)  
**Date:** February 14, 2026

---

## Why This Stack?

Smart Lease is a mobile-first student housing platform. The tech stack was chosen for a non-technical solo founder with a $3,000 budget who needs to launch by August 2026. Every choice optimizes for: low cost, fast development with AI tools, and scalability.

**Why not a no-code tool?** Tools like Bubble or Adalo seem tempting, but they hit walls fast. You can't do custom roommate matching algorithms, you'll pay $50-100/month in platform fees, and you'll eventually need to rebuild everything when you outgrow them. Starting with real code (with AI assistance) gives you a product you own and can scale.

---

## Frontend (What Users See)

| Technology | Purpose | Why This Choice |
|------------|---------|-----------------|
| **React Native + Expo** | Cross-platform mobile app (iOS + Android) | One codebase, both platforms. Expo simplifies building and deploying. Instagram, Discord, and Shopify use React Native. |
| **Expo Router** | Navigation (bottom tabs, screens) | File-based routing, easy to understand. Built for the bottom-tab-bar pattern Smart Lease uses. |
| **NativeWind (Tailwind CSS)** | Styling | Utility-first CSS that's fast to write and looks great. Huge community of pre-built components. |

---

## Backend (The Engine)

| Technology | Purpose | Why This Choice |
|------------|---------|-----------------|
| **Supabase** | Database, authentication, storage, real-time | Free tier handles 50,000 monthly active users. Built-in auth (email, Google, Apple sign-in). PostgreSQL database. File storage for lease verification photos and apartment images. |
| **Supabase Edge Functions** | Server logic (matching algorithm, notifications) | Runs custom code without managing servers. Free tier included. |
| **Twilio** (or **Supabase + Expo Notifications**) | SMS/Push notifications for price alerts | Twilio is $0.0079/SMS. Push notifications are free. Start with push, add SMS later. |

---

## AI Integration

| Technology | Purpose | Why This Choice |
|------------|---------|-----------------|
| **OpenAI API** (Phase 2) | AI Lease Assistant chatbot | Pay-per-use pricing. ~$0.002 per lease question. Only needed in Phase 2. |

---

## Development Tools

| Tool | Purpose | Why This Choice |
|------|---------|-----------------|
| **Cursor IDE** | AI-assisted code editor | Can generate, explain, and debug code with AI. A non-technical founder can build real features with this. |
| **GitHub** | Code storage and version control | Free. Industry standard. Backs up your code. |
| **Expo EAS** | App building and deployment | Builds your app for the App Store and Google Play. Free tier available. |

---

## Why This Stack Works for You

1. **Cost:** Nearly everything has a free tier. You won't pay meaningful infrastructure costs until you have thousands of users.
2. **Speed:** AI tools (Cursor) can generate 80% of the boilerplate code. You focus on the logic and design.
3. **Scalability:** This stack can handle 100 users or 100,000 users. No rebuilding needed.
4. **Community:** React Native and Supabase have massive communities. Every problem you hit, someone has solved before.
5. **Ownership:** You own the code. No platform lock-in. No monthly fees to a no-code tool.

---

## Infrastructure & Hosting

### Production Architecture

```
Students' Phones (iOS + Android)
        |
        v
+---------------------+
|   Expo/React Native |  <- App downloaded from App Store / Play Store
|   (Frontend App)    |
+--------+------------+
         | HTTPS API calls
         v
+---------------------+
|     Supabase        |  <- Hosted cloud service (supabase.com)
|  +---------------+  |
|  | Auth Service   |  |  <- Handles login, signup, sessions
|  | PostgreSQL DB  |  |  <- All your data
|  | Storage        |  |  <- Photos, lease documents
|  | Realtime       |  |  <- Chat messages, live updates
|  | Edge Functions |  |  <- Custom logic (matching, notifications)
|  +---------------+  |
+---------------------+
         |
         v
+---------------------+
|  External Services   |
|  - Expo Push (free)  |  <- Push notifications
|  - Twilio (Phase 2)  |  <- SMS alerts
|  - OpenAI (Phase 2)  |  <- AI Lease Assistant
+---------------------+
```

### Scaling Path

| Users | Infrastructure | Monthly Cost |
|-------|---------------|--------------|
| 0 - 1,000 | Supabase Free Tier | $0 |
| 1,000 - 10,000 | Supabase Pro ($25/mo) | $25 |
| 10,000 - 50,000 | Supabase Pro + increased limits | $25-75 |
| 50,000+ | Supabase Team or custom | $100+ |

You won't pay anything for infrastructure until you have real traction.

---

## What's Free

| Service | Free Tier Includes |
|---------|-------------------|
| **Supabase** | 50,000 monthly active users, 500MB database, 1GB file storage, unlimited API requests |
| **Expo** | Unlimited development builds, Expo Go for testing |
| **GitHub** | Unlimited repos, unlimited collaborators |
| **Vercel** (for website) | Free hosting for landing page |
| **Push Notifications** | Free through Expo |

---

## Useful Links

| Resource | URL |
|----------|-----|
| Expo Documentation | https://docs.expo.dev/ |
| React Native Docs | https://reactnative.dev/ |
| Supabase Docs | https://supabase.com/docs |
| Cursor IDE | https://cursor.com |
| NativeWind (Tailwind for RN) | https://www.nativewind.dev/ |
| Apple Developer Program | https://developer.apple.com/programs/ |
| Google Play Console | https://play.google.com/console/ |
| Figma (free design tool) | https://figma.com |

---

*Part of the Smart Lease Project Plan. See also: BUSINESS_CONTEXT.md, PROJECT_PLAN.md, DATA_MODEL.md, TIMELINE.md, BUDGET.md, MVP_SPECS.md, MARKETING_STRATEGY.md*
