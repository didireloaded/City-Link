import { bookingLink } from "@/lib/transfer-service";
import { Link } from "react-router-dom";
import { SERVICES, CITY_LINK_INFO } from "@/data/trips";
import { ArrowRight, BriefcaseBusiness, CarTaxiFront, MessageCircle, PackageSearch, Phone, Plane, User } from "lucide-react";

const serviceIcons = [Plane, CarTaxiFront, BriefcaseBusiness, CarTaxiFront, BriefcaseBusiness, User];

const Parcel = () => {
  return (
    <div className="safe-page bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-background/92 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-md items-center justify-between px-5">
          <h1 className="text-xl font-extrabold text-primary">Services</h1>
          <Link to="/profile" className="flex h-10 w-10 items-center justify-center rounded-xl bg-card text-primary shadow-sm">
            <User className="h-5 w-5" />
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-md px-5 pt-4 pb-24">
        <section className="rounded-2xl bg-primary p-5 text-primary-foreground shadow-[var(--shadow-elegant)]">
          <p className="text-[11px] font-extrabold uppercase text-white/70">Windhoek City Cab</p>
          <h2 className="mt-1 text-2xl font-extrabold">Private transfers across Namibia.</h2>
          <p className="mt-2 text-sm font-semibold text-white/75">
            Airport, city, lodge, safari, executive and staff transportation with professional drivers.
          </p>
        </section>

        <Link to="/parcels/track" className="mt-5 flex items-center justify-between rounded-2xl border border-accent/40 bg-accent/10 p-4 shadow-sm active:scale-[0.99] transition-transform">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent/20 text-accent">
              <PackageSearch className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-sm font-extrabold text-primary">Parcel Send & Track</h3>
              <p className="text-xs font-semibold text-muted-foreground">Live waybill tracking on the B1 corridor</p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-accent" />
        </Link>

        <section className="mt-5 grid grid-cols-2 gap-3">
          {SERVICES.map((service, index) => {
            const Icon = serviceIcons[index] || CarTaxiFront;
            return (
              <article key={service.title} className="rounded-2xl border border-border bg-card p-4 shadow-sm animate-fade-up">
                <div className="flex flex-col items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-accent/15 text-accent">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-extrabold text-primary">{service.title}</h3>
                    <p className="mt-1 text-xs font-semibold leading-relaxed text-muted-foreground">{service.desc}</p>
                  </div>
                </div>
                <div className="mt-4 grid gap-2">
                  <Link to={bookingLink(service.title.split(" ")[0])} className="flex h-11 items-center justify-center gap-1.5 rounded-xl bg-accent text-xs font-extrabold text-accent-foreground">
                    Book Transfer <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </article>
            );
          })}
        </section>

      </main>
    </div>
  );
};

export default Parcel;
