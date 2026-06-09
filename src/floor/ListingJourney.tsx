import React, { useMemo, useState } from 'react';
import {
  Camera,
  Video,
  ClipboardCheck,
  FileText,
  PenLine,
  Car,
  ChevronLeft,
  ChevronRight,
  Check,
  CircleDashed,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  ArrowLeft,
} from 'lucide-react';

type Step = 'basic' | 'photos' | 'videos' | 'condition' | 'ownership' | 'review';

const STEPS: { id: Step; label: string; icon: any }[] = [
  { id: 'basic', label: 'Basic Info', icon: Car },
  { id: 'photos', label: 'Photos', icon: Camera },
  { id: 'videos', label: 'Videos', icon: Video },
  { id: 'condition', label: 'Condition', icon: ClipboardCheck },
  { id: 'ownership', label: 'Ownership', icon: FileText },
  { id: 'review', label: 'Review', icon: PenLine },
];

type PhotoStatus = 'Missing' | 'Uploaded' | 'AI reviewed';
const PHOTO_TASKS: { label: string; status: PhotoStatus }[] = [
  { label: 'Front exterior', status: 'AI reviewed' },
  { label: 'Rear exterior', status: 'AI reviewed' },
  { label: 'Driver side', status: 'AI reviewed' },
  { label: 'Passenger side', status: 'Uploaded' },
  { label: 'Interior front', status: 'Uploaded' },
  { label: 'Interior rear', status: 'Uploaded' },
  { label: 'Odometer', status: 'Uploaded' },
  { label: 'VIN plate', status: 'AI reviewed' },
  { label: 'Engine bay', status: 'Missing' },
  { label: 'Tires', status: 'Missing' },
  { label: 'Rust / damage areas', status: 'Missing' },
  { label: 'Undercarriage', status: 'Missing' },
];

const VIDEO_TASKS: { label: string; status: PhotoStatus }[] = [
  { label: 'Cold start video', status: 'Missing' },
  { label: 'Walkaround video', status: 'AI reviewed' },
  { label: 'Dash while running', status: 'Missing' },
  { label: 'Test drive video', status: 'Missing' },
  { label: '4x4 / AWD function video', status: 'Missing' },
  { label: 'Engine bay running video', status: 'Missing' },
];

const CONDITION_QS = [
  'Does it start and run?',
  'Does it drive under its own power?',
  'Any warning lights on?',
  'Any known engine issues?',
  'Any known transmission issues?',
  'Any visible rust?',
  'Any accident history?',
  'Any leaks?',
  'Are all keys included?',
  'Any modifications?',
  'Any known mechanical issues not shown in photos/videos?',
];

const OWNERSHIP_QS = [
  'Are you the legal owner?',
  'Is there a lien?',
  'Is registration available?',
  'Is title / ownership document available?',
  'Can you provide lien payout if applicable?',
  'Is the VIN accurate?',
];

