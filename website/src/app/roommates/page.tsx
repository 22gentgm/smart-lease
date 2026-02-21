"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import {
  Moon,
  Sun,
  Brush,
  Volume2,
  VolumeX,
  BookOpen,
  Home,
  Users,
  UserCheck,
  DollarSign,
  X,
  Heart,
  Search,
  Save,
  CheckCircle2,
  Mail,
  MapPin,
  Trash2,
  RotateCcw,
  Calendar,
  User,
} from "lucide-react";
import { APARTMENTS } from "@/data/apartments";

/* ───────────────────────── Types ───────────────────────── */

interface RoommateProfile {
  id: number;
  name: string;
  email: string;
  gender: string;
  major: string;
  year: string;
  social: string;
  living: string;
  bed: string;
  budgetMin: number;
  budgetMax: number;
  moveIn: string;
  sleep: string;
  cleanliness: number;
  noise: number;
  guests: string;
  study: string;
  tags: string[];
  color: string;
}

/* ───────────────────────── Demo Profiles ───────────────────────── */

const DEMO_PROFILES: RoommateProfile[] = [
  { id:1, name:"Sarah Mitchell", email:"smitch42@vols.utk.edu", gender:"Female", major:"Business Analytics", social:"@sarahm_utk", living:"Hub Knoxville", year:"Junior", bed:"2 Bed", budgetMin:1200, budgetMax:1600, moveIn:"Fall 2026", sleep:"Night Owl", cleanliness:4, noise:3, guests:"Sometimes", study:"Both", tags:["Social","Drinks socially"], color:"bg-orange-100 text-orange-700" },
  { id:2, name:"Jake Thompson", email:"jthomps8@vols.utk.edu", gender:"Male", major:"Computer Science", social:"@jake.codes", living:"The Standard at Knoxville", year:"Sophomore", bed:"2 Bed", budgetMin:1100, budgetMax:1500, moveIn:"Fall 2026", sleep:"Night Owl", cleanliness:3, noise:4, guests:"Often", study:"Home", tags:["Social","No pets pls"], color:"bg-blue-100 text-blue-700" },
  { id:3, name:"Emily Chen", email:"echen12@vols.utk.edu", gender:"Female", major:"Pre-Med", social:"@em.chen", living:"The Knox Apartments", year:"Freshman", bed:"4 Bed", budgetMin:800, budgetMax:1000, moveIn:"Fall 2026", sleep:"Early Bird", cleanliness:5, noise:2, guests:"Rarely", study:"Library", tags:["Quiet","No smoking","No alcohol"], color:"bg-purple-100 text-purple-700" },
  { id:4, name:"Marcus Johnson", email:"mjohns55@vols.utk.edu", gender:"Male", major:"Civil Engineering", social:"@marcusj_", living:"303 Flats", year:"Senior", bed:"2 Bed", budgetMin:1000, budgetMax:1300, moveIn:"Summer 2026", sleep:"Early Bird", cleanliness:4, noise:2, guests:"Sometimes", study:"Library", tags:["No smoking","Has pets"], color:"bg-green-100 text-green-700" },
  { id:5, name:"Olivia Rodriguez", email:"orodri3@vols.utk.edu", gender:"Female", major:"Architecture", social:"@livdesigns", living:"The Mark", year:"Junior", bed:"3 Bed", budgetMin:900, budgetMax:1200, moveIn:"Fall 2026", sleep:"Night Owl", cleanliness:3, noise:3, guests:"Often", study:"Home", tags:["Social","Drinks socially","Has pets"], color:"bg-pink-100 text-pink-700" },
  { id:6, name:"Tyler Brooks", email:"tbrooks7@vols.utk.edu", gender:"Male", major:"Finance", social:"@tylerb.finance", living:"Ever", year:"Senior", bed:"4 Bed", budgetMin:1200, budgetMax:1500, moveIn:"Fall 2026", sleep:"Flexible", cleanliness:3, noise:4, guests:"Often", study:"Both", tags:["Social","Drinks socially","Smokes socially"], color:"bg-amber-100 text-amber-700" },
  { id:7, name:"Aisha Patel", email:"apatel29@vols.utk.edu", gender:"Female", major:"Nursing", social:"@aisha.rn", living:"", year:"Sophomore", bed:"2 Bed", budgetMin:800, budgetMax:1100, moveIn:"Fall 2026", sleep:"Early Bird", cleanliness:5, noise:1, guests:"Rarely", study:"Library", tags:["Quiet","No smoking","No alcohol","No pets pls"], color:"bg-teal-100 text-teal-700" },
  { id:8, name:"Chris Martinez", email:"cmart16@vols.utk.edu", gender:"Male", major:"Sports Management", social:"@chris.m.utk", living:"Slate at 901", year:"Junior", bed:"3 Bed", budgetMin:1100, budgetMax:1600, moveIn:"Summer 2026", sleep:"Night Owl", cleanliness:2, noise:5, guests:"Often", study:"Both", tags:["Social","Drinks socially","Smokes socially"], color:"bg-red-100 text-red-700" },
  { id:9, name:"Hannah Lee", email:"hlee44@vols.utk.edu", gender:"Female", major:"Graphic Design", social:"@hannahcreates", living:"The Davy", year:"Freshman", bed:"2 Bed", budgetMin:900, budgetMax:1400, moveIn:"Fall 2026", sleep:"Night Owl", cleanliness:4, noise:3, guests:"Sometimes", study:"Home", tags:["Has pets","Social"], color:"bg-rose-100 text-rose-700" },
  { id:10, name:"Daniel Kim", email:"dkim33@vols.utk.edu", gender:"Male", major:"Accounting", social:"@dan.kim", living:"University Walk", year:"Senior", bed:"3 Bed", budgetMin:800, budgetMax:1100, moveIn:"ASAP", sleep:"Early Bird", cleanliness:4, noise:2, guests:"Rarely", study:"Library", tags:["Quiet","No smoking"], color:"bg-indigo-100 text-indigo-700" },
  { id:11, name:"Jasmine Wright", email:"jwrigh9@vols.utk.edu", gender:"Female", major:"Psychology", social:"@jas.wright", living:"Villas Knoxville", year:"Junior", bed:"4 Bed", budgetMin:900, budgetMax:1100, moveIn:"Fall 2026", sleep:"Flexible", cleanliness:3, noise:3, guests:"Sometimes", study:"Both", tags:["Has pets","Social","Drinks socially"], color:"bg-violet-100 text-violet-700" },
  { id:12, name:"Ryan O'Brien", email:"robrien5@vols.utk.edu", gender:"Male", major:"Mechanical Engineering", social:"@ryanobrien", living:"The Heights", year:"Sophomore", bed:"3 Bed", budgetMin:700, budgetMax:1000, moveIn:"Fall 2026", sleep:"Night Owl", cleanliness:3, noise:4, guests:"Sometimes", study:"Home", tags:["Social","Smokes socially"], color:"bg-slate-100 text-slate-700" },
  { id:13, name:"Sofia Garcia", email:"sgarci7@vols.utk.edu", gender:"Female", major:"Marketing", social:"@sofi.garcia", living:"The Commons at Knoxville", year:"Freshman", bed:"2 Bed", budgetMin:800, budgetMax:1100, moveIn:"Fall 2026", sleep:"Early Bird", cleanliness:4, noise:2, guests:"Rarely", study:"Library", tags:["Quiet","No alcohol","No pets pls"], color:"bg-red-50 text-red-600" },
  { id:14, name:"Ethan Wilson", email:"ewilso22@vols.utk.edu", gender:"Male", major:"Political Science", social:"@ethan.w", living:"TENN", year:"Senior", bed:"4 Bed", budgetMin:1200, budgetMax:1500, moveIn:"Summer 2026", sleep:"Flexible", cleanliness:3, noise:3, guests:"Often", study:"Both", tags:["Social","Drinks socially"], color:"bg-purple-50 text-purple-600" },
  { id:15, name:"Mia Anderson", email:"mander8@vols.utk.edu", gender:"Female", major:"Biology", social:"@mia.bio", living:"Tradition at Knoxville", year:"Sophomore", bed:"2 Bed", budgetMin:700, budgetMax:900, moveIn:"Fall 2026", sleep:"Early Bird", cleanliness:5, noise:1, guests:"Rarely", study:"Library", tags:["Quiet","No smoking","No alcohol"], color:"bg-emerald-100 text-emerald-700" },
  { id:16, name:"Noah Davis", email:"ndavis18@vols.utk.edu", gender:"Male", major:"Supply Chain", social:"@noah.d", living:"Knox Ridge", year:"Junior", bed:"4 Bed", budgetMin:800, budgetMax:1100, moveIn:"Fall 2026", sleep:"Night Owl", cleanliness:2, noise:4, guests:"Often", study:"Home", tags:["Has pets","Smokes socially","Social"], color:"bg-yellow-100 text-yellow-700" },
  { id:17, name:"Lily Nguyen", email:"lnguye5@vols.utk.edu", gender:"Non-binary", major:"Communication Studies", social:"@lily.ng", living:"Livano", year:"Freshman", bed:"Studio", budgetMin:1000, budgetMax:1400, moveIn:"Spring 2027", sleep:"Flexible", cleanliness:4, noise:3, guests:"Sometimes", study:"Both", tags:["Social","Drinks socially","No pets pls"], color:"bg-pink-50 text-pink-600" },
  { id:18, name:"Brandon Scott", email:"bscott31@vols.utk.edu", gender:"Male", major:"Kinesiology", social:"@b.scott.fit", living:"The Woodlands", year:"Senior", bed:"3 Bed", budgetMin:600, budgetMax:850, moveIn:"ASAP", sleep:"Early Bird", cleanliness:4, noise:2, guests:"Sometimes", study:"Both", tags:["No smoking","Has pets"], color:"bg-green-50 text-green-600" },
];

