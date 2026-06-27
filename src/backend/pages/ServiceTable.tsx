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

  if (!table) return <p className="text-center opacity-60 mt-10">Tafel niet gevonden.</p>;

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
    <div className="pb-40">
      <div className="flex items-center justify-between mb-4">
        <Link to="/backend/service/tables" className="text-sm opacity-70 hover:opacity-100 underline underline-offset-4">
          ← tafels
        </Link>
        <h2 className="font-display text-5xl leading-none" style={{ WebkitTextStroke: '0.5px currentColor' }}>
          T{table.number}
        </h2>
      </div>

      {reservation ? (
        <div className="rounded-xl p-3.5 border border-foreground/15 mb-5">
          <div className="flex items-baseline justify-between">
            <p className="font-body text-base font-semibold">{reservation.name}</p>
            <span className="text-sm opacity-70">{reservation.partySize} pers.</span>
          </div>
          {(reservation.allergies || reservation.diet || reservation.winePairing) && (
            <p className="mt-1.5 text-[13px] opacity-80">
              {[reservation.allergies && `⚠ ${reservation.allergies}`, reservation.diet, reservation.winePairing && "wine pairing"]
                .filter(Boolean)
                .join(" · ")}
            </p>
          )}
          {reservation.notes && <p className="mt-1 text-xs opacity-60 italic">"{reservation.notes}"</p>}
        </div>
      ) : (
        <p className="text-sm opacity-50 mb-5">Geen reservatie gekoppeld.</p>
      )}

      <section className="mb-6">
        {Object.entries(byCat).map(([cat, list]) => (
          <div key={cat} className="mb-5">
            <p className="text-[11px] uppercase tracking-[2px] opacity-50 mb-2">{cat}</p>
            <div className="divide-y divide-foreground/10 border-y border-foreground/10">
              {list.map((d) => {
                const qty = cart[d.id] || 0;
                return (
                  <div key={d.id} className="flex items-center gap-3 py-2.5">
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-[15px] leading-tight truncate">{d.name}</p>
                      <p className="text-xs opacity-60 tabular-nums">€ {d.price.toFixed(2)}</p>
                    </div>
                    <button
                      onClick={() => addToCart(d.id, -1)}
                      disabled={!qty}
                      aria-label="Min"
                      className="w-11 h-11 rounded-full border border-foreground/30 text-2xl leading-none disabled:opacity-20 active:scale-90"
                    >
                      −
                    </button>
                    <span className="w-6 text-center text-lg tabular-nums">{qty}</span>
                    <button
                      onClick={() => addToCart(d.id, 1)}
                      aria-label="Plus"
                      className="w-11 h-11 rounded-full bg-foreground text-background text-2xl leading-none active:scale-90"
                    >
                      +
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        {drinks.length === 0 && <p className="text-sm opacity-50">Geen dranken beschikbaar.</p>}
      </section>

      {orders.length > 0 && (
        <section className="mb-4">
          <p className="text-[11px] uppercase tracking-[2px] opacity-50 mb-2">Eerder besteld</p>
          <div className="space-y-2">
            {orders.map((o) => (
              <div key={o.id} className="border border-foreground/15 rounded-lg p-3 text-sm">
                <div className="flex justify-between text-xs opacity-60 mb-1">
                  <span>{new Date(o.createdAt).toLocaleTimeString("nl-BE", { hour: "2-digit", minute: "2-digit" })}</span>
                  <span>{o.status === "new" ? "open" : "afgewerkt"}</span>
                </div>
                <ul>
                  {o.items.map((i) => <li key={i.drinkId}>{i.qty}× {i.name}</li>)}
                </ul>
                {o.note && <p className="text-xs opacity-60 mt-1 italic">"{o.note}"</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {cartCount > 0 ? (
        <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-foreground/15" style={{ background: 'hsl(28 22% 17%)' }}>
          <div className="max-w-[700px] mx-auto p-3">
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Opmerking (optioneel)"
              className="w-full px-3 py-2.5 border border-foreground/20 rounded-lg text-sm bg-transparent focus:outline-none focus:border-foreground/50 mb-2"
            />
            <button
              onClick={send}
              className="w-full bg-foreground text-background py-3.5 rounded-xl text-base font-semibold active:scale-[0.98]"
            >
              Versturen · {cartCount} × · € {cartTotal.toFixed(2)}
            </button>
          </div>
        </div>
      ) : (
        <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-foreground/15" style={{ background: 'hsl(28 22% 17%)' }}>
          <div className="max-w-[700px] mx-auto p-3 flex items-center gap-3">
            <div className="flex-1">
              <p className="text-[10px] uppercase tracking-wider opacity-50">Totaal tafel</p>
              <p className="text-xl font-semibold tabular-nums">€ {total.toFixed(2)}</p>
            </div>
            <button
              onClick={() => setShowCheckout(true)}
              className="bg-foreground text-background py-3 px-5 rounded-xl text-base font-semibold active:scale-95"
            >
              Afrekenen
            </button>
          </div>
        </div>
      )}

      {showCheckout && <Checkout tableId={table.id} onClose={() => setShowCheckout(false)} />}
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
    <div className="fixed inset-0 bg-black/60 z-40 flex items-end sm:items-center justify-center" onClick={onClose}>
      <div
        className="border border-foreground/20 rounded-t-3xl sm:rounded-2xl w-full max-w-md p-5 shadow-2xl max-h-[90vh] overflow-y-auto"
        style={{ background: 'hsl(28 22% 17%)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-display text-4xl mb-4" style={{ WebkitTextStroke: '0.5px currentColor' }}>Afrekening</h3>
        <div className="space-y-1.5 text-base">
          {lines.map((l) => (
            <div key={l.name} className="flex justify-between">
              <span>{l.qty}× {l.name}</span>
              <span className="tabular-nums">€ {(l.price * l.qty).toFixed(2)}</span>
            </div>
          ))}
          {lines.length === 0 && <p className="opacity-50">Geen verbruik geregistreerd.</p>}
        </div>
        <div className="flex justify-between border-t border-foreground/20 mt-4 pt-3 font-semibold text-2xl">
          <span>Totaal</span><span className="tabular-nums">€ {total.toFixed(2)}</span>
        </div>

        <button onClick={markPaid} className="mt-5 w-full bg-foreground text-background py-3.5 rounded-xl text-base font-semibold active:scale-[0.98]">
          Markeer als betaald
        </button>
        <button onClick={onClose} className="mt-2 w-full text-sm opacity-60 hover:opacity-100 py-2">Sluiten</button>
      </div>
    </div>
  );
}
