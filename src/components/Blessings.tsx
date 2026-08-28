import React, { useState, useEffect } from 'react';
import { weddingDetails, Blessing } from '../mocks/weddingData';
import { Heart, Send, MessageSquarePlus } from 'lucide-react';

export const Blessings: React.FC = () => {
  const [blessings, setBlessings] = useState<Blessing[]>(() => {
    const saved = localStorage.getItem('wedding_blessings');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return weddingDetails.initialBlessings; }
    }
    return weddingDetails.initialBlessings;
  });

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    localStorage.setItem('wedding_blessings', JSON.stringify(blessings));
  }, [blessings]);

  const handleSendBlessing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    const initials = name.trim().charAt(0).toUpperCase();
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    const newBlessing: Blessing = {
      id: Date.now().toString(),
      name: name.trim(),
      date: formattedDate,
      message: message.trim(),
      initials,
    };

    setBlessings([newBlessing, ...blessings]);
    setName('');
    setMessage('');
    setShowForm(false);
  };

  return (
    <section id="blessings" className="py-24 bg-[#0B0907] relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-[#C29845] text-xs font-medium tracking-[0.3em] uppercase block mb-3">
            GUESTBOOK
          </span>
          <h2 className="font-heading text-3xl md:text-5xl text-[#FBF7EF] uppercase font-normal tracking-[0.1em] mb-4">
            Leave A Little Love
          </h2>
          <p className="text-[#DACFB8] text-sm md:text-base font-light max-w-lg mx-auto mb-8">
            Share your blessings, wishes and congratulations with the couple.
          </p>

          {/* Toggle Write Form Button */}
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center space-x-2 px-8 py-3 bg-[#141110] border border-[#C29845] text-[#D2AC5E] text-xs tracking-[0.25em] uppercase hover:bg-[#C29845] hover:text-[#0B0907] transition-all duration-300 shadow-xl font-semibold"
          >
            <Heart size={16} />
            <span>{showForm ? 'CLOSE FORM' : 'WRITE A MESSAGE'}</span>
          </button>
        </div>

        {/* Message Input Form Drawer */}
        {showForm && (
          <form
            onSubmit={handleSendBlessing}
            className="max-w-xl mx-auto mb-16 bg-[#141110] p-8 border border-[#C29845]/50 shadow-2xl animate-fade-down"
          >
            <h3 className="font-heading text-xl text-[#FBF7EF] uppercase mb-6 text-center">
              Send Your Blessings
            </h3>
            <div className="space-y-6">
              <div>
                <label className="text-[#C29845] text-xs tracking-[0.25em] uppercase font-medium block mb-2">
                  YOUR NAME *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full bg-[#0B0907] border border-[#C29845]/30 text-[#FBF7EF] px-4 py-3 text-sm focus:outline-none focus:border-[#C29845]"
                />
              </div>
              <div>
                <label className="text-[#C29845] text-xs tracking-[0.25em] uppercase font-medium block mb-2">
                  YOUR BLESSING / MESSAGE *
                </label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write a message of love for Nadia & Kwame..."
                  className="w-full bg-[#0B0907] border border-[#C29845]/30 text-[#FBF7EF] p-4 text-sm focus:outline-none focus:border-[#C29845] resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3.5 bg-[#C29845] text-[#0B0907] text-xs tracking-[0.25em] uppercase font-semibold hover:brightness-110 transition-all flex items-center justify-center space-x-2"
              >
                <Send size={16} />
                <span>POST BLESSING</span>
              </button>
            </div>
          </form>
        )}

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {blessings.map((b) => (
            <div
              key={b.id}
              className="bg-[#141110] p-8 border border-[#C29845]/20 hover:border-[#C29845]/50 transition-all duration-300 shadow-xl flex items-start space-x-5"
            >
              {/* Initials Avatar */}
              <div className="w-12 h-12 rounded-full bg-[#26201C] border border-[#C29845]/40 flex items-center justify-center text-[#D2AC5E] font-heading text-lg font-semibold shrink-0">
                {b.initials}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-heading text-lg text-[#FBF7EF] font-normal truncate">
                    {b.name}
                  </h4>
                  <span className="text-[11px] text-[#A69272] uppercase tracking-wider">
                    {b.date}
                  </span>
                </div>
                <p className="text-[#DACFB8] text-sm leading-relaxed font-light">
                  "{b.message}"
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
