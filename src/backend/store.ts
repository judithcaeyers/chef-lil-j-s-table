// Mock data store voor de backend. Persistent in localStorage,
// met cross-tab realtime via het 'storage' event + in-tab pub/sub.

export type EventStatus = "planned" | "active" | "done";
export type ReservationStatus = "expected" | "arrived" | "left";
export type TableStatus = "free" | "seated" | "paid";
export type OrderStatus = "new" | "done";
export type DrinkCategory =
  | "frisdrank"
  | "bier"
  | "wijn"
  | "water"
  | "kombucha"
  | "aperitief"
  | "ander";

export interface DCEvent {
  id: string;
  name: string;
  date: string; // ISO yyyy-mm-dd
  status: EventStatus;
  tableCount: number;
  notes: string;
}

export interface Reservation {
  id: string;
  eventId: string;
  name: string;
  email: string;
  phone: string;
  partySize: number;
  allergies: string;
  diet: string;
  winePairing: boolean;
  notes: string;
  status: ReservationStatus;
  tableId?: string;
  createdAt: number;
}

export interface DCTable {
  id: string;
  eventId: string;
  number: number;
  status: TableStatus;
}

export interface Drink {
  id: string;
  eventId: string;
  name: string;
  category: DrinkCategory;
  price: number; // EUR
  available: boolean;
}

export interface OrderItem {
  drinkId: string;
  name: string;
  price: number;
  qty: number;
}

export interface Order {
  id: string;
  eventId: string;
  tableId: string;
  createdAt: number;
  status: OrderStatus;
  note: string;
  items: OrderItem[];
}

export interface Payment {
  id: string;
  eventId: string;
  tableId: string;
  amount: number;
  status: "pending" | "paid";
  link: string;
  createdAt: number;
}

interface DB {
  events: DCEvent[];
  reservations: Reservation[];
  tables: DCTable[];
  drinks: Drink[];
  orders: Order[];
  payments: Payment[];
  activeEventId: string | null;
}

const KEY = "dc_backend_db_v4";

const uid = () => Math.random().toString(36).slice(2, 10);

