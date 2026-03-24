import axios from "axios";

const API_BASE_URL = process.env.BACKEND_URL
  ? `${process.env.BACKEND_URL}/api`
  : "http://localhost:5000/api";

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
  } catch (error: any) {
    if (error.response) {
      throw new Error(
        error.response.data?.message ||
          `API Error: ${error.response.status} ${error.response.statusText}`,
      );
    }
    throw new Error(`API Error: ${error.message}`);
  }
}
