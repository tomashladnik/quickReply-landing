import { FeatureData } from "@/app/lib/types/types";

// Navigation items data
export const navItems = [
  {
    index: 0,
    label: "DentalScan",
    href: "/dentalscan",
  },
  {
    index: 1,
    label: "Home",
    href: "/",
  },
  {
    index: 2,
    label: "Key Features",
    href: "/#call-to-action",
  },
  {
    index: 3,
    label: "How it works",
    href: "/#how-it-works",
  },
  {
    index: 4,
    label: "FAQ",
    href: "/#faq-section",
  },
];

export const features: FeatureData[] = [
  {
    title: "Instant Lead Rescue",
    icons: [
      { src: "/vector-2.svg", className: "w-[26px] h-[15px] top-2 left-[3px]" },
    ], // Preserved original classes
  },
  {
    title: "24/7 Call Handling",
    icons: [
      { src: "/vector-1.svg", className: "w-[21px] h-[30px] top-0 left-[5px]" },
    ], // Preserved original classes
  },
  {
    title: "Seamless Integration",
    icons: [
      {
        src: "/vector.svg",
        className: "w-[18px] h-[18px] top-[5px] left-[7px]",
      }, // Preserved original classes
      { src: "/vector-5.svg", className: "w-8 h-7 top-0 left-0" }, // Preserved original classes
      {
        src: "/vector-11.svg",
        className: "w-1.5 h-1.5 top-[11px] left-[13px]",
      }, // Preserved original classes
    ],
  },
  {
    title: "Enterprise Security",
    icons: [
      { src: "/vector-4.svg", className: "w-[19px] h-6 top-1 left-[7px]" },
    ], // Preserved original classes
  },
  {
    title: "Real-Time Analytics",
    icons: [
      { src: "/vector-10.svg", className: "w-[25px] h-[25px] top-1 left-1" },
    ], // Preserved original classes
  },
  {
    title: "Appointment Booking",
    icons: [{ src: "/vector-7.svg", className: "w-6 h-6 top-1 left-1" }],
  },
];

export const faqItems = [
  {
    question: "How does ReplyQuick improve our customer experience?",
    answer:
      "ReplyQuick follows up with missed calls in seconds, so customers get fast answers instead of voicemail or silence. That means better service, less frustration, and more business for you, without adding to your team’s workload.",
  },
  {
    question: "How fast can we get ReplyQuick running?",
    answer:
      "Most businesses are live within 48–72 hours. No downtime, no disruption, we handle the full setup while you keep running like normal.",
  },
  {
    question: "Will this disrupt our current phone or system setup?",
    answer:
      "Not at all. ReplyQuick works alongside your existing phone system. Your team keeps doing their job, we just handle the missed calls you don’t have time for.",
  },
  {
    question: "What’s the real cost savings?",
    answer:
      "ReplyQuick costs far less than hiring staff and works 24/7. Most businesses save 60–80% on missed call losses and avoid paying for extra phone support or after-hours coverage.",
  },
  {
    question: "How secure is our customer data?",
    answer:
      "We use bank-level encryption to protect every message and call. No data is shared or sold, your customers’ privacy is fully protected, always.",
  },
  {
    question: "What happens when a customer needs human help?",
    answer:
      "We instantly pass the conversation to your team with full context. Your staff sees the full history and can jump in without missing a beat, no repeating, no confusion.",
  },
  {
    question: "What kind of insights and analytics will we get?",
    answer:
      "You’ll see when calls come in, which ones turn into leads, and where you’re losing opportunities. All data is organized in a simple dashboard to help you improve follow-up and conversions.",
  },
  {
    question: "Can ReplyQuick collect payments and schedule appointments?",
    answer:
      "Yes. We can trigger payment links through your CRM or invoicing tools and fully book appointments using your connected calendar or system, all automated.",
  },
  {
    question: "Can ReplyQuick make outbound calls too?",
    answer:
      "Yes. We can run outbound campaigns to follow up with leads, re-engage past customers, or confirm appointments. Just let us know and we’ll activate it for you.",
  },
  {
    question: "Can I manage multiple businesses with ReplyQuick?",
    answer:
      "Absolutely. You can manage multiple brands under one account, each with its own scripts, settings, and messaging, all easily organized in one dashboard.",
  },
];

export const comparisonData = [
  {
    feature: "Lead Follow-Up Speed",
    others: "Manual/ Delayed",
    replyQuick: "Instant, automated",
  },
  {
    feature: "Missed Call Recovery",
    others: "Missed or lost",
    replyQuick: "Recovered automatically",
  },
  {
    feature: "Operating Hours",
    others: "Limited to staff availability",
    replyQuick: "24/7 lead capture",
  },
  {
    feature: "Staff Requirement",
    others: "Requires live receptionist",
    replyQuick: "Fully automated",
  },
  {
    feature: "Conversion Consistency",
    others: "Inconsistent",
    replyQuick: "Structured + trackable",
  },
  {
    feature: "Lead Tracking & Visibility",
    others: "Scattered notes",
    replyQuick: "Real-time dashboard",
  },
];