/* ───────────────────────── Compatibility Algorithm ───────────────────────── */

function computeCompatibility(a: Partial<RoommateProfile>, b: RoommateProfile): number {
  let score = 0;
  if (a.budgetMin && a.budgetMax && b.budgetMin && b.budgetMax) {
    const oStart = Math.max(a.budgetMin, b.budgetMin);
    const oEnd = Math.min(a.budgetMax, b.budgetMax);
    if (oEnd >= oStart) {
      const range = Math.max(a.budgetMax, b.budgetMax) - Math.min(a.budgetMin, b.budgetMin);
      score += range > 0 ? Math.round(((oEnd - oStart) / range) * 20) : 20;
    }
  } else { score += 10; }
  if (a.sleep && b.sleep) {
    if (a.sleep === b.sleep) score += 15;
    else if (a.sleep === "Flexible" || b.sleep === "Flexible") score += 10;
  } else { score += 7; }
  const cDiff = Math.abs((a.cleanliness ?? 3) - (b.cleanliness ?? 3));
  score += Math.round((1 - cDiff / 4) * 15);
  const nDiff = Math.abs((a.noise ?? 3) - (b.noise ?? 3));
  score += Math.round((1 - nDiff / 4) * 10);
  const aT = a.tags ?? []; const bT = b.tags ?? [];
  if ((aT.includes("Has pets") && bT.includes("No pets pls")) || (bT.includes("Has pets") && aT.includes("No pets pls"))) score += 0;
  else if ((aT.includes("Has pets") && bT.includes("Has pets")) || (aT.includes("No pets pls") && bT.includes("No pets pls"))) score += 10;
  else score += 6;
  if (a.guests && b.guests) {
    const gMap: Record<string,number> = { Rarely:0, Sometimes:1, Often:2 };
    score += Math.abs((gMap[a.guests]??1)-(gMap[b.guests]??1)) === 0 ? 10 : Math.abs((gMap[a.guests]??1)-(gMap[b.guests]??1)) === 1 ? 6 : 2;
  } else { score += 5; }
  if (a.study && b.study) {
    if (a.study === b.study) score += 10; else if (a.study === "Both" || b.study === "Both") score += 7; else score += 3;
  } else { score += 5; }
  if (a.moveIn && b.moveIn) {
    const mO = ["ASAP","Summer 2026","Fall 2026","Spring 2027"];
    const diff = Math.abs(mO.indexOf(a.moveIn) - mO.indexOf(b.moveIn));
    score += diff === 0 ? 10 : diff === 1 ? 6 : 2;
  } else { score += 5; }
  if (a.living && b.living && a.living === b.living && a.living !== "") score += 10;
  return Math.min(100, Math.max(0, score));
}

