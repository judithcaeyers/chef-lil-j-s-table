import { useState } from "react";
import { store, useStore } from "../store";

export default function BarView() {
  const db = useStore();
  const activeId = db.activeEventId;
  const [showDone, setShowDone] = useState(false);

  if (!activeId) return <p className="text-center text-foreground opacity-60">Geen actief event.</p>;
  const orders = db.orders
    .filter((o) => o.eventId === activeId && (showDone ? o.status === "done" : o.status === "new"))
    .sort((a, b) => a.createdAt - b.createdAt);
  const tables = db.tables;

  return (
    <div className="max-w-[900px] mx-auto px-4 py-6 text-foreground">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-3xl md:text-4xl" style={{ WebkitTextStroke: '0.5px currentColor' }}>
          Bar — {showDone ? "Afgewerkt" : "Open bestellingen"}
        </h2>
        <div className="flex gap-1 border border-foreground/15 p-1 text-sm font-body">
          <button onClick={() => setShowDone(false)}
                  className={`px-3 py-1 transition-colors ${!showDone ? "bg-foreground text-background" : "text-foreground/70 hover:bg-foreground/5"}`}>
            Open ({db.orders.filter((o) => o.eventId === activeId && o.status === "new").length})
          </button>
          <button onClick={() => setShowDone(true)}
                  className={`px-3 py-1 transition-colors ${showDone ? "bg-foreground text-background" : "text-foreground/70 hover:bg-foreground/5"}`}>
            Afgewerkt
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {orders.map((o) => {
          const t = tables.find((x) => x.id === o.tableId);
          const minutesAgo = Math.floor((Date.now() - o.createdAt) / 60000);
          return (
            <div key={o.id} className={`rounded-xl border p-4 bg-background/50 ${o.status === "new" ? "border-amber-400/70" : "border-foreground/15"}`}>
              <div className="flex items-baseline justify-between mb-2">
                <span className="font-display text-3xl" style={{ WebkitTextStroke: '0.5px currentColor' }}>T{t?.number ?? "?"}</span>
                <span className="text-xs opacity-60 font-body">
                  {new Date(o.createdAt).toLocaleTimeString("nl-BE", { hour: "2-digit", minute: "2-digit" })}
                  {o.status === "new" && minutesAgo > 0 && <> · {minutesAgo}′</>}
                </span>
              </div>
              <ul className="text-base space-y-1 font-body">
                {o.items.map((i) => (
                  <li key={i.drinkId} className="flex justify-between">
                    <span><span className="font-medium">{i.qty}×</span> {i.name}</span>
                  </li>
                ))}
              </ul>
              {o.note && <p className="mt-2 text-xs italic opacity-60">“{o.note}”</p>}
              {o.status === "new" ? (
                <button
                  onClick={() => store.updateOrder(o.id, { status: "done" })}
                  className="mt-3 w-full border border-foreground bg-foreground text-background py-2.5 rounded-lg text-sm font-body tracking-[1px] hover:bg-[hsl(24_75%_78%)] hover:border-[hsl(24_75%_78%)] hover:text-foreground transition-colors"
                >
                  ✓ Afgewerkt
                </button>
              ) : (
                <button
                  onClick={() => store.updateOrder(o.id, { status: "new" })}
                  className="mt-3 w-full text-xs text-foreground/70 underline underline-offset-4"
                >
                  terug naar open
                </button>
              )}
            </div>
          );
        })}
        {orders.length === 0 && (
          <p className="text-sm opacity-50 col-span-full text-center py-12 font-body">
            {showDone ? "Nog niets afgewerkt." : "Geen open bestellingen."}
          </p>
        )}
      </div>
    </div>
  );
}
