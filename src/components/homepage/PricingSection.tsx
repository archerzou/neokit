"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import ScrollFadeIn from "./ScrollFadeIn";

const FREE_FEATURES = [
  { text: "50 items", included: true },
  { text: "3 collections", included: true },
  { text: "Snippets, Prompts, Commands, Notes, Links", included: true },
  { text: "Basic search", included: true },
  { text: "File & Image uploads", included: false },
  { text: "AI features", included: false },
];

const PRO_FEATURES = [
  "Unlimited items",
  "Unlimited collections",
  "All item types including Files & Images",
  "AI auto-tagging & summaries",
  "\u201CExplain This Code\u201D",
  "AI Prompt Optimizer",
  "Data export (JSON/ZIP)",
];

export default function PricingSection() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section id="pricing" className="py-[120px] text-center     bg-white">
          <div className="max-w-[1200px] mx-auto px-6">
        <ScrollFadeIn>
          <h2 className="text-[clamp(1.8rem,3.5vw,2.8rem)] font-extrabold leading-tight mb-4 tracking-tight max-sm:text-[1.6rem]">
            Simple, Transparent
            <br />
            <span className="bg-gradient-to-r from-blue-700 via-blue-500 to-blue-400 bg-clip-text text-transparent">
              Pricing
            </span>
          </h2>
        </ScrollFadeIn>
        <ScrollFadeIn>
          <p className="text-base text-gray-500 max-w-[520px] mx-auto mb-10 leading-relaxed">
            Start free. Upgrade when you need more power.
          </p>
        </ScrollFadeIn>

        {/* Toggle */}
        <ScrollFadeIn>
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className={`text-sm font-medium transition-colors ${!isYearly ? "text-gray-900" : "text-gray-400"}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className="w-12 h-7 bg-gray-100 border border-gray-200 rounded-full relative cursor-pointer transition-colors"
              aria-label="Toggle billing period"
            >
              <span
                className={`absolute top-[3px] left-[3px] w-5 h-5 rounded-full transition-all duration-200 ${
                  isYearly ? "translate-x-5 bg-[#22c55e]" : "translate-x-0 bg-gray-400"
                }`}
              />
            </button>
            <span className={`text-sm font-medium transition-colors ${isYearly ? "text-gray-900" : "text-gray-400"}`}>
              Yearly{" "}
              <span className="inline-block bg-gradient-to-r from-[#22c55e] to-[#15803d] text-white text-[0.7rem] font-bold px-2 py-0.5 rounded-lg ml-1">
                Save 25%
              </span>
            </span>
          </div>
        </ScrollFadeIn>

        {/* Cards */}
        <div className="grid grid-cols-2 gap-6 max-w-[720px] mx-auto max-md:grid-cols-1">
          {/* Free */}
          <ScrollFadeIn>
            <div className="bg-white border border-gray-200 rounded-xl p-10 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-md max-sm:p-8">
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-2 text-gray-900">Free</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-extrabold tracking-tight max-sm:text-4xl text-gray-900">$0</span>
                  <span className="text-sm text-gray-500">/month</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">Perfect for getting started</p>
              </div>
              <ul className="flex flex-col gap-3.5 mb-8">
                {FREE_FEATURES.map((f) => (
                  <li
                    key={f.text}
                    className={`flex items-center gap-2.5 text-sm ${
                      f.included ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    {f.included ? (
                      <Check className="size-[18px] text-[#22c55e] shrink-0" strokeWidth={2.5} />
                    ) : (
                      <X className="size-[18px] text-gray-400 shrink-0" />
                    )}
                    {f.text}
                  </li>
                ))}
              </ul>
              <Button variant="outline" asChild className="w-full border-gray-200 text-gray-500 hover:text-gray-900 hover:border-gray-400 bg-transparent">
                <Link href="/register">Get Started</Link>
              </Button>
            </div>
          </ScrollFadeIn>

          {/* Pro */}
          <ScrollFadeIn>
            <div className="bg-gradient-to-b from-blue-50 to-white border border-blue-500 rounded-xl p-10 text-left relative transition-all duration-300 hover:-translate-y-1 max-sm:p-8">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-700 via-blue-600 to-blue-400 text-white text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">
                Most Popular
              </span>
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-2 text-gray-900">Pro</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-extrabold tracking-tight max-sm:text-4xl text-gray-900">
                    {isYearly ? "$6" : "$8"}
                  </span>
                  <span className="                  text-sm text-gray-500">
                                      {isYearly ? "/month (billed $72/yr)" : "/month"}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">For serious developers</p>
              </div>
              <ul className="flex flex-col gap-3.5 mb-8">
                {PRO_FEATURES.map((text) => (
                  <li key={text} className="flex items-center gap-2.5                   text-sm text-gray-500">
                                      <Check className="size-[18px] text-[#22c55e] shrink-0" strokeWidth={2.5} />
                    {text}
                  </li>
                ))}
              </ul>
              <Button asChild className="w-full bg-gradient-to-r from-blue-700 via-blue-600 to-blue-400 text-white border-0 hover:opacity-90">
                <Link href="/register">Start Free Trial</Link>
              </Button>
            </div>
          </ScrollFadeIn>
        </div>
      </div>
    </section>
  );
}
