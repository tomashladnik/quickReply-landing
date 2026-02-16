"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../../ui/button";
import { navItems } from "../../../../../public/config/data.config";

export const ServiceBenefitsSection = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <header className="sticky top-0 z-50 w-full h-[80px] bg-white shadow-[0_0_22px_#4ebff740] backdrop-blur-lg flex items-center justify-between px-4 sm:px-6 md:px-10 lg:px-58">
      {/* Logo */}
      <Link href="/" className="z-20 flex items-center">
        <Image
          src="/DentalScan.png"
          alt="DentalScan Logo"
          width={200}
          height={80}
          className="h-20 w-auto object-cover rounded-lg"
        />
      </Link>

      {/* Desktop Nav */}
      <nav className="hidden md:flex items-center gap-x-6 lg:gap-x-20">
        {navItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="font-medium text-black text-base hover:text-gray-600 transition-colors"
          >
            {item.label}
          </a>
        ))}
      </nav>

      {/* CTA Button */}
      <div className="hidden md:flex">
        <Button
          variant="gradient"
          className="px-6 py-2 text-xl font-semibold shimmer-effect hover:cursor-pointer"
          onClick={() =>
            document
              .getElementById("contact")
              ?.scrollIntoView({ behavior: "smooth" })
          }
        >
          Get Started
        </Button>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center z-30">
        <button
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
          className="text-black p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {isMobileMenuOpen ? (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu Panel */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-[72px] left-0 w-full bg-white shadow-lg py-6 px-4 flex flex-col items-center space-y-4 animate-slideInDown z-20">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="w-full text-center text-lg font-medium text-black hover:text-gray-600 transition-colors py-2"
              onClick={toggleMobileMenu}
            >
              {item.label}
            </a>
          ))}
          <Button
            variant="gradient"
            className="w-full shimmer-effect bg-gradient-to-r from-[#4EBFF7] to-[#35A3E8] text-white px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-300/40 hover:saturate-150 inline-flex items-center justify-center hover:cursor-pointer"
            onClick={toggleMobileMenu}
          >
            Get Started
          </Button>
        </div>
      )}
    </header>
  );
};
