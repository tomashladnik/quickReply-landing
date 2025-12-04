"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useState } from "react";
import { ChevronDown } from "lucide-react";

const PrivacyLayout = ({ children }: { children: ReactNode }) => {
  const navItems = [
    { name: "Disclaimer", href: "/privacy-policy/disclaimer" },
    { name: "Privacy Policy", href: "/privacy-policy" },
    {name: "Terms & Conditions", href: "/privacy-policy/terms-and-conditions" },
    { name: "Cookie Policy", href: "/privacy-policy/cookie-policy" },
    { name: "LLC Sub-Processor", href: "/privacy-policy/llc-sub-processor" },
    { name: "Data Processing Agreement", href: "/privacy-policy/llc-data-agreement" },
  ];

  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-3">
              {/* Mobile Dropdown */}
              <div className="lg:hidden mb-8">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="flex w-full items-center justify-between rounded-md bg-gray-50 px-4 py-2 text-lg font-medium text-gray-700 hover:bg-gray-100"
                >
                  <span>Policies Menu</span>
                  <ChevronDown
                    className={`transform transition-transform ${
                      isMobileMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isMobileMenuOpen && (
                  <nav className="mt-2">
                    <ul role="list" className="space-y-1">
                      {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                          <li key={item.name}>
                            <Link
                              href={item.href}
                              className={`block rounded-md px-3 py-2 text-base font-medium leading-6 transition-colors ${
                                isActive
                                  ? "bg-[#4EBFF7] text-white"
                                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                              }`}
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              {item.name}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </nav>
                )}
              </div>

              {/* Desktop Sidebar */}
              <div className="hidden lg:block">
                <h2 className="text-2xl font-bold leading-10 tracking-tight text-gray-900">
                  Policies
                </h2>
                <nav className="mt-6">
                  <ul role="list" className="space-y-1">
                    {navItems.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <li key={item.name}>
                          <Link
                            href={item.href}
                            className={`block rounded-md px-3 py-2 text-base font-medium leading-6 transition-colors ${
                              isActive
                                ? "bg-[#4EBFF7] text-white"
                                : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                          >
                            {item.name}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </nav>
              </div>
            </div>
            <div className="lg:col-span-9 lg:mt-0">{children}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrivacyLayout;
