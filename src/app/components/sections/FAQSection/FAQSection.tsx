"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Linkedin, Instagram, Facebook, Youtube } from "lucide-react";

const exploreLinks = [
  { name: "Home", href: "/" },
  { name: "How it works", href: "/#how-it-works" },
  { name: "Case Studies", href: "/#case-studies" },
  { name: "FAQ", href: "/#faq-section" },
  { name: "Policies", href: "/privacy-policy/disclaimer" },
];

const socialLinks = [
  { icon: Linkedin, href: "https://www.linkedin.com/", target: "_blank" },
  { icon: Instagram, href: "https://www.instagram.com/", target: "_blank" },
  { icon: Facebook, href: "https://www.facebook.com/", target: "_blank" },
  { icon: Youtube, href: "https://www.youtube.com/", target: "_blank" },
];

export function Footer() {
  return (
    <footer className="w-full bg-[#4EBFF7] text-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 md:py-16 sm:px-6 lg:px-8">
        {/* --- CORE RESPONSIVE CHANGE --- */}
        {/* Simplified grid layout: Stacks on mobile, becomes 3-column on large screens. */}
        {/* This provides more space and a cleaner look on mobile. */}
        <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-3 lg:gap-x-8">
          {/* Logo and Tagline (First Column on LG screens) */}
          <div className="space-y-4">
            <Link href="/" className="rounded-lg overflow-hidden inline-block">
              <Image
                src="/DentalScan.png" // Make sure this path is correct
                alt="DenatlScan Logo"
                width={60}
                height={60}
              />
            </Link>
            <p className="text-sm text-white/80 max-w-xs leading-relaxed">
              Transforming missed calls into qualified leads for service
              businesses nationwide.
            </p>
          </div>

          {/* Links Grid (Second and Third Column on LG screens) */}
          {/* Responsive: Uses a 2-column grid on mobile, which is contained within a single column of the main grid. */}
          {/* On larger screens, this becomes part of the 3-column layout. */}
          <div className="grid grid-cols-2 gap-8 lg:col-span-2">
            {/* Explore Links */}
            <div>
              <h3 className="text-sm font-semibold tracking-wider uppercase">
                Explore
              </h3>
              <ul className="mt-4 space-y-3">
                {exploreLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-base text-white/80 transition hover:text-white"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Us */}
            <div>
              <h3 className="text-sm font-semibold tracking-wider uppercase">
                Contact Us
              </h3>
              <ul className="mt-4 space-y-3">
                <li>
                  <a
                    href="mailto:sales@replyquick.ai"
                    className="text-base text-white/80 transition hover:text-white"
                  >
                    sales@replyquick.ai
                  </a>
                </li>
                <li>
                  <a
                    href="tel:941-271-7374"
                    className="text-base text-white/80 transition hover:text-white"
                  >
                    941-271-7374
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright and Socials */}
        {/* This part was already perfectly responsive. Stacks on mobile, row on larger screens. */}
        <div className="mt-12 flex flex-col items-center justify-between border-t border-white/20 pt-8 sm:flex-row">
          <p className="text-sm text-center sm:text-left text-white/80">
            &copy; {new Date().getFullYear()} ReplyQuick. All rights reserved.
          </p>
          <div className="mt-4 flex space-x-4 sm:mt-0">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.href}
                target={social.target}
                rel="noopener noreferrer"
                className="text-white/80 transition hover:text-white"
              >
                {/* Screen reader text for accessibility */}
                <span className="sr-only">
                  {social.icon.displayName || social.href}
                </span>
                <social.icon className="h-6 w-6" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
