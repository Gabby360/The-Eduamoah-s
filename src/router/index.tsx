import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { Story } from '../components/Story';
import { Couple } from '../components/Couple';
import { WeddingSchedule } from '../components/WeddingSchedule';
import { Countdown } from '../components/Countdown';
import { Gallery } from '../components/Gallery';
import { RSVP } from '../components/RSVP';
import { Blessings } from '../components/Blessings';
import { Location } from '../components/Location';
import { Footer } from '../components/Footer';

const HomePage: React.FC = () => {
  return (
    <main className="bg-[#0B0907] min-h-screen text-[#FBF7EF] selection:bg-[#C29845] selection:text-[#0B0907]">
      <Navbar />
      <Hero />
      <Story />
      <Couple />
      <WeddingSchedule />
      <Countdown />
      <Gallery />
      <RSVP />
      <Blessings />
      <Location />
      <Footer />
    </main>
  );
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="*" element={<HomePage />} />
    </Routes>
  );
};
