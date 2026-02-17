"use client";

import React from "react";
import { XCircle, CheckCircle } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card"; // Assuming Shadcn UI Card

// Data remains the same
const comparisonData = [
  { feature: "Response Rate", without: "10-20%", with: "92%+" },
  {
    feature: "Lead Qualification",
    without: "Manual, inconsistent",
    with: "Automated, 24/7",
  },
  {
    feature: "Appointment Booking",
    without: "Phone tag, slow",
    with: "Instant, self-service",
  },
  { feature: "Availability", without: "Business hours only", with: "24/7/365" },
  { feature: "Lost Revenue", without: "High", with: "Minimized" },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export const DifferenceSection = () => {
  return (
    // This container stacks the two comparison cards vertically.
    <div className="w-full max-w-lg mx-auto flex flex-col gap-8">
      {/* --- Card 1: Without ReplyQuick --- */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={fadeInUp}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full bg-white rounded-2xl shadow-lg border-gray-100">
          <CardContent className="p-6 sm:p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">
              Without ReplyQuick
            </h3>
            <ul className="space-y-4">
              {comparisonData.map((item, index) => (
                <li key={index} className="flex items-start">
                  <XCircle className="h-6 w-6 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-gray-900">
                      {item.feature}:
                    </span>{" "}
                    <span className="text-gray-600">{item.without}</span>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </motion.div>

      {/* --- Card 2: With ReplyQuick --- */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={fadeInUp}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {/* Added relative and overflow-hidden for the watermark */}
        <Card className="w-full rounded-2xl shadow-lg border-none text-white bg-gradient-to-br from-[#4EBFF7] to-[#35A3E8] relative overflow-hidden">
          <CardContent className="p-6 sm:p-8">
            <h3 className="text-xl font-bold mb-6">With ReplyQuick</h3>
            <ul className="space-y-4">
              {comparisonData.map((item, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="h-6 w-6 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold">{item.feature}:</span>{" "}
                    <span>{item.with}</span>
                  </div>
                </li>
              ))}
            </ul>
            {/* Watermark Logo */}
            <Image
              src="/DentalScan.png" // Make sure this path is correct
              alt="DentalScan Watermark"
              width={150}
              height={150}
              className="absolute -bottom-5 -right-5 opacity-20 pointer-events-none"
              aria-hidden="true"
            />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default DifferenceSection;
