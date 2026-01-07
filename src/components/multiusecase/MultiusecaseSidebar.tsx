// src/components/multiusecase/MultiusecaseSidebar.tsx
"use client";

import { useState, useEffect } from "react";
import {
  useParams,
  useRouter,
  useSearchParams,
  usePathname,
} from "next/navigation";
import {
  QrCode,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  HandHeart,
} from "lucide-react";
import Link from "next/link";

interface MultiusecaseSidebarProps {
  orgName?: string;
}

export function MultiusecaseSidebar({ orgName }: MultiusecaseSidebarProps) {
  const params = useParams();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentOrgId, setCurrentOrgId] = useState<string | null>(null);
  const [organizationType, setOrganizationType] = useState<string | null>(null);

  useEffect(() => {
    const routeOrgId = params?.orgId as string;
    const queryOrgId = searchParams?.get("orgId");
    const orgId = routeOrgId || queryOrgId;
    setCurrentOrgId(orgId);

    if (orgId) {
      fetchOrganizationType(orgId);
    }
  }, [params, searchParams]);

  const fetchOrganizationType = async (orgId: string) => {
    try {
      const response = await fetch(`/api/multiusecase/org-info?orgId=${orgId}`);
      if (response.ok) {
        const data = await response.json();
        setOrganizationType(data.organizationType);
        return;
      }
      setOrganizationType("gym");
    } catch (error) {
      console.error("Failed to fetch organization type:", error);
      setOrganizationType("gym");
    }
  };

  const getOrgIcon = () => {
    switch (organizationType) {
      case "charity":
        return "❤️";
      case "gym":
        return "💪";
      case "school":
        return "🎓";
      default:
        return "🏢";
    }
  };

  const getOrgDisplayName = () => {
    if (orgName) return orgName;

    switch (organizationType) {
      case "charity":
        return "Charity Dashboard";
      case "gym":
        return "Gym Dashboard";
      case "school":
        return "School Dashboard";
      default:
        return "Organization Dashboard";
    }
  };

  const getPortalName = () => {
    switch (organizationType) {
      case "charity":
        return "Charity Portal";
      case "gym":
        return "Gym Portal";
      case "school":
        return "School Portal";
      default:
        return "Organization Portal";
    }
  };

  const handleLogout = async () => {
    try {
      let orgTypeFromApi: string | null = null;

      if (currentOrgId) {
        try {
          const response = await fetch("/api/multiusecase/logout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orgId: currentOrgId }),
          });

          if (response.ok) {
            const data = await response.json();
            orgTypeFromApi = data.organizationType || null;
          }
        } catch (apiError) {
          console.log("API logout failed, continuing with client-side logout");
        }
      }

      if (typeof window !== "undefined") {
        localStorage.removeItem("multiusecase_orgId");
        localStorage.removeItem("multiusecase_session");
        localStorage.removeItem("multiusecase_auth_token");

        sessionStorage.removeItem("multiusecase_orgId");
        sessionStorage.removeItem("multiusecase_session");

        document.cookie =
          "multiusecase_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie =
          "multiusecase_orgId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      }

      let redirectUrl = "/multiusecase/gym";
      if (orgTypeFromApi === "charity") redirectUrl = "/multiusecase/charity";
      if (orgTypeFromApi === "gym") redirectUrl = "/multiusecase/gym";
      if (orgTypeFromApi === "school") redirectUrl = "/multiusecase/school";

      const logoutButton = document.querySelector("[data-logout-btn]");
      if (logoutButton) {
        logoutButton.textContent = "Logged Out ✓";
        setTimeout(() => router.push(redirectUrl), 900);
      } else {
        router.push(redirectUrl);
      }
    } catch (error) {
      console.error("Logout error:", error);
      router.push("/multiusecase/gym");
    }
  };

  const isActive = (href: string) => {
    if (!href || href === "#") return false;
    if (href.includes("?")) {
      const pathOnly = href.split("?")[0];
      return pathname === pathOnly;
    }
    return pathname === href;
  };

  const navigationItems = [
    {
      name: "Dashboard",
      href: currentOrgId ? `/multiusecase/dashboard/${currentOrgId}` : "#",
      icon: LayoutDashboard,
    },
    {
      name: "QR Codes",
      href: currentOrgId ? `/multiusecase/qr-codes?orgId=${currentOrgId}` : "#",
      icon: QrCode,
    },
    ...(organizationType === "charity"
      ? [
          {
            name: "Set Your Partner",
            href: currentOrgId
              ? `/multiusecase/charity/partner?orgId=${currentOrgId}`
              : "#",
            icon: HandHeart,
          },
        ]
      : []),
  ];

  return (
    <>
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-md bg-white shadow-lg border border-gray-200"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div
        className={`
          fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 shadow-lg z-50
          transform transition-transform duration-300 ease-in-out
          ${
            isMobileMenuOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {getOrgIcon()}
              </span>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {getOrgDisplayName()}
              </h2>
              <p className="text-sm text-gray-500">{getPortalName()}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navigationItems.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                      active
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <item.icon size={20} />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            data-logout-btn
            className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}
