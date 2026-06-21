"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { Heart, LogOut } from "lucide-react";
import { useLocationStore } from "@/store/useLocationStore";
import {
  Menu,
  X,
  Search,
  Phone,
  User,
  ChevronDown,
  MapPin,
  Home,
  Building2,
  Landmark,
  TrendingUp,
  TreePine,
  ArrowRight,
  Bell,
  type LucideIcon,
} from "lucide-react";
import { useAutocomplete } from "@/hooks/useAutocomplete";
import { AutocompleteDropdown } from "@/components/shared/AutocompleteDropdown";
import AuthModal from "@/components/auth/AuthModal";

/* ─── Nav data types ─────────────────────────────────────── */
type NavSubLink = {
  label: string;
  href: string;
  sub?: string;
};

type NavMegaSection = {
  group: string;
  image?: string;
  items: NavSubLink[];
};

type NavLinkDef = {
  label: string;
  icon: LucideIcon;
  mega?: NavMegaSection[];
};

/* ─── Nav data ──────────────────────────────────────────── */
const NAV_LINKS: NavLinkDef[] = [
  {
    label: "All",
    icon: TrendingUp,
    mega: [
      {
        group: "Agriculture Land",
        image:
          "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=800&q=80",
        items: [
          {
            label: "Agriculture Land",
            sub: "Fertile farmland with clear title",
            href: "/properties/city/nashik/agriculture",
          },
          {
            label: "Farmhouse Plots",
            sub: "Country-breeze weekend homes",
            href: "/properties/city/nashik/farmhouse",
          },
          {
            label: "Orchard Land",
            sub: "Fruit-growing investment plots",
            href: "/properties/city/nashik/orchard",
          },
        ],
      },
      {
        group: "Commercial Land",
        image:
          "https://images.unsplash.com/photo-1481277542470-605612bd2d61?auto=format&fit=crop&w=800&q=80",
        items: [
          {
            label: "Commercial Plots",
            sub: "High footfall business land",
            href: "/properties/city/nashik/commercial",
          },
          {
            label: "Warehouse Land",
            sub: "Logistics & industrial zones",
            href: "/properties/city/nashik/warehouse",
          },
          {
            label: "Industrial Sheds",
            sub: "Manufacturing-ready land",
            href: "/properties/city/nashik/industrial-shed",
          },
        ],
      },
      {
        group: "NA Plots",
        image:
          "https://images.unsplash.com/photo-1484925044320-839be2566d41?auto=format&fit=crop&w=800&q=80",
        items: [
          {
            label: "NA Plots",
            sub: "Approved land for construction",
            href: "/properties/city/nashik/na-plot",
          },
          {
            label: "Collector NA",
            sub: "Collector-approved plot options",
            href: "/properties/city/nashik/collector-na",
          },
          {
            label: "CIDCO Plots",
            sub: "Planned development layouts",
            href: "/properties/city/nashik/cidco-plot",
          },
        ],
      },
      {
        group: "Industrial Plots",
        image:
          "https://images.unsplash.com/photo-1590086782798-6de52b1d1e4f?auto=format&fit=crop&w=800&q=80",
        items: [
          {
            label: "MIDC Land",
            sub: "State industrial parks",
            href: "/properties/city/nashik/midc",
          },
          {
            label: "Non-MIDC Land",
            sub: "Flexible industrial zones",
            href: "/properties/city/nashik/non-midc",
          },
          {
            label: "Factory-ready",
            sub: "Plug-and-play industrial land",
            href: "/properties/city/nashik/industrial",
          },
        ],
      },
      {
        group: "Top Localities",
        items: [
          { label: "Gangapur Road", href: "/localities/gangapur-road" },
          { label: "Nashik Road", href: "/localities/nashik-road" },
          { label: "Ambad MIDC", href: "/localities/ambad" },
          { label: "Pathardi Phata", href: "/localities/pathardi-phata" },
        ],
      },
    ],
  },
  {
    label: "Residential",
    icon: Home,
    mega: [
      {
        group: "NA Plots",
        items: [
          {
            label: "NA Plots",
            sub: "Approved plots for construction",
            href: "/properties/city/nashik/na-plot",
          },
          {
            label: "Collector NA Plot",
            sub: "Collector approved & clear title",
            href: "/properties/city/nashik/collector-na",
          },
          {
            label: "CIDCO Plots",
            sub: "CIDCO approved layouts",
            href: "/properties/city/nashik/cidco-plot",
          },
          {
            label: "Plots for Investment",
            sub: "High-return investment plots",
            href: "/properties/city/nashik/investment-plot",
          },
        ],
      },
    ],
  },
  {
    label: "Agriculture",
    icon: TreePine,
    mega: [
      {
        group: "Land Types",
        items: [
          {
            label: "Agriculture Land",
            sub: "Fertile farmland, clear title",
            href: "/properties/city/nashik/agriculture",
          },
          {
            label: "Farmhouse Plots",
            sub: "Weekend retreat land",
            href: "/properties/city/nashik/farmhouse",
          },
          {
            label: "Mango / Orchard Land",
            sub: "Income-generating orchards",
            href: "/properties/city/nashik/orchard",
          },
          {
            label: "Grape Farm Land",
            sub: "Nashik's famous vineyards",
            href: "/properties/city/nashik/grape-farm",
          },
        ],
      },
    ],
  },
  {
    label: "Commercial",
    icon: Building2,
    mega: [
      {
        group: "Commercial Properties",
        items: [
          {
            label: "Commercial Plots",
            sub: "Prime commercial land",
            href: "/properties/city/nashik/commercial",
          },
          {
            label: "Warehouse Land",
            sub: "Industrial & logistics land",
            href: "/properties/city/nashik/warehouse",
          },
          {
            label: "Industrial Sheds",
            sub: "MIDC & non-MIDC sheds",
            href: "/properties/city/nashik/industrial-shed",
          },
          {
            label: "Showroom / Shop",
            sub: "Retail commercial spaces",
            href: "/properties/city/nashik/showroom",
          },
        ],
      },
    ],
  },
  {
    label: "Localities",
    icon: MapPin,
    mega: [
      {
        group: "North Nashik",
        items: [
          {
            label: "Gangapur Road",
            sub: "Premium residential zone",
            href: "/localities/gangapur-road",
          },
          {
            label: "College Road",
            sub: "Education & lifestyle hub",
            href: "/localities/college-road",
          },
          {
            label: "Indira Nagar",
            sub: "Established neighbourhood",
            href: "/localities/indira-nagar",
          },
          {
            label: "Panchavati",
            sub: "Heritage locality",
            href: "/localities/panchavati",
          },
        ],
      },
      {
        group: "East & South",
        items: [
          {
            label: "Nashik Road",
            sub: "Industrial & residential",
            href: "/localities/nashik-road",
          },
          {
            label: "Ambad MIDC",
            sub: "Industrial powerhouse",
            href: "/localities/ambad",
          },
          {
            label: "Satpur MIDC",
            sub: "Manufacturing hub",
            href: "/localities/satpur",
          },
          {
            label: "Pathardi Phata",
            sub: "Emerging investment zone",
            href: "/localities/pathardi-phata",
          },
        ],
      },
      {
        group: "Outskirts & Taluka",
        items: [
          {
            label: "Igatpuri",
            sub: "Hill station & agri land",
            href: "/localities/igatpuri",
          },
          {
            label: "Trimbak Road",
            sub: "Spiritual & nature zone",
            href: "/localities/trimbak-road",
          },
          {
            label: "Meri Village",
            sub: "Best value NA plots",
            href: "/localities/meri",
          },
          {
            label: "Sinnar",
            sub: "Industrial growth corridor",
            href: "/localities/sinnar",
          },
        ],
      },
    ],
  },
  {
    label: "Coworking",
    icon: Building2,
    mega: [
      {
        group: "Coworking",
        items: [
          {
            label: "Dedicated Coworking Space",
            sub: "Gurugram premium shared offices",
            href: "/coworking-space-in-gurugram",
          },
          {
            label: "All Coworking Options",
            sub: "Explore all coworking listings",
            href: "/properties?cat=commercial",
          },
        ],
      },
    ],
  },
  {
    label: "About Nashik",
    icon: Landmark,
    mega: [
      {
        group: "Why Nashik?",
        items: [
          {
            label: "Investment Guide",
            sub: "Market trends & ROI insights",
            href: "/nashik/investment-guide",
          },
          {
            label: "Top Localities",
            sub: "Best areas to buy in 2025",
            href: "/nashik/localities",
          },
          {
            label: "Infrastructure",
            sub: "Roads, metro & development",
            href: "/nashik/infrastructure",
          },
          {
            label: "Price Trends",
            sub: "Historical & projected prices",
            href: "/nashik/price-trends",
          },
        ],
      },
    ],
  },
  {
    label: "Tools",
    icon: Landmark,
    mega: [
      {
        group: "Property Tools",
        items: [
          {
            label: "EMI Calculator",
            sub: "Calculate home loan EMI",
            href: "/tools/emi-calculator",
          },
          {
            label: "Area Converter",
            sub: "Sq.Ft, Guntha, Acre conversion",
            href: "/tools/area-converter",
          },
          {
            label: "Stamp Duty Calculator",
            sub: "Maharashtra property charges",
            href: "/tools/stamp-duty-calculator",
          },
        ],
      },
    ],
  },
];

