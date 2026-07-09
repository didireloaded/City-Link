import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

interface Props {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  back?: string;
}

export const TopBar = ({ title, subtitle, right, back }: Props) => {
  const nav = useNavigate();

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/92 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-3 px-4">
        <button
          onClick={() => (back ? nav(back) : nav(-1))}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-card text-primary shadow-sm transition-transform active:scale-95"
          aria-label="Back"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-base font-extrabold">{title}</h1>
          {subtitle && <p className="truncate text-[11px] font-semibold text-muted-foreground">{subtitle}</p>}
        </div>
        {right}
      </div>
    </header>
  );
};
