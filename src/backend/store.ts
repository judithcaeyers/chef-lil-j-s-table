// Lovable Cloud-backed data store voor de Dinner Club backend.
// In-memory snapshot, hydrated from Supabase, met realtime sync over alle apparaten.

import { useSyncExternalStore } from "react";
import { supabase } from "@/integrations/supabase/client";

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
  date: string;
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
  price: number;
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

const uid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36);

// ----- mappers -----
const mapEvent = (r: any): DCEvent => ({
  id: r.id,
  name: r.name,
  date: r.date,
  status: r.status,
  tableCount: r.table_count,
  notes: r.notes ?? "",
});
const unmapEvent = (e: Partial<DCEvent>) => ({
  ...(e.id !== undefined && { id: e.id }),
  ...(e.name !== undefined && { name: e.name }),
  ...(e.date !== undefined && { date: e.date }),
  ...(e.status !== undefined && { status: e.status }),
  ...(e.tableCount !== undefined && { table_count: e.tableCount }),
  ...(e.notes !== undefined && { notes: e.notes }),
});

const mapTable = (r: any): DCTable => ({
  id: r.id,
  eventId: r.event_id,
  number: r.number,
  status: r.status,
});
const unmapTable = (t: Partial<DCTable>) => ({
  ...(t.id !== undefined && { id: t.id }),
  ...(t.eventId !== undefined && { event_id: t.eventId }),
  ...(t.number !== undefined && { number: t.number }),
  ...(t.status !== undefined && { status: t.status }),
});

const mapReservation = (r: any): Reservation => ({
  id: r.id,
  eventId: r.event_id,
  name: r.name ?? "",
  email: r.email ?? "",
  phone: r.phone ?? "",
  partySize: r.party_size,
  allergies: r.allergies ?? "",
  diet: r.diet ?? "",
  winePairing: !!r.wine_pairing,
  notes: r.notes ?? "",
  status: r.status,
  tableId: r.table_id ?? undefined,
  createdAt: new Date(r.created_at).getTime(),
});
const unmapReservation = (r: Partial<Reservation>) => ({
  ...(r.id !== undefined && { id: r.id }),
  ...(r.eventId !== undefined && { event_id: r.eventId }),
  ...(r.name !== undefined && { name: r.name }),
  ...(r.email !== undefined && { email: r.email }),
  ...(r.phone !== undefined && { phone: r.phone }),
  ...(r.partySize !== undefined && { party_size: r.partySize }),
  ...(r.allergies !== undefined && { allergies: r.allergies }),
  ...(r.diet !== undefined && { diet: r.diet }),
  ...(r.winePairing !== undefined && { wine_pairing: r.winePairing }),
  ...(r.notes !== undefined && { notes: r.notes }),
  ...(r.status !== undefined && { status: r.status }),
  ...("tableId" in r && { table_id: r.tableId ?? null }),
});

const mapDrink = (r: any): Drink => ({
  id: r.id,
  eventId: r.event_id,
  name: r.name,
  category: r.category,
  price: Number(r.price),
  available: !!r.available,
});
const unmapDrink = (d: Partial<Drink>) => ({
  ...(d.id !== undefined && { id: d.id }),
  ...(d.eventId !== undefined && { event_id: d.eventId }),
  ...(d.name !== undefined && { name: d.name }),
  ...(d.category !== undefined && { category: d.category }),
  ...(d.price !== undefined && { price: d.price }),
  ...(d.available !== undefined && { available: d.available }),
});

const mapOrder = (r: any): Order => ({
  id: r.id,
  eventId: r.event_id,
  tableId: r.table_id,
  createdAt: new Date(r.created_at).getTime(),
  status: r.status,
  note: r.note ?? "",
  items: (r.items ?? []) as OrderItem[],
});
const unmapOrder = (o: Partial<Order>) => ({
  ...(o.id !== undefined && { id: o.id }),
  ...(o.eventId !== undefined && { event_id: o.eventId }),
  ...(o.tableId !== undefined && { table_id: o.tableId }),
  ...(o.status !== undefined && { status: o.status }),
  ...(o.note !== undefined && { note: o.note }),
  ...(o.items !== undefined && { items: o.items as any }),
});

