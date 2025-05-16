// src/lib/api.ts

import {
  BasicSettings,
  DashboardData,
  NextQuestionResponse,
  NotificationSettings,
  Question,
  QuestionResponse,
  QuestionSummary,
  // new types for subscriptions
  Plan,
  Subscription,
  PaymentOrder,
} from "./types";

const BASE_URL = import.meta.env.VITE_API_URL as string;

// ─── Helpers ───────────────────────────────────────────────────────────────────

function getAccessToken() {
  return localStorage.getItem("access_token");
}

function getRefreshToken() {
  return localStorage.getItem("refresh_token");
}

function saveTokens({
  access_token,
  refresh_token,
}: {
  access_token: string;
  refresh_token?: string;
}) {
  localStorage.setItem("access_token", access_token);
  if (refresh_token) localStorage.setItem("refresh_token", refresh_token);
}

function getAuthHeaders() {
  const token = getAccessToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handleApiError(response: Response): Promise<never> {
  let errorMessage = `Request failed with status ${response.status}`;
  
  try {
    const errorData = await response.json();
    if (errorData.detail) {
      errorMessage = errorData.detail;
    }
    throw new Error(errorMessage);
  } catch {
    throw new Error(errorMessage);
  }
}

async function authFetch(
  input: RequestInfo,
  init: RequestInit = {},
  isRetry = false
): Promise<Response> {
  try {
    const res = await fetch(input, {
      ...init,
      headers: { ...(init.headers || {}), ...getAuthHeaders() },
      credentials: init.credentials,
    });

    if (!res.ok && res.status !== 401) {
      return handleApiError(res);
    }

    if (res.status === 401) {
      if (isRetry) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/auth/login";
        throw new Error("Session expired");
      }

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
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/auth/login";
        throw new Error("Refresh failed");
      }

      const newTokens = (await refreshRes.json()) as {
        access_token: string;
        refresh_token?: string;
      };
      saveTokens(newTokens);

      return authFetch(input, init, true);
    }

    return res;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw error;
  }
}

// ─── Public API ────────────────────────────────────────────────────────────────

export async function loginWithGoogle(id_token: string) {
  const res = await fetch(`${BASE_URL}/api/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id_token }),
  });
  if (!res.ok) throw new Error(`Login failed: ${await res.text()}`);
  const data = (await res.json()) as {
    access_token: string;
    refresh_token: string;
  };
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
  return res.json();
}

export async function submitAnswer(
  questionId: string,
  params: {
    user_id: string;
    selected_options: any;
    is_correct: boolean;
    time_taken: number;
  }
): Promise<NextQuestionResponse> {
  const res = await authFetch(
    `${BASE_URL}/api/questions/${questionId}/submit`,
    {
      method: "POST",
      body: JSON.stringify(params),
    }
  );
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
    progress_filter,
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
  return res.json();
}

export async function fetchQuestionById(
  questionId: string
): Promise<QuestionResponse> {
  const url = new URL(`${BASE_URL}/api/questions/${questionId}`);
  const res = await authFetch(url.toString());
  return res.json();
}

export async function getDashboard(): Promise<DashboardData> {
  const res = await authFetch(`${BASE_URL}/api/dashboard`);
  return res.json();
}

export async function getBasicSettings(): Promise<BasicSettings> {
  const res = await authFetch(`${BASE_URL}/api/settings/basic`, {
    credentials: "include",
  });
  return res.json();
}

export async function updateBasicSettings(
  settings: BasicSettings
): Promise<BasicSettings> {
  const res = await authFetch(`${BASE_URL}/api/settings/basic`, {
    method: "PUT",
    credentials: "include",
    body: JSON.stringify(settings),
  });
  return res.json();
}

export async function getNotificationSettings(): Promise<NotificationSettings> {
  const res = await authFetch(`${BASE_URL}/api/settings/notifications`, {
    credentials: "include",
  });
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
  return res.json();
}

export async function fetchQuestionRaw(
  questionId: string
): Promise<Record<string, any>> {
  const res = await authFetch(
    `${BASE_URL}/api/questions/update/${questionId}`
  );
  return res.json();
}

export async function updateQuestionRaw(
  questionId: string,
  payload: Record<string, any>
): Promise<Record<string, any>> {
  const res = await authFetch(
    `${BASE_URL}/api/questions/update/${questionId}`,
    {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    }
  );
  return res.json();
}

// ─── New Subscription & Payment APIs ────────────────────────────────────────

/**
 * Fetch available pricing plans.
 */
export async function fetchPlans(): Promise<Plan[]> {
  const res = await authFetch(`${BASE_URL}/api/billing/plans`);
  return res.json();
}

/**
 * Start a 5-day free trial for the current user.
 */
export async function startFreeTrial(): Promise<Subscription> {
  const res = await authFetch(`${BASE_URL}/api/billing/trial`, {
    method: "POST",
  });
  return res.json();
}

/**
 * Create a payment order for the chosen plan.
 * Returns a PaymentOrder containing Razorpay order_id, amount, etc.
 */
export async function createOrder(
  planId: string
): Promise<PaymentOrder> {
  const res = await authFetch(
    `${BASE_URL}/api/billing/create_order`,
    {
      method: "POST",
      body: JSON.stringify({ plan_id: planId }),
    }
  );
  return res.json();
}

/**
 * Fetch the current user’s subscription status.
 */
export async function fetchMySubscription(): Promise<Subscription> {
  const res = await authFetch(`${BASE_URL}/api/billing/me`);
  return res.json();
}
