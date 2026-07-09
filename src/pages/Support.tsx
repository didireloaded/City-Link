import { useState } from "react";
import { TopBar } from "@/components/TopBar";
import { CITY_LINK_INFO } from "@/data/trips";
import {
  MessageCircle,
  Phone,
  Mail,
  Clock,
  ChevronDown,
  HelpCircle,
  ShieldCheck,
  Send,
} from "lucide-react";
import { toast } from "sonner";

export const Support = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([
    {
      sender: "agent",
      text: `Hello! Welcome to City-Link Customer Care. I am your virtual assistant. How can I help you today?`,
      time: "Just now",
    },
  ]);

  const faqs = [
    {
      q: "Where does the bus pick up in Windhoek, Oshakati, and Ondangwa?",
      a: `In Windhoek: Erf 7 Bahnhof Street, opposite Palm Trees Park. In Oshakati: Ekuku Mall, Unit 10, Okatana Road. In Ondangwa: Sun Square Complex, Unit 5, Rooftech Building. Please arrive 30 minutes before departure.`,
    },
    {
      q: "What days does City-Link operate and what are the departure times?",
      a: `We operate Sunday through Friday (closed on Saturdays). We also operate on public holidays! Standard departures from Oshakati/Ondangwa/Ongwediva to Windhoek leave at 06:30 morning.`,
    },
    {
      q: "What amenities are included on City-Link luxury sleeper buses?",
      a: `Our 49-seat Luxury Sleeper Coaches feature Onboard Wi-Fi, Toilet Facilities, Cable Phone Charging at every seat, Pillow & Blanket, a fresh Dental Kit, and Dinner Service on long-distance routes!`,
    },
    {
      q: "How do I claim student or senior discounts?",
      a: `Select your eligible discount at checkout or on the Route Map! Students receive 5% off, Senior Citizens receive 8% off, and Return Tickets receive 6% off.`,
    },
    {
      q: "Can I pay with cash or EFT?",
      a: `Yes! You can reserve your ticket online and pay via card, EFT bank transfer, or pay cash at our physical office before departure.`,
    },
  ];

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    const userMsg = chatMessage;
    setChatHistory((prev) => [
      ...prev,
      { sender: "user", text: userMsg, time: "Just now" },
    ]);
    setChatMessage("");

    setTimeout(() => {
      setChatHistory((prev) => [
        ...prev,
        {
          sender: "agent",
          text: `Thank you for your message! Our human care agents are available at ${CITY_LINK_INFO.contact.phone} (${CITY_LINK_INFO.contact.hours}). For urgent booking changes, you can also click the WhatsApp button above for instant connection.`,
          time: "Just now",
        },
      ]);
    }, 1000);
  };

  return (
    <div className="safe-page bg-background">
      <TopBar title="Help & Customer Care" subtitle="City-Link Support Hub" back="/" />

      <main className="mx-auto max-w-md px-4 pt-4 space-y-6">
        {/* Header Hero */}
        <section className="rounded-3xl bg-primary p-6 text-primary-foreground shadow-[var(--shadow-elegant)] animate-fade-up">
          <span className="rounded-full bg-accent/20 px-3 py-1 text-xs font-extrabold text-accent uppercase">
            99% On-Time Care
          </span>
          <h2 className="mt-3 text-2xl font-extrabold leading-tight">
            How Can We Assist Your Journey?
          </h2>
          <p className="mt-2 text-sm font-semibold text-white/75">
            {CITY_LINK_INFO.tagline}.
          </p>
        </section>

        {/* Quick Contact Cards Grid */}
        <section className="grid grid-cols-1 gap-3">
          <a
            href={`https://wa.me/264818767676?text=${encodeURIComponent(
              "Hello City-Link, I need assistance with a booking or route information."
            )}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between rounded-2xl border border-success/30 bg-success/10 p-4 transition-transform active:scale-[0.98]"
          >
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-success text-white shadow-sm">
                <MessageCircle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-primary">WhatsApp Support</h3>
                <p className="text-xs font-semibold text-muted-foreground">
                  Instant text reply · Avg 3 minutes
                </p>
              </div>
            </div>
            <span className="text-xs font-extrabold text-success uppercase">Chat →</span>
          </a>

          <a
            href={`tel:${CITY_LINK_INFO.contact.phone}`}
            className="flex items-center justify-between rounded-2xl border border-border bg-card p-4 transition-transform active:scale-[0.98] shadow-sm"
          >
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-primary">
                <Phone className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-primary">Call Customer Desk</h3>
                <p className="text-xs font-semibold text-muted-foreground">
                  {CITY_LINK_INFO.contact.phone} ({CITY_LINK_INFO.contact.hours})
                </p>
              </div>
            </div>
            <span className="text-xs font-extrabold text-accent uppercase">Dial →</span>
          </a>

          <a
            href={`mailto:${CITY_LINK_INFO.contact.email}`}
            className="flex items-center justify-between rounded-2xl border border-border bg-card p-4 transition-transform active:scale-[0.98] shadow-sm"
          >
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-primary">
                <Mail className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-primary">Email Support</h3>
                <p className="text-xs font-semibold text-muted-foreground">
                  {CITY_LINK_INFO.contact.email}
                </p>
              </div>
            </div>
            <span className="text-xs font-extrabold text-primary uppercase">Email →</span>
          </a>
        </section>

        {/* Live Assistant Chat Widget */}
        <section className="rounded-3xl border border-border bg-card p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-success" />
              </span>
              <h3 className="text-sm font-extrabold text-primary">Live Assistant Desk</h3>
            </div>
            <span className="text-[11px] font-bold text-muted-foreground">
              {CITY_LINK_INFO.contact.hours}
            </span>
          </div>

          <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
            {chatHistory.map((msg, i) => (
              <div
                key={i}
                className={`flex flex-col ${
                  msg.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs font-semibold leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-accent text-accent-foreground rounded-br-none"
                      : "bg-secondary text-primary rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </div>
                <span className="mt-1 text-[10px] font-bold text-muted-foreground">
                  {msg.time}
                </span>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendChat} className="flex gap-2 pt-1">
            <input
              type="text"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder="Ask about routes, boarding or baggage..."
              className="h-12 flex-1 rounded-xl border border-border bg-input px-4 text-xs font-bold outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
            <button
              type="submit"
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm active:scale-95 transition-transform"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </section>

        {/* Accordion FAQs */}
        <section className="space-y-3">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-muted-foreground px-1">
            Frequently Asked Questions
          </h3>

          <div className="space-y-2.5">
            {faqs.map((f, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between p-4 text-left font-extrabold text-sm text-primary"
                  >
                    <span className="pr-3">{f.q}</span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-accent" : "text-muted-foreground"
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="border-t border-border/60 bg-secondary/30 p-4 text-xs font-semibold text-muted-foreground leading-relaxed">
                      {f.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Support;
