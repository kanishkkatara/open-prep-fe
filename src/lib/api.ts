const BASE_URL = import.meta.env.VITE_API_URL;

export async function loginWithGoogle(id_token: string) {
  const res = await fetch(`${BASE_URL}/api/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id_token }),
  });
  return res.json(); // { access_token, token_type }
}

export async function fetchCurrentUser(token: string) {
  const res = await fetch(`${BASE_URL}/api/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function sendChatMessage({
    userId,
    message,
    chatType,
  }: {
    userId: string;
    message: string;
    chatType: "onboarding" | "tutoring";
  }) {
    const res = await fetch(`${BASE_URL}/api/chat/message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-User-ID": userId.toString(),
      },
      body: JSON.stringify({
        message,
        chat_type: chatType,
      }),
    });
  
    if (!res.ok) {
      throw new Error("Failed to send chat message");
    }
  
    return res.json(); // { reply: string, snippets_used?: string[] }
  }