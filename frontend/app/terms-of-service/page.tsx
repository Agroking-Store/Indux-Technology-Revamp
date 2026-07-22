import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Indux Technology",
  description: "Terms of Service for Indux Technology.",
};

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Header */}
      <div className="bg-[#0f2e4a] pt-32 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent pointer-events-none"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Terms of Service</h1>
          <p className="text-blue-200 text-sm md:text-base">Effective Date: October 5, 2025 | Last Updated: March 23, 2026</p>
        </div>
      </div>
      
      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 text-slate-700 dark:text-slate-300 space-y-8 text-base md:text-lg leading-relaxed">
            
            <p className="text-lg text-slate-900 dark:text-slate-200">
              Welcome to Indux Technology. These Terms of Service (“Terms”) govern your use of the Indux Technology platform, including our integrations with WhatsApp Business and Google Calendar. By using our services, you agree to these legally binding terms.
            </p>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">1. Description of Service</h2>
              <p>Indux Technology provides a software-as-a-service (SaaS) platform for lead management, WhatsApp communication, and automated scheduling via Google Calendar.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">2. User Accounts & Security</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
                <li>You agree to notify us immediately of any unauthorized use of your account.</li>
                <li>We are not liable for any loss or damage arising from your failure to protect your login information.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">3. Third-Party Integrations</h2>
              <p className="mb-2">Our service integrates with third-party platforms. Your use of these features is subject to their respective terms:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong className="text-slate-900 dark:text-white">Google Calendar:</strong> By connecting your Google account, you agree to the Google Terms of Service.</li>
                <li><strong className="text-slate-900 dark:text-white">WhatsApp Business:</strong> You agree to comply with the WhatsApp Business Messaging Policy.</li>
              </ul>
              <p className="mt-4 italic text-sm text-slate-500">Disclaimer: We are not responsible for the availability, security, or changes made by Google or Meta to their respective APIs.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">4. Acceptable Use Policy</h2>
              <p className="mb-2">You agree not to use Indux CRM to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Send unsolicited messages or “spam” via WhatsApp.</li>
                <li>Impersonate any person or entity or misrepresent your affiliation with a business.</li>
                <li>Attempt to reverse engineer, crawl, or disrupt the CRM infrastructure.</li>
                <li>Store or transmit data that violates any third-party intellectual property or privacy rights.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">5. Limitation of Liability</h2>
              <p className="mb-2">To the maximum extent permitted by law, Indux Technologies shall not be liable for any indirect, incidental, or consequential damages, including:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Loss of profits or data.</li>
                <li>Failure of a Google Meet link to generate.</li>
                <li>Failure of a WhatsApp message to be delivered.</li>
                <li>Any service interruptions caused by third-party providers (Google/Meta).</li>
              </ul>
              <p className="mt-4 font-semibold text-slate-900 dark:text-white">Our total liability for any claim shall not exceed the amount you paid us in the past 12 months.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">6. Data Ownership</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong className="text-slate-900 dark:text-white">Your Data:</strong> You retain all rights to the data you upload (leads, notes, messages).</li>
                <li><strong className="text-slate-900 dark:text-white">Our Feedback:</strong> If you provide suggestions or feedback, we may use them without restriction or compensation to you.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">7. Termination</h2>
              <p>We reserve the right to suspend or terminate your account if you violate these terms or if your actions risk the security and reputation of our platform.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">8. Governing Law</h2>
              <p>These Terms are governed by the laws of Maharashtra, India. Any disputes shall be resolved in the courts of Pune, Maharashtra.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">9. Contact Us</h2>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
                <p className="font-bold text-slate-900 dark:text-white mb-2">Indux Technologies</p>
                <p>S. No. 05, Geeta Paradise, Opp. Zensar, Kharadi, Pune, Maharashtra, India</p>
                <p>Email: <a href="mailto:connect@induxtechnology.com" className="text-blue-600 dark:text-blue-400 hover:underline">connect@induxtechnology.com</a></p>
                <p>Website: <a href="https://www.induxtechnology.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">https://www.induxtechnology.com/</a></p>
              </div>
            </section>

      </div>
    </div>
  );
}
