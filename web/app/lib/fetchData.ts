/* eslint-disable @typescript-eslint/no-explicit-any */

import axios, { AxiosError } from "axios";

type Json = Record<string, any>;

type ErrorResponse = {
  message?: string;
  error?: string;
};

const AUTH_HEADER_MODE: "bearer" | "raw" | "x-token" = "bearer";

function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("authToken");
}

function buildAuthHeaders(extra?: Record<string, string>) {
  const token = getAuthToken();

  const headers: Record<string, string> = {
    ...(extra || {}),
  };

  if (token) {
    if (AUTH_HEADER_MODE === "bearer") {
      headers.Authorization = `Bearer ${token}`;
    } else if (AUTH_HEADER_MODE === "raw") {
      headers.Authorization = token;
    } else if (AUTH_HEADER_MODE === "x-token") {
      headers["x-access-token"] = token;
    }

    if (!(window as any).__authHeaderLogged) {
      // console.log("Auth token in headers:", {
      //   mode: AUTH_HEADER_MODE,
      //   tokenPreview: token.slice(0, 12) + "...",
      //   headers,
      // });
      (window as any).__authHeaderLogged = true;
    }
  }

  return headers;
}

function handleAxiosError(error: unknown): never {
  const err = error as AxiosError<ErrorResponse>;
  const message =
    err?.response?.data?.message ||
    err?.response?.data?.error ||
    err.message ||
    "Unknown error";

  console.error("Fetch Error:", message);
  throw new Error(message);
}

async function fetchDataGet<T = any>(url: string): Promise<T> {
  try {
    const response = await axios.get<T>(url, {
      withCredentials: true,
      headers: buildAuthHeaders(),
    });
    return response.data;
  } catch (e) {
    handleAxiosError(e);
  }
}

async function fetchDataPost<T = any, B extends Json = Json>(
  url: string,
  data?: B
): Promise<T> {
  try {
    const response = await axios.post<T>(url, data, {
      withCredentials: true,
      headers: buildAuthHeaders({ "Content-Type": "application/json" }),
    });
    return response.data;
  } catch (e) {
    handleAxiosError(e);
  }
}

async function fetchDataPatch<T = any, B extends Json = Json>(
  url: string,
  data?: B
): Promise<T> {
  try {
    const response = await axios.patch<T>(url, data, {
      withCredentials: true,
      headers: buildAuthHeaders({ "Content-Type": "application/json" }),
    });
    return response.data;
  } catch (e) {
    handleAxiosError(e);
  }
}

async function fetchDataDelete<T = any>(url: string): Promise<T> {
  try {
    const response = await axios.delete<T>(url, {
      withCredentials: true,
      headers: buildAuthHeaders(),
    });
    return response.data;
  } catch (e) {
    handleAxiosError(e);
  }
}

// ---------- Native fetch with error normalization ----------

async function fetchWithError<T = any>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = buildAuthHeaders(
    (options.headers as Record<string, string>) || {}
  );

  const res = await fetch(url, {
    credentials: "include",
    ...options,
    headers,
  });

  let result: any = null;

  try {
    result = await res.json();
  } catch {}

  if (!res.ok) {
    const message = result?.message || result?.error || "Unknown error";
    throw new Error(message);
  }

  return result as T;
}

export {
  fetchDataGet,
  fetchDataPost,
  fetchDataPatch,
  fetchDataDelete,
  fetchWithError,
};
