"use client";

import Link from "next/link";
import { Home } from "lucide-react";

interface BreadcrumbItem {
  name: string;
  href: string;
}

interface Props {
  items?: BreadcrumbItem[];
  property?: {
    city?: string;
    locality?: string;
    category?: string;
    title?: string;
  };
}

export default function Breadcrumbs({ items, property }: Props) {
  // If custom items are provided
  if (items && items.length > 0) {
    return (
      <nav className="breadcrumbs">
        <div className="breadcrumb-list">
          <Link href="/" className="breadcrumb-link">
            <Home size={14} /> Home
          </Link>
          {items.map((item, index) => (
            <span key={item.href}>
              <span className="separator">/</span>
              {index === items.length - 1 ? (
                <span className="current">{item.name}</span>
              ) : (
                <Link href={item.href} className="breadcrumb-link">
                  {item.name}
                </Link>
              )}
            </span>
          ))}
        </div>

        <style jsx>{`
          .breadcrumbs {
            padding: 12px 0;
            margin-bottom: 16px;
          }
          .breadcrumb-list {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: 8px;
            font-size: 13px;
          }
          .breadcrumb-link {
            display: flex;
            align-items: center;
            gap: 4px;
            color: #16a34a;
            text-decoration: none;
          }
          .breadcrumb-link:hover {
            text-decoration: underline;
          }
          .separator {
            color: #cbd5e1;
            margin: 0 4px;
          }
          .current {
            color: #0f172a;
            font-weight: 600;
          }
        `}</style>
      </nav>
    );
  }

  // Property breadcrumbs - with safe null checks
  const formatCategory = (cat?: string) => {
    if (!cat) return "Property";
    return cat.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  };

  // Safe check for property existence
  if (!property) {
    return (
      <nav className="breadcrumbs">
        <div className="breadcrumb-list">
          <Link href="/" className="breadcrumb-link">🏠 Home</Link>
          <span className="separator">›</span>
          <span className="current">Properties</span>
        </div>

        <style jsx>{`
          .breadcrumbs {
            padding: 12px 0;
            margin-bottom: 20px;
          }
          .breadcrumb-list {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: 8px;
            font-size: 13px;
          }
          .breadcrumb-link {
            color: #16a34a;
            text-decoration: none;
          }
          .separator {
            color: #cbd5e1;
          }
          .current {
            color: #0f172a;
            font-weight: 600;
          }
        `}</style>
      </nav>
    );
  }

  return (
    <nav className="breadcrumbs">
      <div className="breadcrumb-list">
        <Link href="/" className="breadcrumb-link">
          🏠 Home
        </Link>
        <span className="separator">›</span>
        <Link href="/properties" className="breadcrumb-link">
          Properties
        </Link>
        
        {/* Safe check for city - only show if exists */}
        {property.city && (
          <>
            <span className="separator">›</span>
            <Link 
              href={`/properties?city=${encodeURIComponent(property.city)}`} 
              className="breadcrumb-link"
            >
              {property.city}
            </Link>
          </>
        )}
        
        {/* Safe check for locality - only show if exists */}
        {property.locality && (
          <>
            <span className="separator">›</span>
            <span className="breadcrumb-text">{property.locality}</span>
          </>
        )}
        
        {/* Always show category or fallback */}
        <span className="separator">›</span>
        <span className="current">
          {formatCategory(property.category)}
        </span>
      </div>

      <style jsx>{`
        .breadcrumbs {
          padding: 12px 0;
          margin-bottom: 20px;
          background: #f8fafc;
          border-radius: 12px;
          padding: 12px 20px;
        }
        .breadcrumb-list {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 8px;
          font-size: 13px;
        }
        .breadcrumb-link {
          color: #16a34a;
          text-decoration: none;
        }
        .breadcrumb-link:hover {
          text-decoration: underline;
        }
        .breadcrumb-text {
          color: #64748b;
        }
        .separator {
          color: #cbd5e1;
        }
        .current {
          color: #0f172a;
          font-weight: 600;
          background: #e2e8f0;
          padding: 4px 10px;
          border-radius: 20px;
        }
      `}</style>
    </nav>
  );
}