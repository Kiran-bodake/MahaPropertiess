"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  Search,
  MapPin,
  ChevronDown,
  TrendingUp,
  Shield,
  Star,
  X,
  Clock,
} from "lucide-react";
import { useAutocomplete } from "@/hooks/useAutocomplete";
import { AutocompleteDropdown } from "@/components/shared/AutocompleteDropdown";

const SLIDES = [
  {
    bg: "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
    tag: "NA Plots from ₹8L",
    headline: "Find Your Perfect Plot in Nashik",
    sub: "2,500+ verified properties across 40+ localities",
  },
  {
    bg: "linear-gradient(135deg, #134e4a 0%, #065f46 50%, #064e3b 100%)",
    tag: "Agriculture Land — Best Rates",
    headline: "Invest in Nashik's Fertile Farmlands",
    sub: "Prime agriculture land with clear titles & RERA compliance",
  },
  {
    bg: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e3a5f 100%)",
    tag: "Commercial Properties",
    headline: "Premium Commercial Spaces Available",
    sub: "Industrial sheds, warehouses & commercial plots",
  },
];

const CATEGORIES = [
  { label: "NA Plot", icon: "🏞️", href: "/properties/city/nashik/na-plot", color: "#16a34a" },
  { label: "Collector NA Plot", icon: "📋", href: "/properties/city/nashik/collector-na", color: "#0891b2" },
  { label: "Agriculture Land", icon: "🌾", href: "/properties/city/nashik/agriculture", color: "#d97706" },
  { label: "Warehouse Land", icon: "🏭", href: "/properties/city/nashik/warehouse", color: "#7c3aed" },
  { label: "Commercial Property", icon: "🏢", href: "/properties/city/nashik/commercial", color: "#dc2626" },
  { label: "Investment Plots", icon: "📈", href: "/properties/city/nashik/investment-plot", color: "#0f766e" },
];

const LOCALITIES = [
  "Nashik Road", "Gangapur Road", "Meri", "Varavandi", "Pathardi Phata",
  "Indira Nagar", "Igatpuri", "Trimbak Road", "Dindori Road", "Cidco",
  "Satpur", "Ambad", "Panchavati", "College Road", "Sinnar", "Ozar",
];

