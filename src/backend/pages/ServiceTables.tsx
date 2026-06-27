import { Link } from "react-router-dom";
import { useStore, tableTotal } from "../store";

export default function ServiceTables() {
  const db = useStore();
  const activeId = db.activeEventId;
  if (!activeId) return <p className="text-center text-foreground opacity-60 mt-10">Geen actief event.</p>;
  const tables = db.tables.filter((t) => t.eventId === activeId).sort((a, b) => a.number - b.number);

  return (
    <div className="text-foreground">
      <h2 className="font-display text-5xl mb-5 text-center" style={{ WebkitTextStroke: '0.5px currentColor' }}>
        Tafels
      </h2>
      <div className="grid grid-cols-2 gap-3">
        {tables.map((t) => {
          const res = db.reservations.find((r) => r.tableId === t.id);
          const openOrders = db.orders.filter((o) => o.tableId === t.id && o.status === "new").length;
          const total = tableTotal(activeId, t.id);
          const statusColor =
            t.status === "seated" ? "bg-[hsl(24_75%_78%)]/35 text-foreground border-[hsl(24_75%_78%)]" :
            t.status === "paid" ? "bg-foreground/5 text-foreground/40 border-foreground/10" :
            "bg-background/70 text-foreground border-foreground/15";
          return (
            <Link
              to={`/backend/service/table/${t.id}`}
              key={t.id}
              className={`block border-2 rounded-2xl p-4 transition active:scale-[0.97] min-h-[160px] flex flex-col ${statusColor}`}
            >
              <div className="flex items-baseline justify-between">
                <span className="font-display text-4xl leading-none">T{t.number}</span>
                {openOrders > 0 && (
                  <span className="text-xs font-bold bg-foreground text-background px-2 py-1 rounded-full">
                    {openOrders} open
                  </span>
                )}
              </div>
              <p className="mt-3 text-base font-body font-semibold leading-tight truncate">
                {res?.name ?? <span className="opacity-50 font-normal italic">vrij</span>}
              </p>
              {res && <p className="text-sm opacity-70">{res.partySize} pers.</p>}
              {(res?.allergies || res?.diet || res?.winePairing) && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {res.allergies && <span className="text-xs font-semibold bg-red-100 text-red-800 px-2 py-0.5 rounded">⚠ {res.allergies}</span>}
                  {res.diet && <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">{res.diet}</span>}
                  {res.winePairing && <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded">wine</span>}
                </div>
              )}
              <div className="mt-auto pt-3 text-right text-lg font-semibold tabular-nums">
                € {total.toFixed(2)}
              </div>
            </Link>
          );
        })}
      </div>
      {tables.length === 0 && <p className="text-center opacity-50 mt-10">Nog geen tafels aangemaakt.</p>}
    </div>
  );
}

