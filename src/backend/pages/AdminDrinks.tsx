import { useState } from "react";
import { store, useStore, type Drink, type DrinkCategory } from "../store";

const cats: DrinkCategory[] = ["frisdrank", "bier", "wijn", "water", "kombucha", "aperitief", "ander"];
const empty: Omit<Drink, "id" | "eventId"> = { name: "", category: "frisdrank", price: 0, available: true };

export default function AdminDrinks() {
  const db = useStore();
  const activeId = db.activeEventId;
  const [draft, setDraft] = useState(empty);

  if (!activeId) return <p className="text-neutral-500">Selecteer eerst een event.</p>;
  const drinks = db.drinks.filter((d) => d.eventId === activeId);

  return (
    <div className="space-y-6">
      <h2 className="font-serif text-2xl">Drankkaart</h2>

      <form onSubmit={(e) => { e.preventDefault(); store.addDrink({ ...draft, eventId: activeId }); setDraft(empty); }}
            className="bg-white border border-neutral-200 rounded-lg p-4 grid grid-cols-2 md:grid-cols-5 gap-2 items-end">
        <label className="text-xs space-y-1 md:col-span-2">
          <span className="text-neutral-500">Naam</span>
          <input required value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} className="w-full px-3 py-2 border rounded text-sm" />
        </label>
        <label className="text-xs space-y-1">
          <span className="text-neutral-500">Categorie</span>
          <select value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value as DrinkCategory })} className="w-full px-3 py-2 border rounded text-sm capitalize">
            {cats.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>
        <label className="text-xs space-y-1">
          <span className="text-neutral-500">Prijs (€)</span>
          <input type="number" step="0.5" min={0} required value={draft.price} onChange={(e) => setDraft({ ...draft, price: parseFloat(e.target.value) || 0 })} className="w-full px-3 py-2 border rounded text-sm" />
        </label>
        <button type="submit" className="bg-neutral-900 text-white py-2 rounded text-sm hover:bg-neutral-700">Toevoegen</button>
      </form>

      <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-neutral-500 text-xs uppercase tracking-wider">
            <tr>
              <th className="text-left px-4 py-3">Naam</th>
              <th className="text-left px-4 py-3">Categorie</th>
              <th className="text-left px-4 py-3">Prijs</th>
              <th className="text-left px-4 py-3">Beschikbaar</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {drinks.map((d) => (
              <tr key={d.id} className="border-t border-neutral-100">
                <td className="px-4 py-2">
                  <input value={d.name} onChange={(e) => store.updateDrink(d.id, { name: e.target.value })} className="bg-transparent w-full" />
                </td>
                <td className="px-4 py-2">
                  <select value={d.category} onChange={(e) => store.updateDrink(d.id, { category: e.target.value as DrinkCategory })}
                          className="bg-transparent text-xs capitalize">
                    {cats.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </td>
                <td className="px-4 py-2">
                  <input type="number" step="0.5" value={d.price} onChange={(e) => store.updateDrink(d.id, { price: parseFloat(e.target.value) || 0 })}
                         className="bg-transparent w-20" />
                </td>
                <td className="px-4 py-2">
                  <input type="checkbox" checked={d.available} onChange={(e) => store.updateDrink(d.id, { available: e.target.checked })} />
                </td>
                <td className="px-4 py-2 text-right">
                  <button onClick={() => store.deleteDrink(d.id)} className="text-xs text-red-600 hover:text-red-800">verwijder</button>
                </td>
              </tr>
            ))}
            {drinks.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-neutral-400">Nog geen dranken.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
