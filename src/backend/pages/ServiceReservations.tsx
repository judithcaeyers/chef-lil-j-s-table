import { useStore } from "../store";

// Simpel hergebruik van de admin reservatielijst, maar read-mostly voor de ober.
export default function ServiceReservations() {
  const db = useStore();
  const activeId = db.activeEventId;
  const list = db.reservations.filter((r) => r.eventId === activeId);
  const tables = db.tables.filter((t) => t.eventId === activeId);

  return (
    <div className="max-w-[650px] mx-auto px-4 py-6 text-foreground">
      <h2 className="font-display text-4xl md:text-[42px] mb-6" style={{ WebkitTextStroke: '0.5px currentColor' }}>
        Reservaties
      </h2>
      {list.map((r) => {
        const table = tables.find((t) => t.id === r.tableId);
        return (
          <div key={r.id} className="border border-foreground/15 rounded-lg p-3 bg-background/50 mb-3">
            <div className="flex justify-between items-baseline">
              <p className="font-body font-medium">{r.name}</p>
              <span className="text-xs opacity-60">{r.partySize} pers.</span>
            </div>
            <p className="text-xs opacity-60 font-body">{table ? `Tafel ${table.number}` : "Geen tafel"} · {r.status}</p>
            <div className="mt-1 flex flex-wrap gap-1 text-[11px]">
              {r.allergies && <span className="bg-red-50 text-red-700 px-1.5 py-0.5 rounded">⚠ {r.allergies}</span>}
              {r.diet && <span className="bg-green-50 text-green-700 px-1.5 py-0.5 rounded">{r.diet}</span>}
              {r.winePairing && <span className="bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded">wine</span>}
            </div>
          </div>
        );
      })}
      {list.length === 0 && <p className="text-sm opacity-50 font-body">Geen reservaties.</p>}
    </div>
  );
}
