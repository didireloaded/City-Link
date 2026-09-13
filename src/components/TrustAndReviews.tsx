import { Star, ShieldCheck, Award, HeartHandshake, MapPin } from "lucide-react";

export const TrustAndReviews = () => {
  const reviews = [
    {
      author: "Sarah & David M.",
      location: "United Kingdom",
      quote: "City Cab was waiting for us at Hosea Kutako arrivals with a clear name board even though our flight was delayed by 2 hours. Super smooth ride in a spotless air-conditioned car to our hotel in Windhoek.",
      service: "Airport Transfer (WDH to Windhoek)",
      rating: 5,
    },
    {
      author: "Dr. Johannes K.",
      location: "Windhoek, Namibia",
      quote: "We rely on City Cab regularly for visiting medical specialists and international conference delegations. Punctual, courteous drivers who take immense pride in their vehicles.",
      service: "Corporate Chauffeur Account",
      rating: 5,
    },
    {
      author: "Elena R.",
      location: "Germany",
      quote: "Booked a private transfer from Windhoek to Swakopmund. The driver was knowledgeable, made a couple of great photo stops, and navigated safely. Highly recommend over crowded shared buses.",
      service: "Long-Distance Transfer to Swakopmund",
      rating: 5,
    },
  ];

  return (
    <section id="about" className="w-full pt-10 pb-12 px-2 md:px-4">
      {/* About City Cab Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-14">
        <div className="lg:col-span-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 text-neutral-800 text-xs font-bold uppercase tracking-wider mb-3">
            <Award className="w-3.5 h-3.5 text-amber-600" />
            <span>Moving Namibia Since 2014</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-neutral-900 tracking-tight leading-tight mb-4">
            A Decade of Trusted Private Transport
          </h2>

          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-4">
            Founded in Windhoek in 2014, City Cab (JS City Cab cc) was established to provide travelers, local residents, and corporate teams with a dependable, transparent alternative to unregulated taxis and rigid scheduled buses.
          </p>

          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-6">
            From our headquarters at 17 Hahnemann Street in Windhoek West, our licensed fleet operates 24 hours a day, 7 days a week, connecting Hosea Kutako International Airport, Windhoek city center, and premier safari destinations across Namibia.
          </p>

          <div className="grid grid-cols-3 gap-3 border-t border-neutral-100 pt-5">
            <div>
              <span className="text-2xl sm:text-3xl font-black text-neutral-900 block">10+</span>
              <span className="text-[11px] text-neutral-500 font-medium">Years in Operation</span>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-black text-neutral-900 block">100%</span>
              <span className="text-[11px] text-neutral-500 font-medium">Private Transfers</span>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-black text-neutral-900 block">24/7</span>
              <span className="text-[11px] text-neutral-500 font-medium">Dispatch Support</span>
            </div>
          </div>
        </div>

        {/* Right Pillars Box */}
        <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              title: "Verified Professional Drivers",
              desc: "Polite, licensed, background-checked chauffeurs with defensive driving certification.",
              icon: ShieldCheck,
            },
            {
              title: "Transparent Fixed Pricing",
              desc: "Clear upfront quotes with no surge pricing or hidden airport toll surprises.",
              icon: Award,
            },
            {
              title: "Flight Delay Guarantee",
              desc: "We track your inbound flight in real time so your chauffeur is ready when you land.",
              icon: HeartHandshake,
            },
            {
              title: "Headquartered in Windhoek",
              desc: "17 Hahnemann Street, Windhoek West. Locally owned and operated with deep local expertise.",
              icon: MapPin,
            },
          ].map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div key={idx} className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-sm">
                <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-800 mb-3">
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-neutral-900 mb-1">{pillar.title}</h3>
                <p className="text-[11px] sm:text-xs text-neutral-500 leading-relaxed">{pillar.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Verified Reviews Row */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight">
              Traveler Experiences
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">Real feedback from international guests and local corporate clients</p>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-neutral-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>5.0 Star Service</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {reviews.map((rev, idx) => (
            <div key={idx} className="p-5 rounded-[22px] bg-white border border-neutral-200/80 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-neutral-700 leading-relaxed mb-4 italic">
                  "{rev.quote}"
                </p>
              </div>

              <div className="pt-3 border-t border-neutral-100">
                <span className="text-xs font-bold text-neutral-900 block">{rev.author}</span>
                <span className="text-[10px] text-neutral-400 font-medium block">{rev.location} · {rev.service}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
