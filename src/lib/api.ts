import { BasicSettings, DashboardData, NextQuestionResponse, NotificationSettings, Question } from "./types";

const BASE_URL = import.meta.env.VITE_API_URL;
function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

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
    context,
  }: {
    userId: string;
    message: string;
    chatType: "onboarding" | "tutoring";
    context?: object;
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
        context: context,
      }),
    });
  
    if (!res.ok) {
      throw new Error("Failed to send chat message");
    }
  
    return res.json(); // { reply: string, snippets_used?: string[] }
  }

  export async function fetchQuestions(limit = 100) {
    const res = await fetch(`${BASE_URL}/api/questions?limit=${limit}`);
    if (!res.ok) {
      const text = await res.text();
      console.error("Failed to fetch questions:", text);
      throw new Error("Failed to fetch questions");
    }
    return res.json();  // Question[]
  }

export async function submitAnswer(params: {
  user_id: string;
  question_id: string;
  selected_option: string;
  is_correct: boolean;
}): Promise<NextQuestionResponse> {
  const res = await fetch(`${BASE_URL}/api/questions/${params.question_id}/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error("Failed to submit answer");
  return res.json();
}

export async function fetchQuestionSummaries(params: {
  type?: string[];          // ← was `type?: string`
  tags?: string[];
  minDifficulty?: number;
  maxDifficulty?: number;
  page?: number;
  pageSize?: number;
}): Promise<Question[]> {
  const {
    type,
    tags,
    minDifficulty,
    maxDifficulty,
    page = 1,
    pageSize = 20,
  } = params;

  const skip = (page - 1) * pageSize;
  const qs = new URLSearchParams();

  if (type) type.forEach((t) => qs.append("type", t));
  if (tags) tags.forEach((t) => qs.append("tags", t));
  if (minDifficulty !== undefined)
    qs.set("minDifficulty", String(minDifficulty));
  if (maxDifficulty !== undefined)
    qs.set("maxDifficulty", String(maxDifficulty));

  qs.set("skip", skip.toString());
  qs.set("limit", pageSize.toString());

  const res = await fetch(`${BASE_URL}/api/questions?${qs.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch question summaries");
  return res.json();
}

export async function fetchQuestionById(id: string): Promise<Question> {
  const res = await fetch(`${BASE_URL}/api/questions/${id}`);
  if (!res.ok) {
    const txt = await res.text();
    console.error(`Failed to fetch question ${id}:`, txt);
    throw new Error(`Failed to fetch question ${id}`);
  }
  return res.json();
}

export async function getDashboard(): Promise<DashboardData> {
  const res = await fetch(`${BASE_URL}/api/dashboard`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Accept': 'application/json',
    },
  });
  if (!res.ok) throw new Error(`Failed to fetch dashboard: ${res.status}`);
  return res.json();
}

// Settings endpoints
export async function getBasicSettings(): Promise<BasicSettings> {
  const res = await fetch(`${BASE_URL}/api/settings/basic`, {
    credentials: "include",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Could not fetch basic settings");
  return res.json();
}

export async function updateBasicSettings(settings: BasicSettings) {
  const res = await fetch(`${BASE_URL}/api/settings/basic`, {
    method: "PUT",
    headers: getAuthHeaders(),
    credentials: "include",
    body: JSON.stringify(settings),
  });
  if (!res.ok) throw new Error("Could not update basic settings");
  return res.json();
}

export async function getNotificationSettings(): Promise<NotificationSettings> {
  const res = await fetch(`${BASE_URL}/api/settings/notifications`, {
    credentials: "include",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Could not fetch notification settings");
  return res.json();
}

export async function updateNotificationSettings(settings: NotificationSettings) {
  const res = await fetch(`${BASE_URL}/api/settings/notifications`, {
    method: "PUT",
    headers: getAuthHeaders(),
    credentials: "include",
    body: JSON.stringify(settings),
  });
  if (!res.ok) throw new Error("Could not update notification settings");
  return res.json();
}
