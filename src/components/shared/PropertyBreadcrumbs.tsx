"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface Props {
  property?: {
    title: string;
    category?: string;
    city?: string;
    slug?: string;
  };
}

export default function PropertyBreadcrumbs({ property }: Props) {
  return (
    <nav className="breadcrumbs">
      <div className="breadcrumb-container">
        {/* Home */}
        <Link href="/" className="breadcrumb-item">
          <Home size={16} />
          <span>Home</span>
        </Link>
        <span className="separator">›</span>

        {/* Properties */}
        <Link href="/properties" className="breadcrumb-item">
          Properties
        </Link>
        <span className="separator">›</span>

        {/* Category (if property exists) */}
        {property?.category && (
          <>
            <Link 
              href={`/properties?category=${property.category.toLowerCase()}`} 
              className="breadcrumb-item"
            >
              {property.category}
            </Link>
            <span className="separator">›</span>
          </>
        )}

        {/* Current Page */}
        <span className="breadcrumb-current">
          {property?.title || "Properties"}
        </span>
      </div>

      <style jsx>{`
        .breadcrumbs {
          background: #f8fafc;
          padding: 12px 0;
          margin-bottom: 20px;
          border-radius: 8px;
        }
        
        .breadcrumb-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 8px;
          font-size: 14px;
        }
        
        .breadcrumb-item {
          color: #64748b;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: color 0.2s;
        }
        
        .breadcrumb-item:hover {
          color: #16a34a;
        }
        
        .breadcrumb-current {
          color: #0f172a;
          font-weight: 600;
        }
        
        .separator {
          color: #cbd5e1;
          font-size: 16px;
        }
        
        @media (max-width: 768px) {
          .breadcrumb-container {
            font-size: 12px;
            padding: 0 16px;
          }
        }
      `}</style>
    </nav>
  );
}