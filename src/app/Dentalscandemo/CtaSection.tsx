// src/app/(public)/Dentalscandemo/CtaSection.tsx
type CtaSectionProps = {
  onOpenDemo: () => void;
};

export default function CtaSection({ onOpenDemo }: CtaSectionProps) {
  return (
    <section className="py-20 bg-[#4ebff7] text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Let&apos;s Start Recovering Your Missed Leads
        </h2>
        <p className="text-xl text-white/90 mb-12">
          We&apos;ll show you exactly how much revenue you&apos;re leaving on
          the table.
        </p>
        <button
          onClick={onOpenDemo}
          className="px-10 py-5 bg-white text-[#4ebff7] rounded-lg font-bold text-xl hover:bg-gray-50 transition-all shadow-2xl hover:shadow-xl transform hover:-translate-y-1"
        >
          Get Started Now
        </button>
      </div>
    </section>
  );
}
