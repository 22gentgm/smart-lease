import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — SmartLease",
  description: "Terms and conditions for using the SmartLease platform.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-cream pb-24 md:pb-0">
      <div className="mx-auto max-w-3xl px-6 py-12 md:py-20">
        <h1
          className="text-3xl font-bold text-ink md:text-4xl mb-2"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Terms of Service
        </h1>
        <p className="text-sm text-smokey-light mb-10">Last updated: February 2026</p>

        <div className="prose-sm space-y-8 text-smokey-gray leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-ink mb-2">1. About SmartLease</h2>
            <p>SmartLease is a free platform that helps University of Tennessee Knoxville students compare off-campus apartments, find roommates, post subleases, and analyze lease agreements. SmartLease is not affiliated with the University of Tennessee or any apartment community listed on the platform.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-ink mb-2">2. No Guarantee of Accuracy</h2>
            <p>Apartment pricing, availability, amenities, specials, and distances are provided for informational purposes and may not be current. Always verify details directly with the apartment community before signing a lease. SmartLease is not responsible for inaccurate or outdated listing information.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-ink mb-2">3. User-Submitted Content</h2>
            <p>Reviews, sublease listings, and roommate profiles are submitted by users. SmartLease does not verify the accuracy or authenticity of user-submitted content. By submitting content, you:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Confirm it is truthful and not misleading.</li>
              <li>Grant SmartLease a non-exclusive license to display it on the platform.</li>
              <li>Agree not to post spam, harassment, or inappropriate content.</li>
            </ul>
            <p className="mt-2">SmartLease reserves the right to remove any content at its discretion.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-ink mb-2">4. Roommate Matching</h2>
            <p>SmartLease provides compatibility scores and matching tools to help you find potential roommates. These are suggestions only. SmartLease does not conduct background checks, verify identities, or guarantee compatibility. Always exercise caution when meeting someone new and communicating personal information.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-ink mb-2">5. Lease Help Tool</h2>
            <p>The Lease Help tool scans lease text for common clauses using pattern matching. It is not legal advice. Always consult a qualified attorney or your university&apos;s legal clinic before signing a lease.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-ink mb-2">6. Application Requests</h2>
            <p>When you submit an application request through SmartLease, your contact information is forwarded to assist with the application process. SmartLease does not process applications directly and is not a party to any lease agreement.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-ink mb-2">7. Limitation of Liability</h2>
            <p>SmartLease is provided &ldquo;as is&rdquo; without warranties of any kind. SmartLease is not liable for any damages arising from your use of the platform, including but not limited to: housing decisions, roommate interactions, lease disputes, or reliance on information displayed on the site.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-ink mb-2">8. Changes to These Terms</h2>
            <p>We may update these terms from time to time. Continued use of SmartLease after changes constitutes acceptance of the updated terms.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-ink mb-2">9. Contact</h2>
            <p>Questions? Email us at <a href="mailto:smartlease.utk@gmail.com" className="text-ut-orange hover:underline">smartlease.utk@gmail.com</a></p>
          </section>
        </div>
      </div>
    </div>
  );
}
