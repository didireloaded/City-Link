import { useState } from "react";
import { ArrowRight, CarFront, MapPin, ShieldCheck } from "lucide-react";

const slides = [
  { icon: CarFront, eyebrow: "Private rides, made simple", title: "Your ride across Namibia starts here.", body: "Book a trusted City Cab vehicle for airport, city, lodge and safari transfers." },
  { icon: MapPin, eyebrow: "Door to destination", title: "Tell us where you are going.", body: "Choose your pickup, destination, vehicle and time in a few clear steps." },
  { icon: ShieldCheck, eyebrow: "Travel with confidence", title: "A professional ride is ready.", body: "Meet-and-greet airport pickups, comfortable vehicles and support when you need it." },
];

export default function Onboarding({ onComplete }: { onComplete: () => void }) {
  const [index, setIndex] = useState(0);
  const slide = slides[index];
  const Icon = slide.icon;
  const next = () => index === slides.length - 1 ? onComplete() : setIndex((value) => value + 1);
  return <main className="safe-page flex min-h-screen flex-col bg-primary px-6 py-8 text-primary-foreground">
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col">
      <div className="flex items-center justify-between"><span className="text-lg font-black tracking-tight">CITY CAB</span><button onClick={onComplete} className="text-sm font-bold text-white/65">Skip</button></div>
      <div className="flex flex-1 flex-col justify-center">
        <div className="mb-10 flex h-24 w-24 items-center justify-center rounded-[28px] bg-accent text-accent-foreground shadow-[var(--shadow-glow)]"><Icon className="h-11 w-11" /></div>
        <p className="text-xs font-black uppercase tracking-[0.2em] text-accent">{slide.eyebrow}</p>
        <h1 className="mt-4 text-4xl font-black leading-[1.05]">{slide.title}</h1>
        <p className="mt-5 max-w-sm text-base font-medium leading-relaxed text-white/70">{slide.body}</p>
      </div>
      <div><div className="mb-7 flex gap-2">{slides.map((_, item) => <span key={item} className={`h-1.5 rounded-full transition-all ${item === index ? "w-10 bg-accent" : "w-2 bg-white/30"}`} />)}</div><button onClick={next} className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-accent text-base font-black text-accent-foreground">{index === slides.length - 1 ? "Get started" : "Continue"}<ArrowRight className="h-5 w-5" /></button></div>
    </div>
  </main>;
}
