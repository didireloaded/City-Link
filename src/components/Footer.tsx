import { Logo } from "./Brand";

export const Footer = () => (
  <footer className="border-t border-border mt-24">
    <div className="container py-12 grid md:grid-cols-4 gap-8">
      <div className="md:col-span-2">
        <Logo />
        <p className="mt-4 text-sm text-muted-foreground max-w-sm">
          Connecting Namibia — comfortable intercity buses and reliable parcel delivery from Windhoek to the North and beyond.
        </p>
      </div>
      <div>
        <h4 className="text-sm font-semibold mb-3">Routes</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>Windhoek ↔ Oshakati</li>
          <li>Windhoek ↔ Ondangwa</li>
          <li>Windhoek ↔ Rundu</li>
          <li>Windhoek ↔ Walvis Bay</li>
        </ul>
      </div>
      <div>
        <h4 className="text-sm font-semibold mb-3">Support</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>0818767676</li>
          <li>info@citylink.com.na</li>
          <li>Sun-Fri, 09:00-20:00</li>
        </ul>
      </div>
    </div>
    <div className="border-t border-border">
      <div className="container py-6 text-xs text-muted-foreground flex justify-between">
        <span>© {new Date().getFullYear()} City-Link Transport (Pty) Ltd.</span>
        <span>Made with care in Namibia 🇳🇦</span>
      </div>
    </div>
  </footer>
);
