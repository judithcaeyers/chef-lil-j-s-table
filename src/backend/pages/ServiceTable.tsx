import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { store, useStore, tableTotal, type OrderItem } from "../store";

export default function ServiceTable() {
  const { tableId = "" } = useParams();
  const navigate = useNavigate();
  const db = useStore();
  const table = db.tables.find((t) => t.id === tableId);
  const reservation = db.reservations.find((r) => r.tableId === tableId);
  const drinks = useMemo(
    () => db.drinks.filter((d) => d.eventId === table?.eventId && d.available),
    [db.drinks, table?.eventId],
  );
  const orders = db.orders.filter((o) => o.tableId === tableId).sort((a, b) => b.createdAt - a.createdAt);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [note, setNote] = useState("");
  const [showCheckout, setShowCheckout] = useState(false);

  if (!table) return <p className="text-center text-foreground opacity-60">Tafel niet gevonden.</p>;

  const addToCart = (id: string, delta: number) => {
    setCart((c) => {
      const next = { ...c, [id]: Math.max(0, (c[id] || 0) + delta) };
      if (next[id] === 0) delete next[id];
      return next;
    });
  };

  const send = () => {
    const items: OrderItem[] = Object.entries(cart).map(([drinkId, qty]) => {
      const d = drinks.find((x) => x.id === drinkId)!;
      return { drinkId, name: d.name, price: d.price, qty };
    });
    if (items.length === 0) return;
    store.addOrder({ eventId: table.eventId, tableId: table.id, items, note });
    if (table.status === "free") store.updateTable(table.id, { status: "seated" });
    setCart({});
    setNote("");
  };

  const cartTotal = Object.entries(cart).reduce((s, [id, qty]) => {
    const d = drinks.find((x) => x.id === id);
    return s + (d?.price ?? 0) * qty;
  }, 0);

  const total = tableTotal(table.eventId, table.id);
  const byCat: Record<string, typeof drinks> = {};
  drinks.forEach((d) => { (byCat[d.category] ??= []).push(d); });

  return (
    <div className="space-y-5 pb-32">
      <div className="flex items-center gap-3">
        <Link to="/backend/service/tables" className="text-sm text-neutral-600">← Tafels</Link>
        <h2 className="font-serif text-2xl">Tafel {table.number}</h2>
      </div>

      {reservation ? (
        <div className="bg-white border border-neutral-200 rounded-lg p-4">
          <div className="flex items-baseline justify-between">
            <p className="font-medium">{reservation.name}</p>
            <span className="text-xs text-neutral-500">{reservation.partySize} pers.</span>
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5 text-xs">
            {reservation.allergies && <span className="bg-red-50 text-red-700 px-2 py-0.5 rounded">⚠ allergie: {reservation.allergies}</span>}
            {reservation.diet && <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded">{reservation.diet}</span>}
            {reservation.winePairing && <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded">wine pairing</span>}
          </div>
          {reservation.notes && <p className="mt-2 text-xs text-neutral-500">“{reservation.notes}”</p>}
        </div>
      ) : (
        <p className="text-sm text-neutral-500">Geen reservatie gekoppeld aan deze tafel.</p>
      )}

      <section>
        <h3 className="text-sm font-medium text-neutral-500 uppercase tracking-wider mb-2">Bestelling toevoegen</h3>
        {Object.entries(byCat).map(([cat, list]) => (
          <div key={cat} className="mb-4">
            <p className="text-xs uppercase text-neutral-400 mb-1">{cat}</p>
            <div className="grid grid-cols-1 gap-2">
              {list.map((d) => {
                const qty = cart[d.id] || 0;
                return (
                  <div key={d.id} className="bg-white border border-neutral-200 rounded-lg p-3 flex items-center gap-3">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{d.name}</p>
                      <p className="text-xs text-neutral-500">€ {d.price.toFixed(2)}</p>
                    </div>
                    <button onClick={() => addToCart(d.id, -1)} disabled={!qty}
                            className="w-10 h-10 rounded-full border border-neutral-300 text-lg disabled:opacity-30">−</button>
                    <span className="w-6 text-center">{qty}</span>
                    <button onClick={() => addToCart(d.id, 1)}
                            className="w-10 h-10 rounded-full bg-neutral-900 text-white text-lg">+</button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        {drinks.length === 0 && <p className="text-sm text-neutral-400">Geen dranken beschikbaar.</p>}
      </section>

      <section>
        <h3 className="text-sm font-medium text-neutral-500 uppercase tracking-wider mb-2">Eerdere bestellingen</h3>
        <div className="space-y-2">
          {orders.map((o) => (
            <div key={o.id} className="bg-white border border-neutral-200 rounded-lg p-3 text-sm">
              <div className="flex justify-between text-xs text-neutral-500">
                <span>{new Date(o.createdAt).toLocaleTimeString("nl-BE", { hour: "2-digit", minute: "2-digit" })}</span>
                <span className={o.status === "new" ? "text-amber-700" : "text-emerald-700"}>
                  {o.status === "new" ? "open" : "afgewerkt"}
                </span>
              </div>
              <ul className="mt-1">
                {o.items.map((i) => <li key={i.drinkId}>{i.qty}× {i.name}</li>)}
              </ul>
              {o.note && <p className="text-xs text-neutral-500 mt-1">“{o.note}”</p>}
            </div>
          ))}
          {orders.length === 0 && <p className="text-xs text-neutral-400">Nog geen bestellingen.</p>}
        </div>
      </section>

      {Object.keys(cart).length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 p-3 z-20">
          <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Opmerking (optioneel)"
                 className="w-full px-3 py-2 border border-neutral-200 rounded text-sm mb-2" />
          <button onClick={send} className="w-full bg-neutral-900 text-white py-3 rounded-lg text-sm font-medium">
            Versturen naar bar — € {cartTotal.toFixed(2)}
          </button>
        </div>
      )}

      {Object.keys(cart).length === 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 p-3 z-20 flex items-center gap-3">
          <div className="flex-1 text-sm">
            <p className="text-xs text-neutral-500">Totaal tafel</p>
            <p className="font-medium">€ {total.toFixed(2)}</p>
          </div>
          <button onClick={() => setShowCheckout(true)} className="bg-neutral-900 text-white py-3 px-5 rounded-lg text-sm font-medium">
            Afrekenen
          </button>
        </div>
      )}

      {showCheckout && (
        <Checkout tableId={table.id} eventId={table.eventId} onClose={() => setShowCheckout(false)} />
      )}
    </div>
  );
}

function Checkout({ tableId, eventId, onClose }: { tableId: string; eventId: string; onClose: () => void }) {
  const db = useStore();
  const reservation = db.reservations.find((r) => r.tableId === tableId);
  const orders = db.orders.filter((o) => o.tableId === tableId);

  // aggregate
  const agg = new Map<string, { name: string; price: number; qty: number }>();
  orders.forEach((o) => o.items.forEach((i) => {
    const cur = agg.get(i.drinkId) ?? { name: i.name, price: i.price, qty: 0 };
    cur.qty += i.qty;
    agg.set(i.drinkId, cur);
  }));
  const lines = Array.from(agg.values());
  const total = lines.reduce((s, l) => s + l.price * l.qty, 0);

  const existing = db.payments.find((p) => p.tableId === tableId && p.status === "pending");
  const [link, setLink] = useState<string | null>(existing?.link ?? null);

  const generate = () => {
    // mock: een nette betaal-URL. In productie wordt dit een echte Stripe Checkout link
    // gegenereerd door je backend-functie met je live secret key.
    const fake = `https://buy.stripe.com/mock/${tableId.slice(0, 6)}?amount=${Math.round(total * 100)}`;
    if (existing) {
      store.updatePayment(existing.id, { amount: total, link: fake });
    } else {
      store.addPayment({ eventId, tableId, amount: total, status: "pending", link: fake });
    }
    setLink(fake);
  };

  const markPaid = () => {
    const pay = db.payments.find((p) => p.tableId === tableId && p.status === "pending");
    if (pay) store.updatePayment(pay.id, { status: "paid" });
    store.updateTable(tableId, { status: "paid" });
    if (reservation) store.updateReservation(reservation.id, { status: "left" });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-40 flex items-end sm:items-center justify-center p-3" onClick={onClose}>
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-md p-5" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-serif text-xl mb-3">Afrekening</h3>
        <div className="space-y-1 text-sm">
          {lines.map((l) => (
            <div key={l.name} className="flex justify-between">
              <span>{l.qty}× {l.name}</span>
              <span className="tabular-nums">€ {(l.price * l.qty).toFixed(2)}</span>
            </div>
          ))}
          {lines.length === 0 && <p className="text-neutral-400">Geen verbruik geregistreerd.</p>}
        </div>
        <div className="flex justify-between border-t border-neutral-200 mt-3 pt-3 font-medium">
          <span>Totaal</span><span className="tabular-nums">€ {total.toFixed(2)}</span>
        </div>

        {!link && total > 0 && (
          <button onClick={generate} className="mt-4 w-full bg-neutral-900 text-white py-3 rounded-lg text-sm">
            Stripe-betaallink genereren
          </button>
        )}

        {link && (
          <div className="mt-4 space-y-3">
            <div className="bg-neutral-50 border border-neutral-200 rounded p-3 text-xs break-all">{link}</div>
            <img
              alt="QR"
              src={`https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(link)}`}
              className="mx-auto rounded border border-neutral-200"
            />
            <div className="grid grid-cols-2 gap-2">
              <a
                href={`mailto:${reservation?.email ?? ""}?subject=${encodeURIComponent("Afrekening Dinner Club")}&body=${encodeURIComponent(`Bedankt voor uw bezoek. Afrekening: ${link}`)}`}
                className="text-center text-sm border border-neutral-300 py-2 rounded"
              >
                Mail link
              </a>
              <button onClick={markPaid} className="text-sm bg-emerald-600 text-white py-2 rounded">
                Markeer betaald
              </button>
            </div>
          </div>
        )}

        <button onClick={onClose} className="mt-4 w-full text-sm text-neutral-500">Sluiten</button>
      </div>
    </div>
  );
}
