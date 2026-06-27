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
    <div className="text-foreground">
      <h2 className="font-display text-5xl mb-5 text-center" style={{ WebkitTextStroke: '0.5px currentColor' }}>
        Reservaties
      </h2>

      <div className="space-y-3">
        {list.map((r) => {
          const table = tables.find((t) => t.id === r.tableId);
          const isSeating = seatingId === r.id;
          const arrived = r.status === "arrived";
          return (
            <div key={r.id} className={`border-2 rounded-xl p-4 ${
              arrived ? "border-foreground/15 bg-background/40 opacity-80" : "border-foreground/30 bg-background/70"
            }`}>
              <div className="flex justify-between items-baseline gap-2">
                <p className="font-body text-lg font-semibold leading-tight">{r.name}</p>
                <span className="text-base font-medium opacity-70 whitespace-nowrap">{r.partySize} pers.</span>
              </div>
              <p className="text-sm opacity-70 font-body mt-0.5">
                {table ? `Tafel ${table.number}` : "Nog geen tafel"} · {r.status}
              </p>
              {(r.allergies || r.diet || r.winePairing) && (
                <p className="mt-1.5 text-[13px] opacity-80">
                  {[r.allergies && `⚠ ${r.allergies}`, r.diet, r.winePairing && "wine"]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              )}

              <div className="mt-3 flex flex-wrap gap-2">
                {!arrived && (
                  <button
                    onClick={() => setSeatingId(isSeating ? null : r.id)}
                    className="text-base font-body font-semibold px-4 py-2.5 rounded-lg border-2 border-foreground bg-foreground text-background active:scale-95"
                  >
                    {isSeating ? "Annuleren" : "Arriveert → tafel"}
                  </button>
                )}
                {arrived && (
                  <>
                    <button
                      onClick={() => setSeatingId(isSeating ? null : r.id)}
                      className="text-base font-body px-4 py-2.5 rounded-lg border-2 border-foreground/30 active:scale-95"
                    >
                      Andere tafel
                    </button>
                    <button
                      onClick={() => markLeft(r.id)}
                      className="text-base font-body px-4 py-2.5 rounded-lg border-2 border-foreground/20 opacity-70"
                    >
                      Vertrokken
                    </button>
                  </>
                )}
              </div>

              {isSeating && (
                <div className="mt-3 grid grid-cols-4 gap-2">
                  {tables.map((t) => {
                    const occupant = db.reservations.find(
                      (x) => x.tableId === t.id && x.status === "arrived" && x.id !== r.id,
                    );
                    return (
                      <button
                        key={t.id}
                        onClick={() => seat(r.id, t.id)}
                        disabled={!!occupant}
                        className={`font-display text-2xl py-3 rounded-lg border-2 transition active:scale-95 ${
                          occupant
                            ? "border-foreground/10 opacity-30 cursor-not-allowed"
                            : "border-foreground/30 bg-background hover:bg-[hsl(24_75%_78%)]/40"
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
      </div>
      {list.length === 0 && <p className="text-center opacity-50 font-body mt-10">Geen reservaties.</p>}
    </div>
  );
}
