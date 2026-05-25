"use client";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { investmentFormSchema } from "@/schemas/investmentFormSchema";

export default function InvestmentConsultationForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(investmentFormSchema),
  });

  const onSubmit = async (data: any) => {
    console.log(data);

    reset();

    alert("Consultation request submitted successfully!");
  };

  return (
    <section className="py-16 md:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 overflow-visible rounded-[44px] bg-gradient-to-br from-[#08150d] via-[#102318] to-[#173924] p-8 shadow-[0_30px_100px_rgba(0,0,0,0.25)] md:gap-16 md:p-12 md:px-14 lg:grid-cols-2">
        <div className="flex flex-col justify-center">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-green-400">
            Investment Consultation
          </p>

          <h2 className="mt-4 text-3xl font-black leading-tight text-white md:text-5xl lg:text-6xl">
            Talk To Nashik
            <br />
            Investment Experts
          </h2>

          <p className="mt-6 text-base leading-relaxed text-gray-300 md:text-lg">
            Get personalized investment opportunities based on your budget and
            preferred localities.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="rounded-[36px] bg-white p-8 shadow-2xl md:p-10 border border-white/10 "
        >
          <div className="space-y-4">
            <div>
              <input
                {...register("name")}
                placeholder="Full Name"
                className="h-14 w-full rounded-2xl border-2 border-gray-200 bg-white px-5 text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100"
              />
              {errors.name && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.name.message as string}
                </p>
              )}
            </div>

            <div>
              <input
                {...register("phone")}
                placeholder="Phone Number"
                className="h-14 w-full rounded-2xl border-2 border-gray-200 bg-white px-5 text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-green-500 focus:ring-4 focus:ring-green-100"
              />
              {errors.phone && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.phone.message as string}
                </p>
              )}
            </div>

            <div>
              <input
                {...register("email")}
                placeholder="Email Address"
                className="h-14 w-full rounded-2xl border-2 border-gray-200 bg-white px-5 text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-green-500 focus:ring-4 focus:ring-green-100"
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.email.message as string}
                </p>
              )}
            </div>

            <div>
              <select
                {...register("budget")}
                className="h-14 w-full rounded-2xl border-2 border-gray-200 bg-white px-5 text-gray-900 outline-none transition-all focus:border-green-500 focus:ring-4 focus:ring-green-100"
              >
                <option value="">Select Investment Budget</option>
                <option value="10-25L">₹10L - ₹25L</option>
                <option value="25-50L">₹25L - ₹50L</option>
                <option value="50L+">₹50L+</option>
              </select>
              {errors.budget && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.budget.message as string}
                </p>
              )}
            </div>

            <div>
              <input
                {...register("locality")}
                placeholder="Interested Locality"
                className="h-14 w-full rounded-2xl border-2 border-gray-200 bg-white px-5 text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-green-500 focus:ring-4 focus:ring-green-100"
              />
              {errors.locality && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.locality.message as string}
                </p>
              )}
            </div>

            <button className="mt-6 h-14 w-full rounded-xl bg-gradient-to-r from-green-600 to-green-700 font-semibold text-white shadow-lg shadow-green-600/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl active:translate-y-0">
              Get Consultation
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
