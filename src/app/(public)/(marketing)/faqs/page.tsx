import type { Metadata } from 'next';
import FAQsContent from './faqs-content';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions',
  description: 'Find answers to common questions about using the Testimonies platform',
};

export default function FAQsPage() {
  return <FAQsContent />;
}