/* ─── Component ─────────────────────────────────────────── */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const [atTop, setAtTop] = useState(true);

  const [menuOpen, setMenuOpen] = useState(false);

  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const [searchFocus, setSearchFocus] = useState(false);

  const [totalCount, setTotalCount] = useState(0);
  const [dynamicCategories, setDynamicCategories] = useState<string[]>([]);
  const [menus, setMenus] = useState<any[]>([]);
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>(
    {},
  );

  const router = useRouter();
  const { city } = useLocationStore();

  const citySlug = city?.trim().toLowerCase().replace(/\s+/g, "-") || "nashik";

  const menuTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [user, setUser] = useState<any>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const [notifications, setNotifications] = useState<any[]>([]);

  const [unreadCount, setUnreadCount] = useState(0);

  const [showNotifications, setShowNotifications] = useState(false);

  const [showAuthModal, setShowAuthModal] = useState(false);

  /* Logout */
  const logout = () => {
    if (typeof window === "undefined") {
      return;
    }

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    setUser(null);

    setShowProfileMenu(false);

    router.push("/");
  };

  /* Close profile dropdown on outside click */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /* Load logged in user */
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const savedUser = localStorage.getItem("user");

      if (!savedUser || savedUser === "undefined") {
        return;
      }

      const parsedUser = JSON.parse(savedUser);

      if (parsedUser) {
        setUser(parsedUser);
      }
    } catch (error) {
      console.log("User parse error:", error);

      localStorage.removeItem("user");
    }
  }, []);

  /* FETCH NOTIFICATIONS */
  useEffect(() => {
    async function fetchNotifications() {
      try {
        if (!user?._id) {
          return;
        }

        const res = await fetch(`/api/notifications?userId=${user._id}`);

        const data = await res.json();

        if (data.success) {
          setNotifications(data.notifications || []);

          setUnreadCount(data.unreadCount || 0);
        }
      } catch (error) {
        console.error(
          "Notification Error:",

          error,
        );
      }
    }

    fetchNotifications();
  }, [user]);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await fetch("/api/property-counts");
        const data = await res.json();

        setTotalCount(data.total || 0);

        const counts = data.counts || {};

        const defaultCats = [
          "NA Plot",
          "Collector NA",
          "Agriculture",
          "Commercial",
          "Warehouse",
          "Investment",
          "Residential",
        ];

        defaultCats.forEach((cat) => {
          if (!(cat in counts)) {
            counts[cat] = 0;
          }
        });

        const sortedCategories = Object.entries(counts)
          .sort((a: any, b: any) => Number(b[1]) - Number(a[1]))
          .map(([cat]) => cat);

        setCategoryCounts(counts);
        setDynamicCategories(sortedCategories);
      } catch (err) {
        console.error("Failed to fetch property counts:", err);
      }
    };

    fetchCounts();
  }, []);

  useEffect(() => {
    async function fetchMenus() {
      try {
        const res = await fetch("/api/menu");
        const data = await res.json();

        setMenus(data);
      } catch (err) {
        console.error("Menu error:", err);
      }
    }

    fetchMenus();
  }, []);
  // Autocomplete hook
  const {
    query: searchQ,
    suggestions,
    isLoading,
    showSuggestions,
    handleInputChange,
    handleCloseSuggestions,
    setShowSuggestions,
  } = useAutocomplete({
    category: "all",
    minChars: 1,
  });

  const handleNavbarPropertySelect = (item: any) => {
    const propertyName =
      item.title ||
      item.name ||
      item.locality ||
      item.city ||
      item.category ||
      "";

    setShowSuggestions(false);

    router.push(`/properties?q=${encodeURIComponent(propertyName)}`);
  };

  const autocompleteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 80);
      setAtTop(y < 10);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const menuBtn: React.CSSProperties = {
    width: "100%",
    border: "none",
    background: "transparent",
    padding: "10px 18px",
    textAlign: "left",
    cursor: "pointer",
    fontWeight: 600,
    color: "#111827",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    fontSize: "14px",
  };

  const openMenu = (label: string) => {
    if (menuTimerRef.current) clearTimeout(menuTimerRef.current);
    setActiveMenu(label);
  };
  const closeMenu = () => {
    menuTimerRef.current = setTimeout(() => setActiveMenu(null), 120);
  };
  const keepMenu = () => {
    if (menuTimerRef.current) clearTimeout(menuTimerRef.current);
  };

  const navMap = Object.fromEntries(
    NAV_LINKS.map((item) => [item.label, item]),
  );

  const finalMenus =
    menus.length > 0
      ? menus
          .map((m: any) => ({
            ...m,
            ...(navMap[m.title] || {}),
          }))
          .filter((m: any) => m.label)
      : NAV_LINKS;

  console.log("menus", menus);
  console.log(
    "finalMenus",
    finalMenus.map((x: any) => x.label),
  );

  /* colour helpers */
  const onDark = false; /* transparent phase = text white */
  const logoTxt = onDark ? "#ffffff" : "#14532d";
  const logoSub = onDark ? "rgba(255,255,255,0.65)" : "#6b7280";
  const navTxt = onDark ? "rgba(255,255,255,0.88)" : "#374151";
  const navHov = onDark ? "#ffffff" : "#16a34a";
  const bgCls = onDark ? "transparent" : "#ffffff";
  const shadow = scrolled ? "0 2px 20px rgba(0,0,0,0.10)" : "none";
  const border = scrolled
    ? "1px solid rgba(0,0,0,0.07)"
    : "1px solid transparent";

  const desktopNav = (
    <nav
      style={{ display: "flex", alignItems: "center", gap: "2px", flex: 1 }}
      className="hide-md"
    >
      {finalMenus.map((item) => (
        <div
          key={item.label}
          style={{
            position: "relative",
            display: item.label === "Coworking" ? "none" : "block",
          }}
          onMouseEnter={() => openMenu(item.label)}
          onMouseLeave={closeMenu}
        >
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              padding: "8px 10px",
              borderRadius: "9px",
              fontFamily: "var(--font-dm,'DM Sans',sans-serif)",
              fontSize: "14px",
              fontWeight: 600,
              whiteSpace: "nowrap",
              color: activeMenu === item.label ? navHov : navTxt,
              background:
                activeMenu === item.label
                  ? onDark
                    ? "rgba(255,255,255,0.12)"
                    : "rgba(22,163,74,0.07)"
                  : "transparent",
              border: "none",
              cursor: "pointer",
              transition: "all 0.18s ease",
            }}
          >
            {item.label}
            <ChevronDown
              size={13}
              style={{
                transition: "transform 0.2s",
                transform:
                  activeMenu === item.label ? "rotate(180deg)" : "rotate(0deg)",
              }}
            />
          </button>
          {activeMenu === item.label && item.mega && (
            <div
              onMouseEnter={keepMenu}
              onMouseLeave={closeMenu}
              style={{
                position: "absolute",
                top: "calc(100% + 10px)",
                left:
                  item.label === "All Properties"
                    ? "-20px"
                    : item.label === "Localities"
                      ? "-120px"
                      : "0",
                right: item.label === "All Properties" ? "-20px" : undefined,
                width:
                  item.label === "All Properties"
                    ? "calc(100vw + 40px)"
                    : undefined,
                background: "#ffffff",
                borderRadius: "18px",
                boxShadow:
                  "0 24px 64px rgba(0,0,0,0.14), 0 0 0 1px rgba(0,0,0,0.05)",
                padding: "24px 28px",
                minWidth:
                  item.label === "All Properties"
                    ? "auto"
                    : item.label === "Localities"
                      ? "680px"
                      : "340px",
                zIndex: 100,
                animation: "slideDown 0.2s ease",
                display: item.label === "All Properties" ? "grid" : "flex",
                gap: "20px",
              }}
            >
              {item.mega.map((section: any) => (
                <div
                  key={section.group}
                  style={{
                    minWidth:
                      section.group === "Top Localities" ? "160px" : "220px",
                  }}
                >
                  <h4
                    style={{
                      fontSize: "14px",
                      fontWeight: 700,
                      marginBottom: "10px",
                    }}
                  >
                    {section.group}
                  </h4>
                  <div style={{ display: "grid", gap: "8px" }}>
                    {section.items.map((link: NavSubLink) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        style={{
                          display: "block",
                          color: "#334155",
                          fontWeight: 600,
                          textDecoration: "none",
                          fontSize: "13px",
                        }}
                        onMouseEnter={(e) =>
                          ((e.currentTarget as HTMLElement).style.color =
                            "#16a34a")
                        }
                        onMouseLeave={(e) =>
                          ((e.currentTarget as HTMLElement).style.color =
                            "#334155")
                        }
                      >
                        {link.label}
                        {link.sub && (
                          <p
                            style={{
                              margin: "4px 0 0",
                              fontSize: "12px",
                              color: "#64748b",
                              fontWeight: 400,
                            }}
                          >
                            {link.sub}
                          </p>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  );

  return (
    <>
      {/* ── TOP ANNOUNCEMENT BAR ── */}
      {atTop && (
        <div
          style={{
            background: "linear-gradient(90deg,#14532d 0%,#16a34a 100%)",
            color: "white",
            fontSize: "12.5px",
            fontWeight: 500,
            padding: "5px 0",
            textAlign: "center",
            letterSpacing: "0.01em",
            position: "relative",
            zIndex: 1001,
          }}
        >
          <span>
            🏡 Nashik&apos;s #1 Property Portal — 2,500+ Verified Listings
          </span>
          {/* <span style={{ margin: "0 20px", opacity: 0.4 }}>|</span> */}
          {/* <span>📞 Free Expert Consultation: <a href="tel:+919876543210" style={{ color:"#bbf7d2", fontWeight:700 }}>+91 98765 43210</a></span> */}
          <span style={{ margin: "0 20px", opacity: 0.4 }}>|</span>
          <Link
            href="/post-property"
            style={{
              color: "#fde68a",
              fontWeight: 700,
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            List your property
            <span
              style={{
                background: "#dcfce7",
                color: "#166534",
                fontSize: "10px",
                fontWeight: 700,
                borderRadius: "999px",
                padding: "1px 7px",
              }}
            >
              FREE
            </span>
          </Link>
        </div>
      )}

      {/* ── MAIN HEADER ── */}
      <header
        style={{
          position: "sticky",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          background: bgCls,
          borderBottom: border,
          boxShadow: shadow,
          backdropFilter: scrolled ? "blur(18px)" : "none",
          transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
          fontFamily: "var(--font-dm,'DM Sans',sans-serif)",
        }}
      >
        <div
          className="container"
          style={{
            display: "flex",
            alignItems: "center",
            height: "68px",
            gap: "0",
            transition: "height 0.35s ease",
            paddingLeft: "0px",
          }}
        >
          {/* ── LOGO ── */}
          {/* <Link href="/" style={{ display:"flex", alignItems:"center", gap:"10px", textDecoration:"none", flexShrink:0, marginRight:"28px" }}> */}
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              textDecoration: "none",
              flexShrink: 0,
              marginRight: "8px",
              marginLeft: "0px",
            }}
          >
            <div
              style={{
                width: "200px",
                height: "50px",
                borderRadius: "11px",
                overflow: "hidden",
                position: "relative",
                boxShadow: "none",
                background: "white",
                flexShrink: 0,
                transition: "all 0.35s ease",
              }}
            >
              <Image
                src="/mahaproperties-logo.png"
                alt="MahaProperties logo"
                fill
                style={{ objectFit: "contain", objectPosition: "center" }}
              />
            </div>
          </Link>

          {/* ── SCROLLED STATE: inline search bar ── */}
          {scrolled ? (
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              {desktopNav}
              {/* Search input with autocomplete */}
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  background: searchFocus ? "#f0fdf4" : "#f3f4f6",
                  border: searchFocus
                    ? "1.5px solid #16a34a"
                    : "1.5px solid #e5e7eb",
                  borderRadius: "10px",
                  padding: "0 14px",
                  height: "40px",
                  transition: "all 0.2s",
                  position: "relative",
                }}
              >
                <Search size={15} color={searchFocus ? "#16a34a" : "#9ca3af"} />
                <input
                  value={searchQ}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onFocus={() => {
                    setSearchFocus(true);
                    setShowSuggestions(true);
                  }}
                  onBlur={() => {
                    setSearchFocus(false);
                    setTimeout(() => handleCloseSuggestions(), 200);
                  }}
                  placeholder="Search locality, project, property type..."
                  style={{
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    fontSize: "13.5px",
                    color: "#111827",
                    fontWeight: 500,
                    fontFamily: "var(--font-dm,'DM Sans',sans-serif)",
                    width: "150%",
                  }}
                />
                {searchQ && (
                  <button
                    onClick={() => {
                      handleInputChange("");
                    }}
                    style={{
                      color: "#9ca3af",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <X size={13} />
                  </button>
                )}

                {/* Autocomplete Dropdown */}
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 4px)",
                    left: 0,
                    right: 0,
                    minWidth: "300px",
                    zIndex: 50,
                  }}
                  ref={autocompleteRef}
                >
                  <AutocompleteDropdown
                    suggestions={suggestions}
                    isLoading={isLoading}
                    isOpen={showSuggestions}
                    query={searchQ}
                    onClose={handleCloseSuggestions}
                    onSelect={(item: any) => {
                      const propertyName =
                        item.title ||
                        item.name ||
                        item.locality ||
                        item.city ||
                        item.category ||
                        "";

                      setShowSuggestions(false);

                      router.push(
                        `/properties?q=${encodeURIComponent(
                          propertyName.trim(),
                        )}`,
                      );
                    }}
                  />
                </div>
              </div>

              {/* Locality quick-pick 
              <select style={{
                height:"40px", padding:"0 10px", borderRadius:"10px",
                border:"1.5px solid #e5e7eb", background:"white",
                fontSize:"13px", fontWeight:500, color:"#374151",
                fontFamily:"var(--font-dm,'DM Sans',sans-serif)", cursor:"pointer",
                outline:"none",
              }}>
                <option value="">All Localities</option>
                {LOCALITIES_QUICK.map(l => <option key={l}>{l}</option>)}
              </select>
            
               Type quick-pick 
              <select style={{
                height:"40px", padding:"0 10px", borderRadius:"10px",
                border:"1.5px solid #e5e7eb", background:"white",
                fontSize:"13px", fontWeight:500, color:"#374151",
                fontFamily:"var(--font-dm,'DM Sans',sans-serif)", cursor:"pointer",
                outline:"none", display:"none",
              }} className="hide-md">
                <option value="">All Types</option>
                {TYPES_QUICK.map(t => <option key={t}>{t}</option>)}
              </select>
              */}
              {/* Divider */}
              <div
                style={{
                  width: "1px",
                  height: "28px",
                  background: "#e5e7eb",
                  flexShrink: 0,
                }}
              />

              {/* Enquiry CTA */}
              <Link
                href="/contact"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  whiteSpace: "nowrap",
                  padding: "0 16px",
                  height: "40px",
                  borderRadius: "10px",
                  background: "linear-gradient(135deg,#16a34a,#22c55e)",
                  color: "white",
                  fontSize: "13px",
                  fontWeight: 700,
                  boxShadow: "0 3px 10px rgba(22,163,74,0.32)",
                  flexShrink: 0,
                }}
              >
                {/* <Bell size={14} />*/} Enquiry Now
              </Link>

              {/* Burger */}
              <button
                onClick={() => setMenuOpen(true)}
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  border: "1.5px solid #e5e7eb",
                  background: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#374151",
                  flexShrink: 0,
                }}
              >
                <Menu size={18} />
              </button>
            </div>
          ) : (
            /* ── DEFAULT STATE: full nav ── */
            <>
              {/* Desktop nav links */}
              <nav
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "2px",
                  flex: 1,
                }}
                className="hide-md"
              >
                {finalMenus.map((item) => (
                  <div
                    key={item.label}
                    style={{
                      position: "relative",
                      display: item.label === "Coworking" ? "none" : "block",
                    }}
                    onMouseEnter={() => openMenu(item.label)}
                    onMouseLeave={closeMenu}
                  >
                    <button
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        padding: "8px 13px",
                        borderRadius: "9px",
                        fontFamily: "var(--font-dm,'DM Sans',sans-serif)",
                        fontSize: "14px",
                        fontWeight: 600,
                        color: activeMenu === item.label ? navHov : navTxt,
                        background:
                          activeMenu === item.label
                            ? onDark
                              ? "rgba(255,255,255,0.12)"
                              : "rgba(22,163,74,0.07)"
                            : "transparent",
                        border: "none",
                        cursor: "pointer",
                        transition: "all 0.18s ease",
                      }}
                    >
                      {item.label}
                      <ChevronDown
                        size={13}
                        style={{
                          transition: "transform 0.2s",
                          transform:
                            activeMenu === item.label
                              ? "rotate(180deg)"
                              : "rotate(0deg)",
                        }}
                      />
                    </button>

                    {/* ── MEGA MENU ── */}
                    {activeMenu === item.label && item.mega && (
                      <div
                        onMouseEnter={keepMenu}
                        onMouseLeave={closeMenu}
                        style={{
                          position: "absolute",
                          top: "calc(100% + 10px)",
                          left:
                            item.label === "All Properties"
                              ? "-20px"
                              : item.label === "Localities"
                                ? "-120px"
                                : "0",
                          right:
                            item.label === "All Properties"
                              ? "-20px"
                              : undefined,
                          width:
                            item.label === "All Properties"
                              ? "calc(100vw + 40px)"
                              : undefined,
                          background: "#ffffff",
                          borderRadius: "18px",
                          boxShadow:
                            "0 24px 64px rgba(0,0,0,0.14), 0 0 0 1px rgba(0,0,0,0.05)",
                          padding: "24px 28px",
                          minWidth:
                            item.label === "All Properties"
                              ? "auto"
                              : item.label === "Localities"
                                ? "680px"
                                : "340px",
                          zIndex: 100,
                          animation: "slideDown 0.2s ease",
                          display:
                            item.label === "All Properties" ? "grid" : "flex",
                          gridTemplateColumns:
                            item.label === "All Properties"
                              ? "repeat(5, minmax(180px, 1fr))"
                              : undefined,
                          gap: "24px",
                        }}
                      >
                        {item.mega.map((group: any) => {
                          const groupImage = (group as { image?: string })
                            .image;

                          return (
                            <div
                              key={group.group}
                              style={{
                                minWidth:
                                  item.label === "All Properties"
                                    ? "0"
                                    : "180px",
                              }}
                            >
                              <div
                                style={{
                                  fontSize: "10.5px",
                                  fontWeight: 700,
                                  color: "#9ca3af",
                                  letterSpacing: "0.1em",
                                  textTransform: "uppercase",
                                  marginBottom: "12px",
                                  paddingBottom: "8px",
                                  borderBottom: "1px solid #f3f4f6",
                                }}
                              >
                                {group.group}
                              </div>

                              {groupImage ? (
                                <div
                                  style={{
                                    marginBottom: "10px",
                                    borderRadius: "12px",
                                    overflow: "hidden",
                                    height: "100px",
                                    position: "relative",
                                  }}
                                >
                                  <Image
                                    src={groupImage}
                                    alt={group.group}
                                    fill
                                    style={{ objectFit: "cover" }}
                                  />
                                </div>
                              ) : null}

                              {group.items.map((link: NavSubLink) => {
                                const subText = link.sub;
                                return (
                                  <Link
                                    key={link.label}
                                    href={link.href.replace(
                                      "/properties/city/nashik",
                                      `/properties/city/${citySlug}`,
                                    )}
                                    style={{
                                      display: "block",
                                      padding: "7px 8px",
                                      borderRadius: "8px",
                                      marginBottom: "6px",
                                      transition: "background 0.15s",
                                      color: "#111827",
                                    }}
                                    onMouseEnter={(e) =>
                                      (e.currentTarget.style.background =
                                        "#f0fdf4")
                                    }
                                    onMouseLeave={(e) =>
                                      (e.currentTarget.style.background =
                                        "transparent")
                                    }
                                  >
                                    <div
                                      style={{
                                        fontSize: "13px",
                                        fontWeight: 600,
                                        color: "#111827",
                                      }}
                                    >
                                      {link.label}
                                    </div>
                                    {subText ? (
                                      <div
                                        style={{
                                          fontSize: "11px",
                                          color: "#6b7280",
                                          marginTop: "2px",
                                        }}
                                      >
                                        {subText}
                                      </div>
                                    ) : null}
                                  </Link>
                                );
                              })}
                            </div>
                          );
                        })}

                        {/* Footer hint inside mega */}
                        <div
                          style={{
                            position: "absolute",
                            bottom: "16px",
                            right: "24px",
                          }}
                        >
                          <Link
                            href="/nashik"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "5px",
                              fontSize: "12px",
                              fontWeight: 700,
                              color: "#16a34a",
                            }}
                          >
                            View All <ArrowRight size={12} />
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </nav>

              {/* Right actions */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginLeft: "auto",
                }}
              >
                {/* Search icon button */}
                <button
                  style={{
                    width: "45px",
                    height: "38px",
                    borderRadius: "9px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: onDark
                      ? "1.5px solid rgba(255,255,255,0.22)"
                      : "1.5px solid #e5e7eb",
                    background: onDark ? "rgba(255,255,255,0.1)" : "white",
                    color: navTxt,
                    transition: "all 0.18s",
                  }}
                >
                  <Search size={16} />
                </button>

                {/* Phone */}
                {/* <a
                  href="tel:+919876543210"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "7px",
                    padding: "8px 14px",
                    borderRadius: "9px",
                    border: onDark
                      ? "1.5px solid rgba(255,255,255,0.22)"
                      : "1.5px solid #e5e7eb",
                    background: onDark ? "rgba(255,255,255,0.1)" : "white",
                    color: onDark ? "white" : "#374151",
                    fontSize: "13px",
                    fontWeight: 600,
                    transition: "all 0.18s",
                  }}
                  className="hide-sm"
                >
                  <Phone size={14} /> +91 98765 43210
                </a> */}

                {/* Post CTA */}
                <Link
                  href="/post-property"
                  style={{
                    padding: "9px 18px",
                    borderRadius: "9px",
                    background: "linear-gradient(135deg,#16a34a,#22c55e)",
                    color: "white",
                    fontSize: "13px",
                    fontWeight: 700,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    boxShadow: "0 4px 12px rgba(22,163,74,0.35)",
                    whiteSpace: "nowrap",
                  }}
                  className="hide-xs"
                >
                  List your property
                  <span
                    style={{
                      background: "#d1fae5",
                      color: "#065f46",
                      fontSize: "10px",
                      fontWeight: 700,
                      borderRadius: "999px",
                      padding: "1px 7px",
                    }}
                  >
                    FREE
                  </span>
                </Link>

                {/* ✅ ADD HERE — Auth Buttons */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  {user ? (
                    <div
                      ref={profileRef}
                      style={{
                        position: "relative",
                      }}
                    >
                      {/* PROFILE BUTTON */}
                      <button
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          border: "1px solid #e5e7eb",
                          background: "#fff",
                          padding: "8px 14px",
                          borderRadius: "999px",
                          cursor: "pointer",
                          fontWeight: 700,
                          boxShadow: "0 1px 2px rgba(0,0,0,.05)",
                        }}
                      >
                        {/* AVATAR */}
                        <div
                          style={{
                            width: 34,
                            height: 34,
                            borderRadius: "50%",
                            background: "#f59e0b",
                            color: "#fff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 800,
                            fontSize: "14px",
                          }}
                        >
                          {user?.name?.charAt(0) || "U"}
                        </div>

                        {/* USER NAME */}
                        <span
                          style={{
                            color: "#111827",
                            fontSize: "14px",
                          }}
                        >
                          {user?.name || user?.phone}
                        </span>
                      </button>

                      {/* DROPDOWN */}
                      {showProfileMenu && (
                        <div
                          style={{
                            position: "absolute",
                            top: "110%",
                            right: 0,
                            width: 240,
                            background: "#fff",
                            borderRadius: 16,
                            border: "1px solid #e5e7eb",
                            boxShadow: "0 10px 40px rgba(0,0,0,.08)",
                            overflow: "hidden",
                            zIndex: 999,
                          }}
                        >
                          {/* USER INFO */}
                          <div
                            style={{
                              padding: "16px 18px",
                              borderBottom: "1px solid #f3f4f6",
                              display: "flex",
                              flexDirection: "column",
                              gap: "4px",
                            }}
                          >
                            <div
                              style={{
                                fontWeight: 700,
                                color: "#111827",
                                fontSize: "15px",
                                lineHeight: 1.2,
                              }}
                            >
                              {user?.name || "User"}
                            </div>

                            <div
                              style={{
                                fontSize: "13px",
                                color: "#64748b",
                                letterSpacing: "0.3px",
                              }}
                            >
                              {user?.phone
                                ? `${user.phone.substring(0, 5)}xxxxx`
                                : ""}
                            </div>
                          </div>

                          {/* NOTIFICATION ITEM */}
                          <div
                            style={{
                              position: "relative",
                            }}
                          >
                            <button
                              onClick={() =>
                                setShowNotifications(!showNotifications)
                              }
                              style={{
                                ...menuBtn,
                                position: "relative",
                              }}
                            >
                              <Bell size={16} />

                              <span>Notifications</span>

                              {unreadCount > 0 && (
                                <span
                                  style={{
                                    marginLeft: "auto",
                                    background: "#ef4444",
                                    color: "#fff",
                                    fontSize: "11px",
                                    fontWeight: 700,
                                    borderRadius: "999px",
                                    minWidth: "20px",
                                    height: "20px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    padding: "0 6px",
                                    boxShadow: "0 4px 10px rgba(239,68,68,.3)",
                                  }}
                                >
                                  {unreadCount}
                                </span>
                              )}
                            </button>

                            {/* NOTIFICATION DROPDOWN */}
                            {showNotifications && (
                              <div
                                style={{
                                  position: "absolute",

                                  top: "52px",

                                  right: 0,

                                  width: "340px",

                                  maxHeight: "420px",

                                  overflowY: "auto",

                                  background: "#fff",

                                  borderRadius: "18px",

                                  border: "1px solid #e5e7eb",

                                  boxShadow: "0 20px 60px rgba(0,0,0,.12)",

                                  padding: "16px",

                                  zIndex: 9999,
                                }}
                              >
                                {/* HEADER */}
                                <div
                                  style={{
                                    display: "flex",

                                    justifyContent: "space-between",

                                    alignItems: "center",

                                    marginBottom: "14px",
                                  }}
                                >
                                  <h3
                                    style={{
                                      fontSize: "16px",

                                      fontWeight: 800,

                                      color: "#111827",
                                    }}
                                  >
                                    Notifications
                                  </h3>

                                  <div
                                    style={{
                                      fontSize: "12px",

                                      color: "#6b7280",

                                      fontWeight: 600,
                                    }}
                                  >
                                    {notifications.length} Total
                                  </div>
                                </div>

                                {/* EMPTY */}
                                {notifications.length === 0 && (
                                  <div
                                    style={{
                                      textAlign: "center",

                                      padding: "30px 10px",

                                      color: "#9ca3af",

                                      fontSize: "14px",
                                    }}
                                  >
                                    No notifications
                                  </div>
                                )}

                                {/* LIST */}
                                {notifications.map((item: any) => (
                                  <div
                                    key={item._id}
                                    style={{
                                      padding: "14px",

                                      borderRadius: "14px",

                                      marginBottom: "10px",

                                      background: item.isRead
                                        ? "#fff"
                                        : "#f0fdf4",

                                      border: item.isRead
                                        ? "1px solid #f3f4f6"
                                        : "1px solid #bbf7d0",
                                    }}
                                  >
                                    <div
                                      style={{
                                        fontWeight: 700,

                                        fontSize: "14px",

                                        color: "#111827",

                                        marginBottom: "4px",
                                      }}
                                    >
                                      {item.title}
                                    </div>

                                    <div
                                      style={{
                                        fontSize: "13px",

                                        color: "#6b7280",

                                        lineHeight: 1.5,
                                      }}
                                    >
                                      {item.message}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          <Link href="/favorites" style={menuBtn}>
                            <Heart size={16} color="#ec4899" />
                            <span>Saved Properties</span>
                          </Link>

                          {/* LOGOUT */}
                          <button
                            onClick={logout}
                            style={{
                              ...menuBtn,
                              color: "#dc2626",
                            }}
                          >
                            Logout
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowAuthModal(true)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "10px 18px",
                        borderRadius: "999px",
                        border: "1px solid #e5e7eb",
                        background: "#fff",
                        cursor: "pointer",
                        fontWeight: 700,
                        fontSize: "14px",
                        color: "#111827",
                        transition: "all .2s ease",
                        boxShadow: "0 1px 2px rgba(0,0,0,.05)",
                      }}
                    >
                      <User size={16} />
                      Login
                    </button>
                  )}
                </div>

                {/* Burger (always visible) */}
                <button
                  onClick={() => setMenuOpen(true)}
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "9px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: onDark
                      ? "1.5px solid rgba(255,255,255,0.22)"
                      : "1.5px solid #e5e7eb",
                    background: onDark ? "rgba(255,255,255,0.1)" : "white",
                    color: onDark ? "white" : "#374151",
                    transition: "all 0.18s",
                  }}
                >
                  <Menu size={18} />
                </button>
              </div>
              {showAuthModal && (
                <AuthModal
                  onClose={() => setShowAuthModal(false)}
                  onLoginSuccess={(userData) => {
                    setUser(userData);

                    setShowAuthModal(false);
                  }}
                />
              )}
            </>
          )}
        </div>

        {/* ── NAV PILLS / SUBMENU ROW ── */}
        {true && (
          <div
            style={{
              borderTop: "1px solid #e5e7eb",
              background: "#ffffff",
              boxShadow: "inset 0 1px 0 rgba(0,0,0,0.04)",
            }}
          >
            <div
              className="container"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "8px",
                paddingLeft: "50px",
                overflowX: "auto",
                minHeight: "38px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  overflowX: "auto",
                  scrollbarWidth: "none",
                }}
              >
                {["All", ...dynamicCategories].map((t) => (
                  <Link
                    key={t}
                    href={
                      t === "All"
                        ? "/properties"
                        : `/properties/city/${citySlug}/${encodeURIComponent(
                            t.toLowerCase().replace(/\s+/g, "-"),
                          )}`
                    }
                    style={{
                      whiteSpace: "nowrap",
                      padding: "8px 15px",
                      borderRadius: "999px",
                      fontSize: "12px",
                      fontWeight: 600,
                      lineHeight: 1.2,
                      color: "#374151",
                      background: "#f3f4f6",
                      border: "1px solid #e5e7eb",
                      transition: "all 0.15s",
                      flexShrink: 0,
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#e5f7ed")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "#f3f4f6")
                    }
                  >
                    {t}
                    <span
                      style={{
                        marginLeft: 6,
                        fontWeight: 700,
                        opacity: 0.8,
                      }}
                    >
                      ({t === "All" ? totalCount : categoryCounts[t] || 0})
                    </span>
                  </Link>
                ))}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  flexShrink: 0,
                }}
              >
                <Link
                  href="/properties?sortBy=newest"
                  style={{
                    whiteSpace: "nowrap",
                    padding: "6px 14px",
                    borderRadius: "8px",
                    background: "#e0f2fe",
                    color: "#0369a1",
                    fontWeight: 700,
                    fontSize: "12px",
                  }}
                >
                  Latest
                </Link>
                <Link
                  href="/properties?sortBy=popular"
                  style={{
                    whiteSpace: "nowrap",
                    padding: "6px 14px",
                    borderRadius: "8px",
                    background: "#dcfce7",
                    color: "#15803d",
                    fontWeight: 700,
                    fontSize: "12px",
                  }}
                >
                  Popular
                </Link>
                <Link
                  href="/properties"
                  style={{
                    whiteSpace: "nowrap",
                    padding: "6px 14px",
                    borderRadius: "8px",
                    background: "#fef3c7",
                    color: "#a16207",
                    fontWeight: 700,
                    fontSize: "12px",
                  }}
                >
                  Filters
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ══════════════════════════════════════
           SLIDE-IN FULL-SCREEN DRAWER MENU
         ══════════════════════════════════════ */}
      {menuOpen && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 2000, display: "flex" }}
        >
          {/* backdrop */}
          <div
            onClick={() => setMenuOpen(false)}
            style={{
              flex: 1,
              background: "rgba(0,0,0,0.45)",
              backdropFilter: "blur(3px)",
              animation: "fadeIn 0.2s ease",
            }}
          />

          {/* Drawer */}
          <div
            style={{
              width: "min(420px, 92vw)",
              height: "100%",
              background: "white",
              display: "flex",
              flexDirection: "column",
              overflowY: "auto",
              boxShadow: "-20px 0 60px rgba(0,0,0,0.18)",
              animation: "slideRight 0.28s cubic-bezier(0.4,0,0.2,1)",
            }}
          >
            {/* Drawer Header */}
            <div
              style={{
                padding: "20px 24px",
                borderBottom: "1px solid #f3f4f6",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexShrink: 0,
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "14px",
                    overflow: "hidden",
                    background: "white",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Image
                    src="/mahaproperties-logo.png"
                    alt="MahaProperties Logo"
                    width={54}
                    height={54}
                    style={{ objectFit: "cover", padding: "1px" }}
                  />
                </div>
              </div>
              <button
                onClick={() => setMenuOpen(false)}
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "9px",
                  border: "1.5px solid #e5e7eb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#374151",
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* MOBILE USER INFO */}
            {user && (
              <div
                style={{
                  padding: "18px 24px",
                  borderBottom: "1px solid #f3f4f6",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    background: "#f59e0b",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: "18px",
                  }}
                >
                  {user?.name?.charAt(0) || "U"}
                </div>

                <div>
                  <div
                    style={{
                      fontWeight: 700,
                      color: "#111827",
                    }}
                  >
                    {user?.name || "User"}
                  </div>

                  <div
                    style={{
                      fontSize: ".85rem",
                      color: "#64748b",
                      marginTop: "2px",
                    }}
                  >
                    {user?.phone}
                  </div>
                </div>
              </div>
            )}

            {/* Search inside drawer */}
            <div
              style={{
                padding: "16px 24px",
                borderBottom: "1px solid #f3f4f6",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  background: "#f9fafb",
                  border: "1.5px solid #e5e7eb",
                  borderRadius: "10px",
                  padding: "0 14px",
                  height: "44px",
                }}
              >
                <Search size={16} color="#9ca3af" />
                <input
                  placeholder="Search property, locality..."
                  style={{
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    fontSize: "14px",
                    width: "100%",
                    fontFamily: "var(--font-dm,'DM Sans',sans-serif)",
                  }}
                />
              </div>
            </div>

            {/* Categories */}
            <div style={{ padding: "16px 24px 8px", flexShrink: 0 }}>
              <div
                style={{
                  fontSize: "10.5px",
                  fontWeight: 700,
                  color: "#9ca3af",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: "12px",
                }}
              >
                Browse by Type
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "8px",
                }}
              >
                {[
                  {
                    icon: "🏞️",
                    label: "NA Plots",
                    href: "/properties/city/nashik/na-plot",
                  },
                  {
                    icon: "📋",
                    label: "Collector NA",
                    href: "/properties/city/nashik/collector-na",
                  },
                  {
                    icon: "🌾",
                    label: "Agriculture",
                    href: "/properties/city/nashik/agriculture",
                  },
                  {
                    icon: "🏭",
                    label: "Warehouse",
                    href: "/properties/city/nashik/warehouse",
                  },
                  {
                    icon: "🏢",
                    label: "Commercial",
                    href: "/properties/city/nashik/commercial",
                  },
                  {
                    icon: "📈",
                    label: "Investment Plots",
                    href: "/properties/city/nashik/investment-plot",
                  },
                  {
                    icon: "🍇",
                    label: "Farmhouse",
                    href: "/properties/city/nashik/farmhouse",
                  },
                  {
                    icon: "🏗️",
                    label: "Industrial Shed",
                    href: "/properties/city/nashik/industrial-shed",
                  },
                ].map((c) => (
                  <Link
                    key={c.label}
                    href={c.href.replace(
                      "/properties/city/nashik",
                      `/properties/city/${citySlug}`,
                    )}
                    onClick={() => setMenuOpen(false)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "9px",
                      padding: "10px 12px",
                      borderRadius: "10px",
                      border: "1.5px solid #f0f0f0",
                      background: "#fafafa",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#374151",
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor =
                        "#bbf7d2";
                      (e.currentTarget as HTMLElement).style.background =
                        "#f0fdf4";
                      (e.currentTarget as HTMLElement).style.color = "#16a34a";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor =
                        "#f0f0f0";
                      (e.currentTarget as HTMLElement).style.background =
                        "#fafafa";
                      (e.currentTarget as HTMLElement).style.color = "#374151";
                    }}
                  >
                    <span style={{ fontSize: "1rem" }}>{c.icon}</span> {c.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Localities */}
            <div style={{ padding: "16px 24px 8px", flexShrink: 0 }}>
              <div
                style={{
                  fontSize: "10.5px",
                  fontWeight: 700,
                  color: "#9ca3af",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: "12px",
                }}
              >
                Popular Localities
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "7px" }}>
                {[
                  "Gangapur Road",
                  "College Road",
                  "Indira Nagar",
                  "Panchavati",
                  "Nashik Road",
                  "Ambad MIDC",
                  "Satpur MIDC",
                  "Pathardi Phata",
                  "Igatpuri",
                  "Trimbak Road",
                  "Meri Village",
                  "Sinnar",
                ].map((l) => (
                  <Link
                    key={l}
                    href={`/localities/${l.toLowerCase().replace(/\s+/g, "-")}`}
                    onClick={() => setMenuOpen(false)}
                    style={{
                      padding: "6px 13px",
                      borderRadius: "100px",
                      background: "#f3f4f6",
                      color: "#374151",
                      fontSize: "12.5px",
                      fontWeight: 500,
                      border: "1px solid transparent",
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background =
                        "#f0fdf4";
                      (e.currentTarget as HTMLElement).style.borderColor =
                        "#86efac";
                      (e.currentTarget as HTMLElement).style.color = "#16a34a";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background =
                        "#f3f4f6";
                      (e.currentTarget as HTMLElement).style.borderColor =
                        "transparent";
                      (e.currentTarget as HTMLElement).style.color = "#374151";
                    }}
                  >
                    {l}
                  </Link>
                ))}
              </div>
            </div>

            {/* Nav links */}
            <div
              style={{
                padding: "16px 24px",
                borderTop: "1px solid #f3f4f6",
                marginTop: "8px",
              }}
            >
              <div
                style={{
                  fontSize: "10.5px",
                  fontWeight: 700,
                  color: "#9ca3af",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: "12px",
                }}
              >
                Menu
              </div>
              {[
                { label: "All Properties", href: "/properties" },
                { label: "About Nashik", href: "/nashik" },
                { label: "Market Insights", href: "/insights" },
                { label: "Blogs", href: "/blogs" },
                { label: "Post Property", href: "/post-property" },
                { label: "Contact Us", href: "/contact" },
              ].map((m) => (
                <Link
                  key={m.label}
                  href={m.href}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 4px",
                    borderBottom: "1px solid #f9fafb",
                    fontSize: "14.5px",
                    fontWeight: 600,
                    color: "#374151",
                    transition: "color 0.15s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#16a34a")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#374151")
                  }
                >
                  {m.label} <ArrowRight size={14} />
                </Link>
              ))}
            </div>
            {/* MOBILE LOGIN */}
            {!user && (
              <div
                style={{
                  padding: "20px 24px 0",
                }}
              >
                <button
                  onClick={() => {
                    setShowAuthModal(true);

                    setMenuOpen(false);
                  }}
                  style={{
                    width: "100%",
                    height: "48px",
                    borderRadius: "12px",
                    border: "1px solid #e5e7eb",
                    background: "#fff",
                    fontWeight: 700,
                    fontSize: "15px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                  }}
                >
                  <User size={18} />
                  Login / Register
                </button>
              </div>
            )}
            {/* Auth + CTA at bottom */}
            <div
              style={{
                padding: "20px 24px",
                marginTop: "auto",
                borderTop: "1px solid #f3f4f6",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                flexShrink: 0,
              }}
            >
              <Link
                href="/contact"
                onClick={() => setMenuOpen(false)}
                style={{
                  padding: "14px",
                  borderRadius: "10px",
                  textAlign: "center",
                  background: "linear-gradient(135deg,#16a34a,#22c55e)",
                  color: "white",
                  fontWeight: 700,
                  fontSize: "15px",
                  boxShadow: "0 4px 14px rgba(22,163,74,0.35)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
              >
                <Bell size={16} /> Enquiry Now
              </Link>
              {/* <a
                href="tel:+919876543210"
                style={{
                  padding: "12px",
                  borderRadius: "10px",
                  textAlign: "center",
                  background: "#f9fafb",
                  border: "1.5px solid #e5e7eb",
                  color: "#374151",
                  fontWeight: 600,
                  fontSize: "14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
              >
                <Phone size={15} /> +91 98765 43210
              </a> */}
            </div>
          </div>
        </div>
      )}

      {/* ── Responsive helpers ── */}
      <style>{`
        @media (max-width: 1100px) { .hide-md { display: none !important; } }
        @media (max-width:  768px) { .hide-sm { display: none !important; } }
        @media (max-width:  480px) { .hide-xs { display: none !important; } }
        @keyframes slideRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes slideDown  { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn     { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </>
  );
}
