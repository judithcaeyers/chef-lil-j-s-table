import { Link } from "react-router-dom";
import { useStore, tableTotal } from "../store";

export default function ServiceTables() {
  const db = useStore();
  const activeId = db.activeEventId;
  if (!activeId) return <p className="text-center opacity-60 mt-10">Geen actief event.</p>;
  const tables = db.tables.filter((t) => t.eventId === activeId).sort((a, b) => a.number - b.number);

  return (
    <div>
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="font-display text-3xl leading-none" style={{ WebkitTextStroke: '0.5px currentColor' }}>
          Tafels
        </h2>
        <span className="text-xs uppercase tracking-[2px] opacity-50">{tables.length} tafels</span>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {tables.map((t) => {
          const res = db.reservations.find((r) => r.tableId === t.id);
          const openOrders = db.orders.filter((o) => o.tableId === t.id && o.status === "new").length;
          const total = tableTotal(activeId, t.id);
          const occupied = t.status === "seated";
          const paid = t.status === "paid";

          return (
            <Link
              key={t.id}
              to={`/backend/service/table/${t.id}`}
              className={`block rounded-2xl p-3.5 min-h-[150px] flex flex-col border transition active:scale-[0.97] ${
                paid
                  ? "border-foreground/10 opacity-50"
                  : occupied
                  ? "border-foreground bg-foreground/[0.06]"
                  : "border-foreground/20"
              }`}
            >
              <div className="flex items-start justify-between">
                <span className="font-display text-5xl leading-none" style={{ WebkitTextStroke: '0.5px currentColor' }}>
                  {t.number}
                </span>
                {openOrders > 0 && (
                  <span className="text-[10px] font-semibold uppercase tracking-wider bg-foreground text-background px-2 py-1 rounded-full">
                    {openOrders} open
                  </span>
                )}
              </div>

              <div className="mt-auto pt-3">
                {res ? (
                  <>
                    <p className="font-body text-base font-semibold leading-tight truncate">{res.name}</p>
                    <p className="text-xs opacity-60">{res.partySize} pers.</p>
                    {(res.allergies || res.diet || res.winePairing) && (
                      <p className="mt-1 text-[11px] opacity-70 truncate">
                        {[res.allergies && `⚠ ${res.allergies}`, res.diet, res.winePairing && "wine"]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-sm italic opacity-40">vrij</p>
                )}
                <p className="mt-2 text-sm tabular-nums opacity-80">€ {total.toFixed(2)}</p>
              </div>
            </Link>
          );
        })}
      </div>
      {tables.length === 0 && <p className="text-center opacity-50 mt-10">Nog geen tafels.</p>}
    </div>
  );
}
