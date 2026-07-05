type Props = {
  label: string;
  tone?: 'red' | 'green' | 'orange' | 'yellow' | 'gray' | 'purple';
};

const tones: Record<NonNullable<Props['tone']>, string> = {
  red: 'border-brand-red/40 text-brand-red bg-brand-red/10',
  green: 'border-green-500/40 text-green-400 bg-green-500/10',
  orange: 'border-orange-500/40 text-orange-400 bg-orange-500/10',
  yellow: 'border-yellow-500/40 text-yellow-400 bg-yellow-500/10',
  gray: 'border-white/20 text-brand-gray bg-white/5',
  purple: 'border-purple-500/40 text-purple-300 bg-purple-500/10',
};

export default function AdminStatusBadge({ label, tone = 'gray' }: Props) {
  return (
    <span className={`text-[10px] px-3 py-1 uppercase tracking-widest border ${tones[tone]}`}>
      {label}
    </span>
  );
}
