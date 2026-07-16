import type { Metadata } from 'next';
import { LegalPageShell, LegalSection } from '@/components/marketing';
import { ROUTES } from '@/constants/routes';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms and conditions for using the Testimonies platform',
};

export default function TermsPage() {
  return (
    <LegalPageShell eyebrow="Legal & Terms" title="Terms of Service" meta="Last Updated: July 2026" backHref={ROUTES.LANDING}>
      <LegalSection title="Acceptance of Terms">
        <p>
          By accessing and using the Testimonies platform, you acknowledge that you have read, understood, and agree to be bound by these
          Terms of Service and our Privacy Policy.
        </p>
      </LegalSection>

      <LegalSection title="User Conduct">
        <p>
          Users must adhere to community guidelines that promote respectful, constructive, and faith-based discussions. Hate speech,
          harassment, spam, and inappropriate content will not be tolerated and may result in immediate account suspension.
        </p>
      </LegalSection>

      <LegalSection title="Content Ownership">
        <p>
          All testimonies and related content remain the intellectual property of their respective authors. Testimonies grants users a
          license to share and distribute their content within the platform for non-commercial purposes only.
        </p>
      </LegalSection>

      <LegalSection title="Limitation of Liability">
        <p>
          Testimonies shall not be liable for any damages arising from the use of our platform. Users acknowledge that sharing testimonies
          involves personal experiences and perspectives for which they assume all responsibility.
        </p>
      </LegalSection>

      <LegalSection title="Termination">
        <p>
          Testimonies reserves the right to terminate or suspend accounts that violate these terms or engage in harmful behavior. Violations
          include spam, harassment, or spreading misinformation.
        </p>
      </LegalSection>
    </LegalPageShell>
  );
}
