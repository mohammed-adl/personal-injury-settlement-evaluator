import { reqApi } from "@/lib";

export async function handleGetSubmissions() {
  return await reqApi(`/sumissions`);
}