const seed = (): DB => {
  const eventId = uid();
  const tables: DCTable[] = Array.from({ length: 7 }, (_, i) => ({
    id: uid(),
    eventId,
    number: i + 1,
    status: "free",
  }));
  const drinkPresets: Array<Omit<Drink, "id" | "eventId">> = [
    // Aperitief
    { name: "Gin & Tonic", category: "aperitief", price: 13, available: true },
    { name: "Negroni", category: "aperitief", price: 14, available: true },
    { name: "Vermouth", category: "aperitief", price: 11, available: true },
    { name: "Kombucha — Passievrucht & vlierbloesem", category: "kombucha", price: 8.5, available: true },
    // Wijn
    { name: "Glas wijn, wit — Dirk Vermeersch, Rhône \"Classic RS Blanc\" 2024", category: "wijn", price: 6, available: true },
    { name: "Glas wijn, wit — Anselmo Mendes, Minho \"3 Rios\" 2025", category: "wijn", price: 7, available: true },
    { name: "Glas wijn, rood — Château Ponzac, Cahors \"Maintenant ou Jamais\" 2024", category: "wijn", price: 7, available: true },
    { name: "Glas wijn, rood — Bodegas Frontonio, Aragón \"Botijo Rojo\" 2024", category: "wijn", price: 8, available: true },
    // Overig
    { name: "Bier", category: "bier", price: 5, available: true },
    { name: "Frisdrank", category: "frisdrank", price: 3, available: true },
    { name: "Koffie", category: "ander", price: 4.5, available: true },
  ];
  const drinks: Drink[] = drinkPresets.map((d) => ({ ...d, id: uid(), eventId }));

  // Tafels & gasten — Dinner Club 27 juni
  const tableGuests: Array<{
    table: number;
    guests: Array<{ name: string; wine?: boolean; allergy?: string }>;
  }> = [
    { table: 1, guests: [
      { name: "Laura", wine: true },
      { name: "Ruben", wine: true },
    ]},
    { table: 2, guests: [
      { name: "Leen", allergy: "Veggie" },
      { name: "Nathan", allergy: "Veggie" },
    ]},
    { table: 3, guests: [
      { name: "Hilde" },
      { name: "Koen", wine: true },
      { name: "Luying" },
      { name: "Jan", wine: true },
      { name: "Ilse", wine: true },
      { name: "Marcel", wine: true },
      { name: "Rudi" },
    ]},
    { table: 4, guests: [
      { name: "Tuur" },
      { name: "Wouter", allergy: "Yellow snowflake" },
      { name: "Hans", wine: true },
      { name: "Claudia" },
    ]},
    { table: 5, guests: [
      { name: "Manon", wine: true },
      { name: "Mathieu" },
    ]},
    { table: 6, guests: [
      { name: "Leander", allergy: "Vegan" },
      { name: "Dries" },
      { name: "David" },
      { name: "Sam" },
      { name: "Julie" },
    ]},
    { table: 7, guests: [
      { name: "Kirsty", wine: true },
      { name: "Jan Kristof", wine: true },
    ]},
  ];

  const reservations: Reservation[] = tableGuests.map((tg, idx) => {
    const t = tables.find((x) => x.number === tg.table)!;
    const wineCount = tg.guests.filter((g) => g.wine).length;
    const allergies = tg.guests
      .filter((g) => g.allergy)
      .map((g) => `${g.name}: ${g.allergy}`)
      .join(", ");
    return {
      id: uid(),
      eventId,
      name: tg.guests.map((g) => g.name).join(", "),
      email: "",
      phone: "",
      partySize: tg.guests.length,
      allergies,
      diet: "",
      winePairing: wineCount > 0,
      notes: wineCount > 0 ? `Wine pairing: ${wineCount}×` : "",
      status: "expected",
      tableId: t.id,
      createdAt: Date.now() - (tableGuests.length - idx) * 60000,
    };
  });

  return {
    events: [
      {
        id: eventId,
        name: "Dinner Club — 27 juni",
        date: "2026-06-27",
        status: "active",
        tableCount: 7,
        notes: "",
      },
    ],
    reservations,
    tables,
    drinks,
    orders: [],
    payments: [],
    activeEventId: eventId,
  };
};

const load = (): DB => {
  if (typeof window === "undefined") return seed();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      const s = seed();
      localStorage.setItem(KEY, JSON.stringify(s));
      return s;
    }
    return JSON.parse(raw) as DB;
  } catch {
    return seed();
  }
};

let db: DB = load();
const listeners = new Set<() => void>();

const persist = () => {
  localStorage.setItem(KEY, JSON.stringify(db));
  listeners.forEach((l) => l());
};

if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === KEY && e.newValue) {
      try {
        db = JSON.parse(e.newValue);
        listeners.forEach((l) => l());
      } catch {
        /* ignore */
      }
    }
  });
}