const mapPayment = (r: any): Payment => ({
  id: r.id,
  eventId: r.event_id,
  tableId: r.table_id,
  amount: Number(r.amount),
  status: r.status,
  link: r.link ?? "",
  createdAt: new Date(r.created_at).getTime(),
});
const unmapPayment = (p: Partial<Payment>) => ({
  ...(p.id !== undefined && { id: p.id }),
  ...(p.eventId !== undefined && { event_id: p.eventId }),
  ...(p.tableId !== undefined && { table_id: p.tableId }),
  ...(p.amount !== undefined && { amount: p.amount }),
  ...(p.status !== undefined && { status: p.status }),
  ...(p.link !== undefined && { link: p.link }),
});

// ----- in-memory snapshot -----
let db: DB = {
  events: [],
  reservations: [],
  tables: [],
  drinks: [],
  orders: [],
  payments: [],
  activeEventId: null,
};

const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());

const setDb = (patch: Partial<DB>) => {
  db = { ...db, ...patch };
  notify();
};

// ----- upsert / remove helpers for realtime -----
function upsertById<T extends { id: string }>(arr: T[], item: T): T[] {
  const i = arr.findIndex((x) => x.id === item.id);
  if (i === -1) return [...arr, item];
  const copy = arr.slice();
  copy[i] = item;
  return copy;
}
function removeById<T extends { id: string }>(arr: T[], id: string): T[] {
  return arr.filter((x) => x.id !== id);
}

// ----- initial hydration + seeding -----
let hydrated = false;
let hydrating: Promise<void> | null = null;

async function hydrate() {
  if (hydrating) return hydrating;
  hydrating = (async () => {
    const [events, tables, reservations, drinks, orders, payments, state] =
      await Promise.all([
        supabase.from("events").select("*").order("date", { ascending: true }),
        supabase.from("tables").select("*").order("number"),
        supabase.from("reservations").select("*").order("created_at"),
        supabase.from("drinks").select("*"),
        supabase.from("orders").select("*").order("created_at"),
        supabase.from("payments").select("*").order("created_at"),
        supabase.from("app_state").select("*").eq("key", "activeEventId").maybeSingle(),
      ]);

    const mappedEvents = (events.data ?? []).map(mapEvent);

    db = {
      events: mappedEvents,
      tables: (tables.data ?? []).map(mapTable),
      reservations: (reservations.data ?? []).map(mapReservation),
      drinks: (drinks.data ?? []).map(mapDrink),
      orders: (orders.data ?? []).map(mapOrder),
      payments: (payments.data ?? []).map(mapPayment),
      activeEventId:
        (state.data?.value as any) ??
        mappedEvents[mappedEvents.length - 1]?.id ??
        null,
    };
    hydrated = true;
    notify();

    if (mappedEvents.length === 0) {
      await seedInitial();
    }
  })();
  return hydrating;
}

