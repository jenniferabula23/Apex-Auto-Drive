import DashboardHeader from '../../components/dashboard/DashboardHeader';
import IdentityVerification from '../../components/dashboard/IdentityVerification';

export default function VerificationPage() {
  return (
    <div className="space-y-8">
      <DashboardHeader
        eyebrow="Account"
        title="Verification"
        description="Submit your ID and license details so we can verify your account for rentals."
      />
      <IdentityVerification />
    </div>
  );
}
