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
    <section className="consultationSection">
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          width: "100%",
        }}
      >
        <div className="consultationGrid">
          {/* LEFT CONTENT */}
          <div
            className="consultationContent"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <p
              style={{
                fontSize: "14px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.4em",
                color: "#4ade80",
                marginBottom: "24px",
              }}
            >
              Investment Consultation
            </p>

            <h2
              className="consultationTitle"
              style={{
                margin: 0,
                fontWeight: 900,
                lineHeight: 1.05,
                letterSpacing: "-0.04em",
                color: "#ffffff",
              }}
            >
              Talk To Nashik Investment Experts
            </h2>

            <p
              style={{
                marginTop: "32px",
                fontSize: "17px",
                lineHeight: 1.9,
                color: "#d1d5db",
                maxWidth: "540px",
              }}
            >
              Get personalized investment opportunities based on your budget and
              preferred localities.
            </p>
          </div>

          {/* FORM */}
          <form
            className="consultationForm"
            onSubmit={handleSubmit(onSubmit)}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              background: "#ffffff",
            }}
          >
            {/* NAME */}
            <div>
              <input
                {...register("name")}
                placeholder="Full Name"
                style={{
                  height: "56px",
                  width: "100%",
                  borderRadius: "18px",
                  border: "2px solid #e5e7eb",
                  background: "#ffffff",
                  padding: "0 20px",
                  fontSize: "16px",
                  color: "#111827",
                  outline: "none",
                  transition: "all .3s ease",
                }}
              />

              {errors.name && (
                <p
                  style={{
                    marginTop: "10px",
                    fontSize: "14px",
                    color: "#ef4444",
                  }}
                >
                  {errors.name.message as string}
                </p>
              )}
            </div>

            {/* PHONE */}
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
                style={{
                  height: "56px",
                  width: "100%",
                  borderRadius: "18px",
                  border: "2px solid #e5e7eb",
                  background: "#ffffff",
                  padding: "0 20px",
                  fontSize: "16px",
                  color: "#111827",
                  outline: "none",
                }}
              />

              {errors.phone && (
                <p
                  style={{
                    marginTop: "10px",
                    fontSize: "14px",
                    color: "#ef4444",
                  }}
                >
                  {errors.phone.message as string}
                </p>
              )}
            </div>

            {/* EMAIL */}
            <div>
              <input
                {...register("email")}
                placeholder="Email Address"
                style={{
                  height: "56px",
                  width: "100%",
                  borderRadius: "18px",
                  border: "2px solid #e5e7eb",
                  background: "#ffffff",
                  padding: "0 20px",
                  fontSize: "16px",
                  color: "#111827",
                  outline: "none",
                }}
              />

              {errors.email && (
                <p
                  style={{
                    marginTop: "10px",
                    fontSize: "14px",
                    color: "#ef4444",
                  }}
                >
                  {errors.email.message as string}
                </p>
              )}
            </div>

            {/* BUDGET */}
            <div>
              <select
                {...register("budget")}
                style={{
                  height: "56px",
                  width: "100%",
                  borderRadius: "18px",
                  border: "2px solid #e5e7eb",
                  background: "#ffffff",
                  padding: "0 20px",
                  fontSize: "16px",
                  color: "#111827",
                  outline: "none",
                  cursor: "pointer",
                }}
              >
                <option value="">Select Investment Budget</option>

                <option value="10-25L">₹10L - ₹25L</option>

                <option value="25-50L">₹25L - ₹50L</option>

                <option value="50L+">₹50L+</option>
              </select>

              {errors.budget && (
                <p
                  style={{
                    marginTop: "10px",
                    fontSize: "14px",
                    color: "#ef4444",
                  }}
                >
                  {errors.budget.message as string}
                </p>
              )}
            </div>

            {/* LOCALITY */}
            <div>
              <input
                {...register("locality")}
                placeholder="Interested Locality"
                style={{
                  height: "56px",
                  width: "100%",
                  borderRadius: "18px",
                  border: "2px solid #e5e7eb",
                  background: "#ffffff",
                  padding: "0 20px",
                  fontSize: "16px",
                  color: "#111827",
                  outline: "none",
                }}
              />

              {errors.locality && (
                <p
                  style={{
                    marginTop: "10px",
                    fontSize: "14px",
                    color: "#ef4444",
                  }}
                >
                  {errors.locality.message as string}
                </p>
              )}
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              style={{
                marginTop: "12px",
                display: "flex",
                height: "56px",
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "18px",
                border: "none",
                background: "#05a336",
                color: "#ffffff",
                fontSize: "16px",
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 15px 40px rgba(5,163,54,0.25)",
                transition: "all .3s ease",
              }}
            >
              Get Consultation
            </button>
          </form>
        </div>
      </div>
      <style jsx>{`
        .consultationGrid {
          display: grid;
          grid-template-columns: 0.95fr 1.05fr;
          align-items: stretch;
          overflow: hidden;
          border-radius: 40px;
          background: linear-gradient(135deg, #08150d, #102318, #173924);
          box-shadow: 0 30px 100px rgba(0, 0, 0, 0.25);
        }

        .consultationContent {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 96px 64px;
        }

        .consultationForm {
          padding: 56px;
        }

        .consultationTitle {
          font-size: 56px;
        }

        .consultationSection {
          padding: 64px 20px 96px;
        }

        @media (max-width: 768px) {
          .consultationGrid {
            grid-template-columns: 1fr;
          }

          .consultationContent {
            padding: 32px 20px !important;
            width: 100%;
            min-width: 0;
            box-sizing: border-box;
          }

          .consultationSection {
            padding: 32px 8px 80px;
          }

          .consultationForm {
            padding: 24px !important;
          }

          .consultationTitle {
            font-size: 34px;
            line-height: 1.1;
            max-width: 100%;
            overflow-wrap: break-word;
            word-break: break-word;
          }
        }
      `}</style>
    </section>
  );
}
