"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Moon, Sun, Brush, Volume2, VolumeX, BookOpen, Home as HomeIcon,
  Users, DollarSign, Heart, Search, Save, CheckCircle2, Mail,
  Calendar, User, ChevronDown, X, Loader2,
} from "lucide-react";
import { APARTMENTS } from "@/data/apartments";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";
import AuthModal from "@/components/AuthModal";

interface RoommateProfile {
  id: string;
  user_id: string;
  sleep_schedule: string;
  cleanliness: number;
  noise: number;
  guests: string;
  study_habits: string;
  bio: string;
  budget_min: number;
  budget_max: number;
  move_in: string;
  bed_preference: string;
  social_tags: string[];
  preferred_apartment_index: number | null;
  active: boolean;
  profile: {
    first_name: string;
    last_name: string;
    email: string;
    major: string | null;
    class_year: string | null;
    gender: string | null;
  };
}

const SLEEP_OPTIONS = ["Early Bird", "Night Owl", "Flexible"];
const GUEST_OPTIONS = ["Rarely", "Sometimes", "Often"];
const STUDY_OPTIONS = ["Library", "Home", "Both"];
const BED_OPTIONS = ["Studio", "1 Bed", "2 Bed", "3 Bed", "4 Bed"];
const MOVE_OPTIONS = ["Spring 2026", "Summer 2026", "Fall 2026", "Spring 2027"];
const SOCIAL_TAG_OPTIONS = [
  "Drinks socially", "Smokes socially", "No smoking", "No alcohol",
  "Has pets", "No pets pls", "420 friendly",
];
const AVATAR_COLORS = [
  "bg-orange-400", "bg-blue-400", "bg-green-400", "bg-purple-400",
  "bg-pink-400", "bg-teal-400", "bg-indigo-400", "bg-amber-400",
];

function getInitials(first: string, last: string) {
  return ((first?.[0] || "") + (last?.[0] || "")).toUpperCase();
}

function computeCompatibility(a: RoommateProfile, b: Partial<RoommateProfile>): number {
  let score = 50;
  if (b.sleep_schedule && a.sleep_schedule === b.sleep_schedule) score += 15;
  if (b.cleanliness && Math.abs(a.cleanliness - b.cleanliness) <= 1) score += 10;
  if (b.noise && Math.abs(a.noise - b.noise) <= 1) score += 10;
  if (b.guests && a.guests === b.guests) score += 5;
  if (b.study_habits && a.study_habits === b.study_habits) score += 5;
  if (b.budget_min && b.budget_max) {
    const overlap = Math.min(a.budget_max, b.budget_max) - Math.max(a.budget_min, b.budget_min);
    if (overlap > 0) score += 5;
  }
  return Math.min(score, 99);
}

