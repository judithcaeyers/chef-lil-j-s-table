import { Link } from "react-router-dom";
import { useStore, tableTotal } from "../store";

export default function ServiceTables() {
  const db = useStore();
  const activeId = db.activeEventId;
  if (!activeId) return <p className="text-center text-foreground opacity-60">Geen actief event.</p>;
  const tables = db.tables.filter((t) => t.eventId === activeId).sort((a, b) => a.number - b.number);

  return (
    <div className="max-w-[650px] mx-auto px-4 py-6 text-foreground">
      <h2 className="font-display text-4xl md:text-[42px] mb-8 text-center" style={{ WebkitTextStroke: '0.5px currentColor' }}>
        Dinner Club
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {tables.map((t) => {
          const res = db.reservations.find((r) => r.tableId === t.id);
          const openOrders = db.orders.filter((o) => o.tableId === t.id && o.status === "new").length;
          const total = tableTotal(activeId, t.id);
          return (
            <Link
              to={`/backend/service/table/${t.id}`}
              key={t.id}
              className="block border border-foreground/15 rounded-xl p-4 hover:border-foreground/40 hover:bg-[hsl(24_75%_78%)]/20 transition active:scale-[0.98] bg-background/50"
            >
              <div className="flex items-baseline justify-between">
                <span className="font-display text-2xl">T{t.number}</span>
                <span className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded ${
                  t.status === "seated" ? "bg-amber-100 text-amber-800" :
                  t.status === "paid" ? "bg-foreground/10 text-foreground/60" : "bg-emerald-50 text-emerald-700"
                }`}>{t.status}</span>
              </div>
              <p className="mt-2 text-sm font-body font-medium truncate">{res?.name ?? <span className="opacity-40">— vrij —</span>}</p>
              <p className="text-xs opacity-60">{res ? `${res.partySize} pers.` : ""}</p>
              {(res?.allergies || res?.diet || res?.winePairing) && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {res.allergies && <span className="text-[10px] bg-red-50 text-red-700 px-1.5 py-0.5 rounded">⚠ {res.allergies}</span>}
                  {res.diet && <span className="text-[10px] bg-green-50 text-green-700 px-1.5 py-0.5 rounded">{res.diet}</span>}
                  {res.winePairing && <span className="text-[10px] bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded">wine</span>}
                </div>
              )}
              <div className="mt-3 flex items-center justify-between text-xs opacity-60">
                <span>{openOrders > 0 ? `${openOrders} open` : "—"}</span>
                <span className="font-medium text-foreground">€ {total.toFixed(2)}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
