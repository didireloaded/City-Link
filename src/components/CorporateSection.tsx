import { Building2, Briefcase, Users, Clock, ShieldCheck, ArrowRight } from "lucide-react";

interface CorporateProps {
  onRequestCorporate?: () => void;
}

export const CorporateSection = ({ onRequestCorporate }: CorporateProps) => {
  return (
    <section id="corporate" className="w-full pt-8 pb-12 px-2 md:px-4">
      <div className="rounded-[32px] md:rounded-[40px] bg-neutral-50 border border-neutral-200/80 p-6 sm:p-8 md:p-12">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-200/70 text-neutral-800 text-xs font-bold uppercase tracking-wider mb-4">
            <Building2 className="w-3.5 h-3.5" />
            <span>Corporate & Diplomatic Transport</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight leading-tight mb-4">
            Executive Chauffeurs & Recurring Staff Shuttles
          </h2>

          <p className="text-xs sm:text-base text-neutral-600 font-normal leading-relaxed mb-6">
            For Namibian businesses, multinational organizations, and visiting delegations, City Cab provides reliable, contracted transport services with monthly billing, dedicated fleet assignments, and background-checked professional drivers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-8">
          {[
            {
              title: "VIP & Executive Chauffeur",
              desc: "Unbranded luxury SUVs and sedans for C-level executives, diplomats, and international guests.",
              icon: Briefcase,
            },
            {
              title: "Daily Staff Transportation",
              desc: "Punctual, safe morning and evening employee shuttles across Windhoek and surrounding industrial zones.",
              icon: Users,
            },
            {
              title: "Conference & Event Logistics",
              desc: "Coordinated airport arrival shuttles and multi-venue transfer management for symposiums.",
              icon: Clock,
            },
            {
              title: "Corporate Invoicing",
              desc: "Pre-approved corporate accounts with centralized monthly itemized VAT billing.",
              icon: ShieldCheck,
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="p-5 rounded-2xl bg-white border border-neutral-200/70 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-9 h-9 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-800 mb-3">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-neutral-900 mb-1.5">{item.title}</h3>
                  <p className="text-xs text-neutral-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={onRequestCorporate}
            className="px-6 py-3 rounded-full bg-black hover:bg-neutral-800 text-white text-xs sm:text-sm font-bold transition-all hover:scale-105 active:scale-95 shadow-sm flex items-center gap-2"
          >
            <span>Request Corporate Transport</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <a
            href="mailto:info@whk-citycab.com?subject=Corporate%20Transport%20Inquiry"
            className="px-5 py-3 rounded-full bg-white hover:bg-neutral-100 text-neutral-800 text-xs sm:text-sm font-semibold border border-neutral-200 transition-colors"
          >
            Email: info@whk-citycab.com
          </a>
        </div>
      </div>
    </section>
  );
};
