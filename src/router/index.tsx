import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { Story } from '../components/Story';
import { Couple } from '../components/Couple';
import { WeddingSchedule } from '../components/WeddingSchedule';
import { Program } from '../components/Program';
import { Countdown } from '../components/Countdown';
import { Gallery } from '../components/Gallery';
import { RSVP } from '../components/RSVP';
import { Gifts } from '../components/Gifts';
import { Location } from '../components/Location';
import { Footer } from '../components/Footer';
import { SplashScreen } from '../components/SplashScreen';
import { MusicPlayer } from '../components/MusicPlayer';

const HomePage: React.FC = () => {
  return (
    <main className="bg-[#0a1713] min-h-screen text-[#FBF7EF] selection:bg-[#f1c65a] selection:text-[#0a1713]">
      <SplashScreen />
      <MusicPlayer />
      <Navbar />
      <Hero />
      <Couple />
      <Story />
      <WeddingSchedule />
      <Program />
      <Countdown />
      <Gallery />
      <RSVP />
      <Gifts />
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
