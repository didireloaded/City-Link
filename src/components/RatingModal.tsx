import { useState } from "react";
import { Star, X } from "lucide-react";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onClose: () => void;
  tripLabel?: string;
  onSubmit?: (data: { driver: number; service: number; comment: string }) => void;
}

export const RatingModal = ({ open, onClose, tripLabel, onSubmit }: Props) => {
  const [driver, setDriver] = useState(0);
  const [service, setService] = useState(0);
  const [comment, setComment] = useState("");

  if (!open) return null;

  const submit = () => {
    if (!driver || !service) {
      toast.error("Please rate both driver and service");
      return;
    }
    onSubmit?.({ driver, service, comment });
    const reviews = JSON.parse(localStorage.getItem("citylink_reviews") || "[]");
    reviews.unshift({ id: Date.now(), trip: tripLabel, driver, service, comment, at: new Date().toISOString() });
    localStorage.setItem("citylink_reviews", JSON.stringify(reviews));
    toast.success("Thanks for your feedback");
    setDriver(0);
    setService(0);
    setComment("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-primary/45 p-4 backdrop-blur-sm sm:items-center animate-fade-up">
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-elegant)]">
        <button onClick={onClose} className="absolute right-4 top-4 text-muted-foreground hover:text-foreground" aria-label="Close rating modal">
          <X className="h-5 w-5" />
        </button>
        <h2 className="text-2xl font-extrabold text-primary">Rate your trip</h2>
        {tripLabel && <p className="mt-1 text-sm font-semibold text-muted-foreground">{tripLabel}</p>}

        <RatingRow label="Driver" value={driver} onChange={setDriver} />
        <RatingRow label="Service" value={service} onChange={setService} />

        <label className="mt-5 block">
          <span className="text-xs font-extrabold uppercase text-muted-foreground">Comment (optional)</span>
          <textarea
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            rows={3}
            placeholder="Tell us how it went"
            className="mt-1.5 w-full resize-none rounded-xl border border-border bg-input px-4 py-3 text-sm font-semibold outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
        </label>

        <button onClick={submit} className="mt-5 h-12 w-full rounded-xl bg-accent text-sm font-extrabold text-accent-foreground shadow-[var(--shadow-glow)]">
          Submit Rating
        </button>
      </div>
    </div>
  );
};

const RatingRow = ({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) => (
  <div className="mt-5">
    <div className="mb-2 text-xs font-extrabold uppercase text-muted-foreground">{label}</div>
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((rating) => (
        <button
          key={rating}
          type="button"
          onClick={() => onChange(rating)}
          className="p-1 transition-transform active:scale-90"
          aria-label={`${rating} stars`}
        >
          <Star className={`h-8 w-8 ${rating <= value ? "fill-accent text-accent" : "text-muted-foreground/40"}`} />
        </button>
      ))}
    </div>
  </div>
);
