import { useMemo, useState } from "react";
import { store, useStore, type Reservation, type ReservationStatus } from "../store";

const emptyDraft: Omit<Reservation, "id" | "createdAt" | "eventId"> = {
  name: "",
  email: "",
  phone: "",
  partySize: 2,
  allergies: "",
  diet: "",
  winePairing: false,
  notes: "",
  status: "expected",
};

export default function AdminReservations() {
  const db = useStore();
  const activeId = db.activeEventId;
  const reservations = useMemo(
    () => db.reservations.filter((r) => r.eventId === activeId),
    [db.reservations, activeId],
  );
  const tables = db.tables.filter((t) => t.eventId === activeId);
  const [openId, setOpenId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState(emptyDraft);

  if (!activeId) return <p className="text-neutral-500">Selecteer eerst een event.</p>;
  const open = reservations.find((r) => r.id === openId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-2xl">Reservaties</h2>
        <button onClick={() => setAdding(true)} className="text-sm bg-neutral-900 text-white px-3 py-1.5 rounded hover:bg-neutral-700">
          + Handmatig toevoegen
        </button>
      </div>

      <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-neutral-500 text-xs uppercase tracking-wider">
            <tr>
              <th className="text-left px-4 py-3">Naam</th>
              <th className="text-left px-4 py-3">Pers.</th>
              <th className="text-left px-4 py-3">Allergieën / dieet</th>
              <th className="text-left px-4 py-3">Wijn</th>
              <th className="text-left px-4 py-3">Tafel</th>
              <th className="text-left px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((r) => (
              <tr key={r.id} className="border-t border-neutral-100 hover:bg-neutral-50 cursor-pointer"
                  onClick={() => setOpenId(r.id)}>
                <td className="px-4 py-3 font-medium">{r.name}</td>
                <td className="px-4 py-3">{r.partySize}</td>
                <td className="px-4 py-3 text-xs text-neutral-600">
                  {[r.allergies, r.diet].filter(Boolean).join(" · ") || "—"}
                </td>
                <td className="px-4 py-3">{r.winePairing ? "✓" : "—"}</td>
                <td className="px-4 py-3">
                  <select
                    value={r.tableId ?? ""}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => store.updateReservation(r.id, { tableId: e.target.value || undefined })}
                    className="bg-neutral-50 border border-neutral-200 rounded px-2 py-1 text-xs"
                  >
                    <option value="">—</option>
                    {tables.map((t) => (
                      <option key={t.id} value={t.id}>Tafel {t.number}</option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3">
                  <select
                    value={r.status}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => store.updateReservation(r.id, { status: e.target.value as ReservationStatus })}
                    className="bg-neutral-50 border border-neutral-200 rounded px-2 py-1 text-xs"
                  >
                    <option value="expected">Verwacht</option>
                    <option value="arrived">Aangekomen</option>
                    <option value="left">Vertrokken</option>
                  </select>
                </td>
              </tr>
            ))}
            {reservations.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-neutral-400">Nog geen reservaties voor dit event.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/50 z-30 flex items-center justify-center p-4" onClick={() => setOpenId(null)}>
          <div className="bg-white rounded-lg max-w-lg w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-serif text-xl mb-3">{open.name}</h3>
            <dl className="text-sm grid grid-cols-3 gap-y-2">
              <dt className="text-neutral-500">E-mail</dt><dd className="col-span-2">{open.email}</dd>
              <dt className="text-neutral-500">Telefoon</dt><dd className="col-span-2">{open.phone}</dd>
              <dt className="text-neutral-500">Personen</dt><dd className="col-span-2">{open.partySize}</dd>
              <dt className="text-neutral-500">Allergieën</dt><dd className="col-span-2">{open.allergies || "—"}</dd>
              <dt className="text-neutral-500">Dieet</dt><dd className="col-span-2">{open.diet || "—"}</dd>
              <dt className="text-neutral-500">Wine pairing</dt><dd className="col-span-2">{open.winePairing ? "Ja" : "Nee"}</dd>
              <dt className="text-neutral-500">Opmerkingen</dt><dd className="col-span-2">{open.notes || "—"}</dd>
            </dl>
            <div className="mt-5 text-right">
              <button onClick={() => setOpenId(null)} className="text-sm text-neutral-600 hover:text-neutral-900">Sluiten</button>
            </div>
          </div>
        </div>
      )}

      {adding && (
        <div className="fixed inset-0 bg-black/50 z-30 flex items-center justify-center p-4" onClick={() => setAdding(false)}>
          <form onClick={(e) => e.stopPropagation()} onSubmit={(e) => { e.preventDefault(); store.addReservation({ ...draft, eventId: activeId }); setAdding(false); setDraft(emptyDraft); }}
                className="bg-white rounded-lg max-w-lg w-full p-6 space-y-3">
            <h3 className="font-serif text-xl mb-2">Nieuwe reservatie</h3>
            <input required placeholder="Naam" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} className="w-full px-3 py-2 border rounded text-sm" />
            <input type="email" placeholder="E-mail" value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} className="w-full px-3 py-2 border rounded text-sm" />
            <input placeholder="Telefoon" value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} className="w-full px-3 py-2 border rounded text-sm" />
            <input type="number" min={1} placeholder="Aantal pers." value={draft.partySize} onChange={(e) => setDraft({ ...draft, partySize: parseInt(e.target.value) || 1 })} className="w-full px-3 py-2 border rounded text-sm" />
            <input placeholder="Allergieën" value={draft.allergies} onChange={(e) => setDraft({ ...draft, allergies: e.target.value })} className="w-full px-3 py-2 border rounded text-sm" />
            <input placeholder="Dieet" value={draft.diet} onChange={(e) => setDraft({ ...draft, diet: e.target.value })} className="w-full px-3 py-2 border rounded text-sm" />
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={draft.winePairing} onChange={(e) => setDraft({ ...draft, winePairing: e.target.checked })} /> Wine pairing</label>
            <textarea placeholder="Opmerkingen" value={draft.notes} onChange={(e) => setDraft({ ...draft, notes: e.target.value })} className="w-full px-3 py-2 border rounded text-sm" />
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={() => setAdding(false)} className="text-sm text-neutral-600 px-3 py-2">Annuleren</button>
              <button type="submit" className="text-sm bg-neutral-900 text-white px-3 py-2 rounded">Toevoegen</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
