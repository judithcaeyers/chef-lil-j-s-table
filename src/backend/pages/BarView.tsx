import { useState } from "react";
import { store, useStore } from "../store";

export default function BarView() {
  const db = useStore();
  const activeId = db.activeEventId;
  const [showDone, setShowDone] = useState(false);

  if (!activeId) return <p className="text-neutral-500">Geen actief event.</p>;
  const orders = db.orders
    .filter((o) => o.eventId === activeId && (showDone ? o.status === "done" : o.status === "new"))
    .sort((a, b) => a.createdAt - b.createdAt);
  const tables = db.tables;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-2xl">Bar — {showDone ? "Afgewerkt" : "Open bestellingen"}</h2>
        <div className="flex gap-1 bg-neutral-100 rounded-lg p-1 text-sm">
          <button onClick={() => setShowDone(false)}
                  className={`px-3 py-1 rounded ${!showDone ? "bg-white shadow-sm" : "text-neutral-500"}`}>
            Open ({db.orders.filter((o) => o.eventId === activeId && o.status === "new").length})
          </button>
          <button onClick={() => setShowDone(true)}
                  className={`px-3 py-1 rounded ${showDone ? "bg-white shadow-sm" : "text-neutral-500"}`}>
            Afgewerkt
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {orders.map((o) => {
          const t = tables.find((x) => x.id === o.tableId);
          const minutesAgo = Math.floor((Date.now() - o.createdAt) / 60000);
          return (
            <div key={o.id} className={`rounded-xl border p-4 ${o.status === "new" ? "bg-white border-amber-300" : "bg-neutral-50 border-neutral-200"}`}>
              <div className="flex items-baseline justify-between mb-2">
                <span className="font-serif text-3xl">T{t?.number ?? "?"}</span>
                <span className="text-xs text-neutral-500">
                  {new Date(o.createdAt).toLocaleTimeString("nl-BE", { hour: "2-digit", minute: "2-digit" })}
                  {o.status === "new" && minutesAgo > 0 && <> · {minutesAgo}′</>}
                </span>
              </div>
              <ul className="text-base space-y-1">
                {o.items.map((i) => (
                  <li key={i.drinkId} className="flex justify-between">
                    <span><span className="font-medium">{i.qty}×</span> {i.name}</span>
                  </li>
                ))}
              </ul>
              {o.note && <p className="mt-2 text-xs italic text-neutral-600">“{o.note}”</p>}
              {o.status === "new" ? (
                <button
                  onClick={() => store.updateOrder(o.id, { status: "done" })}
                  className="mt-3 w-full bg-emerald-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-emerald-700"
                >
                  ✓ Afgewerkt
                </button>
              ) : (
                <button
                  onClick={() => store.updateOrder(o.id, { status: "new" })}
                  className="mt-3 w-full text-xs text-neutral-500 underline"
                >
                  terug naar open
                </button>
              )}
            </div>
          );
        })}
        {orders.length === 0 && (
          <p className="text-sm text-neutral-400 col-span-full text-center py-12">
            {showDone ? "Nog niets afgewerkt." : "Geen open bestellingen."}
          </p>
        )}
      </div>
    </div>
  );
}
