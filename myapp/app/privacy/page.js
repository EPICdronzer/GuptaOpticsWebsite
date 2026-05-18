'use client';
import React from 'react';
import Navbar from '../(users)/components/Navbar';
import Footer from '../(users)/components/Footer';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <section className="pt-40 pb-24 px-12 md:px-32 lg:px-48 max-w-[1400px] mx-auto">
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-12">PRIVACY <span className="text-[#999999]">POLICY</span></h1>
        <div className="prose prose-lg max-w-none text-[#555555]">
          <p className="mb-8">Your privacy is critically important to us. This Privacy Policy document contains types of information that is collected and recorded by Eyeconic and how we use it.</p>
          <h3 className="text-xl font-black uppercase mb-4 text-black">1. INFORMATION WE COLLECT</h3>
          <p className="mb-8">We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent.</p>
          <h3 className="text-xl font-black uppercase mb-4 text-black">2. DATA PROTECTION</h3>
          <p className="mb-8">We protect your data against loss, theft, and unauthorized access. We do not share any personally identifying information publicly or with third-parties, except when required by law.</p>
          <h3 className="text-xl font-black uppercase mb-4 text-black">3. COOKIES</h3>
          <p className="mb-8">Eyeconic uses cookies to store information about visitors' preferences and the pages on the website that the visitor accessed or visited.</p>
        </div>
      </section>
      <Footer />
    </main>
  );
}
