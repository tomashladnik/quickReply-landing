// src/app/(public)/Dentalscandemo/WhyItMattersSection.tsx
import { Users, Clock, TrendingUp } from "lucide-react";

export default function WhyItMattersSection() {
  return (
    <section className="py-20 bg-linear-to-br from-[#4ebff7] via-[#3da5d9] to-[#2c8bb8] text-white relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
          backgroundSize: "50px 50px",
        }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Better Care. Less Work. Higher Revenue.
          </h2>
          <p className="text-xl text-white/90 max-w-4xl mx-auto">
            DentalScan allows your practice to maintain consistent preventive
            care, even outside the office
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <Users className="w-10 h-10" />,
              stat: "95%",
              statLabel: "Patient Satisfaction",
              title: "Improved Experience",
              description:
                "Convenient remote check-ins strengthen long-term retention and build trust with patients",
            },
            {
              icon: <Clock className="w-10 h-10" />,
              stat: "10hrs",
              statLabel: "Saved Per Week",
              title: "Time Efficiency",
              description:
                "Automated documentation and claim preparation drastically reduces administrative burden",
            },
            {
              icon: <TrendingUp className="w-10 h-10" />,
              stat: "+40%",
              statLabel: "Revenue Growth",
              title: "Practice Growth",
              description:
                "More completed check-ins mean more documented visits and higher approval rates",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all group"
            >
              <div className="mb-6 opacity-90 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <div className="text-6xl font-bold mb-2">{item.stat}</div>
              <div className="text-white/80 text-sm font-semibold mb-6 uppercase tracking-wide">
                {item.statLabel}
              </div>
              <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
              <p className="text-white/90 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
