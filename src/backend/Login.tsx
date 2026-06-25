import { useState } from "react";
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
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4 font-sans">
      <div className="w-full max-w-sm bg-white rounded-xl border border-neutral-200 p-8 shadow-sm">
        <h1 className="font-serif text-2xl mb-1">Dinner Club</h1>
        <p className="text-sm text-neutral-500 mb-6">Backend login</p>

        <div className="grid grid-cols-3 gap-2 mb-5">
          {roles.map((r) => (
            <button
              key={r.role}
              type="button"
              onClick={() => setRole(r.role)}
              className={`text-xs py-2 rounded-md border transition ${
                role === r.role
                  ? "bg-neutral-900 text-white border-neutral-900"
                  : "bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-neutral-500 mb-4">
          {roles.find((r) => r.role === role)?.hint}
        </p>

        <form onSubmit={onSubmit} className="space-y-3">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Wachtwoord"
            autoFocus
            className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:border-neutral-900"
          />
          {error && <p className="text-xs text-red-600">{error}</p>}
          <button
            type="submit"
            className="w-full bg-neutral-900 text-white py-2 rounded-md text-sm hover:bg-neutral-700"
          >
            Inloggen
          </button>
        </form>

        <p className="mt-6 text-[11px] text-neutral-400 leading-relaxed">
          Demo-wachtwoorden: <code>admin</code> / <code>ober</code> / <code>bar</code>
          <br />Dit is een frontend-mockup zonder echte beveiliging.
        </p>
      </div>
    </div>
  );
}
