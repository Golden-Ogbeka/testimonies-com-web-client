import dynamic from 'next/dynamic';

const SettingsContent = dynamic(() => import('./settings-content'));

export default function SettingsPage() {
  return <SettingsContent />;
}
