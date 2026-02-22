"use client";

import { useState, useCallback } from "react";
import {
  FileText,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Clipboard,
  Trash2,
} from "lucide-react";

interface LeaseClause {
  id: string;
  category: string;
  label: string;
  severity: "red" | "yellow" | "green";
  pattern: RegExp;
  extract: RegExp | null;
  advice: string;
}

interface Finding extends LeaseClause {
  extracted: string | null;
  snippet: string | null;
}

const LEASE_CLAUSES: LeaseClause[] = [
  // Financial
  { id: "deposit", category: "Financial", label: "Security Deposit", severity: "yellow",
    pattern: /secur(?:ity)?\s*deposit|damage\s*deposit/i,
    extract: /\$[\d,]+(?:\.\d{2})?/,
    advice: "Review the exact amount, conditions for deductions, and the timeline for return after move-out (Tennessee law requires return within 30 days)." },
  { id: "late-fee", category: "Financial", label: "Late Fee", severity: "red",
    pattern: /late\s*(?:fee|charge|penalty)|(?:fee|charge|penalty)\s*(?:for|if)\s*(?:late|overdue)/i,
    extract: /\$[\d,]+(?:\.\d{2})?/,
    advice: "Check the grace period (how many days after the due date), the fee amount, and whether it compounds. Tennessee caps late fees at 10% of monthly rent." },
  { id: "rent-increase", category: "Financial", label: "Rent Increase", severity: "yellow",
    pattern: /rent\s*(?:increase|adjustment|escalat)|(?:increase|rais|adjust)\s*(?:the\s*)?rent/i,
    extract: /(\d+)\s*%|\$[\d,]+/,
    advice: "Check if there is a cap on annual rent increases and how much notice is required before an increase takes effect." },
  { id: "app-fee", category: "Financial", label: "Application Fee", severity: "green",
    pattern: /application\s*fee|processing\s*fee|admin(?:istration|istrative)?\s*fee/i,
    extract: /\$[\d,]+(?:\.\d{2})?/,
    advice: "Application fees are typically non-refundable. Confirm the amount and whether it is per person or per unit." },
  { id: "moveout-charges", category: "Financial", label: "Move-Out Charges", severity: "yellow",
    pattern: /move[\s-]*out\s*(?:fee|charge|cost|inspection)|cleaning\s*fee|carpet\s*(?:cleaning|replacement)/i,
    extract: /\$[\d,]+(?:\.\d{2})?/,
    advice: "Review what cleaning or restoration charges apply at move-out. Document the unit condition at move-in with photos." },
  { id: "utilities", category: "Financial", label: "Utility Responsibility", severity: "green",
    pattern: /utilit(?:y|ies)|electric(?:ity)?|water|gas|sewer|trash|internet|cable/i,
    extract: null,
    advice: "Clarify exactly which utilities are included in rent vs. tenant-paid. Ask for average monthly utility costs from the landlord." },

  // Lease Terms
  { id: "auto-renew", category: "Lease Terms", label: "Auto-Renewal", severity: "red",
    pattern: /auto(?:matic(?:ally)?)?[\s-]*renew|(?:shall|will)\s*(?:automatically\s*)?renew|month[\s-]*to[\s-]*month\s*(?:after|upon|at)/i,
    extract: /(\d+)\s*(?:day|month|week)s?\s*(?:prior|before|notice|written)/i,
    advice: "This lease may auto-renew if you don't give notice. Mark the notice deadline on your calendar. Missing it could lock you into another term." },
  { id: "early-term", category: "Lease Terms", label: "Early Termination Penalty", severity: "red",
    pattern: /early\s*terminat|break(?:ing)?\s*(?:the\s*)?lease|(?:terminat|cancel)\s*(?:before|prior|early)|buyout/i,
    extract: /\$[\d,]+(?:\.\d{2})?|(\d+)\s*month/,
    advice: "Understand the exact penalty (often 2 months rent or a flat fee). Check if there are exceptions for military deployment, domestic violence, or health emergencies." },
  { id: "lease-duration", category: "Lease Terms", label: "Lease Duration", severity: "green",
    pattern: /(?:term|duration|period)\s*(?:of|is|shall\s*be)\s*(?:the\s*|this\s*)?(?:lease|agreement)|(\d+)\s*(?:month|year)\s*(?:lease|term|agreement)/i,
    extract: /(\d+)\s*(?:month|year)/i,
    advice: "Confirm the exact start and end dates. A 12-month lease is standard; shorter terms often carry a premium." },
  { id: "move-dates", category: "Lease Terms", label: "Move-In / Move-Out Dates", severity: "green",
    pattern: /move[\s-]*in\s*date|move[\s-]*out\s*date|commenc(?:e|ing)|(?:lease|tenancy)\s*(?:begins?|starts?|ends?)/i,
    extract: /(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\s*\d{1,2}(?:[,\s]+\d{4})?|\d{1,2}\/\d{1,2}\/\d{2,4}/i,
    advice: "Confirm exact dates and whether partial-month prorating applies. Know exactly when you must vacate to avoid holdover charges." },

  // Restrictions
  { id: "sublease", category: "Restrictions", label: "Sublease / Sublet Policy", severity: "yellow",
    pattern: /subleas|sublet|assign(?:ment)?\s*(?:of|the)?\s*(?:lease|agreement)/i,
    extract: null,
    advice: "Many leases prohibit or restrict subletting. If you might need to sublease, verify whether landlord approval is required and any associated fees." },
  { id: "pet-policy", category: "Restrictions", label: "Pet Policy", severity: "yellow",
    pattern: /pet(?:s)?\s*(?:policy|fee|deposit|allow|prohibit|restrict)|(?:no|breed)\s*(?:pet|animal|dog|cat)|animal\s*(?:policy|fee|deposit)/i,
    extract: /\$[\d,]+(?:\.\d{2})?|(\d+)\s*(?:lb|pound)/,
    advice: "Review breed/weight restrictions, monthly pet rent, one-time pet deposit, and whether the deposit is refundable. Check if emotional support animals are addressed." },
  { id: "guest-policy", category: "Restrictions", label: "Guest Policy", severity: "yellow",
    pattern: /guest(?:s)?\s*(?:policy|limit|restrict|overnight|stay)|(?:overnight|extended)\s*(?:guest|visitor)/i,
    extract: /(\d+)\s*(?:day|night|consecutive)/,
    advice: "Check how long guests can stay before they must be added to the lease. Exceeding limits could be considered a lease violation." },
  { id: "noise-quiet", category: "Restrictions", label: "Noise / Quiet Hours", severity: "green",
    pattern: /quiet\s*hours?|noise\s*(?:policy|restrict|level|complain)|(?:disturb|nuisance)\s*(?:other|neighbor)/i,
    extract: /(\d{1,2}(?::\d{2})?\s*(?:am|pm|a\.m\.|p\.m\.))/i,
    advice: "Know the designated quiet hours and consequences for violations. This protects you as much as your neighbors." },
  { id: "parking", category: "Restrictions", label: "Parking Rules", severity: "green",
    pattern: /parking\s*(?:space|spot|assign|fee|permit|garage|lot|is|availab|includ)|(?:vehicle|car)\s*(?:parking|registr)/i,
    extract: /\$[\d,]+(?:\.\d{2})?/,
    advice: "Confirm whether parking is included, the monthly fee if not, and any vehicle registration or towing policies." },
  { id: "modifications", category: "Restrictions", label: "Modification Restrictions", severity: "green",
    pattern: /modif(?:y|ication)|alter(?:ation)?|(?:paint|nail|hole|hang|mount)\s*(?:wall|ceiling)|(?:no|without\s*(?:prior|written))\s*(?:modif|alter)/i,
    extract: null,
    advice: "Most leases restrict wall mounting, painting, or structural changes. Clarify what is allowed and whether you must restore the unit at move-out." },

  // Tenant Rights
  { id: "maintenance", category: "Tenant Rights", label: "Maintenance & Repairs", severity: "yellow",
    pattern: /maintenan|repair(?:s)?|(?:landlord|owner|management)\s*(?:shall|will|must)\s*(?:repair|maintain|fix)|work\s*order/i,
    extract: /(\d+)\s*(?:day|hour|business)/,
    advice: "Confirm the landlord's timeline for repairs, especially for emergencies (e.g., no heat, plumbing failure). Document all requests in writing." },
  { id: "entry-notice", category: "Tenant Rights", label: "Entry Notice Requirements", severity: "yellow",
    pattern: /(?:right\s*(?:of|to)\s*)?entry|(?:enter|access)\s*(?:the\s*)?(?:premises|unit|apartment)|(\d+)\s*(?:hour|day)s?\s*(?:notice|prior|advance|before\s*enter)/i,
    extract: /(\d+)\s*(?:hour|day)/,
    advice: "Tennessee requires 24-hour notice before non-emergency entry. Verify this is stated in your lease and know your right to refuse unreasonable entry." },
  { id: "renters-insurance", category: "Tenant Rights", label: "Renter's Insurance", severity: "green",
    pattern: /renter(?:'?s)?\s*insurance|liabilit(?:y)?\s*insurance|(?:require|must\s*(?:have|obtain|carry))\s*(?:renter|insurance)/i,
    extract: /\$[\d,]+(?:\.\d{2})?/,
    advice: "Many complexes require renter's insurance (typically $15-30/mo). Check the minimum liability coverage required and whether the landlord must be listed as an interested party." },
  { id: "mold-habitability", category: "Tenant Rights", label: "Mold / Habitability", severity: "yellow",
    pattern: /mold|mildew|habitab|uninhabitab|health\s*hazard|lead\s*(?:paint|based)/i,
    extract: null,
    advice: "Landlords must maintain habitable conditions. If the lease includes mold disclaimers, understand your rights to remediation and rent abatement." },

  // Red Flags
  { id: "jury-waiver", category: "Red Flags", label: "Waiver of Jury Trial", severity: "red",
    pattern: /waiv(?:e|er|es|ing)\s*(?:of\s*)?(?:right\s*(?:to\s*)?)?(?:jury|trial)|jury\s*trial\s*waiv/i,
    extract: null,
    advice: "This clause removes your right to a jury trial in disputes. This is a significant legal concession — consider whether you are comfortable with it." },
  { id: "arbitration", category: "Red Flags", label: "Binding Arbitration", severity: "red",
    pattern: /(?:binding|mandatory|compulsory)\s*arbitration|(?:agree|consent)\s*(?:to\s*)?arbitrat|arbitration\s*(?:clause|agreement|provision)/i,
    extract: null,
    advice: "Binding arbitration means disputes go to a private arbitrator instead of court. This can limit your legal options and is often more favorable to the landlord." },
  { id: "liability-waiver", category: "Red Flags", label: "Broad Liability Waiver", severity: "red",
    pattern: /(?:waiv|releas|hold\s*harmless|indemnif)(?:\s+\w+){0,4}\s*(?:landlord|owner|management|company)\s*(?:from|against|for)\s*(?:any\s*(?:and\s*)?all|any|all)\s*(?:liabilit|claim|damage|loss)/i,
    extract: null,
    advice: "A broad liability waiver may release the landlord from responsibility for injuries or property damage, even from their own negligence. Review carefully." },
  { id: "penalty-amount", category: "Red Flags", label: "Excessive Penalty Amounts", severity: "red",
    pattern: /(?:penalty|fee|charge|fine)\s*(?:of|:)?\s*\$\s*(?:[2-9],\d{3}|\d{2,},\d{3})/i,
    extract: /\$[\d,]+(?:\.\d{2})?/,
    advice: "Penalties exceeding several thousand dollars may be considered unreasonable and unenforceable. Compare this to typical lease penalties in your area." },
];

const SEV_CONFIG = {
  red:    { color: "text-red-600", bg: "bg-red-50", border: "border-red-200", badge: "bg-red-100 text-red-700", label: "Concern", icon: AlertTriangle },
  yellow: { color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200", badge: "bg-amber-100 text-amber-700", label: "Review", icon: AlertCircle },
  green:  { color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200", badge: "bg-emerald-100 text-emerald-700", label: "Standard", icon: CheckCircle2 },
};

export default function LeaseHelpPage() {
  const [leaseText, setLeaseText] = useState("");
  const [findings, setFindings] = useState<Finding[] | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [wordCount, setWordCount] = useState(0);

  const analyze = useCallback(() => {
    const text = leaseText.trim();
    if (!text) return;

    setAnalyzing(true);
    setFindings(null);

    setTimeout(() => {
      const wc = text.split(/\s+/).length;
      setWordCount(wc);

      const found: Finding[] = [];
      LEASE_CLAUSES.forEach((clause) => {
        const pm = text.match(clause.pattern);
        if (pm) {
          const matchStart = pm.index || 0;
          const forward = text.substring(matchStart, Math.min(text.length, matchStart + pm[0].length + 100));
          let extracted: string | null = null;
          if (clause.extract) {
            const m = forward.match(clause.extract);
            if (m) extracted = m[0];
          }
          const start = Math.max(0, matchStart - 40);
          const end = Math.min(text.length, matchStart + pm[0].length + 60);
          const snippet = (start > 0 ? "..." : "") + text.substring(start, end).replace(/\n/g, " ").trim() + (end < text.length ? "..." : "");
          found.push({ ...clause, extracted, snippet });
        }
      });

      const reds = found.filter((f) => f.severity === "red");
      const yellows = found.filter((f) => f.severity === "yellow");
      const greens = found.filter((f) => f.severity === "green");
      setFindings([...reds, ...yellows, ...greens]);
      setAnalyzing(false);
    }, 1200);
  }, [leaseText]);

  const reds = findings?.filter((f) => f.severity === "red").length ?? 0;
  const yellows = findings?.filter((f) => f.severity === "yellow").length ?? 0;
  const greens = findings?.filter((f) => f.severity === "green").length ?? 0;

  return (
    <div className="min-h-screen bg-cream pb-24 md:pb-0">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        {/* Header */}
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-ut-orange mb-2">
            Lease Assistance
          </p>
          <h1
            className="text-3xl font-bold tracking-tight text-ink sm:text-4xl"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Lease Help
          </h1>
          <p className="mt-2 text-smokey-gray">
            Paste your lease and we&apos;ll break it down for you.
          </p>
        </div>

        {/* Steps */}
        <div className="mb-8 rounded-2xl border border-ink/5 bg-white overflow-hidden shadow-sm">
          {[
            { num: 1, title: "Read your lease carefully", desc: "We'll highlight key clauses — deposits, subletting, break fees.", active: true },
            { num: 2, title: "Upload or paste your lease", desc: "Our scanner reviews it and explains in plain English.", active: true },
            { num: 3, title: "Get questions answered", desc: "Use the analysis to know what to ask your landlord.", active: false },
          ].map((step, i) => (
            <div
              key={step.num}
              className={`flex items-center gap-4 px-5 py-4 ${i < 2 ? "border-b border-ink/5" : ""} ${i === 1 ? "bg-ut-orange/[0.03]" : ""}`}
            >
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                  step.active
                    ? "bg-ut-orange text-white"
                    : "border-2 border-ink/20 text-smokey-gray"
                }`}
              >
                {step.num}
              </div>
              <div>
                <p className={`font-semibold text-sm ${step.active ? "text-ink" : "text-smokey-gray"}`}>
                  {step.title}
                </p>
                <p className={`text-xs ${step.active ? "text-smokey-gray" : "text-smokey-light"}`}>
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold tracking-[0.1em] uppercase text-smokey-gray">
              Paste your lease text below
            </p>
            {leaseText && (
              <button
                onClick={() => { setLeaseText(""); setFindings(null); }}
                className="flex items-center gap-1 text-xs text-smokey-light hover:text-red-500 transition-colors cursor-pointer"
              >
                <Trash2 size={12} />
                Clear
              </button>
            )}
          </div>
          <textarea
            value={leaseText}
            onChange={(e) => setLeaseText(e.target.value)}
            placeholder="Paste your lease agreement text here..."
            rows={7}
            className="w-full rounded-2xl border border-ink/10 bg-white px-5 py-4 text-sm text-ink leading-relaxed placeholder:text-smokey-light outline-none focus:border-ut-orange transition-colors resize-y"
          />
          <div className="flex items-center gap-3 mt-3">
            <button
              onClick={analyze}
              disabled={!leaseText.trim() || analyzing}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-ut-orange px-6 py-3.5 text-sm font-semibold text-white hover:bg-ut-orange-light disabled:opacity-50 transition-colors cursor-pointer"
            >
              {analyzing ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Scanning your lease...
                </>
              ) : (
                <>
                  <FileText size={16} />
                  Analyze Lease
                </>
              )}
            </button>
            <button
              onClick={async () => {
                const clip = await navigator.clipboard.readText();
                if (clip) setLeaseText(clip);
              }}
              className="flex items-center gap-1.5 rounded-xl border border-ink/10 px-4 py-3.5 text-sm font-medium text-smokey-gray hover:border-ut-orange hover:text-ut-orange transition-colors cursor-pointer"
            >
              <Clipboard size={16} />
              Paste
            </button>
          </div>
        </div>

        {/* Results */}
        {findings && (
          <div className="rounded-2xl border border-ink/5 bg-white shadow-sm overflow-hidden animate-fade-in">
            {/* Report header */}
            <div className="px-5 py-4 bg-ut-orange/[0.06] border-b border-ink/5">
              <p className="text-xs font-semibold tracking-[0.1em] uppercase text-ut-orange mb-1">
                Lease Analysis Report
              </p>
              <p className="text-sm text-smokey-gray">
                Scanned <span className="font-semibold text-ink">{wordCount.toLocaleString()} words</span> · Found <span className="font-semibold text-ink">{findings.length} clause{findings.length !== 1 ? "s" : ""}</span>
              </p>
            </div>

            {/* Summary counters */}
            <div className="grid grid-cols-3 border-b border-ink/5">
              <div className="px-4 py-3 text-center border-r border-ink/5">
                <p className="text-2xl font-bold text-red-600">{reds}</p>
                <p className="text-[10px] uppercase tracking-wider text-smokey-light">Concerns</p>
              </div>
              <div className="px-4 py-3 text-center border-r border-ink/5">
                <p className="text-2xl font-bold text-amber-600">{yellows}</p>
                <p className="text-[10px] uppercase tracking-wider text-smokey-light">To Review</p>
              </div>
              <div className="px-4 py-3 text-center">
                <p className="text-2xl font-bold text-emerald-600">{greens}</p>
                <p className="text-[10px] uppercase tracking-wider text-smokey-light">Standard</p>
              </div>
            </div>

            {/* Findings list */}
            <div className="p-5 space-y-4">
              {findings.length === 0 ? (
                <div className="py-6 text-center">
                  <p className="text-sm text-smokey-gray mb-1">No specific clauses detected.</p>
                  <p className="text-xs text-smokey-light leading-relaxed">
                    This could mean the text is too short or doesn&apos;t contain standard lease language. Try pasting the full lease agreement.
                  </p>
                </div>
              ) : (
                findings.map((f) => {
                  const cfg = SEV_CONFIG[f.severity];
                  const Icon = cfg.icon;
                  return (
                    <div key={f.id} className={`rounded-xl border ${cfg.border} overflow-hidden`}>
                      <div className={`flex items-center justify-between px-4 py-3 ${cfg.bg}`}>
                        <div className="flex items-center gap-2">
                          <Icon size={14} className={cfg.color} />
                          <p className="text-sm font-semibold text-ink">{f.label}</p>
                        </div>
                        <span className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full ${cfg.badge}`}>
                          {cfg.label}
                        </span>
                      </div>
                      <div className="px-4 py-3 space-y-2">
                        {f.extracted && (
                          <p className="text-xs text-smokey-gray">
                            Detected value: <span className="font-semibold text-ink">{f.extracted}</span>
                          </p>
                        )}
                        {f.snippet && (
                          <div className={`border-l-[3px] ${f.severity === "red" ? "border-red-400" : f.severity === "yellow" ? "border-amber-400" : "border-emerald-400"} bg-cream/60 px-3.5 py-2.5 rounded-r-lg`}>
                            <p className="text-[11px] text-smokey-gray italic leading-relaxed">
                              &ldquo;{f.snippet}&rdquo;
                            </p>
                          </div>
                        )}
                        <p className="text-xs text-smokey-gray leading-relaxed">{f.advice}</p>
                      </div>
                    </div>
                  );
                })
              )}

              <p className="text-[11px] text-smokey-light italic leading-relaxed pt-2">
                This analysis uses pattern detection and is not legal advice. For binding interpretations, consult a licensed attorney.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
