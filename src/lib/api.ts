// src/lib/api.ts

import {
  BasicSettings,
  DashboardData,
  NextQuestionResponse,
  NotificationSettings,
  Question,
  QuestionResponse,
  QuestionSummary,
} from "./types";

const BASE_URL = import.meta.env.VITE_API_URL as string;

// ─── Helpers ───────────────────────────────────────────────────────────────────

/** Grab the current access token */
function getAccessToken() {
  return localStorage.getItem("access_token");
}
/** Grab the refresh token */
function getRefreshToken() {
  return localStorage.getItem("refresh_token");
}
/** Save new tokens */
function saveTokens({ access_token, refresh_token }: { access_token: string; refresh_token?: string }) {
  localStorage.setItem("access_token", access_token);
  if (refresh_token) localStorage.setItem("refresh_token", refresh_token);
}

/** Build headers with JSON + Bearer */
function getAuthHeaders() {
  const token = getAccessToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

/**
 * Universal fetch wrapper that:
 *  1️⃣ Injects Bearer header
 *  2️⃣ On 401: attempts /users/refresh using refresh_token
 *  3️⃣ Retries original request once if refresh succeeds
 *  4️⃣ Otherwise clears tokens + redirects to login
 */
async function authFetch(input: RequestInfo, init: RequestInit = {}, isRetry = false): Promise<Response> {
  const res = await fetch(input, {
    ...init,
    headers: { ...(init.headers || {}), ...getAuthHeaders() },
    credentials: init.credentials, // preserve if using cookies
  });

  if (res.status !== 401) {
    return res;
  }

  // if already retried once, give up
  if (isRetry) {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    window.location.href = "/auth/login";
    throw new Error("Session expired");
  }

  // attempt token refresh
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    localStorage.removeItem("access_token");
    window.location.href = "/auth/login";
    throw new Error("No refresh token");
  }

  const refreshRes = await fetch(`${BASE_URL}/api/users/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  if (!refreshRes.ok) {
    // refresh failed → logout
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    window.location.href = "/auth/login";
    throw new Error("Refresh failed");
  }

  const newTokens = await refreshRes.json() as { access_token: string; refresh_token?: string };
  saveTokens(newTokens);

  // retry original request with new token
  return authFetch(input, init, /* isRetry: */ true);
}

// ─── Public API ────────────────────────────────────────────────────────────────

/** Login via Google; server must return {access_token, refresh_token} */
export async function loginWithGoogle(id_token: string) {
  const res = await fetch(`${BASE_URL}/api/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id_token }),
  });
  if (!res.ok) throw new Error(`Login failed: ${await res.text()}`);
  const data = await res.json() as { access_token: string; refresh_token: string };
  saveTokens(data);
  return data;
}

export async function fetchCurrentUser() {
  const res = await authFetch(`${BASE_URL}/api/users/me`);
  return res.json();
}

export async function sendChatMessage(params: {
  userId: string;
  message: string;
  chatType: "onboarding" | "tutoring";
  context?: object;
}) {
  const { userId, message, chatType, context } = params;
  const res = await authFetch(`${BASE_URL}/api/chat/message`, {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
      "X-User-ID": userId,
    },
    body: JSON.stringify({ message, chat_type: chatType, context }),
  });
  if (!res.ok) throw new Error("Failed to send chat message");
  return res.json();
}

export async function fetchQuestions(limit = 100): Promise<Question[]> {
  const res = await authFetch(`${BASE_URL}/api/questions?limit=${limit}`);
  if (!res.ok) throw new Error(`Failed to fetch questions: ${res.status}`);
  return res.json();
}

export async function submitAnswer(params: {
  user_id: string;
  question_id: string;
  selected_option: string;
  is_correct: boolean;
  time_taken: number;
}): Promise<NextQuestionResponse> {
  const res = await authFetch(`${BASE_URL}/api/questions/${params.question_id}/submit`, {
    method: "POST",
    body: JSON.stringify(params),
  });

  if (!res.ok) throw new Error("Failed to submit answer");
  return res.json();
}

export async function fetchQuestionSummaries(params: {
  type?: string[];
  tags?: string[];
  minDifficulty?: number;
  maxDifficulty?: number;
  page?: number;
  pageSize?: number;
  progress_filter?: string;
}): Promise<QuestionSummary[]> {
  const {
    type,
    tags,
    minDifficulty,
    maxDifficulty,
    page = 1,
    pageSize = 20,
    progress_filter
  } = params;

  const skip = (page - 1) * pageSize;
  const qs = new URLSearchParams();

  type?.forEach((t) => qs.append("type", t));
  tags?.forEach((t) => qs.append("tags", t));
  if (minDifficulty != null) qs.set("minDifficulty", String(minDifficulty));
  if (maxDifficulty != null) qs.set("maxDifficulty", String(maxDifficulty));
  qs.set("skip", skip.toString());
  qs.set("limit", pageSize.toString());

  if (progress_filter) qs.set("progress_filter", progress_filter);

  const res = await authFetch(`${BASE_URL}/api/questions?${qs}`);
  if (!res.ok) throw new Error("Failed to fetch question summaries");

  return res.json();
}


export async function fetchQuestionById(
  questionId: string
): Promise<QuestionResponse> {
  const url = new URL(`${BASE_URL}/api/questions/${questionId}`);

  const res = await authFetch(url.toString());

  if (!res.ok) throw new Error(`Failed to fetch question ${questionId}`);
  return res.json();
}


export async function getDashboard(): Promise<DashboardData> {
  const res = await authFetch(`${BASE_URL}/api/dashboard`);
  if (!res.ok) throw new Error(`Failed to fetch dashboard: ${res.status}`);
  return res.json();
}

export async function getBasicSettings(): Promise<BasicSettings> {
  const res = await authFetch(`${BASE_URL}/api/settings/basic`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Could not fetch basic settings");
  return res.json();
}

export async function updateBasicSettings(settings: BasicSettings): Promise<BasicSettings> {
  const res = await authFetch(`${BASE_URL}/api/settings/basic`, {
    method: "PUT",
    credentials: "include",
    body: JSON.stringify(settings),
  });
  if (!res.ok) throw new Error("Could not update basic settings");
  return res.json();
}

export async function getNotificationSettings(): Promise<NotificationSettings> {
  const res = await authFetch(`${BASE_URL}/api/settings/notifications`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Could not fetch notification settings");
  return res.json();
}

export async function updateNotificationSettings(
  settings: NotificationSettings
): Promise<NotificationSettings> {
  const res = await authFetch(`${BASE_URL}/api/settings/notifications`, {
    method: "PUT",
    credentials: "include",
    body: JSON.stringify(settings),
  });
  if (!res.ok) throw new Error("Could not update notification settings");
  return res.json();
}

export async function updateQuestionIsDeleted(
  questionId: string,
  is_deleted: boolean
): Promise<QuestionResponse> {
  const res = await authFetch(
    `${BASE_URL}/api/questions/${questionId}/isdeleted`,
    {
      method: "PATCH",
      body: JSON.stringify({ is_deleted }),
    }
  );
  if (!res.ok) {
    throw new Error(`Failed to update isdeleted: ${res.status}`);
  }
  return res.json();
}
