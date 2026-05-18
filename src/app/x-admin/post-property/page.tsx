"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import {
  ShieldCheck,
  FileCheck,
  Landmark,
  Building2,
  Trees,
  Waves,
  Mountain,
  Train,
  Warehouse,
  BadgeIndianRupee,
  MapPinned,
  Fence,
  ParkingCircle,
  Camera,
  Zap,
  Droplets,
  School,
  Hospital,
  Store,
  Shield,
} from "lucide-react";

const PropertyMap = dynamic(() => import("@/components/PropertyMap"), {
  ssr: false,
});

/* ─── Types ───────────────────────────────────────────── */
type Meta = {
  states: { name: string; cities: { name: string; localities: string[] }[] }[];
  categories: { value: string; label: string }[];
  areaUnits: { value: string; label: string }[];
  amenities: string[];
  highlights: string[];
  constructionStatuses: { value: string; label: string }[];
  propertyStatuses: { value: string; label: string }[];
  postedByOptions: { value: string; label: string }[];
};

type FormData = {
  postedBy: string;
  agentName: string;
  agentPhone: string;
  title: string;
  category: string;
  categoryLabel: string;
  status: string;
  constructionStatus: string;
  state: string;
  city: string;
  locality: string;
  pincode: string;
  address: string;
  latitude: string;
  longitude: string;
  area: string;
  areaUnit: string;
  convertedSqft: string;
  price: string;
  pricePerUnit: string;
  priceNegotiable: boolean;
  isRERA: boolean;
  reraNumber: string;
  isZeroBrokerage: boolean;
  isFeatured: boolean;
  description: string;
  highlights: string[];
  amenities: string[];
  houseNo: string;
  street: string;
  landmark: string;
};

type FileEntry = { file: File; preview: string; name: string; size: string };

const INITIAL: FormData = {
  postedBy: "",
  agentName: "",
  agentPhone: "",

  title: "",
  category: "",
  categoryLabel: "",
  status: "available",
  constructionStatus: "ready",

  state: "",
  city: "",
  locality: "",
  pincode: "",

  houseNo: "",
  street: "",
  landmark: "",

  address: "",

  latitude: "",
  longitude: "",

  area: "",
  areaUnit: "sqft",
  price: "",
  pricePerUnit: "",
  convertedSqft: "",

  priceNegotiable: false,

  isRERA: false,
  reraNumber: "",

  isZeroBrokerage: false,
  isFeatured: false,

  description: "",
  highlights: [],
  amenities: [],
};

/* ─── Shared Styles ───────────────────────────────────── */
const inp = (extra?: React.CSSProperties): React.CSSProperties => ({
  width: "100%",
  padding: "10px 13px",
  borderRadius: "9px",
  border: "1.5px solid #d1d5db",
  fontSize: "0.93rem",
  fontFamily: "inherit",
  outline: "none",
  background: "#fff",
  boxSizing: "border-box",
  ...extra,
});
const sel = (extra?: React.CSSProperties): React.CSSProperties => ({
  ...inp(extra),
  cursor: "pointer",
  appearance: "none" as const,
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2.5'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 12px center",
  paddingRight: "34px",
});
const lbl = (text: string, required = false) => (
  <label
    style={{
      display: "block",
      fontWeight: 600,
      fontSize: "0.85rem",
      color: "#374151",
      marginBottom: "5px",
    }}
  >
    {text}
    {required && <span style={{ color: "#ef4444", marginLeft: "3px" }}>*</span>}
  </label>
);
const SectionCard = ({
  title,
  subtitle,
  icon,
  children,
  step,
  totalSteps,
  onPrev,
  onNext,
}: {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  children: React.ReactNode;

  step?: number;
  totalSteps?: number;

  onPrev?: () => void;
  onNext?: () => void;
}) => (
  <div
    style={{
      background: "#fff",
      borderRadius: "16px",
      border: "1px solid #e5e7eb",
      padding: "24px",
      marginBottom: "20px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
    }}
  >
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: "16px",
        marginBottom: "20px",
        paddingBottom: "14px",
        borderBottom: "1px solid #f3f4f6",
        flexWrap: "wrap",
      }}
    >
      {/* LEFT */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <span style={{ fontSize: "1.3rem" }}>{icon}</span>

        <div>
          <h2
            style={{
              margin: 0,
              fontSize: "1rem",
              fontWeight: 800,
              color: "#14532d",
            }}
          >
            {title}
          </h2>

          {subtitle && (
            <p
              style={{
                margin: "2px 0 0",
                fontSize: "0.82rem",
                color: "#6b7280",
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* RIGHT NAV BUTTONS */}
      {(onPrev || onNext) && (
        <div
          style={{
            display: "flex",
            gap: "8px",
            flexShrink: 0,
          }}
        >
          {onPrev && step !== 0 && (
            <button
              type="button"
              onClick={onPrev}
              style={{
                height: "36px",
                padding: "0 14px",
                borderRadius: "10px",
                border: "1px solid #d1d5db",
                background: "#fff",
                color: "#475569",
                fontWeight: 700,
                fontSize: ".82rem",
                cursor: "pointer",
              }}
            >
              ← Prev
            </button>
          )}

          {onNext && step !== (totalSteps ?? 1) - 1 && (
            <button
              type="button"
              onClick={onNext}
              style={{
                height: "36px",
                padding: "0 16px",
                borderRadius: "10px",
                border: "none",
                background: "linear-gradient(135deg,#16a34a,#22c55e)",
                color: "#fff",
                fontWeight: 800,
                fontSize: ".82rem",
                cursor: "pointer",
                boxShadow: "0 6px 16px rgba(34,197,94,.18)",
              }}
            >
              Next →
            </button>
          )}
        </div>
      )}
    </div>
    {children}
  </div>
);
const Row = ({
  children,
  cols = 2,
}: {
  children: React.ReactNode;
  cols?: number;
}) => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: `repeat(${cols}, 1fr)`,
      gap: "14px",
      marginBottom: "14px",
    }}
  >
    {children}
  </div>
);
const Field = ({ children }: { children: React.ReactNode }) => (
  <div>{children}</div>
);

function Chip({
  label: lbl2,
  active,
  onClick,
  icon,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "7px",
        padding: "8px 14px",
        borderRadius: "999px",
        fontSize: "0.82rem",
        fontWeight: 600,
        cursor: "pointer",
        border: "1.5px solid",
        transition: "all 0.18s ease",
        borderColor: active ? "#16a34a" : "#d1d5db",
        background: active ? "#f0fdf4" : "#ffffff",
        color: active ? "#166534" : "#475569",
        boxShadow: active ? "0 2px 10px rgba(22,163,74,0.12)" : "none",
      }}
    >
      {icon && (
        <span
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          {icon}
        </span>
      )}

      <span>
        {active ? "✓ " : ""}
        {lbl2}
      </span>
    </button>
  );
}