const PhotoStatusBadge: React.FC<{ status: PhotoStatus }> = ({ status }) => {
  const styles =
    status === 'AI reviewed'
      ? 'bg-green-500/15 text-green-400 border-green-500/30'
      : status === 'Uploaded'
        ? 'bg-blue-500/10 text-blue-300 border-blue-500/30'
        : 'bg-white/[0.04] text-gray-500 border-white/10';
  return (
    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${styles}`}>
      {status}
    </span>
  );
};

const StepperHeader: React.FC<{ current: Step; onJump: (s: Step) => void }> = ({ current, onJump }) => {
  const currentIdx = STEPS.findIndex((s) => s.id === current);
  return (
    <div className="flex items-center gap-1 md:gap-3 overflow-x-auto no-scrollbar">
      {STEPS.map((s, i) => {
        const Icon = s.icon;
        const isDone = i < currentIdx;
        const isActive = i === currentIdx;
        return (
          <React.Fragment key={s.id}>
            <button
              onClick={() => onJump(s.id)}
              className={`group shrink-0 flex items-center gap-2 px-2.5 py-1.5 rounded-full border transition ${
                isActive
                  ? 'bg-green-500 text-black border-green-400 shadow-[0_0_18px_rgba(34,197,94,0.35)]'
                  : isDone
                    ? 'bg-green-500/10 text-green-300 border-green-500/30'
                    : 'bg-white/[0.03] text-gray-400 border-white/10 hover:bg-white/[0.06]'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                  isActive ? 'bg-black/20 text-black' : isDone ? 'bg-green-500/30 text-green-200' : 'bg-white/5 text-gray-500'
                }`}
              >
                {isDone ? <Check className="w-3 h-3" /> : <Icon className="w-3 h-3" />}
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider">{s.label}</span>
            </button>
            {i < STEPS.length - 1 && (
              <ChevronRight className={`w-3 h-3 shrink-0 ${i < currentIdx ? 'text-green-500/60' : 'text-white/15'}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

const TextField: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}> = ({ label, value, onChange, placeholder }) => (
  <label className="flex flex-col gap-1.5">
    <span className="text-[10px] font-black uppercase tracking-[0.18em] text-gray-500">{label}</span>
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="bg-[#111] border border-white/10 focus:border-green-500/40 focus:ring-2 focus:ring-green-500/15 outline-none text-sm font-medium text-white placeholder-gray-600 rounded-lg px-3 py-2.5 transition-all"
    />
  </label>
);

const YesNo: React.FC<{ q: string; value: 'yes' | 'no' | null; onChange: (v: 'yes' | 'no') => void }> = ({
  q,
  value,
  onChange,
}) => (
  <div className="flex items-center justify-between gap-3 bg-[#0d0d0d] border border-white/5 rounded-lg px-3 py-2.5">
    <span className="text-[12px] text-gray-200 leading-snug">{q}</span>
    <div className="flex gap-1 shrink-0">
      <button
        onClick={() => onChange('yes')}
        className={`px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest transition ${
          value === 'yes' ? 'bg-green-500 text-black' : 'bg-white/[0.04] text-gray-400 hover:bg-white/[0.08]'
        }`}
      >
        Yes
      </button>
      <button
        onClick={() => onChange('no')}
        className={`px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest transition ${
          value === 'no' ? 'bg-white text-black' : 'bg-white/[0.04] text-gray-400 hover:bg-white/[0.08]'
        }`}
      >
        No
      </button>
    </div>
  </div>
);

export const ListingJourney: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const [step, setStep] = useState<Step>('basic');
  const [submitted, setSubmitted] = useState(false);

  const [basic, setBasic] = useState({
    year: '2012',
    make: 'Ford',
    model: 'F-150',
    trim: 'Lariat EcoBoost',
    vin: '1FTFW1ET5CFB12345',
    mileage: '186,000',
    location: 'Calgary, AB',
    drivetrain: '4x4',
    engine: '3.5L EcoBoost V6',
    transmission: '6-Speed Automatic',
    ownership: 'Owned outright',
  });

  const [conditionAnswers, setConditionAnswers] = useState<Record<string, 'yes' | 'no' | null>>({});
  const [ownershipAnswers, setOwnershipAnswers] = useState<Record<string, 'yes' | 'no' | null>>({});
  const [signed, setSigned] = useState(false);
  const [signature, setSignature] = useState('');

  const photoComplete = PHOTO_TASKS.filter((p) => p.status !== 'Missing').length;
  const videoComplete = VIDEO_TASKS.filter((p) => p.status !== 'Missing').length;
  const conditionComplete = Object.keys(conditionAnswers).length === CONDITION_QS.length;
  const ownershipComplete = Object.keys(ownershipAnswers).length === OWNERSHIP_QS.length;

  const trustScore = useMemo(() => {
    let score = 0;
    score += 16; // basic info complete
    score += Math.round((photoComplete / PHOTO_TASKS.length) * 22);
    score += Math.round((videoComplete / VIDEO_TASKS.length) * 22);
    score += conditionComplete ? 16 : Math.round((Object.keys(conditionAnswers).length / CONDITION_QS.length) * 16);
    score += ownershipComplete ? 14 : Math.round((Object.keys(ownershipAnswers).length / OWNERSHIP_QS.length) * 14);
    score += signed ? 10 : 0;
    return Math.min(100, score);
  }, [photoComplete, videoComplete, conditionComplete, ownershipComplete, conditionAnswers, ownershipAnswers, signed]);

  const next = () => {
    const i = STEPS.findIndex((s) => s.id === step);
    if (i < STEPS.length - 1) setStep(STEPS[i + 1].id);
  };
  const prev = () => {
    const i = STEPS.findIndex((s) => s.id === step);
    if (i > 0) setStep(STEPS[i - 1].id);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-black text-white px-6 py-16 flex items-center justify-center">
        <div className="max-w-xl w-full bg-[#0a0a0a] border border-green-500/30 rounded-2xl p-8 text-center shadow-[0_0_40px_rgba(34,197,94,0.15)]">
          <div className="w-14 h-14 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center mx-auto mb-4">
            <Check className="w-7 h-7 text-green-400" />
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tight text-white mb-2">
            Listing submitted to the Floor Market
          </h2>
          <p className="text-sm text-gray-400 leading-relaxed mb-6">
            Your vehicle is now in the Floor Market. Verified floor setters can review your listing, ask questions, and submit
            guaranteed floor bids.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => onNavigate('dashboard')}
              className="bg-green-500 hover:bg-green-400 text-black font-black text-xs uppercase tracking-widest px-5 py-3 rounded-full transition shadow-[0_0_24px_rgba(34,197,94,0.35)]"
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => onNavigate('floor-item')}
              className="bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white font-bold text-xs uppercase tracking-widest px-5 py-3 rounded-full transition"
            >
              View Floor Market Listing
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <FloorTopBar onNavigate={onNavigate} active="listing" />

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 pt-6 pb-20">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => onNavigate('dashboard')}
            className="inline-flex items-center gap-1.5 text-gray-500 hover:text-white text-xs font-bold uppercase tracking-widest mb-3 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </button>
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight">
            List <span className="text-green-500">your vehicle</span>
          </h1>
          <p className="text-sm text-gray-400 mt-1.5 max-w-2xl">
            Build trust, unlock better floor offers, and sell unreserved.
          </p>
        </div>

        {/* Stepper */}
        <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-3 md:p-4 mb-6">
          <StepperHeader current={step} onJump={setStep} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
          {/* Main wizard card */}
          <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-5 md:p-7">
            {step === 'basic' && (
              <Section title="Basic Vehicle Info" subtitle="Tell us the essentials. We’ll pre-fill anything we can from the VIN.">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextField label="Year" value={basic.year} onChange={(v) => setBasic({ ...basic, year: v })} />
                  <TextField label="Make" value={basic.make} onChange={(v) => setBasic({ ...basic, make: v })} />
                  <TextField label="Model" value={basic.model} onChange={(v) => setBasic({ ...basic, model: v })} />
                  <TextField label="Trim" value={basic.trim} onChange={(v) => setBasic({ ...basic, trim: v })} />
                  <TextField label="VIN" value={basic.vin} onChange={(v) => setBasic({ ...basic, vin: v })} />
                  <TextField label="Mileage (km)" value={basic.mileage} onChange={(v) => setBasic({ ...basic, mileage: v })} />
                  <TextField label="Location" value={basic.location} onChange={(v) => setBasic({ ...basic, location: v })} />
                  <TextField label="Drivetrain" value={basic.drivetrain} onChange={(v) => setBasic({ ...basic, drivetrain: v })} />
                  <TextField label="Engine" value={basic.engine} onChange={(v) => setBasic({ ...basic, engine: v })} />
                  <TextField label="Transmission" value={basic.transmission} onChange={(v) => setBasic({ ...basic, transmission: v })} />
                  <TextField label="Ownership status" value={basic.ownership} onChange={(v) => setBasic({ ...basic, ownership: v })} />
                </div>
              </Section>
            )}

            {step === 'photos' && (
              <Section
                title="Photos"
                subtitle="Twelve photo tasks. AI reviews each one — clearer photos mean a stronger Trust Score."
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {PHOTO_TASKS.map((t) => (
                    <TaskTile key={t.label} label={t.label} status={t.status} kind="photo" />
                  ))}
                </div>
              </Section>
            )}

            {step === 'videos' && (
              <Section title="Videos" subtitle="Short clips. Daylight and clean audio score best.">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {VIDEO_TASKS.map((t) => (
                    <TaskTile key={t.label} label={t.label} status={t.status} kind="video" />
                  ))}
                </div>
              </Section>
            )}

            {step === 'condition' && (
              <Section title="Condition checklist" subtitle="Be honest. Misrepresenting condition can void guarantees.">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {CONDITION_QS.map((q) => (
                    <YesNo
                      key={q}
                      q={q}
                      value={conditionAnswers[q] ?? null}
                      onChange={(v) => setConditionAnswers((s) => ({ ...s, [q]: v }))}
                    />
                  ))}
                </div>
              </Section>
            )}

            {step === 'ownership' && (
              <Section title="Ownership" subtitle="Clean title and lien proof unlock the strongest floor offers.">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {OWNERSHIP_QS.map((q) => (
                    <YesNo
                      key={q}
                      q={q}
                      value={ownershipAnswers[q] ?? null}
                      onChange={(v) => setOwnershipAnswers((s) => ({ ...s, [q]: v }))}
                    />
                  ))}
                </div>
              </Section>
            )}

            {step === 'review' && (
              <Section title="Seller truth declaration" subtitle="Final step. Sign to send your listing to the Floor Market.">
                <div className="bg-[#0d0d0d] border border-white/10 rounded-xl p-4 mb-4">
                  <p className="text-[12px] text-gray-300 leading-relaxed">
                    I certify that the information provided is accurate and complete to the best of my knowledge. I understand
                    that floor offers are based on this information. Material false or misleading information may void any
                    guarantee and may result in cancellation fees or account penalties.
                  </p>
                </div>
                <label className="flex items-start gap-3 mb-4 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={signed}
                    onChange={(e) => setSigned(e.target.checked)}
                    className="mt-1 w-4 h-4 accent-green-500"
                  />
                  <span className="text-[12px] text-gray-300">I agree to the declaration above.</span>
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-black uppercase tracking-[0.18em] text-gray-500">Signature</span>
                  <input
                    value={signature}
                    onChange={(e) => setSignature(e.target.value)}
                    placeholder="Type your full legal name"
                    className="bg-[#111] border border-white/10 focus:border-green-500/40 focus:ring-2 focus:ring-green-500/15 outline-none text-sm font-medium text-white placeholder-gray-600 rounded-lg px-3 py-2.5 transition-all"
                  />
                </label>
              </Section>
            )}

            {/* Step nav */}
            <div className="flex items-center justify-between gap-3 mt-7 pt-5 border-t border-white/5">
              <button
                onClick={prev}
                disabled={step === 'basic'}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-white text-[11px] font-bold uppercase tracking-widest transition disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Back
              </button>

              <div className="flex items-center gap-2">
                <button className="px-4 py-2.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-white text-[11px] font-bold uppercase tracking-widest transition">
                  Save Draft
                </button>
                {step === 'review' ? (
                  <button
                    disabled={!signed || !signature}
                    onClick={() => setSubmitted(true)}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-green-500 hover:bg-green-400 disabled:bg-white/[0.06] disabled:text-gray-600 text-black text-[11px] font-black uppercase tracking-widest transition shadow-[0_0_20px_rgba(34,197,94,0.35)] disabled:shadow-none"
                  >
                    Submit to Floor Market <Sparkles className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={next}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-green-500 hover:bg-green-400 text-black text-[11px] font-black uppercase tracking-widest transition shadow-[0_0_20px_rgba(34,197,94,0.35)]"
                  >
                    Continue <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Trust Score sidebar */}
          <aside className="space-y-4">
            <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-5 sticky top-4">
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="w-4 h-4 text-green-400" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Trust Score</span>
              </div>
              <div className="flex items-baseline gap-1.5 mb-3">
                <span className="text-5xl font-black tabular-nums text-white leading-none">{trustScore}</span>
                <span className="text-sm font-bold text-gray-500">/100</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden mb-5">
                <div
                  className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-500"
                  style={{ width: `${trustScore}%` }}
                />
              </div>

              <div className="space-y-2.5 text-[11px]">
                <TrustRow label="Basic Info" status="Complete" />
                <TrustRow label="Photos" status={`${photoComplete}/${PHOTO_TASKS.length} complete`} done={photoComplete === PHOTO_TASKS.length} />
                <TrustRow label="Videos" status={`${videoComplete}/${VIDEO_TASKS.length} complete`} done={videoComplete === VIDEO_TASKS.length} />
                <TrustRow label="Condition" status={conditionComplete ? 'Complete' : 'Pending'} done={conditionComplete} />
                <TrustRow label="Ownership" status={ownershipComplete ? 'Complete' : 'Pending'} done={ownershipComplete} />
                <TrustRow label="Seller Declaration" status={signed && signature ? 'Complete' : 'Pending'} done={signed && !!signature} />
              </div>

              <div className="mt-5 pt-4 border-t border-white/5">
                <div className="flex items-start gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-green-400 mt-0.5 shrink-0" />
                  <p className="text-[11px] text-gray-400 leading-snug">
                    Higher trust can unlock <span className="text-green-300 font-bold">stronger floor offers</span> from
                    verified floor setters.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-yellow-400" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Honesty pays</span>
              </div>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Floor setters reward sellers who disclose known issues. Hidden problems discovered later result in lower or
                cancelled floor guarantees.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

const Section: React.FC<{ title: string; subtitle?: string; children: React.ReactNode }> = ({ title, subtitle, children }) => (
  <div>
    <div className="mb-5">
      <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white">{title}</h2>
      {subtitle && <p className="text-[12px] text-gray-500 mt-1">{subtitle}</p>}
    </div>
    {children}
  </div>
);

const TaskTile: React.FC<{ label: string; status: PhotoStatus; kind: 'photo' | 'video' }> = ({ label, status, kind }) => {
  const isMissing = status === 'Missing';
  const Icon = kind === 'photo' ? Camera : Video;
  return (
    <button
      className={`group text-left rounded-xl border p-3 transition ${
        isMissing
          ? 'bg-[#0d0d0d] border-white/10 hover:border-green-500/40'
          : 'bg-green-500/5 border-green-500/20 hover:border-green-500/40'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div
          className={`w-7 h-7 rounded-md flex items-center justify-center ${
            isMissing ? 'bg-white/5 text-gray-500' : 'bg-green-500/15 text-green-400'
          }`}
        >
          <Icon className="w-3.5 h-3.5" />
        </div>
        <PhotoStatusBadge status={status} />
      </div>
      <div className="text-[12px] font-semibold text-white leading-snug">{label}</div>
      {isMissing && (
        <div className="text-[10px] text-gray-500 mt-1 font-medium uppercase tracking-wider">Tap to upload</div>
      )}
    </button>
  );
};

const TrustRow: React.FC<{ label: string; status: string; done?: boolean }> = ({ label, status, done = true }) => (
  <div className="flex items-center justify-between">
    <span className="flex items-center gap-2 text-gray-300">
      {done ? (
        <Check className="w-3 h-3 text-green-400" />
      ) : (
        <CircleDashed className="w-3 h-3 text-gray-500" />
      )}
      {label}
    </span>
    <span className={`font-bold ${done ? 'text-green-300' : 'text-gray-500'}`}>{status}</span>
  </div>
);

// Top bar reused across pages
export const FloorTopBar: React.FC<{
  onNavigate: (page: string) => void;
  active: 'listing' | 'dashboard' | 'floor-item';
}> = ({ onNavigate, active }) => (
  <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-md border-b border-white/5">
    <div className="max-w-[1400px] mx-auto px-4 md:px-8 h-14 flex items-center justify-between">
      <button onClick={() => onNavigate('home')} className="flex items-baseline group select-none">
        <span className="font-black text-lg tracking-tight text-white uppercase">UNRESERVED</span>
        <span className="ml-1 text-[10px] font-black uppercase tracking-[0.15em] text-green-500 self-start mt-0.5">NET</span>
      </button>
      <nav className="hidden md:flex items-center gap-1">
        {[
          { id: 'listing', label: 'List Vehicle' },
          { id: 'dashboard', label: 'Dashboard' },
          { id: 'floor-item', label: 'Floor Market' },
        ].map((n) => (
          <button
            key={n.id}
            onClick={() => onNavigate(n.id)}
            className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest transition ${
              active === n.id ? 'bg-green-500 text-black' : 'text-gray-300 hover:bg-white/[0.06] hover:text-white'
            }`}
          >
            {n.label}
          </button>
        ))}
      </nav>
      <div className="flex items-center gap-2">
        <div className="hidden md:flex items-center gap-2 bg-white/[0.04] border border-white/10 rounded-full px-3 py-1.5">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300">7 floor setters live</span>
        </div>
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-500 to-emerald-700 flex items-center justify-center ring-1 ring-white/15">
          <span className="text-xs font-black text-black">JR</span>
        </div>
      </div>
    </div>
  </header>
);
