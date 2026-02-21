import Link from 'next/link';
import { Sparkles, Users, ShieldCheck, ArrowRight } from 'lucide-react';

const features = [
  {
    icon: Sparkles,
    title: 'Smart Match',
    description:
      'Answer 5 quick questions and get matched with your top apartments.',
  },
  {
    icon: Users,
    title: 'Roommate Finder',
    description:
      'Find compatible roommates with our Tinder-style matching.',
  },
  {
    icon: ShieldCheck,
    title: 'Verified Reviews',
    description:
      'Read honest reviews from verified UT student tenants.',
  },
];

const stats = [
  { value: '21', label: 'Apartments' },
  { value: 'Near UT', label: 'Campus' },
  { value: 'Fall 2026', label: 'Updated' },
];

export default function Home() {
  return (
    <main className="pb-24 md:pb-0">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        {/* Decorative accent */}
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-[#FF8200]/10 blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-56 h-56 rounded-full bg-[#FF8200]/5 blur-2xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />

        <div className="relative max-w-3xl mx-auto px-6 pt-20 pb-20 md:pt-28 md:pb-28 text-center">
          <p className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-[#FF8200] mb-6 border border-[#FF8200]/30 rounded-full px-4 py-1.5">
            UT Knoxville Housing
          </p>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight text-[#1A1A1A]">
            Find Your Perfect{' '}
            <span className="text-[#FF8200]">Student Apartment</span>
          </h1>

          <p className="mt-6 text-lg md:text-xl text-[#4B4B4B] max-w-xl mx-auto leading-relaxed">
            SmartLease matches you with the best UT Knoxville apartments based
            on your preferences, budget, and lifestyle.
          </p>

          <div className="mt-10 flex flex-col items-center gap-3">
            <Link
              href="/quiz"
              className="inline-flex items-center gap-2 bg-[#FF8200] hover:bg-[#e67400] text-white text-sm font-semibold tracking-[0.12em] uppercase px-8 py-4 rounded-full transition-all duration-200 shadow-lg shadow-[#FF8200]/25 hover:shadow-xl hover:shadow-[#FF8200]/30 hover:-translate-y-0.5"
            >
              Take the Quiz
              <ArrowRight size={16} strokeWidth={2.5} />
            </Link>
            <p className="text-xs text-[#6B6B6B] tracking-wide">
              Takes 30 seconds. No account needed.
            </p>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="bg-white">
        <div className="max-w-5xl mx-auto px-6 py-20 md:py-28">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#FF8200] text-center mb-3">
            How It Works
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#1A1A1A] text-center mb-14">
            Everything you need, one place
          </h2>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="group rounded-2xl border border-[#1A1A1A]/6 bg-[#FAF8F5] p-8 transition-all duration-200 hover:border-[#FF8200]/30 hover:shadow-lg hover:shadow-[#FF8200]/5"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#FF8200]/10 flex items-center justify-center mb-5 group-hover:bg-[#FF8200]/15 transition-colors duration-200">
                    <Icon size={24} className="text-[#FF8200]" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#1A1A1A] mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[#4B4B4B]">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section>
        <div className="max-w-3xl mx-auto px-6 py-16 md:py-20">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-0 sm:divide-x sm:divide-[#1A1A1A]/10">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="text-center sm:px-12"
              >
                <p className="font-serif text-3xl md:text-4xl font-bold text-[#1A1A1A]">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-[#4B4B4B] tracking-wide">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="bg-[#1A1A1A]">
        <div className="max-w-3xl mx-auto px-6 py-20 md:py-24 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to find your home?
          </h2>
          <p className="text-[#A0A0A0] mb-10 max-w-md mx-auto">
            Take a quick quiz and we&apos;ll match you with the best apartments
            near campus.
          </p>
          <Link
            href="/quiz"
            className="inline-flex items-center gap-2 bg-[#FF8200] hover:bg-[#e67400] text-white text-sm font-semibold tracking-[0.12em] uppercase px-8 py-4 rounded-full transition-all duration-200 hover:-translate-y-0.5"
          >
            Start Quiz
            <ArrowRight size={16} strokeWidth={2.5} />
          </Link>
        </div>
      </section>
    </main>
  );
}