async function seedInitial() {
  const eventId = uid();
  await supabase.from("events").insert({
    id: eventId,
    name: "Dinner Club — 27 juni",
    date: "2026-06-27",
    status: "active",
    table_count: 7,
    notes: "",
  });

  const tableRows = Array.from({ length: 7 }, (_, i) => ({
    id: uid(),
    event_id: eventId,
    number: i + 1,
    status: "free",
  }));
  await supabase.from("tables").insert(tableRows);

  const drinkPresets: Array<Omit<Drink, "id" | "eventId">> = [
    { name: "Gin & Tonic", category: "aperitief", price: 13, available: true },
    { name: "Negroni", category: "aperitief", price: 14, available: true },
    { name: "Vermouth", category: "aperitief", price: 11, available: true },
    { name: "Kombucha — Passievrucht & vlierbloesem", category: "kombucha", price: 8.5, available: true },
    { name: 'Glas wijn, wit — Dirk Vermeersch, Rhône "Classic RS Blanc" 2024', category: "wijn", price: 6, available: true },
    { name: 'Glas wijn, wit — Anselmo Mendes, Minho "3 Rios" 2025', category: "wijn", price: 7, available: true },
    { name: 'Glas wijn, rood — Château Ponzac, Cahors "Maintenant ou Jamais" 2024', category: "wijn", price: 7, available: true },
    { name: 'Glas wijn, rood — Bodegas Frontonio, Aragón "Botijo Rojo" 2024', category: "wijn", price: 8, available: true },
    { name: "Bier", category: "bier", price: 5, available: true },
    { name: "Frisdrank", category: "frisdrank", price: 3, available: true },
    { name: "Koffie", category: "ander", price: 4.5, available: true },
  ];
  await supabase.from("drinks").insert(
    drinkPresets.map((d) => ({ ...d, id: uid(), event_id: eventId })),
  );

  const tableGuests: Array<{ table: number; guests: Array<{ name: string; wine?: boolean; allergy?: string }> }> = [
    { table: 1, guests: [{ name: "Laura", wine: true }, { name: "Ruben", wine: true }] },
    { table: 2, guests: [{ name: "Leen", allergy: "Veggie" }, { name: "Nathan", allergy: "Veggie" }] },
    { table: 3, guests: [
      { name: "Hilde" }, { name: "Koen", wine: true }, { name: "Luying" },
      { name: "Jan", wine: true }, { name: "Ilse", wine: true },
      { name: "Marcel", wine: true }, { name: "Rudi" },
    ]},
    { table: 4, guests: [
      { name: "Tuur" }, { name: "Wouter", allergy: "Yellow snowflake" },
      { name: "Hans", wine: true }, { name: "Claudia" },
    ]},
    { table: 5, guests: [{ name: "Manon", wine: true }, { name: "Mathieu" }] },
    { table: 6, guests: [
      { name: "Leander", allergy: "Vegan" }, { name: "Dries" },
      { name: "David" }, { name: "Sam" }, { name: "Julie" },
    ]},
    { table: 7, guests: [{ name: "Kirsty", wine: true }, { name: "Jan Kristof", wine: true }]},
  ];

  const reservationRows = tableGuests.map((tg) => {
    const t = tableRows.find((x) => x.number === tg.table)!;
    const wineCount = tg.guests.filter((g) => g.wine).length;
    const allergies = tg.guests
      .filter((g) => g.allergy)
      .map((g) => `${g.name}: ${g.allergy}`)
      .join(", ");
    return {
      id: uid(),
      event_id: eventId,
      name: tg.guests.map((g) => g.name).join(", "),
      email: "",
      phone: "",
      party_size: tg.guests.length,
      allergies,
      diet: "",
      wine_pairing: wineCount > 0,
      notes: wineCount > 0 ? `Wine pairing: ${wineCount}×` : "",
      status: "expected",
      table_id: t.id,
    };
  });
  await supabase.from("reservations").insert(reservationRows);

  await supabase
    .from("app_state")
    .upsert({ key: "activeEventId", value: eventId as any });

  // realtime listeners will pick this up, but re-hydrate to be safe
  hydrating = null;
  await hydrate();
}

