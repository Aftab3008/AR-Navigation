import axios from "axios";

const API_BASE_URL = process.env.BACKEND_URL
  ? `${process.env.BACKEND_URL}/api`
  : "http://localhost:3000/api";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  try {
    let data;
    if (options?.body) {
      if (typeof options.body === "string") {
        data = JSON.parse(options.body);
      } else {
        data = options.body;
      }
    }

    const response = await apiClient.request<T>({
      url: endpoint,
      method: options?.method || "GET",
      data: data,
      headers: options?.headers as Record<string, string>,
    });

    return response.data;
  } catch (error) {
    if (error && typeof error === "object" && "response" in error) {
      const err = error as any;
      throw new Error(
        err.response?.data?.message ||
          `API Error: ${err.response?.status} ${err.response?.statusText}`,
      );
    }
    if (error instanceof Error) {
      throw new Error(`API Error: ${error.message}`);
    }
    throw new Error(`API Error: An unexpected error occurred`);
  }
}
