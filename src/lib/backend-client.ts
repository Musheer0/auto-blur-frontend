import createClient from "openapi-fetch";
import type { paths } from "@/types/blurfield-api";

export const blurapi = createClient<paths>({
  baseUrl: process.env.BACKEND_API_URL,
  headers: {
    "x-api-key": process.env.BACKEND_API_KEY,
  },
});