import axios from "axios";
import { ApiError } from "@/utils";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

const api = axios.create({
  withCredentials: true,
  baseURL: API_URL,
});

export async function reqApi(url, options = {}) {
  const isMultipart = options.body instanceof FormData;

  const axiosConfig = {
    url,
    method: options.method || "get",
    headers: {
      ...(isMultipart ? {} : { "Content-Type": "application/json" }),
      ...(options.headers || {}),
    },
    data: options.body || undefined,
    params: options.params || undefined,
    withCredentials: true,
  };

  try {
    const response = await api(axiosConfig);
    return response.data;
  } catch (err) {
    if (err.response) {
      throw new ApiError(err.response.data.message, err.response.status);
    }
    throw new ApiError("Something went wrong.", 500);
  }
}
