import type { Metadata } from 'next';
import { LegalList, LegalPageShell, LegalSection } from '@/components/marketing';
import { ROUTES } from '@/constants/routes';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Our commitment to protecting user privacy and data security',
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPageShell eyebrow="Legal & Transparency" title="Privacy Policy" meta="Last Updated: July 2026" backHref={ROUTES.LANDING}>
      <LegalSection title="Information We Collect">
        <p>We collect information that users voluntarily provide to enhance their experience on the Testimonies platform, including:</p>
        <LegalList
          items={[
            'Account information (email, username, password)',
            'Content submitted (testimonies, media updates, reactions)',
            'Engagement data (interactions, follows, settings preferences)',
            'Device information (IP address, client type for security auditing)',
          ]}
        />
      </LegalSection>

      <LegalSection title="How We Use Information">
        <p>We use collected information to:</p>
        <LegalList
          items={[
            'Personalize user experience and feed content delivery',
            'Facilitate account management and authentication logs',
            'Improve platform functionality, responsiveness, and load times',
            'Process feedback and user suggestions',
            'Maintain platform security and prevent abusive behavior',
          ]}
        />
      </LegalSection>

      <LegalSection title="Data Sharing and Protection">
        <p>We prioritize the security and confidentiality of user data:</p>
        <LegalList
          items={[
            'Encrypted storage using industry-standard modern protocols',
            'Strict access controls and audit logging for administrators',
            'No selling of personal data to third-party advertisers',
            'Data processing agreements with trusted infrastructure providers',
            'Regular security assessments and software updates',
          ]}
        />
      </LegalSection>

      <LegalSection title="User Rights and Control">
        <p>Users have full control over their account data, including the right to:</p>
        <LegalList
          items={[
            'Access, review, and export their personal data',
            'Update, modify, or delete account information',
            'Restrict specific processing activities or notification triggers',
            'Withdraw consent for optional community features at any time',
          ]}
        />
      </LegalSection>

      <LegalSection title="Children's Online Privacy">
        <p>
          Our platform is not directed to children under 13 years old. We do not knowingly collect personal information from children. If
          you believe we have inadvertently collected such information, please contact us immediately so we can remove it.
        </p>
      </LegalSection>

      <LegalSection title="Policy Updates">
        <p>
          We reserve the right to update our Privacy Policy periodically to reflect changes in our practices or legal requirements. Users
          will be notified of significant updates through platform announcements and email communications.
        </p>
      </LegalSection>
    </LegalPageShell>
  );
}
