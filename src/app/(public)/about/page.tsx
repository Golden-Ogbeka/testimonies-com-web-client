import type { Metadata } from 'next';
import { Heart, Users } from 'lucide-react';
import {
  IllustrationFrame,
  PublicContainer,
  PublicLinkButton,
  PublicPage,
  PublicPageBody,
  PublicPageHeader,
  SplitContentLayout,
} from '@/components/marketing';
import { MARKETING_IMAGES } from '@/constants/marketing';
import { ROUTES } from '@/constants/routes';

export const metadata: Metadata = {
  title: 'About Testimonies',
  description: "Share testimonies of God's goodness and inspire the world.",
};

export default function AboutPage() {
  return (
    <PublicPage>
      <PublicPageBody>
        <PublicContainer>
          <PublicPageHeader
            eyebrow="Our Mission & Purpose"
            title="Inspire Faith Through Shared Stories"
            description="We believe that every testimony is a testament to God's active goodness. Testimonies is a digital sanctuary built to celebrate, archive, and amplify stories of faith, healing, deliverance, and answered prayers."
          />

          <SplitContentLayout
            illustration={
              <IllustrationFrame
                src={MARKETING_IMAGES.ABOUT}
                alt="Faith bridge of light and global community connection"
                aspectRatio="portrait"
                priority
              />
            }
          >
            <div className="space-y-10 sm:space-y-12">
              <div className="space-y-5 text-sm font-medium leading-relaxed text-foreground/80 sm:text-base">
                <p>
                  Our platform was born from a simple realization: the stories of God&apos;s goodness are the most powerful tools we have to
                  encourage one another, spark hope, and build up faith. In a world full of noise, Testimonies offers a dedicated space
                  focused entirely on uplifting content.
                </p>
                <p>
                  Whether it is a quiet moment of provision, a miraculous healing, restoration in a relationship, or a breakthrough in your
                  career, sharing what God has done honors Him and strengthens the body of Christ.
                </p>
              </div>

              <div className="space-y-5">
                <h2 className="font-serif text-2xl font-bold text-foreground">What We Believe In</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
                  <div className="rounded-2xl border border-border bg-background p-5 transition-all duration-300 hover:bg-background-secondary sm:p-6">
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-primary-muted">
                      <Heart className="h-5 w-5 text-foreground" />
                    </div>
                    <h3 className="font-serif text-lg font-bold text-foreground">Encouraging Community</h3>
                    <p className="mt-2 text-sm font-medium leading-relaxed text-foreground/70">
                      A safe, respectful community where believers can support each other through prayers, comments, and reactions.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-border bg-background p-5 transition-all duration-300 hover:bg-background-secondary sm:p-6">
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-primary-muted">
                      <Users className="h-5 w-5 text-foreground" />
                    </div>
                    <h3 className="font-serif text-lg font-bold text-foreground">Global Reach</h3>
                    <p className="mt-2 text-sm font-medium leading-relaxed text-foreground/70">
                      Connecting faith stories from every continent, showing that God is at work in every culture and tongue.
                    </p>
                  </div>
                </div>
              </div>

              <PublicLinkButton href={ROUTES.SIGNUP} variant="primary" size="sm" showArrow>
                Join the Community
              </PublicLinkButton>
            </div>
          </SplitContentLayout>
        </PublicContainer>
      </PublicPageBody>
    </PublicPage>
  );
}
