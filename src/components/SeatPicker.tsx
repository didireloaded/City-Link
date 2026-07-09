import { useMemo, useState } from "react";
import { Trip } from "@/data/trips";
import { CircleUser } from "lucide-react";

interface Props {
  trip: Trip;
  selected: string[];
  onChange: (seats: string[]) => void;
  max?: number;
}

export const SeatPicker = ({ trip, selected, onChange, max = 5 }: Props) => {
  const { rows, cols, aisleAfter } = trip.bus.seatLayout;
  const letters = ["A", "B", "C", "D", "E", "F"].slice(0, cols);

  const toggle = (id: string) => {
    if (trip.bookedSeats.includes(id)) return;
    if (selected.includes(id)) onChange(selected.filter((s) => s !== id));
    else if (selected.length < max) onChange([...selected, id]);
  };

  const grid = useMemo(() => {
    const arr: { id: string; row: number; col: number }[] = [];
    for (let r = 1; r <= rows; r++) {
      for (let c = 0; c < cols; c++) {
        arr.push({ id: `${r}${letters[c]}`, row: r, col: c });
      }
    }
    return arr;
  }, [rows, cols, letters]);

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-extrabold text-primary">Choose Your Seat</h3>
        <span className="text-xs font-bold text-muted-foreground">
          {selected.length} / {max} selected
        </span>
      </div>

      <div className="flex justify-center">
        <div className="rounded-t-[2rem] border border-border bg-secondary/70 p-5">
          {/* driver */}
          <div className="flex justify-end mb-4 pr-1">
            <div className="w-10 h-10 rounded-lg bg-card flex items-center justify-center text-muted-foreground" title="Driver">
              <CircleUser className="w-5 h-5" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {Array.from({ length: rows }, (_, ri) => {
              const r = ri + 1;
              return (
                <div key={r} className="flex items-center gap-2">
                  <span className="w-5 text-[10px] text-muted-foreground text-right">{r}</span>
                  {letters.map((l, ci) => {
                    const id = `${r}${l}`;
                    const isBooked = trip.bookedSeats.includes(id);
                    const isSel = selected.includes(id);
                    return (
                      <span key={id} className="contents">
                        <button
                          type="button"
                          disabled={isBooked}
                          onClick={() => toggle(id)}
                          className={`w-9 h-9 rounded-md text-[10px] font-semibold transition-all border ${
                            isBooked
                              ? "bg-muted text-muted-foreground border-transparent cursor-not-allowed line-through"
                              : isSel
                              ? "bg-accent text-accent-foreground border-accent shadow-[var(--shadow-glow)] scale-105"
                              : "bg-card text-primary border-primary hover:border-accent hover:scale-105"
                          }`}
                        >
                          {id}
                        </button>
                        {ci === aisleAfter - 1 && <span className="w-3" />}
                      </span>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 justify-center mt-6 text-xs text-muted-foreground">
        <Legend className="bg-card border border-primary" label="Available" />
        <Legend className="bg-accent" label="Selected" />
        <Legend className="bg-muted" label="Booked" />
      </div>
    </div>
  );
};

const Legend = ({ className, label }: { className: string; label: string }) => (
  <span className="flex items-center gap-2">
    <span className={`w-4 h-4 rounded ${className}`} /> {label}
  </span>
);
