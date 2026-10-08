import axios from "axios";
import * as FileSystem from "expo-file-system";

// Progress photos go to a separate upload service.
const uploadsClient = axios.create({ baseURL: process.env.EXPO_PUBLIC_UPLOADS_URL, timeout: 60_000 });

export async function uploadProgressPhoto(uri: string) {
  const info = await FileSystem.getInfoAsync(uri);
  if (!info.exists) throw new Error("Photo not found");
  const form = new FormData();
  form.append("photo", { uri, name: "progress.jpg", type: "image/jpeg" } as unknown as Blob);
  const { data } = await uploadsClient.post<{ url: string }>("/photos", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.url;
}
