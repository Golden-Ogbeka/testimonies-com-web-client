'use client';

import {
  FaqAccordion,
  IllustrationFrame,
  PublicContainer,
  PublicLinkButton,
  PublicPage,
  PublicPageBody,
  PublicPageHeader,
  SplitContentLayout,
  type FaqItem,
} from '@/components/marketing';
import { MARKETING_IMAGES } from '@/constants/marketing';
import { ROUTES } from '@/constants/routes';

const faqs: FaqItem[] = [
  {
    question: 'What is Testimonies?',
    answer:
      "Testimonies is a digital platform where believers share authentic stories of God's goodness in their lives. Our mission is to create a community that uplifts and encourages one another through the power of shared testimony.",
  },
  {
    question: 'How do I create an account?',
    answer:
      'Click "Sign Up" on the homepage. You can register as an individual or organization. Follow the prompts to provide your details, and you\'ll receive an OTP via email to verify your account.',
  },
  {
    question: 'Can I share media with my testimony?',
    answer: 'Yes! You can upload images, videos, and audio files alongside your written testimony to make your story more impactful.',
  },
  {
    question: 'Are testimonies moderated?',
    answer:
      'Yes, all content is reviewed to ensure it aligns with our community guidelines. We prioritize respectful, faith-based content that inspires and encourages.',
  },
  {
    question: 'Can I edit or delete my testimony?',
    answer:
      'Absolutely. You have full control over your content. You can edit, delete, or manage visibility settings for any testimony you share at any time.',
  },
  {
    question: 'How do I report inappropriate content?',
    answer:
      'Use the "Report" option on any testimony or reply. Our moderation team reviews reports promptly and takes appropriate action according to our community guidelines.',
  },
  {
    question: 'Is my personal information private?',
    answer:
      'Yes. We protect your data according to our Privacy Policy. We never sell personal information to third parties and use industry-standard encryption for data security.',
  },
  {
    question: 'Can I follow other users?',
    answer:
      'Yes! You can follow other users to see their testimonies in your feed. You can also send follow requests that require approval for private accounts.',
  },
  {
    question: 'What are "Secret" testimonies?',
    answer:
      'Secret testimonies are visible only to you. They serve as personal records of faith moments you want to keep private while still documenting your spiritual journey.',
  },
  {
    question: 'How do I get support?',
    answer: 'Visit our Help Center in the app settings, or email support@testimonies.com. Our team responds within 24-48 hours.',
  },
  {
    question: 'Is Testimonies free to use?',
    answer: 'Yes, the core platform is free. We offer optional premium features for enhanced functionality and community engagement.',
  },
  {
    question: 'Can organizations use Testimonies?',
    answer:
      'Yes! Organizations (churches, ministries, nonprofits) can create accounts to share collective testimonies and engage with their communities.',
  },
];

export default function FAQsContent() {
  return (
    <PublicPage>
      <PublicPageBody>
        <PublicContainer size="lg">
          <SplitContentLayout
            reverse
            illustration={
              <IllustrationFrame
                src={MARKETING_IMAGES.FAQS}
                alt="Friendly help and answers illustration for frequently asked questions"
                aspectRatio="landscape"
              />
            }
          >
            <div>
              <PublicPageHeader
                eyebrow="Frequently Asked Questions"
                title="Got Questions? We Have Answers."
                description="Find quick answers to common questions about sharing and interacting on the Testimonies platform."
              />

              <FaqAccordion items={faqs} />

              <div className="mt-12 flex flex-col items-center justify-between gap-6 border-t border-border pt-10 sm:mt-16 sm:flex-row sm:text-left">
                <div className="text-center sm:text-left">
                  <h3 className="font-serif text-xl font-bold text-foreground">Still have questions?</h3>
                  <p className="mt-1 text-sm font-medium text-foreground/70">
                    Our team is always here to help you get the most out of Testimonies.
                  </p>
                </div>
                <PublicLinkButton href={ROUTES.SIGNUP} variant="primary" size="sm" showArrow className="shrink-0">
                  Join Testimonies
                </PublicLinkButton>
              </div>
            </div>
          </SplitContentLayout>
        </PublicContainer>
      </PublicPageBody>
    </PublicPage>
  );
}
