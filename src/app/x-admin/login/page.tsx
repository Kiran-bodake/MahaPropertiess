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

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          securityCode,
        }),
      });

      let data: { message?: string } = {};

      try {
        data = await res.json();
      } catch {}

      if (!res.ok) {
        throw new Error(data?.message || "Login failed");
      }

      // Redirect after successful login
      router.push("/x-admin/dashboard");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Authentication error");
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8f9fc] p-4 font-sans">
      {/* CARD */}
      <div className="flex min-h-[580px] w-full max-w-[1000px] overflow-hidden rounded-[40px] bg-white shadow-[0_15px_50px_rgba(0,0,0,0.08)]">
        {/* LEFT SIDE */}
        <div className="relative hidden w-[42%] flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#4d3df7] to-[#2a1fd1] p-10 lg:flex">
          {/* GRID */}
          <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:70px_70px]" />

          {/* DOTS TOP */}
          <div className="absolute left-10 top-12 grid grid-cols-6 gap-1.5 opacity-20">
            {[...Array(24)].map((_, i) => (
              <div key={i} className="h-1 w-1 rounded-full bg-white" />
            ))}
          </div>

          {/* DOTS BOTTOM */}
          <div className="absolute bottom-12 left-10 grid grid-cols-6 gap-1.5 opacity-20">
            {[...Array(24)].map((_, i) => (
              <div key={i} className="h-1 w-1 rounded-full bg-white" />
            ))}
          </div>

          {/* LOGO CARD */}
          <div className="relative z-10 flex h-[210px] w-[210px] items-center justify-center rounded-[35px] bg-white p-6 shadow-xl">
            <div className="flex flex-col items-center text-center">
              <img
                src="/maha.png"
                alt="Maha Properties"
                className="w-32 object-contain"
              />

              <div className="mt-2 text-[7px] font-bold uppercase leading-tight tracking-[0.2em] text-slate-400">
                Maharashtra&apos;s No.1 Property Hub
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="relative flex w-full items-center justify-center px-8 py-14 lg:w-[58%] lg:px-20">
          <div className="z-10 w-full max-w-[400px]">
            {/* HEADER */}
            <header className="mb-10">
              <p className="mb-2 text-[13px] font-bold text-blue-600">
                Welcome back
              </p>

              <h1 className="text-[38px] font-extrabold leading-[1.1] tracking-tight text-[#0f172a]">
                Sign in to your account
              </h1>

              <p className="mt-3 text-[14px] font-medium leading-relaxed text-slate-400">
                Use your admin credentials to continue.
              </p>
            </header>

            {/* GOOGLE BUTTON */}
            <button
              onClick={() => (window.location.href = "/api/admin/auth/google")}
              className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white py-3.5 text-[13px] font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
                className="h-4 w-4"
              />
              Continue with Google
            </button>

            {/* DIVIDER */}
            <div className="my-8 flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.1em] text-slate-300">
              <span className="h-px flex-1 bg-slate-100" />
              or sign in with email
              <span className="h-px flex-1 bg-slate-100" />
            </div>

            {/* FORM */}
            <form onSubmit={submit} className="space-y-6">
              {/* EMAIL */}
              <div className="space-y-2">
                <label className="ml-1 text-[12px] font-bold text-slate-600">
                  Email
                </label>

                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@mahaproperties.in"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-[14px] text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-blue-500 focus:bg-white"
                />
              </div>

              {/* PASSWORD */}
              <div className="space-y-2">
                <label className="ml-1 text-[12px] font-bold text-slate-600">
                  Password
                </label>

                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-[14px] text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-blue-500 focus:bg-white"
                  />

                  <button
                    type="button"
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300"
                  >
                    <Eye size={16} />
                  </button>
                </div>
              </div>

              {/* SECURITY CODE */}
              <div className="space-y-2">
                <label className="ml-1 text-[12px] font-bold text-slate-600">
                  Security Code
                </label>

                <input
                  type="text"
                  required
                  value={securityCode}
                  onChange={(e) => setSecurityCode(e.target.value)}
                  placeholder="Enter security code"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-[14px] text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-blue-500 focus:bg-white"
                />
              </div>

              {/* OPTIONS */}
              <div className="flex items-center justify-between px-1 text-[12px]">
                <label className="flex cursor-pointer items-center gap-2.5">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-200 text-blue-600"
                  />

                  <span className="font-bold text-slate-400">
                    Keep me logged in
                  </span>
                </label>

                <button
                  type="button"
                  className="font-bold text-blue-600 hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              {/* ERROR */}
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              {/* BUTTON */}
              <div className="relative !mt-6">
                <div className="pointer-events-none absolute inset-x-8 bottom-0 h-5 rounded-full bg-indigo-600 opacity-30 blur-[20px]" />

                <button
                  type="submit"
                  disabled={busy}
                  className="relative z-10 w-full rounded-2xl py-4 text-[15px] font-bold text-white transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
                  style={{
                    background: "linear-gradient(to right, #4d3df7, #1d1499)",
                    boxShadow: "0 8px 24px -4px rgba(77,61,247,0.5)",
                  }}
                >
                  {busy ? "Signing in..." : "Access Dashboard"}
                </button>
              </div>
            </form>

            {/* FOOTER */}
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
