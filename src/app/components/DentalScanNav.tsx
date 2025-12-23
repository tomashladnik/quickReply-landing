import Link from "next/link";
import Image from "next/image";

interface DentalScanNavProps {
  activePage?: 'charity' | 'gyms' | 'schools' | 'privacy' | 'home';
  onOpenDemo?: () => void;
}

export default function DentalScanNav({ activePage, onOpenDemo }: DentalScanNavProps) {
  const isMainPage = activePage === 'home';
  
  return (
    <header className="sticky top-0 z-50 w-full h-[80px] bg-white shadow-[0_0_22px_#4ebff740] backdrop-blur-lg flex items-center px-4 sm:px-6 md:px-10 lg:px-58">
      {/* Logo */}
      <Link href="/" className="z-20">
        <Image
          src="/logo.png"
          alt="ReplyQuick Logo"
          width={100}
          height={100}
          className="object-cover rounded-lg w-[82px] h-[46px]"
        />
      </Link>

      {/* Home - Left Side */}
      <div className="hidden md:flex ml-8 lg:ml-12">
        {isMainPage ? (
          <a
            href="#"
            className="font-medium text-black text-base hover:text-gray-600 transition-colors"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            Home
          </a>
        ) : (
          <Link
            href="/dentalscan"
            className="font-medium text-black text-base hover:text-gray-600 transition-colors"
          >
            Home
          </Link>
        )}
      </div>

      {/* Center Nav */}
      <nav className="hidden md:flex items-center gap-x-4 lg:gap-x-6 flex-1 justify-center">
        <Link
          href="/dentalscan/charity"
          className={`font-medium text-base transition-colors ${
            activePage === 'charity' 
              ? 'text-[#4EBFF7] border-b-2 border-[#4EBFF7] pb-1' 
              : 'text-black hover:text-gray-600'
          }`}
        >
          Charity
        </Link>
        <Link
          href="/dentalscan/schools"
          className={`font-medium text-base transition-colors ${
            activePage === 'schools' 
              ? 'text-[#4EBFF7] border-b-2 border-[#4EBFF7] pb-1' 
              : 'text-black hover:text-gray-600'
          }`}
        >
          Schools
        </Link>
        <Link
          href="/dentalscan/gyms"
          className={`font-medium text-base transition-colors ${
            activePage === 'gyms' 
              ? 'text-[#4EBFF7] border-b-2 border-[#4EBFF7] pb-1' 
              : 'text-black hover:text-gray-600'
          }`}
        >
          Gyms
        </Link>
        <Link
          href="/dentalscan/privacy"
          className={`font-medium text-base transition-colors ${
            activePage === 'privacy' 
              ? 'text-[#4EBFF7] border-b-2 border-[#4EBFF7] pb-1' 
              : 'text-black hover:text-gray-600'
          }`}
        >
          Privacy
        </Link>
        <a
          href={isMainPage ? "#features" : "/dentalscan#features"}
          className="font-medium text-black text-base hover:text-gray-600 transition-colors"
        >
          Key Features
        </a>
        <a
          href={isMainPage ? "#how-it-works" : "/dentalscan#how-it-works"}
          className="font-medium text-black text-base hover:text-gray-600 transition-colors"
        >
          How It Works
        </a>
        <a
          href={isMainPage ? "#faq" : "/dentalscan#faq"}
          className="font-medium text-black text-base hover:text-gray-600 transition-colors"
        >
          FAQ
        </a>
      </nav>

      {/* CTA Button */}
      <div className="hidden md:flex">
        {isMainPage && onOpenDemo ? (
          <button
            onClick={onOpenDemo}
            className="px-6 py-2 text-xl font-semibold bg-gradient-to-r from-[#4EBFF7] to-[#35A3E8] text-white rounded-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-300/40 hover:saturate-150"
          >
            Get Started
          </button>
        ) : (
          <Link
            href="/dentalscan"
            className="px-6 py-2 text-xl font-semibold bg-gradient-to-r from-[#4EBFF7] to-[#35A3E8] text-white rounded-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-300/40 hover:saturate-150"
          >
            Get Started
          </Link>
        )}
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center z-30">
        {isMainPage && onOpenDemo ? (
          <button
            onClick={onOpenDemo}
            className="px-4 py-2 bg-[#4ebff7] text-white rounded-lg font-semibold text-sm hover:bg-[#3da5d9] transition-colors"
          >
            Get Started
          </button>
        ) : (
          <Link
            href="/dentalscan"
            className="px-4 py-2 bg-[#4ebff7] text-white rounded-lg font-semibold text-sm hover:bg-[#3da5d9] transition-colors"
          >
            Get Started
          </Link>
        )}
      </div>
    </header>
  );
}