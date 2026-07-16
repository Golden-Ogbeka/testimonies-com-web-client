import type { Metadata } from 'next';
import { BookOpen, Heart, MessageSquare, Shield, Sparkles } from 'lucide-react';
import {
  FeatureGrid,
  IllustrationFrame,
  PublicBadge,
  PublicContainer,
  PublicCta,
  PublicLinkButton,
  PublicPage,
  PublicSection,
  QuoteBlock,
  SectionHeading,
  StatsRow,
} from '@/components/marketing';
import { LANDING_FEATURES, LANDING_STATS, MARKETING_IMAGES } from '@/constants/marketing';
import { ROUTES } from '@/constants/routes';

export const metadata: Metadata = {
  title: 'Testimonies — Share His Goodness',
  description: "Share your testimony of God's goodness and inspire the world.",
};

const features = LANDING_FEATURES.map((feature, index) => ({
  ...feature,
  icon: [BookOpen, MessageSquare, Shield][index]!,
  href: ROUTES.SIGNUP,
}));

export default function LandingPage() {
  return (
    <PublicPage>
      <PublicSection bordered padding="lg" className="flex min-h-[calc(100dvh-4rem)] items-center py-16 lg:py-24">
        <PublicContainer>
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="flex flex-col items-start space-y-6 sm:space-y-8 lg:col-span-7">
              <PublicBadge icon={Sparkles} variant="accent">
                Documenting Miracles Daily
              </PublicBadge>

              <h1 className="font-serif text-4xl font-bold tracking-tight text-foreground leading-[1.05] sm:text-5xl lg:text-7xl">
                Share His <br />
                <span className="text-accent underline decoration-wavy decoration-2 underline-offset-8">Goodness</span> to the World.
              </h1>

              <p className="max-w-xl text-base font-medium leading-relaxed text-foreground/80 sm:text-xl">
                Testimonies is a modern, faith-centered platform built for sharing authentic stories of God&apos;s active presence in our
                lives. Uplift others, strengthen hearts, and document His glory.
              </p>

              <div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-4">
                <PublicLinkButton href={ROUTES.SIGNUP} variant="primary" showArrow>
                  Get Started
                </PublicLinkButton>
                <PublicLinkButton href={ROUTES.ABOUT} variant="secondary">
                  Learn More
                </PublicLinkButton>
              </div>

              <StatsRow stats={[...LANDING_STATS]} />
            </div>

            <div className="flex w-full justify-center lg:col-span-5 lg:justify-end">
              <IllustrationFrame
                src={MARKETING_IMAGES.HERO}
                alt="Faith testimonies and stories community illustration"
                aspectRatio="square"
                priority
              />
            </div>
          </div>
        </PublicContainer>
      </PublicSection>

      <PublicSection bordered background="muted" padding="lg">
        <PublicContainer>
          <SectionHeading
            eyebrow="Platform Capabilities"
            title="Designed to Elevate Faith"
            description="Explore powerful features engineered to help you document, share, and connect over the goodness of God."
          />
          <FeatureGrid features={features} />
        </PublicContainer>
      </PublicSection>

      <PublicSection bordered background="accent" padding="lg">
        <QuoteBlock
          icon={Heart}
          quote="And they overcame him by the blood of the Lamb, and by the word of their testimony; and they loved not their lives unto the death."
          cite="Revelation 12:11"
        />
      </PublicSection>

      <PublicSection padding="lg">
        <PublicCta
          title="Start Documenting His Miracles Today"
          description="Join thousands of believers worldwide who are sharing how God has moved in their health, family, finances, and spirit."
          primaryHref={ROUTES.SIGNUP}
          primaryLabel="Create Your Free Account"
          secondaryHref={ROUTES.SIGNIN}
          secondaryLabel="Sign In"
        />
      </PublicSection>
    </PublicPage>
  );
}
