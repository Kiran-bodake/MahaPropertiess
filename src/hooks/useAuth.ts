"use client";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";
import { authService } from "@/services/auth.service";
import toast from "react-hot-toast";

export function useAuth() {
  const { user, token, setUser, setToken, logout, isLoading, setLoading } = useAuthStore();
  const [otpSent, setOtpSent] = useState(false);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("auth_token");
    const storedUser = localStorage.getItem("auth_user");
    
    if (storedToken && storedUser && !token) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(parsedUser);
        console.log("✅ Auth restored from localStorage");
      } catch (error) {
        console.error("Failed to restore auth:", error);
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
      }
    }
  }, []);

  const sendOTP = async (phone: string) => {
    setLoading(true);
    try {
      const response = await authService.sendOTP(phone);
      setOtpSent(true);
      toast.success("OTP sent to your mobile");
      return response;
    } catch (error: any) {
      const errorMsg = error?.response?.data?.error || "Failed to send OTP. Please try again.";
      toast.error(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (phone: string, otp: string): Promise<boolean> => {
    setLoading(true);
    
    try {
      const session = await authService.verifyOTP(phone, otp);
      
      if (!session || !session.user || !session.token) {
        throw new Error("Invalid response from server");
      }
      
      const userId = session.user.id || session.user._id || `user_${Date.now()}_${phone}`;
      
      const userData = {
        id: userId,
        _id: userId,
        phone: session.user.phone || phone,
        name: session.user.name || null,
        email: session.user.email || null,
        isVerified: true,
        verifiedAt: new Date().toISOString()
      };
      
      localStorage.setItem("auth_token", session.token);
      localStorage.setItem("auth_user", JSON.stringify(userData));
      
      setUser(userData);
      setToken(session.token);
      
      toast.success(`Welcome${userData.name ? ", " + userData.name : " back"}!`);
      return true;
      
    } catch (error: any) {
      const errorMsg = error?.response?.data?.error || error?.message || "Invalid OTP. Please try again.";
      toast.error(errorMsg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
    
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    logout();
    toast.success("Logged out successfully");
  };

  const isAuthenticated = !!user && !!token;

  return {
    user,
    token,
    isLoading,
    isAuthenticated,
    otpSent,
    sendOTP,
    verifyOTP,
    logout: handleLogout,
    resetOtpSent: () => setOtpSent(false),
  };
}