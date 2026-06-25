import { Link, NavLink, Navigate, Outlet, useLocation } from "react-router-dom";
import { currentRole, logout, type Role } from "./auth";
import { useStore, store } from "./store";

const navByRole: Record<Role, { to: string; label: string }[]> = {
  admin: [
    { to: "/backend/admin/events", label: "Events" },
    { to: "/backend/admin/reservations", label: "Reservaties" },
    { to: "/backend/admin/drinks", label: "Drankkaart" },
    { to: "/backend/admin/tables", label: "Tafels" },
  ],
  ober: [
    { to: "/backend/service/tables", label: "Tafels" },
    { to: "/backend/service/reservations", label: "Reservaties" },
  ],
  bar: [{ to: "/backend/bar", label: "Bar" }],
};

export function RequireRole({
  roles,
  children,
}: {
  roles: Role[];
  children: React.ReactNode;
}) {
  const role = currentRole();
  const loc = useLocation();
  if (!role) return <Navigate to="/backend/login" state={{ from: loc }} replace />;
  if (!roles.includes(role)) return <Navigate to={`/backend/${role === "ober" ? "service/tables" : role}`} replace />;
  return <>{children}</>;
}

export default function Shell() {
  const role = currentRole();
  const db = useStore();
  if (!role) return <Navigate to="/backend/login" replace />;

  const activeEvent = db.events.find((e) => e.id === db.activeEventId) || db.events[0];
  const nav = navByRole[role];

  return (
    <div className="min-h-screen bg-background text-foreground antialiased font-body">
      <header className="sticky top-0 z-20 bg-background/90 backdrop-blur-sm border-b border-foreground/10">
        <div className="max-w-[650px] mx-auto px-4 h-14 flex items-center gap-4">
          <Link to="/backend" className="font-display text-2xl tracking-tight" style={{ WebkitTextStroke: '0.5px currentColor' }}>
            Dinner Club
          </Link>
          <nav className="flex gap-1 ml-4 overflow-x-auto">
            {nav.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-md text-sm whitespace-nowrap font-body transition-colors ${
                    isActive
                      ? "bg-foreground text-background"
                      : "text-foreground/70 hover:bg-foreground/5"
                  }`
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-3">
            {db.events.length > 0 && (
              <select
                value={db.activeEventId ?? ""}
                onChange={(e) => store.setActiveEvent(e.target.value)}
                className="text-sm bg-transparent border border-foreground/15 rounded-md px-2 py-1.5 font-body focus:outline-none focus:border-foreground/50"
              >
                {db.events.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.name} — {e.date}
                  </option>
                ))}
              </select>
            )}
            <span className="text-[11px] uppercase tracking-[2px] text-foreground/50">
              {role}
            </span>
            <button
              onClick={() => {
                logout();
                window.location.href = "/backend/login";
              }}
              className="text-sm text-foreground/70 hover:text-foreground underline underline-offset-4 transition-opacity"
            >
              Uitloggen
            </button>
          </div>
        </div>
        {activeEvent && (
          <div className="max-w-[650px] mx-auto px-4 py-1.5 text-[11px] text-foreground/60 border-t border-foreground/10">
            Actief event: <span className="text-foreground font-medium">{activeEvent.name}</span>
            <span className="mx-2">·</span>
            {activeEvent.date}
            <span className="mx-2">·</span>
            <span className="capitalize">{activeEvent.status}</span>
          </div>
        )}
      </header>
      <main className="max-w-[650px] mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
