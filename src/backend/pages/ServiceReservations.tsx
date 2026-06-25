import { useState } from "react";
import { useStore, store } from "../store";

export default function ServiceReservations() {
  const db = useStore();
  const activeId = db.activeEventId;
  const list = db.reservations
    .filter((r) => r.eventId === activeId)
    .sort((a, b) => Number(a.status === "arrived") - Number(b.status === "arrived"));
  const tables = db.tables.filter((t) => t.eventId === activeId).sort((a, b) => a.number - b.number);
  const [seatingId, setSeatingId] = useState<string | null>(null);

  const seat = (resId: string, tableId: string) => {
    const res = db.reservations.find((r) => r.id === resId);
    if (!res) return;
    // free up previous table
    if (res.tableId) store.updateTable(res.tableId, { status: "free" });
    store.updateReservation(resId, { status: "arrived", tableId });
    store.updateTable(tableId, { status: "seated" });
    setSeatingId(null);
  };

  const markLeft = (resId: string) => {
    const res = db.reservations.find((r) => r.id === resId);
    if (!res) return;
    if (res.tableId) store.updateTable(res.tableId, { status: "free" });
    store.updateReservation(resId, { status: "left", tableId: undefined });
  };

  return (
    <div className="max-w-[650px] mx-auto px-4 py-6 text-foreground">
      <h2 className="font-display text-4xl md:text-[42px] mb-6 text-center" style={{ WebkitTextStroke: '0.5px currentColor' }}>
        Dinner Club
      </h2>
      <p className="text-xs uppercase tracking-wider opacity-60 mb-4 font-body">Reservaties</p>

      {list.map((r) => {
        const table = tables.find((t) => t.id === r.tableId);
        const isSeating = seatingId === r.id;
        return (
          <div key={r.id} className="border border-foreground/15 rounded-lg p-3 bg-background/50 mb-3">
            <div className="flex justify-between items-baseline">
              <p className="font-body font-medium">{r.name}</p>
              <span className="text-xs opacity-60">{r.partySize} pers.</span>
            </div>
            <p className="text-xs opacity-60 font-body">
              {table ? `Tafel ${table.number}` : "Nog geen tafel"} · {r.status}
            </p>
            {(r.allergies || r.diet || r.winePairing) && (
              <div className="mt-1 flex flex-wrap gap-1 text-[11px]">
                {r.allergies && <span className="bg-red-50 text-red-700 px-1.5 py-0.5 rounded">⚠ {r.allergies}</span>}
                {r.diet && <span className="bg-green-50 text-green-700 px-1.5 py-0.5 rounded">{r.diet}</span>}
                {r.winePairing && <span className="bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded">wine</span>}
              </div>
            )}

            <div className="mt-3 flex flex-wrap gap-2">
              {r.status !== "arrived" && (
                <button
                  onClick={() => setSeatingId(isSeating ? null : r.id)}
                  className="text-xs font-body px-3 py-1.5 rounded border border-foreground/30 hover:bg-[hsl(24_75%_78%)]/30"
                >
                  {isSeating ? "Annuleren" : "Arriveert → zet aan tafel"}
                </button>
              )}
              {r.status === "arrived" && (
                <>
                  <button
                    onClick={() => setSeatingId(isSeating ? null : r.id)}
                    className="text-xs font-body px-3 py-1.5 rounded border border-foreground/30 hover:bg-[hsl(24_75%_78%)]/30"
                  >
                    Andere tafel
                  </button>
                  <button
                    onClick={() => markLeft(r.id)}
                    className="text-xs font-body px-3 py-1.5 rounded border border-foreground/20 opacity-70 hover:opacity-100"
                  >
                    Vertrokken
                  </button>
                </>
              )}
            </div>

            {isSeating && (
              <div className="mt-3 grid grid-cols-4 sm:grid-cols-6 gap-2">
                {tables.map((t) => {
                  const occupant = db.reservations.find(
                    (x) => x.tableId === t.id && x.status === "arrived" && x.id !== r.id,
                  );
                  return (
                    <button
                      key={t.id}
                      onClick={() => seat(r.id, t.id)}
                      disabled={!!occupant}
                      className={`font-display text-xl py-2 rounded border transition ${
                        occupant
                          ? "border-foreground/10 opacity-30 cursor-not-allowed"
                          : "border-foreground/30 hover:bg-[hsl(24_75%_78%)]/40"
                      }`}
                      title={occupant ? `Bezet door ${occupant.name}` : ""}
                    >
                      T{t.number}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
      {list.length === 0 && <p className="text-sm opacity-50 font-body">Geen reservaties.</p>}
    </div>
  );
}
