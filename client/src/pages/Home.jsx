import React from 'react';
import Hero from "../components/home/hero";
import PopularTools from "../components/home/PopularTools";
import HowItWorks from "../components/HowItWorks/HowItWorks";


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