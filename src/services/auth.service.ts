import axios from "axios";
import type { AuthSession } from "@/types/user";

const api = axios.create({ baseURL: "/api" });

export const authService = {
  // ✅ Changed from "/otp/send" to "/send-otp"
  sendOTP: async (phone: string) => { 
    const { data } = await api.post("/send-otp", { phone }); 
    return data; 
  },
  
  // ✅ Changed from "/otp/verify" to "/verify-otp" (you need to create this)
  verifyOTP: async (phone: string, otp: string): Promise<AuthSession> => {
    const { data } = await api.post("/verify-otp", { phone, otp });
    return data;
  },
  
  getProfile: async () => { 
    const { data } = await api.get("/auth/profile"); 
    return data; 
  },
  
  logout: async () => { 
    await api.post("/auth/logout"); 
  },
};