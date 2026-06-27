
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Heart,
  LogOut,
  Menu,
  X,
  Search,
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
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { useLocationStore } from "@/store/useLocationStore";
import { useAutocomplete } from "@/hooks/useAutocomplete";
import { AutocompleteDropdown } from "@/components/shared/AutocompleteDropdown";
import AuthModal from "@/components/auth/AuthModal";

/* ─── Brand tokens (Green theme) ─────────────────────── */
const BRAND = {
  primary: "#16a34a",
  primaryDark: "#15803d",
  primaryLight: "#f0fdf4",
  primaryBorder: "#bbf7d0",
  accent: "#16a34a",
  text: "#111827",
  textMuted: "#6b7280",
  border: "#e5e7eb",
  borderLight: "#f3f4f6",
  surface: "#ffffff",
  surfaceAlt: "#fafafa",
};

/* ─── Nav data types ─────────────────────────────────── */
type NavSubLink = { label: string; href: string; sub?: string };
type NavMegaSection = { group: string; image?: string; items: NavSubLink[] };
type NavLinkDef = { label: string; icon: LucideIcon; mega?: NavMegaSection[] };

/* ─── Nav data ───────────────────────────────────────── */
const NAV_LINKS: NavLinkDef[] = [
  {
    label: "Residential",
    icon: Home,
    mega: [
      {
        group: "NA Plots",
        items: [
          { label: "NA Plots", sub: "Approved plots for construction", href: "/properties/city/nashik/na-plot" },
          { label: "Collector NA Plot", sub: "Collector approved & clear title", href: "/properties/city/nashik/collector-na" },
          { label: "CIDCO Plots", sub: "CIDCO approved layouts", href: "/properties/city/nashik/cidco-plot" },
          { label: "Plots for Investment", sub: "High-return investment plots", href: "/properties/city/nashik/investment-plot" },
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
          { label: "Agriculture Land", sub: "Fertile farmland, clear title", href: "/properties/city/nashik/agriculture" },
          { label: "Farmhouse Plots", sub: "Weekend retreat land", href: "/properties/city/nashik/farmhouse" },
          { label: "Mango / Orchard Land", sub: "Income-generating orchards", href: "/properties/city/nashik/orchard" },
          { label: "Grape Farm Land", sub: "Nashik's famous vineyards", href: "/properties/city/nashik/grape-farm" },
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
          { label: "Commercial Plots", sub: "Prime commercial land", href: "/properties/city/nashik/commercial" },
          { label: "Warehouse Land", sub: "Industrial & logistics land", href: "/properties/city/nashik/warehouse" },
          { label: "Industrial Sheds", sub: "MIDC & non-MIDC sheds", href: "/properties/city/nashik/industrial-shed" },
          { label: "Showroom / Shop", sub: "Retail commercial spaces", href: "/properties/city/nashik/showroom" },
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
          { label: "Gangapur Road", sub: "Premium residential zone", href: "/localities/gangapur-road" },
          { label: "College Road", sub: "Education & lifestyle hub", href: "/localities/college-road" },
          { label: "Indira Nagar", sub: "Established neighbourhood", href: "/localities/indira-nagar" },
          { label: "Panchavati", sub: "Heritage locality", href: "/localities/panchavati" },
        ],
      },
      {
        group: "East & South",
        items: [
          { label: "Nashik Road", sub: "Industrial & residential", href: "/localities/nashik-road" },
          { label: "Ambad MIDC", sub: "Industrial powerhouse", href: "/localities/ambad" },
          { label: "Satpur MIDC", sub: "Manufacturing hub", href: "/localities/satpur" },
          { label: "Pathardi Phata", sub: "Emerging investment zone", href: "/localities/pathardi-phata" },
        ],
      },
      {
        group: "Outskirts & Taluka",
        items: [
          { label: "Igatpuri", sub: "Hill station & agri land", href: "/localities/igatpuri" },
          { label: "Trimbak Road", sub: "Spiritual & nature zone", href: "/localities/trimbak-road" },
          { label: "Meri Village", sub: "Best value NA plots", href: "/localities/meri" },
          { label: "Sinnar", sub: "Industrial growth corridor", href: "/localities/sinnar" },
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
          { label: "Investment Guide", sub: "Market trends & ROI insights", href: "/nashik/investment-guide" },
          { label: "Top Localities", sub: "Best areas to buy in 2025", href: "/nashik/localities" },
          { label: "Infrastructure", sub: "Roads, metro & development", href: "/nashik/infrastructure" },
          { label: "Price Trends", sub: "Historical & projected prices", href: "/nashik/price-trends" },
        ],
      },
      {
        group: "Nashik's Growth",
        image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80",
        items: [
          { label: "Smart City Project", sub: "₹1,200 Cr development plan", href: "/nashik/smart-city" },
          { label: "Metro Connectivity", sub: "Upcoming metro rail network", href: "/nashik/metro" },
          { label: "Educational Hub", sub: "IIM & top universities", href: "/nashik/education" },
        ],
      },
    ],
  },
  {
    label: "All",
    icon: TrendingUp,
    mega: [
      {
        group: "Agriculture",
        image: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=800&q=80",
        items: [
          { label: "Agriculture Land", sub: "Fertile farmland", href: "/properties/city/nashik/agriculture" },
          { label: "Farmhouse Plots", sub: "Weekend homes", href: "/properties/city/nashik/farmhouse" },
          { label: "Orchard Land", sub: "Fruit-growing plots", href: "/properties/city/nashik/orchard" },
        ],
      },
      {
        group: "Commercial",
        image: "https://images.unsplash.com/photo-1481277542470-605612bd2d61?auto=format&fit=crop&w=800&q=80",
        items: [
          { label: "Commercial Plots", sub: "High footfall land", href: "/properties/city/nashik/commercial" },
          { label: "Warehouse Land", sub: "Logistics zones", href: "/properties/city/nashik/warehouse" },
          { label: "Industrial Sheds", sub: "Manufacturing-ready", href: "/properties/city/nashik/industrial-shed" },
        ],
      },
      {
        group: "NA Plots",
        image: "https://images.unsplash.com/photo-1484925044320-839be2566d41?auto=format&fit=crop&w=800&q=80",
        items: [
          { label: "NA Plots", sub: "Approved land", href: "/properties/city/nashik/na-plot" },
          { label: "Collector NA", sub: "Collector approved", href: "/properties/city/nashik/collector-na" },
          { label: "CIDCO Plots", sub: "Planned layouts", href: "/properties/city/nashik/cidco-plot" },
        ],
      },
      {
        group: "Industrial",
        image: "https://images.unsplash.com/photo-1590086782798-6de52b1d1e4f?auto=format&fit=crop&w=800&q=80",
        items: [
          { label: "MIDC Land", sub: "State industrial parks", href: "/properties/city/nashik/midc" },
          { label: "Non-MIDC Land", sub: "Flexible zones", href: "/properties/city/nashik/non-midc" },
          { label: "Factory-ready", sub: "Plug-and-play land", href: "/properties/city/nashik/industrial" },
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
    label: "Tools",
    icon: Sparkles,
    mega: [
      {
        group: "Property Tools",
        items: [
          { label: "EMI Calculator", sub: "Calculate home loan EMI", href: "/tools/emi-calculator" },
          { label: "Area Converter", sub: "Sq.Ft, Guntha, Acre conversion", href: "/tools/area-converter" },
          { label: "Stamp Duty Calculator", sub: "Maharashtra property charges", href: "/tools/stamp-duty-calculator" },
        ],
      },
    ],
  },
];

/* ─── Component ─────────────────────────────────────── */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [searchFocus, setSearchFocus] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [dynamicCategories, setDynamicCategories] = useState<string[]>([]);
  const [menus, setMenus] = useState<any[]>([]);
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});

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

  /* ─── Logout ─── */
  const logout = () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setShowProfileMenu(false);
    router.push("/");
  };

  /* ─── Outside click ─── */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ─── Load user ─── */
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const savedUser = localStorage.getItem("user");
      if (!savedUser || savedUser === "undefined") return;
      const parsedUser = JSON.parse(savedUser);
      if (parsedUser) setUser(parsedUser);
    } catch {
      localStorage.removeItem("user");
    }
  }, []);

  /* ─── Notifications ─── */
  useEffect(() => {
    async function fetchNotifications() {
      try {
        if (!user?._id) return;
        const res = await fetch(`/api/notifications?userId=${user._id}`);
        const data = await res.json();
        if (data.success) {
          setNotifications(data.notifications || []);
          setUnreadCount(data.unreadCount || 0);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchNotifications();
  }, [user]);

  /* ─── Counts ─── */
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await fetch("/api/property-counts");
        const data = await res.json();
        setTotalCount(data.total || 0);
        const counts = data.counts || {};
        const defaultCats = ["NA Plot", "Collector NA", "Agriculture", "Commercial", "Warehouse", "Investment", "Residential"];
        defaultCats.forEach((cat) => { if (!(cat in counts)) counts[cat] = 0; });
        const sorted = Object.entries(counts)
          .sort((a: any, b: any) => Number(b[1]) - Number(a[1]))
          .map(([cat]) => cat);
        setCategoryCounts(counts);
        setDynamicCategories(sorted);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCounts();
  }, []);

  /* ─── Menus ─── */
  useEffect(() => {
    async function fetchMenus() {
      try {
        const res = await fetch("/api/menu");
        const data = await res.json();
        setMenus(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchMenus();
  }, []);

  /* ─── Autocomplete ─── */
  const {
    query: searchQ,
    suggestions,
    isLoading,
    showSuggestions,
    handleInputChange,
    handleCloseSuggestions,
    setShowSuggestions,
  } = useAutocomplete({ category: "all", minChars: 1 });

  /* ─── Scroll handler: expand search on scroll ─── */
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const y = window.scrollY;
          setScrolled(y > 20);
          setSearchExpanded(y > 320); // expand search after passing hero
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ─── Menu hover helpers ─── */
  const openMenu = (label: string) => {
    if (menuTimerRef.current) clearTimeout(menuTimerRef.current);
    setActiveMenu(label);
  };
  const closeMenu = () => {
    menuTimerRef.current = setTimeout(() => setActiveMenu(null), 150);
  };
  const keepMenu = () => {
    if (menuTimerRef.current) clearTimeout(menuTimerRef.current);
  };

  const navMap = Object.fromEntries(NAV_LINKS.map((item) => [item.label, item]));
  const finalMenus =
    menus.length > 0
      ? menus
          .filter((m: any) => m.active && m.showOnDesktop && m.location === "header")
          .map((m: any) => ({
            ...m,
            label: m.title,
            icon: navMap[m.title]?.icon,
            mega: navMap[m.title]?.mega || [],
          }))
      : NAV_LINKS;

  const handleSearchSubmit = () => {
    if (searchQ.trim()) {
      router.push(`/properties?q=${encodeURIComponent(searchQ.trim())}`);
    }
  };

  const menuBtn: React.CSSProperties = {
    width: "100%",
    border: "none",
    background: "transparent",
    padding: "11px 18px",
    textAlign: "left",
    cursor: "pointer",
    fontWeight: 600,
    color: BRAND.text,
    display: "flex",
    alignItems: "center",
    gap: "12px",
    fontSize: "13.5px",
    transition: "background 0.15s ease",
  };

  return (
    <>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
          background: BRAND.surface,
          borderBottom: `1px solid ${BRAND.border}`,
          boxShadow: scrolled ? "0 4px 20px rgba(0,0,0,0.06)" : "0 1px 0 rgba(0,0,0,0.03)",
          transition: "box-shadow 0.3s ease",
          fontFamily: "var(--font-dm,'DM Sans',-apple-system,BlinkMacSystemFont,sans-serif)",
        }}
      >
        {/* ═══ MAIN BAR ═══ */}
        <div
          className="container"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            height: searchExpanded ? "60px" : "72px",
            transition: "height 0.35s cubic-bezier(0.4,0,0.2,1)",
          }}
        >
          {/* LOGO */}
          <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none", flexShrink: 0 }}>
            <div
              style={{
                width: searchExpanded ? "110px" : "145px",
                height: searchExpanded ? "38px" : "48px",
                position: "relative",
                transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
              }}
            >
              <Image
                src="/mahaproperties-logo.png"
                alt="MahaProperties"
                fill
                style={{ objectFit: "contain", objectPosition: "left center" }}
                priority
              />
            </div>
          </Link>

          {/* DESKTOP NAV (hides when search is expanded) */}
          {!searchExpanded && (
            <nav
              style={{ display: "flex", alignItems: "center", gap: "2px", flex: 1, marginLeft: "8px" }}
              className="hide-md"
            >
              {finalMenus.map((item) => (
                <div
                  key={item.label}
                  style={{ position: "relative" }}
                  onMouseEnter={() => openMenu(item.label)}
                  onMouseLeave={closeMenu}
                >
                  <button
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      padding: "10px 14px",
                      borderRadius: "8px",
                      fontSize: "13.5px",
                      fontWeight: 600,
                      color: activeMenu === item.label ? BRAND.primary : BRAND.text,
                      background: activeMenu === item.label ? BRAND.primaryLight : "transparent",
                      border: "none",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      transition: "all 0.18s ease",
                      fontFamily: "inherit",
                    }}
                  >
                    {item.label}
                    <ChevronDown
                      size={13}
                      style={{
                        transition: "transform 0.2s ease",
                        transform: activeMenu === item.label ? "rotate(180deg)" : "rotate(0)",
                      }}
                    />
                  </button>

                  {/* MEGA MENU */}
                  {activeMenu === item.label && item.mega && (
                    <div
                      onMouseEnter={keepMenu}
                      onMouseLeave={closeMenu}
                      style={{
                        position: "absolute",
                        top: "calc(100% + 8px)",
                        left: item.label === "All" ? "-200px" : item.label === "Localities" ? "-120px" : "0",
                        background: "#ffffff",
                        borderRadius: "14px",
                        boxShadow: "0 16px 50px rgba(0,0,0,0.14), 0 0 0 1px rgba(0,0,0,0.04)",
                        padding: "24px 28px",
                        minWidth:
                          item.label === "All"
                            ? "980px"
                            : item.label === "Localities"
                            ? "680px"
                            : item.label === "About Nashik"
                            ? "620px"
                            : "340px",
                        zIndex: 100,
                        animation: "megaSlideDown 0.22s cubic-bezier(0.4,0,0.2,1)",
                        display: "grid",
                        gridTemplateColumns:
                          item.label === "All"
                            ? "repeat(5, 1fr)"
                            : item.label === "About Nashik"
                            ? "repeat(2, 1fr)"
                            : item.label === "Localities"
                            ? "repeat(3, 1fr)"
                            : "1fr",
                        gap: "22px",
                      }}
                    >
                      {item.mega.map((section: any) => (
                        <div key={section.group}>
                          <div
                            style={{
                              fontSize: "10px",
                              fontWeight: 800,
                              color: BRAND.primary,
                              letterSpacing: "0.12em",
                              textTransform: "uppercase",
                              marginBottom: "12px",
                              paddingBottom: "8px",
                              borderBottom: `2px solid ${BRAND.borderLight}`,
                            }}
                          >
                            {section.group}
                          </div>

                          {section.image && (
                            <div
                              style={{
                                marginBottom: "12px",
                                borderRadius: "10px",
                                overflow: "hidden",
                                height: "88px",
                                position: "relative",
                              }}
                            >
                              <Image src={section.image} alt={section.group} fill style={{ objectFit: "cover" }} />
                            </div>
                          )}

                          {section.items.map((link: NavSubLink) => (
                            <Link
                              key={link.label}
                              href={link.href.replace("/properties/city/nashik", `/properties/city/${citySlug}`)}
                              style={{
                                display: "block",
                                padding: "8px 10px",
                                borderRadius: "8px",
                                marginBottom: "2px",
                                transition: "all 0.15s ease",
                                color: BRAND.text,
                                textDecoration: "none",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = BRAND.primaryLight;
                                e.currentTarget.style.paddingLeft = "14px";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = "transparent";
                                e.currentTarget.style.paddingLeft = "10px";
                              }}
                            >
                              <div style={{ fontSize: "13px", fontWeight: 600, color: BRAND.text }}>{link.label}</div>
                              {link.sub && (
                                <div style={{ fontSize: "11px", color: BRAND.textMuted, marginTop: "2px" }}>
                                  {link.sub}
                                </div>
                              )}
                            </Link>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          )}

          {/* ─── EXPANDED SEARCH (only when scrolled past hero) ─── */}
          {searchExpanded && (
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                background: "white",
                border: searchFocus ? `2px solid ${BRAND.primary}` : `1.5px solid ${BRAND.border}`,
                borderRadius: "10px",
                overflow: "visible",
                transition: "all 0.25s ease",
                boxShadow: searchFocus ? `0 0 0 4px ${BRAND.primaryLight}` : "none",
                position: "relative",
                animation: "expandSearch 0.35s cubic-bezier(0.4,0,0.2,1)",
                marginLeft: "12px",
              }}
            >
              {/* Buy in City pill */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "0 16px",
                  borderRight: `1.5px solid ${BRAND.border}`,
                  background: BRAND.surfaceAlt,
                  borderRadius: "8px 0 0 8px",
                  height: "100%",
                  cursor: "pointer",
                }}
              >
                <MapPin size={14} color={BRAND.primary} />
                <span style={{ fontWeight: 700, fontSize: "13px", color: BRAND.text, whiteSpace: "nowrap" }}>
                  Buy in {city || "Nashik"}
                </span>
                <ChevronDown size={13} color={BRAND.textMuted} />
              </div>

              {/* Search input */}
              <div style={{ display: "flex", alignItems: "center", flex: 1, padding: "0 16px", gap: "10px" }}>
                <Search size={16} color={searchFocus ? BRAND.primary : BRAND.textMuted} />
                <input
                  value={searchQ}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onFocus={() => { setSearchFocus(true); setShowSuggestions(true); }}
                  onBlur={() => { setSearchFocus(false); setTimeout(() => handleCloseSuggestions(), 200); }}
                  onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
                  placeholder="Search 'Gangapur Road' or 'NA Plot'..."
                  style={{
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    fontSize: "14px",
                    color: BRAND.text,
                    fontWeight: 500,
                    width: "100%",
                    height: "44px",
                    fontFamily: "inherit",
                  }}
                />
                {searchQ && (
                  <button
                    onClick={() => handleInputChange("")}
                    style={{
                      background: BRAND.borderLight,
                      border: "none",
                      borderRadius: "50%",
                      width: "22px",
                      height: "22px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      color: BRAND.textMuted,
                    }}
                  >
                    <X size={12} />
                  </button>
                )}
              </div>

              {/* Search button */}
              <button
                onClick={handleSearchSubmit}
                style={{
                  padding: "0 28px",
                  height: "100%",
                  background: `linear-gradient(135deg, ${BRAND.primary}, ${BRAND.primaryDark})`,
                  color: "white",
                  fontWeight: 700,
                  fontSize: "14px",
                  border: "none",
                  cursor: "pointer",
                  borderRadius: "0 8px 8px 0",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontFamily: "inherit",
                  transition: "filter 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(1.08)")}
                onMouseLeave={(e) => (e.currentTarget.style.filter = "brightness(1)")}
              >
                <Search size={16} />
                Search
              </button>

              {/* Autocomplete */}
              {showSuggestions && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 8px)",
                    left: 0,
                    right: 0,
                    zIndex: 100,
                  }}
                >
                  <AutocompleteDropdown
                    suggestions={suggestions}
                    isLoading={isLoading}
                    isOpen={showSuggestions}
                    query={searchQ}
                    onClose={handleCloseSuggestions}
                    onSelect={(item: any) => {
                      const name = item.title || item.name || item.locality || item.city || item.category || "";
                      setShowSuggestions(false);
                      router.push(`/properties?q=${encodeURIComponent(name.trim())}`);
                    }}
                  />
                </div>
              )}
            </div>
          )}

          {/* RIGHT ACTIONS */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0, marginLeft: "auto" }}>
            {/* Compact search icon (only when not expanded) */}
            {!searchExpanded && (
              <button
                onClick={() => {
                  window.scrollTo({ top: 400, behavior: "smooth" });
                }}
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "10px",
                  border: `1.5px solid ${BRAND.border}`,
                  background: "white",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: BRAND.text,
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = BRAND.primary;
                  e.currentTarget.style.color = BRAND.primary;
                  e.currentTarget.style.background = BRAND.primaryLight;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = BRAND.border;
                  e.currentTarget.style.color = BRAND.text;
                  e.currentTarget.style.background = "white";
                }}
                aria-label="Search"
              >
                <Search size={18} />
              </button>
            )}

            {/* Post Property */}
            <Link
              href="/post-property"
              style={{
                padding: "10px 18px",
                borderRadius: "10px",
                background: `linear-gradient(135deg, ${BRAND.primary}, ${BRAND.primaryDark})`,
                color: "white",
                fontSize: "13px",
                fontWeight: 700,
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                border: "none",
                textDecoration: "none",
                whiteSpace: "nowrap",
                boxShadow: "0 2px 10px rgba(22,163,74,0.25)",
                transition: "all 0.2s ease",
              }}
              className="hide-xs"
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = "0 4px 16px rgba(22,163,74,0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 10px rgba(22,163,74,0.25)";
              }}
            >
              Post property
              <span
                style={{
                  background: "white",
                  color: BRAND.primary,
                  fontSize: "9px",
                  fontWeight: 800,
                  borderRadius: "4px",
                  padding: "2px 6px",
                  letterSpacing: "0.5px",
                }}
              >
                FREE
              </span>
            </Link>

            {/* USER / LOGIN */}
            {user ? (
              <div ref={profileRef} style={{ position: "relative" }}>
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    border: `1.5px solid ${BRAND.border}`,
                    background: "white",
                    padding: "5px 12px 5px 5px",
                    borderRadius: "999px",
                    cursor: "pointer",
                    fontWeight: 600,
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = BRAND.primary;
                    e.currentTarget.style.boxShadow = `0 0 0 3px ${BRAND.primaryLight}`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = BRAND.border;
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: "50%",
                      background: `linear-gradient(135deg, ${BRAND.primary}, ${BRAND.primaryDark})`,
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800,
                      fontSize: "13px",
                    }}
                  >
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <span style={{ color: BRAND.text, fontSize: "13px" }} className="hide-sm">
                    {user?.name?.split(" ")[0] || user?.phone}
                  </span>
                  <ChevronDown size={14} color={BRAND.textMuted} />
                </button>

                {showProfileMenu && (
                  <div
                    style={{
                      position: "absolute",
                      top: "calc(100% + 10px)",
                      right: 0,
                      width: 260,
                      background: "#fff",
                      borderRadius: 14,
                      border: `1px solid ${BRAND.border}`,
                      boxShadow: "0 12px 40px rgba(0,0,0,.12)",
                      overflow: "hidden",
                      zIndex: 999,
                      animation: "slideDown 0.2s ease",
                    }}
                  >
                    <div
                      style={{
                        padding: "18px 18px",
                        background: `linear-gradient(135deg, ${BRAND.primary}, ${BRAND.primaryDark})`,
                        color: "white",
                      }}
                    >
                      <div style={{ fontWeight: 700, fontSize: "15px" }}>{user?.name || "User"}</div>
                      <div style={{ fontSize: "12px", opacity: 0.9, marginTop: "2px" }}>
                        {user?.phone ? `${user.phone.substring(0, 5)}xxxxx` : ""}
                      </div>
                    </div>

                    <button
                      onClick={() => setShowNotifications(!showNotifications)}
                      style={{ ...menuBtn, borderBottom: `1px solid ${BRAND.borderLight}` }}
                    >
                      <Bell size={16} color={BRAND.primary} />
                      <span>Notifications</span>
                      {unreadCount > 0 && (
                        <span
                          style={{
                            marginLeft: "auto",
                            background: BRAND.primary,
                            color: "#fff",
                            fontSize: "10px",
                            fontWeight: 700,
                            borderRadius: "999px",
                            minWidth: "20px",
                            height: "20px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "0 6px",
                          }}
                        >
                          {unreadCount}
                        </span>
                      )}
                    </button>

                    <Link href="/favorites" style={{ ...menuBtn, textDecoration: "none" }}>
                      <Heart size={16} color="#ec4899" />
                      <span>Saved Properties</span>
                    </Link>

                    <Link href="/my-properties" style={{ ...menuBtn, textDecoration: "none" }}>
                      <Home size={16} color={BRAND.primary} />
                      <span>My Properties</span>
                    </Link>

                    <button
                      onClick={logout}
                      style={{ ...menuBtn, color: "#dc2626", borderTop: `1px solid ${BRAND.borderLight}` }}
                    >
                      <LogOut size={16} />
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
                  gap: "6px",
                  padding: "10px 18px",
                  borderRadius: "10px",
                  border: `1.5px solid ${BRAND.border}`,
                  background: "white",
                  cursor: "pointer",
                  fontWeight: 700,
                  fontSize: "13px",
                  color: BRAND.text,
                  transition: "all 0.2s ease",
                  fontFamily: "inherit",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = BRAND.primary;
                  e.currentTarget.style.color = BRAND.primary;
                  e.currentTarget.style.background = BRAND.primaryLight;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = BRAND.border;
                  e.currentTarget.style.color = BRAND.text;
                  e.currentTarget.style.background = "white";
                }}
              >
                <User size={15} />
                <span>Login</span>
              </button>
            )}

            {/* Burger */}
            <button
              onClick={() => setMenuOpen(true)}
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: `1.5px solid ${BRAND.border}`,
                background: "white",
                color: BRAND.text,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = BRAND.primary;
                e.currentTarget.style.color = BRAND.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = BRAND.border;
                e.currentTarget.style.color = BRAND.text;
              }}
            >
              <Menu size={18} />
            </button>
          </div>
        </div>

        {/* ─── CATEGORY PILLS ROW ─── */}
        {!searchExpanded && (
          <div
            style={{
              borderTop: `1px solid ${BRAND.borderLight}`,
              background: BRAND.surface,
            }}
          >
            <div
              className="container"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "12px",
                height: "44px",
                overflowX: "auto",
                scrollbarWidth: "none",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", overflowX: "auto", scrollbarWidth: "none" }}>
                {["All", ...dynamicCategories].map((t) => (
                  <Link
                    key={t}
                    href={
                      t === "All"
                        ? "/properties"
                        : `/properties/city/${citySlug}/${encodeURIComponent(t.toLowerCase().replace(/\s+/g, "-"))}`
                    }
                    style={{
                      whiteSpace: "nowrap",
                      padding: "6px 14px",
                      borderRadius: "999px",
                      fontSize: "12.5px",
                      fontWeight: 600,
                      color: BRAND.text,
                      background: BRAND.surfaceAlt,
                      border: `1px solid ${BRAND.border}`,
                      textDecoration: "none",
                      transition: "all 0.15s ease",
                      flexShrink: 0,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = BRAND.primaryLight;
                      e.currentTarget.style.borderColor = BRAND.primary;
                      e.currentTarget.style.color = BRAND.primary;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = BRAND.surfaceAlt;
                      e.currentTarget.style.borderColor = BRAND.border;
                      e.currentTarget.style.color = BRAND.text;
                    }}
                  >
                    {t}
                    <span style={{ marginLeft: 6, fontWeight: 700, opacity: 0.65 }}>
                      ({t === "All" ? totalCount : categoryCounts[t] || 0})
                    </span>
                  </Link>
                ))}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                <Link
                  href="/properties?sortBy=newest"
                  style={{
                    whiteSpace: "nowrap",
                    padding: "5px 12px",
                    borderRadius: "8px",
                    background: "#e0f2fe",
                    color: "#0369a1",
                    fontWeight: 700,
                    fontSize: "11px",
                    border: "1px solid #bae6fd",
                    textDecoration: "none",
                  }}
                >
                  Latest
                </Link>
                <Link
                  href="/properties?sortBy=popular"
                  style={{
                    whiteSpace: "nowrap",
                    padding: "5px 12px",
                    borderRadius: "8px",
                    background: BRAND.primaryLight,
                    color: BRAND.primaryDark,
                    fontWeight: 700,
                    fontSize: "11px",
                    border: `1px solid ${BRAND.primaryBorder}`,
                    textDecoration: "none",
                  }}
                >
                  Popular
                </Link>
              </div>
            </div>
          </div>
        )}

        {showAuthModal && (
          <AuthModal
            onClose={() => setShowAuthModal(false)}
            onLoginSuccess={(userData) => {
              setUser(userData);
              setShowAuthModal(false);
            }}
          />
        )}
      </header>

      {/* ═══════════ MOBILE DRAWER ═══════════ */}
      {menuOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 2000, display: "flex" }}>
          <div
            onClick={() => setMenuOpen(false)}
            style={{ flex: 1, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", animation: "fadeIn 0.25s ease" }}
          />
          <div
            style={{
              width: "min(420px, 92vw)",
              height: "100%",
              background: "white",
              display: "flex",
              flexDirection: "column",
              overflowY: "auto",
              boxShadow: "-20px 0 60px rgba(0,0,0,0.18)",
              animation: "slideRight 0.3s cubic-bezier(0.4,0,0.2,1)",
            }}
          >
            <div
              style={{
                padding: "20px 24px",
                background: `linear-gradient(135deg, ${BRAND.primary}, ${BRAND.primaryDark})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ color: "white", fontWeight: 800, fontSize: "18px" }}>MahaProperties</div>
              <button
                onClick={() => setMenuOpen(false)}
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "9px",
                  border: "1.5px solid rgba(255,255,255,0.3)",
                  background: "rgba(255,255,255,0.15)",
                  color: "white",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <X size={18} />
              </button>
            </div>

            {user && (
              <div
                style={{
                  padding: "18px 24px",
                  borderBottom: `1px solid ${BRAND.borderLight}`,
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  background: BRAND.surfaceAlt,
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${BRAND.primary}, ${BRAND.primaryDark})`,
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
                  <div style={{ fontWeight: 700, color: BRAND.text }}>{user?.name || "User"}</div>
                  <div style={{ fontSize: ".85rem", color: BRAND.textMuted, marginTop: "2px" }}>{user?.phone}</div>
                </div>
              </div>
            )}

            <div style={{ padding: "16px 24px 8px" }}>
              <div
                style={{
                  fontSize: "10.5px",
                  fontWeight: 800,
                  color: BRAND.primary,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: "12px",
                }}
              >
                Browse by Type
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                {[
                  { icon: "🏞️", label: "NA Plots", href: "/properties/city/nashik/na-plot" },
                  { icon: "📋", label: "Collector NA", href: "/properties/city/nashik/collector-na" },
                  { icon: "🌾", label: "Agriculture", href: "/properties/city/nashik/agriculture" },
                  { icon: "🏭", label: "Warehouse", href: "/properties/city/nashik/warehouse" },
                  { icon: "🏢", label: "Commercial", href: "/properties/city/nashik/commercial" },
                  { icon: "📈", label: "Investment", href: "/properties/city/nashik/investment-plot" },
                  { icon: "🍇", label: "Farmhouse", href: "/properties/city/nashik/farmhouse" },
                  { icon: "🏗️", label: "Industrial", href: "/properties/city/nashik/industrial-shed" },
                ].map((c) => (
                  <Link
                    key={c.label}
                    href={c.href.replace("/properties/city/nashik", `/properties/city/${citySlug}`)}
                    onClick={() => setMenuOpen(false)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "9px",
                      padding: "11px 12px",
                      borderRadius: "10px",
                      border: `1.5px solid ${BRAND.borderLight}`,
                      background: BRAND.surfaceAlt,
                      fontSize: "13px",
                      fontWeight: 600,
                      color: BRAND.text,
                      textDecoration: "none",
                    }}
                  >
                    <span style={{ fontSize: "1rem" }}>{c.icon}</span> {c.label}
                  </Link>
                ))}
              </div>
            </div>

            <div style={{ padding: "16px 24px" }}>
              <div
                style={{
                  fontSize: "10.5px",
                  fontWeight: 800,
                  color: BRAND.primary,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: "12px",
                }}
              >
                Popular Localities
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "7px" }}>
                {["Gangapur Road", "College Road", "Indira Nagar", "Panchavati", "Nashik Road", "Ambad MIDC", "Satpur MIDC", "Pathardi Phata", "Igatpuri", "Trimbak Road"].map((l) => (
                  <Link
                    key={l}
                    href={`/localities/${l.toLowerCase().replace(/\s+/g, "-")}`}
                    onClick={() => setMenuOpen(false)}
                    style={{
                      padding: "6px 13px",
                      borderRadius: "100px",
                      background: BRAND.borderLight,
                      color: BRAND.text,
                      fontSize: "12.5px",
                      fontWeight: 500,
                      textDecoration: "none",
                    }}
                  >
                    {l}
                  </Link>
                ))}
              </div>
            </div>

            <div style={{ padding: "16px 24px", marginTop: "auto", borderTop: `1px solid ${BRAND.borderLight}` }}>
              {!user && (
                <button
                  onClick={() => { setShowAuthModal(true); setMenuOpen(false); }}
                  style={{
                    width: "100%",
                    height: "48px",
                    borderRadius: "10px",
                    border: `1.5px solid ${BRAND.primary}`,
                    background: "white",
                    color: BRAND.primary,
                    fontWeight: 700,
                    fontSize: "15px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    marginBottom: "10px",
                  }}
                >
                  <User size={18} />
                  Login / Register
                </button>
              )}
              <Link
                href="/post-property"
                onClick={() => setMenuOpen(false)}
                style={{
                  padding: "14px",
                  borderRadius: "10px",
                  textAlign: "center",
                  background: `linear-gradient(135deg, ${BRAND.primary}, ${BRAND.primaryDark})`,
                  color: "white",
                  fontWeight: 700,
                  fontSize: "15px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  textDecoration: "none",
                  boxShadow: "0 4px 14px rgba(22,163,74,0.35)",
                }}
              >
                Post Property — FREE
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ── Animations & Responsive ── */}
      <style>{`
        @media (max-width: 1100px) { .hide-md { display: none !important; } }
        @media (max-width: 768px)  { .hide-sm { display: none !important; } }
        @media (max-width: 480px)  { .hide-xs { display: none !important; } }

        @keyframes slideRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes megaSlideDown { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes expandSearch {
          from { opacity: 0; transform: scaleX(0.85); transform-origin: right center; }
          to { opacity: 1; transform: scaleX(1); }
        }

        .container::-webkit-scrollbar { display: none; }
        * { -webkit-tap-highlight-color: transparent; }

        button:focus-visible, input:focus-visible, a:focus-visible {
          outline: 2px solid ${BRAND.primary};
          outline-offset: 2px;
        }
      `}</style>
    </>
  );
}

export default Navbar;