function Toggle({
  checked,
  onChange,
  labelText,
}: {
  checked: boolean;
  onChange: () => void;
  labelText: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        cursor: "pointer",
      }}
      onClick={onChange}
    >
      <div
        style={{
          width: "42px",
          height: "24px",
          borderRadius: "999px",
          background: checked ? "#16a34a" : "#d1d5db",
          position: "relative",
          transition: "background 0.2s",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "3px",
            left: checked ? "21px" : "3px",
            width: "18px",
            height: "18px",
            borderRadius: "50%",
            background: "#fff",
            transition: "left 0.2s",
            boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
          }}
        />
      </div>
      <span
        style={{
          fontSize: "0.9rem",
          fontWeight: 600,
          color: checked ? "#14532d" : "#6b7280",
        }}
      >
        {labelText}
      </span>
    </div>
  );
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

const highlightIcons: Record<string, React.ReactNode> = {
  "NA Converted": <FileCheck size={14} />,
  "Clear Title": <ShieldCheck size={14} />,
  "RERA Approved": <BadgeIndianRupee size={14} />,
  "Zero Brokerage": <BadgeIndianRupee size={14} />,
  "Ready Possession": <Building2 size={14} />,
  "Immediate Handover": <Building2 size={14} />,
  "Main Road Frontage": <MapPinned size={14} />,
  "Corner Plot": <Landmark size={14} />,
  "Gated Community": <Fence size={14} />,
  "Hill View": <Mountain size={14} />,
  "Lake View": <Waves size={14} />,
  "Garden Facing": <Trees size={14} />,
  "East Facing": <MapPinned size={14} />,
  "West Facing": <MapPinned size={14} />,
  "North Facing": <MapPinned size={14} />,
  "River Nearby": <Waves size={14} />,
  "High ROI": <BadgeIndianRupee size={14} />,
  "Upcoming Metro": <Train size={14} />,
  "Near IT Park": <Building2 size={14} />,
  "MIDC Approved Zone": <Warehouse size={14} />,
  "Collector Approved": <ShieldCheck size={14} />,
};

const amenityIcons: Record<string, React.ReactNode> = {
  "Road Access": <MapPinned size={14} />,
  "Water Connection": <Droplets size={14} />,
  Electricity: <Zap size={14} />,
  "24x7 Security": <Shield size={14} />,
  "CCTV Surveillance": <Camera size={14} />,
  "Parking Area": <ParkingCircle size={14} />,
  Borewell: <Droplets size={14} />,
  Fencing: <Fence size={14} />,
  "Power Backup": <Zap size={14} />,
  "Natural Water Source": <Droplets size={14} />,
  "Wide Road": <MapPinned size={14} />,
  "Near Highway": <MapPinned size={14} />,
  "Near Market": <Store size={14} />,
  "Near School": <School size={14} />,
  "Near Hospital": <Hospital size={14} />,
  "Street Lights": <Zap size={14} />,
  Drainage: <Droplets size={14} />,
  "Compound Wall": <Fence size={14} />,
  "Garden Area": <Trees size={14} />,
  "Warehouse Facility": <Warehouse size={14} />,
};

function getPropertyNumberLabel(category: string) {
  const cat = category.toLowerCase();

  // COMMERCIAL
  if (
    cat.includes("commercial") ||
    cat.includes("shop") ||
    cat.includes("showroom")
  ) {
    return "Shop / Office No";
  }

  // AGRICULTURE
  if (cat.includes("agriculture") || cat.includes("farm")) {
    return "Survey / Gut Number";
  }

  // WAREHOUSE / INDUSTRIAL
  if (cat.includes("warehouse") || cat.includes("industrial")) {
    return "Plot / Shed Number";
  }

  // FARMHOUSE
  if (cat.includes("farmhouse")) {
    return "Farmhouse Number";
  }

  // NA / RESIDENTIAL
  if (
    cat.includes("na") ||
    cat.includes("residential") ||
    cat.includes("cidco")
  ) {
    return "Plot / House Number";
  }

  // MIDC
  if (cat.includes("midc")) {
    return "MIDC Plot Number";
  }

  // INVESTMENT
  if (cat.includes("investment")) {
    return "Property Reference Number";
  }

  // DEFAULT
  return "Property Number";
}

/* ─── Property ID Badge ─────────────────────────────────── */
function PropertyIdBadge({
  id,
  generating,
}: {
  id: string;
  generating: boolean;
}) {
  if (!id && !generating) return null;
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        background: id ? "#f0fdf4" : "#fafafa",
        border: `1.5px solid ${id ? "#86efac" : "#e5e7eb"}`,
        borderRadius: "10px",
        padding: "8px 14px",
        marginBottom: "20px",
      }}
    >
      <span
        style={{
          fontSize: "0.78rem",
          fontWeight: 700,
          color: "#6b7280",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
        }}
      >
        Property ID
      </span>
      {generating ? (
        <span style={{ fontSize: "0.9rem", color: "#9ca3af" }}>
          Generating…
        </span>
      ) : (
        <span
          style={{
            fontFamily: "monospace",
            fontWeight: 800,
            fontSize: "1rem",
            color: "#14532d",
            letterSpacing: "0.05em",
          }}
        >
          {id}
        </span>
      )}
      {id && (
        <span
          style={{
            background: "#16a34a",
            color: "#fff",
            fontSize: "0.68rem",
            fontWeight: 700,
            padding: "2px 7px",
            borderRadius: "999px",
          }}
        >
          RESERVED
        </span>
      )}
    </div>
  );
}

