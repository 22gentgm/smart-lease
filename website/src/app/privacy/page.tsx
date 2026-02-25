import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — SmartLease",
  description: "How SmartLease collects, uses, and protects your information.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-cream pb-24 md:pb-0">
      <div className="mx-auto max-w-3xl px-6 py-12 md:py-20">
        <h1
          className="text-3xl font-bold text-ink md:text-4xl mb-2"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Privacy Policy
        </h1>
        <p className="text-sm text-smokey-light mb-10">Last updated: February 2026</p>

        <div className="prose-sm space-y-8 text-smokey-gray leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-ink mb-2">1. Information We Collect</h2>
            <p>SmartLease collects only the information you voluntarily provide:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong>Account information:</strong> Email address, first and last name when you sign up for roommate matching or sublease posting.</li>
              <li><strong>Roommate profile:</strong> Living preferences, budget range, lifestyle tags, and bio text you choose to share.</li>
              <li><strong>Application requests:</strong> Name, email, phone number, and apartment preference when you request an application.</li>
              <li><strong>Reviews:</strong> Name, class year, and review text you submit.</li>
              <li><strong>Usage data:</strong> Anonymous page views and interactions collected by Vercel Analytics (no cookies, no personal tracking).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-ink mb-2">2. How We Use Your Information</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Match you with compatible roommates based on your preferences.</li>
              <li>Display your reviews and sublease listings to other users.</li>
              <li>Forward application requests to relevant apartment communities.</li>
              <li>Improve the SmartLease platform and user experience.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-ink mb-2">3. Information Sharing</h2>
            <p>We do not sell your personal information. Your data is shared only in these cases:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong>Roommate matches:</strong> Your email is shown only to mutual matches (both parties must match each other).</li>
              <li><strong>Reviews and subleases:</strong> Your submitted name and content are publicly visible on the platform.</li>
              <li><strong>Application requests:</strong> Your contact info is shared with the apartment you selected via Google Sheets.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-ink mb-2">4. Data Storage &amp; Security</h2>
            <p>Your data is stored securely on Supabase (PostgreSQL) with row-level security policies. Application request data is stored in Google Sheets. We use HTTPS encryption for all data in transit.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-ink mb-2">5. Your Rights</h2>
            <p>You can:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Delete your account and roommate profile at any time.</li>
              <li>Deactivate your sublease listings.</li>
              <li>Request deletion of your data by contacting us.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-ink mb-2">6. Cookies</h2>
            <p>SmartLease does not use tracking cookies. We use browser localStorage to save your favorites and quiz preferences locally on your device. Vercel Analytics is cookie-free and privacy-friendly.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-ink mb-2">7. Contact</h2>
            <p>Questions about this policy? Email us at <a href="mailto:smartlease.utk@gmail.com" className="text-ut-orange hover:underline">smartlease.utk@gmail.com</a></p>
          </section>
        </div>
      </div>
    </div>
  );
}
