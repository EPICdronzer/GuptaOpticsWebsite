'use client';
import React from 'react';
import Navbar from '../(users)/components/Navbar';
import Footer from '../(users)/components/Footer';

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <section className="pt-40 pb-24 px-12 md:px-32 lg:px-48 max-w-[1400px] mx-auto">
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-12">TERMS & <span className="text-[#999999]">CONDITIONS</span></h1>
        <div className="prose prose-lg max-w-none text-[#555555]">
          <p className="mb-8">Welcome to Optical Galaxy. These terms and conditions outline the rules and regulations for the use of Optical Galaxy's Website.</p>
          <h3 className="text-xl font-black uppercase mb-4 text-black">1. INTRODUCTION</h3>
          <p className="mb-8">By accessing this website we assume you accept these terms and conditions in full. Do not continue to use Optical Galaxy's website if you do not accept all of the terms and conditions stated on this page.</p>
          <h3 className="text-xl font-black uppercase mb-4 text-black">2. INTELLECTUAL PROPERTY RIGHTS</h3>
          <p className="mb-8">Unless otherwise stated, Optical Galaxy and/or its licensors own the intellectual property rights for all material on Optical Galaxy. All intellectual property rights are reserved.</p>
          <h3 className="text-xl font-black uppercase mb-4 text-black">3. USER OBLIGATIONS</h3>
          <p className="mb-8">You must not: Republish material from this website, Sell, rent or sub-license material from this website, Reproduce, duplicate or copy material from this website.</p>
        </div>
      </section>
      <Footer />
    </main>
  );
}
