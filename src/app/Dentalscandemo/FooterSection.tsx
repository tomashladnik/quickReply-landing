// src/app/(public)/Dentalscandemo/FooterSection.tsx
import Image from "next/image";
import { Mail, Phone, Instagram, Linkedin, Twitter } from "lucide-react";

export default function FooterSection() {
  return (
    <footer className="bg-[#4ebff7] text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                <Image
                  src="/ReplyQuick.jpeg"
                  alt="ReplyQuick Logo"
                  width={24}
                  height={24}
                  className="w-full h-auto"
                />
              </div>
              <span className="text-xl font-bold">ReplyQuick</span>
            </div>
            <p className="text-white/80 text-sm leading-relaxed">
              Revolutionizing instant calls with qualified leads for service
              businesses nationwide.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">EXPLORE</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#features"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  How it works
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Case Studies
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Releases
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">CONTACT US</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <a
                  href="mailto:hello@replyquick.ai"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  hello@replyquick.ai
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <a
                  href="tel:3512272974"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  351-227-7974
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">FOLLOW US</h4>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/replyquick.ai?igsh=ZGg3d25rdmxxZ3gx"
                target="_blank"
                className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/company/replyquickai/"
                target="_blank"
                className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 pt-8 text-center text-white/70 text-sm">
          <p>© 2025 ReplyQuick. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
