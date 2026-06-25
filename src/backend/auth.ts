// Mock auth voor de backend mockup. Wachtwoorden zijn hardcoded
// (dit is een frontend prototype, geen echte beveiliging).

export type Role = "admin" | "ober" | "bar";

const KEY = "dc_backend_session";

const PASSWORDS: Record<Role, string> = {
  admin: "admin",
  ober: "ober",
  bar: "bar",
};

export function login(role: Role, password: string): boolean {
  if (PASSWORDS[role] === password) {
    sessionStorage.setItem(KEY, role);
    return true;
  }
  return false;
}

export function logout() {
  sessionStorage.removeItem(KEY);
}

export function currentRole(): Role | null {
  if (typeof window === "undefined") return null;
  return (sessionStorage.getItem(KEY) as Role) || null;
}
