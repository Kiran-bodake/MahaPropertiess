"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import OTPModal from "./OTPModal";
import toast from "react-hot-toast";

interface StickyContactFormProps {
  title?: string;
  description?: string;
  propertyTitle: string;
<<<<<<< HEAD
}

export function StickyContactForm({ propertyTitle }: StickyContactFormProps) {
=======
   propertyId: string; 
}

export function StickyContactForm({ propertyTitle, propertyId }: StickyContactFormProps) {
>>>>>>> 2011411 (updated code)
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  
  // OTP states
  const [showOTP, setShowOTP] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<any>(null);
  
  // Auth hook
  const { isAuthenticated, user, sendOTP, verifyOTP, isLoading: authLoading } = useAuth();

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const validate = () => {
    let valid = true;

    const newErrors = {
      name: "",
      email: "",
      phone: "",
    };

    /* NAME */
    if (!name.trim()) {
      newErrors.name = "Name is required";
      valid = false;
    }

    /* EMAIL */
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Enter valid email address";
      valid = false;
    }

    /* PHONE */
    const phoneRegex = /^[6-9]\d{9}$/;

    if (!phone.trim()) {
      newErrors.phone = "Phone number is required";
      valid = false;
    } else if (!phoneRegex.test(phone)) {
      newErrors.phone = "Enter valid 10 digit number";
      valid = false;
    }

    setErrors(newErrors);

    return valid;
  };

  // Submit enquiry to backend
  const submitEnquiryToBackend = async (formData: any, verificationToken?: string) => {
    const userId = user?.id || user?._id || null;
    
    console.log("📤 Submitting callback request:", {
      propertyTitle: propertyTitle,
      isAuthenticated: !!user,
      userId: userId,
      hasVerificationToken: !!verificationToken
    });
    
    const res = await fetch("/api/property-inquiry", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
<<<<<<< HEAD
=======
        propertyId: propertyId, 
>>>>>>> 2011411 (updated code)
        propertyTitle: propertyTitle,
        customerName: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        inquiryType: "callback",
        isAuthenticated: !!user,
        userId: userId,
        verificationToken: verificationToken
      }),
    });

    const data = await res.json();
    
    if (!res.ok) {
      throw new Error(data.message || "Something went wrong");
    }
    
    return data;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const cleanPhone = phone.replace(/\D/g, "");

    try {
      setLoading(true);

      if (isAuthenticated) {
        // ✅ USER IS LOGGED IN - Submit directly
        console.log("✅ User authenticated, submitting callback request directly...");
        
        const formData = { name, email, phone: cleanPhone, message };
        await submitEnquiryToBackend(formData);
        
        setStatus("Request submitted successfully");
        toast.success("Callback request submitted!");
        
        // Reset form
        setName("");
        setEmail("");
        setPhone("");
        setMessage("");
        
      } else {
        // ✅ USER IS NOT LOGGED IN - Need OTP verification
        console.log("❌ User not authenticated, sending OTP...");
        
        await sendOTP(cleanPhone);
        
        setPendingFormData({
          name,
          email,
          phone: cleanPhone,
          message
        });
        
        setShowOTP(true);
      }
      
    } catch (error) {
      console.log(error);
      setStatus("Something went wrong");
      toast.error("Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle successful OTP verification
  const handleOTPVerified = async (verificationToken: string) => {
    console.log("🎯 OTP Verified! Submitting callback request...");
    
    if (!pendingFormData) {
      console.error("No pending form data found!");
      toast.error("Something went wrong. Please try again.");
      return;
    }
    
    try {
      setLoading(true);
      
      await submitEnquiryToBackend(pendingFormData, verificationToken);
      
      setStatus("Request submitted successfully");
      toast.success("Callback request submitted!");
      
      // Reset form
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
      
      setShowOTP(false);
      setPendingFormData(null);
      
    } catch (error: any) {
      console.error("Error in handleOTPVerified:", error);
      setStatus("Something went wrong");
      toast.error(error.message || "Failed to submit");
    } finally {
      setLoading(false);
    }
  };

  const getInputStyle = (hasError: boolean): React.CSSProperties => ({
    width: "100%",
    marginBottom: "6px",
    padding: "12px 14px",
    borderRadius: "14px",
    border: hasError ? "1px solid #ef4444" : "1px solid #bfd3f2",
    fontSize: "0.95rem",
    fontFamily: "inherit",
    outline: "none",
    boxSizing: "border-box",
    background: "#ffffff",
    color: "#334155",
    boxShadow: "none",
    transition: "0.2s ease",
  });

  return (
    <>
      {/* Auth Status Badge */}
      {!authLoading && (
        <div
          style={{
            marginBottom: "16px",
            padding: "8px 12px",
            borderRadius: "10px",
            fontSize: "0.75rem",
            fontWeight: 500,
            backgroundColor: isAuthenticated ? "#dcfce7" : "#dbeafe",
            color: isAuthenticated ? "#166534" : "#1e40af",
            border: `1px solid ${isAuthenticated ? "#bbf7d0" : "#bfdbfe"}`,
            textAlign: "center",
          }}
        >
          {isAuthenticated ? (
            <span>✅ Verified User • Request will be submitted directly</span>
          ) : (
            <span>📱 New User • OTP verification required</span>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* NAME */}
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          style={getInputStyle(!!errors.name)}
          disabled={loading}
        />

        {errors.name && (
          <p
            style={{
              color: "#dc2626",
              fontSize: ".82rem",
              marginBottom: "12px",
              marginTop: 0,
            }}
          >
            {errors.name}
          </p>
        )}

        {/* EMAIL */}
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          type="email"
          style={getInputStyle(!!errors.email)}
          disabled={loading}
        />

        {errors.email && (
          <p
            style={{
              color: "#dc2626",
              fontSize: ".82rem",
              marginBottom: "12px",
              marginTop: 0,
            }}
          >
            {errors.email}
          </p>
        )}

        {/* PHONE */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            border: errors.phone ? "1px solid #ef4444" : "1px solid #bfd3f2",
            borderRadius: "14px",
            background: "#ffffff",
            marginBottom: "6px",
            overflow: "hidden",
          }}
        >
          {/* COUNTRY CODE */}
          <div
            style={{
              padding: "12px 12px",
              background: "#ffffff",
              borderRight: "1px solid #bfd3f2",
              fontWeight: 700,
              color: "#0f172a",
              fontSize: ".95rem",
              whiteSpace: "nowrap",
            }}
          >
            +91
          </div>

          {/* INPUT */}
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
            placeholder="Your Number"
            type="tel"
            maxLength={10}
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px 14px",
              border: "none",
              outline: "none",
              fontSize: "0.95rem",
              background: "transparent",
              fontFamily: "inherit",
            }}
          />
        </div>

        {/* ERROR */}
        {errors.phone && (
          <p
            style={{
              color: "#dc2626",
              fontSize: ".82rem",
              marginBottom: "12px",
              marginTop: 0,
            }}
          >
            {errors.phone}
          </p>
        )}

        {/* MESSAGE */}
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Message (optional)"
          disabled={loading}
          style={{
            ...getInputStyle(false),
            minHeight: "80px",
            resize: "vertical",
            marginBottom: "14px",
          }}
        />

        {/* BUTTON */}
        <button
          type="submit"
          disabled={loading || authLoading}
          style={{
            width: "100%",
            height: 48,
            background: loading ? "#9ca3af" : "linear-gradient(135deg,#166534,#16a34a)",
            color: "#fff",
            border: "none",
            borderRadius: 14,
            fontWeight: 800,
            fontSize: "1rem",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "0.25s ease",
            boxShadow: "0 10px 24px rgba(22,163,74,.22)",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Processing..." : "Request a Call Back"}
        </button>

        {/* STATUS */}
        {status && (
          <p
            style={{
              marginTop: "14px",
              fontSize: ".9rem",
              color: status.includes("wrong") ? "#dc2626" : "#166534",
              textAlign: "center",
              lineHeight: 1.5,
            }}
          >
            {status}
          </p>
        )}

        {/* TRUST TEXT */}
        <div
          style={{
            marginTop: 14,
            textAlign: "center",
            fontSize: ".78rem",
            color: "#64748b",
            lineHeight: 1.5,
          }}
        >
          🔒 Your information is secure and confidential
        </div>
      </form>

      {/* OTP Modal */}
      <OTPModal
        isOpen={showOTP}
        onClose={() => {
          setShowOTP(false);
          setPendingFormData(null);
        }}
        phoneNumber={phone}
        onVerify={handleOTPVerified}
        enquiryData={pendingFormData}
        verifyOTP={verifyOTP}
        sendOTP={sendOTP}
      />
    </>
  );
}