/* eslint-disable @typescript-eslint/no-explicit-any */

import axios, { AxiosError } from "axios";

type Json = Record<string, any>;

type ErrorResponse = {
  message?: string;
  error?: string;
};

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

// ---------- Axios helpers ----------

async function fetchDataGet<T = any>(url: string): Promise<T> {
  try {
    const response = await axios.get<T>(url, { withCredentials: true });
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
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
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
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
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
  const res = await fetch(url, {
    credentials: "include",
    ...options,
  });

  let result: any = null;

  try {
    result = await res.json();
  } catch {
    // non-JSON response, ignore
  }

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
