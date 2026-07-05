import DashboardHeader from '../../components/dashboard/DashboardHeader';
import { adminCard } from '../components/adminUi';

type Props = {
  eyebrow: string;
  title: string;
  description: string;
};

export default function AdminPlaceholderPage({ eyebrow, title, description }: Props) {
  return (
    <div className="space-y-8">
      <DashboardHeader eyebrow={eyebrow} title={title} description={description} />
      <div className={`${adminCard} p-10 text-center`}>
        <p className="text-brand-gray text-sm">
          This module is scaffolded for API integration. Connect your backend to enable live data.
        </p>
      </div>
    </div>
  );
}
