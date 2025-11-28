import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DentalScan - Teledentistry Platform | ReplyQuick",
  description:
    "DentalScan helps dental offices perform remote preventive check-ups, detect oral health concerns, and automatically prepare insurance claims.",
};

export default function DentalscanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