export const store = {
  subscribe(fn: () => void) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
  get(): DB {
    return db;
  },
  reset() {
    db = seed();
    persist();
  },
  setActiveEvent(id: string) {
    db = { ...db, activeEventId: id };
    persist();
  },

  // Events
  addEvent(e: Omit<DCEvent, "id">): DCEvent {
    const ne = { ...e, id: uid() };
    db = { ...db, events: [...db.events, ne] };
    // auto-create tables for new event
    const tables: DCTable[] = Array.from({ length: e.tableCount }, (_, i) => ({
      id: uid(),
      eventId: ne.id,
      number: i + 1,
      status: "free",
    }));
    db = { ...db, tables: [...db.tables, ...tables] };
    persist();
    return ne;
  },
  updateEvent(id: string, patch: Partial<DCEvent>) {
    db = {
      ...db,
      events: db.events.map((e) => (e.id === id ? { ...e, ...patch } : e)),
    };
    // sync tafelaantal
    if (patch.tableCount !== undefined) {
      const existing = db.tables.filter((t) => t.eventId === id);
      const need = patch.tableCount - existing.length;
      if (need > 0) {
        const start = existing.length;
        const extra: DCTable[] = Array.from({ length: need }, (_, i) => ({
          id: uid(),
          eventId: id,
          number: start + i + 1,
          status: "free",
        }));
        db = { ...db, tables: [...db.tables, ...extra] };
      }
    }
    persist();
  },
  deleteEvent(id: string) {
    db = {
      ...db,
      events: db.events.filter((e) => e.id !== id),
      reservations: db.reservations.filter((r) => r.eventId !== id),
      tables: db.tables.filter((t) => t.eventId !== id),
      drinks: db.drinks.filter((d) => d.eventId !== id),
      orders: db.orders.filter((o) => o.eventId !== id),
      payments: db.payments.filter((p) => p.eventId !== id),
      activeEventId: db.activeEventId === id ? null : db.activeEventId,
    };
    persist();
  },

  // Reservations
  addReservation(r: Omit<Reservation, "id" | "createdAt">) {
    const nr: Reservation = { ...r, id: uid(), createdAt: Date.now() };
    db = { ...db, reservations: [...db.reservations, nr] };
    persist();
    return nr;
  },
  updateReservation(id: string, patch: Partial<Reservation>) {
    db = {
      ...db,
      reservations: db.reservations.map((r) =>
        r.id === id ? { ...r, ...patch } : r,
      ),
    };
    persist();
  },

  // Tables
  updateTable(id: string, patch: Partial<DCTable>) {
    db = {
      ...db,
      tables: db.tables.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    };
    persist();
  },

  // Drinks
  addDrink(d: Omit<Drink, "id">) {
    const nd = { ...d, id: uid() };
    db = { ...db, drinks: [...db.drinks, nd] };
    persist();
    return nd;
  },
  updateDrink(id: string, patch: Partial<Drink>) {
    db = {
      ...db,
      drinks: db.drinks.map((d) => (d.id === id ? { ...d, ...patch } : d)),
    };
    persist();
  },
  deleteDrink(id: string) {
    db = { ...db, drinks: db.drinks.filter((d) => d.id !== id) };
    persist();
  },

  // Orders
  addOrder(o: Omit<Order, "id" | "createdAt" | "status">) {
    const no: Order = {
      ...o,
      id: uid(),
      createdAt: Date.now(),
      status: "new",
    };
    db = { ...db, orders: [...db.orders, no] };
    persist();
    return no;
  },
  updateOrder(id: string, patch: Partial<Order>) {
    db = {
      ...db,
      orders: db.orders.map((o) => (o.id === id ? { ...o, ...patch } : o)),
    };
    persist();
  },

  // Payments
  addPayment(p: Omit<Payment, "id" | "createdAt">) {
    const np: Payment = { ...p, id: uid(), createdAt: Date.now() };
    db = { ...db, payments: [...db.payments, np] };
    persist();
    return np;
  },
  updatePayment(id: string, patch: Partial<Payment>) {
    db = {
      ...db,
      payments: db.payments.map((p) =>
        p.id === id ? { ...p, ...patch } : p,
      ),
    };
    persist();
  },
};

// React hook
import { useSyncExternalStore } from "react";
export function useStore() {
  return useSyncExternalStore(
    (cb) => store.subscribe(cb),
    () => store.get(),
    () => store.get(),
  );
}

export function tableTotal(eventId: string, tableId: string) {
  const orders = store
    .get()
    .orders.filter((o) => o.eventId === eventId && o.tableId === tableId);
  return orders.reduce(
    (sum, o) => sum + o.items.reduce((s, i) => s + i.price * i.qty, 0),
    0,
  );
}