export function EnhancedHeroSection() {
  const [slide, setSlide] = useState(0);
  const [category, setCategory] = useState("All Types");
  const [locality, setLocality] = useState("Any Locality");
  const [showLoc, setShowLoc] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });
  
  // 🆕 Sticky search state
  const [isSticky, setIsSticky] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Refs
  const searchBoxRef = useRef<HTMLDivElement>(null);
  const stickyContainerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Autocomplete hook
  const {
    query,
    suggestions: autoSuggestions,
    isLoading: autoLoading,
    showSuggestions: autoShow,
    handleInputChange,
    handleSelectSuggestion,
    handleCloseSuggestions,
    setShowSuggestions: setAutoShow,
  } = useAutocomplete({ category: "all", minChars: 1 });

  // Load recent searches
  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved).slice(0, 5));
      } catch (e) {
        console.error("Error loading recent searches:", e);
      }
    }
  }, []);

  // Save recent search
  const saveRecentSearch = useCallback((query: string) => {
    if (!query.trim()) return;
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  }, [recentSearches]);

  // Handle scroll to make search sticky
  useEffect(() => {
    let lastScrollY = 0;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          
          // Get the search box position
          if (searchBoxRef.current) {
            const rect = searchBoxRef.current.getBoundingClientRect();
            const shouldBeSticky = rect.top < 0 && currentScrollY > 100;
            
            // Only show when scrolling down, hide when at top
            if (shouldBeSticky && currentScrollY > lastScrollY) {
              setIsSticky(true);
            } else if (currentScrollY < 80) {
              setIsSticky(false);
            }
          }
          
          lastScrollY = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (stickyContainerRef.current && !stickyContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
      
      if (e.key === "Escape") {
        inputRef.current?.blur();
        setShowSuggestions(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Debounced search suggestions
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (searchQuery.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsLoading(true);
    debounceTimer.current = setTimeout(() => {
      fetchSuggestions(searchQuery);
    }, 300);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [searchQuery]);

  // Fetch suggestions
  const fetchSuggestions = async (query: string) => {
    try {
      const response = await fetch(`/api/search-suggestions?q=${encodeURIComponent(query)}&city=Nashik`);
      const data = await response.json();
      setSuggestions(data.slice(0, 8));
      setShowSuggestions(true);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([
        { id: "1", title: `3 BHK Flat in Nashik`, category: "Residential", locality: "College Road", price: "₹65 Lakh" },
        { id: "2", title: `NA Plot in Nashik`, category: "Land", locality: "Gangapur Road", price: "₹45 Lakh" },
        { id: "3", title: `Agriculture Land in Nashik`, category: "Agriculture", locality: "Dindori", price: "₹28 Lakh" },
      ]);
      setShowSuggestions(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      saveRecentSearch(searchQuery);
      const params = new URLSearchParams({
        search: searchQuery.trim(),
        city: "Nashik",
        page: "1",
      });
      window.location.href = `/properties?${params.toString()}`;
      setShowSuggestions(false);
      inputRef.current?.blur();
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: any) => {
    saveRecentSearch(suggestion.title);
    const params = new URLSearchParams({
      search: suggestion.title,
      city: "Nashik",
      page: "1",
    });
    window.location.href = `/properties?${params.toString()}`;
    setShowSuggestions(false);
    setSearchQuery("");
    inputRef.current?.blur();
  };

  // Handle recent search click
  const handleRecentSearchClick = (query: string) => {
    const params = new URLSearchParams({
      search: query,
      city: "Nashik",
      page: "1",
    });
    window.location.href = `/properties?${params.toString()}`;
    setShowSuggestions(false);
    inputRef.current?.blur();
  };

  // Clear recent searches
  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);

  // Update dropdown position
  useEffect(() => {
    if (searchBoxRef.current && showSuggestions) {
      const rect = searchBoxRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + window.scrollY + 10,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [showSuggestions, suggestions]);

  const current = SLIDES[slide];

  const citySlug = locality && locality !== "Any Locality"
    ? locality.toLowerCase().replace(/\s+/g, "-")
    : "";

  const categoryMap: Record<string, string> = {
    "NA Plot": "na-plot",
    "Collector NA Plot": "collector-na",
    "Agriculture Land": "agriculture",
    "Warehouse Land": "warehouse",
    "Commercial Property": "commercial",
    "Investment Plots": "investment-plot",
  };

  const categorySlug = category !== "All Types" ? categoryMap[category] : "";

  // 🆕 Trending searches for sticky mode
  const trendingSearches = [
    "3 BHK flats",
    "NA plots",
    "Agriculture land",
    "Commercial property",
    "Warehouse",
  ];

  return (
    <>
      {/* 🆕 STICKY SEARCH BAR - Appears when scrolling */}
      {isSticky && (
        <>
          {/* Spacer */}
          <div style={{ height: "80px" }} />
          
          <div
            ref={stickyContainerRef}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              zIndex: 1000,
              background: "rgba(255, 255, 255, 0.98)",
              backdropFilter: "blur(12px)",
              borderBottom: "1px solid rgba(229, 231, 235, 0.8)",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
              padding: "10px 0",
              animation: "slideDown 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            <div
              style={{
                maxWidth: "1280px",
                margin: "0 auto",
                padding: "0 24px",
                display: "flex",
                alignItems: "center",
                gap: "20px",
              }}
            >
              {/* Logo */}
              <Link
                href="/"
                style={{
                  fontWeight: 800,
                  fontSize: "22px",
                  color: "#16a34a",
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span style={{ fontSize: "24px" }}>🏠</span>
                <span>MahaProperties</span>
              </Link>

              {/* Search Form - Expanded */}
              <form
                onSubmit={handleSearch}
                style={{
                  flex: 1,
                  position: "relative",
                  maxWidth: "820px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    background: isFocused ? "#ffffff" : "#f3f4f6",
                    borderRadius: "14px",
                    border: isFocused ? "2px solid #16a34a" : "2px solid transparent",
                    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                    padding: "4px",
                    boxShadow: isFocused 
                      ? "0 0 0 4px rgba(22, 163, 74, 0.1), 0 4px 12px rgba(0, 0, 0, 0.05)" 
                      : "0 1px 3px rgba(0, 0, 0, 0.04)",
                  }}
                >
                  <Search
                    size={20}
                    style={{
                      marginLeft: "16px",
                      color: isFocused ? "#16a34a" : "#6b7280",
                      flexShrink: 0,
                      transition: "color 0.2s ease",
                    }}
                  />

                  <input
                    ref={inputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => {
                      setIsFocused(true);
                      if (searchQuery.length >= 2) {
                        setShowSuggestions(true);
                      } else if (recentSearches.length > 0) {
                        setShowSuggestions(true);
                      }
                    }}
                    onBlur={() => {
                      setTimeout(() => {
                        if (!document.activeElement?.closest('.suggestions-container')) {
                          setShowSuggestions(false);
                        }
                      }, 200);
                    }}
                    placeholder="Search properties in Nashik..."
                    style={{
                      flex: 1,
                      border: "none",
                      outline: "none",
                      background: "transparent",
                      padding: "12px 16px",
                      fontSize: "15px",
                      fontWeight: 500,
                      color: "#111827",
                      fontFamily: "'DM Sans', system-ui, sans-serif",
                      minWidth: "0",
                      width: "100%",
                    }}
                  />

                  {isLoading && (
                    <div style={{ padding: "0 8px", flexShrink: 0 }}>
                      <div className="spinner" style={{
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        border: "2px solid #e5e7eb",
                        borderTopColor: "#16a34a",
                        animation: "spin 0.8s linear infinite",
                      }} />
                    </div>
                  )}

                  {searchQuery && !isLoading && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery("");
                        inputRef.current?.focus();
                      }}
                      style={{
                        background: "#f3f4f6",
                        border: "none",
                        borderRadius: "50%",
                        padding: "6px",
                        cursor: "pointer",
                        color: "#6b7280",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.2s ease",
                        flexShrink: 0,
                        marginRight: "4px",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#e5e7eb";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "#f3f4f6";
                      }}
                    >
                      <X size={16} />
                    </button>
                  )}

                  {!searchQuery && !isFocused && (
                    <div
                      style={{
                        background: "#f3f4f6",
                        padding: "4px 10px",
                        borderRadius: "6px",
                        fontSize: "11px",
                        fontWeight: 600,
                        color: "#6b7280",
                        border: "1px solid #e5e7eb",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        flexShrink: 0,
                        marginRight: "8px",
                      }}
                    >
                      <span>⌘</span>
                      <span>K</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    style={{
                      background: "#16a34a",
                      color: "white",
                      border: "none",
                      borderRadius: "10px",
                      padding: "10px 24px",
                      fontWeight: 700,
                      fontSize: "14px",
                      cursor: "pointer",
                      transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#22c55e";
                      e.currentTarget.style.transform = "scale(1.02)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#16a34a";
                      e.currentTarget.style.transform = "scale(1)";
                    }}
                  >
                    Search
                  </button>
                </div>

                {/* Suggestions Dropdown for Sticky Search */}
                {showSuggestions && (
                  <div
                    className="suggestions-container"
                    style={{
                      position: "absolute",
                      top: "calc(100% + 8px)",
                      left: 0,
                      right: 0,
                      background: "white",
                      borderRadius: "16px",
                      boxShadow: "0 20px 60px rgba(0, 0, 0, 0.12)",
                      border: "1px solid rgba(229, 231, 235, 0.8)",
                      maxHeight: "420px",
                      overflowY: "auto",
                      zIndex: 1001,
                      padding: "8px 0",
                      animation: "fadeIn 0.2s ease",
                    }}
                  >
                    {!searchQuery && recentSearches.length > 0 && (
                      <div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "8px 16px",
                            fontSize: "11px",
                            fontWeight: 600,
                            color: "#6b7280",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                          }}
                        >
                          <span>Recent Searches</span>
                          <button
                            onClick={clearRecentSearches}
                            style={{
                              background: "none",
                              border: "none",
                              color: "#9ca3af",
                              fontSize: "11px",
                              cursor: "pointer",
                              fontWeight: 500,
                              padding: "4px 8px",
                              borderRadius: "4px",
                              transition: "background 0.2s ease",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = "#f3f4f6";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = "transparent";
                            }}
                          >
                            Clear all
                          </button>
                        </div>
                        {recentSearches.map((query, index) => (
                          <div
                            key={index}
                            onClick={() => handleRecentSearchClick(query)}
                            style={{
                              padding: "10px 16px",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: "12px",
                              transition: "background 0.15s ease",
                              borderRadius: "4px",
                              margin: "0 4px",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = "#f9fafb";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = "transparent";
                            }}
                          >
                            <Clock size={14} color="#9ca3af" />
                            <span style={{ fontSize: "14px", color: "#111827" }}>{query}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {!searchQuery && recentSearches.length === 0 && (
                      <div>
                        <div
                          style={{
                            padding: "8px 16px",
                            fontSize: "11px",
                            fontWeight: 600,
                            color: "#6b7280",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                          }}
                        >
                          Trending Searches
                        </div>
                        {trendingSearches.map((query, index) => (
                          <div
                            key={index}
                            onClick={() => handleRecentSearchClick(query)}
                            style={{
                              padding: "10px 16px",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: "12px",
                              transition: "background 0.15s ease",
                              borderRadius: "4px",
                              margin: "0 4px",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = "#f9fafb";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = "transparent";
                            }}
                          >
                            <TrendingUp size={14} color="#f59e0b" />
                            <span style={{ fontSize: "14px", color: "#111827" }}>{query}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {searchQuery.length >= 2 && suggestions.length > 0 && (
                      <>
                        <div
                          style={{
                            padding: "8px 16px",
                            fontSize: "11px",
                            fontWeight: 600,
                            color: "#6b7280",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                            borderTop: recentSearches.length > 0 ? "1px solid #f3f4f6" : "none",
                            marginTop: recentSearches.length > 0 ? "8px" : "0",
                            paddingTop: recentSearches.length > 0 ? "12px" : "8px",
                          }}
                        >
                          Suggestions
                        </div>
                        {suggestions.map((suggestion) => (
                          <div
                            key={suggestion.id}
                            onClick={() => handleSuggestionClick(suggestion)}
                            style={{
                              padding: "10px 16px",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: "12px",
                              transition: "background 0.15s ease",
                              borderRadius: "4px",
                              margin: "0 4px",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = "#f9fafb";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = "transparent";
                            }}
                          >
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: "14px", fontWeight: 500, color: "#111827" }}>
                                {suggestion.title}
                              </div>
                              <div style={{ display: "flex", gap: "12px", marginTop: "4px" }}>
                                <span style={{ fontSize: "12px", color: "#6b7280", display: "flex", alignItems: "center", gap: "4px" }}>
                                  <MapPin size={12} />
                                  {suggestion.locality}
                                </span>
                                <span style={{ fontSize: "12px", color: "#16a34a", fontWeight: 600 }}>
                                  {suggestion.price}
                                </span>
                              </div>
                            </div>
                            <span
                              style={{
                                fontSize: "11px",
                                color: "#6b7280",
                                background: "#f3f4f6",
                                padding: "2px 10px",
                                borderRadius: "99px",
                                flexShrink: 0,
                              }}
                            >
                              {suggestion.category}
                            </span>
                          </div>
                        ))}
                      </>
                    )}

                    {searchQuery.length >= 2 && suggestions.length > 0 && (
                      <div
                        style={{
                          padding: "12px 16px",
                          borderTop: "1px solid #f3f4f6",
                          textAlign: "center",
                        }}
                      >
                        <Link
                          href={`/properties?search=${encodeURIComponent(searchQuery)}&city=Nashik`}
                          style={{
                            color: "#16a34a",
                            textDecoration: "none",
                            fontSize: "13px",
                            fontWeight: 600,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                          onClick={() => {
                            setShowSuggestions(false);
                            saveRecentSearch(searchQuery);
                          }}
                        >
                          View all results
                          <span style={{ fontSize: "16px" }}>→</span>
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </form>

              {/* Quick Action */}
              <Link
                href="/post-property"
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#16a34a",
                  textDecoration: "none",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  background: "#f0fdf4",
                  transition: "all 0.2s ease",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#dcfce7";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#f0fdf4";
                }}
              >
                List Property
              </Link>
            </div>
          </div>
        </>
      )}

      {/* 🆕 Original Hero Section with Search Box */}
      <section
        ref={heroRef}
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          overflow: "visible",
        }}
      >
        {/* Animated background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: current.bg,
            transition: "background 1.2s ease",
          }}
        />

        {/* Grid pattern overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.07,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Glowing orbs */}
        <div
          style={{
            position: "absolute",
            top: "20%",
            right: "10%",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(74,222,128,0.15) 0%, transparent 70%)",
            filter: "blur(40px)",
            animation: "float 6s ease-in-out infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "10%",
            left: "5%",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)",
            filter: "blur(30px)",
            animation: "float 8s ease-in-out infinite reverse",
          }}
        />

        <div
          className="container"
          style={{
            position: "relative",
            zIndex: 2,
            paddingTop: "120px",
            paddingBottom: "60px",
          }}
        >
          {/* Top badge */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "28px",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "rgba(255,255,255,0.12)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "100px",
                padding: "8px 18px",
                color: "white",
                fontSize: "0.8rem",
                fontWeight: 600,
              }}
            >
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: "#4ade82",
                  display: "inline-block",
                  animation: "pulse-ring 2s infinite",
                }}
              />
              {current.tag}
            </div>
          </div>

          {/* Headline */}
          <h1
            style={{
              textAlign: "center",
              color: "white",
              fontSize: "clamp(2rem, 5vw, 3.75rem)",
              fontWeight: 900,
              lineHeight: 1.1,
              marginBottom: "20px",
              fontFamily: "var(--font-syne, Syne, serif)",
            }}
          >
            {current.headline}
          </h1>

          <p
            style={{
              textAlign: "center",
              color: "rgba(255,255,255,0.75)",
              fontSize: "clamp(1rem, 2vw, 1.2rem)",
              marginBottom: "48px",
              maxWidth: "600px",
              margin: "0 auto 48px",
            }}
          >
            {current.sub}
          </p>

          {/* 🆕 Search Box Container - Original with ID for tracking */}
          <div
            style={{
              position: "relative",
              maxWidth: "860px",
              margin: "0 auto 48px",
            }}
            ref={searchBoxRef}
            id="search-box-container"
          >
            {/* Original Search Box */}
            <div
              style={{
                background: "white",
                borderRadius: "20px",
                padding: "10px",
                boxShadow: "0 30px 80px rgba(0,0,0,0.3)",
                display: "grid",
                gridTemplateColumns: "1fr 1px 180px 1px auto auto",
                alignItems: "center",
                gap: "0",
              }}
            >
              {/* Keyword with Autocomplete */}
              <div style={{ padding: "8px 16px" }}>
                <div
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    color: "#9ca3af",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    marginBottom: "4px",
                  }}
                >
                  Search
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <Search size={16} color="#16a34a" />
                  <input
                    value={query}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onFocus={() => setAutoShow(true)}
                    onBlur={() => {
                      setTimeout(() => handleCloseSuggestions(), 200);
                    }}
                    placeholder="Project, locality, keyword..."
                    style={{
                      border: "none",
                      outline: "none",
                      fontSize: "0.95rem",
                      fontWeight: 500,
                      color: "#1a1a2e",
                      width: "100%",
                      background: "transparent",
                    }}
                  />
                </div>
              </div>

              <div
                style={{ width: "1px", height: "40px", background: "#e5e7eb" }}
              />

              {/* Category */}
              <div style={{ padding: "8px 16px" }}>
                <div
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    color: "#9ca3af",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    marginBottom: "4px",
                  }}
                >
                  Property Type
                </div>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{
                    border: "none",
                    outline: "none",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    color: "#1a1a2e",
                    background: "transparent",
                    width: "100%",
                    cursor: "pointer",
                  }}
                >
                  <option>All Types</option>
                  <option>NA Plot</option>
                  <option>Collector NA Plot</option>
                  <option>Agriculture Land</option>
                  <option>Warehouse Land</option>
                  <option>Commercial Property</option>
                  <option>Investment Plots</option>
                </select>
              </div>

              <div
                style={{ width: "1px", height: "40px", background: "#e5e7eb" }}
              />

              {/* Locality */}
              <div
                style={{
                  padding: "8px 16px",
                  position: "relative",
                  minWidth: "160px",
                }}
              >
                <div
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    color: "#9ca3af",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    marginBottom: "4px",
                  }}
                >
                  Locality
                </div>
                <button
                  onClick={() => setShowLoc(!showLoc)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    color: "#1a1a2e",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <MapPin size={14} color="#16a34a" />
                  {locality}
                  <ChevronDown size={13} />
                </button>
                {showLoc && (
                  <div
                    style={{
                      position: "absolute",
                      top: "calc(100% + 8px)",
                      left: 0,
                      background: "white",
                      borderRadius: "16px",
                      padding: "8px",
                      boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
                      width: "240px",
                      zIndex: 50,
                      border: "1px solid rgba(0,0,0,0.06)",
                      maxHeight: "260px",
                      overflowY: "auto",
                    }}
                  >
                    {["Any Locality", ...LOCALITIES].map((l) => (
                      <button
                        key={l}
                        onClick={() => {
                          setLocality(l);
                          setShowLoc(false);
                        }}
                        style={{
                          display: "block",
                          width: "100%",
                          textAlign: "left",
                          padding: "8px 12px",
                          borderRadius: "8px",
                          fontSize: "0.85rem",
                          color: locality === l ? "#16a34a" : "#374151",
                          fontWeight: locality === l ? 700 : 500,
                          background: locality === l ? "#f0fdf6" : "transparent",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Search Button */}
              <div style={{ padding: "6px" }}>
                <Link
                  href={
                    citySlug && categorySlug
                      ? `/properties/city/${citySlug}/${categorySlug}`
                      : citySlug
                        ? `/properties/city/${citySlug}`
                        : "/properties"
                  }
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    padding: "14px 32px",
                    borderRadius: "14px",
                    background: "linear-gradient(135deg,#16a34a,#22c55e)",
                    color: "white",
                    fontWeight: 700,
                    fontSize: "1rem",
                    boxShadow: "0 6px 20px rgba(22,163,74,0.4)",
                    whiteSpace: "nowrap",
                  }}
                >
                  <Search size={18} />
                  Search
                </Link>
              </div>
            </div>
          </div>

          {/* Category Pills */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              justifyContent: "center",
              marginBottom: "64px",
            }}
          >
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.label}
                href={`/properties/city/${
                  locality && locality !== "Any Locality"
                    ? locality.toLowerCase().replace(/\s+/g, "-")
                    : "nashik"
                }/${cat.href.split("/").pop()}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "rgba(255,255,255,0.12)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "100px",
                  padding: "8px 16px",
                  color: "white",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background =
                    "rgba(255,255,255,0.22)";
                  (e.currentTarget as HTMLElement).style.transform =
                    "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background =
                    "rgba(255,255,255,0.12)";
                  (e.currentTarget as HTMLElement).style.transform =
                    "translateY(0)";
                }}
              >
                <span>{cat.icon}</span> {cat.label}
              </Link>
            ))}
          </div>

          {/* Stats Row */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "48px",
            }}
          >
            {[
              { icon: <TrendingUp size={20} />, val: "₹8L+", lab: "Starting Price" },
              { icon: <Shield size={20} />, val: "RERA", lab: "Verified Listings" },
              { icon: <Star size={20} />, val: "2500+", lab: "Active Properties" },
              { icon: <MapPin size={20} />, val: "40+", lab: "Localities Covered" },
            ].map((s) => (
              <div
                key={s.lab}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  color: "rgba(255,255,255,0.85)",
                }}
              >
                <div style={{ color: "#4ade82" }}>{s.icon}</div>
                <div>
                  <div
                    style={{
                      fontWeight: 800,
                      fontSize: "1.25rem",
                      color: "white",
                      lineHeight: 1,
                    }}
                  >
                    {s.val}
                  </div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "rgba(255,255,255,0.6)",
                      marginTop: "2px",
                    }}
                  >
                    {s.lab}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Autocomplete Dropdown - Fixed Position */}
        <div
          style={{
            position: "fixed",
            top: `${dropdownPos.top}px`,
            left: `${dropdownPos.left}px`,
            width: `${Math.min(dropdownPos.width, 400)}px`,
            maxWidth: "400px",
            zIndex: 9999,
            pointerEvents: autoShow ? "auto" : "none",
          }}
        >
          <AutocompleteDropdown
            suggestions={autoSuggestions}
            isLoading={autoLoading}
            isOpen={autoShow}
            query={query}
            onSelect={(item) => {
              handleSelectSuggestion(item);
            }}
            onClose={handleCloseSuggestions}
            className="shadow-lg"
          />
        </div>

        {/* Slide indicators */}
        <div
          style={{
            position: "absolute",
            bottom: "24px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: "8px",
            zIndex: 2,
          }}
        >
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              style={{
                width: slide === i ? "28px" : "8px",
                height: "8px",
                borderRadius: "100px",
                border: "none",
                cursor: "pointer",
                background: slide === i ? "#4ade82" : "rgba(255,255,255,0.4)",
                transition: "all 0.3s",
              }}
            />
          ))}
        </div>

        <style>{`
          @keyframes pulse-ring {
            0%   { box-shadow: 0 0 0 0 rgba(74,222,128,0.6); }
            70%  { box-shadow: 0 0 0 8px rgba(74,222,128,0); }
            100% { box-shadow: 0 0 0 0 rgba(74,222,128,0); }
          }
          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(-4px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
          @media(max-width:768px) {
            section > .container > div[style*="grid"] {
              display: flex !important;
              flex-direction: column !important;
            }
            .hero-arrow {
              opacity: 0 !important;
              visibility: hidden !important;
              pointer-events: none !important;
            }
          }
        `}</style>
      </section>
    </>
  );
}