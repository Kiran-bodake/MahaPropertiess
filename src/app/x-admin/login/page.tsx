"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Eye } from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [securityCode, setSecurityCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    // Auth logic here...
    setBusy(false);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex items-center justify-center p-4 font-sans">
      {/* Container: Reduced width and height for a more compact "card" feel */}
      <div className="w-full max-w-[1000px] min-h-[580px] flex overflow-hidden rounded-[40px] bg-white shadow-[0_15px_50px_rgba(0,0,0,0.08)]">
        {/* Left Side: Gradient Panel */}
        <div className="relative hidden lg:flex w-[42%] flex-col items-center justify-center bg-gradient-to-br from-[#4d3df7] to-[#2a1fd1] p-10">
          {/* Decorative Dot Patterns */}
          <div className="absolute top-12 left-10 grid grid-cols-6 gap-1.5 opacity-20">
            {[...Array(24)].map((_, i) => (
              <div key={i} className="h-1 w-1 rounded-full bg-white" />
            ))}
          </div>
          <div className="absolute bottom-12 left-10 grid grid-cols-6 gap-1.5 opacity-20">
            {[...Array(24)].map((_, i) => (
              <div key={i} className="h-1 w-1 rounded-full bg-white" />
            ))}
          </div>

          {/* Logo Card: Further reduced in size */}
          <div className="relative z-10 flex h-[210px] w-[210px] items-center justify-center rounded-[35px] bg-white p-6 shadow-xl">
            <div className="flex flex-col items-center text-center">
              <img
                src="/maha.png"
                alt="Maha Properties"
                className="w-32 object-contain"
              />
              <div className="mt-2 text-[7px] font-bold text-slate-400 uppercase tracking-[0.2em] leading-tight">
                Maharashtra's No.1 Property Hub
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form Area */}
        <div className="relative w-full lg:w-[58%] flex items-center justify-center py-14 px-8 lg:px-20">
          <div className="w-full max-w-[400px] z-10">
            <header className="mb-10">
              <p className="text-[13px] font-bold text-blue-600 mb-2">
                Welcome back
              </p>
              <h1 className="text-[38px] font-extrabold text-[#0f172a] leading-[1.1] tracking-tight">
                Sign in to your account
              </h1>
              <p className="mt-3 text-[14px] text-slate-400 font-medium leading-relaxed">
                Use your admin credentials to continue.
              </p>
            </header>

            {/* Google Button */}
            <button
              onClick={() => (window.location.href = "/api/admin/auth/google")}
              className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white py-3.5 text-[13px] font-bold text-slate-700 transition hover:bg-slate-50 shadow-sm"
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="G"
                className="h-4 w-4"
              />
              Continue with Google
            </button>

            <div className="my-8 flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.1em] text-slate-300">
              <span className="h-px flex-1 bg-slate-100" />
              or sign in with email
              <span className="h-px flex-1 bg-slate-100" />
            </div>

            <form onSubmit={submit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[12px] font-bold text-slate-600 ml-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@mahaproperties.in"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-[14px] text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition placeholder:text-slate-300"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[12px] font-bold text-slate-600 ml-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-[14px] text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition placeholder:text-slate-300"
                  />
                  <button
                    type="button"
                    className="absolute right-5 top-[50%] -translate-y-[50%] text-slate-300"
                  >
                    <Eye size={16} />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[12px] font-bold text-slate-600 ml-1">
                  Security Code
                </label>
                <input
                  type="text"
                  value={securityCode}
                  onChange={(e) => setSecurityCode(e.target.value)}
                  placeholder="Enter security code"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-[14px] text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition placeholder:text-slate-300"
                />
              </div>

              <div className="flex items-center justify-between px-1 text-[12px]">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-200 text-blue-600"
                  />
                  <span className="text-slate-400 font-bold">
                    Keep me logged in
                  </span>
                </label>
                <button
                  type="button"
                  className="text-blue-600 font-bold hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              {/* Button */}
              <div className="relative !mt-6">
                <div className="absolute inset-x-8 bottom-0 h-5 bg-indigo-600 opacity-30 blur-[20px] rounded-full pointer-events-none" />
                <button
                  type="submit"
                  disabled={busy}
                  className="relative z-10 w-full py-4 rounded-2xl font-bold text-[15px] text-white transition-all duration-200
            hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                  style={{
                    background: "linear-gradient(to right, #4d3df7, #1d1499)",
                    boxShadow: "0 8px 24px -4px rgba(77,61,247,0.5)",
                  }}
                >
                  {busy ? "Signing in..." : "Access Dashboard"}
                </button>
              </div>
            </form>

            <p className="!mt-6 text-center text-[12px] font-bold text-slate-400">
              Need an account?{" "}
              <button className="text-blue-600 hover:underline">
                Contact admin
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
