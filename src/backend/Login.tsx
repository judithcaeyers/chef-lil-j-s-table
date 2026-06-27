import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { currentRole, login, type Role } from "./auth";

const roles: { role: Role; label: string; hint: string; target: string }[] = [
  { role: "admin", label: "Admin", hint: "Events, reservaties & drankkaart", target: "/backend/admin/events" },
  { role: "ober", label: "Ober", hint: "Tafels & bestellingen", target: "/backend/service/tables" },
  { role: "bar", label: "Bar", hint: "Inkomende bestellingen", target: "/backend/bar" },
];

export default function Login() {
  const existing = currentRole();
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>("admin");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const prev = document.documentElement.style.backgroundColor;
    document.documentElement.style.backgroundColor = "hsl(28 22% 13%)";
    return () => { document.documentElement.style.backgroundColor = prev; };
  }, []);

  if (existing) {
    const t = roles.find((r) => r.role === existing)?.target ?? "/backend";
    return <Navigate to={t} replace />;
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(role, password)) {
      const t = roles.find((r) => r.role === role)!.target;
      navigate(t, { replace: true });
    } else {
      setError("Onjuist wachtwoord");
    }
  };

  return (
    <div
      className="min-h-screen bg-background flex items-center justify-center px-4 font-body"
      style={{
        ['--background' as any]: '28 22% 17%',
        ['--foreground' as any]: '38 30% 90%',
        ['--border' as any]: '38 30% 90% / 0.18',
        ['--ring' as any]: '38 30% 90%',
      }}
    >
      <div className="w-full max-w-sm border border-foreground p-8 bg-background/50">
        <h1 className="font-display text-5xl text-center mb-1 text-foreground" style={{ WebkitTextStroke: '0.5px currentColor' }}>
          Dinner Club
        </h1>
        <p className="text-sm text-center text-foreground mb-8">Backend login</p>

        <div className="grid grid-cols-3 gap-2 mb-5">
          {roles.map((r) => (
            <button
              key={r.role}
              type="button"
              onClick={() => setRole(r.role)}
              className={`text-xs py-2 border transition-colors ${
                role === r.role
                  ? "bg-foreground text-background border-foreground"
                  : "bg-transparent text-foreground border-foreground hover:bg-foreground/10"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-center text-foreground mb-4">
          {roles.find((r) => r.role === role)?.hint}
        </p>

        <form onSubmit={onSubmit} className="space-y-3">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Wachtwoord"
            autoFocus
            className="w-full px-3 py-2 border border-foreground bg-transparent text-sm text-foreground placeholder:text-foreground/70 focus:outline-none focus:border-foreground"
          />
          {error && <p className="text-xs text-red-400">{error}</p>}
          <button
            type="submit"
            className="w-full border border-foreground bg-foreground text-background py-2 text-sm tracking-[1px] hover:bg-[hsl(24_75%_78%)] hover:border-[hsl(24_75%_78%)] hover:text-foreground transition-colors"
          >
            Inloggen
          </button>
        </form>

        <p className="mt-6 text-[11px] text-foreground leading-relaxed text-center">
          Demo-wachtwoorden: <code>admin</code> / <code>ober</code> / <code>bar</code>
          <br />Dit is een frontend-mockup zonder echte beveiliging.
        </p>
      </div>
    </div>
  );
}