export default function RoommatesPage() {
  const { user, profile } = useAuth();
  const [tab, setTab] = useState<"discover" | "matches" | "profile">("discover");
  const [showAuth, setShowAuth] = useState(false);

  const [profiles, setProfiles] = useState<RoommateProfile[]>([]);
  const [myProfile, setMyProfile] = useState<RoommateProfile | null>(null);
  const [actedOn, setActedOn] = useState<Set<string>>(new Set());
  const [matches, setMatches] = useState<RoommateProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterApt, setFilterApt] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const [formSleep, setFormSleep] = useState("Flexible");
  const [formClean, setFormClean] = useState(3);
  const [formNoise, setFormNoise] = useState(3);
  const [formGuests, setFormGuests] = useState("Sometimes");
  const [formStudy, setFormStudy] = useState("Both");
  const [formBio, setFormBio] = useState("");
  const [formBudgetMin, setFormBudgetMin] = useState(500);
  const [formBudgetMax, setFormBudgetMax] = useState(1500);
  const [formMoveIn, setFormMoveIn] = useState("Fall 2026");
  const [formBed, setFormBed] = useState("2 Bed");
  const [formTags, setFormTags] = useState<string[]>([]);
  const [formApt, setFormApt] = useState<number | null>(null);
  const [formActive, setFormActive] = useState(true);
  const [formMajor, setFormMajor] = useState("");
  const [formYear, setFormYear] = useState("");
  const [formGender, setFormGender] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!user) { setLoading(false); return; }
    setLoading(true);
    try {
      const [profilesRes, actionsRes] = await Promise.all([
        supabase.from("roommate_profiles").select("*, profile:profiles(first_name, last_name, email, major, class_year, gender)").eq("active", true),
        supabase.from("roommate_actions").select("target_user_id, action").eq("user_id", user.id),
      ]);

      const allProfiles = (profilesRes.data || []) as unknown as RoommateProfile[];
      const actions = actionsRes.data || [];

      const acted = new Set(actions.map((a: { target_user_id: string }) => a.target_user_id));
      setActedOn(acted);

      const mine = allProfiles.find((p) => p.user_id === user.id) || null;
      setMyProfile(mine);
      if (mine) {
        setFormSleep(mine.sleep_schedule);
        setFormClean(mine.cleanliness);
        setFormNoise(mine.noise);
        setFormGuests(mine.guests);
        setFormStudy(mine.study_habits);
        setFormBio(mine.bio);
        setFormBudgetMin(mine.budget_min);
        setFormBudgetMax(mine.budget_max);
        setFormMoveIn(mine.move_in);
        setFormBed(mine.bed_preference);
        setFormTags(mine.social_tags || []);
        setFormApt(mine.preferred_apartment_index);
        setFormActive(mine.active);
      }
      if (profile) {
        setFormMajor(profile.major || "");
        setFormYear(profile.class_year || "");
        setFormGender(profile.gender || "");
      }

      const others = allProfiles.filter((p) => p.user_id !== user.id && !acted.has(p.user_id));
      setProfiles(others);

      const myMatches = actions.filter((a: { action: string }) => a.action === "match").map((a: { target_user_id: string }) => a.target_user_id);
      if (myMatches.length > 0) {
        const { data: reciprocal } = await supabase
          .from("roommate_actions")
          .select("user_id")
          .eq("action", "match")
          .eq("target_user_id", user.id)
          .in("user_id", myMatches);
        const mutualIds = new Set((reciprocal || []).map((r: { user_id: string }) => r.user_id));
        setMatches(allProfiles.filter((p) => mutualIds.has(p.user_id)));
      } else {
        setMatches([]);
      }
    } catch {
      // silently handle
    }
    setLoading(false);
  }, [user, profile]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleAction = async (targetUserId: string, action: "match" | "pass") => {
    if (!user) return;
    try {
      await supabase.from("roommate_actions").insert({ user_id: user.id, target_user_id: targetUserId, action });
      setActedOn((prev) => new Set(prev).add(targetUserId));
      setProfiles((prev) => prev.filter((p) => p.user_id !== targetUserId));
      if (action === "match") {
        setToast("Interest sent! You'll be connected if they match back.");
        setTimeout(() => setToast(null), 3000);
      }
    } catch {
      // ignore
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    setSaveMsg(null);
    try {
      await supabase.from("profiles").update({
        major: formMajor || null,
        class_year: formYear || null,
        gender: formGender || null,
      }).eq("id", user.id);

      const profileData = {
        user_id: user.id,
        sleep_schedule: formSleep,
        cleanliness: formClean,
        noise: formNoise,
        guests: formGuests,
        study_habits: formStudy,
        bio: formBio,
        budget_min: formBudgetMin,
        budget_max: formBudgetMax,
        move_in: formMoveIn,
        bed_preference: formBed,
        social_tags: formTags,
        preferred_apartment_index: formApt,
        active: formActive,
        updated_at: new Date().toISOString(),
      };

      if (myProfile) {
        await supabase.from("roommate_profiles").update(profileData).eq("user_id", user.id);
      } else {
        await supabase.from("roommate_profiles").insert(profileData);
      }
      setSaveMsg("Profile saved!");
      setTimeout(() => setSaveMsg(null), 3000);
      await fetchData();
    } catch {
      setSaveMsg("Error saving. Try again.");
    }
    setSaving(false);
  };

  const displayed = useMemo(() => {
    if (filterApt === null) return profiles;
    return profiles.filter((p) => p.preferred_apartment_index === filterApt);
  }, [profiles, filterApt]);

  const tabs = [
    { id: "discover" as const, label: "Discover", icon: Search },
    { id: "matches" as const, label: "Matches", icon: Heart },
    { id: "profile" as const, label: "My Profile", icon: User },
  ];

  return (
    <div className="min-h-screen bg-cream pb-24 md:pb-0">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        {/* Header */}
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-ut-orange mb-2">Roommate Finder</p>
          <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            Find Your Roommate
          </h1>
          <p className="mt-2 text-smokey-gray">Match with compatible UT students. Contact matches via email.</p>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex justify-center">
          <div className="inline-flex rounded-xl border border-ink/5 bg-white p-1 shadow-sm">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer ${
                  tab === id ? "bg-ut-orange text-white" : "text-smokey-gray hover:text-ink"
                }`}
              >
                <Icon size={16} />
                {label}
                {id === "matches" && matches.length > 0 && (
                  <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-xs font-bold">
                    {matches.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Toast */}
        {toast && (
          <div className="mb-6 rounded-xl bg-success/10 border border-success/20 px-4 py-3 text-sm text-success font-medium text-center animate-fade-in">
            <CheckCircle2 size={16} className="inline mr-2" />
            {toast}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={28} className="animate-spin text-ut-orange" />
          </div>
        ) : (
          <>
            {/* DISCOVER TAB */}
            {tab === "discover" && (
              <>
                {!user ? (
                  <AuthPrompt text="Sign in to find roommates" onSignIn={() => setShowAuth(true)} />
                ) : !myProfile ? (
                  <div className="py-16 text-center">
                    <Users size={40} className="mx-auto mb-4 text-smokey-light" />
                    <p className="text-lg font-semibold text-ink">Create your profile first</p>
                    <p className="mt-1 text-sm text-smokey-gray">Set up your preferences so we can find compatible roommates.</p>
                    <button onClick={() => setTab("profile")} className="mt-4 rounded-xl bg-ut-orange px-6 py-3 text-sm font-semibold text-white hover:bg-ut-orange-light transition-colors cursor-pointer">
                      Create Profile
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Filter */}
                    <div className="mb-6 flex items-center gap-3">
                      <div className="relative flex-1 max-w-xs">
                        <select
                          value={filterApt ?? ""}
                          onChange={(e) => setFilterApt(e.target.value ? Number(e.target.value) : null)}
                          className="w-full appearance-none rounded-xl border border-ink/10 bg-white py-2.5 pl-3 pr-9 text-sm text-ink outline-none focus:border-ut-orange"
                        >
                          <option value="">All apartments</option>
                          {APARTMENTS.map((apt, i) => (
                            <option key={i} value={i}>{apt.name}</option>
                          ))}
                        </select>
                        <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-smokey-light" />
                      </div>
                      <p className="text-sm text-smokey-gray">{displayed.length} profiles</p>
                    </div>

                    {displayed.length === 0 ? (
                      <div className="py-16 text-center">
                        <Search size={40} className="mx-auto mb-4 text-smokey-light" />
                        <p className="text-lg font-semibold text-ink">No more profiles</p>
                        <p className="mt-1 text-sm text-smokey-gray">Check back later for new roommate profiles.</p>
                      </div>
                    ) : (
                      <div className="space-y-5">
                        {displayed.map((p, idx) => (
                          <ProfileCard
                            key={p.id}
                            profile={p}
                            compatibility={computeCompatibility(p, myProfile)}
                            colorIdx={idx}
                            onMatch={() => handleAction(p.user_id, "match")}
                            onPass={() => handleAction(p.user_id, "pass")}
                            showEmail={false}
                          />
                        ))}
                      </div>
                    )}
                  </>
                )}
              </>
            )}

            {/* MATCHES TAB */}
            {tab === "matches" && (
              <>
                {!user ? (
                  <AuthPrompt text="Sign in to see your matches" onSignIn={() => setShowAuth(true)} />
                ) : matches.length === 0 ? (
                  <div className="py-16 text-center">
                    <Heart size={40} className="mx-auto mb-4 text-smokey-light" />
                    <p className="text-lg font-semibold text-ink">No matches yet</p>
                    <p className="mt-1 text-sm text-smokey-gray">Keep discovering — when both of you match, you&apos;ll see each other here.</p>
                    <button onClick={() => setTab("discover")} className="mt-4 rounded-xl bg-ut-orange px-6 py-3 text-sm font-semibold text-white hover:bg-ut-orange-light transition-colors cursor-pointer">
                      Discover Roommates
                    </button>
                  </div>
                ) : (
                  <div className="space-y-5">
                    <p className="text-sm text-smokey-gray mb-2">You matched with {matches.length} {matches.length === 1 ? "person" : "people"}! Their email is shown so you can reach out.</p>
                    {matches.map((p, idx) => (
                      <ProfileCard
                        key={p.id}
                        profile={p}
                        compatibility={myProfile ? computeCompatibility(p, myProfile) : 50}
                        colorIdx={idx}
                        showEmail={true}
                      />
                    ))}
                  </div>
                )}
              </>
            )}

            {/* MY PROFILE TAB */}
            {tab === "profile" && (
              <>
                {!user ? (
                  <AuthPrompt text="Sign in to create your roommate profile" onSignIn={() => setShowAuth(true)} />
                ) : (
                  <div className="rounded-2xl border border-ink/5 bg-white p-6 shadow-sm">
                    <h2 className="text-xl font-bold text-ink mb-6" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                      {myProfile ? "Edit Your Profile" : "Create Your Profile"}
                    </h2>

                    <div className="space-y-6">
                      {/* Basic Info */}
                      <div>
                        <h3 className="text-sm font-semibold text-ink mb-3">About You</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <LabeledInput label="Major" value={formMajor} onChange={setFormMajor} placeholder="e.g. Business" />
                          <LabeledSelect label="Class Year" value={formYear} onChange={setFormYear} options={["Freshman", "Sophomore", "Junior", "Senior", "Grad"]} />
                          <LabeledSelect label="Gender" value={formGender} onChange={setFormGender} options={["Male", "Female", "Non-binary", "Prefer not to say"]} />
                        </div>
                      </div>

                      {/* Living Preferences */}
                      <div>
                        <h3 className="text-sm font-semibold text-ink mb-3">Living Preferences</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <LabeledSelect label="Sleep Schedule" value={formSleep} onChange={setFormSleep} options={SLEEP_OPTIONS} />
                          <LabeledSelect label="Guests" value={formGuests} onChange={setFormGuests} options={GUEST_OPTIONS} />
                          <LabeledSelect label="Study Habits" value={formStudy} onChange={setFormStudy} options={STUDY_OPTIONS} />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                          <RatingSelector label="Cleanliness" value={formClean} onChange={setFormClean} lowLabel="Relaxed" highLabel="Spotless" />
                          <RatingSelector label="Noise Level" value={formNoise} onChange={setFormNoise} lowLabel="Quiet" highLabel="Social" />
                        </div>
                      </div>

                      {/* Housing */}
                      <div>
                        <h3 className="text-sm font-semibold text-ink mb-3">Housing Preferences</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <LabeledSelect label="Bed Preference" value={formBed} onChange={setFormBed} options={BED_OPTIONS} />
                          <LabeledSelect label="Move-in" value={formMoveIn} onChange={setFormMoveIn} options={MOVE_OPTIONS} />
                          <div>
                            <label className="mb-1 block text-xs font-medium text-smokey-gray">Preferred Apartment</label>
                            <select
                              value={formApt ?? ""}
                              onChange={(e) => setFormApt(e.target.value ? Number(e.target.value) : null)}
                              className="w-full appearance-none rounded-xl border border-ink/10 bg-cream py-2.5 pl-3 pr-9 text-sm text-ink outline-none focus:border-ut-orange"
                            >
                              <option value="">No preference</option>
                              {APARTMENTS.map((apt, i) => (
                                <option key={i} value={i}>{apt.name}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 mt-3">
                          <LabeledInput label="Budget Min ($)" value={String(formBudgetMin)} onChange={(v) => setFormBudgetMin(Number(v) || 0)} type="number" />
                          <LabeledInput label="Budget Max ($)" value={String(formBudgetMax)} onChange={(v) => setFormBudgetMax(Number(v) || 0)} type="number" />
                        </div>
                      </div>

                      {/* Social Tags */}
                      <div>
                        <h3 className="text-sm font-semibold text-ink mb-3">Social / Lifestyle</h3>
                        <div className="flex flex-wrap gap-2">
                          {SOCIAL_TAG_OPTIONS.map((tag) => {
                            const selected = formTags.includes(tag);
                            return (
                              <button
                                key={tag}
                                onClick={() => setFormTags((prev) => selected ? prev.filter((t) => t !== tag) : [...prev, tag])}
                                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                                  selected ? "border-ut-orange bg-ut-orange/10 text-ut-orange" : "border-ink/10 text-smokey-gray hover:border-ut-orange"
                                }`}
                              >
                                {tag}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Bio */}
                      <div>
                        <label className="mb-1 block text-xs font-medium text-smokey-gray">Bio</label>
                        <textarea
                          value={formBio}
                          onChange={(e) => setFormBio(e.target.value)}
                          placeholder="Tell potential roommates a bit about yourself..."
                          rows={3}
                          className="w-full rounded-xl border border-ink/10 bg-cream px-4 py-3 text-sm text-ink placeholder:text-smokey-light outline-none focus:border-ut-orange resize-none"
                        />
                      </div>

                      {/* Active toggle */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setFormActive(!formActive)}
                          className={`relative h-6 w-11 rounded-full transition-colors cursor-pointer ${formActive ? "bg-ut-orange" : "bg-ink/20"}`}
                        >
                          <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${formActive ? "translate-x-5" : ""}`} />
                        </button>
                        <span className="text-sm text-ink">Profile visible to others</span>
                      </div>

                      {/* Save */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={handleSaveProfile}
                          disabled={saving}
                          className="flex items-center gap-2 rounded-xl bg-ut-orange px-6 py-3 text-sm font-semibold text-white hover:bg-ut-orange-light disabled:opacity-50 transition-colors cursor-pointer"
                        >
                          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                          Save Profile
                        </button>
                        {saveMsg && (
                          <span className={`text-sm font-medium ${saveMsg.includes("Error") ? "text-red-500" : "text-success"}`}>
                            {saveMsg}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>

      {showAuth && <AuthModal onClose={() => { setShowAuth(false); fetchData(); }} />}
    </div>
  );
}

/* ─── Subcomponents ──────────────────────────────────────── */

function AuthPrompt({ text, onSignIn }: { text: string; onSignIn: () => void }) {
  return (
    <div className="py-16 text-center">
      <User size={40} className="mx-auto mb-4 text-smokey-light" />
      <p className="text-lg font-semibold text-ink">{text}</p>
      <p className="mt-1 text-sm text-smokey-gray">Create a free account to get started.</p>
      <button onClick={onSignIn} className="mt-4 rounded-xl bg-ut-orange px-6 py-3 text-sm font-semibold text-white hover:bg-ut-orange-light transition-colors cursor-pointer">
        Sign In / Sign Up
      </button>
    </div>
  );
}

function ProfileCard({
  profile: p, compatibility, colorIdx, onMatch, onPass, showEmail,
}: {
  profile: RoommateProfile;
  compatibility: number;
  colorIdx: number;
  onMatch?: () => void;
  onPass?: () => void;
  showEmail: boolean;
}) {
  const color = AVATAR_COLORS[colorIdx % AVATAR_COLORS.length];
  const initials = getInitials(p.profile.first_name, p.profile.last_name);
  const aptName = p.preferred_apartment_index !== null ? APARTMENTS[p.preferred_apartment_index]?.name : null;

  return (
    <div className="rounded-2xl border border-ink/5 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-4">
        <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${color} text-white text-lg font-bold`}>
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-lg font-bold text-ink truncate">
              {p.profile.first_name} {p.profile.last_name?.[0]}.
            </h3>
            <span className="shrink-0 rounded-full bg-success/10 px-2.5 py-1 text-xs font-bold text-success">
              {compatibility}%
            </span>
          </div>
          <p className="text-sm text-smokey-gray">
            {p.profile.major || "Undeclared"} · {p.profile.class_year || "Student"}{p.profile.gender ? ` · ${p.profile.gender}` : ""}
          </p>

          {/* Preferences */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            <Tag icon={<Moon size={12} />} label={p.sleep_schedule} />
            <Tag icon={<Brush size={12} />} label={`${p.cleanliness}/5`} />
            <Tag icon={p.noise >= 3 ? <Volume2 size={12} /> : <VolumeX size={12} />} label={`${p.noise}/5`} />
            <Tag icon={<Users size={12} />} label={p.guests} />
            <Tag icon={<BookOpen size={12} />} label={p.study_habits} />
          </div>

          {/* Details */}
          <div className="mt-3 flex flex-wrap gap-3 text-xs text-smokey-gray">
            <span className="flex items-center gap-1"><HomeIcon size={12} />{p.bed_preference}</span>
            <span className="flex items-center gap-1"><DollarSign size={12} />${p.budget_min}–${p.budget_max}/mo</span>
            <span className="flex items-center gap-1"><Calendar size={12} />{p.move_in}</span>
          </div>

          {aptName && (
            <p className="mt-2 text-xs text-ut-orange font-medium">Preferred: {aptName}</p>
          )}

          {p.bio && (
            <p className="mt-2 text-sm text-smokey-gray leading-relaxed">{p.bio}</p>
          )}

          {p.social_tags?.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {p.social_tags.map((tag) => (
                <span key={tag} className="rounded-full bg-cream px-2 py-0.5 text-[11px] font-medium text-smokey-gray">{tag}</span>
              ))}
            </div>
          )}

          {showEmail && (
            <a
              href={`mailto:${p.profile.email}`}
              className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-ut-orange/10 px-3 py-2 text-sm font-medium text-ut-orange hover:bg-ut-orange/20 transition-colors"
            >
              <Mail size={14} />
              {p.profile.email}
            </a>
          )}
        </div>
      </div>

      {(onMatch || onPass) && (
        <div className="mt-4 flex gap-3 border-t border-ink/5 pt-4">
          {onPass && (
            <button onClick={onPass} className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-ink/10 py-2.5 text-sm font-medium text-smokey-gray hover:border-ink/20 transition-colors cursor-pointer">
              <X size={16} />
              Pass
            </button>
          )}
          {onMatch && (
            <button onClick={onMatch} className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-ut-orange py-2.5 text-sm font-semibold text-white hover:bg-ut-orange-light transition-colors cursor-pointer">
              <Heart size={16} />
              Match
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function Tag({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-cream px-2.5 py-1 text-xs font-medium text-smokey-gray">
      {icon}
      {label}
    </span>
  );
}

function LabeledInput({ label, value, onChange, placeholder, type = "text" }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-smokey-gray">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-ink/10 bg-cream px-3 py-2.5 text-sm text-ink placeholder:text-smokey-light outline-none focus:border-ut-orange transition-colors"
      />
    </div>
  );
}

function LabeledSelect({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void; options: string[];
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-smokey-gray">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-xl border border-ink/10 bg-cream py-2.5 pl-3 pr-8 text-sm text-ink outline-none focus:border-ut-orange"
      >
        <option value="">Select...</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}

function RatingSelector({ label, value, onChange, lowLabel, highLabel }: {
  label: string; value: number; onChange: (v: number) => void; lowLabel: string; highLabel: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-smokey-gray">{label}</label>
      <div className="flex items-center gap-2">
        <span className="text-[11px] text-smokey-light w-12">{lowLabel}</span>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => onChange(n)}
              className={`h-9 w-9 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                n === value ? "bg-ut-orange text-white" : "bg-cream border border-ink/10 text-smokey-gray hover:border-ut-orange"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
        <span className="text-[11px] text-smokey-light w-12 text-right">{highLabel}</span>
      </div>
    </div>
  );
}
