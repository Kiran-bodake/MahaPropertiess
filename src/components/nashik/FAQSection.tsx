"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "Is Nashik good for real estate investment?",
    answer:
      "Yes. Nashik is experiencing rapid growth due to infrastructure projects, industrial development, educational migration, tourism, and future infrastructure expansion.",
  },

  {
    question: "Which areas in Nashik have highest appreciation potential?",
    answer:
      "Gangapur Road, Pathardi, Trimbak Road, and Nashik Road are among the fastest-growing investment corridors due to connectivity and infrastructure development.",
  },

  {
    question: "Will the bullet train impact property prices?",
    answer:
      "Major connectivity projects historically increase land appreciation and attract commercial and residential development across surrounding regions.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-0">
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}
        <div className="mb-16 text-center md:mb-20 lg:mb-24">
          <p className="mb-3 text-lg font-semibold uppercase tracking-[0.3em] text-green-600">
            FAQs
          </p>

          <h2 className="mx-auto max-w-5xl text-4xl font-black leading-[1.05] tracking-[-0.03em] text-gray-900 md:text-5xl lg:text-6xl">
            Frequently Asked Questions
          </h2>
        </div>

        {/* FAQ LIST */}
        <div className="space-y-5">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={faq.question}
                className="
                  overflow-hidden
                  rounded-[24px]
                  border
                  border-gray-200
                  bg-white
                  shadow-[0_10px_40px_rgba(0,0,0,0.05)]
                  transition-all
                  duration-300
                "
              >
                {/* QUESTION */}
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="
                    flex
                    w-full
                    items-center
                    justify-between
                    gap-5
                    px-6
                    py-5
                    text-left
                    transition-all
                    duration-300
                    hover:bg-gray-50
                    md:px-8
                    md:py-6
                  "
                >
                  <h3 className="text-lg font-bold leading-7 text-gray-900 md:text-xl">
                    {faq.question}
                  </h3>

                  <div
                    className={`
                      flex
                      h-10
                      w-10
                      flex-shrink-0
                      items-center
                      justify-center
                      rounded-full
                      bg-green-50
                      transition-all
                      duration-300
                      ${isOpen ? "rotate-180" : ""}
                    `}
                  >
                    <ChevronDown className="h-5 w-5 text-green-600" />
                  </div>
                </button>

                {/* ANSWER */}
                <div
                  className={`
                    grid
                    transition-all
                    duration-300
                    ease-in-out
                    ${
                      isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }
                  `}
                >
                  <div className="overflow-hidden">
                    <div className="border-t border-gray-100 px-6 py-5 md:px-8 md:py-6">
                      <p className="text-base leading-8 text-gray-600">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
