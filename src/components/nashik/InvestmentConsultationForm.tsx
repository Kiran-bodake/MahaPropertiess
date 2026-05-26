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
    mode: "onSubmit",
  });

  const onSubmit = async (data: any) => {
    console.log(data);

    reset();

    alert("Consultation request submitted successfully!");
  };

  return (
    <section className="px-3 py-16 md:px-5 md:py-24">
      <div
        className="
w-full
grid
items-stretch
gap-0
overflow-visible
rounded-[42px]
bg-gradient-to-br
from-[#08150d]
via-[#102318]
to-[#173924]
shadow-[0_30px_100px_rgba(0,0,0,0.25)]
lg:grid-cols-[0.95fr_1.05fr]
"
      >
        <div className="flex flex-col justify-center px-8 py-12 md:px-14 md:py-14">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-green-400">
            Investment Consultation
          </p>

          <h2 className="mt-4 text-4xl font-black leading-[1.05] tracking-[-0.04em] !text-white md:text-5xl lg:text-6xl">
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
          className="
flex
flex-col
gap-3
bg-white
p-6
md:p-7
"
        >
          <div className="flex flex-col gap-3">
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
                type="tel"
                inputMode="numeric"
                maxLength={10}
                placeholder="Phone Number"
                onInput={(e) => {
                  e.currentTarget.value = e.currentTarget.value.replace(
                    /\D/g,
                    "",
                  );
                }}
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
                <p className="mt-1 text-xs font-medium text-red-500">
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
                <p className="mt-1 text-xs font-medium text-red-500">
                  {errors.locality.message as string}
                </p>
              )}
            </div>

            <button
              type="submit"
              style={{
                background: "#05a336",
                color: "#000",
              }}
              className="
    mt-3
    flex
    h-14
    w-full
    items-center
    justify-center
    rounded-2xl
    text-base
    font-semibold
    shadow-lg
    transition-all
    duration-300
    hover:opacity-90
  "
            >
              Get Consultation
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
