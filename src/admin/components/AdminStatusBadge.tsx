type Props = {
  label: string;
  tone?: 'red' | 'green' | 'orange' | 'yellow' | 'gray' | 'purple';
};

const tones: Record<NonNullable<Props['tone']>, string> = {
  red: 'border-brand-red/40 text-brand-red bg-brand-red/10',
  green: 'border-green-700/30 text-green-800 bg-green-50',
  orange: 'border-orange-600/30 text-orange-800 bg-orange-50',
  yellow: 'border-amber-600/30 text-amber-800 bg-amber-50',
  gray: 'border-gray-300 text-gray-800 bg-gray-50',
  purple: 'border-purple-600/30 text-purple-800 bg-purple-50',
};

export default function AdminStatusBadge({ label, tone = 'gray' }: Props) {
  return (
    <span className={`text-[10px] px-3 py-1 uppercase tracking-widest border ${tones[tone]}`}>
      {label}
    </span>
  );
}
