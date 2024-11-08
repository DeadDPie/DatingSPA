import { api } from "../constants/api";
import { useAuthStore } from "../stores/auth";

export async function refreshAccessToken() {
  const authStore = useAuthStore();
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) return;

  try {
    const formData = new FormData();
    formData.append("refresh_token", refreshToken);
    const response = await fetch(`${api}token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: refreshToken }),
      //body: formData,
    });
    if (response.ok) {
      const data = await response.json();
      console.log("Ответ сервера:", data);

      authStore.setTokens({
        accessToken: data.access,
      });
      return data.access;
    } else {
      throw new Error("Не удалось обновить токен");
    }
  } catch (error) {
    console.error("Ошибка обновления токена доступа:", error);
  }
}

export function scheduleTokenRefresh(expiryTime) {
  const timeout = expiryTime - 60;
  setTimeout(async () => {
    const newToken = await refreshAccessToken();
    if (newToken) {
      const newExpiryTime =
        JSON.parse(atob(newToken.split(".")[1])).exp -
        JSON.parse(atob(newToken.split(".")[1])).iat;
      scheduleTokenRefresh(newExpiryTime);
    }
  }, timeout);
}
