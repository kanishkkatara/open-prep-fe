const BASE = import.meta.env.VITE_API_URL;

export async function loginWithGoogle(id_token: string) {
  const res = await fetch(`${BASE}/api/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id_token }),
  });
  return res.json(); // { access_token, token_type }
}

export async function fetchCurrentUser(token: string) {
  const res = await fetch(`${BASE}/api/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}
