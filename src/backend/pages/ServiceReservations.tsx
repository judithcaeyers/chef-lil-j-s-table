import { useStore } from "../store";

// Simpel hergebruik van de admin reservatielijst, maar read-mostly voor de ober.
export default function ServiceReservations() {
  const db = useStore();
  const activeId = db.activeEventId;
  const list = db.reservations.filter((r) => r.eventId === activeId);
  const tables = db.tables.filter((t) => t.eventId === activeId);

  return (
    <div className="space-y-3">
      <h2 className="font-serif text-2xl">Reservaties</h2>
      {list.map((r) => {
        const table = tables.find((t) => t.id === r.tableId);
        return (
          <div key={r.id} className="bg-white border border-neutral-200 rounded-lg p-3">
            <div className="flex justify-between items-baseline">
              <p className="font-medium">{r.name}</p>
              <span className="text-xs text-neutral-500">{r.partySize} pers.</span>
            </div>
            <p className="text-xs text-neutral-500">{table ? `Tafel ${table.number}` : "Geen tafel"} · {r.status}</p>
            <div className="mt-1 flex flex-wrap gap-1 text-[11px]">
              {r.allergies && <span className="bg-red-50 text-red-700 px-1.5 py-0.5 rounded">⚠ {r.allergies}</span>}
              {r.diet && <span className="bg-green-50 text-green-700 px-1.5 py-0.5 rounded">{r.diet}</span>}
              {r.winePairing && <span className="bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded">wine</span>}
            </div>
          </div>
        );
      })}
      {list.length === 0 && <p className="text-sm text-neutral-400">Geen reservaties.</p>}
    </div>
  );
}
