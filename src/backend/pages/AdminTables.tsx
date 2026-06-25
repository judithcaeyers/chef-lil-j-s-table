import { useState } from "react";
import { store, useStore } from "../store";

export default function AdminTables() {
  const db = useStore();
  const activeId = db.activeEventId;
  if (!activeId) return <p className="text-neutral-500">Geen actief event.</p>;
  const tables = db.tables.filter((t) => t.eventId === activeId).sort((a, b) => a.number - b.number);

  return (
    <div className="space-y-4">
      <h2 className="font-serif text-2xl">Tafels</h2>
      <div className="bg-white border border-neutral-200 rounded-lg divide-y">
        {tables.map((t) => {
          const res = db.reservations.find((r) => r.tableId === t.id);
          const orders = db.orders.filter((o) => o.tableId === t.id);
          const total = orders.reduce((s, o) => s + o.items.reduce((x, i) => x + i.price * i.qty, 0), 0);
          return (
            <details key={t.id} className="p-4">
              <summary className="cursor-pointer flex items-center justify-between">
                <span className="font-serif text-lg">Tafel {t.number}</span>
                <span className="text-sm text-neutral-500">
                  {res ? `${res.name} · ${res.partySize}p` : "vrij"} · € {total.toFixed(2)}
                </span>
              </summary>
              {res && (
                <div className="mt-3 text-sm space-y-1">
                  <p>Allergieën: {res.allergies || "—"}</p>
                  <p>Dieet: {res.diet || "—"}</p>
                  <p>Wine pairing: {res.winePairing ? "Ja" : "Nee"}</p>
                  <p>Opmerkingen: {res.notes || "—"}</p>
                </div>
              )}
              <div className="mt-3">
                <p className="text-xs uppercase text-neutral-400 mb-1">Bestellingen</p>
                {orders.length === 0 && <p className="text-xs text-neutral-400">Geen bestellingen.</p>}
                {orders.map((o) => (
                  <div key={o.id} className="text-xs flex justify-between border-t border-neutral-100 py-1">
                    <span>{new Date(o.createdAt).toLocaleTimeString("nl-BE")} · {o.items.map((i) => `${i.qty}× ${i.name}`).join(", ")}</span>
                    <span className={o.status === "new" ? "text-amber-700" : "text-emerald-700"}>{o.status}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex gap-2">
                <button onClick={() => store.updateTable(t.id, { status: "free" })} className="text-xs px-2 py-1 border rounded">vrij</button>
                <button onClick={() => store.updateTable(t.id, { status: "seated" })} className="text-xs px-2 py-1 border rounded">bezet</button>
                <button onClick={() => store.updateTable(t.id, { status: "paid" })} className="text-xs px-2 py-1 border rounded">betaald</button>
              </div>
            </details>
          );
        })}
      </div>
    </div>
  );
}
