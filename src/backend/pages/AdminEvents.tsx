import { useState } from "react";
import { store, useStore, type EventStatus } from "../store";

const empty = {
  name: "",
  date: new Date().toISOString().slice(0, 10),
  status: "planned" as EventStatus,
  tableCount: 6,
  notes: "",
};

export default function AdminEvents() {
  const db = useStore();
  const [draft, setDraft] = useState(empty);
  const [editingId, setEditingId] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      store.updateEvent(editingId, draft);
      setEditingId(null);
    } else {
      const created = store.addEvent(draft);
      store.setActiveEvent(created.id);
    }
    setDraft(empty);
  };

  return (
    <div className="space-y-8">
      <section>
        <h2 className="font-serif text-2xl mb-4">Events</h2>
        <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 text-neutral-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="text-left px-4 py-3">Naam</th>
                <th className="text-left px-4 py-3">Datum</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Tafels</th>
                <th className="text-left px-4 py-3">Actief</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {db.events.map((e) => (
                <tr key={e.id} className="border-t border-neutral-100">
                  <td className="px-4 py-3 font-medium">{e.name}</td>
                  <td className="px-4 py-3">{e.date}</td>
                  <td className="px-4 py-3">
                    <select
                      value={e.status}
                      onChange={(ev) => store.updateEvent(e.id, { status: ev.target.value as EventStatus })}
                      className="bg-neutral-50 border border-neutral-200 rounded px-2 py-1 text-xs"
                    >
                      <option value="planned">Gepland</option>
                      <option value="active">Actief</option>
                      <option value="done">Afgelopen</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">{e.tableCount}</td>
                  <td className="px-4 py-3">
                    {db.activeEventId === e.id ? (
                      <span className="text-xs bg-neutral-900 text-white px-2 py-0.5 rounded">actief</span>
                    ) : (
                      <button
                        onClick={() => store.setActiveEvent(e.id)}
                        className="text-xs text-neutral-600 hover:text-neutral-900 underline"
                      >
                        activeer
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button
                      onClick={() => {
                        setEditingId(e.id);
                        setDraft({ name: e.name, date: e.date, status: e.status, tableCount: e.tableCount, notes: e.notes });
                      }}
                      className="text-xs text-neutral-600 hover:text-neutral-900"
                    >
                      bewerken
                    </button>
                    <button
                      onClick={() => confirm(`Verwijder ${e.name}?`) && store.deleteEvent(e.id)}
                      className="text-xs text-red-600 hover:text-red-800"
                    >
                      verwijderen
                    </button>
                  </td>
                </tr>
              ))}
              {db.events.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-neutral-400">Nog geen events.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h3 className="font-serif text-xl mb-3">{editingId ? "Event bewerken" : "Nieuw event"}</h3>
        <form onSubmit={submit} className="bg-white border border-neutral-200 rounded-lg p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="text-sm space-y-1">
            <span className="text-neutral-600">Naam</span>
            <input required value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              className="w-full px-3 py-2 border border-neutral-300 rounded" />
          </label>
          <label className="text-sm space-y-1">
            <span className="text-neutral-600">Datum</span>
            <input type="date" required value={draft.date} onChange={(e) => setDraft({ ...draft, date: e.target.value })}
              className="w-full px-3 py-2 border border-neutral-300 rounded" />
          </label>
          <label className="text-sm space-y-1">
            <span className="text-neutral-600">Status</span>
            <select value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value as EventStatus })}
              className="w-full px-3 py-2 border border-neutral-300 rounded">
              <option value="planned">Gepland</option>
              <option value="active">Actief</option>
              <option value="done">Afgelopen</option>
            </select>
          </label>
          <label className="text-sm space-y-1">
            <span className="text-neutral-600">Aantal tafels</span>
            <input type="number" min={1} required value={draft.tableCount}
              onChange={(e) => setDraft({ ...draft, tableCount: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-neutral-300 rounded" />
          </label>
          <label className="text-sm space-y-1 md:col-span-2">
            <span className="text-neutral-600">Opmerkingen</span>
            <textarea value={draft.notes} onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
              className="w-full px-3 py-2 border border-neutral-300 rounded" rows={2} />
          </label>
          <div className="md:col-span-2 flex gap-2">
            <button type="submit" className="bg-neutral-900 text-white px-4 py-2 rounded text-sm hover:bg-neutral-700">
              {editingId ? "Opslaan" : "Event aanmaken"}
            </button>
            {editingId && (
              <button type="button" onClick={() => { setEditingId(null); setDraft(empty); }}
                className="px-4 py-2 rounded text-sm text-neutral-600 hover:text-neutral-900">
                Annuleren
              </button>
            )}
          </div>
        </form>
      </section>
    </div>
  );
}
