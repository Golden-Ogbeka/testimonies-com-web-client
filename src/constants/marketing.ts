export const MARKETING_IMAGES = {
  HERO: '/testimonies_hero_illustration.png',
  ABOUT: '/testimonies_about_illustration.png',
  FAQS: '/testimonies_faqs_illustration.png',
  TRUST: '/testimonies_trust_illustration.png',
} as const;

export const LANDING_STATS = [
  { value: '10k+', label: 'Testimonies Shared' },
  { value: '50+', label: 'Countries Reached' },
  { value: '100%', label: 'Faith Focused' },
] as const;

export const LANDING_FEATURES = [
  {
    title: 'Authentic Sharing',
    description: 'Write detailed testimonies, upload pictures, attach video updates, or share voice notes of your answered prayers.',
    color: 'from-emerald-500/10 to-emerald-500/5',
  },
  {
    title: 'Faith Feed & Updates',
    description:
      'Follow fellow believers, receive daily updates of testimonies in your feed, react with words of support, and join conversations.',
    color: 'from-indigo-500/10 to-indigo-500/5',
  },
  {
    title: 'Private Spiritual Journal',
    description: 'Document private encounters or personal milestones in your private "Secret" log, keeping them only between you and God.',
    color: 'from-amber-500/10 to-amber-500/5',
  },
] as const;
