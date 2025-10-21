import { reqApi } from "@/lib";

export async function handleGetSubmissions({
  page = 1,
  limit = 10,
  search = "",
}) {
  return await reqApi(
    `/submissions?page=${page}&limit=${limit}&search=${search}`
  );
}
