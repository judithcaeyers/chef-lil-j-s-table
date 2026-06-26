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
    navigate("/backend/service/tables");
  };

  const cartTotal = Object.entries(cart).reduce((s, [id, qty]) => {
    const d = drinks.find((x) => x.id === id);
    return s + (d?.price ?? 0) * qty;
  }, 0);

  const total = tableTotal(table.eventId, table.id);
  const byCat: Record<string, typeof drinks> = {};
  drinks.forEach((d) => { (byCat[d.category] ??= []).push(d); });

  return (
    <div className="max-w-[650px] mx-auto px-4 py-6 pb-32 text-foreground">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/backend/service/tables" className="font-body text-sm opacity-60 hover:opacity-100 underline underline-offset-4 transition-opacity">
          ← Tafels
        </Link>
        <h2 className="font-display text-4xl md:text-[42px]" style={{ WebkitTextStroke: '0.5px currentColor' }}>
          Tafel {table.number}
        </h2>
      </div>

      {reservation ? (
        <div className="border border-foreground/15 rounded-lg p-4 bg-background/50 mb-8">
          <div className="flex items-baseline justify-between">
            <p className="font-body text-base font-medium">{reservation.name}</p>
            <span className="text-xs opacity-60">{reservation.partySize} pers.</span>
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5 text-xs">
            {reservation.allergies && <span className="bg-red-50 text-red-700 px-2 py-0.5 rounded">⚠ allergie: {reservation.allergies}</span>}
            {reservation.diet && <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded">{reservation.diet}</span>}
            {reservation.winePairing && <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded">wine pairing</span>}
          </div>
          {reservation.notes && <p className="mt-2 text-xs opacity-60">“{reservation.notes}”</p>}
        </div>
      ) : (
        <p className="text-sm opacity-60 mb-8">Geen reservatie gekoppeld aan deze tafel.</p>
      )}

      <section className="mb-10">
        <h3 className="font-display text-3xl mb-4">Bestelling toevoegen</h3>
        {Object.entries(byCat).map(([cat, list]) => (
          <div key={cat} className="mb-6">
            <p className="text-xs uppercase tracking-[2px] opacity-50 mb-2">{cat}</p>
            <div className="grid grid-cols-1 gap-2">
              {list.map((d) => {
                const qty = cart[d.id] || 0;
                return (
                  <div key={d.id} className="border border-foreground/15 rounded-lg p-3 flex items-center gap-3 bg-background/50">
                    <div className="flex-1">
                      <p className="font-body text-sm font-medium">{d.name}</p>
                      <p className="text-xs opacity-60">€ {d.price.toFixed(2)}</p>
                    </div>
                    <button onClick={() => addToCart(d.id, -1)} disabled={!qty}
                            className="w-10 h-10 rounded-full border border-foreground/30 text-lg disabled:opacity-30 hover:bg-[hsl(24_75%_78%)] hover:border-[hsl(24_75%_78%)] transition-colors">−</button>
                    <span className="w-6 text-center font-body">{qty}</span>
                    <button onClick={() => addToCart(d.id, 1)}
                            className="w-10 h-10 rounded-full border border-foreground bg-foreground text-background text-lg hover:bg-[hsl(24_75%_78%)] hover:border-[hsl(24_75%_78%)] hover:text-foreground transition-colors">+</button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        {drinks.length === 0 && <p className="text-sm opacity-50">Geen dranken beschikbaar.</p>}
      </section>

      <section>
        <h3 className="font-display text-3xl mb-4">Eerdere bestellingen</h3>
        <div className="space-y-2">
          {orders.map((o) => (
            <div key={o.id} className="border border-foreground/15 rounded-lg p-3 text-sm bg-background/50">
              <div className="flex justify-between text-xs opacity-60">
                <span>{new Date(o.createdAt).toLocaleTimeString("nl-BE", { hour: "2-digit", minute: "2-digit" })}</span>
                <span className={o.status === "new" ? "text-amber-700" : "text-emerald-700"}>
                  {o.status === "new" ? "open" : "afgewerkt"}
                </span>
              </div>
              <ul className="mt-1 font-body">
                {o.items.map((i) => <li key={i.drinkId}>{i.qty}× {i.name}</li>)}
              </ul>
              {o.note && <p className="text-xs opacity-60 mt-1">“{o.note}”</p>}
            </div>
          ))}
          {orders.length === 0 && <p className="text-xs opacity-50">Nog geen bestellingen.</p>}
        </div>
      </section>

      {Object.keys(cart).length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-foreground/15 p-3 z-20">
          <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Opmerking (optioneel)"
                 className="w-full px-3 py-2 border border-foreground/15 rounded text-sm bg-transparent focus:outline-none focus:border-foreground/50 mb-2" />
          <button onClick={send} className="w-full border border-foreground bg-foreground text-background py-3 rounded-lg text-sm font-body tracking-[1px] hover:bg-[hsl(24_75%_78%)] hover:border-[hsl(24_75%_78%)] hover:text-foreground transition-colors">
            Versturen naar bar — € {cartTotal.toFixed(2)}
          </button>
        </div>
      )}

      {Object.keys(cart).length === 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-foreground/15 p-3 z-20 flex items-center gap-3">
          <div className="flex-1 text-sm font-body">
            <p className="text-xs opacity-60">Totaal tafel</p>
            <p className="font-medium">€ {total.toFixed(2)}</p>
          </div>
          <button onClick={() => setShowCheckout(true)} className="border border-foreground bg-foreground text-background py-3 px-5 rounded-lg text-sm font-body tracking-[1px] hover:bg-[hsl(24_75%_78%)] hover:border-[hsl(24_75%_78%)] hover:text-foreground transition-colors">
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

function Checkout({ tableId, onClose }: { tableId: string; eventId: string; onClose: () => void }) {
  const db = useStore();
  const reservation = db.reservations.find((r) => r.tableId === tableId);
  const orders = db.orders.filter((o) => o.tableId === tableId);

  const agg = new Map<string, { name: string; price: number; qty: number }>();
  orders.forEach((o) => o.items.forEach((i) => {
    const cur = agg.get(i.drinkId) ?? { name: i.name, price: i.price, qty: 0 };
    cur.qty += i.qty;
    agg.set(i.drinkId, cur);
  }));
  const lines = Array.from(agg.values());
  const total = lines.reduce((s, l) => s + l.price * l.qty, 0);

  const markPaid = () => {
    store.updateTable(tableId, { status: "paid" });
    if (reservation) store.updateReservation(reservation.id, { status: "left" });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-foreground/30 z-40 flex items-end sm:items-center justify-center p-3" onClick={onClose}>
      <div className="bg-background border border-foreground/15 rounded-t-2xl sm:rounded-2xl w-full max-w-md p-5 shadow-lg" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-display text-4xl mb-3" style={{ WebkitTextStroke: '0.5px currentColor' }}>Afrekening</h3>
        <div className="space-y-1 text-sm font-body">
          {lines.map((l) => (
            <div key={l.name} className="flex justify-between">
              <span>{l.qty}× {l.name}</span>
              <span className="tabular-nums">€ {(l.price * l.qty).toFixed(2)}</span>
            </div>
          ))}
          {lines.length === 0 && <p className="opacity-50">Geen verbruik geregistreerd.</p>}
        </div>
        <div className="flex justify-between border-t border-foreground/15 mt-3 pt-3 font-medium font-body text-lg">
          <span>Totaal</span><span className="tabular-nums">€ {total.toFixed(2)}</span>
        </div>

        <button onClick={markPaid} className="mt-5 w-full border border-foreground bg-foreground text-background py-3 rounded-lg text-sm font-body tracking-[1px] hover:bg-[hsl(24_75%_78%)] hover:border-[hsl(24_75%_78%)] hover:text-foreground transition-colors">
          Markeer als betaald
        </button>
        <button onClick={onClose} className="mt-3 w-full text-sm opacity-60 hover:opacity-100 transition-opacity">Sluiten</button>
      </div>
    </div>
  );
}
