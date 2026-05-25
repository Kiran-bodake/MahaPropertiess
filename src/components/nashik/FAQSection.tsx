"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "Is Nashik good for real estate investment?",
    answer:
      "Yes. Nashik is experiencing rapid growth due to infrastructure projects, industrial development, educational migration, and tourism.",
  },

  {
    question: "Which areas in Nashik have highest appreciation potential?",
    answer:
      "Gangapur Road, Pathardi, Trimbak Road, and Nashik Road are among the fastest-growing investment corridors.",
  },

  {
    question: "Will the bullet train impact property prices?",
    answer:
      "Major connectivity projects historically increase land appreciation and attract commercial development.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="bg-gradient-to-b from-white to-[#f7faf7] py-16 md:py-28">
      <div className="mx-auto max-w-4xl px-4 md:px-6">
        <div className="mb-12 text-center md:mb-16">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-green-600">
            FAQs
          </p>

          <h2 className="text-4xl font-bold text-gray-900 md:text-5xl">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={faq.question}
              className="overflow-hidden rounded-[24px] border border-gray-200 bg-white shadow-[0_12px_40px_rgba(16,24,40,0.06)] hover:-translate-y-1 transition-all duration-300"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="flex w-full items-center justify-between px-6 py-5 text-left transition-all duration-200 hover:bg-green-50/50 md:px-8 md:py-6 group"
              >
                <h3 className="text-base font-semibold text-gray-900 md:text-lg group-hover:text-green-700 transition-colors">
                  {faq.question}
                </h3>
                <ChevronDown
                  className={`ml-4 h-5 w-5 flex-shrink-0 text-green-600 transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              {openIndex === index && (
                <div className="border-t border-gray-100 px-6 py-5 md:px-8 md:py-6">
                  <p className="text-base leading-7 text-gray-600">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
