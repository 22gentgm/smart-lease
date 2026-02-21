# Smart Lease - Database Schema & Data Model

**Prepared for:** Grayson (Founder, Smart Lease)
**Date:** February 14, 2026

---

## Overview

Smart Lease uses **Supabase** (PostgreSQL) as its database. The schema consists of 12 core tables that handle users, apartments, matching, roommates, reviews, and notifications.

---

## Entity Relationship Summary

- A **User** has one set of **Preferences** and can have one **Roommate Profile**
- A **User** can write many **Reviews** and set many **Price Alerts**
- An **Apartment** has many **Floor Plans** and many **Reviews**
- An **Apartment** can have many **Specials** (deals/promotions)
- **Roommate Swipes** between users create **Roommate Matches**
- **Roommate Matches** enable **Messages** between matched users
- **Match Results** link users to their apartment recommendations

---

## Core Tables

### 1. users
| Column | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| email | text | Unique |
| first_name | text | |
| last_name | text | |
| phone | text | |
| university | text | Default: "UTK" |
| graduation_year | integer | |
| created_at | timestamp | |
| updated_at | timestamp | |

### 2. apartments
| Column | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| name | text | e.g. "The Knox" |
| address | text | |
| latitude | float | For map view |
| longitude | float | For map view |
| website_url | text | |
| phone | text | |
| description | text | |
| photos | text[] | Array of storage URLs |
| amenities | text[] | Array of amenity names |
| distance_from_campus | float | Miles |
| pet_friendly | boolean | |
| parking_available | boolean | |
| avg_rating | float | Computed from reviews |
| review_count | integer | Computed from reviews |
| created_at | timestamp | |
| updated_at | timestamp | |

### 3. floor_plans
| Column | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| apartment_id | UUID | Foreign key -> apartments |
| name | text | e.g. "2BR/2BA Standard" |
| bedrooms | integer | |
| bathrooms | integer | |
| sqft | integer | |
| price_min | decimal | |
| price_max | decimal | |
| furnished | boolean | |
| in_unit_laundry | boolean | |
| photos | text[] | |
| available | boolean | |
| created_at | timestamp | |

### 4. user_preferences
| Column | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| user_id | UUID | Foreign key -> users |
| bedrooms | integer | |
| budget_min | decimal | |
| budget_max | decimal | |
| must_have_amenities | text[] | |
| max_distance | float | Miles |
| priority | text | price/amenities/location/reviews |
| created_at | timestamp | |
| updated_at | timestamp | |

### 5. match_results
| Column | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| user_id | UUID | Foreign key -> users |
| apartment_id | UUID | Foreign key -> apartments |
| match_score | float | 0-100 |
| saved | boolean | User bookmarked this |
| alert_enabled | boolean | Price alert active |
| created_at | timestamp | |

### 6. roommate_profiles
| Column | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| user_id | UUID | Foreign key -> users |
| photo_url | text | |
| bio | text | |
| major | text | |
| year | text | |
| sleep_schedule | text | Early bird/Night owl/Flexible |
| cleanliness | text | Very tidy/Moderate/Relaxed |
| noise_level | text | Quiet/Moderate/Social |
| guest_frequency | text | Rarely/Sometimes/Frequently |
| study_habits | text | At home/Library/Mix |
| budget_min | decimal | |
| budget_max | decimal | |
| move_in_semester | text | |
| gender_preference | text | Male/Female/No preference |
| active | boolean | |
| created_at | timestamp | |
| updated_at | timestamp | |

### 7. roommate_swipes
| Column | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| user_id | UUID | Foreign key -> users |
| target_user_id | UUID | Foreign key -> users |
| direction | text | "like" or "pass" |
| created_at | timestamp | |

### 8. roommate_matches
| Column | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| user_1_id | UUID | Foreign key -> users |
| user_2_id | UUID | Foreign key -> users |
| matched_at | timestamp | |
| active | boolean | |

### 9. messages
| Column | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| match_id | UUID | Foreign key -> roommate_matches |
| sender_id | UUID | Foreign key -> users |
| content | text | |
| read | boolean | |
| created_at | timestamp | |

### 10. reviews
| Column | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| user_id | UUID | Foreign key -> users |
| apartment_id | UUID | Foreign key -> apartments |
| overall_rating | integer | 1-5 |
| maintenance_rating | integer | 1-5 |
| management_rating | integer | 1-5 |
| noise_rating | integer | 1-5 |
| value_rating | integer | 1-5 |
| amenity_rating | integer | 1-5 |
| safety_rating | integer | 1-5 |
| review_text | text | |
| pros | text[] | |
| cons | text[] | |
| would_recommend | boolean | |
| move_in_year | integer | |
| verified | boolean | Default: false |
| lease_photo_url | text | Private storage |
| verification_status | text | pending/approved/rejected |
| created_at | timestamp | |
| updated_at | timestamp | |

### 11. price_alerts
| Column | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| user_id | UUID | Foreign key -> users |
| apartment_id | UUID | Foreign key -> apartments |
| floor_plan_id | UUID | Foreign key -> floor_plans (optional) |
| active | boolean | |
| created_at | timestamp | |

### 12. specials
| Column | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| apartment_id | UUID | Foreign key -> apartments |
| title | text | |
| description | text | |
| discount_amount | text | |
| valid_from | date | |
| valid_until | date | |
| active | boolean | |
| created_at | timestamp | |

---

*Part of the Smart Lease Project Plan. See also: BUSINESS_CONTEXT.md, PROJECT_PLAN.md, TECH_STACK.md, TIMELINE.md, BUDGET.md, MVP_SPECS.md, MARKETING_STRATEGY.md*