export const allTestimonials = [
  {
    name: "Airflow Conditioning",
    quote:
      "Before ReplyQuick, we were missing tons of calls during jobs and after hours. Now every missed call gets a fast text, and we’re booking more appointments without hiring anyone new. It feels like we finally stopped leaving money on the table.",
    logo: "/companylogos/airflow conditioning.png",
  },
  {
    name: "Artic Mechanical",
    quote:
      "ReplyQuick has completely changed how we handle incoming leads. We don’t worry about missed calls anymore, customers get an instant response, and we stay booked without chasing anyone down. It’s like having a 24/7 front desk without the overhead.",
    logo: "/companylogos/artic mechanical.png",
  },
  {
    name: "Sunshine Electric",
    quote:
      "We used to lose jobs just because we couldn’t answer the phone fast enough. With ReplyQuick, every missed call turns into a follow-up message, and most end up turning into real customers. It’s working in the background while we’re out in the field.",
    logo: "/companylogos/sunshine electric.png",
  },
  {
    name: "Safe Electric",
    quote:
      "ReplyQuick makes sure no call slips through the cracks. Even when we're tied up on job sites, our customers still hear from us fast. It's helped us close more jobs and look way more professional.",
    logo: "/companylogos/safe electric.png",
  },
  {
    name: "Wizard Electric",
    quote:
      "It’s like having a smart assistant that never sleeps. Every missed call gets a fast message, and we've picked up jobs we would’ve totally lost before. Super easy to set up, and it just works.",
    logo: "/companylogos/wizzard electric.png",
  },
  {
    name: "Brown and Taylor Law Firm",
    quote:
      "We can't afford to miss potential clients, especially during high-volume hours. ReplyQuick follows up with every missed call instantly and filters out the time-wasters. It’s made our intake process smoother and more efficient.",
    logo: "/companylogos/brown and taylor.png",
  },
  {
    name: "Miller & Associates Law Firm",
    quote:
      "ReplyQuick has helped us capture more qualified leads without hiring extra staff. Now even after-hours inquiries are handled quickly and professionally. It’s become an essential part of our client acquisition strategy.",
    logo: "/companylogos/miller associates.png",
  },
  {
    name: "Smith & Johnson Law Firm",
    quote:
      "People expect fast replies from law firms, if we miss a call, they usually move on. With ReplyQuick, they get a message right away, and we’ve seen a clear jump in consultations booked because of it.",
    logo: "/companylogos/smith and johnson.png",
  },
  {
    name: "Celine Med Spa",
    quote:
      "Our front desk used to miss calls during busy hours, and we were losing appointments because of it. ReplyQuick now handles that follow-up instantly, and our calendar stays full, without overwhelming the staff.",
    logo: "/companylogos/celine med spa.png",
  },
  {
    name: "Skin Healthy Med Spa",
    quote:
      "We saw an immediate difference. Clients who would’ve gone silent after a missed call now get a text right away, and many end up booking. It’s like having a second front desk that never forgets to follow up.",
    logo: "/companylogos/skin healthy.png",
  },
  {
    name: "SpaJoli Med Spa",
    quote:
      "ReplyQuick made our med spa feel more responsive overnight. Clients get instant replies, book directly, and we don’t have to chase them down. It’s a must-have for any modern spa.",
    logo: "/companylogos/SpaJoli.png",
  },
  {
    name: "Canyons Hotel",
    quote:
      "Before ReplyQuick, we missed guest calls during shift changes and peak hours. Now every missed call gets a follow-up, and we’re capturing more bookings without hiring more front desk staff.",
    logo: "/companylogos/canyons boutique hotel.png",
  },
  {
    name: "Dj Shield Hotel",
    quote:
      "ReplyQuick helped us stop losing reservation calls. Guests now get a text response instantly, and we’ve seen a noticeable increase in direct bookings, especially after hours.",
    logo: "/companylogos/Dj shield hotel.png",
  },
  {
    name: "Dutchman Hospitality Hotel",
    quote:
      "We run lean staff-wise, so ReplyQuick has been a game changer. It handles missed inquiries with a personal touch and helps us book rooms even when no one’s at the desk.",
    logo: "/companylogos/dutchman hospitality.png",
  },
  {
    name: "Inn at the beach Hotel",
    quote:
      "It’s common for us to miss calls while helping walk-in guests. With ReplyQuick, those calls now get a text within seconds, and we’re converting way more last-minute bookings.",
    logo: "/companylogos/inn at the beach.png",
  },
  {
    name: "Kinship Landing Hotel",
    quote:
      "Our brand is all about connection, and ReplyQuick fits right in. It keeps us responsive even when we’re at capacity, and guests appreciate the fast, helpful replies.",
    logo: "/companylogos/kinship landing hotel.png",
  },
  {
    name: "The Reserve Retreat Hotel",
    quote:
      "ReplyQuick feels like a full-time concierge that never sleeps. Missed calls now turn into bookings automatically, and we’ve saved hours a week on follow-up.",
    logo: "/companylogos/the reserve retreat.png",
  },
];
