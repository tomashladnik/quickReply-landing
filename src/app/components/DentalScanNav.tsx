"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { MoreVertical, X } from "lucide-react";

interface DentalScanNavProps {
  activePage?: 'charity' | 'gyms' | 'schools' | 'employers' | 'privacy' | 'home';
  onOpenDemo?: () => void;
}

export default function DentalScanNav({ activePage, onOpenDemo }: DentalScanNavProps) {
  const isMainPage = activePage === 'home';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
const DASHBOARD_URL = "https://dashboard.dentalscan.us/entrance/dentalscan/select-organization";  
  return (
    <>
      <header className="sticky top-0 z-50 w-full h-[80px] bg-white shadow-[0_0_22px_#4ebff740] backdrop-blur-lg flex items-center px-4 sm:px-6 md:px-10 lg:px-58">
        <Link href="/" className="z-20 flex items-center">
          <Image src="/DentalScan.png" alt="DentalScan Logo" width={100} height={100} className="object-cover rounded-lg w-[82px] h-[46px]" />
        </Link>
        <div className="hidden md:flex ml-8 lg:ml-12">
          {isMainPage ? (
            <a href="#" className="font-medium text-black text-base hover:text-gray-600 transition-colors" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Home</a>
          ) : (
            <Link href="/dentalscan" className="font-medium text-black text-base hover:text-gray-600 transition-colors">Home</Link>
          )}
        </div>
        <nav className="hidden md:flex items-center gap-x-4 lg:gap-x-6 flex-1 justify-center">
          <Link href="/dentalscan/charity" className={`font-medium text-base transition-colors ${activePage === 'charity' ? 'text-[#4EBFF7] border-b-2 border-[#4EBFF7] pb-1' : 'text-black hover:text-gray-600'}`}>Charity</Link>
          <Link href="/dentalscan/schools" className={`font-medium text-base transition-colors ${activePage === 'schools' ? 'text-[#4EBFF7] border-b-2 border-[#4EBFF7] pb-1' : 'text-black hover:text-gray-600'}`}>Schools</Link>
          <Link href="/dentalscan/gyms" className={`font-medium text-base transition-colors ${activePage === 'gyms' ? 'text-[#4EBFF7] border-b-2 border-[#4EBFF7] pb-1' : 'text-black hover:text-gray-600'}`}>Gyms</Link>
          <Link href="/dentalscan/employers" className="font-medium text-black text-base hover:text-gray-600 transition-colors">Employers</Link>
          <Link href="/dentalscan/privacy" className={`font-medium text-base transition-colors ${activePage === 'privacy' ? 'text-[#4EBFF7] border-b-2 border-[#4EBFF7] pb-1' : 'text-black hover:text-gray-600'}`}>Privacy</Link>
          <a href={isMainPage ? "#features" : "/dentalscan#features"} className="font-medium text-black text-base hover:text-gray-600 transition-colors">Key Features</a>
          <a href={isMainPage ? "#how-it-works" : "/dentalscan#how-it-works"} className="font-medium text-black text-base hover:text-gray-600 transition-colors">How It Works</a>
          <a href={isMainPage ? "#faq" : "/dentalscan#faq"} className="font-medium text-black text-base hover:text-gray-600 transition-colors">FAQ</a>
        </nav>
        <div className="hidden md:flex gap-x-3">
          <a href={DASHBOARD_URL} className="px-5 py-2 text-lg font-semibold border-2 border-[#4EBFF7] text-[#4EBFF7] rounded-lg transition-all duration-300 hover:bg-[#4EBFF7] hover:text-white">Log In</a>
          {isMainPage && onOpenDemo ? (
            <button onClick={onOpenDemo} className="px-6 py-2 text-xl font-semibold bg-gradient-to-r from-[#4EBFF7] to-[#35A3E8] text-white rounded-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-300/40 hover:saturate-150">Get Started</button>
          ) : (
            <Link href="/dentalscan" className="px-6 py-2 text-xl font-semibold bg-gradient-to-r from-[#4EBFF7] to-[#35A3E8] text-white rounded-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-300/40 hover:saturate-150">Get Started</Link>
          )}
        </div>
        <div className="md:hidden ml-auto flex items-center">
          <button onClick={() => setMobileMenuOpen(true)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors" aria-label="Open menu">
            <MoreVertical className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      </header>
      {mobileMenuOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={() => setMobileMenuOpen(false)} />}
      <div className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex flex-col h-full">
          <div className="bg-gradient-to-r from-[#4EBFF7] to-[#35A3E8] p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Menu</h3>
              <button onClick={() => setMobileMenuOpen(false)} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-blue-100">Navigate DentalScan</p>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <nav className="space-y-2">
              <div className="pb-2 border-b border-gray-200 mb-4">
                {isMainPage ? (
                  <a href="#" onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-[#4EBFF7] font-medium">Home</a>
                ) : (
                  <Link href="/dentalscan" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-[#4EBFF7] font-medium">Home</Link>
                )}
              </div>
              <Link href="/dentalscan/charity" onClick={() => setMobileMenuOpen(false)} className={`block px-4 py-3 rounded-lg font-medium ${activePage === 'charity' ? 'bg-blue-50 text-[#4EBFF7] border-l-4 border-[#4EBFF7]' : 'text-gray-700 hover:bg-gray-50'}`}>Charity</Link>
              <Link href="/dentalscan/schools" onClick={() => setMobileMenuOpen(false)} className={`block px-4 py-3 rounded-lg font-medium ${activePage === 'schools' ? 'bg-blue-50 text-[#4EBFF7] border-l-4 border-[#4EBFF7]' : 'text-gray-700 hover:bg-gray-50'}`}>Schools</Link>
              <Link href="/dentalscan/gyms" onClick={() => setMobileMenuOpen(false)} className={`block px-4 py-3 rounded-lg font-medium ${activePage === 'gyms' ? 'bg-blue-50 text-[#4EBFF7] border-l-4 border-[#4EBFF7]' : 'text-gray-700 hover:bg-gray-50'}`}>Gyms</Link>
              <Link href="/dentalscan/employers" onClick={() => setMobileMenuOpen(false)} className={`block px-4 py-3 rounded-lg font-medium ${activePage === 'employers' ? 'bg-blue-50 text-[#4EBFF7] border-l-4 border-[#4EBFF7]' : 'text-gray-700 hover:bg-gray-50'}`}>Employers</Link>
              <Link href="/dentalscan/privacy" onClick={() => setMobileMenuOpen(false)} className={`block px-4 py-3 rounded-lg font-medium ${activePage === 'privacy' ? 'bg-blue-50 text-[#4EBFF7] border-l-4 border-[#4EBFF7]' : 'text-gray-700 hover:bg-gray-50'}`}>Privacy</Link>
              <div className="pt-4 border-t border-gray-200">
                <a href={isMainPage ? "#features" : "/dentalscan#features"} onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 font-medium">Key Features</a>
                <a href={isMainPage ? "#how-it-works" : "/dentalscan#how-it-works"} onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 font-medium">How It Works</a>
                <a href={isMainPage ? "#faq" : "/dentalscan#faq"} onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 font-medium">FAQ</a>
              </div>
            </nav>
            <div className="mt-6 px-4 space-y-3">
              <a href={DASHBOARD_URL} className="block w-full px-6 py-3 text-lg font-semibold border-2 border-[#4EBFF7] text-[#4EBFF7] rounded-lg text-center hover:bg-[#4EBFF7] hover:text-white transition-all">Log In</a>
              {isMainPage && onOpenDemo ? (
                <button onClick={() => { setMobileMenuOpen(false); onOpenDemo(); }} className="w-full px-6 py-3 text-lg font-semibold bg-gradient-to-r from-[#4EBFF7] to-[#35A3E8] text-white rounded-lg shadow-lg">Get Started</button>
              ) : (
                <Link href="/dentalscan" onClick={() => setMobileMenuOpen(false)} className="block w-full px-6 py-3 text-lg font-semibold bg-gradient-to-r from-[#4EBFF7] to-[#35A3E8] text-white rounded-lg shadow-lg text-center">Get Started</Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}