// ----- realtime subscription -----
let channel: ReturnType<typeof supabase.channel> | null = null;
function startRealtime() {
  if (channel) return;
  channel = supabase
    .channel("dc-backend-db")
    .on("postgres_changes", { event: "*", schema: "public", table: "events" }, (p) => {
      if (p.eventType === "DELETE") setDb({ events: removeById(db.events, (p.old as any).id) });
      else setDb({ events: upsertById(db.events, mapEvent(p.new)) });
    })
    .on("postgres_changes", { event: "*", schema: "public", table: "tables" }, (p) => {
      if (p.eventType === "DELETE") setDb({ tables: removeById(db.tables, (p.old as any).id) });
      else setDb({ tables: upsertById(db.tables, mapTable(p.new)) });
    })
    .on("postgres_changes", { event: "*", schema: "public", table: "reservations" }, (p) => {
      if (p.eventType === "DELETE") setDb({ reservations: removeById(db.reservations, (p.old as any).id) });
      else setDb({ reservations: upsertById(db.reservations, mapReservation(p.new)) });
    })
    .on("postgres_changes", { event: "*", schema: "public", table: "drinks" }, (p) => {
      if (p.eventType === "DELETE") setDb({ drinks: removeById(db.drinks, (p.old as any).id) });
      else setDb({ drinks: upsertById(db.drinks, mapDrink(p.new)) });
    })
    .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, (p) => {
      if (p.eventType === "DELETE") setDb({ orders: removeById(db.orders, (p.old as any).id) });
      else setDb({ orders: upsertById(db.orders, mapOrder(p.new)) });
    })
    .on("postgres_changes", { event: "*", schema: "public", table: "payments" }, (p) => {
      if (p.eventType === "DELETE") setDb({ payments: removeById(db.payments, (p.old as any).id) });
      else setDb({ payments: upsertById(db.payments, mapPayment(p.new)) });
    })
    .on("postgres_changes", { event: "*", schema: "public", table: "app_state" }, (p) => {
      const row = (p.new ?? p.old) as any;
      if (row?.key === "activeEventId") {
        setDb({ activeEventId: (p.new as any)?.value ?? null });
      }
    })
    .subscribe();
}

if (typeof window !== "undefined") {
  hydrate();
  startRealtime();
}

