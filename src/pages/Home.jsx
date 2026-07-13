import React from 'react';
import Hero from '../components/Hero/Hero';
import PopularTools from '../components/PopularTools/PopularTools';
import HowItWorks from '../components/HowItWorks/HowItWorks'; // 👈 1. Pehle Import Karein


const Home = () => {
  return (
    <main className="w-full min-h-screen bg-[#fafbfe]">
      <Hero />
      <PopularTools />
      <HowItWorks /> 
    </main>
  );
};

export default Home;