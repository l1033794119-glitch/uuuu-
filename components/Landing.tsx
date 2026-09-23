"use client";

import { LanguageProvider } from "./LanguageContext";
import Hero from "./Hero";
import PrizeForm from "./PrizeForm";
import Footer from "./Footer";

export default function Landing() {
  return (
    <LanguageProvider>
      <div className="aurora" />
      <div className="noise" />
      <main className="relative z-10 flex flex-1 flex-col">
        <Hero />
        <PrizeForm />
      </main>
      <Footer />
    </LanguageProvider>
  );
}