export const store = {
  subscribe(fn: () => void) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
  get(): DB {
    return db;
  },
  isReady() {
    return hydrated;
  },
  async reset() {
    // wipe and re-seed
    await Promise.all([
      supabase.from("payments").delete().neq("id", "00000000-0000-0000-0000-000000000000"),
      supabase.from("orders").delete().neq("id", "00000000-0000-0000-0000-000000000000"),
      supabase.from("reservations").delete().neq("id", "00000000-0000-0000-0000-000000000000"),
      supabase.from("drinks").delete().neq("id", "00000000-0000-0000-0000-000000000000"),
      supabase.from("tables").delete().neq("id", "00000000-0000-0000-0000-000000000000"),
    ]);
    await supabase.from("events").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    hydrating = null;
    await hydrate();
  },
  setActiveEvent(id: string) {
    setDb({ activeEventId: id });
    supabase.from("app_state").upsert({ key: "activeEventId", value: id as any });
  },

  // Events
  addEvent(e: Omit<DCEvent, "id">): DCEvent {
    const ne: DCEvent = { ...e, id: uid() };
    setDb({ events: [...db.events, ne] });
    supabase.from("events").insert(unmapEvent(ne) as any).then();

    const tables: DCTable[] = Array.from({ length: e.tableCount }, (_, i) => ({
      id: uid(),
      eventId: ne.id,
      number: i + 1,
      status: "free",
    }));
    setDb({ tables: [...db.tables, ...tables] });
    supabase.from("tables").insert(tables.map(unmapTable) as any).then();
    return ne;
  },
  updateEvent(id: string, patch: Partial<DCEvent>) {
    setDb({ events: db.events.map((e) => (e.id === id ? { ...e, ...patch } : e)) });
    supabase.from("events").update(unmapEvent(patch)).eq("id", id).then();

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
        setDb({ tables: [...db.tables, ...extra] });
        supabase.from("tables").insert(extra.map(unmapTable) as any).then();
      }
    }
  },
  deleteEvent(id: string) {
    setDb({
      events: db.events.filter((e) => e.id !== id),
      reservations: db.reservations.filter((r) => r.eventId !== id),
      tables: db.tables.filter((t) => t.eventId !== id),
      drinks: db.drinks.filter((d) => d.eventId !== id),
      orders: db.orders.filter((o) => o.eventId !== id),
      payments: db.payments.filter((p) => p.eventId !== id),
      activeEventId: db.activeEventId === id ? null : db.activeEventId,
    });
    supabase.from("events").delete().eq("id", id).then();
  },

  // Reservations
  addReservation(r: Omit<Reservation, "id" | "createdAt">) {
    const nr: Reservation = { ...r, id: uid(), createdAt: Date.now() };
    setDb({ reservations: [...db.reservations, nr] });
    supabase.from("reservations").insert(unmapReservation(nr) as any).then();
    return nr;
  },
  updateReservation(id: string, patch: Partial<Reservation>) {
    setDb({
      reservations: db.reservations.map((r) => (r.id === id ? { ...r, ...patch } : r)),
    });
    supabase.from("reservations").update(unmapReservation(patch)).eq("id", id).then();
  },

  // Tables
  updateTable(id: string, patch: Partial<DCTable>) {
    setDb({ tables: db.tables.map((t) => (t.id === id ? { ...t, ...patch } : t)) });
    supabase.from("tables").update(unmapTable(patch)).eq("id", id).then();
  },

  // Drinks
  addDrink(d: Omit<Drink, "id">) {
    const nd: Drink = { ...d, id: uid() };
    setDb({ drinks: [...db.drinks, nd] });
    supabase.from("drinks").insert(unmapDrink(nd) as any).then();
    return nd;
  },
  updateDrink(id: string, patch: Partial<Drink>) {
    setDb({ drinks: db.drinks.map((d) => (d.id === id ? { ...d, ...patch } : d)) });
    supabase.from("drinks").update(unmapDrink(patch)).eq("id", id).then();
  },
  deleteDrink(id: string) {
    setDb({ drinks: db.drinks.filter((d) => d.id !== id) });
    supabase.from("drinks").delete().eq("id", id).then();
  },

  // Orders
  addOrder(o: Omit<Order, "id" | "createdAt" | "status">) {
    const no: Order = { ...o, id: uid(), createdAt: Date.now(), status: "new" };
    setDb({ orders: [...db.orders, no] });
    supabase.from("orders").insert(unmapOrder(no) as any).then();
    return no;
  },
  updateOrder(id: string, patch: Partial<Order>) {
    setDb({ orders: db.orders.map((o) => (o.id === id ? { ...o, ...patch } : o)) });
    supabase.from("orders").update(unmapOrder(patch)).eq("id", id).then();
  },
  deleteOrder(id: string) {
    setDb({ orders: db.orders.filter((o) => o.id !== id) });
    supabase.from("orders").delete().eq("id", id).then();
  },
  async replaceTableOrders(eventId: string, tableId: string, items: OrderItem[]) {
    const existing = db.orders.filter((o) => o.eventId === eventId && o.tableId === tableId);
    const cleaned = items.filter((i) => i.qty > 0);
    const newOrder: Order = {
      id: uid(),
      eventId,
      tableId,
      createdAt: Date.now(),
      status: "done",
      note: "aangepast bij afrekening",
      items: cleaned,
    };
    setDb({
      orders: [
        ...db.orders.filter((o) => !(o.eventId === eventId && o.tableId === tableId)),
        ...(cleaned.length > 0 ? [newOrder] : []),
      ],
    });
    if (existing.length > 0) {
      await supabase.from("orders").delete().in("id", existing.map((o) => o.id));
    }
    if (cleaned.length > 0) {
      await supabase.from("orders").insert(unmapOrder(newOrder) as any);
    }
  },

  // Payments
  addPayment(p: Omit<Payment, "id" | "createdAt">) {
    const np: Payment = { ...p, id: uid(), createdAt: Date.now() };
    setDb({ payments: [...db.payments, np] });
    supabase.from("payments").insert(unmapPayment(np) as any).then();
    return np;
  },
  updatePayment(id: string, patch: Partial<Payment>) {
    setDb({ payments: db.payments.map((p) => (p.id === id ? { ...p, ...patch } : p)) });
    supabase.from("payments").update(unmapPayment(patch)).eq("id", id).then();
  },
};

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
