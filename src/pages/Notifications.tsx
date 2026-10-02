import { Bell, BellRing, CheckCheck, CarTaxiFront, Package, Info } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { trpc } from "@/providers/trpc";

const typeIcon = (type: string) => {
  if (type === "booking" || type === "dispatch") return <CarTaxiFront className="h-4 w-4 text-accent" />;
  if (type === "parcel") return <Package className="h-4 w-4 text-accent" />;
  return <Info className="h-4 w-4 text-accent" />;
};

export default function Notifications() {
  const utils = trpc.useUtils();
  const listQuery = trpc.notifications.listMine.useQuery();
  const markAll = trpc.notifications.markAllRead.useMutation({
    onSuccess: () => utils.notifications.listMine.invalidate(),
  });
  const markRead = trpc.notifications.markRead.useMutation({
    onSuccess: () => utils.notifications.listMine.invalidate(),
  });

  const items = listQuery.data ?? [];
  const unread = items.filter((n) => !n.readAt).length;

  return (
    <div className="safe-page bg-background">
      <TopBar title="Notifications" back="/" />
      <main className="mx-auto max-w-md px-5 py-6 space-y-4">
        {items.length > 0 && (
          <div className="flex items-center justify-between">
            <p className="text-xs font-extrabold text-muted-foreground">
              {unread > 0 ? `${unread} unread` : "All caught up"}
            </p>
            {unread > 0 && (
              <button
                onClick={() => markAll.mutate()}
                className="flex h-11 items-center gap-1.5 rounded-xl bg-secondary px-4 text-xs font-extrabold text-primary active:scale-95 transition-transform"
              >
                <CheckCheck className="h-4 w-4 text-accent" /> Mark all read
              </button>
            )}
          </div>
        )}

        {listQuery.isLoading && (
          <p className="py-12 text-center text-sm font-semibold text-muted-foreground">Loading notifications…</p>
        )}

        {!listQuery.isLoading && items.length === 0 && (
          <div className="py-12 text-center">
            <Bell className="mx-auto h-10 w-10 text-accent" />
            <h1 className="mt-5 text-xl font-extrabold text-primary">You're all caught up</h1>
            <p className="mt-2 text-sm text-muted-foreground">Ride updates and driver messages will appear here.</p>
          </div>
        )}

        <div className="space-y-2.5">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => !item.readAt && markRead.mutate({ id: item.id })}
              className={`flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition-all active:scale-[0.99] ${
                item.readAt ? "border-border bg-card" : "border-accent/40 bg-accent/10"
              }`}
            >
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-card shadow-sm ring-1 ring-border">
                {typeIcon(item.type)}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-extrabold text-primary">{item.title}</span>
                  {!item.readAt && <BellRing className="h-3.5 w-3.5 shrink-0 text-accent" />}
                </span>
                {item.body && (
                  <span className="mt-0.5 block text-xs font-semibold leading-relaxed text-muted-foreground">{item.body}</span>
                )}
                <span className="mt-1 block text-[10px] font-bold uppercase tracking-wide text-muted-foreground/70">
                  {new Date(item.createdAt).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                </span>
              </span>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
