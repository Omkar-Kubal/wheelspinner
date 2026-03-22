import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for WheelSpinner, including information about Google AdSense and Analytics.',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
      <div className="prose text-gray-600 space-y-6 leading-relaxed">
        <p>Last updated: March 2025</p>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-2">1. Information We Collect</h2>
          <p>WheelSpinner does not require you to create an account or provide personal information. Wheel items you enter are stored only in your browser&apos;s localStorage and URL parameters — they are never sent to our servers.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-2">2. Google AdSense</h2>
          <p>We use Google AdSense to display advertisements. Google uses cookies and similar technologies to serve ads based on your prior visits to this website or other websites. You may opt out of personalised advertising at <a href="https://www.google.com/settings/ads" className="text-indigo-400 hover:underline">Google&apos;s Ads Settings</a>.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-2">3. Google Analytics</h2>
          <p>We use Google Analytics to understand how visitors use WheelSpinner. This service collects anonymised usage data such as page views and session duration. No personally identifiable information is collected.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-2">4. Cookies</h2>
          <p>Third-party services (Google AdSense, Google Analytics) may set cookies on your device. We do not set our own tracking cookies.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-2">5. Contact</h2>
          <p>If you have questions about this privacy policy, please reach out via the About page.</p>
        </section>
      </div>
    </div>
  );
}
