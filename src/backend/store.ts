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

const KEY = "dc_backend_db_v1";

const uid = () => Math.random().toString(36).slice(2, 10);

const seed = (): DB => {
  const eventId = uid();
  const tables: DCTable[] = Array.from({ length: 6 }, (_, i) => ({
    id: uid(),
    eventId,
    number: i + 1,
    status: "free",
  }));
  const drinkPresets: Array<Omit<Drink, "id" | "eventId">> = [
    { name: "Cola", category: "frisdrank", price: 3.5, available: true },
    { name: "Cola Zero", category: "frisdrank", price: 3.5, available: true },
    { name: "Ice Tea", category: "frisdrank", price: 3.5, available: true },
    { name: "Plat water 50cl", category: "water", price: 4, available: true },
    { name: "Bruis water 50cl", category: "water", price: 4, available: true },
    { name: "Kombucha", category: "kombucha", price: 5, available: true },
    { name: "Pils", category: "bier", price: 4, available: true },
    { name: "Glas witte wijn", category: "wijn", price: 6, available: true },
    { name: "Glas rode wijn", category: "wijn", price: 6, available: true },
    { name: "Fles witte wijn", category: "wijn", price: 28, available: true },
    { name: "Fles rode wijn", category: "wijn", price: 28, available: true },
    { name: "Aperitief", category: "aperitief", price: 8, available: true },
  ];
  const drinks: Drink[] = drinkPresets.map((d) => ({ ...d, id: uid(), eventId }));

  const reservations: Reservation[] = [
    {
      id: uid(),
      eventId,
      name: "Sophie Janssens",
      email: "sophie@example.com",
      phone: "+32 478 11 22 33",
      partySize: 2,
      allergies: "Noten",
      diet: "Vegetarisch",
      winePairing: true,
      notes: "Verjaardag",
      status: "expected",
      createdAt: Date.now() - 86400000,
    },
    {
      id: uid(),
      eventId,
      name: "Tom Peeters",
      email: "tom@example.com",
      phone: "+32 471 99 88 77",
      partySize: 4,
      allergies: "",
      diet: "",
      winePairing: false,
      notes: "",
      status: "expected",
      createdAt: Date.now() - 3600000,
    },
  ];

  return {
    events: [
      {
        id: eventId,
        name: "Dinner Club — Voorbeeld",
        date: new Date().toISOString().slice(0, 10),
        status: "active",
        tableCount: 6,
        notes: "Demo event",
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