/* ───────────────────────── Preference tag configs ───────────────────────── */

const SLEEP_OPTIONS = ["Early Bird", "Night Owl", "Flexible"];
const CLEAN_LEVELS = [1,2,3,4,5];
const NOISE_LEVELS = [1,2,3,4,5];
const GUEST_OPTIONS = ["Rarely", "Sometimes", "Often"];
const STUDY_OPTIONS = ["Library", "Home", "Both"];
const MOVEIN_OPTIONS = ["ASAP", "Summer 2026", "Fall 2026", "Spring 2027"];
const GENDER_OPTIONS = ["Male", "Female", "Non-binary", "Prefer not to say"];
const BED_OPTIONS = ["Studio", "1 Bed", "2 Bed", "3 Bed", "4 Bed", "5 Bed"];
const YEAR_OPTIONS = ["Freshman", "Sophomore", "Junior", "Senior", "Grad"];
const LIFESTYLE_TAGS = ["Has pets", "No pets pls", "Social", "Quiet", "Smokes socially", "No smoking", "Drinks socially", "No alcohol"];

/* ───────────────────────── Component ───────────────────────── */

export default function RoommatesPage() {
  const [activeTab, setActiveTab] = useState<"discover" | "matches" | "profile">("discover");
  const [filter, setFilter] = useState("");
  const [matched, setMatched] = useState<RoommateProfile[]>([]);
  const [passed, setPassed] = useState<Set<number>>(new Set());
  const [toast, setToast] = useState<string | null>(null);
  const [matchFlash, setMatchFlash] = useState<string | null>(null);
  const [profileCreated, setProfileCreated] = useState(false);

  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formGender, setFormGender] = useState("");
  const [formMajor, setFormMajor] = useState("");
  const [formYear, setFormYear] = useState("");
  const [formSocial, setFormSocial] = useState("");
  const [formLiving, setFormLiving] = useState("");
  const [formBed, setFormBed] = useState("");
  const [formSleep, setFormSleep] = useState("");
  const [formClean, setFormClean] = useState(3);
  const [formNoise, setFormNoise] = useState(3);
  const [formGuests, setFormGuests] = useState("");
  const [formStudy, setFormStudy] = useState("");
  const [formMoveIn, setFormMoveIn] = useState("");
  const [formBudgetMin, setFormBudgetMin] = useState("");
  const [formBudgetMax, setFormBudgetMax] = useState("");
  const [formTags, setFormTags] = useState<string[]>([]);
  const [profileSaved, setProfileSaved] = useState(false);

  const userProfile: Partial<RoommateProfile> = {
    name: formName, sleep: formSleep, cleanliness: formClean, noise: formNoise,
    guests: formGuests, study: formStudy, moveIn: formMoveIn, living: formLiving,
    budgetMin: parseInt(formBudgetMin) || 0, budgetMax: parseInt(formBudgetMax) || 0, tags: formTags,
  };

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  const sortedProfiles = DEMO_PROFILES
    .filter(p => !passed.has(p.id) && !matched.some(m => m.id === p.id))
    .filter(p => !filter || p.living === filter)
    .map(p => ({ ...p, _compat: profileCreated ? computeCompatibility(userProfile, p) : Math.min(95, 60 + (p.id % 8) * 4) }))
    .sort((a, b) => b._compat - a._compat);

  const handleMatch = (profile: RoommateProfile & { _compat?: number }) => {
    setMatched(prev => [...prev, profile]);
    setMatchFlash(profile.name.split(" ")[0]);
    setTimeout(() => setMatchFlash(null), 1800);
  };

  const handlePass = (id: number) => {
    setPassed(prev => new Set(prev).add(id));
  };

  const handleRemoveMatch = (id: number) => {
    setMatched(prev => prev.filter(m => m.id !== id));
    setPassed(prev => { const n = new Set(prev); n.delete(id); return n; });
  };

  const handleReset = () => {
    setPassed(new Set());
  };

  const handleSaveProfile = () => {
    if (!formName || !formEmail) return;
    setProfileCreated(true);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
    showToast("Profile saved! Start discovering roommates.");
    setActiveTab("discover");
  };

  const toggleTag = (tag: string) => {
    setFormTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const apartments = APARTMENTS.map(a => a.name).sort();

  return (
    <main className="min-h-screen bg-cream pb-24 md:pb-0">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-success text-white text-sm font-semibold px-5 py-3 rounded-xl shadow-lg animate-fade-in">
          <CheckCircle2 size={18} />
          {toast}
        </div>
      )}

      {/* Match Flash */}
      {matchFlash && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex flex-col items-center justify-center animate-fade-in">
          <h2 className="font-serif text-4xl font-bold text-white mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif", animation: "matchPop 0.5s cubic-bezier(0.175,0.885,0.32,1.275)" }}>
            It&apos;s a Match!
          </h2>
          <p className="text-white/70 text-base">You and {matchFlash} are a great fit.</p>
        </div>
      )}

      {/* Header */}
      <section className="max-w-3xl mx-auto px-6 pt-20 md:pt-28 text-center">
        <p className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-ut-orange mb-5 border border-ut-orange/30 rounded-full px-4 py-1.5">
          Roommate Finder
        </p>
        <h1
          className="font-serif text-4xl sm:text-5xl font-bold leading-tight tracking-tight text-ink"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Find Your <span className="text-ut-orange">Roommate</span>
        </h1>
        <p className="mt-4 text-lg text-smokey-gray max-w-xl mx-auto leading-relaxed">
          Swipe to match with compatible UT students. Contact matches via email.
        </p>
      </section>

      {/* Tabs */}
      <div className="max-w-3xl mx-auto px-6 mt-10">
        <div className="flex gap-1 p-1 rounded-xl bg-white border border-ink/5 shadow-sm">
          {([
            { key: "discover" as const, icon: Search, label: "Discover" },
            { key: "matches" as const, icon: Heart, label: `Matches${matched.length > 0 ? ` (${matched.length})` : ""}` },
            { key: "profile" as const, icon: UserCheck, label: "My Profile" },
          ]).map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 flex items-center justify-center gap-2 text-sm font-semibold py-3 rounded-lg transition-all duration-200 ${
                activeTab === tab.key
                  ? "bg-ut-orange text-white shadow-sm"
                  : "text-smokey-gray hover:text-ink hover:bg-cream"
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="max-w-3xl mx-auto px-6 mt-8">
        {activeTab === "discover" && (
          <DiscoverTab
            profiles={sortedProfiles}
            filter={filter}
            setFilter={setFilter}
            apartments={apartments}
            onMatch={handleMatch}
            onPass={handlePass}
            onReset={handleReset}
            profileCreated={profileCreated}
            matchCount={matched.length}
            onViewMatches={() => setActiveTab("matches")}
          />
        )}
        {activeTab === "matches" && (
          <MatchesTab
            matches={matched}
            onRemove={handleRemoveMatch}
          />
        )}
        {activeTab === "profile" && (
          <ProfileTab
            formName={formName} setFormName={setFormName}
            formEmail={formEmail} setFormEmail={setFormEmail}
            formGender={formGender} setFormGender={setFormGender}
            formMajor={formMajor} setFormMajor={setFormMajor}
            formYear={formYear} setFormYear={setFormYear}
            formSocial={formSocial} setFormSocial={setFormSocial}
            formLiving={formLiving} setFormLiving={setFormLiving}
            formBed={formBed} setFormBed={setFormBed}
            formSleep={formSleep} setFormSleep={setFormSleep}
            formClean={formClean} setFormClean={setFormClean}
            formNoise={formNoise} setFormNoise={setFormNoise}
            formGuests={formGuests} setFormGuests={setFormGuests}
            formStudy={formStudy} setFormStudy={setFormStudy}
            formMoveIn={formMoveIn} setFormMoveIn={setFormMoveIn}
            formBudgetMin={formBudgetMin} setFormBudgetMin={setFormBudgetMin}
            formBudgetMax={formBudgetMax} setFormBudgetMax={setFormBudgetMax}
            formTags={formTags} toggleTag={toggleTag}
            profileSaved={profileSaved} onSave={handleSaveProfile}
            apartments={apartments}
          />
        )}
      </div>

      <style jsx>{`
        @keyframes matchPop {
          0% { transform: scale(0.3); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </main>
  );
}

/* ═══════════════════════════ Discover Tab ═══════════════════════════ */

function DiscoverTab({ profiles, filter, setFilter, apartments, onMatch, onPass, onReset, profileCreated, matchCount, onViewMatches }: {
  profiles: (RoommateProfile & { _compat: number })[];
  filter: string; setFilter: (v: string) => void;
  apartments: string[];
  onMatch: (p: RoommateProfile & { _compat: number }) => void;
  onPass: (id: number) => void;
  onReset: () => void;
  profileCreated: boolean;
  matchCount: number;
  onViewMatches: () => void;
}) {
  return (
    <div>
      {!profileCreated && (
        <div className="mb-6 p-4 rounded-xl bg-ut-orange/5 border border-ut-orange/20 text-center">
          <p className="text-sm text-smokey-gray">Create your profile first for personalized compatibility scores.</p>
        </div>
      )}

      {/* Filter Bar */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
        <button
          onClick={() => setFilter("")}
          className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
            !filter ? "bg-ut-orange text-white" : "bg-white border border-ink/10 text-smokey-gray hover:border-ut-orange/40"
          }`}
        >
          Everyone
        </button>
        {apartments.map(name => (
          <button
            key={name}
            onClick={() => setFilter(name)}
            className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
              filter === name ? "bg-ut-orange text-white" : "bg-white border border-ink/10 text-smokey-gray hover:border-ut-orange/40"
            }`}
          >
            {name}
          </button>
        ))}
      </div>

      {/* Cards */}
      {profiles.length === 0 ? (
        <div className="text-center py-20 rounded-2xl border border-dashed border-ink/10 bg-white">
          <Users size={48} className="mx-auto text-smokey-light mb-4" />
          <p className="text-lg font-semibold text-ink mb-1">You&apos;ve seen everyone!</p>
          <p className="text-sm text-smokey-gray mb-6">Check back as more UT students join SmartLease.</p>
          {matchCount > 0 && (
            <button onClick={onViewMatches} className="inline-flex items-center gap-2 bg-ut-orange text-white text-sm font-semibold px-6 py-3 rounded-xl mr-3">
              <Heart size={16} /> View Matches ({matchCount})
            </button>
          )}
          <button onClick={onReset} className="inline-flex items-center gap-2 text-smokey-gray text-sm font-semibold px-6 py-3 rounded-xl border border-ink/10 hover:bg-cream">
            <RotateCcw size={16} /> Browse Again
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {profiles.slice(0, 5).map(profile => (
            <SwipeCard
              key={profile.id}
              profile={profile}
              onMatch={() => onMatch(profile)}
              onPass={() => onPass(profile.id)}
            />
          ))}
          {profiles.length > 5 && (
            <p className="text-center text-sm text-smokey-light py-4">
              {profiles.length - 5} more {profiles.length - 5 !== 1 ? "profiles" : "profile"} below...
            </p>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Swipe Card ── */

function SwipeCard({ profile, onMatch, onPass }: {
  profile: RoommateProfile & { _compat: number };
  onMatch: () => void;
  onPass: () => void;
}) {
  const traits: { label: string; value: string }[] = [
    ...(profile.living ? [{ label: "Living at", value: profile.living }] : []),
    ...(profile.bed ? [{ label: "Bedroom", value: profile.bed }] : []),
    { label: "Budget", value: `$${profile.budgetMin}–$${profile.budgetMax}/mo` },
    ...(profile.moveIn ? [{ label: "Move-in", value: profile.moveIn }] : []),
    { label: "Sleep", value: profile.sleep },
    { label: "Cleanliness", value: `${profile.cleanliness} / 5` },
    { label: "Noise", value: `${profile.noise} / 5` },
    { label: "Guests", value: profile.guests },
    { label: "Study", value: profile.study },
  ];

  return (
    <div className="rounded-2xl border border-ink/5 bg-white shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className={`shrink-0 w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold ${profile.color}`}>
            {profile.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-ink leading-tight">{profile.name}</h3>
            <p className="text-sm text-smokey-gray">
              {profile.major} &middot; {profile.year} &middot; {profile.gender}
            </p>
          </div>
          <div className="shrink-0 w-12 h-12 rounded-full border-[3px] border-ut-orange flex items-center justify-center">
            <span className="text-sm font-bold text-ut-orange">{profile._compat}%</span>
          </div>
        </div>

        {/* Traits */}
        <div className="mt-4 space-y-0">
          {traits.map(t => (
            <div key={t.label} className="flex justify-between py-1.5 border-b border-ink/[0.03] text-sm">
              <span className="text-smokey-gray">{t.label}</span>
              <span className="text-ink font-medium">{t.value}</span>
            </div>
          ))}
        </div>

        {/* Tags */}
        {profile.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {profile.tags.map(tag => (
              <span key={tag} className="text-xs font-medium text-ut-orange bg-ut-orange/10 rounded-lg px-3 py-1">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Social */}
        {profile.social && (
          <p className="mt-3 text-xs text-smokey-light">{profile.social}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex border-t border-ink/5">
        <button
          onClick={onPass}
          className="flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold text-smokey-gray hover:bg-red-50 hover:text-red-500 transition-all duration-200"
        >
          <X size={18} /> Pass
        </button>
        <div className="w-px bg-ink/5" />
        <button
          onClick={onMatch}
          className="flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold text-ut-orange hover:bg-orange-50 transition-all duration-200"
        >
          <Heart size={18} /> Match
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════ Matches Tab ═══════════════════════════ */

function MatchesTab({ matches, onRemove }: {
  matches: RoommateProfile[];
  onRemove: (id: number) => void;
}) {
  if (matches.length === 0) {
    return (
      <div className="text-center py-20 rounded-2xl border border-dashed border-ink/10 bg-white">
        <Heart size={48} className="mx-auto text-smokey-light mb-4" />
        <p className="text-lg font-semibold text-ink mb-1">No matches yet</p>
        <p className="text-sm text-smokey-gray">Swipe right on profiles you like to start matching.</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-smokey-gray mb-4">{matches.length} match{matches.length !== 1 ? "es" : ""}</p>
      <div className="space-y-4">
        {matches.map(m => (
          <div key={m.id} className="rounded-2xl border border-ink/5 bg-white shadow-sm p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className={`shrink-0 w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold ${m.color}`}>
                {m.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-bold text-ink">{m.name}</p>
                <p className="text-xs text-smokey-gray">{m.major} &middot; {m.year} &middot; {m.gender}</p>
              </div>
            </div>
            {m.living && (
              <p className="text-xs text-smokey-gray mb-1">
                <MapPin size={12} className="inline mr-1" />
                Lives at <span className="text-ink font-medium">{m.living}</span>
              </p>
            )}
            {m.social && (
              <p className="text-xs text-smokey-gray mb-3">{m.social}</p>
            )}
            <div className="flex gap-3 pt-3 border-t border-ink/5">
              <a
                href={`mailto:${m.email}`}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white bg-ut-orange hover:bg-ut-orange-light transition shadow-sm"
              >
                <Mail size={15} />
                Email {m.name.split(" ")[0]}
              </a>
              <button
                onClick={() => onRemove(m.id)}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-red-400 border border-red-200 hover:bg-red-50 transition"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════ Profile Tab ═══════════════════════════ */

function ProfileTab(props: {
  formName: string; setFormName: (v: string) => void;
  formEmail: string; setFormEmail: (v: string) => void;
  formGender: string; setFormGender: (v: string) => void;
  formMajor: string; setFormMajor: (v: string) => void;
  formYear: string; setFormYear: (v: string) => void;
  formSocial: string; setFormSocial: (v: string) => void;
  formLiving: string; setFormLiving: (v: string) => void;
  formBed: string; setFormBed: (v: string) => void;
  formSleep: string; setFormSleep: (v: string) => void;
  formClean: number; setFormClean: (v: number) => void;
  formNoise: number; setFormNoise: (v: number) => void;
  formGuests: string; setFormGuests: (v: string) => void;
  formStudy: string; setFormStudy: (v: string) => void;
  formMoveIn: string; setFormMoveIn: (v: string) => void;
  formBudgetMin: string; setFormBudgetMin: (v: string) => void;
  formBudgetMax: string; setFormBudgetMax: (v: string) => void;
  formTags: string[]; toggleTag: (t: string) => void;
  profileSaved: boolean; onSave: () => void;
  apartments: string[];
}) {
  const inputClass = "w-full rounded-xl border border-ink/10 bg-cream px-4 py-3 text-sm text-ink placeholder:text-smokey-light focus:outline-none focus:ring-2 focus:ring-ut-orange/40 focus:border-ut-orange transition";

  const PillSelector = ({ value, options, onChange }: { value: string; options: string[]; onChange: (v: string) => void }) => (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => (
        <button key={opt} onClick={() => onChange(opt)}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
            value === opt ? "bg-ut-orange text-white shadow-sm" : "bg-cream border border-ink/10 text-smokey-gray hover:border-ut-orange/40"
          }`}
        >{opt}</button>
      ))}
    </div>
  );

  return (
    <div className="rounded-2xl border border-ink/5 bg-white shadow-sm p-6 md:p-8">
      <h2 className="text-2xl font-bold text-ink mb-1" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
        Your Roommate Profile
      </h2>
      <p className="text-sm text-smokey-gray mb-8">Fill out your preferences so potential roommates can find you.</p>

      {/* Basic info */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-semibold text-smokey-gray uppercase tracking-wide mb-1.5">Name *</label>
          <input type="text" value={props.formName} onChange={e => props.setFormName(e.target.value)} placeholder="Your name" className={inputClass} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-smokey-gray uppercase tracking-wide mb-1.5">Email *</label>
          <input type="email" value={props.formEmail} onChange={e => props.setFormEmail(e.target.value)} placeholder="you@vols.utk.edu" className={inputClass} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-smokey-gray uppercase tracking-wide mb-1.5">Major</label>
          <input type="text" value={props.formMajor} onChange={e => props.setFormMajor(e.target.value)} placeholder="e.g. Computer Science" className={inputClass} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-smokey-gray uppercase tracking-wide mb-1.5">Social Media</label>
          <input type="text" value={props.formSocial} onChange={e => props.setFormSocial(e.target.value)} placeholder="@yourhandle" className={inputClass} />
        </div>
      </div>

      {/* Gender */}
      <div className="mt-6">
        <label className="flex items-center gap-2 text-xs font-semibold text-smokey-gray uppercase tracking-wide mb-2">
          <User size={14} /> Gender
        </label>
        <PillSelector value={props.formGender} options={GENDER_OPTIONS} onChange={props.setFormGender} />
      </div>

      {/* Year */}
      <div className="mt-6">
        <label className="block text-xs font-semibold text-smokey-gray uppercase tracking-wide mb-2">Year in School</label>
        <PillSelector value={props.formYear} options={YEAR_OPTIONS} onChange={props.setFormYear} />
      </div>

      {/* Where living */}
      <div className="mt-6">
        <label className="flex items-center gap-2 text-xs font-semibold text-smokey-gray uppercase tracking-wide mb-2">
          <MapPin size={14} /> Where are you living?
        </label>
        <select value={props.formLiving} onChange={e => props.setFormLiving(e.target.value)}
          className={inputClass + " appearance-none"}
        >
          <option value="">Not decided yet</option>
          {props.apartments.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
      </div>

      {/* Bedroom preference */}
      <div className="mt-6">
        <label className="block text-xs font-semibold text-smokey-gray uppercase tracking-wide mb-2">Preferred Bedroom Type</label>
        <PillSelector value={props.formBed} options={BED_OPTIONS} onChange={props.setFormBed} />
      </div>

      {/* Budget */}
      <div className="mt-6">
        <label className="flex items-center gap-2 text-xs font-semibold text-smokey-gray uppercase tracking-wide mb-2">
          <DollarSign size={14} /> Budget Range ($/month)
        </label>
        <div className="grid grid-cols-2 gap-4">
          <input type="number" value={props.formBudgetMin} onChange={e => props.setFormBudgetMin(e.target.value)} placeholder="Min (e.g. 800)" className={inputClass} />
          <input type="number" value={props.formBudgetMax} onChange={e => props.setFormBudgetMax(e.target.value)} placeholder="Max (e.g. 1200)" className={inputClass} />
        </div>
      </div>

      {/* Move-in */}
      <div className="mt-6">
        <label className="flex items-center gap-2 text-xs font-semibold text-smokey-gray uppercase tracking-wide mb-2">
          <Calendar size={14} /> Move-in Timeframe
        </label>
        <PillSelector value={props.formMoveIn} options={MOVEIN_OPTIONS} onChange={props.setFormMoveIn} />
      </div>

      {/* Lifestyle preferences */}
      <div className="mt-8 space-y-5">
        <p className="text-xs font-semibold text-smokey-gray uppercase tracking-wide">Lifestyle Preferences</p>

        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-ink mb-2">
            {props.formSleep === "Early Bird" ? <Sun size={15} className="text-smokey-light" /> : <Moon size={15} className="text-smokey-light" />}
            Sleep Schedule
          </label>
          <PillSelector value={props.formSleep} options={SLEEP_OPTIONS} onChange={props.setFormSleep} />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-ink mb-2">
            <Brush size={15} className="text-smokey-light" />
            Cleanliness <span className="text-ut-orange ml-1">{props.formClean}/5</span>
          </label>
          <input type="range" min={1} max={5} value={props.formClean} onChange={e => props.setFormClean(Number(e.target.value))}
            className="w-full accent-ut-orange" />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-ink mb-2">
            {props.formNoise <= 2 ? <VolumeX size={15} className="text-smokey-light" /> : <Volume2 size={15} className="text-smokey-light" />}
            Noise Tolerance <span className="text-ut-orange ml-1">{props.formNoise}/5</span>
          </label>
          <input type="range" min={1} max={5} value={props.formNoise} onChange={e => props.setFormNoise(Number(e.target.value))}
            className="w-full accent-ut-orange" />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-ink mb-2">
            <Users size={15} className="text-smokey-light" /> Guest Frequency
          </label>
          <PillSelector value={props.formGuests} options={GUEST_OPTIONS} onChange={props.setFormGuests} />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-ink mb-2">
            <BookOpen size={15} className="text-smokey-light" /> Study Habits
          </label>
          <PillSelector value={props.formStudy} options={STUDY_OPTIONS} onChange={props.setFormStudy} />
        </div>
      </div>

      {/* Lifestyle tags */}
      <div className="mt-8">
        <p className="text-xs font-semibold text-smokey-gray uppercase tracking-wide mb-3">Lifestyle Tags</p>
        <div className="flex flex-wrap gap-2">
          {LIFESTYLE_TAGS.map(tag => (
            <button key={tag} onClick={() => props.toggleTag(tag)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                props.formTags.includes(tag) ? "bg-ut-orange text-white shadow-sm" : "bg-cream border border-ink/10 text-smokey-gray hover:border-ut-orange/40"
              }`}
            >{tag}</button>
          ))}
        </div>
      </div>

      {/* Save */}
      <div className="mt-8 flex items-center gap-4">
        <button onClick={props.onSave}
          className="inline-flex items-center gap-2 bg-ut-orange hover:bg-ut-orange-light text-white text-sm font-semibold px-8 py-3.5 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <Save size={16} /> Save & Start Matching
        </button>
        {props.profileSaved && (
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-success animate-fade-in">
            <CheckCircle2 size={16} /> Profile saved!
          </span>
        )}
      </div>
    </div>
  );
}