/* ─── Image Upload Zone ─────────────────────────────────── */
function ImageUploadZone({
  files,
  onAdd,
  onRemove,
  uploading,
  uploadedCount,
}: {
  files: FileEntry[];
  onAdd: (f: FileEntry[]) => void;
  onRemove: (i: number) => void;
  uploading: boolean;
  uploadedCount: number;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");

  const processFiles = (rawFiles: FileList | File[]) => {
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB

    // only image files
    const imageFiles = Array.from(rawFiles).filter((f) =>
      f.type.startsWith("image/"),
    );

    // validate image size
    const validFiles = imageFiles.filter((f) => {
      if (f.size > MAX_SIZE) {
        setError(`${f.name} must be smaller than 5MB`);
        return false;
      }

      return true;
    });

    // max 8 images
    const arr = validFiles.slice(0, 8 - files.length);

    const entries: FileEntry[] = arr.map((f) => ({
      file: f,
      preview: URL.createObjectURL(f),
      name: f.name,
      size: formatBytes(f.size),
    }));

    onAdd(entries);
  };
  return (
    <div>
      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          processFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        style={{
          border: `2px dashed ${dragging ? "#16a34a" : "#d1d5db"}`,
          borderRadius: "14px",
          padding: "32px 20px",
          textAlign: "center",
          cursor: "pointer",
          background: dragging ? "#f0fdf4" : "#fafafa",
          transition: "all 0.15s",
          marginBottom: "10px",
        }}
      >
        <div style={{ fontSize: "2rem", marginBottom: "8px" }}>📸</div>

        <p
          style={{
            margin: "0 0 4px",
            fontWeight: 700,
            color: "#374151",
          }}
        >
          Drag & drop images here, or{" "}
          <span
            style={{
              color: "#16a34a",
              textDecoration: "underline",
            }}
          >
            click to browse
          </span>
        </p>

        <p
          style={{
            margin: 0,
            fontSize: "0.82rem",
            color: "#9ca3af",
          }}
        >
          JPG, PNG, WEBP — max 8 images, 5 MB each
        </p>

        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => e.target.files && processFiles(e.target.files)}
        />
      </div>

      {/* Error Message */}
      {error && (
        <p
          style={{
            color: "#dc2626",
            fontSize: "0.85rem",
            fontWeight: 600,
            marginBottom: "14px",
          }}
        >
          {error}
        </p>
      )}

      {/* Thumbnails grid */}
      {files.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
            gap: "10px",
          }}
        >
          {files.map((f, i) => (
            <div
              key={i}
              style={{
                position: "relative",
                borderRadius: "10px",
                overflow: "hidden",
                border: "1.5px solid #e5e7eb",
                background: "#f8fafc",
              }}
            >
              {/* Cover badge */}
              {i === 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "6px",
                    left: "6px",
                    background: "#16a34a",
                    color: "#fff",
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    padding: "2px 6px",
                    borderRadius: "999px",
                    zIndex: 2,
                  }}
                >
                  Cover
                </span>
              )}

              {/* Uploaded indicator */}
              {i < uploadedCount && (
                <span
                  style={{
                    position: "absolute",
                    top: "6px",
                    right: "32px",
                    background: "#065f46",
                    color: "#fff",
                    fontSize: "0.6rem",
                    fontWeight: 700,
                    padding: "2px 5px",
                    borderRadius: "999px",
                    zIndex: 2,
                  }}
                >
                  ✓
                </span>
              )}

              {/* Remove button */}
              <button
                type="button"
                onClick={() => onRemove(i)}
                style={{
                  position: "absolute",
                  top: "6px",
                  right: "6px",
                  width: "22px",
                  height: "22px",
                  borderRadius: "50%",
                  background: "rgba(0,0,0,0.55)",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "12px",
                  zIndex: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ✕
              </button>

              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={f.preview}
                alt={f.name}
                style={{
                  width: "100%",
                  height: "110px",
                  objectFit: "cover",
                  display: "block",
                }}
              />

              <div style={{ padding: "5px 7px" }}>
                <p
                  style={{
                    margin: 0,
                    fontSize: "0.7rem",
                    color: "#374151",
                    fontWeight: 600,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {f.name}
                </p>

                <p
                  style={{
                    margin: 0,
                    fontSize: "0.68rem",
                    color: "#9ca3af",
                  }}
                >
                  {f.size}
                </p>
              </div>

              {/* Upload progress overlay */}
              {uploading && i >= uploadedCount && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(255,255,255,0.6)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      border: "2px solid #16a34a",
                      borderTopColor: "transparent",
                      borderRadius: "50%",
                      animation: "spin 0.6s linear infinite",
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

/* ─── Main Component ──────────────────────────────────── */
export default function PostPropertyPage() {
  const [meta, setMeta] = useState<Meta | null>(null);
  const [form, setForm] = useState<FormData>(INITIAL);
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [uploadedCount, setUploadedCount] = useState(0);
  const [propertyId, setPropertyId] = useState("");
  const [idGenerating, setIdGenerating] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [coords, setCoords] = useState({
    lat: null,
    lng: null,
  });
  const [otpSent, setOtpSent] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState("");
  const [phoneVerified, setPhoneVerified] = useState(false);

  const TEMP_OTP = "123";
  const [errors, setErrors] = useState<Record<string, string>>({});
  const handlePincodeChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const pin = e.target.value.replace(/\D/g, "");

    set("pincode", pin);

    if (pin.length !== 6) return;

    try {
      // India Post API
      const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);

      const data = await res.json();

      if (data?.[0]?.Status === "Success" && data?.[0]?.PostOffice?.length) {
        const office = data[0].PostOffice[0];

        set("state", office.State || "");
        set("city", office.District || "");
        set("locality", office.Name || "");
      }
    } catch (error) {
      console.error("Pincode lookup failed:", error);
    }
  };

  useEffect(() => {
    fetch("/api/property-meta")
      .then((r) => r.json())
      .then(setMeta);
  }, []);

  const set = useCallback(
    <K extends keyof FormData>(key: K, val: FormData[K]) => {
      setForm((prev) => ({ ...prev, [key]: val }));
    },
    [],
  );
  const AREA_CONVERSION = {
    sqft: 1,
    sqyd: 9,
    acre: 43560,
    hectare: 107639,
  };

  const handleAreaCalculation = (areaValue: string, unit: string) => {
    set("area", areaValue);

    set("areaUnit", unit);

    if (!areaValue) return;

    const sqft =
      Number(areaValue) * AREA_CONVERSION[unit as keyof typeof AREA_CONVERSION];

    set("convertedSqft", sqft.toFixed(2));

    if (form.price && Number(form.price) > 0) {
      const pricePerSqft = Number(form.price) / sqft;

      set("pricePerUnit", pricePerSqft.toFixed(2));
    }
  };
  const handlePriceChange = (value: string) => {
    set("price", value);

    if (form.convertedSqft && Number(value) > 0) {
      const pricePerSqft = Number(value) / Number(form.convertedSqft);

      set("pricePerUnit", pricePerSqft.toFixed(2));
    }
  };
  const cities = Array.from(
    new Map(
      (meta?.states.find((s) => s.name === form.state)?.cities || []).map(
        (city) => [city.name, city],
      ),
    ).values(),
  );

  const localities = Array.from(
    new Set([
      ...(cities.find((c) => c.name === form.city)?.localities || []),

      ...(form.locality ? [form.locality] : []),
    ]),
  );
  const toggleArr = (key: "highlights" | "amenities", val: string) => {
    setForm((prev) => {
      const arr = prev[key];
      return {
        ...prev,
        [key]: arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val],
      };
    });
  };

  /* Generate property ID when leaving step 1 */
  const generatePropertyId = async () => {
    if (propertyId || !form.state || !form.city || !form.locality) return;
    setIdGenerating(true);
    try {
      const res = await fetch(
        `/api/property-id?state=${encodeURIComponent(form.state)}&city=${encodeURIComponent(form.city)}&locality=${encodeURIComponent(form.locality)}`,
      );
      const data = await res.json();
      setPropertyId(data.propertyId ?? "");
    } finally {
      setIdGenerating(false);
    }
  };

  const handleNext = async () => {
    const newErrors: Record<string, string> = {};

    if (step === 0) {
      if (!form.postedBy) newErrors.postedBy = "Please select who is posting";
      if (!form.agentName) newErrors.agentName = "Name is required";
      if (!form.agentPhone) newErrors.agentPhone = "Phone is required";
      if (!form.title) newErrors.title = "Title is required";
      if (!form.category) newErrors.category = "Category is required";
    }

    if (step === 1) {
      if (!form.state) newErrors.state = "State is required";
      if (!form.city) newErrors.city = "City is required";
      if (!form.locality) newErrors.locality = "Locality is required";

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      await generatePropertyId();
    }

    if (step === 2) {
      if (!form.area) newErrors.area = "Area is required";
      if (!form.price) newErrors.price = "Price is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    setStep((prev) => Math.min(steps.length - 1, prev + 1));
  };

  /* Submit */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      /* 1. Upload images */
      let uploadedUrls: string[] = [];
      if (files.length > 0 && propertyId) {
        const fd = new FormData();
        fd.append("propertyId", propertyId);
        files.forEach((f) => fd.append("images", f.file));
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: fd,
        });
        const uploadData = await uploadRes.json();
        uploadedUrls = uploadData.urls ?? [];
        setUploadedCount(uploadedUrls.length);
      }

      /* 2. Submit property data (simulate API call) */
      const payload = { ...form, propertyId, images: uploadedUrls };
      await fetch( "/api/property/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setLoading(false);
    }
  };

  /* Success screen */
  if (submitted) {
    return (
      <>
        
        <main
          style={{
            background: "#f4f7fb",
            minHeight: "80vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 16px",
          }}
        >
          <div
            style={{
              textAlign: "center",
              padding: "48px 32px",
              background: "#fff",
              borderRadius: "20px",
              maxWidth: "520px",
              width: "100%",
              boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
            }}
          >
            <div style={{ fontSize: "3.5rem", marginBottom: "16px" }}>🎉</div>
            <h2
              style={{
                color: "#14532d",
                margin: "0 0 8px",
                fontSize: "1.6rem",
                fontWeight: 800,
              }}
            >
              Property Submitted!
            </h2>
            <div
              style={{
                display: "inline-block",
                background: "#f0fdf4",
                border: "1.5px solid #86efac",
                borderRadius: "9px",
                padding: "6px 16px",
                margin: "8px 0 14px",
              }}
            >
              <span
                style={{
                  fontFamily: "monospace",
                  fontWeight: 800,
                  color: "#14532d",
                  fontSize: "1rem",
                }}
              >
                {propertyId}
              </span>
            </div>
            <p style={{ color: "#4b7a5e", margin: "0 0 8px" }}>
              <strong>{form.title || "Your property"}</strong> has been
              received.
            </p>
            <p
              style={{
                color: "#6b7280",
                fontSize: "0.88rem",
                margin: "0 0 24px",
              }}
            >
              {files.length > 0
                ? `${files.length} image(s) saved to /uploads/${propertyId}/`
                : "Our team will review and publish it within 24 hours."}
            </p>
            <div
              style={{ display: "flex", gap: "10px", justifyContent: "center" }}
            >
              <button
                onClick={() => {
                  setForm(INITIAL);
                  setFiles([]);
                  setPropertyId("");
                  setSubmitted(false);
                  setStep(0);
                  setUploadedCount(0);
                }}
                style={{
                  padding: "10px 22px",
                  background: "linear-gradient(135deg,#14532d,#16a34a)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "9px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Post Another
              </button>
              <Link
                href="/properties"
                style={{
                  padding: "10px 22px",
                  border: "1.5px solid #d1d5db",
                  borderRadius: "9px",
                  fontWeight: 600,
                  color: "#374151",
                  textDecoration: "none",
                  display: "inline-block",
                }}
              >
                View Listings
              </Link>
            </div>
          </div>
        </main>
        
      </>
    );
  }

  if (!meta)
    return (
      <>
        
        <main
          style={{
            minHeight: "60vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ color: "#6b7280" }}>Loading form…</div>
        </main>
        
      </>
    );

  const steps = [
    "Basic Information",
    "Property Location",
    "Property Details",
    "Property Features",
    "Images & Submit",
  ];

  return (
    <>
      
      <main
        style={{
          background: "#f4f7fb",
          minHeight: "100vh",
          paddingBottom: "60px",
        }}
      >
        {/* Hero Banner */}
        <div
          style={{
            background: "linear-gradient(135deg,#052e16,#166534,#16a34a)",
            padding: "36px 24px 32px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              opacity: 0.8,
              marginBottom: "8px",
              color: "#fff",
            }}
          >
            Free Listing
          </div>
          <h1
            style={{
              margin: "0 0 8px",
              fontSize: "clamp(1.5rem,4vw,2.2rem)",
              fontWeight: 900,
              color: "#fff",
            }}
          >
            Post Your Property
          </h1>
          <p
            style={{
              margin: 0,
              opacity: 0.85,
              fontSize: "1rem",
              color: "#fff",
            }}
          >
            Reach thousands of verified buyers across Maharashtra — 100% Free
          </p>
        </div>

        {/* Step Indicator */}
        <div
          style={{
            background: "#fff",
            borderBottom: "1px solid #e5e7eb",
            padding: "0 24px",
            overflowX: "auto",
          }}
        >
          <div style={{ maxWidth: "900px", margin: "0 auto", display: "flex" }}>
            {steps.map((s, i) => (
              <button
                key={s}
                type="button"
                onClick={() => setStep(i)}
                style={{
                  padding: "14px 16px",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                  color: i === step ? "#16a34a" : "#9ca3af",
                  borderBottom:
                    i === step
                      ? "2.5px solid #16a34a"
                      : "2.5px solid transparent",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    background: i <= step ? "#16a34a" : "#e5e7eb",
                    color: "#fff",
                    fontSize: "0.72rem",
                    lineHeight: "20px",
                    textAlign: "center",
                    marginRight: "6px",
                  }}
                >
                  {i + 1}
                </span>
                {s}
              </button>
            ))}
          </div>
        </div>

        <div
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            padding: "28px 16px 0",
          }}
        >
          {/* Property ID Badge (shown once generated) */}
          <PropertyIdBadge id={propertyId} generating={idGenerating} />

          <form onSubmit={handleSubmit}>
            {/* ── STEP 0: Who's Posting ── */}
            {step === 0 && (
              <SectionCard
                title="Who is posting this property?"
                subtitle="Let us know your role so we can tailor your listing."
                icon="👤"
                step={step}
                totalSteps={steps.length}
                onPrev={() => setStep((s) => Math.max(0, s - 1))}
                onNext={handleNext}
              >
                <Row cols={3}>
                  {meta.postedByOptions.map((opt) => (
                    <div
                      key={opt.value}
                      onClick={() =>
                        setForm((prev) => ({ ...prev, postedBy: opt.value }))
                      }
                      style={{
                        flex: 1,
                        minWidth: "180px",
                        cursor: "pointer",
                        border:
                          form.postedBy === opt.value
                            ? "2px solid #16a34a"
                            : "1px solid #d1d5db",
                        borderRadius: "16px",
                        padding: "20px",
                        background:
                          form.postedBy === opt.value ? "#f0fdf4" : "#ffffff",

                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",

                        transition: "all 0.2s ease",
                      }}
                    >
                      {/* Image Container */}
                      <div
                        style={{
                          width: "64px",
                          height: "64px",
                          marginBottom: "12px",

                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",

                          borderRadius: "16px",
                          background: "#f8fafc",
                          border: "1px solid #e2e8f0",
                        }}
                      >
                        <Image
                          src={
                            opt.value === "owner"
                              ? "/images/person.png"
                              : opt.value === "dealer"
                                ? "/images/handshake.png"
                                : "/images/crane.png"
                          }
                          alt={opt.label}
                          width={36}
                          height={36}
                          style={{
                            objectFit: "contain",
                          }}
                        />
                      </div>

                      {/* Label */}
                      <span
                        style={{
                          fontSize: "16px",
                          fontWeight: 600,
                          color: "#1e293b",
                          textAlign: "center",
                        }}
                      >
                        {opt.label}
                      </span>
                    </div>
                  ))}
                </Row>
                <Row>
                  <Field>
                    {lbl("Your Name", true)}
                    <input
                      style={inp()}
                      value={form.agentName}
                      onChange={(e) => set("agentName", e.target.value)}
                      placeholder="Full name"
                    />
                    {errors.agentName && (
                      <p
                        style={{
                          color: "red",
                          fontSize: "12px",
                          marginTop: "4px",
                        }}
                      >
                        {errors.agentName}
                      </p>
                    )}
                  </Field>

                  <Field>
                    {lbl("Phone Number", true)}

                    <input
                      style={{
                        ...inp(),
                        border: phoneVerified
                          ? "1px solid #16a34a"
                          : inp().border,
                      }}
                      value={form.agentPhone}
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      placeholder="Enter 10 digit mobile number"
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");

                        if (value.length <= 10) {
                          set("agentPhone", value);
                        }

                        // Reset verification if number changes
                        setOtpSent(false);
                        setEnteredOtp("");
                        setPhoneVerified(false);

                        if (value && !/^[6-9]/.test(value)) {
                          setErrors((prev) => ({
                            ...prev,
                            agentPhone:
                              "Mobile number must start with 6, 7, 8 or 9",
                          }));
                        } else if (value.length > 0 && value.length < 10) {
                          setErrors((prev) => ({
                            ...prev,
                            agentPhone: "Enter a valid 10 digit mobile number",
                          }));
                        } else {
                          setErrors((prev) => ({
                            ...prev,
                            agentPhone: "",
                          }));
                        }
                      }}
                    />

                    {/* Error Message */}
                    {errors.agentPhone && (
                      <p
                        style={{
                          color: "#dc2626",
                          fontSize: "12px",
                          marginTop: "4px",
                          fontWeight: 500,
                        }}
                      >
                        {errors.agentPhone}
                      </p>
                    )}

                    {/* Send OTP Button */}
                    {form.agentPhone.length === 10 &&
                      !errors.agentPhone &&
                      !otpSent &&
                      !phoneVerified && (
                        <button
                          type="button"
                          style={{
                            marginTop: "8px",
                            padding: "8px 14px",
                            border: "none",
                            borderRadius: "8px",
                            background: "#2563eb",
                            color: "#fff",
                            cursor: "pointer",
                            fontWeight: 500,
                          }}
                          onClick={() => {
                            alert(`Demo OTP is ${TEMP_OTP}`);
                            setOtpSent(true);
                          }}
                        >
                          Send OTP
                        </button>
                      )}

                    {/* OTP Input */}
                    {otpSent && !phoneVerified && (
                      <div style={{ marginTop: "12px" }}>
                        <input
                          style={inp()}
                          type="text"
                          inputMode="numeric"
                          maxLength={3}
                          placeholder="Enter OTP"
                          value={enteredOtp}
                          onChange={(e) =>
                            setEnteredOtp(e.target.value.replace(/\D/g, ""))
                          }
                        />

                        <button
                          type="button"
                          style={{
                            marginTop: "8px",
                            padding: "8px 14px",
                            border: "none",
                            borderRadius: "8px",
                            background: "#16a34a",
                            color: "#fff",
                            cursor: "pointer",
                            fontWeight: 500,
                          }}
                          onClick={() => {
                            if (enteredOtp === TEMP_OTP) {
                              setPhoneVerified(true);
                              setOtpSent(false);

                              alert("Phone number verified successfully!");
                            } else {
                              alert("Invalid OTP");
                            }
                          }}
                        >
                          Verify OTP
                        </button>
                      </div>
                    )}

                    {/* Verified Message */}
                    {phoneVerified && (
                      <p
                        style={{
                          color: "#16a34a",
                          marginTop: "8px",
                          fontSize: "13px",
                          fontWeight: 600,
                        }}
                      >
                        ✓ Phone number verified
                      </p>
                    )}
                  </Field>
                </Row>
                <div style={{ marginBottom: "14px" }}>
                  {lbl("Property Title", true)}
                  <input
                    style={inp()}
                    value={form.title}
                    onChange={(e) => set("title", e.target.value)}
                    placeholder='e.g. "Prime NA Plot — Gangapur Road, Nashik"'
                    required
                  />
                </div>
                <Row>
                  <Field>
                    {lbl("Property Category", true)}
                    <select
                      style={sel()}
                      value={form.categoryLabel}
                      onChange={(e) => {
                        const found = meta.categories.find(
                          (c) => c.label === e.target.value,
                        );
                        set("categoryLabel", e.target.value);
                        set("category", found?.value ?? "");
                      }}
                      required
                    >
                      <option value="">Select category</option>
                      {meta.categories.map((c) => (
                        <option key={c.label} value={c.label}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field>
                    {lbl("Property Status")}
                    <select
                      style={sel()}
                      value={form.status}
                      onChange={(e) => set("status", e.target.value)}
                    >
                      {meta.propertyStatuses.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </Field>
                </Row>
                <Field>
                  {lbl("Construction Status")}
                  <div
                    style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}
                  >
                    {meta.constructionStatuses.map((s) => (
                      <Chip
                        key={s.value}
                        label={s.label}
                        active={form.constructionStatus === s.value}
                        onClick={() => set("constructionStatus", s.value)}
                      />
                    ))}
                  </div>
                </Field>
              </SectionCard>
            )}

            {/* ── STEP 1: Location ── */}
            {step === 1 && (
              <SectionCard
                title="Property Location"
                subtitle="Enter pincode first to auto-fill location details."
                icon={
                  <Image
                    src="/images/map.png"
                    alt="Location"
                    width={22}
                    height={22}
                    style={{ objectFit: "contain" }}
                  />
                }
                step={step}
                totalSteps={steps.length}
                onPrev={() => setStep((s) => Math.max(0, s - 1))}
                onNext={handleNext}
              >
                {/* PINCODE FIRST */}
                <Row cols={1}>
                  <Field>
                    {lbl("Pincode", true)}

                    <input
                      style={inp()}
                      value={form.pincode}
                      onChange={handlePincodeChange}
                      placeholder="e.g. 422001"
                      maxLength={6}
                    />

                    {errors.pincode && (
                      <p
                        style={{
                          color: "#dc2626",
                          fontSize: "12px",
                          marginTop: "4px",
                        }}
                      >
                        {errors.pincode}
                      </p>
                    )}
                  </Field>
                </Row>

                {/* LOCATION AUTO FILLED */}
                <Row cols={3}>
                  {/* STATE */}
                  <Field>
                    {lbl("State", true)}

                    <select
                      style={sel()}
                      value={form.state}
                      onChange={(e) => {
                        set("state", e.target.value);
                        set("city", "");
                        set("locality", "");
                        setPropertyId("");
                      }}
                    >
                      <option value="">Select state</option>

                      {meta.states.map((s) => (
                        <option key={s.name} value={s.name}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </Field>

                  {/* CITY */}
                  <Field>
                    {lbl("City", true)}

                    <select
                      style={sel()}
                      value={form.city}
                      disabled={!form.state}
                      onChange={(e) => {
                        set("city", e.target.value);
                        set("locality", "");
                        setPropertyId("");
                      }}
                    >
                      <option value="">Select city</option>

                      {cities.map((c) => (
                        <option key={c.name} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </Field>

                  {/* LOCALITY */}
                  <Field>
                    {lbl("Locality / Area", true)}

                    {localities.length > 0 ? (
                      <select
                        style={sel()}
                        value={form.locality}
                        disabled={!form.city}
                        onChange={(e) => {
                          set("locality", e.target.value);
                          setPropertyId("");
                        }}
                      >
                        <option value="">Select locality</option>

                        {localities.map((l) => (
                          <option key={l} value={l}>
                            {l}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        style={inp()}
                        value={form.locality}
                        onChange={(e) => {
                          set("locality", e.target.value);
                          setPropertyId("");
                        }}
                        placeholder="Enter locality"
                      />
                    )}
                  </Field>
                </Row>

                {/* DETAILED ADDRESS */}
                <Row cols={3}>
                  <Field>
                    {lbl(getPropertyNumberLabel(form.categoryLabel), true)}

                    <input
                      style={inp()}
                      value={form.houseNo}
                      onChange={(e) => set("houseNo", e.target.value)}
                      placeholder={getPropertyNumberLabel(form.categoryLabel)}
                    />
                  </Field>

                  <Field>
                    {lbl("Street / Road", true)}

                    <input
                      style={inp()}
                      value={form.street}
                      onChange={(e) => set("street", e.target.value)}
                      placeholder="Street / Road"
                    />
                  </Field>

                  <Field>
                    {lbl("Landmark")}

                    <input
                      style={inp()}
                      value={form.landmark}
                      onChange={(e) => set("landmark", e.target.value)}
                      placeholder="Nearby Landmark"
                    />
                  </Field>
                </Row>

                {/* MAP LOCATION */}
                <div
                  style={{
                    marginTop: "24px",
                    border: "1px solid #e2e8f0",
                    borderRadius: "16px",
                    padding: "18px",
                    background: "#ffffff",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
                  }}
                >
                  {/* Header */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "14px",
                    }}
                  >
                    <div>
                      <h4
                        style={{
                          margin: 0,
                          fontSize: "15px",
                          fontWeight: 700,
                          color: "#0f172a",
                        }}
                      >
                        Select Exact Property Location
                      </h4>

                      <p
                        style={{
                          margin: "4px 0 0",
                          fontSize: "12px",
                          color: "#64748b",
                        }}
                      >
                        Click on the map to mark the exact property location
                      </p>
                    </div>

                    {coords?.lat && coords?.lng && (
                      <div
                        style={{
                          padding: "6px 10px",
                          background: "#ecfdf5",
                          border: "1px solid #bbf7d0",
                          borderRadius: "8px",
                          fontSize: "11px",
                          color: "#166534",
                          fontWeight: 600,
                        }}
                      >
                        Location Selected ✓
                      </div>
                    )}
                  </div>

                  {/* MAP */}
                  <PropertyMap
                    onSelect={async (location: any) => {
                      // Save map coordinates
                      setCoords(location);
                      set("latitude", String(location.lat));
                      set("longitude", String(location.lng));
                      try {
                        const res = await fetch(
                          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.lat}&lon=${location.lng}`,
                        );

                        const data = await res.json();

                        const address = data.address || {};

                        // Auto fill fields
                        set("state", address.state || "");

                        set(
                          "city",
                          address.city || address.town || address.village || "",
                        );

                        set(
                          "locality",
                          address.suburb || address.neighbourhood || "",
                        );

                        set("street", address.road || "");

                        // Create full address
                        const fullAddress = [
                          address.road,
                          address.suburb || address.neighbourhood,
                          address.city || address.town || address.village,
                          address.state,
                          address.postcode,
                        ]
                          .filter(Boolean)
                          .join(", ");

                        set("address", fullAddress);
                      } catch (error) {
                        console.error("Address fetch failed:", error);
                      }
                    }}
                  />

                  {/* COORDINATES */}
                  {coords?.lat && coords?.lng && (
                    <div
                      style={{
                        marginTop: "14px",
                        padding: "10px 14px",
                        background: "#f8fafc",
                        borderRadius: "10px",
                        border: "1px solid #e2e8f0",
                        fontSize: "12px",
                        color: "#475569",
                      }}
                    >
                      Number(coords.lat).toFixed(6)
                      Number(coords.lng).toFixed(6)
                    </div>
                  )}
                </div>

                {/* LOCATION PREVIEW */}
                {form.state && form.city && form.locality && (
                  <div
                    style={{
                      marginTop: "18px",
                      padding: "12px 16px",
                      background: "#f0fdf4",
                      border: "1px solid #bbf7d0",
                      borderRadius: "10px",
                      color: "#166534",
                      fontSize: "14px",
                    }}
                  >
                    📍{" "}
                    <strong>
                      [ form.houseNo, form.street, form.locality, form.city,
                      form.state ] .filter(Boolean) .join(", ")
                    </strong>
                    {form.pincode && ` — ${form.pincode}`}
                  </div>
                )}
              </SectionCard>
            )}
            {/* ── STEP 2: Property Details ── */}
            {step === 2 && (
              <SectionCard
                title="Property Details"
                subtitle="Size, price and other specifics buyers need to evaluate."
                icon={
                  <Image
                    src="/images/property-paper.png"
                    alt="Property Details"
                    width={22}
                    height={22}
                    style={{
                      objectFit: "contain",
                    }}
                  />
                }
                step={step}
                totalSteps={steps.length}
                onPrev={() => setStep((s) => Math.max(0, s - 1))}
                onNext={handleNext}
              >
                <Row cols={3}>
                  {/* AREA */}
                  <Field>
                    {lbl("Area / Size", true)}

                    <input
                      style={inp()}
                      value={form.area}
                      onChange={(e) =>
                        handleAreaCalculation(e.target.value, form.areaUnit)
                      }
                      placeholder="e.g. 2000"
                      type="number"
                      min="0"
                    />

                    {errors.area && (
                      <p
                        style={{
                          color: "#dc2626",
                          fontSize: "12px",
                          marginTop: "4px",
                        }}
                      >
                        {errors.area}
                      </p>
                    )}
                  </Field>

                  {/* AREA UNIT */}
                  <Field>
                    {lbl("Area Unit", true)}

                    <select
                      style={sel()}
                      value={form.areaUnit}
                      onChange={(e) =>
                        handleAreaCalculation(form.area, e.target.value)
                      }
                    >
                      {meta.areaUnits.map((u) => (
                        <option key={u.value} value={u.value}>
                          {u.label}
                        </option>
                      ))}
                    </select>
                  </Field>

                  {/* PRICE */}
                  <Field>
                    {lbl("Price (₹)", true)}

                    <input
                      style={inp()}
                      value={form.price}
                      onChange={(e) => handlePriceChange(e.target.value)}
                      placeholder="e.g. 4500000"
                      type="number"
                      min="0"
                    />

                    {errors.price && (
                      <p
                        style={{
                          color: "#dc2626",
                          fontSize: "12px",
                          marginTop: "4px",
                        }}
                      >
                        {errors.price}
                      </p>
                    )}

                    {form.price && (
                      <div
                        style={{
                          marginTop: "4px",
                          fontSize: "0.78rem",
                          color: "#16a34a",
                          fontWeight: 600,
                        }}
                      >
                        ≈ ₹{Number(form.price).toLocaleString("en-IN")}
                      </div>
                    )}
                  </Field>
                </Row>

                <Row>
                  <Field>
                    {lbl("Total Area in Sqft")}

                    <input
                      style={inp({
                        background: "#f0fdf4",
                      })}
                      value={form.convertedSqft}
                      readOnly
                    />
                  </Field>

                  <Field>
                    {lbl("Price Per Sqft")}

                    <input
                      style={inp({
                        background: "#f0fdf4",
                      })}
                      value={form.pricePerUnit}
                      readOnly
                    />
                  </Field>
                </Row>

                <div style={{ marginTop: "20px" }}>
                  <Toggle
                    checked={form.priceNegotiable}
                    onChange={() =>
                      set("priceNegotiable", !form.priceNegotiable)
                    }
                    labelText="Price is Negotiable"
                  />
                </div>
              </SectionCard>
            )}

            {/* ── STEP 3: Features ── */}
            {step === 3 && (
              <>
                <SectionCard
                  title="Legal & Listing Flags"
                  icon={
                    <Image
                      src="/images/insurance.png"
                      alt="Legal"
                      width={22}
                      height={22}
                      style={{
                        objectFit: "contain",
                      }}
                    />
                  }
                  step={step}
                  totalSteps={steps.length}
                  onPrev={() => setStep((s) => Math.max(0, s - 1))}
                  onNext={handleNext}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "16px",
                      marginBottom: "16px",
                    }}
                  >
                    <Toggle
                      checked={form.isRERA}
                      onChange={() => set("isRERA", !form.isRERA)}
                      labelText="RERA Approved"
                    />
                    <Toggle
                      checked={form.isZeroBrokerage}
                      onChange={() =>
                        set("isZeroBrokerage", !form.isZeroBrokerage)
                      }
                      labelText="Zero Brokerage"
                    />
                    <Toggle
                      checked={form.isFeatured}
                      onChange={() => set("isFeatured", !form.isFeatured)}
                      labelText="Mark as Featured"
                    />
                  </div>
                  {form.isRERA && (
                    <Field>
                      {lbl("RERA Number")}
                      <input
                        style={inp()}
                        value={form.reraNumber}
                        onChange={(e) => set("reraNumber", e.target.value)}
                        placeholder="e.g. P51800012345"
                      />
                    </Field>
                  )}
                </SectionCard>
                <SectionCard
                  title="Key Highlights"
                  subtitle="Select all that apply."
                  icon={
                    <Image
                      src="/images/asterisk (1).png"
                      alt="Highlights"
                      width={22}
                      height={22}
                      style={{
                        objectFit: "contain",
                      }}
                    />
                  }
                >
                  <div
                    style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}
                  >
                    {meta.highlights.map((h) => (
                      <Chip
                        key={h}
                        label={h}
                        icon={highlightIcons[h]}
                        active={form.highlights.includes(h)}
                        onClick={() => toggleArr("highlights", h)}
                      />
                    ))}
                  </div>
                </SectionCard>
                <SectionCard
                  title="Amenities Available"
                  icon={
                    <Image
                      src="/images/management (1).png"
                      alt="Amenities"
                      width={22}
                      height={22}
                      style={{
                        objectFit: "contain",
                      }}
                    />
                  }
                >
                  <div
                    style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}
                  >
                    {meta.amenities.map((a) => (
                      <Chip
                        key={a}
                        label={a}
                        icon={amenityIcons[a]}
                        active={form.amenities.includes(a)}
                        onClick={() => toggleArr("amenities", a)}
                      />
                    ))}
                  </div>
                </SectionCard>
              </>
            )}

            {/* ── STEP 4: Images & Submit ── */}
            {step === 4 && (
              <>
                <SectionCard
                  title="Property Description"
                  icon={
                    <Image
                      src="/images/newspaper (2).png"
                      alt="Description"
                      width={22}
                      height={22}
                      style={{
                        objectFit: "contain",
                      }}
                    />
                  }
                  step={step}
                  totalSteps={steps.length}
                  onPrev={() => setStep((s) => Math.max(0, s - 1))}
                  onNext={handleNext}
                >
                  <textarea
                    value={form.description}
                    onChange={(e) => set("description", e.target.value)}
                    placeholder="Describe the property — location benefits, size, surroundings, investment potential, legal status…"
                    required
                    style={{
                      ...inp(),
                      minHeight: "130px",
                      resize: "vertical",
                      lineHeight: 1.6,
                    }}
                  />
                </SectionCard>

                <SectionCard
                  title="Upload Property Images"
                  subtitle={
                    propertyId
                      ? `Images will be stored in /uploads/${propertyId}/`
                      : "Complete location step to get your property ID first."
                  }
                  icon={
                    <Image
                      src="/images/image (2).png"
                      alt="Upload Images"
                      width={22}
                      height={22}
                      style={{
                        objectFit: "contain",
                      }}
                    />
                  }
                >
                  {/* Property ID reminder */}
                  {propertyId && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        background: "#f0fdf4",
                        border: "1px solid #bbf7d0",
                        borderRadius: "9px",
                        padding: "8px 12px",
                        marginBottom: "16px",
                        fontSize: "0.85rem",
                      }}
                    >
                      <span style={{ color: "#6b7280" }}>Storage path:</span>
                      <code
                        style={{
                          fontWeight: 700,
                          color: "#14532d",
                          background: "#dcfce7",
                          padding: "2px 8px",
                          borderRadius: "5px",
                        }}
                      >
                        /public/uploads/{propertyId}/
                      </code>
                    </div>
                  )}

                  <ImageUploadZone
                    files={files}
                    onAdd={(newEntries) =>
                      setFiles((prev) => [...prev, ...newEntries].slice(0, 8))
                    }
                    onRemove={(i) =>
                      setFiles((prev) => {
                        const next = [...prev];
                        URL.revokeObjectURL(next[i].preview);
                        next.splice(i, 1);
                        return next;
                      })
                    }
                    uploading={loading}
                    uploadedCount={uploadedCount}
                  />
                  <p
                    style={{
                      margin: "8px 0 0",
                      fontSize: "0.8rem",
                      color: "#9ca3af",
                    }}
                  >
                    {files.length}/8 images selected · First image is the cover
                    photo
                  </p>
                </SectionCard>

                {/* Summary */}
                <div
                  style={{
                    background: "#f0fdf4",
                    border: "1px solid #bbf7d0",
                    borderRadius: "14px",
                    padding: "18px 20px",
                    marginBottom: "20px",
                  }}
                >
                  <h3
                    style={{
                      margin: "0 0 12px",
                      fontSize: "0.95rem",
                      fontWeight: 800,
                      color: "#14532d",
                    }}
                  >
                    📋 Listing Summary
                  </h3>
                  {propertyId && (
                    <div style={{ marginBottom: "10px", fontSize: "0.85rem" }}>
                      <span style={{ color: "#6b7280" }}>Property ID: </span>
                      <strong
                        style={{ fontFamily: "monospace", color: "#14532d" }}
                      >
                        {propertyId}
                      </strong>
                    </div>
                  )}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "8px",
                      fontSize: "0.85rem",
                      color: "#374151",
                    }}
                  >
                    {[
                      ["Title", form.title || "—"],
                      ["Category", form.categoryLabel || "—"],
                      [
                        "Location",
                        [form.locality, form.city, form.state]
                          .filter(Boolean)
                          .join(", ") || "—",
                      ],
                      [
                        "Area",
                        form.area
                          ? `${form.area} ${meta.areaUnits.find((u) => u.value === form.areaUnit)?.label}`
                          : "—",
                      ],
                      [
                        "Price",
                        form.price
                          ? `₹${Number(form.price).toLocaleString("en-IN")}`
                          : "—",
                      ],
                      ["Images", `${files.length} selected`],
                    ].map(([k, v]) => (
                      <div key={k}>
                        <span style={{ color: "#6b7280" }}>{k}: </span>
                        <strong>{v}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* ── Nav Buttons ── */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "4px 0 32px",
              }}
            >
              <button
                type="button"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
                style={{
                  padding: "11px 26px",
                  borderRadius: "10px",
                  border: "1.5px solid #d1d5db",
                  background: step === 0 ? "#f9fafb" : "#fff",
                  color: step === 0 ? "#9ca3af" : "#374151",
                  fontWeight: 700,
                  cursor: step === 0 ? "default" : "pointer",
                }}
              >
                ← Previous
              </button>

              {step < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={idGenerating}
                  style={{
                    padding: "11px 28px",
                    borderRadius: "10px",
                    border: "none",
                    background: idGenerating
                      ? "#86efac"
                      : "linear-gradient(135deg,#14532d,#16a34a)",
                    color: "#fff",
                    fontWeight: 700,
                    cursor: idGenerating ? "not-allowed" : "pointer",
                    boxShadow: "0 4px 12px rgba(22,163,74,0.3)",
                  }}
                >
                  {idGenerating ? "Generating ID…" : "Next →"}
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: "11px 32px",
                    borderRadius: "10px",
                    border: "none",
                    background: loading
                      ? "#86efac"
                      : "linear-gradient(135deg,#14532d,#16a34a)",
                    color: "#fff",
                    fontWeight: 800,
                    cursor: loading ? "not-allowed" : "pointer",
                    boxShadow: "0 4px 12px rgba(22,163,74,0.3)",
                  }}
                >
                  {loading ? "Uploading & Submitting…" : "🚀 Submit Listing"}
                </button>
              )}
            </div>
          </form>
        </div>
      </main>
      
    </>
  );
}
