/**
 * API Client - Wrapper für Backend-Kommunikation
 * 
 * Features:
 * - Automatische Header für Rolle und User-ID
 * - Typisierte Responses
 * - Error-Handling
 */

const API_BASE_URL = "http://localhost:3000";

interface FetchOptions extends RequestInit {
    role?: string;
    userId?: string;
}

export async function apiFetch<T>(
    endpoint: string,
    options: FetchOptions = {}
): Promise<T> {
    const { role = "user", userId, ...fetchOptions } = options;

    const headers: HeadersInit = {
        "Content-Type": "application/json",
        "X-Role": role,
        ...(userId && { "X-User-Id": userId }),
        ...fetchOptions.headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...fetchOptions,
        headers,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP ${response.status}`);
    }

    // Für DELETE Requests ohne Response Body
    if (response.status === 204) {
        return {} as T;
    }

    return response.json();
}

// API Endpoints
export const api = {
    // Users
    users: {
        getAll: (role: string) => apiFetch<unknown[]>("/users", { role }),
        getOne: (id: string, role: string) => apiFetch<unknown>(`/users/${id}`, { role }),
        create: (data: unknown, role: string) =>
            apiFetch<unknown>("/users", { method: "POST", body: JSON.stringify(data), role }),
        update: (id: string, data: unknown, role: string) =>
            apiFetch<unknown>(`/users/${id}`, { method: "PATCH", body: JSON.stringify(data), role }),
        delete: (id: string, role: string) =>
            apiFetch<void>(`/users/${id}`, { method: "DELETE", role }),
    },

    // Subscriptions
    subscriptions: {
        getAll: (role: string, userId?: string) =>
            apiFetch<unknown[]>("/subscriptions", { role, userId }),
        getOne: (id: string, role: string, userId?: string) =>
            apiFetch<unknown>(`/subscriptions/${id}`, { role, userId }),
        create: (data: unknown) =>
            apiFetch<unknown>("/subscriptions", { method: "POST", body: JSON.stringify(data) }),
        update: (id: string, data: unknown, role: string, userId?: string) =>
            apiFetch<unknown>(`/subscriptions/${id}`, {
                method: "PATCH",
                body: JSON.stringify(data),
                role,
                userId,
            }),
        delete: (id: string, role: string, userId?: string) =>
            apiFetch<void>(`/subscriptions/${id}`, { method: "DELETE", role, userId }),
    },

    // Categories
    categories: {
        getAll: () => apiFetch<unknown[]>("/categories"),
        getOne: (id: string) => apiFetch<unknown>(`/categories/${id}`),
        create: (data: unknown, role: string) =>
            apiFetch<unknown>("/categories", { method: "POST", body: JSON.stringify(data), role }),
        seed: (role: string) =>
            apiFetch<void>("/categories/seed", { method: "POST", role }),
    },

    // Reminders
    reminders: {
        getAll: (subscriptionId?: string) =>
            apiFetch<unknown[]>(`/reminders${subscriptionId ? `?subscriptionId=${subscriptionId}` : ""}`),
        getDue: (date?: string) =>
            apiFetch<unknown[]>(`/reminders/due${date ? `?date=${date}` : ""}`),
        create: (data: unknown) =>
            apiFetch<unknown>("/reminders", { method: "POST", body: JSON.stringify(data) }),
        update: (id: string, data: unknown) =>
            apiFetch<unknown>(`/reminders/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
        delete: (id: string) =>
            apiFetch<void>(`/reminders/${id}`, { method: "DELETE" }),
    },

    // Actions
    actions: {
        getCostAnalysis: (userId: string, householdSize?: number) =>
            apiFetch<unknown>(
                `/actions/cost-analysis?userId=${userId}${householdSize ? `&householdSize=${householdSize}` : ""}`
                , { method: "POST" }),
        shareSubscription: (id: string, targetUserIds: string[], role: string, userId?: string) =>
            apiFetch<unknown>(`/actions/share/${id}`, {
                method: "POST",
                body: JSON.stringify({ targetUserIds }),
                role,
                userId,
            }),
        cancelReminders: (subscriptionId: string) =>
            apiFetch<unknown>("/actions/cancel-reminders", {
                method: "POST",
                body: JSON.stringify({ subscriptionId }),
            }),
    },

    // Jobs
    jobs: {
        startExport: (userId: string, role: string) =>
            apiFetch<unknown>("/jobs/export-subscriptions", {
                method: "POST",
                body: JSON.stringify({ userId }),
                role,
            }),
        startReminderCheck: (role: string, userId?: string) =>
            apiFetch<unknown>("/jobs/check-reminders", { method: "POST", role, userId }),
        getStatus: (jobId: string) => apiFetch<unknown>(`/jobs/${jobId}/status`),
        getByUser: (userId: string) => apiFetch<unknown[]>(`/jobs/user/${userId}`),
    },
};
