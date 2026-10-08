import * as FileSystem from "expo-file-system";
import { api } from "./client";

// Uploads go through the same pinned client (the API proxies to storage).
export async function uploadProgressPhoto(uri: string) {
  const info = await FileSystem.getInfoAsync(uri);
  if (!info.exists) throw new Error("Photo not found");
  const form = new FormData();
  form.append("photo", { uri, name: "progress.jpg", type: "image/jpeg" } as unknown as Blob);
  const { data } = await api.post<{ url: string }>("/photos", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.url;
}
