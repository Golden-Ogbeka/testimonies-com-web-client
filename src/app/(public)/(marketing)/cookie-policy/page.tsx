import type { Metadata } from 'next';
import { LegalPageShell, LegalSection } from '@/components/marketing';
import { ROUTES } from '@/constants/routes';

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: 'How we use cookies and similar technologies to enhance your experience',
};

export default function CookiePolicyPage() {
  return (
    <LegalPageShell eyebrow="Legal & Transparency" title="Cookie Policy" meta="Last Updated: July 2026" backHref={ROUTES.LANDING}>
      <LegalSection title="What Are Cookies?">
        <p>
          Cookies are small text files stored on your device that help websites remember information about your visit, such as preferences
          and session data. They enable websites to provide personalized experiences and essential functionality.
        </p>
      </LegalSection>

      <LegalSection title="Types of Cookies We Use">
        <p>We utilize several categories of cookies to optimize your experience:</p>
        <ul className="list-inside list-disc space-y-2 pl-2 text-sm">
          <li>
            <strong>Essential Cookies:</strong> Required for basic website functionality and security features, including login and session
            management.
          </li>
          <li>
            <strong>Preference Cookies:</strong> Remember your settings and preferences (language, theme, layout) for a customized
            experience.
          </li>
          <li>
            <strong>Analytics Cookies:</strong> Help us understand how users interact with our platform to improve performance and user
            experience.
          </li>
          <li>
            <strong>Marketing Cookies:</strong> Used to deliver relevant content and promotions based on user interests and engagement
            patterns.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="How We Use Cookies">
        <p>Cookies on the Testimonies platform serve multiple purposes:</p>
        <ul className="list-inside list-disc space-y-2 pl-2 text-sm">
          <li>Authenticating user sessions and maintaining login states</li>
          <li>Storing user preferences for enhanced usability</li>
          <li>Analyzing traffic patterns to optimize platform performance</li>
          <li>Enabling social media sharing features</li>
          <li>Providing personalized content recommendations</li>
        </ul>
      </LegalSection>

      <LegalSection title="Cookie Management">
        <p>You have control over how cookies are used on your device:</p>
        <ul className="list-inside list-disc space-y-2 pl-2 text-sm">
          <li>Adjust cookie preferences through your browser settings</li>
          <li>Delete specific cookies or clear browser history</li>
          <li>Set up notifications for when cookies are being set</li>
          <li>Use private browsing modes for temporary sessions</li>
        </ul>
        <p className="mt-2 text-xs text-foreground/60 italic">
          Note: Disabling certain cookies may affect platform functionality and your overall experience on Testimonies.
        </p>
      </LegalSection>

      <LegalSection title="Third-Party Cookies">
        <p>
          We may allow select third-party services to set cookies for analytics services (traffic analysis, performance metrics), social
          media integration (sharing buttons, embedded content), and content delivery networks (faster loading times).
        </p>
      </LegalSection>

      <LegalSection title="Policy Updates">
        <p>
          Our Cookie Policy may be updated periodically to reflect changes in technology, legal requirements, or our data practices. Users
          will be notified of significant changes through appropriate channels.
        </p>
      </LegalSection>
    </LegalPageShell>
  );
}
