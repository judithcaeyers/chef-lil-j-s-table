import { useEffect } from "react";
import { Link, NavLink, Navigate, Outlet, useLocation } from "react-router-dom";
import { currentRole, logout, type Role } from "./auth";
import { useStore, store } from "./store";

function useBackendHtmlBg() {
  useEffect(() => {
    const prev = document.documentElement.style.backgroundColor;
    document.documentElement.style.backgroundColor = "hsl(28 22% 13%)";
    return () => { document.documentElement.style.backgroundColor = prev; };
  }, []);
}

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
  useBackendHtmlBg();
  const role = currentRole();
  const db = useStore();
  if (!role) return <Navigate to="/backend/login" replace />;

  const activeEvent = db.events.find((e) => e.id === db.activeEventId) || db.events[0];
  const nav = navByRole[role];

  return (
    <div
      className="min-h-screen bg-background text-foreground antialiased font-body"
      style={{
        // dark-brown / cream palette scoped to backend
        ['--background' as any]: '28 22% 17%',
        ['--foreground' as any]: '38 30% 90%',
        ['--card' as any]: '28 22% 17%',
        ['--popover' as any]: '28 22% 20%',
        ['--border' as any]: '38 30% 90% / 0.18',
        ['--input' as any]: '38 30% 90% / 0.18',
        ['--ring' as any]: '38 30% 90%',
        ['--muted' as any]: '28 18% 24%',
      }}
    >
      <header className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-foreground/10">
        <div className="max-w-[700px] mx-auto px-3 py-2 flex items-center gap-2">
          <Link to="/backend" className="font-display text-2xl leading-none" style={{ WebkitTextStroke: '0.5px currentColor' }}>
            Dinner Club
          </Link>
          <span className="text-[10px] uppercase tracking-[2px] text-foreground/50 ml-auto">{role}</span>
        </div>
        <div className="max-w-[700px] mx-auto px-3 pb-2 flex items-center gap-2">
          {db.events.length > 0 && (
            <select
              value={db.activeEventId ?? ""}
              onChange={(e) => store.setActiveEvent(e.target.value)}
              className="flex-1 text-sm bg-transparent border border-foreground/15 rounded-md px-2 py-1.5 font-body focus:outline-none focus:border-foreground/50"
            >
              {db.events.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name}
                </option>
              ))}
            </select>
          )}
          <button
            onClick={() => {
              logout();
              window.location.href = "/backend/login";
            }}
            className="text-sm text-foreground/60 hover:text-foreground underline underline-offset-4 px-1"
          >
            Uit
          </button>
        </div>
        <nav className="max-w-[700px] mx-auto px-2 pb-2 flex gap-1 overflow-x-auto">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm whitespace-nowrap font-body transition-colors ${
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
      </header>
      <main className="max-w-[700px] mx-auto px-3 py-4">
        <Outlet />
      </main>
    </div>
  );
}

