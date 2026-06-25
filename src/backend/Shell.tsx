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
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans antialiased">
      <header className="sticky top-0 z-20 bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-4">
          <Link to="/backend" className="font-serif text-lg tracking-tight">
            Dinner Club <span className="text-neutral-400">· backend</span>
          </Link>
          <nav className="flex gap-1 ml-4 overflow-x-auto">
            {nav.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-md text-sm whitespace-nowrap ${
                    isActive
                      ? "bg-neutral-900 text-white"
                      : "text-neutral-600 hover:bg-neutral-100"
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
                className="text-sm bg-neutral-100 border border-neutral-200 rounded-md px-2 py-1.5"
              >
                {db.events.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.name} — {e.date}
                  </option>
                ))}
              </select>
            )}
            <span className="text-xs uppercase tracking-wider text-neutral-500">
              {role}
            </span>
            <button
              onClick={() => {
                logout();
                window.location.href = "/backend/login";
              }}
              className="text-sm text-neutral-600 hover:text-neutral-900"
            >
              Uitloggen
            </button>
          </div>
        </div>
        {activeEvent && (
          <div className="max-w-7xl mx-auto px-4 py-1.5 text-xs text-neutral-500 border-t border-neutral-100">
            Actief event: <span className="text-neutral-800 font-medium">{activeEvent.name}</span>
            <span className="mx-2">·</span>
            {activeEvent.date}
            <span className="mx-2">·</span>
            <span className="capitalize">{activeEvent.status}</span>
          </div>
        )}
      </header>
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
