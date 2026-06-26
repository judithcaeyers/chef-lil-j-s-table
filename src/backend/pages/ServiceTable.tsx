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

  if (!table) return <p className="text-center text-foreground opacity-60 mt-10">Tafel niet gevonden.</p>;

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
  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  const total = tableTotal(table.eventId, table.id);
  const byCat: Record<string, typeof drinks> = {};
  drinks.forEach((d) => { (byCat[d.category] ??= []).push(d); });

  return (
    <div className="pb-40 text-foreground">
      <div className="flex items-center justify-between gap-3 mb-4">
        <Link to="/backend/service/tables" className="font-body text-base opacity-70 hover:opacity-100 underline underline-offset-4">
          ← Tafels
        </Link>
        <h2 className="font-display text-5xl leading-none" style={{ WebkitTextStroke: '0.5px currentColor' }}>
          T{table.number}
        </h2>
      </div>

      {reservation ? (
        <div className="border-2 border-foreground/20 rounded-xl p-4 bg-background/60 mb-5">
          <div className="flex items-baseline justify-between">
            <p className="font-body text-lg font-semibold">{reservation.name}</p>
            <span className="text-base font-medium opacity-70">{reservation.partySize} pers.</span>
          </div>
          {(reservation.allergies || reservation.diet || reservation.winePairing) && (
            <div className="mt-2 flex flex-wrap gap-1.5 text-sm">
              {reservation.allergies && <span className="bg-red-100 text-red-800 font-semibold px-2.5 py-1 rounded">⚠ {reservation.allergies}</span>}
              {reservation.diet && <span className="bg-green-100 text-green-800 px-2.5 py-1 rounded">{reservation.diet}</span>}
              {reservation.winePairing && <span className="bg-purple-100 text-purple-800 px-2.5 py-1 rounded">wine pairing</span>}
            </div>
          )}
          {reservation.notes && <p className="mt-2 text-sm opacity-70 italic">"{reservation.notes}"</p>}
        </div>
      ) : (
        <p className="text-base opacity-60 mb-5">Geen reservatie gekoppeld.</p>
      )}

      <section className="mb-8">
        {Object.entries(byCat).map(([cat, list]) => (
          <div key={cat} className="mb-5">
            <p className="text-xs uppercase tracking-[2px] opacity-60 mb-2 font-semibold">{cat}</p>
            <div className="space-y-2">
              {list.map((d) => {
                const qty = cart[d.id] || 0;
                return (
                  <div key={d.id} className={`border-2 rounded-xl px-3 py-2.5 flex items-center gap-3 transition ${
                    qty > 0 ? "border-foreground bg-[hsl(24_75%_78%)]/30" : "border-foreground/15 bg-background/50"
                  }`}>
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-base font-semibold leading-tight truncate">{d.name}</p>
                      <p className="text-sm opacity-70 tabular-nums">€ {d.price.toFixed(2)}</p>
                    </div>
                    <button onClick={() => addToCart(d.id, -1)} disabled={!qty}
                            aria-label="Min"
                            className="w-12 h-12 rounded-full border-2 border-foreground/30 text-2xl leading-none disabled:opacity-25 active:scale-95 active:bg-foreground/10">−</button>
                    <span className="w-7 text-center font-body text-xl font-semibold tabular-nums">{qty}</span>
                    <button onClick={() => addToCart(d.id, 1)}
                            aria-label="Plus"
                            className="w-12 h-12 rounded-full border-2 border-foreground bg-foreground text-background text-2xl leading-none active:scale-95">+</button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        {drinks.length === 0 && <p className="text-base opacity-50">Geen dranken beschikbaar.</p>}
      </section>

      {orders.length > 0 && (
        <section className="mb-4">
          <p className="text-xs uppercase tracking-[2px] opacity-60 mb-2 font-semibold">Eerder besteld</p>
          <div className="space-y-2">
            {orders.map((o) => (
              <div key={o.id} className="border border-foreground/15 rounded-lg p-3 text-sm bg-background/50">
                <div className="flex justify-between text-xs opacity-70 mb-1">
                  <span>{new Date(o.createdAt).toLocaleTimeString("nl-BE", { hour: "2-digit", minute: "2-digit" })}</span>
                  <span className={`font-semibold ${o.status === "new" ? "text-amber-700" : "text-emerald-700"}`}>
                    {o.status === "new" ? "open" : "afgewerkt"}
                  </span>
                </div>
                <ul className="font-body">
                  {o.items.map((i) => <li key={i.drinkId}>{i.qty}× {i.name}</li>)}
                </ul>
                {o.note && <p className="text-xs opacity-60 mt-1 italic">"{o.note}"</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {cartCount > 0 ? (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t-2 border-foreground/20 p-3 z-20 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
          <div className="max-w-[700px] mx-auto">
            <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Opmerking (optioneel)"
                   className="w-full px-3 py-2.5 border-2 border-foreground/15 rounded-lg text-base bg-transparent focus:outline-none focus:border-foreground/50 mb-2" />
            <button onClick={send} className="w-full border-2 border-foreground bg-foreground text-background py-4 rounded-xl text-base font-body font-semibold tracking-wide active:scale-[0.98]">
              Versturen naar bar · {cartCount} stuks · € {cartTotal.toFixed(2)}
            </button>
          </div>
        </div>
      ) : (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t-2 border-foreground/15 p-3 z-20">
          <div className="max-w-[700px] mx-auto flex items-center gap-3">
            <div className="flex-1 font-body">
              <p className="text-xs uppercase tracking-wider opacity-60">Totaal tafel</p>
              <p className="text-xl font-semibold tabular-nums">€ {total.toFixed(2)}</p>
            </div>
            <button onClick={() => setShowCheckout(true)} className="border-2 border-foreground bg-foreground text-background py-3.5 px-6 rounded-xl text-base font-body font-semibold tracking-wide active:scale-95">
              Afrekenen
            </button>
          </div>
        </div>
      )}

      {showCheckout && (
        <Checkout tableId={table.id} onClose={() => setShowCheckout(false)} />
      )}
    </div>
  );
}

function Checkout({ tableId, onClose }: { tableId: string; onClose: () => void }) {
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
    <div className="fixed inset-0 bg-foreground/40 z-40 flex items-end sm:items-center justify-center" onClick={onClose}>
      <div className="bg-background border-t-2 sm:border-2 border-foreground/20 rounded-t-3xl sm:rounded-2xl w-full max-w-md p-5 shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-display text-4xl mb-4" style={{ WebkitTextStroke: '0.5px currentColor' }}>Afrekening</h3>
        <div className="space-y-1.5 text-base font-body">
          {lines.map((l) => (
            <div key={l.name} className="flex justify-between">
              <span>{l.qty}× {l.name}</span>
              <span className="tabular-nums font-medium">€ {(l.price * l.qty).toFixed(2)}</span>
            </div>
          ))}
          {lines.length === 0 && <p className="opacity-50">Geen verbruik geregistreerd.</p>}
        </div>
        <div className="flex justify-between border-t-2 border-foreground/15 mt-4 pt-3 font-semibold font-body text-2xl">
          <span>Totaal</span><span className="tabular-nums">€ {total.toFixed(2)}</span>
        </div>

        <button onClick={markPaid} className="mt-5 w-full border-2 border-foreground bg-foreground text-background py-4 rounded-xl text-base font-body font-semibold tracking-wide active:scale-[0.98]">
          Markeer als betaald
        </button>
        <button onClick={onClose} className="mt-3 w-full text-base opacity-60 hover:opacity-100 py-2">Sluiten</button>
      </div>
    </div>
  );
}
