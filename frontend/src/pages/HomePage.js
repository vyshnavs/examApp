import React from 'react';
import Hero from '../components/Hero';
import Services from '../components/Services';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';  
const HomePage = () => {
    return (
          <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 theme-transition">
      <main>
        <Navbar />
        <Hero />
        <Services />
        {/* About section placeholder */}
        <section id="about" className="py-16 md:py-24 bg-neutral-50 dark:bg-neutral-900 theme-transition">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold">About Us</h2>
            <p className="mt-3 text-neutral-700 dark:text-neutral-300 max-w-prose">
              ExamX empowers learners and educators with powerful tools to create, conduct, and analyze exams with ease.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
    );
};

export default HomePage;
