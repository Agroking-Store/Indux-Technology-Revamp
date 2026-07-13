import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Indux Technology",
  description: "Privacy Policy for Indux Technology and Indux CRM.",
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Header */}
      <div className="bg-[#0f2e4a] pt-32 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent pointer-events-none"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Privacy Policy</h1>
          <p className="text-blue-200 text-sm md:text-base">Effective Date: October 5, 2025 | Last Updated: 23 March, 2026</p>
        </div>
      </div>
      
      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 text-slate-700 dark:text-slate-300 space-y-8 text-base md:text-lg leading-relaxed">
            
            <p className="text-lg text-slate-900 dark:text-slate-200">
              Indux Technologies (“Indux”, “we”, “us”, “our”) operates Indux CRM and integrates WhatsApp Business services and Google Calendar Integrations to enable businesses to communicate with their customers. This Privacy Policy explains how we collect, use, disclose, and protect personal information processed through our CRM, WhatsApp Business and Google Calendar integrations. It is designed to meet the requirements of our service partners, including Meta and Google and general privacy best practices. This is not legal advice.
            </p>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">1. Scope & Applicability</h2>
              <p>This policy applies when you interact with Indux via WhatsApp through our CRM (including text and media), and to information collected for registering, verifying, and using WhatsApp Business. It covers data processed through our web application and Google API connections. It does not cover third-party services we do not control.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">2. Roles of Indux and Business Clients</h2>
              <p>For messaging conducted by our business clients using Indux CRM, the business client is typically the data controller and Indux acts as a data processor/service provider on their behalf. For our own websites, accounts, and support channels, Indux is the data controller.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">3. Information We Collect</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong className="text-slate-900 dark:text-white">Identifiers & Account Info:</strong> Name, email address, phone number, business name, address, and business verification details.</li>
                <li><strong className="text-slate-900 dark:text-white">Message Content & Media:</strong> text messages, images, videos, voice notes, documents sent via WhatsApp.</li>
                <li><strong className="text-slate-900 dark:text-white">Metadata & Logs:</strong> timestamps, delivery/read statuses, sender/receiver identifiers, system and connection metadata.</li>
                <li><strong className="text-slate-900 dark:text-white">Technical & Usage Data:</strong> device/browser type, IP address, diagnostic logs, analytics events.</li>
                <li><strong className="text-slate-900 dark:text-white">Business Profile Data:</strong> business category, display name, profile photo, description, and template usage info.</li>
                <li><strong className="text-slate-900 dark:text-white">Google User Data:</strong> When a User connects their Google Calendar, we collect the Google email address and OAuth tokens (Access and Refresh tokens).</li>
                <li><strong className="text-slate-900 dark:text-white">Event Data:</strong> Event titles, descriptions, timestamps, and attendee email addresses (Leads/Customers).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">4. Legal Basis & User Consent</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong className="text-slate-900 dark:text-white">Consent/Opt-in:</strong> clear, affirmative opt-in is required before businesses message users on WhatsApp.</li>
                <li><strong className="text-slate-900 dark:text-white">Performance of a contract/legitimate interests:</strong> to deliver transactional notifications and support messages requested by users.</li>
                <li><strong className="text-slate-900 dark:text-white">Compliance with law and WhatsApp/Meta policies:</strong> to meet audit, fraud prevention, and record-keeping obligations.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">5. How We Use Information</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Deliver transactional messages, service updates, alerts, and customer support via WhatsApp.</li>
                <li>Operate, verify, and maintain WhatsApp Business accounts and message templates.</li>
                <li>Monitor system performance, troubleshoot, and improve product features.</li>
                <li>Prevent fraud, abuse, and policy violations; enforce terms and acceptable use.</li>
                <li>Comply with legal obligations, including responding to lawful requests.</li>
                <li>To facilitate business communication via Google Calendar.</li>
                <li>To generate unique meeting links and manage attendee notifications.</li>
                <li>To maintain synchronization between your CRM dashboard and external calendars.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">6. Sharing & Disclosure</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong className="text-slate-900 dark:text-white">WhatsApp/Meta:</strong> messages and metadata transit WhatsApp infrastructure and are subject to WhatsApp Business Terms and policies.</li>
                <li><strong className="text-slate-900 dark:text-white">Service Providers (processors):</strong> limited data is shared with hosting, analytics, and security vendors under contractual safeguards. Data is shared with Google (for Calendar/Meet) and Meta (for WhatsApp) only to perform the services requested by the User.</li>
                <li><strong className="text-slate-900 dark:text-white">Business Clients:</strong> where you interact with a business using Indux CRM, that business may access your conversations and related data.</li>
                <li><strong className="text-slate-900 dark:text-white">Legal/Regulatory Authorities:</strong> where required by law, subpoena, or legal process. We may disclose information if required by law or to protect the rights and safety of our users.</li>
                <li><strong className="text-slate-900 dark:text-white">Business Transfers:</strong> In the event of a merger or sale, data may be transferred, subject to the same privacy protections.</li>
                <li><strong className="text-slate-900 dark:text-white">No Selling:</strong> we do not sell or rent personal data.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">7. Opt-In, Templates, and Opt-Out</h2>
              <p>Before a business messages you on WhatsApp, it must obtain your explicit opt-in that clearly states the business name and that you agree to receive messages. Approved message templates are required for business-initiated conversations, and promotional or marketing content must comply with WhatsApp policies where permitted. You can opt out at any time by replying with keywords like “STOP” or by contacting us or the business directly.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">8. Data Retention</h2>
              <p className="mb-2"><strong className="text-slate-900 dark:text-white">Security:</strong> We use industry-standard encryption (TLS) for data in transit and secure database hashing for tokens at rest.</p>
              <p className="mb-2"><strong className="text-slate-900 dark:text-white">Retention:</strong> We retain data as long as the User account is active. Upon account deletion, Google OAuth tokens and associated records are purged from our active servers within 30 days.</p>
              <p>Indux retains WhatsApp message logs, media (where stored), and related metadata for as long as your account or the relevant business relationship remains active, or as required by law. Upon termination or valid deletion request, we delete or anonymize data unless retention is legally required. Backup copies may persist temporarily but are not used for active processing.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">9. Security Measures</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Encryption in transit (TLS) and platform protections; WhatsApp provides end-to-end encryption between users and WhatsApp.</li>
                <li>Access controls, least-privilege, audit logging, and regular security reviews.</li>
                <li>Vendor due diligence and data minimization.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">10. International Transfers</h2>
              <p>Where data is transferred across borders, we implement appropriate safeguards consistent with applicable laws. WhatsApp/Meta may process data in various jurisdictions according to their policies.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">11. Your Rights</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong className="text-slate-900 dark:text-white">Access:</strong> request a copy of your data processed via Indux CRM.</li>
                <li><strong className="text-slate-900 dark:text-white">Correction:</strong> request correction of inaccurate or incomplete data.</li>
                <li><strong className="text-slate-900 dark:text-white">Deletion:</strong> request deletion subject to legal/contractual requirements.</li>
                <li><strong className="text-slate-900 dark:text-white">Objection & Restriction:</strong> object to or restrict certain processing where applicable.</li>
                <li><strong className="text-slate-900 dark:text-white">Withdrawal of Consent:</strong> opt out of WhatsApp messaging at any time.</li>
                <li><strong className="text-slate-900 dark:text-white">Portability:</strong> request export of certain data where applicable.</li>
                <li><strong className="text-slate-900 dark:text-white">Disconnecting Services:</strong> Users can revoke Google Calendar access at any time via the CRM settings or through the Google Security Settings.</li>
                <li><strong className="text-slate-900 dark:text-white">Access & Deletion:</strong> Users and Invitees may request access to or deletion of their personal data by contacting us at the email below.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">12. WhatsApp Business / Meta Verification Compliance</h2>
              <p>Indux and its business clients adhere to WhatsApp Business Terms, Business Messaging Policy, and opt-in requirements. We maintain opt-in records, support unsubscribe mechanisms, and use approved templates for business-initiated conversations. Accounts that violate policy (e.g., spam or misclassification) may face enforcement actions by WhatsApp/Meta.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">13. Google API Disclosure & Data Usage</h2>
              <p className="mb-2">Indux CRM integrates with Google Calendar APIs to enable automated scheduling and virtual meetings.</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong className="text-slate-900 dark:text-white">Access:</strong> We request access to auth/calendar.events. This allows Indux CRM to create, view, and edit events on your behalf.</li>
                <li><strong className="text-slate-900 dark:text-white">Google Meet:</strong> Our app uses this access to automatically generate Google Meet links for scheduled events.</li>
                <li><strong className="text-slate-900 dark:text-white">Automated Invites:</strong> When a User creates an event in the CRM, we use Google’s infrastructure to send calendar invitations and reminders to Invitees.</li>
                <li><strong className="text-slate-900 dark:text-white">Limited Use Requirement:</strong> Indux Technologies’ use and transfer to any other app of information received from Google APIs will adhere to the Google API Services User Data Policy, including the Limited Use requirements.</li>
                <li><strong className="text-slate-900 dark:text-white">Non-Disclosure:</strong> We do not sell Google user data to third parties. We do not use Google user data for serving advertisements.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">14. Changes to This Policy</h2>
              <p>We may update this policy periodically. Material changes will be communicated through our website, WhatsApp, or email. The “Last Updated” date will reflect the most recent changes.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">15. Contact Information</h2>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
                <p className="font-bold text-slate-900 dark:text-white mb-2">Indux Technologies</p>
                <p>No. 05, Geeta Paradise, Opp. Zensar, Kharadi, Pune, Maharashtra, India</p>
                <p>Phone: +91 84215 38753</p>
                <p>Email: <a href="mailto:connect@induxtechnology.com" className="text-blue-600 dark:text-blue-400 hover:underline">connect@induxtechnology.com</a></p>
                <p>Website: <a href="https://www.induxtechnology.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">https://www.induxtechnology.com/</a></p>
              </div>
            </section>

            <p className="text-sm text-slate-500 italic mt-8 border-t border-slate-200 dark:border-slate-800 pt-8">
              Disclaimer: This policy provides general information aligned to WhatsApp Business and industry guidelines. Consult legal counsel for specific compliance obligations.
            </p>

      </div>
    </div>
  );
}
