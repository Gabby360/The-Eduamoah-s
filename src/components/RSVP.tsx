import React, { useState } from 'react';
import { CheckCircle2, Heart } from 'lucide-react';

export const RSVP: React.FC = () => {
  const [attending, setAttending] = useState<'yes' | 'no' | null>(null);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [guests, setGuests] = useState('1 Guest');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !attending) return;
    setSubmitted(true);
  };

  const resetForm = () => {
    setAttending(null);
    setFullName('');
    setPhone('');
    setGuests('1 Guest');
    setMessage('');
    setSubmitted(false);
  };

  return (
    <section id="rsvp" className="py-24 bg-[#11221c] relative overflow-hidden">
      <div className="max-w-3xl mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="bg-gradient-to-r from-[#f1c65a] to-[#e2b324] bg-clip-text text-transparent text-xs font-semibold tracking-[0.3em] uppercase block mb-3">
            RSVP
          </span>
          <h2 className="font-heading text-3xl md:text-5xl text-[#FBF7EF] uppercase font-normal tracking-[0.1em] mb-4">
            Will You Celebrate With Us?
          </h2>
          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#f1c65a] via-[#e2b324] to-transparent mx-auto mt-4" />
        </div>

        {submitted ? (
          <div className="bg-[#0a1713] border border-[#f1c65a] p-10 text-center animate-scale-in shadow-2xl">
            <CheckCircle2 size={48} className="text-[#f1c65a] mx-auto mb-4" />
            <h3 className="font-heading text-2xl md:text-3xl text-[#FBF7EF] uppercase font-normal mb-3">
              Thank You!
            </h3>
            <p className="text-[#DACFB8] text-base leading-relaxed mb-6 font-light max-w-md mx-auto">
              {attending === 'yes'
                ? "Your response has been received. We can't wait to celebrate our special day with you in Accra!"
                : "Thank you for letting us know. You will be missed dearly on our wedding day."}
            </p>
            <button
              onClick={resetForm}
              className="px-6 py-2.5 border border-[#f1c65a] text-[#f1c65a] text-xs tracking-[0.25em] uppercase hover:bg-gradient-to-r hover:from-[#f1c65a] hover:to-[#e2b324] hover:text-[#0a1713] transition-all duration-300 font-semibold"
            >
              Submit Another Response
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-[#0a1713] p-8 md:p-12 border border-[#f1c65a]/30 shadow-2xl">
            
            {/* Attendance Toggle Buttons */}
            <div className="mb-10">
              <label className="bg-gradient-to-r from-[#f1c65a] to-[#e2b324] bg-clip-text text-transparent text-xs tracking-[0.25em] uppercase font-semibold block mb-4 text-center">
                ATTENDANCE CONFIRMATION *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setAttending('yes')}
                  className={`py-4 px-6 text-xs tracking-[0.2em] font-semibold uppercase border transition-all duration-300 ${
                    attending === 'yes'
                      ? 'bg-gradient-to-r from-[#f1c65a] to-[#e2b324] text-[#0a1713] border-[#f1c65a] shadow-lg shadow-[#f1c65a]/30'
                      : 'bg-[#11221c] text-[#BFAC90] border-[#f1c65a]/30 hover:border-[#f1c65a]'
                  }`}
                >
                  YES, I'LL BE THERE
                </button>
                <button
                  type="button"
                  onClick={() => setAttending('no')}
                  className={`py-4 px-6 text-xs tracking-[0.2em] font-semibold uppercase border transition-all duration-300 ${
                    attending === 'no'
                      ? 'bg-[#B46F53] text-[#FBF7EF] border-[#B46F53] shadow-lg'
                      : 'bg-[#11221c] text-[#BFAC90] border-[#f1c65a]/30 hover:border-[#f1c65a]'
                  }`}
                >
                  SORRY, I CAN'T MAKE IT
                </button>
              </div>
            </div>

            {attending && (
              <div className="space-y-8 animate-fade-in">
                
                {/* Full Name */}
                <div>
                  <label className="bg-gradient-to-r from-[#f1c65a] to-[#e2b324] bg-clip-text text-transparent text-xs tracking-[0.25em] uppercase font-semibold block mb-2">
                    FULL NAME *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full bg-[#11221c] border-b border-[#f1c65a]/40 text-[#FBF7EF] px-4 py-3 text-sm focus:outline-none focus:border-[#f1c65a] transition-colors placeholder:text-[#655A50]"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className="bg-gradient-to-r from-[#f1c65a] to-[#e2b324] bg-clip-text text-transparent text-xs tracking-[0.25em] uppercase font-semibold block mb-2">
                    PHONE NUMBER *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter your phone number"
                    className="w-full bg-[#11221c] border-b border-[#f1c65a]/40 text-[#FBF7EF] px-4 py-3 text-sm focus:outline-none focus:border-[#f1c65a] transition-colors placeholder:text-[#655A50]"
                  />
                </div>

                {/* Number of Guests */}
                {attending === 'yes' && (
                  <div>
                    <label className="bg-gradient-to-r from-[#f1c65a] to-[#e2b324] bg-clip-text text-transparent text-xs tracking-[0.25em] uppercase font-semibold block mb-2">
                      NUMBER OF GUESTS
                    </label>
                    <select
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                      className="w-full bg-[#11221c] border-b border-[#f1c65a]/40 text-[#FBF7EF] px-4 py-3 text-sm focus:outline-none focus:border-[#f1c65a] transition-colors cursor-pointer"
                    >
                      <option value="1 Guest">1 Guest</option>
                      <option value="2 Guests">2 Guests</option>
                      <option value="3 Guests">3 Guests</option>
                      <option value="4 Guests">4 Guests</option>
                      <option value="5 Guests">5 Guests</option>
                    </select>
                  </div>
                )}

                {/* Message */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="bg-gradient-to-r from-[#f1c65a] to-[#e2b324] bg-clip-text text-transparent text-xs tracking-[0.25em] uppercase font-semibold">
                      MESSAGE (OPTIONAL)
                    </label>
                    <span className="text-[10px] text-[#A69272]">
                      {message.length}/500
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    maxLength={500}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Share a few words with us..."
                    className="w-full bg-[#11221c] border border-[#f1c65a]/30 text-[#FBF7EF] p-4 text-sm focus:outline-none focus:border-[#f1c65a] transition-colors placeholder:text-[#655A50] resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-[#f1c65a] via-[#e2b324] to-[#c59613] text-[#0a1713] font-semibold text-xs tracking-[0.25em] uppercase hover:brightness-110 transition-all duration-300 shadow-xl shadow-[#f1c65a]/20 flex items-center justify-center space-x-2"
                >
                  <Heart size={16} className="fill-[#0a1713]" />
                  <span>SUBMIT RSVP</span>
                </button>

              </div>
            )}

          </form>
        )}

      </div>
    </section>
  );
};
