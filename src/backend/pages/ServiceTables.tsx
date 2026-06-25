import { Link } from "react-router-dom";
import { useStore, tableTotal } from "../store";

export default function ServiceTables() {
  const db = useStore();
  const activeId = db.activeEventId;
  if (!activeId) return <p className="text-neutral-500">Geen actief event.</p>;
  const tables = db.tables.filter((t) => t.eventId === activeId).sort((a, b) => a.number - b.number);

  return (
    <div className="space-y-4">
      <h2 className="font-serif text-2xl">Tafels</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {tables.map((t) => {
          const res = db.reservations.find((r) => r.tableId === t.id);
          const openOrders = db.orders.filter((o) => o.tableId === t.id && o.status === "new").length;
          const total = tableTotal(activeId, t.id);
          return (
            <Link
              to={`/backend/service/table/${t.id}`}
              key={t.id}
              className="block bg-white rounded-xl border border-neutral-200 p-4 hover:border-neutral-900 transition active:scale-[0.98]"
            >
              <div className="flex items-baseline justify-between">
                <span className="font-serif text-2xl">T{t.number}</span>
                <span className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded ${
                  t.status === "seated" ? "bg-amber-100 text-amber-800" :
                  t.status === "paid" ? "bg-neutral-200 text-neutral-600" : "bg-emerald-50 text-emerald-700"
                }`}>{t.status}</span>
              </div>
              <p className="mt-2 text-sm font-medium truncate">{res?.name ?? <span className="text-neutral-400">— vrij —</span>}</p>
              <p className="text-xs text-neutral-500">{res ? `${res.partySize} pers.` : ""}</p>
              {(res?.allergies || res?.diet || res?.winePairing) && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {res.allergies && <span className="text-[10px] bg-red-50 text-red-700 px-1.5 py-0.5 rounded">⚠ {res.allergies}</span>}
                  {res.diet && <span className="text-[10px] bg-green-50 text-green-700 px-1.5 py-0.5 rounded">{res.diet}</span>}
                  {res.winePairing && <span className="text-[10px] bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded">wine</span>}
                </div>
              )}
              <div className="mt-3 flex items-center justify-between text-xs text-neutral-500">
                <span>{openOrders > 0 ? `${openOrders} open` : "—"}</span>
                <span className="font-medium text-neutral-900">€ {total.toFixed(2)}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
